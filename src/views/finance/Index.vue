<template>
  <div class="finance">
    <h1 class="page-title">财务管理</h1>
    
    <!-- 应收看板 -->
    <el-card class="receivable-card">
      <template #header>
        <div class="card-header">
          <span>应收看板</span>
          <el-button type="primary" size="small">
            <el-icon><Plus /></el-icon>
            标记开票
          </el-button>
        </div>
      </template>
      <el-table :data="receivables" style="width: 100%">
        <el-table-column prop="project_name" label="项目" min-width="180" />
        <el-table-column prop="contract_amount" label="合同额" width="120">
          <template #default="scope">
            ¥{{ scope.row.contract_amount.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="invoiced_amount" label="已开票金额" width="120">
          <template #default="scope">
            ¥{{ scope.row.invoiced_amount.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="uninvoiced_amount" label="未开票金额" width="120">
          <template #default="scope">
            ¥{{ (scope.row.contract_amount - scope.row.invoiced_amount).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="received_amount" label="已回款金额" width="120">
          <template #default="scope">
            ¥{{ scope.row.received_amount.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="unreceived_amount" label="未回款金额" width="120">
          <template #default="scope">
            ¥{{ (scope.row.contract_amount - scope.row.received_amount).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="invoice_status" label="开票状态" width="120">
          <template #default="scope">
            <el-tag :type="getInvoiceStatusType(scope.row.invoice_status)">
              {{ scope.row.invoice_status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="payment_status" label="回款状态" width="120">
          <template #default="scope">
            <el-tag :type="getPaymentStatusType(scope.row.payment_status)">
              {{ scope.row.payment_status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" plain>
              标记回款
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 快捷操作 -->
    <div class="finance-cards">
      <el-card class="finance-card" @click="navigateTo('payment')">
        <div class="card-content">
          <div class="card-icon">
            <el-icon><CreditCard /></el-icon>
          </div>
          <div class="card-info">
            <h3 class="card-title">付款申请</h3>
            <p class="card-description">提交项目相关的付款申请</p>
          </div>
          <el-icon class="card-arrow"><ArrowRight /></el-icon>
        </div>
      </el-card>
      <el-card class="finance-card" @click="navigateTo('flow')">
        <div class="card-content">
          <div class="card-icon">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <div class="card-info">
            <h3 class="card-title">收支流水</h3>
            <p class="card-description">查看所有资金往来记录</p>
          </div>
          <el-icon class="card-arrow"><ArrowRight /></el-icon>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFinanceStore } from '../../stores'
import { Plus, CreditCard, TrendCharts, ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()
const financeStore = useFinanceStore()

const receivables = computed(() => {
  return financeStore.receivables.map(receivable => ({
    ...receivable,
    uninvoiced_amount: receivable.contract_amount - receivable.invoiced_amount,
    unreceived_amount: receivable.contract_amount - receivable.received_amount,
    invoice_status: receivable.invoiced_amount === 0 ? '未开票' : 
                   receivable.invoiced_amount < receivable.contract_amount ? '部分开票' : '已开齐',
    payment_status: receivable.received_amount === 0 ? '未回款' : 
                    receivable.received_amount < receivable.contract_amount ? '部分回款' : '已结清'
  }))
})

const getInvoiceStatusType = (status) => {
  const statusMap = {
    '未开票': 'warning',
    '部分开票': 'info',
    '已开齐': 'success'
  }
  return statusMap[status] || 'info'
}

const getPaymentStatusType = (status) => {
  const statusMap = {
    '未回款': 'warning',
    '部分回款': 'info',
    '已结清': 'success'
  }
  return statusMap[status] || 'info'
}

const navigateTo = (path) => {
  router.push(`/finance/${path}`)
}
</script>

<style scoped>
.finance {
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

.receivable-card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.finance-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.finance-card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.finance-card:hover {
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