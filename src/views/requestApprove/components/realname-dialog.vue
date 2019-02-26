<template>
    <div class="content">
        <div class="main">
            <div class="sbjNm">
                <span>{{data.entNm}}</span>
                <span :class="data.rlnmAuthenSt == '0' ? 'blue' 
                        : data.rlnmAuthenSt == '1' ? 'green' 
                        : 'red'">{{data.rlnmAuthenSt | rlnmAuthenStFilter}}</span>
            </div>
            <div class="entNm">
                <img src="../../../assets/images/u290.png" alt="">
                <span>{{data.acctId}}</span>
                <span>{{data.adtTms}}</span>
            </div>
            <p style="border-left: 4px solid #228CDF; text-indent: 3px;">基本信息</p>
            <ul class="base-info-list">
                <li><span>申请人身份</span><span>{{data.acctTp}}</span></li>
                <li><span>企业名称</span><span>{{data.entNm}}</span></li>
                <li><span>企业法定代表人</span><span>法定代表人</span></li>
                <li><span>{{data.acctTp}}手机</span><span>{{data.authenPhone}}</span></li>
                <li v-if="data.acctTp=='经办人'"><span>经办人</span><span>{{data.rspbpsnNm}}</span></li>
                <li v-if="data.acctTp=='经办人'"><span>经办人身份证号</span><span>{{data.rspbpsnCrdtNo}}</span></li>
                <li v-else><span>{{data.acctTp}}身份证号</span><img src="" alt=""><span>{{data.sbjCrdtNo}}</span></li>
                <li v-if="data.rlnmAuthenMsg"><span>拒绝理由</span><span>{{data.rlnmAuthenMsg}}</span></li>
                <li class="photo">
                    <span>{{data.acctTp}}身份证正面照片</span>
                    <img :src="`/getFile?filePath=${filePath}${data.authenFrontSrc.replace(/\\/g, '/')}`" alt="">
                </li>
                <li class="photo">
                    <span>{{data.acctTp}}身份证反面照片</span>
                    <img :src="`/getFile?filePath=${filePath}${data.authenBackSrc.replace(/\\/g, '/')}`" alt="">
                </li>
                <li class="photo">
                    <span>{{data.acctTp}}手持身份证照片</span>
                    <img :src="`/getFile?filePath=${filePath}${data.authenHandSrc.replace(/\\/g, '/')}`" alt="">
                </li>
                <!-- <li><span>企业证件有效期</span><span>法定代表人</span></li> -->
                <li  class="photo">
                    <span>企业证件照片</span>
                    <img :src="`/getFile?filePath=${filePath}${data.entCrdtSrc.replace(/\\/g, '/')}`" alt="">
                </li>
                <li><span style="width: 116px; margin-right: 48px">统一社会信用代码</span><span>{{data.unnSocCrCd}}</span></li>
            </ul>
            <!-- <p style="border-left: 4px solid #228CDF; text-indent: 3px; margin: 10px 0 20px">处理进度</p> -->
            <!-- <div class="handle-pro">
                <img style="width: 30px; height: 30px" src="../../../assets/images/u311.svg" alt="">
                <div><img style="width: 40px; height: 30px" src="../../../assets/images/u310.svg" alt=""></div>
                <div>
                    <p>王玲玲</p>
                    <p>{{data.adtTms}}</p>
                </div>
                <div :class="data.rlnmAuthenSt == '1'? 'blue' : 'red'">{{data.rlnmAuthenSt == '1' ? '已通过' : '已拒绝'}}</div>
            </div> -->
        </div>
    </div>
</template>

<script>
import {filePath} from '@/config'
export default {
    name: 'realNameDialog',
    props: ['data'],
    data() {
        return {
            filePath
        }
    },
    filters: {
        rlnmAuthenStFilter(status) {
            if(status == '0') {
                return '未处理'
            }else if(status == '1') {
                return '已通过'
            }else if(status == '2') {
                return '已拒绝'
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
                    width: 70px;
                    height: 24px;
                    color: #fff;
                    text-align: center;
                    margin-left: 10px;
                }
                .blue {
                    background-color: #228CDF;
                }
                .red {
                    background-color: #cc0000;
                }
                .green {
                    background-color: #008000;
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
                    min-width: 140px;
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
                &>div {
                    display: inline-block;
                }
                div:last-child {
                    width: 70px;
                    height: 24px;
                    color: #fff;
                    text-align: center;
                    margin-left: 10px;
                }
                .blue {
                    background-color: #228CDF;
                }
                .red {
                    background-color: #cc0000;
                }
                .green {
                    background-color: #008000;
                }
            }
        }
</style>
