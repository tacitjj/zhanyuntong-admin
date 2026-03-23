<template>
  <div class="work-log">
    <h1 class="page-title">工人报工</h1>
    
    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" size="large" @click="openAddDialog">
        <el-icon><Plus /></el-icon>
        新增报工
      </el-button>
      <el-button size="large">
        <el-icon><Filter /></el-icon>
        筛选
      </el-button>
      <el-button size="large">
        <el-icon><Download /></el-icon>
        导出
      </el-button>
    </div>
    
    <!-- 报工列表 -->
    <el-card class="work-log-card">
      <template #header>
        <div class="card-header">
          <span>报工记录</span>
          <el-input
            v-model="searchQuery"
            placeholder="搜索项目或工人"
            prefix-icon="Search"
            style="width: 300px"
          />
        </div>
      </template>
      <el-table :data="filteredWorkLogs" style="width: 100%">
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="project" label="项目" min-width="180" />
        <el-table-column prop="worker" label="工人" width="150" />
        <el-table-column prop="hours" label="工时" width="80" />
        <el-table-column prop="progress" label="进度" width="100">
          <template #default="scope">
            {{ scope.row.progress }}%
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" plain @click="openEditDialog(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" plain @click="deleteWorkLog(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="workLogs.length"
        />
      </div>
    </el-card>
    
    <!-- 报工对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑报工' : '新增报工'"
      width="500px"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="日期">
          <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="项目">
          <el-select v-model="form.project" placeholder="选择项目" style="width: 100%">
            <el-option label="佳杰朱青项目1" value="佳杰朱青项目1" />
            <el-option label="恒远科技项目" value="恒远科技项目" />
            <el-option label="新奥能源项目" value="新奥能源项目" />
          </el-select>
        </el-form-item>
        <el-form-item label="工人">
          <el-input v-model="form.worker" placeholder="姓名+工种（如李师傅-木工）" />
        </el-form-item>
        <el-form-item label="工时">
          <el-input-number v-model="form.hours" :min="0.5" :step="0.5" />
        </el-form-item>
        <el-form-item label="进度">
          <el-slider v-model="form.progress" :min="0" :max="100" show-input />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="工作内容说明" />
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
import { ref, computed } from 'vue'
import { Plus, Filter, Download, Search } from '@element-plus/icons-vue'

const dialogVisible = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const isEditing = ref(false)
const editingId = ref(null)

const form = ref({
  date: new Date(),
  project: '',
  worker: '',
  hours: 1,
  progress: 0,
  remark: ''
})

const workLogs = ref([
  {
    id: 1,
    date: '2026-03-20',
    project: '佳杰朱青项目1',
    worker: '李师傅(木工)',
    hours: 2,
    progress: 23,
    remark: '完成基础框架搭建'
  },
  {
    id: 2,
    date: '2026-03-20',
    project: '佳杰朱青项目1',
    worker: '王师傅(油漆)',
    hours: 5,
    progress: 26,
    remark: '完成底漆涂刷'
  },
  {
    id: 3,
    date: '2026-03-19',
    project: '新奥能源项目',
    worker: '张师傅(电工)',
    hours: 8,
    progress: 45,
    remark: '完成电路布线'
  }
])

const filteredWorkLogs = computed(() => {
  if (!searchQuery.value) {
    return workLogs.value
  }
  const query = searchQuery.value.toLowerCase()
  return workLogs.value.filter(log => 
    log.project.toLowerCase().includes(query) || 
    log.worker.toLowerCase().includes(query)
  )
})

const openAddDialog = () => {
  isEditing.value = false
  editingId.value = null
  form.value = {
    date: new Date(),
    project: '',
    worker: '',
    hours: 1,
    progress: 0,
    remark: ''
  }
  dialogVisible.value = true
}

const openEditDialog = (workLog) => {
  isEditing.value = true
  editingId.value = workLog.id
  form.value = {
    date: new Date(workLog.date),
    project: workLog.project,
    worker: workLog.worker,
    hours: workLog.hours,
    progress: workLog.progress,
    remark: workLog.remark
  }
  dialogVisible.value = true
}

const submitForm = () => {
  if (isEditing.value) {
    // 编辑现有记录
    const index = workLogs.value.findIndex(log => log.id === editingId.value)
    if (index !== -1) {
      workLogs.value[index] = {
        ...workLogs.value[index],
        date: form.value.date.toISOString().split('T')[0],
        project: form.value.project,
        worker: form.value.worker,
        hours: form.value.hours,
        progress: form.value.progress,
        remark: form.value.remark
      }
    }
  } else {
    // 新增记录
    workLogs.value.unshift({
      id: workLogs.value.length + 1,
      date: form.value.date.toISOString().split('T')[0],
      project: form.value.project,
      worker: form.value.worker,
      hours: form.value.hours,
      progress: form.value.progress,
      remark: form.value.remark
    })
  }
  dialogVisible.value = false
}

const deleteWorkLog = (id) => {
  workLogs.value = workLogs.value.filter(log => log.id !== id)
}
</script>

<style scoped>
.work-log {
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

.work-log-card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>