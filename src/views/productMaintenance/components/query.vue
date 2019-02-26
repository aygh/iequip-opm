<template>
    <el-container class="container">
        <section class="section" v-for="item in list" :key="item.label">
            <span>{{item.label}}</span>
            <span>{{item.value}}</span>
        </section>
    </el-container>
</template>

<script>
    import {
        productMaintenance
    } from '@/api'
    export default {
        data() {
            return {
                list: [{
                        label: '产品名称：',
                        key: 'pdNm',
                        value: ''
                    },
                    {
                        label: '产品所属系统：',
                        key: 'pdBlngSbj',
                        value: ''
                    },
                    {
                        label: '产品类型：',
                        key: 'pdTp',
                        value: ''
                    },
                    {
                        label: '产品简介：',
                        key: 'pdBrf',
                        value: ''
                    },
                    {
                        label: '产品LOGO：',
                        key: 'pdLogoSrc',
                        value: ''
                    },
                    {
                        label: '产品序号：',
                        key: 'pdDispNo',
                        value: ''
                    },
                    {
                        label: '产品可用状态：',
                        key: 'avlSt',
                        value: ''
                    },
                    {
                        label: '产品生命周期：',
                        key: 'lifeCycle',
                        value: ''
                    }
                ]
            }
        },
        methods: {
            async getData(pdId) {
                try {
                    const res = await this.$http({
                        method: 'get',
                        url: productMaintenance.specify(pdId),
                    })
                    if (res.data.sysTxStatus !== '00') throw res.data.sysTxStatus
                    const {
                        data
                    } = res.data
                    this.list.forEach(item => {
                        if (item.key === 'pdBlngSbj') {
                            item.value = this.filterPdBlngSbj(data[item.key])
                        } else if (item.key === 'avlSt') {
                            item.value = data[item.key] === '0' ? '可用' : '不可用'
                        } else {
                            item.value = data[item.key]
                        }
                    })
                } catch (err) {
                    console.log(err)
                    this.$message.error('系统异常，请稍后再试')
                }

            },

            filterPdBlngSbj(value) {
                switch (value) {
                    case '1':
                        return '智能设备云'
                    case '2':
                        return '双录云'
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    .container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .section {
        display: flex;
        justify-content: space-between;
        width: 300px;
        margin-bottom: 20px;
    }
</style>