import {
    $http
} from '@/utils/http'
import {
    productMaintenance
} from '@/api'
//检测用户登录状态
export const checkUserIsLogin = () => {
    return new Promise((resolve, reject) => {
        if (!sessionStorage.isLogin) reject()
        $http.post('/iequip/v1/portal/accounts/isLogin')
            .then(res => {
                if (res.data) {
                    resolve()
                } else {
                    reject()
                }
            })
            .catch(err => {
                reject(err)
            })
    })
}

//获取产品类型
export const getPdTp = async (type, params) => {
    const res = await $http({
        method: 'post',
        url: productMaintenance.queryType(type),
        data: params
    })
    if (res.status !== 200) throw res.statusText
    const {
        data
    } = res.data
    return formatData(data)
}

//过滤产品类型数据
function formatData(data) {
    return isArray(data) && data.map(item => {
        const obj = {
            label: item.tpName,
            id: item.tpId,
            checked: false,
            children: null
        }
        if (item.childsTps[0]) {
            obj.children = formatData(item.childsTps)
        }
        return obj
    }) || []
}

function isArray(data) {
    return Object.prototype.toString.call(data) === '[object Array]'
}

//自定义上传方法
export const myUpload = (content, url) => {
    const formData = new FormData();
    formData.append('file', content.file);
    formData.append('fileName', new Date().getTime() + content.file.name)
    return $http({
        method: 'post',
        url,
        data: formData
    })
}