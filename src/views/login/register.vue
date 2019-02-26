<template>
    <el-container class="reg-container">
        <div>
            <h3 class="title">用户注册</h3>
            <el-form :model="formData" :rules="rules" ref="form">
                <el-form-item label="" prop="acct.acctNm">
                    <el-input v-model="formData.acct.acctNm" placeholder="请输入您的账户名"></el-input>
                </el-form-item>
                <el-form-item label="" prop="acct.credential">
                    <el-input v-model="formData.acct.credential" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="" prop="credentialAgain">
                    <el-input v-model="formData.credentialAgain" placeholder="请再次输入密码"></el-input>
                </el-form-item>
                <el-form-item class="input-wrap" label="" prop="acct.acctPhone">
                    <el-select class="my-select" v-model="selectValue" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <el-input class="phone-input" v-model="formData.acct.acctPhone" placeholder="请输入注册手机号"></el-input>
                </el-form-item>
                <el-form-item class="input-wrap" label="" prop="veriCode">
                    <el-input class="code-input" v-model="formData.veriCode" placeholder="请输入短信验证码"></el-input>
                    <el-button class="code-btn">免费获取短信验证码</el-button>
                </el-form-item>
            </el-form>
           
            <el-button @click="submitRegister" type="primary" class="register-btn">注册</el-button>
            
        </div>
    </el-container>
</template>

<script>
import { userApi } from "@/api";
export default {
  data() {
    return {
      formData: {
        credentialAgain: "",
        veriCode: "",
        codeSN: "",
        acct: {
          acctNm: "",
          acctPhone: "",
          credential: ""
        }
      },
      rules: {
        acctNm: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        credential: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ],
        credentialAgain: [
          { required: true, message: "请再次输入密码", trigger: "blur" }
        ],
        acctPhone: [
          { required: true, message: "请输入注册手机号", trigger: "blur" }
        ],
        veriCode: [
          { required: true, message: "请输入短信验证码", trigger: "blur" }
        ]
      },
      selectValue: "86",
      options: [
        {
          label: "+86(中国大陆)",
          value: "86"
        },
        {
          label: "+85(中国大陆)",
          value: "85"
        },
        {
          label: "+84(中国大陆)",
          value: "84"
        }
      ]
    };
  },
  methods: {
    submitRegister() {
      this.$refs["form"].validate(valid => {
        if (!valid) return;
        if (this.formData.credentialAgain !== this.formData.acct.credential) {
          return this.$message.error('两次输入的密码不一致！')
        }
        this.$axios({
          method: "post",
          url: userApi.register,
          data: this.formData,
          PBreq: "com.ccb.cloud.protobuf.proto.iequip.AcctRegister"
        })
          .then(res => {
            console.log(res);
            if(!res.data.SYS_TX_STATUS == '00') {
              return this.$message.error('系统异常，请稍后再试')
            }
            this.$message({
              message: '注册成功',
              type: 'success'
            });
            this.$router.push('/loginIn')
          })
          .catch(err => {
            console.log(err);
            if(err === '插入数据失败') {
              return this.$message.error('用户名重复')
            }
            this.$message.error('系统异常，请稍后再试')
          });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.reg-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;
  > div {
    width: 400px;
    height: 500px;
    padding: 0 30px;
    background-color: #fff;
  }
  .title {
    font-family: "MicrosoftYaHei", "Microsoft YaHei";
    font-weight: 400;
    font-style: normal;
    font-size: 16px;
    line-height: 80px;
  }

  .register-btn {
    width: 100%;
    height: 50px;
    color: #fff;
    margin-top: 20px;
    margin-bottom: 10px;
  }
}
</style>
<style lang="scss">
.rem-pwd {
  .el-checkbox__label {
    font-size: 12px;
  }
}
.input-wrap {
  .el-form-item__content {
    display: flex;
    justify-content: space-between;
    .my-select {
      width: 150px;
      margin-right: 10px;
    }
    .phone-input {
      flex: 1;
    }
    .code-input {
      flex: 1;
    }
    .code-btn {
      width: 165px;
      margin-left: 10px;
    }
  }
}
</style>

