<template>
  <div class="layout">
    <!-- 顶部导航栏 -->
    <header class="layout-header">
      <div class="header-left">
        <el-button type="primary" circle @click="toggleSidebar">
          <el-icon><Menu /></el-icon>
        </el-button>
        <div class="logo">展云通</div>
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>
              <router-link to="/">首页</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>{{ $route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="header-right">
        <span class="welcome">欢迎, {{ user.name }}</span>
        <el-dropdown>
          <span class="user-dropdown">
            <el-avatar :size="32" :src="userAvatar"></el-avatar>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>
    
    <!-- 主内容区 -->
    <div class="layout-main">
      <!-- 左侧菜单 -->
      <aside class="layout-sidebar" :class="{ 'sidebar-collapsed': !sidebarOpened }">
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          background-color="#001529"
          text-color="#fff"
          active-text-color="#409EFF"
          router
        >
          <el-menu-item index="/dashboard">
            <el-icon><DataAnalysis /></el-icon>
            <span>数据看板</span>
          </el-menu-item>
          <el-sub-menu index="/project">
            <template #title>
              <el-icon><Document /></el-icon>
              <span>项目管理</span>
            </template>
            <el-menu-item index="/project">项目列表</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="/operation">
            <template #title>
              <el-icon><Operation /></el-icon>
              <span>运营管理</span>
            </template>
            <el-menu-item index="/operation/work-log">工人报工</el-menu-item>
            <el-menu-item index="/operation/purchase">采购申请</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="/inventory">
            <template #title>
              <el-icon><Box /></el-icon>
              <span>库存管理</span>
            </template>
            <el-menu-item index="/inventory">库存清单</el-menu-item>
            <el-menu-item index="/inventory/inbound">入库单</el-menu-item>
            <el-menu-item index="/inventory/outbound">出库单</el-menu-item>
            <el-menu-item index="/inventory/check">盘点单</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="/finance">
            <template #title>
              <el-icon><Money /></el-icon>
              <span>财务管理</span>
            </template>
            <el-menu-item index="/finance">应收看板</el-menu-item>
            <el-menu-item index="/finance/payment">付款申请</el-menu-item>
            <el-menu-item index="/finance/flow">收支流水</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="/admin">
            <template #title>
              <el-icon><OfficeBuilding /></el-icon>
              <span>行政管理</span>
            </template>
            <el-menu-item index="/admin/reimburse">费用报销</el-menu-item>
            <el-menu-item index="/admin/payment">行政付款</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="/todo" style="position: relative;">
            <el-icon><Bell /></el-icon>
            <span>待办中心</span>
            <el-badge value="4" type="danger" class="todo-badge" />
          </el-menu-item>
          <el-menu-item index="/settings">
            <el-icon><Setting /></el-icon>
            <span>系统设置</span>
          </el-menu-item>
        </el-menu>
      </aside>
      
      <!-- 右侧内容 -->
      <main class="layout-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../../stores'
import { Menu, DataAnalysis, Document, Operation, Box, Money, OfficeBuilding, Bell, Setting } from '@element-plus/icons-vue'

const router = useRouter()
const appStore = useAppStore()

const sidebarOpened = computed(() => appStore.sidebar.opened)
const user = computed(() => appStore.user)

const userAvatar = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20business%20avatar%20portrait&image_size=square'

const activeMenu = computed(() => {
  const path = router.currentRoute.value.path
  return path.includes('/project/detail') ? '/project' : path
})

const toggleSidebar = () => {
  appStore.toggleSidebar()
}

onMounted(() => {
  // 监听路由变化，保持菜单激活状态
  router.beforeEach((to, from, next) => {
    next()
  })
})
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #1890ff;
}

.breadcrumb {
  margin-left: 20px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.welcome {
  font-size: 14px;
  color: #666;
}

.user-dropdown {
  cursor: pointer;
}

.layout-main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.layout-sidebar {
  width: 240px;
  background-color: #001529;
  transition: width 0.3s ease;
  overflow-y: auto;
}

.layout-sidebar.sidebar-collapsed {
  width: 64px;
}

.sidebar-menu {
  height: 100%;
}

.todo-badge {
  position: absolute;
  top: 0;
  right: 24px;
  transform: translate(0, -25%);
}

.layout-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f5f5;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>