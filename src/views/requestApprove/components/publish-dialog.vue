<template>
    <div class="content">
        <div class="main">
            <div class="sbjNm">
                <span>{{data.appNm}}</span>
                <span :class="data.verSt == '1' ? 'blue' 
                    : data.verSt == '2' ? 'red'
                    : 'green'">{{data.verSt | verStFilter}}</span>
            </div>
            <div class="entNm">
                <img src="../../../assets/images/u290.png" alt="">
                <span>{{data.acctId}}</span>
                <span>{{data.lclCrtTms | filterTime}}</span>
            </div>
            <p style="border-left: 4px solid #228CDF; text-indent: 3px;">基本信息</p>
            <ul class="base-info-list">
                <li><span>机构名称</span><span>{{data.insNm}}</span></li>
                <li><span>项目名称</span><span>{{data.appNm}}</span></li>
                <li><span>项目LOGO</span><span>{{data.appLogoSrc}}</span></li>
                <li><span>项目类型</span><span>{{data.appTp | appTpFilter}}</span></li>
                <li><span>项目简介</span><span>{{data.appBrf}}</span></li>
                <li><span>版本描述</span><span>{{data.verDesc}}</span></li>
                <li><span>版本状态</span><span>{{data.verSt | verStFilter}}</span></li>
                <li v-if="data.verStDesc"><span>拒绝理由</span><span>{{data.verStDesc}}</span></li>
                <li><span>版本号</span><span>{{data.version}}</span></li>
                <li v-if="data.appStDesc"><span>冻结理由</span><span>{{data.appStDesc}}</span></li>
                <li><span>本次上传的代码包</span><span>{{data.codeSrc}}</span></li>
                <li><span></span><span class="down" @click="downloadCode(data.codeSrc)">代码包下载</span></li>
            </ul>
            <!-- <p style="border-left: 4px solid #228CDF; text-indent: 3px; margin: 10px 0 20px">处理进度</p> -->
            <!-- <div class="handle-pro">
                <img style="width: 30px; height: 30px" src="../../../assets/images/u311.svg" alt="">
                <div><img style="width: 40px; height: 30px" src="../../../assets/images/u310.svg" alt=""></div>
                <div>
                    <p>王玲玲</p>
                    <p>{{data.lclCrtTms | filterTime}}</p>
                </div>
                <div :class="data.verSt == '1' ? 'blue' : 'green'">{{data.verSt | verStFilter}}</div>
            </div> -->
        </div>
    </div>
</template>

<script>
import {
        filePath
    } from '@/config'
export default {
    name: 'publishDialog',
    props: ['data'],
    methods: {
        downloadCode(src) {
            const origin = window.location.origin
            let url = `${origin}/download?filePath=${filePath}${src.replace(/\\/g, '/')}`
            window.open(url)
        }
    },
    filters: {
        verStFilter(status) {
            switch(status) {
                case '1' :
                    return '待审核'
                case '2' :
                    return '拒绝'
                case '3' :
                    return '可发布'
                case '4' :
                    return '待生产版本发布'
                case '5' :
                    return '生产版本发布中'
                case '6' :
                    return '生产版本已发布'
                case '7' :
                    return '待灰度版本发布'
                case '8' :
                    return '灰度版本发布中'
                case '9' :
                    return '灰度版本已发布'
                case '10' :
                    return '版本发布失败'
            }
            // return '未处理'
        },
        appTpFilter(type) {
            switch(type) {
                case '1' :
                    return '报刊杂志'
                case '2' :
                    return '餐饮'
                case '3' :
                    return '社交'
                case '4' :
                    return '摄影'
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .content {
            width: 100%;
            height: 100%;
        }
        .main {
            height:calc(100% - 100px);
            padding-left: 20px;
            padding-top: 20px;
            .sbjNm {
                span:nth-child(2) {
                    display: inline-block;
                    padding: 0 5px;
                    height: 24px;
                    color: #fff;
                    text-align: center;
                    margin-left: 10px;
                }
                .blue {
                    background-color: #228CDF;
                }
                .green {
                    background-color: #008000;
                }
                .red {
                    background-color: #cc0000;
                }
            }
            .entNm {
                margin-bottom: 20px;
                span:nth-child(3) {
                    margin-left: 10px;
                    font-weight: 400;
                    font-style: normal;
                    font-size: 12px;
                    color: #797979
                }
            }
            .base-info-list {
                list-style: none;
                li {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 10px;
                    padding-left: 14px;
                    padding-right: 100px;
                }
                span:nth-child(1) {
                    font-size: 14px;
                    color: #949494; 
                    font-weight: 400;
                    min-width: 120px;
                }
                .photo {
                    line-height: 180px;
                    img {
                        display: inline-block;
                        width: 200px;
                        height: 180px;
                    }
                }
            }
            .handle-pro {
                position: relative;
                padding-left: 50px;
                height: 50px;
                background-image: url('../../../assets/images/u309.png');
                background-repeat: no-repeat;
                background-position: 50px;
                img {
                    position: absolute;
                    left: 5px;
                    top: 50%;
                    transform: translateY(-70%);
                }
                p {
                    line-height: 6px;
                }
                &>div {
                    display: inline-block;
                }
                div:last-child {
                    padding: 0 5px;
                    height: 24px;
                    color: #fff;
                    text-align: center;
                    margin-left: 10px;
                }
                .blue {
                    background-color: #228CDF;
                }
                .green {
                    background-color: #008000;
                }
            }
        }
        .down {
            cursor: pointer;
            color: #2085D8;
        }
</style>
