<template>
    <div class="my-dialog" @click="close" ref="myDialog" :isVisible="isVisible">
        <div class="content left">
            <div class="header">
                <span>项目详情</span>
                <i @click="closeDialog"></i>
            </div>
            <div class="main">
                <div class="sbjNm">
                    <span>{{ row.sbjNm }}</span>
                    <span>{{ row.status }}</span>
                </div>
                <div class="entNm">
                    <!-- <img src="../../../assets/images/u290.png" alt=""> -->
                    <span>{{ row.entNm }}</span>
                    <span>{{ row.time }}</span>
                </div>
                <p style="border-left: 4px solid #228CDF; text-indent: 3px; margin-top: 20px;">基本信息</p>
                <ul class="base-info-list">
                    <li><span>项目名称</span><span>DEMO项目</span></li>
                    <li><span>项目类型</span><span>服务型项目</span></li>
                    <li><span>项目LOGO</span><span>LOGO</span></li>
                    <li><span>备注</span><span>恒龍·缤纷城</span></li>
                </ul>
                <p style="border-left: 4px solid #228CDF; text-indent: 3px; margin-top: 20px;">生产版本</p>
                <ul class="base-info-list">
                    <li><span>版本号</span><span>V1.1.0</span></li>
                    <li><span>发布时间</span><span>2018-3-12</span></li>
                    <li><span>发布人</span><span>王玲玲</span></li>
                    <li><span>版本包</span><span>LOGO</span><span class="dowmload">下载</span></li>
                </ul>
                <p style="border-left: 4px solid #228CDF; text-indent: 3px; margin: 20px 0 20px">处理进度</p>
                <div class="handle-pro">
                    <img style="width: 30px; height: 30px" src="../../../assets/images/u311.svg" alt="">
                    <div><img style="width: 40px; height: 30px" src="../../../assets/images/u310.svg" alt=""></div>
                    <div>
                        <p>王玲玲</p>
                        <p>2018-07-12 12:33</p>
                    </div>
                    <div>待处理</div>
                </div>
            </div>
            <div class="footer">
                <div class="wrap">
                    <button class="argee">冻结</button>
                    <button class="refuse">取消</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "projectDetail",
  props: {
    row: {
      type: Object,
      default: () => {}
    },
    infoLeft: {
      type: Object,
      default: () => {}
    },
    infoRight: {
      type: Object,
      default: () => {}
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      title: "实名认证申请详情"
    };
  },
  methods: {
    close(e) {
      if (e.target.className === "my-dialog") this.$emit("closeDialog");
    },

    closeDialog() {
      this.$emit("closeDialog");
    },

    argee() {
      this.$emit("closeDialog");
    },

    refuse() {
      this.$emit("closeDialog");
    }
  },
  computed: {
    isVisible: {
      get: function() {
        this.$nextTick(() => {
          this.$refs["myDialog"].style.display = this.visible
            ? "block"
            : "none";
        });
        return this.visible;
      },
      set: function() {}
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.my-dialog {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0;
  right: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.4);
  .content {
    position: absolute;
    top: 0;
    width: 600px;
    height: 100%;
    background-color: #fff;
    .header {
      position: relative;
      height: 50px;
      line-height: 50px;
      color: #333333;
      background-color: #d7d7d7;
      text-indent: 2rem;
      i {
        position: absolute;
        display: block;
        width: 14px;
        height: 14px;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        background-image: url("../../../assets/images/u286.svg");
        background-repeat: no-repeat;
        background-size: 14px 14px;
        cursor: pointer;
      }
    }
    .main {
      height: calc(100% - 100px);
      padding-left: 20px;
      padding-top: 20px;
      .sbjNm {
        span:nth-child(2) {
          display: inline-block;
          width: 70px;
          height: 24px;
          color: #fff;
          background-color: #228cdf;
          text-align: center;
          margin-left: 10px;
        }
      }
      .entNm {
        margin-bottom: 20px;
        span:nth-child(3) {
          margin-left: 10px;
          font-weight: 400;
          font-style: normal;
          font-size: 12px;
          color: #797979;
        }
      }
      .base-info-list {
        list-style: none;
        li {
          margin-top: 10px;
          padding-left: 14px;
        }
        span:nth-child(1) {
          font-size: 14px;
          color: #949494;
          font-weight: 400;
          display: inline-block;
          width: 114px;
          margin-right: 50px;
        }
      }
      .handle-pro {
        position: relative;
        padding-left: 50px;
        height: 50px;
        background-image: url("../../../assets/images/u309.png");
        background-repeat: no-repeat;
        background-position: 50px;
        img {
          position: absolute;
          left: 5px;
          top: 50%;
          transform: translateY(-70%);
        }
        & > div {
          display: inline-block;
        }
      }
    }
    .footer {
      position: relative;
      height: 50px;
      border-top: 2px solid #ccc;
      .wrap {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: space-between;
        width: 180px;
      }
      button {
        width: 80px;
        height: 30px;
        border: 0 none;
        color: #fff;
        cursor: pointer;
      }
      .argee {
        background-color: #008000;
      }
      .refuse {
        background-color: #cc0000;
      }
    }
  }
  .left {
    left: 450px;
  }
  .right {
    right: 100px;
  }
}
</style>
