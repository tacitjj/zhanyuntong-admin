<template>
  <div class="admin">
    <h1 class="page-title">行政管理</h1>
    
    <!-- 功能卡片 -->
    <div class="admin-cards">
      <el-card class="admin-card" @click="navigateTo('reimburse')">
        <div class="card-content">
          <div class="card-icon">
            <el-icon><Money /></el-icon>
          </div>
          <div class="card-info">
            <h3 class="card-title">费用报销</h3>
            <p class="card-description">提交和管理费用报销申请</p>
          </div>
          <el-icon class="card-arrow"><ArrowRight /></el-icon>
        </div>
      </el-card>
      <el-card class="admin-card" @click="navigateTo('payment')">
        <div class="card-content">
          <div class="card-icon">
            <el-icon><CreditCard /></el-icon>
          </div>
          <div class="card-info">
            <h3 class="card-title">行政付款</h3>
            <p class="card-description">处理公司日常行政付款</p>
          </div>
          <el-icon class="card-arrow"><ArrowRight /></el-icon>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Money, CreditCard, ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()

const navigateTo = (path) => {
  router.push(`/admin/${path}`)
}
</script>

<style scoped>
.admin {
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

.admin-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.admin-card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.admin-card:hover {
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