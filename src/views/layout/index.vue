<template>
    <el-container class="container">
        <el-header class="my-header">
            <my-header></my-header>
        </el-header>
        <el-container>
            <el-aside width="180px" height="100%">
                <my-nav :data="data"></my-nav>
            </el-aside>
            <el-main class="my-main">
                <router-view/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import {MyNav, MyHeader} from './components';
    import {checkUserIsLogin} from '@/utils/myFn'
    export default {
        components: {MyNav, MyHeader},
        data() {
            return {
                data: [
                    {
                        label: '请求审批',
                        children: [
                            {
                                label: '实名认证审批',
                                path: '/approve/realName'
                            },
                            {
                                label: '项目发布审批',
                                path: '/approve/publish'
                            }
                        ]
                    },
                    {
                        label: '文档维护',
                        path: '/docMaintain'
                    },
                    {
                        label: '项目管理',
                        path: '/projectManage'
                    },
                    {
                        label: '设备管理',
                        path: '/deviceManage'
                    },
                    {
                        label: '资源维护',
                        path: '/resourceMaintenance'
                    },
                    {
                        label: '产品维护',
                        path: '/productMaintenance'
                    }
                ]
            }
        },
        created() {
            checkUserIsLogin().catch(res => {
                console.log(res);
                this.$message.warning('请登录')
                this.$router.push('/resourceMaintenance')
            })
        }
    }
</script>

<style lang="scss" scoped>
    .my-main {
        background: #e9edf1;
        padding: 20px 10px;
        // width:calc(100% - 180px);
        width: 100%;
    }
    .my-header {
        width: 100% !important;
        background-color: #334054;
        padding: 0;
    }
</style>


<style lang="scss">
    .el-container {
        height: 100% !important;
        max-height: 100% !important;
        width: 100%;
        background-color: #e9edf1;
    }

    .el-header {
        height: 50px !important;
        line-height: 50px !important;
        background-color: #fff !important;
        color: #333;
    }

    .el-aside {
        height: 100% !important;
    }

    .el-main {
        height: 100%;
        max-height: 100%;
    }

    .el-footer {
        height: 38px !important;
        line-height: 38px !important;
        font-size: 12px;
    }
</style>
