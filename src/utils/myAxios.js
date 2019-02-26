import axios from 'axios'
import protoRoot from '@/proto/proto'
import protobuf from 'protobufjs'

const httpService = axios.create({
    timeout: 45000,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        // 'Content-Type': 'application/octet-stream',
        'Content-Type': 'application/x-protobuf',
        'Accept': 'application/x-protobuf'
    },
    responseType: 'arraybuffer'
})

// 添加请求拦截器
httpService.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    return Promise.reject(error);
});

// 添加响应拦截器
httpService.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    return Promise.reject(error);
});

function isArrayBuffer(obj) {
    return Object.prototype.toString.call(obj) === '[object ArrayBuffer]'
}


function transformResponseFactory(rawResponse, PBMessageResponse) {
    // 判断response是否是arrayBuffer
    if (rawResponse == null || !isArrayBuffer(rawResponse)) {
        return rawResponse
    }

    const buf = protobuf.util.newBuffer(rawResponse)
    // decode响应体
    const decodedResponse = PBMessageResponse.decode(buf)
    return decodedResponse
}

/**
 * 
 * @param {*} type 请求类型
 * @param {*} url 请求地址
 * @param {*} requestBody 请求体参数
 * @param {*} PBMessageReq 请求体message
 * @param {*} PBMessageRes 响应体的message
 */
function request(type, url, req, PBMessageRes) {
    // 将对象序列化成请求体实例
    const PBMessageResMessage = protoRoot.lookup('com.ccb.cloud.protobuf.proto.ProtoResponse');
    return new Promise((resolve, reject) => {
        httpService[type](url, req).then(res => {
            //根据 ProtoResponse 解出来 responseHeader 和 responseBody
            let ProtoResponse = transformResponseFactory(res.data, PBMessageResMessage);
            res.headers = ProtoResponse.responseHeader;
            const responseBody = ProtoResponse.responseBody;
            if (responseBody && PBMessageRes) {
                const PBMessageResponse = protoRoot.lookup(PBMessageRes);
                let value = responseBody.ENTITY.value;
                try {
                    // 根据传入的 PBres 解出来响应体的内容
                    res.data = transformResponseFactory(value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength), PBMessageResponse);
                } catch (err) {
                    res.data = responseBody
                }
            }
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })

}

// 在request下添加一个方法，方便用于处理请求参数
request.create = function (protoName, obj) {
    const pbConstruct = protoRoot.lookup(protoName)
    if (!obj) return ''
    let req = obj && pbConstruct.create(obj);
    req = pbConstruct.encode(req).finish()
    return req.buffer.slice(req.byteOffset, req.byteOffset + req.byteLength)
}

/**
 * 
 * @param {*} url 请求地址
 * @param {*} method 请求类型
 * @param {*} data 请求参数
 * @param {*} PBreq 请求体message
 * @param {*} PBres 响应体的message
 */

export const $axios = function ({url, method, data, PBreq, PBres}) {
    let req = null;
    if (data && JSON.stringify(data) !== '{}' && PBreq) {
        req = request.create(PBreq, data); //对请求参数做处理，得到一个 arrayBuffer
    }
    return request(method.toLowerCase(), url, req, PBres)
}

/**
 * 解析Unit8Array
 * @param {*} value Unit8Array
 * @param {*} PBMsg 
 */
export const $myDecode = function (value, PBMsg) {
    if (Object.prototype.toString.call(value) !== '[object Uint8Array]') return value
    const PBMessage = protoRoot.lookup(PBMsg);
    try {
        return transformResponseFactory(value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength), PBMessage)
    } catch (err) {
        return err
    }
}