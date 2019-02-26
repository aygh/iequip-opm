<template>
    <div class="nav">
        <el-menu :default-active="defaultPath"
                 class="el-menu-vertical-demo"
                 style="border-radius: 0;border-right:none"
                 router
                 background-color="#D7D7D7"
                 text-color="#000"
                 active-text-color="#539eff"
                 :unique-opened="true">
            <menu-item :data="menuData"></menu-item>
        </el-menu>
    </div>
</template>
<script>
import menuItem from './menu-item'
export default {
    name: 'my-nav',
    components: {menuItem},
    props: ['data'],
    data() {
        return {
            defaultPath: '/',
        }
    },
    methods: {
        setDefaultPath() {
            let matched = this.$route.matched.filter(item => item.path);
            let pathObj = matched[matched.length - 1];
            this.defaultPath = pathObj.path;
        }
    },
    created() {
        this.setDefaultPath();
    },
    computed: {
        menuData() {
            return this.data
        },
    },
}
</script>
<style scoped>
    .nav {
        width: 180px;
        height: 100%;
        padding-top: 10px;
        background-color: #D7D7D7;
        float: left;
        box-sizing: border-box;
        overflow-x: hidden;
    }
</style>

<style>
    .el-menu-item .el-submenu__title {
        height: 42px;
    }
</style>
