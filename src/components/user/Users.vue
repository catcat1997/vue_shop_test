<template>
<div>
    <!-- 面包屑breadcrumb導航區 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item>用戶管理</el-breadcrumb-item>
        <el-breadcrumb-item>用戶列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片視圖區 -->
    <el-card>
        <!-- 搜索與添加區域 -->
        <el-row :gutter="20">
            <el-col :span="7">
                <el-input placeholder="請輸入內容" v-model="queryInfo.query" :clearable="true" @clear="getUserList">
                    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="addDialogVisible=true">添加用戶</el-button>
            </el-col>
        </el-row>
        <!-- 用戶列表渲染區 -->
        <el-table :data="userList" border stripe>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="姓名" prop="username"></el-table-column>
            <el-table-column label="郵箱" prop="email"></el-table-column>
            <el-table-column label="電話" prop="mobile"></el-table-column>
            <el-table-column label="角色" prop="role_name"></el-table-column>
            <el-table-column label="狀態" prop="mg_state">
                <template v-slot:default="slotProps">
                    <!-- {{slotProps.row}} -->
                    <el-switch v-model="slotProps.row.mg_state" @change="userStateChanged(slotProps.row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <!-- <template v-slot:default="slotProps"> -->
                <template v-slot:default="slotProps">
                    <!-- 修改btn -->
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(slotProps.row.id)"></el-button>
                    <!-- 刪除btn -->
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(slotProps.row.id)"></el-button>
                    <!-- 分配角色btn -->
                    <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(slotProps.row)"></el-button>
                    </el-tooltip>

                </template>
            </el-table-column>
        </el-table>
        <!-- 分頁區pagination -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </el-card>
    <!-- 添加用戶對話框 -->
    <el-dialog title="添加用戶" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!-- 內容區 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" class="demo-ruleForm">
            <el-form-item label="用戶名" prop="username">
                <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密碼" prop="password">
                <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="郵箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手機" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
        </el-form>

        <!-- 底部區 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">確 定</el-button>
        </span>
    </el-dialog>
    <!-- 修改用戶對話框 -->
    <el-dialog title="修改用戶" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
            <el-form-item label="用戶名">
                <el-input v-model="editForm.username" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="郵箱" prop="email">
                <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手機" prop="mobile">
                <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserInfo">確 定</el-button>
        </span>
    </el-dialog>
    <!-- 分配角色dialog -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
        <div>
            <p>當前的用戶:{{userInfo.username}}</p>
            <p>當前的角色:{{userInfo.role_name}}</p>
            <p>分配新角色:
                <el-select v-model="selectedRoleId" placeholder="請選擇">
                    <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
                    </el-option>
                </el-select>
            </p>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="setRoleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveRoleInfo">確 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
export default {
    data() {
        // 驗證email的規則
        var checkEmail = (rule, value, callback) => {
            //驗證email正則表達式
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if (regEmail.test(value)) {
                //合法郵箱
                return callback()
            }
            callback(new Error('請輸入合法的郵箱'))
        }
        // 驗證手機的規則
        var checkMobile = (rule, value, callback) => {
            //驗證手機號的正則表達式
            const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if (regMobile.test(value)) {
                return callback()
            }
            callback(new Error('請輸入合法的手機號碼'))
        }
        return {

            // 獲取用戶列表的參數對象
            queryInfo: {
                query: '',
                // 當前page頁數
                pagenum: 1,
                // 當前每頁顯示多少條數據
                pagesize: 2,
            },
            userList: [],
            total: 0,
            //控制添加用戶對話框的顯示與隱藏
            addDialogVisible: false,
            //添加用戶的表單數據
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: '',

            },
            // 添加表單的驗證規則對象
            addFormRules: {
                username: [{
                        required: true,
                        message: '請輸入用戶名',
                        trigger: 'blur'
                    },
                    {
                        min: 3,
                        max: 10,
                        message: '用戶名長度在3~10個字符之間',
                        trigger: 'blur'
                    }
                ],
                password: [{
                        required: true,
                        message: '請輸入密碼',
                        trigger: 'blur'
                    },
                    {
                        min: 6,
                        max: 10,
                        message: '密碼長度在6~10個字符之間',
                        trigger: 'blur'
                    }
                ],
                email: [{
                    required: true,
                    message: '請輸入郵箱',
                    trigger: 'blur'
                }, {
                    validator: checkEmail,
                    trigger: 'blur'
                }],
                mobile: [{
                    required: true,
                    message: '請輸入郵箱',
                    trigger: 'blur'
                }, {
                    validator: checkMobile,
                    trigger: 'blur'
                }],
            },
            // 控制修改用戶對話框的顯示與隱藏
            editDialogVisible: false,
            // 查詢到的用戶信息對象
            editForm: {},
            // 修改表單的驗證規則
            editFormRules: {
                email: [{
                    required: true,
                    message: '請輸入郵箱',
                    trigger: 'blur'
                }, {
                    validator: checkEmail,
                    trigger: 'blur'
                }],
                mobile: [{
                    required: true,
                    message: '請輸入郵箱',
                    trigger: 'blur'
                }, {
                    validator: checkMobile,
                    trigger: 'blur'
                }],
            },
            setRoleDialogVisible: false,
            userInfo: {},
            // 所有角色的數據列表
            rolesList: [],
            // 已選中的角色id值
            selectedRoleId: '',

        }
    },
    created() {
        this.getUserList();
    },
    methods: {
        async getUserList() {
            const {
                data: res
            } = await this.$http.get('users', {
                params: this.queryInfo
            })
            if (res.meta.status !== 200) return this.$message.error('獲取用戶列表失敗');
            this.userList = res.data.users;
            this.total = res.data.total;
            console.log(res);
        },
        // 監聽 pagesize 改變的事件
        handleSizeChange(newSize) {
            // console.log(newSize);
            this.queryInfo.pagesize = newSize;
            this.getUserList(); // getUserList函數是重新獲取 新數據
        },
        // 監聽 頁碼值 改變的事件
        handleCurrentChange(newPage) {
            console.log(newPage);
            this.queryInfo.pagenum = newPage;
            this.getUserList();
        },
        // 監聽switch 開關狀態的改變
        async userStateChanged(userinfo) {
            // 利用接口 put數據上去改變
            // this.$http.put(`users/:Id/state/:type`) 這個是寫死了的接口
            const {
                data: res
            } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
            if (res.meta.status != 200) {
                userinfo.mg_state = !userinfo.mg_state;
                return this.$message.error('更新用戶狀態失敗!');
            }
            this.$message.success('更新用戶狀態成功!');
        },
        // 監聽添加用戶對話框的關閉事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields();
        },
        // dialog confirm button
        addUser() {
            this.$refs.addFormRef.validate(async valid => {
                // console.log(valid);
                if (!valid) return
                // 可以發起添加用戶的網路請求
                const {
                    data: res
                } = await this.$http.post('users', this.addForm)
                if (res.meta.status !== 201) {
                    return this.$message.error('添加用戶失敗');
                }
                this.$message.success('添加用戶成功');
                // 隱藏添加用戶的對話框
                this.addDialogVisible = false;
                // 重新獲取用戶列表數據
                this.getUserList();
            })
        },
        // 展示用戶修改edit的對話框
        async showEditDialog(id) {
            // console.log(id);
            const {
                data: res
            } = await this.$http.get('/users/' + id)
            if (res.meta.status !== 200) {
                return this.$message.error('查詢用戶信息失敗!');
            }
            this.editForm = res.data;
            this.editDialogVisible = true;
        },
        // 監聽修改用戶對話框的關閉事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields();
        },
        // 修改用戶信息與提交
        editUserInfo() {
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return
                // 發起修改用戶信息的數據請求
                const {
                    data: res
                } = await this.$http.put('/users/' + this.editForm.id, {
                    email: this.editForm.email,
                    mobile: this.editForm.mobile,
                })

                if (res.meta.status !== 200) {
                    return this.$message.error('更新用戶信息失敗');
                }
                this.editDialogVisible = false;
                // 更新列表數據
                this.getUserList();
                // 提示更新成功
                this.$message.success('更新用戶信息成功');

            })
        },
        // 根據id remove用戶信息
        async removeUserById(id) {
            // console.log(id);
            const confirmResult = await this.$confirm('此操作將永久删除該用戶, 是否繼續?', '提示', {
                confirmButtonText: '確定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => {
                return err
                // catch取消時返回cancel 字符串
            })
            // 如果點確定 返回confirm 字符串
            console.log(confirmResult);
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消刪除');
            }
            // console.log('確認刪除');
            const {
                data: res
            } = await this.$http.delete('/users/' + id)
            if (res.meta.status !== 200) {
                return this.$message.error('刪除用戶失敗!')
            }
            this.$message.success('刪除用戶成功');
            this.getUserList();
        },
        // 展示分配角色dialog
        async setRole(userInfo) {
            this.userInfo = userInfo;
            //  獲取所有角色列表 利用api
            const {
                data: res
            } = await this.$http.get('roles')
            if (res.meta.status !== 200) {
                return this.$message.error('獲取角色列表失敗!');
            }

            this.rolesList = res.data;

            this.setRoleDialogVisible = true;

        },
        async saveRoleInfo() {
            if(!this.selectedRoleId) {
                return this.$message.error('請選擇要分配的角色!');
            }
            const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`, {rid:this.selectedRoleId})
            if(res.meta.status !== 200) {
                return this.$message.error('分配角色失敗!');
            }
            this.$message.success('分配角色成功!');
            this.getUserList();
            this.setRoleDialogVisible = false;
        },
        setRoleDialogClosed() {
            this.selectedRoleId = '';
            this.userInfo = {};
        },
    },

}
</script>

<style lang="less" scoped>

</style>
