<template>
  <div class="payment">
    <h1 class="page-title">付款申请</h1>
    
    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" size="large" @click="openAddDialog">
        <el-icon><Plus /></el-icon>
        新增付款申请
      </el-button>
      <el-button size="large">
        <el-icon><Filter /></el-icon>
        筛选
      </el-button>
    </div>
    
    <!-- 付款申请列表 -->
    <el-card class="payment-card">
      <template #header>
        <div class="card-header">
          <span>付款申请记录</span>
        </div>
      </template>
      <el-table :data="paymentList" style="width: 100%">
        <el-table-column prop="date" label="申请日期" width="120" />
        <el-table-column prop="project" label="关联项目" min-width="180" />
        <el-table-column prop="type" label="付款类型" width="120" />
        <el-table-column prop="payee" label="收款方" width="150" />
        <el-table-column prop="amount" label="金额" width="120">
          <template #default="scope">
            ¥{{ scope.row.amount.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="付款事由" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" plain @click="openEditDialog(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" plain @click="deletePayment(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 付款申请对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑付款申请' : '新增付款申请'"
      width="500px"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="申请日期">
          <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="关联项目">
          <el-select v-model="form.project" placeholder="选择项目" style="width: 100%">
            <el-option label="佳杰朱青项目1" value="佳杰朱青项目1" />
            <el-option label="恒远科技项目" value="恒远科技项目" />
            <el-option label="新奥能源项目" value="新奥能源项目" />
          </el-select>
        </el-form-item>
        <el-form-item label="付款类型">
          <el-select v-model="form.type" placeholder="选择付款类型" style="width: 100%">
            <el-option label="材料款" value="材料款" />
            <el-option label="人工费" value="人工费" />
            <el-option label="外包费" value="外包费" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="收款方">
          <el-input v-model="form.payee" placeholder="供应商/工人/合作方" />
        </el-form-item>
        <el-form-item label="金额">
          <el-input v-model="form.amount" type="number" placeholder="付款金额" />
        </el-form-item>
        <el-form-item label="付款事由">
          <el-input v-model="form.reason" type="textarea" placeholder="具体说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus, Filter } from '@element-plus/icons-vue'

const dialogVisible = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const form = ref({
  date: new Date(),
  project: '',
  type: '',
  payee: '',
  amount: 0,
  reason: ''
})

const paymentList = ref([
  {
    id: 1,
    date: '2026-03-20',
    project: '佳杰朱青项目1',
    type: '材料款',
    payee: '建材供应商',
    amount: 20000,
    reason: '采购建材',
    status: '已付款'
  },
  {
    id: 2,
    date: '2026-03-19',
    project: '佳杰朱青项目1',
    type: '人工费',
    payee: '李师傅',
    amount: 10000,
    reason: '工人工资',
    status: '已审批'
  },
  {
    id: 3,
    date: '2026-03-18',
    project: '新奥能源项目',
    type: '外包费',
    payee: '外协单位',
    amount: 30000,
    reason: '外包服务',
    status: '待审批'
  }
])

const getStatusType = (status) => {
  const statusMap = {
    '待审批': 'warning',
    '已审批': 'info',
    '已付款': 'success'
  }
  return statusMap[status] || 'info'
}

const openAddDialog = () => {
  isEditing.value = false
  editingId.value = null
  form.value = {
    date: new Date(),
    project: '',
    type: '',
    payee: '',
    amount: 0,
    reason: ''
  }
  dialogVisible.value = true
}

const openEditDialog = (payment) => {
  isEditing.value = true
  editingId.value = payment.id
  form.value = {
    date: new Date(payment.date),
    project: payment.project,
    type: payment.type,
    payee: payment.payee,
    amount: payment.amount,
    reason: payment.reason
  }
  dialogVisible.value = true
}

const submitForm = () => {
  if (isEditing.value) {
    // 编辑现有记录
    const index = paymentList.value.findIndex(item => item.id === editingId.value)
    if (index !== -1) {
      paymentList.value[index] = {
        ...paymentList.value[index],
        date: form.value.date.toISOString().split('T')[0],
        project: form.value.project,
        type: form.value.type,
        payee: form.value.payee,
        amount: form.value.amount,
        reason: form.value.reason
      }
    }
  } else {
    // 新增记录
    paymentList.value.unshift({
      id: paymentList.value.length + 1,
      date: form.value.date.toISOString().split('T')[0],
      project: form.value.project,
      type: form.value.type,
      payee: form.value.payee,
      amount: form.value.amount,
      reason: form.value.reason,
      status: '待审批'
    })
  }
  dialogVisible.value = false
}

const deletePayment = (id) => {
  paymentList.value = paymentList.value.filter(item => item.id !== id)
}
</script>

<style scoped>
.payment {
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

.action-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
}

.payment-card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>