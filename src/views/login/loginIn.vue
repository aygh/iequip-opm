<template>
    <el-container class="container">
        <div>
            <h3 class="title">用户登录</h3>
            <el-form :model="formData" :rules="rules" ref="form">
                <el-form-item label="" prop="acctNm">
                    <el-input v-model="formData.acctNm" placeholder="邮箱/手机号/8位ID"></el-input>
                </el-form-item>
                <el-form-item label="" prop="credential">
                    <el-input type="password" v-model="formData.credential" placeholder="请输入登录密码"></el-input>
                </el-form-item>
            </el-form>
            <section class="rem-pwd">
                <el-checkbox v-model="checked">记住密码</el-checkbox>
                <!-- <span @click="toResetPwd">忘记密码</span> -->
            </section>
            <el-button type="primary" class="login" @click="login">登录</el-button>
            <!-- <section class="register">
                <span @click="toRegister">免费注册</span>
            </section> -->
            <!-- <section class="other">
                <span>其他方式登录：</span>
                <img src="../../assets/images/login/u14.svg" alt="">
                <img src="../../assets/images/login/u15.svg" alt="">
                <img src="../../assets/images/login/u16.svg" alt="">
                <img src="../../assets/images/login/u17.svg" alt="">
            </section> -->
        </div>
    </el-container>
</template>
<script>
    import {roles} from '@/config'
    export default {
        data() {
            return {
                formData: {
                    acctNm: '',
                    credential: ''
                },
                rules: {
                    acctNm: [{
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    }],
                    credential: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }]
                },
                checked: false
            }
        },
        methods: {
            login() {
                this.$refs['form'].validate((valid) => {
                    if (!valid) return
                    this.$http({
                        method: 'post',
                        url: '/login',
                        params: {
                            username: this.formData.acctNm,
                            password: this.formData.credential
                        }
                    }).then(res => {
                        let {
                            data
                        } = res;
                        if (res.data.status !== "success") {
                            return this.$message.error('用户名或密码错误')
                        }
                        let {
                            _login_info
                        } = data;
                        if (_login_info) {
                            let {
                                roleList
                            } = _login_info;
                            if (!roleList.some(roleListItem => roles.some(rolesItem => roleListItem.rlId === rolesItem))) {
                                this.$message.error('用户名或密码错误')
                                this.logout()
                                return 
                            }
                            sessionStorage.userId = _login_info.usrId;
                            sessionStorage.userName = _login_info.usrNm;
                            sessionStorage.emailAdr = _login_info.emailAdr;
                            sessionStorage.usrGnd = _login_info.usrGnd;
                            sessionStorage.isLogin = true;
                        }
                        this.$router.push('/approve/realName')
                    }).catch(err => {
                        console.log(err);
                        this.$message.error('系统异常，请稍后再试');
                    })
                })

            },

            logout() {
                this.$http({
                    method: 'post',
                    url: '/logout'
                }).then(res => {
                    console.log(res);
                    sessionStorage.clear();
                }).catch(err => {
                    console.log(err);
                })
            },

            toResetPwd() {
                this.$router.push('/resetPwd')
            },

            toRegister() {
                this.$router.push('/register')
            }
        },
    }
</script>

<style lang="scss" scoped>
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: #f2f2f2;

        >div {
            width: 400px;
            height: 440px;
            padding: 0 30px;
            background-color: #fff;
        }

        .title {
            font-family: 'MicrosoftYaHei', 'Microsoft YaHei';
            font-weight: 400;
            font-style: normal;
            font-size: 16px;
            line-height: 80px;
        }

        .rem-pwd {
            display: flex;
            justify-content: space-between;
            line-height: 20px;
            font-size: 12px;

            span {
                cursor: pointer;
            }
        }

        .login {
            width: 100%;
            height: 50px;
            color: #fff;
            margin-top: 40px;
            margin-bottom: 10px;
        }

        .register {
            display: flex;
            justify-content: flex-end;
            line-height: 20px;
            font-size: 12px;
            margin-bottom: 40px;

            span {
                cursor: pointer;
            }
        }

        .other {
            display: flex;
            justify-content: flex-start;

            img {
                width: 28px;
                height: 28px;
                margin-right: 8px;
                cursor: pointer;
            }
        }
    }
</style>
<style lang="scss">
    .rem-pwd {
        .el-checkbox__label {
            font-size: 12px;
        }
    }
</style>