<template>
    <div class="content">
        <div class="main">
            <div class="sbjNm">
                <span>{{data.appNm}}</span>
                <span :class="data.appSt == '1' ? 'blue' : 'red'">{{data.appSt == '1' ? '正常' : '冻结'}}</span>
            </div>
            <div class="entNm">
                <img src="../../../assets/images/u290.png" alt="">
                <span>{{data.acctId}}</span>
                <span>{{data.lclCrtTms | filterTime}}</span>
            </div>
            <p style="border-left: 4px solid #228CDF; text-indent: 3px;">基本信息</p>
            <ul class="base-info-list">
                <li><span>项目名称</span><span>{{data.appNm}}</span></li>
                <li><span>项目LOGO</span><span>{{data.appLogoSrc}}</span></li>
                <li><span>项目简介</span><span>{{data.appBrf}}</span></li>
                <!-- <li><span>项目标签</span><span>{{data.acctTp}}</span></li> -->
                <!-- <li><span>申请人</span><span>{{data.acctTp}}</span></li> -->
                <li><span>机构名称</span><span>{{data.insNm}}</span></li>
                <li v-if="data.appStDesc"><span>冻结理由</span><span>{{data.appStDesc}}</span></li>
                <li><span>本次上传的代码包</span><span>{{data.codeSrc}}</span></li>
            </ul>
            <p style="border-left: 4px solid #228CDF; text-indent: 3px; margin: 10px 0 20px">处理进度</p>
            <div class="handle-pro">
                <img style="width: 30px; height: 30px" src="../../../assets/images/u311.svg" alt="">
                <div><img style="width: 40px; height: 30px" src="../../../assets/images/u310.svg" alt=""></div>
                <div>
                    <p>王玲玲</p>
                    <p>{{data.adtTms}}</p>
                </div>
                <div :class="data.appSt == '1'? 'blue' : 'red'">{{data.appSt == '1' ? '正常' : '冻结'}}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'projectDialog',
    props: ['data']
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
                    // display: inline-block;
                    // width: 114px;
                    // margin-right: 50px;
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
            }
        }
</style>
