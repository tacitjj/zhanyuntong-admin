<template>
  <div class="check">
    <h1 class="page-title">盘点单</h1>
    
    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" size="large" @click="openAddDialog">
        <el-icon><Plus /></el-icon>
        新增盘点单
      </el-button>
      <el-button size="large">
        <el-icon><Filter /></el-icon>
        筛选
      </el-button>
    </div>
    
    <!-- 盘点单列表 -->
    <el-card class="check-card">
      <template #header>
        <div class="card-header">
          <span>盘点记录</span>
        </div>
      </template>
      <el-table :data="checkList" style="width: 100%">
        <el-table-column prop="date" label="盘点日期" width="120" />
        <el-table-column prop="material" label="物料" min-width="150" />
        <el-table-column prop="bookQty" label="账面数量" width="100" />
        <el-table-column prop="actualQty" label="实盘数量" width="100" />
        <el-table-column prop="diffQty" label="差异数量" width="100">
          <template #default="scope">
            <span :class="scope.row.diffQty > 0 ? 'text-green' : scope.row.diffQty < 0 ? 'text-red' : ''">
              {{ scope.row.diffQty }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="差异原因" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" plain @click="openEditDialog(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" plain @click="deleteCheck(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 盘点单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑盘点单' : '新增盘点单'"
      width="500px"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="盘点日期">
          <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="物料">
          <el-select v-model="form.material" placeholder="选择物料" style="width: 100%">
            <el-option label="多层板" value="多层板" />
            <el-option label="奥松板" value="奥松板" />
            <el-option label="方钢管" value="方钢管" />
            <el-option label="铝型材" value="铝型材" />
          </el-select>
        </el-form-item>
        <el-form-item label="账面数量">
          <el-input v-model="form.bookQty" type="number" placeholder="账面数量" />
        </el-form-item>
        <el-form-item label="实盘数量">
          <el-input v-model="form.actualQty" type="number" placeholder="实盘数量" />
        </el-form-item>
        <el-form-item label="差异数量" :disabled="true">
          <el-input v-model="form.diffQty" type="number" disabled />
        </el-form-item>
        <el-form-item label="差异原因">
          <el-input v-model="form.reason" type="textarea" placeholder="差异原因" />
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
import { ref, watch } from 'vue'
import { Plus, Filter } from '@element-plus/icons-vue'

const dialogVisible = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const form = ref({
  date: new Date(),
  material: '',
  bookQty: 0,
  actualQty: 0,
  diffQty: 0,
  reason: ''
})

// 监听账面数量和实盘数量变化，自动计算差异数量
watch([() => form.value.bookQty, () => form.value.actualQty], () => {
  form.value.diffQty = form.value.actualQty - form.value.bookQty
})

const checkList = ref([
  {
    id: 1,
    date: '2026-03-20',
    material: '多层板',
    bookQty: 120,
    actualQty: 118,
    diffQty: -2,
    reason: '损耗'
  },
  {
    id: 2,
    date: '2026-03-20',
    material: '奥松板',
    bookQty: 30,
    actualQty: 25,
    diffQty: -5,
    reason: '损耗'
  },
  {
    id: 3,
    date: '2026-03-20',
    material: '方钢管',
    bookQty: 100,
    actualQty: 100,
    diffQty: 0,
    reason: '无差异'
  }
])

const openAddDialog = () => {
  isEditing.value = false
  editingId.value = null
  form.value = {
    date: new Date(),
    material: '',
    bookQty: 0,
    actualQty: 0,
    diffQty: 0,
    reason: ''
  }
  dialogVisible.value = true
}

const openEditDialog = (check) => {
  isEditing.value = true
  editingId.value = check.id
  form.value = {
    date: new Date(check.date),
    material: check.material,
    bookQty: check.bookQty,
    actualQty: check.actualQty,
    diffQty: check.diffQty,
    reason: check.reason
  }
  dialogVisible.value = true
}

const submitForm = () => {
  if (isEditing.value) {
    // 编辑现有记录
    const index = checkList.value.findIndex(item => item.id === editingId.value)
    if (index !== -1) {
      checkList.value[index] = {
        ...checkList.value[index],
        date: form.value.date.toISOString().split('T')[0],
        material: form.value.material,
        bookQty: form.value.bookQty,
        actualQty: form.value.actualQty,
        diffQty: form.value.diffQty,
        reason: form.value.reason
      }
    }
  } else {
    // 新增记录
    checkList.value.unshift({
      id: checkList.value.length + 1,
      date: form.value.date.toISOString().split('T')[0],
      material: form.value.material,
      bookQty: form.value.bookQty,
      actualQty: form.value.actualQty,
      diffQty: form.value.diffQty,
      reason: form.value.reason
    })
  }
  dialogVisible.value = false
}

const deleteCheck = (id) => {
  checkList.value = checkList.value.filter(item => item.id !== id)
}
</script>

<style scoped>
.check {
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

.check-card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text-green {
  color: #67c23a;
}

.text-red {
  color: #f56c6c;
}
</style>