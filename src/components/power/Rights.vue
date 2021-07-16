<template>
    <div>
    <!-- 面包屑breadcrumb導航區 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item>權限管理</el-breadcrumb-item>
        <el-breadcrumb-item>權限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片視圖區 -->
    <el-card>
        <el-table :data="rightsList" :border="true" stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="權限名稱" prop="authName"></el-table-column>
            <el-table-column label="路徑" prop="path"></el-table-column>
            <el-table-column label="權限等級" prop="level">
                <template v-slot="slotProps">
                        <!-- <el-tag v-if="slotProps.row.level === '0'">一級</el-tag>
                        <el-tag type="success" v-if="slotProps.row.level === '1'">二級</el-tag>
                        <el-tag type="warning" v-if="slotProps.row.level === '2'">三級</el-tag> -->
                        <el-tag v-if="slotProps.row.level === '0'">一級</el-tag>
                        <el-tag type="success" v-else-if="slotProps.row.level === '1'">二級</el-tag>
                        <el-tag type="warning" v-else>三級</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return{
            // 所有的權限列表
            rightsList:[],
        }
    },
    created() {
        // 獲取所有的權限
        this.getRightsList()
    },
    methods: {
        async getRightsList(){
            const {data:res }=await this.$http.get('/rights/list')
            if(res.meta.status !== 200) {
                return this.$message.error('獲取權限列表失敗');
            }
            this.rightsList = res.data;
            console.log(this.rightsList);
        },
    },

}
</script>

<style lang="less" scoped>
    
</style>