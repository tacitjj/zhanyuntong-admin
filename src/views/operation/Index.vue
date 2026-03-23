<template>
  <div class="operation">
    <h1 class="page-title">运营管理</h1>
    
    <!-- 功能卡片 -->
    <div class="operation-cards">
      <el-card class="operation-card" @click="navigateTo('work-log')">
        <div class="card-content">
          <div class="card-icon">
            <el-icon><UserFilled /></el-icon>
          </div>
          <div class="card-info">
            <h3 class="card-title">工人报工</h3>
            <p class="card-description">记录项目执行过程中的人工投入</p>
          </div>
          <el-icon class="card-arrow"><ArrowRight /></el-icon>
        </div>
      </el-card>
      <el-card class="operation-card" @click="navigateTo('purchase')">
        <div class="card-content">
          <div class="card-icon">
            <el-icon><ShoppingCart /></el-icon>
          </div>
          <div class="card-info">
            <h3 class="card-title">采购申请</h3>
            <p class="card-description">提交项目所需物料的采购申请</p>
          </div>
          <el-icon class="card-arrow"><ArrowRight /></el-icon>
        </div>
      </el-card>
      <el-card class="operation-card">
        <div class="card-content">
          <div class="card-icon">
            <el-icon><Box /></el-icon>
          </div>
          <div class="card-info">
            <h3 class="card-title">入库单</h3>
            <p class="card-description">物料入库记录</p>
          </div>
          <el-icon class="card-arrow"><ArrowRight /></el-icon>
        </div>
      </el-card>
      <el-card class="operation-card">
        <div class="card-content">
          <div class="card-icon">
            <el-icon><TakeawayBox /></el-icon>
          </div>
          <div class="card-info">
            <h3 class="card-title">出库单</h3>
            <p class="card-description">物料出库记录</p>
          </div>
          <el-icon class="card-arrow"><ArrowRight /></el-icon>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { UserFilled, ShoppingCart, Box, TakeawayBox, ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()

const navigateTo = (path) => {
  router.push(`/operation/${path}`)
}
</script>

<style scoped>
.operation {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.operation-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.operation-card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.operation-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.card-content {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 30px 20px;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(24, 144, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #1890ff;
}

.card-info {
  flex: 1;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 8px 0;
  color: #333;
}

.card-description {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.card-arrow {
  font-size: 20px;
  color: #999;
}
</style>