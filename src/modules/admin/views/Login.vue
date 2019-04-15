<template>
    <el-row class="login-container">
        <el-col :span="12" :offset="6" class="login-form">
            <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px" class="demo-editForm">
                <el-form-item label="用户" prop="user">
                    <el-input v-model="editForm.user" placeholder="user"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="pwd">
                    <el-input type="password" v-model="editForm.pwd" placeholder="password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click.native.prevent="handleSubmit">登 录</el-button>
                    <el-button @click.native.prevent="handleReset">重 置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>
<script>
    import * as AjaxApi from '../../../lib/AjaxApi';
	export default {
        data: function () {
            return {
                editForm: {
                    user: '',
                    pwd: ''
                },
                rules: {
                    user: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    pwd: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
		created: function(){

		},
		mounted:function(){

		},
		methods :  {
			handleReset:function() {
			    this.$refs.editForm.resetFields();
			},
			handleSubmit:function(ev) {
                let self = this;
			    this.$refs.editForm.validate((valid) => {
			        if (valid) {
                        let params = {
                            name: this.editForm.user,
                            pwd: this.editForm.pwd
                        };
                        self.$router.push({path: '/admin/home'});
                        return;
			            AjaxApi.ajaxPost("login_url", params, function(response){
                            self.$router.replace('/admin/Frame');
                            if (response.body.retcode == 0) {
                                console.log('true')
                            } else {
                                console.log('false')
                            }
                        });
			        } else {
			            console.log('error submit!!');
			            return false;
			        }
			    });
			}
		}
	}
</script>
<style>
body{
    margin: 0;
}
.login-container {
    background: #141A48;
    margin: 0px;
    overflow: hidden;
    height: 100vh;
}
.login-form{
    padding:20px;
    color:#000;
    position: absolute;
    top: 30%;
}
</style>