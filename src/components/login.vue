<template>
<div class="login_container">

    <div class="login_box">
        <div class="avatar_box">
            <img src="../assets/logo.png" alt="">
        </div>
        <!-- 利用element ui cn 組件 -->
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
            <!-- :model (v-bind:model) model自定義屬性 props傳值 -->
            <!-- account -->
            <el-form-item label-width="70px" label="Account" prop="username">
                <el-input prefix-icon="el-icon-user-solid" v-model="loginForm.username"></el-input>
            </el-form-item>
            <!-- password -->
            <el-form-item label-width="70px" label="Password" prop="password">
                <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" type="password"></el-input>
            </el-form-item>
            <!-- button區 -->
            <el-form-item class="btns">
                <el-button type="primary" @click="login">Login</el-button>
                <el-button type="info" @click="resetLoginForm">Reset</el-button>
            </el-form-item>
        </el-form>
    </div>

</div>
</template>

<script>
export default {
    data() {
        return {
            // 登錄表單的數據綁定對象
            loginForm: {
                username: 'admin',
                password: '123456',
            },
            // 表單的rules 驗證規則對象
            loginFormRules: {
                //驗證 username
                username: [{
                        required: true,
                        message: '請輸入username',
                        trigger: 'blur'
                    },
                    {
                        min: 3,
                        max: 10,
                        message: '長度在 3 到 10 个字符之間',
                        trigger: 'blur'
                    }
                ],
                //驗證 password
                password: [{
                        required: true,
                        message: '請輸入密碼',
                        trigger: 'blur'
                    },
                    {
                        min: 6,
                        max: 15,
                        message: '長度在 6 到 15 个字符之間',
                        trigger: 'blur'
                    }

                ]
            },
        }
    },
    methods: {
        resetLoginForm() {
            this.$refs.loginFormRef.resetFields();
        },
        login() {
            this.$refs.loginFormRef.validate(async valid => {
                if (!valid) return;
                // 我們定了Vue.prototype.$http = axios  就是使用axios
                const {
                    data: result
                } = await this.$http.post('login', this.loginForm);
                // 這裡我們有baseURL, 也就是'http://127.0.0.1:8888/api/private/v1/' 再加上login
                // http://127.0.0.1:8888/api/private/v1/login  都是別人寫好的接口
                // 因為result一開始返回的是promise, 所以我們用await的話, 第一個參數要加上async
                // status 200是成功
                // console.log(result);
                // console.log(`${result.meta.status}`);
                if (result.meta.status !== 200) return this.$message.error(`${result.meta.status}` + '登錄失敗!');
                // return下 不可以格行
                // 沒有觸發上面的if 就是成功(如果失敗了就會觸發上面的return, 不跑代碼了)
                this.$message.success('登錄成功');
                // 1. 將登錄成功之後的token, 保存到容戶端的 sessionStorage中
                // 1.1 項目中出了登錄之外的其他API接口, 必須在登錄之後才能訪問
                // 1.2 token只應在當前網站打開期間生效, 所以將token保存在 sessionStorage中
                window.sessionStorage.setItem('token',result.data.token);
                // 2.通過編程式導航 跳轉到後台主頁, 路由地址是 /home
                this.$router.push('/home');
                
            });
        }
    }
}
</script>

<style lang="less" scoped>
.login_container {
    background-color: #2b4b6b;
    height: 100%;
}

.login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 5px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatar_box {
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;

        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}

.btns {
    display: flex;
    justify-content: flex-end;
}

.login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
}
</style>
