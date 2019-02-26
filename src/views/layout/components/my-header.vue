<template>
    <section class="header">
        <a href="/approve/realName" class="nav-logo">
            <img :src="logo" alt="">
        </a>
        <div class="nav-right-wrap" v-if="isLogin">
            <span class="nav-right-button"><i class="el-icon-bell"></i>消息</span>
            <span @click="quiteLogin" class="nav-right-button"><ccb-icon name="logout"></ccb-icon>退出</span>
            <span class="nav-right-button">{{userName}}</span>
        </div>
        <div class="nav-right-wrap" v-else>
            <el-button class="nav-right-button" @click="toLogin()">登录</el-button>
        </div>
    </section>
</template>

<script>
    import logo from '@/assets/logo.png';

    export default {
        name: "my-header",
        data() {
            return {
                logo,
                isLogin: false,
                userName: ''
            }
        },
        methods: {
            toLogin() {
                this.$router.push('/loginIn')
            },
            quiteLogin() {
                this.$http({
                    method: 'post',
                    url: '/logout'
                }).then(res => {
                    console.log(res);
                    sessionStorage.clear();
                    this.$router.push('/loginIn')
                }).catch(err => {
                    console.log(err);
                })
            }
        },
        created() {
            this.isLogin = sessionStorage.isLogin;
            this.userName = sessionStorage.userName
        }
 
    }
</script>

<style lang="scss" scoped>
    .header {
        background-color: #fff;
    }

    .nav-logo {
        display: block;
        float: left;
        height: 33px;
        margin-left: 65px;
        margin-right: 64px;
        margin-top: 10px;
        line-height: 50px;
        background-repeat: no-repeat;
        background-size: contain;
        text-align: center;
        img {
            width: inherit;
            height: inherit;
        }
    }

    .nav-right-wrap {
        float: right;
    }

    .nav-right-button {
        margin-right: 20px;
        cursor: pointer;
    }

</style>
