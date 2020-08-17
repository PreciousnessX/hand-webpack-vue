<template>
  <el-card shadow="never" class="addNewApplyFor">
          <div class="searchInfo">
            <span class="currentPageHint">新增申请</span>
            <!-- <span class="currentPageHint">编辑申请</span> -->
          </div>

          <!-- 表单 -->
          <div class="form">
              <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="使用学校" prop="school_name">
                  <el-input v-model="formData.school_name"></el-input>
              </el-form-item>
              <el-form-item label="学院" prop="faculty_name">
                  <el-input v-model="formData.faculty_name"></el-input>
              </el-form-item>
              <el-form-item label="专业" prop="speciality_name">
                  <el-input v-model="formData.speciality_name"></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="remarks"><!-- 编辑时不可填写 -->
                  <el-input v-model="formData.remarks"></el-input>
              </el-form-item>
              <el-form-item label="申请类型" prop="application_type">
                  <el-select v-model="formData.application_type" placeholder="请选择" @change = "controlIndate">
                      <el-option label="试用版" :value="1"></el-option>
                      <el-option label="正式版" :value="2"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="有效期" prop="due_month">
                    <el-select v-model="formData.due_month" placeholder="请选择">
                      <el-option v-for="item in options" :key="item.value"
                        :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
              </el-form-item>
              <div class="machineCode">
                  <el-form-item v-for="(domain, index) in formData.server_identity_info"
                    :label="'机器编码' + index" :key="domain.key"
                    :prop="'server_identity_info.' + index + '.identity_code'"
                    :rules="{required: true, message: '机器编码不能为空', trigger: 'blur'}">
                    <!-- <el-input v-model="domain.value"></el-input> -->
                    <el-input type="text" placeholder="请输入内容" v-model="domain.identity_code" maxlength="50" show-word-limit></el-input>
                    <a v-if="index != 0" @click.prevent="removeDomain(domain)" class="el-icon-delete removeMachine"></a>
                  </el-form-item>
                  <el-button @click="addDomain" class="addMachine">添加机器</el-button>
              </div>
              </el-form>
          </div>

            <div class="buttonBox">
                <el-button class="save" @click="save('ruleForm')">保存</el-button>
                <el-button class="cancel" @click="cancel">取消</el-button>
            </div>
          
  </el-card>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      formData: {
          school_name: '',
          faculty_name: '',
          speciality_name: '',
          remarks: '',
          application_type: '',
          due_month: '',
          user_id: '',
          company_id: '',
          server_identity_info: [{
            identity_code: ''
          }],
      },
        
        //非空校验
        rules:{
            school_name: [{ required: true, message: '请输入使用学校', trigger: 'blur' }],
            application_type: [{ required: true, message: '请选择申请类型', trigger: 'change' }],
            due_month: [{ required: true, message: '请选择有效期', trigger: 'change' }],
            ServerIdentityInfo: [{ required: true, message: '请输入机器编码', trigger: 'blur' }]
        },
      // 分页数据
      total: 10,
      pagesize: 10,
      pagesizes: [10, 15, 20, 30],
      pagenum: 1,

      options: [{
            value: '1',
            label: '一年'
          },
          {
            value: '2',
            label: '两年'
           }, 
           {
             value: '3',
             label: '三年'
           }, 
           {
             value: '4',
             label: '四年'
           }, 
           {
             value: '999',
             label: '永久'
           }],
    }
  },

  created () {
  },

  methods: {
    //新增机器码
    addDomain() {
        this.formData.server_identity_info.push({
            value: '',
            // key: Date.now()
        });
    },

    //删除机器码
    removeDomain(item) {
        var index = this.formData.server_identity_info.indexOf(item)
        if (index !== -1) {
          this.formData.server_identity_info.splice(index, 1)
        }
    },

    controlIndate(value){
      if(value == 1){
        this.$set(this.formData,'due_month','')
        this.options = [{
            value: '1',
            label: '1个月'
          },
          {
            value: '2',
            label: '2个月'
          }]
      }else{
        this.$set(this.formData,'due_month','')
        this.options = [{
            value: '1',
            label: '一年'
          },
          {
            value: '2',
            label: '两年'
           }, 
           {
             value: '3',
             label: '三年'
           }, 
           {
             value: '4',
             label: '四年'
           }, 
           {
             value: '999',
             label: '永久'
           }]
      }
    },

    //保存
    save(formName){
      const that = this
      this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.formData.school_name == '' || this.formData.ServerIdentityInfo == '' || this.formData.application_type == '' || this.formData.due_month == ''){
              that.$message("请填写完整");
              return false
            }else{
                that.$utils.post(that.reqApi.shuiwuUrl + `/activation/newCode`,{activation_info: that.formData}).then(res => {
                    const {code, msg, data} = res.data;
                    if (code == "00") {
                      that.$message.success(msg)
                      // sessionStorage.removeItem('userData')
                      that.$router.push({path:'/activationCodeRequest'})
                    }else{
                      that.$message(msg)
                    }
              })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      
      
    },

    //取消
    cancel(){
        this.$router.push({path:'/activationCodeRequest'});
    },


  },

}
</script>

<style scoped>
 .search{
   background-color: #000;
   color: #fff;
 }

 .newAdd{
   background-color: #E6000B;
   color: #fff;
   border: 1px solid #E6000B;
 }

 form.el-form.demo-ruleForm{
    width: 500px;
 }

 .el-select{
    width: 400px;
 }

 .machineCode{
    position: relative;
 }

 .machineCode .addMachine{
    position: absolute;
    top: 6px;
    right: -107px;
    color: #E6000B;
    border: 1px solid #E6000B;
 }

.machineCode .removeMachine{
    position: absolute;
    top: 14px;
    right: -23px;
 }

</style>
