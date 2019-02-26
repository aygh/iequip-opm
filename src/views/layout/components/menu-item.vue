<template>
    <div style="width: inherit;height: inherit">
        <template v-for="item in menuData" > <!-- 是否有children -->
            <el-submenu v-if="item.children" 
                :index="item.path||item.label"
                :key="item.path||item.label">
                <template slot="title">
                    <span>{{item.label}}</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item v-for="sub in item.children" 
                            :index="sub.path||sub.label" 
                            :key="sub.path||sub.label">{{sub.label}}
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu><!-- 有children -->
            <el-menu-item v-else
                          :index="item.path||item.label"
                          :key="item.path||item.label">{{item.label}}
            </el-menu-item><!-- 没有children -->
        </template>
    </div>
</template>

<script>
    export default {
        name: "menu-item",
        props: ['data'],
        computed: {
            menuData() {
                return this.data;
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>
