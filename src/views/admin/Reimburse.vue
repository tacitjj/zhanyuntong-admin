<template>
  <div class="reimburse">
    <h1 class="page-title">费用报销</h1>
    
    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" size="large" @click="openAddDialog">
        <el-icon><Plus /></el-icon>
        新增报销
      </el-button>
      <el-button size="large">
        <el-icon><Filter /></el-icon>
        筛选
      </el-button>
    </div>
    
    <!-- 费用报销列表 -->
    <el-card class="reimburse-card">
      <template #header>
        <div class="card-header">
          <span>报销记录</span>
        </div>
      </template>
      <el-table :data="reimburseList" style="width: 100%">
        <el-table-column prop="date" label="申请日期" width="120" />
        <el-table-column prop="reporter" label="报销人" width="100" />
        <el-table-column prop="type" label="费用类型" width="120" />
        <el-table-column prop="project" label="关联项目" min-width="180" />
        <el-table-column prop="amount" label="金额" width="120">
          <template #default="scope">
            ¥{{ scope.row.amount.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="费用说明" />
        <el-table-column prop="status" label="审批状态" width="120">
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
            <el-button type="danger" size="small" plain @click="deleteReimburse(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 费用报销对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑费用报销' : '新增费用报销'"
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
        <el-form-item label="报销人">
          <el-input v-model="form.reporter" placeholder="报销人姓名" />
        </el-form-item>
        <el-form-item label="费用类型">
          <el-select v-model="form.type" placeholder="选择费用类型" style="width: 100%">
            <el-option label="差旅费" value="差旅费" />
            <el-option label="办公费" value="办公费" />
            <el-option label="招待费" value="招待费" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="关联项目">
          <el-select v-model="form.project" placeholder="选择项目" style="width: 100%">
            <el-option label="佳杰朱青项目1" value="佳杰朱青项目1" />
            <el-option label="恒远科技项目" value="恒远科技项目" />
            <el-option label="新奥能源项目" value="新奥能源项目" />
          </el-select>
        </el-form-item>
        <el-form-item label="金额">
          <el-input v-model="form.amount" type="number" placeholder="报销金额" />
        </el-form-item>
        <el-form-item label="费用说明">
          <el-input v-model="form.description" type="textarea" placeholder="费用说明" />
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
  reporter: '',
  type: '',
  project: '',
  amount: 0,
  description: ''
})

const reimburseList = ref([
  {
    id: 1,
    date: '2026-03-20',
    reporter: '张三',
    type: '差旅费',
    project: '佳杰朱青项目1',
    amount: 2000,
    description: '项目出差费用',
    status: '已通过'
  },
  {
    id: 2,
    date: '2026-03-19',
    reporter: '李四',
    type: '办公费',
    project: null,
    amount: 500,
    description: '购买办公用品',
    status: '待审批'
  },
  {
    id: 3,
    date: '2026-03-18',
    reporter: '王五',
    type: '招待费',
    project: '新奥能源项目',
    amount: 1000,
    description: '客户招待费用',
    status: '已驳回'
  }
])

const getStatusType = (status) => {
  const statusMap = {
    '待审批': 'warning',
    '已通过': 'success',
    '已驳回': 'danger',
    '已打款': 'info'
  }
  return statusMap[status] || 'info'
}

const openAddDialog = () => {
  isEditing.value = false
  editingId.value = null
  form.value = {
    date: new Date(),
    reporter: '',
    type: '',
    project: '',
    amount: 0,
    description: ''
  }
  dialogVisible.value = true
}

const openEditDialog = (reimburse) => {
  isEditing.value = true
  editingId.value = reimburse.id
  form.value = {
    date: new Date(reimburse.date),
    reporter: reimburse.reporter,
    type: reimburse.type,
    project: reimburse.project,
    amount: reimburse.amount,
    description: reimburse.description
  }
  dialogVisible.value = true
}

const submitForm = () => {
  if (isEditing.value) {
    // 编辑现有记录
    const index = reimburseList.value.findIndex(item => item.id === editingId.value)
    if (index !== -1) {
      reimburseList.value[index] = {
        ...reimburseList.value[index],
        date: form.value.date.toISOString().split('T')[0],
        reporter: form.value.reporter,
        type: form.value.type,
        project: form.value.project,
        amount: form.value.amount,
        description: form.value.description
      }
    }
  } else {
    // 新增记录
    reimburseList.value.unshift({
      id: reimburseList.value.length + 1,
      date: form.value.date.toISOString().split('T')[0],
      reporter: form.value.reporter,
      type: form.value.type,
      project: form.value.project,
      amount: form.value.amount,
      description: form.value.description,
      status: '待审批'
    })
  }
  dialogVisible.value = false
}

const deleteReimburse = (id) => {
  reimburseList.value = reimburseList.value.filter(item => item.id !== id)
}
</script>

<style scoped>
.reimburse {
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

.reimburse-card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>