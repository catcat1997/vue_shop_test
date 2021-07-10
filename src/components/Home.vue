<template>
<el-container class="home-container">
    <!-- header區 -->
    <el-header>
        <div>
            <img src="../assets/backend_icon.png" alt="" class="backend-icon">
            <span>電商管理後台系統</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主體區 -->
    <el-container>
        <!-- aside區 -->
        <el-aside :width="isCollapse ? '60px' : '200px'">
            <div class="toggle-button" @click="toggleCollapse">|||</div>
            <!-- 側菜單區 -->
            <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="activePath">
                <!-- 一級菜單 -->
                <!-- 改index為:index="item.id+''" 1.:index要為字符串+''可化為字符串
                        2. 可以使v-for菜單分別開不同的index 實現獨立 -->
                <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
                    <!-- 一級菜單的模板區域 -->
                    <template slot="title">
                        <!-- 圖標 -->
                        <i :class="iconsObj[item.id]"></i>
                        <!-- 文本 -->
                        <span>{{item.authName}}</span>
                    </template>
                    <!-- 二級菜單 -->
                    <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
                        <template slot="title">
                            <!-- 圖標 -->
                            <i class="el-icon-menu"></i>
                            <!-- 文本 -->
                            <span>{{subItem.authName}}</span>
                        </template>
                    </el-menu-item>
                </el-submenu>

            </el-menu>
        </el-aside>
        <!-- 右側主體 -->
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
    data() {
        return {
            // 左側菜單數據
            menulist: [],
            iconsObj: {
                // 根據對應item.id 不同的icon
                125: 'el-icon-user',
                103: 'el-icon-monitor',
                101: 'el-icon-goods',
                102: 'el-icon-document',
                145: 'el-icon-data-analysis',
            },
            isCollapse: false,
            // 被active的link地址
            activePath: '',
        }
    },
    created() {
        this.getMenuList();
        this.activePath = window.sessionStorage.getItem('activePath');
    },
    methods: {
        logout() {
            window.sessionStorage.removeItem('token');
            // window.sessionStorage.clear();
            this.$router.push('/login');
        },
        // 獲取所有的菜單函數  利用get    'menus' 是api接口路徑 xxxx/private/v1/#/menus
        // 獲取到menulist內,之後用來渲染
        async getMenuList() {
            const {
                data: res
            } = await this.$http.get('menus');
            if (res.meta.status !== 200) return this.$message.erro(res.meta.msg);
            // if(res.meta.status == 200) return this.$message.success(res.meta.msg);
            this.menulist = res.data;
            // console.log(res);
            // console.log(this.menulist);
        },
        // 菜單展開與折疊
        toggleCollapse() {
            // 利用element ui內的Menu Attribute 屬性collapse
            this.isCollapse = !this.isCollapse;
        },
        // 保存link的active狀態
        saveNavState(activePath){
            // 保存到sessionStorage內
            window.sessionStorage.setItem('activePath',activePath);
            this.activePath = activePath;
        },
    },
}
</script>

<style lang="less" scoped>
// element的標簽內自帶類名,所以可以直接類名style
.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 10px;
    align-items: center; // for 退出button
    color: #fff;
    font-size: 20px;

    // 以下可以在圖片.backend-icon用vertical-align: middle實現
    >div {
        // .el-header內的親div
        display: flex;
        align-items: center;

        span {
            margin-left: 15px;
        }
    }
}

.el-aside {
    background-color: #333744;
    transition: all 0.3s;
}

.el-main {
    background-color: #eaedf1;
}

.home-container {
    height: 100%;
}

.backend-icon {
    width: 60px;
    height: 60px;
    // vertical-align: bottom;
}

.el-menu {
    border-right: none;
}

.toggle-button {
    background-color: #4A5064;
    color: #fff;
    text-align: center;
    font-size: 10px;
    line-height: 24px;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>
