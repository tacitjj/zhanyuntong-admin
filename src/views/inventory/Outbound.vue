<template>
  <div class="outbound">
    <h1 class="page-title">出库单</h1>
    
    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" size="large" @click="openAddDialog">
        <el-icon><Plus /></el-icon>
        新增出库单
      </el-button>
      <el-button size="large">
        <el-icon><Filter /></el-icon>
        筛选
      </el-button>
    </div>
    
    <!-- 出库单列表 -->
    <el-card class="outbound-card">
      <template #header>
        <div class="card-header">
          <span>出库记录</span>
        </div>
      </template>
      <el-table :data="outboundList" style="width: 100%">
        <el-table-column prop="date" label="出库日期" width="120" />
        <el-table-column prop="type" label="出库类型" width="120" />
        <el-table-column prop="project" label="关联项目" min-width="180" />
        <el-table-column prop="material" label="物料" min-width="150" />
        <el-table-column prop="qty" label="数量" width="80" />
        <el-table-column prop="recipient" label="领用人" width="100" />
        <el-table-column prop="purpose" label="用途说明" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" plain @click="openEditDialog(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" plain @click="deleteOutbound(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 出库单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑出库单' : '新增出库单'"
      width="500px"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="出库日期">
          <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="出库类型">
          <el-select v-model="form.type" placeholder="选择出库类型" style="width: 100%">
            <el-option label="项目领用" value="项目领用" />
            <el-option label="退货出库" value="退货出库" />
            <el-option label="调拨出库" value="调拨出库" />
          </el-select>
        </el-form-item>
        <el-form-item label="关联项目">
          <el-select v-model="form.project" placeholder="选择项目" style="width: 100%">
            <el-option label="佳杰朱青项目1" value="佳杰朱青项目1" />
            <el-option label="恒远科技项目" value="恒远科技项目" />
            <el-option label="新奥能源项目" value="新奥能源项目" />
          </el-select>
        </el-form-item>
        <el-form-item label="物料">
          <el-select v-model="form.material" placeholder="选择物料" style="width: 100%">
            <el-option label="多层板" value="多层板" />
            <el-option label="奥松板" value="奥松板" />
            <el-option label="方钢管" value="方钢管" />
            <el-option label="铝型材" value="铝型材" />
          </el-select>
        </el-form-item>
        <el-form-item label="数量">
          <el-input-number v-model="form.qty" :min="1" />
        </el-form-item>
        <el-form-item label="领用人">
          <el-input v-model="form.recipient" placeholder="领用人姓名" />
        </el-form-item>
        <el-form-item label="用途说明">
          <el-input v-model="form.purpose" type="textarea" placeholder="用途说明" />
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
  type: '项目领用',
  project: '',
  material: '',
  qty: 1,
  recipient: '',
  purpose: ''
})

const outboundList = ref([
  {
    id: 1,
    date: '2026-03-20',
    type: '项目领用',
    project: '佳杰朱青项目1',
    material: '多层板',
    qty: 20,
    recipient: '李师傅',
    purpose: '用于搭建框架'
  },
  {
    id: 2,
    date: '2026-03-19',
    type: '项目领用',
    project: '新奥能源项目',
    material: '方钢管',
    qty: 50,
    recipient: '王师傅',
    purpose: '用于结构支撑'
  }
])

const openAddDialog = () => {
  isEditing.value = false
  editingId.value = null
  form.value = {
    date: new Date(),
    type: '项目领用',
    project: '',
    material: '',
    qty: 1,
    recipient: '',
    purpose: ''
  }
  dialogVisible.value = true
}

const openEditDialog = (outbound) => {
  isEditing.value = true
  editingId.value = outbound.id
  form.value = {
    date: new Date(outbound.date),
    type: outbound.type,
    project: outbound.project,
    material: outbound.material,
    qty: outbound.qty,
    recipient: outbound.recipient,
    purpose: outbound.purpose
  }
  dialogVisible.value = true
}

const submitForm = () => {
  if (isEditing.value) {
    // 编辑现有记录
    const index = outboundList.value.findIndex(item => item.id === editingId.value)
    if (index !== -1) {
      outboundList.value[index] = {
        ...outboundList.value[index],
        date: form.value.date.toISOString().split('T')[0],
        type: form.value.type,
        project: form.value.project,
        material: form.value.material,
        qty: form.value.qty,
        recipient: form.value.recipient,
        purpose: form.value.purpose
      }
    }
  } else {
    // 新增记录
    outboundList.value.unshift({
      id: outboundList.value.length + 1,
      date: form.value.date.toISOString().split('T')[0],
      type: form.value.type,
      project: form.value.project,
      material: form.value.material,
      qty: form.value.qty,
      recipient: form.value.recipient,
      purpose: form.value.purpose
    })
  }
  dialogVisible.value = false
}

const deleteOutbound = (id) => {
  outboundList.value = outboundList.value.filter(item => item.id !== id)
}
</script>

<style scoped>
.outbound {
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

.outbound-card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>