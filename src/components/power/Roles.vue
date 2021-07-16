<template>
<div>
    <!-- 面包屑breadcrumb導航區 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item>權限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片視圖 -->
    <el-card>
        <!-- 添加角色button區 -->
        <el-row>
            <el-col>
                <el-button type="primary" @click="addRoleDialogVisible=true">添加角色</el-button>
            </el-col>
        </el-row>
        <!-- 角色列表區 -->
        <el-table :data="roleList" stripe border>
            <!-- 展開列 -->
            <el-table-column type="expand">
                <template v-slot="slotProps">
                    <!-- 渲染3層for循環 -->
                    <el-row :class="['bdbottom', index1 === 0 ? 'bdtop' : '' ,'vcenter']" v-for="(item1,index1) in slotProps.row.children" :key="item1.id">
                        <!-- 渲染一級權限 -->
                        <el-col :span="5">
                            <el-tag closable @close="removeRightById(slotProps.row, item1.id)">{{item1.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <!-- 渲染二級,三級權限 -->
                        <el-col :span="19">
                            <!-- 利用for循環 渲染二級權限 -->
                            <el-row :class="[index2 === 0 ? '' : 'bdtop' , 'vcenter']" v-for="(item2,index2) in item1.children" :key="item2.id">
                                <el-col :span="6">
                                    <el-tag type="success" closable @close="removeRightById(slotProps.row, item2.id)">{{item2.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <!-- 渲染三級權限 -->
                                <el-col :span="18">
                                    <el-tag type="warning" v-for="(item3, index3) in item2.children" :key="item3.id" closable @close="removeRightById(slotProps.row, item3.id)">
                                        {{item3.authName}}
                                    </el-tag>
                                </el-col>
                            </el-row>
                        </el-col>

                    </el-row>
                    <pre>
                    {{slotProps.row}}
                    </pre>
                </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="角色名稱" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="300px">
                <template v-slot="slotProps">
                    <!-- <template> -->
                    <!-- 修改btn -->
                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="showRoleEditDialog(slotProps.row.id)">編輯</el-button>
                    <!-- 刪除btn -->
                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRoleById(slotProps.row.id)">刪除</el-button>
                    <!-- 分配權限btn -->
                    <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightsDialog(slotProps.row)">分配權限</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
    <!-- 添加角色對話框 -->
    <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" width="50%" @close="addRoleDialogClosed">
        <!-- 內容區 -->
        <el-form :model="addRole" :rules="addRoleRules" ref="addRoleRef" label-width="70px" class="demo-ruleForm">
            <el-form-item label="角色名稱" label-width="80px" prop="roleName">
                <el-input v-model="addRole.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" label-width="80px" prop="roleDesc">
                <el-input v-model="addRole.roleDesc"></el-input>
            </el-form-item>

        </el-form>

        <!-- 底部區 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addRoleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRoleConfirm">確 定</el-button>
        </span>
    </el-dialog>
    <!-- 修改角色對話框 -->
    <el-dialog title="修改角色" :visible.sync="roleEditDialogVisible" width="50%" @close="roleEditDialogClosed">
        <el-form :model="roleEditForm" :rules="roleEditFormRules" ref="roleEditFormRef" label-width="70px">
            <el-form-item label="角色名稱" prop="roleName" label-width="80px">
                <el-input v-model="roleEditForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc" label-width="80px">
                <el-input v-model="roleEditForm.roleDesc"></el-input>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="roleEditDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editRoleInfo">確 定</el-button>
        </span>
    </el-dialog>
    <!-- 分配權限dialog -->
    <el-dialog title="分配權限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
        <!-- 樹形控件 -->
        <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="setRightDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allotRights">確 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
export default {
    data() {
        return {

            //所有角色列表數據
            roleList: [],
            addRoleDialogVisible: false,
            // 添加角色的表單數據
            addRole: {
                roleId: '',
                roleName: '',
                roleDesc: '',
            },
            // 添加角色驗證規則
            addRoleRules: {
                roleName: [{
                        required: true,
                        message: '請輸入角色名',
                        trigger: 'blur'
                    },
                    {
                        min: 1,
                        max: 10,
                        message: '角色名長度在1~10個字符之間',
                        trigger: 'blur'
                    }
                ],
            },
            roleEditDialogVisible: false,
            // 查詢到的用戶信息對象
            roleEditForm: {},
            // 修改表單的驗證規則
            roleEditFormRules: {
                roleName: [{
                        required: true,
                        message: '請輸入角色名',
                        trigger: 'blur'
                    },
                    // {
                    //     validator: checkRoleName,
                    //     trigger: 'blur'
                    // }
                ],

            },
            setRightDialogVisible: false,
            // 所有權限的數據
            rightsList: [],
            // 樹形控件的屬性綁定對象
            treeProps: {
                label: 'authName',
                children: 'children',
            },
            // 默認選中的節點Id值 數組
            defKeys: [],
            // 當前將分配權限的角色id
            roleId: '',
        }
    },
    created() {
        this.getRolesList();
    },
    methods: {
        async getRolesList() {
            const {
                data: res
            } = await this.$http.get('roles')
            if (res.meta.status !== 200) {
                return this.$message.error('獲取角色列表失敗');
            }
            this.roleList = res.data;
            console.log(this.roleList);
        },
        addRoleDialogClosed() {
            this.$refs.addRoleRef.resetFields();
        },
        // addRole Confirm button
        addRoleConfirm() {
            this.$refs.addRoleRef.validate(async valid => {
                if (!valid) return
                const {
                    data: res
                } = await this.$http.post('roles', this.addRole)
                if (res.meta.status !== 201) {
                    return this.$message.error('添加角色失敗');
                }
                this.$message.success('添加角色成功!');
                this.addRoleDialogVisible = false;
                this.getRolesList();
            })
        },
        // 展示修改角色edit的對話框
        async showRoleEditDialog(id) {
            const {
                data: res
            } = await this.$http.get('/roles/' + id)
            if (res.meta.status !== 200) {
                return this.$message.error('查詢角色信息失敗!');
            }
            this.roleEditForm = res.data;
            this.roleEditDialogVisible = true;
            console.log(this.roleEditForm);
        },
        roleEditDialogClosed() {
            this.$refs.roleEditFormRef.resetFields();
        },
        editRoleInfo() {
            this.$refs.roleEditFormRef.validate(async valid => {
                if (!valid) return
                const {
                    data: res
                } = await this.$http.put('/roles/' + this.roleEditForm.roleId, {
                    roleName: this.roleEditForm.roleName,
                    roleDesc: this.roleEditForm.roleDesc,
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('更新角色失敗');
                }
                this.roleEditDialogVisible = false;
                this.getRolesList();
                this.$message.success('更新角色成功!');
            })
        },
        async removeRoleById(id) {
            // console.log(id);
            const confirmResult = await this.$confirm('此操作將永久删除該角色, 是否繼續?', '提示', {
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
            const {
                data: res
            } = await this.$http.delete('/roles/' + id)
            if (res.meta.status !== 200) {
                return this.$message.error('刪除角色失敗!');
            }
            this.$message.success('刪除角色成功!');
            this.getRolesList();
        },
        // 根據id刪除對應的三級權限
        async removeRightById(role, rightId) {
            // 彈出對話框
            const confirmResult = await this.$confirm('此操作將永久删除該權限, 是否繼續?', '提示', {
                confirmButtonText: '確定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)

            if (confirmResult !== "confirm") {
                return this.$message.info('取消了刪除')
            }
            // console.log('確認刪除');
            const {
                data: res
            } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            if (res.meta.status !== 200) {
                return this.$message.error('刪除權限失敗');
            }
            console.log(res);
            console.log(res.data);
            // this.getRolesList(); 
            // 如果用getRolesList會重載一次網頁
            role.children = res.data;
            // 把最新的服務器數據 傳給當前角色的chlidren屬性 就不會重載
        },
        // show出分配權限的對話框
        async showSetRightsDialog(role) {
            this.roleId = role.id;
            // 獲取權限數據  利用接口的 tree
            const {
                data: res
            } = await this.$http.get('rights/tree')
            if (res.meta.status !== 200) {
                return this.$message.error('獲取權限數據失敗!');
            }
            this.rightsList = res.data;
            // console.log(this.rightsList);

            // 遞歸獲取三級節點的id
            this.getLeafKeys(role, this.defKeys);
            this.setRightDialogVisible = true;
        },
        // 通過遞歸的形式, 獲取角色下所有三級權限的id, 保存到defKeys中。
        getLeafKeys(node, arr) {
            // 如果當前 node節點不包含children屬性 就是三級節點
            if (!node.children) {
                return arr.push(node.id);
            }

            // 遞歸
            node.children.forEach(item => this.getLeafKeys(item, arr))

        },
        setRightDialogClosed() {
            this.defKeys = [];
        },
        // 分配角色權限的提交
        async allotRights() {
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            // console.log(keys);
            // 轉化為字符串
            const idStr = keys.join(',')
            // console.log(idStr);
            const {
                data: res
            } = await this.$http.post(`roles/${this.roleId}/rights`, {
                rids: idStr
            })
            if (res.meta.status !== 200) {
                return this.$message.error('分配角色權限失敗');
            }
            this.$message.success('分配角色權限成功');
            this.getRolesList();
            this.setRightDialogVisible = false;
        },

    },
}
</script>

<style lang="less" scoped>
.el-tag {
    margin: 7px;
}

.bdtop {
    border-top: 1px solid #eee;
}

.bdbottom {
    border-bottom: 1px solid #eee;
}

.vcenter {
    display: flex;
    align-items: center;
}
</style>
