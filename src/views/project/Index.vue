<template>
  <div class="project">
    <h1 class="page-title">项目管理</h1>
    
    <!-- 状态流转图 -->
    <el-card class="status-flow-card">
      <template #header>
        <div class="card-header">
          <span>项目状态流转图</span>
        </div>
      </template>
      <div class="status-flow-diagram">
        <div class="flow-node" v-for="(transitions, status) in statusTransitions" :key="status">
          <div class="node-title">{{ status }}</div>
          <div class="node-connections">
            <div class="connection" v-for="targetStatus in transitions" :key="targetStatus">
              → {{ targetStatus }}
            </div>
          </div>
        </div>
      </div>
    </el-card>
    
    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" size="large" @click="openCreateDialog">
        <el-icon><Plus /></el-icon>
        新建项目
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
    
    <!-- 项目列表 -->
    <el-card class="project-card">
      <template #header>
        <div class="card-header">
          <span>项目列表</span>
          <el-input
            v-model="searchQuery"
            placeholder="搜索项目名称或编号"
            prefix-icon="Search"
            style="width: 300px"
          />
        </div>
      </template>
      <el-table :data="filteredProjects" style="width: 100%">
        <el-table-column prop="project_no" label="项目编号" width="120" />
        <el-table-column prop="name" label="项目名称" min-width="180">
          <template #default="scope">
            <router-link :to="`/project/detail/${scope.row.id}`" class="project-link">
              {{ scope.row.name }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="customer_name" label="客户" width="120" />
        <el-table-column prop="contract_amount" label="合同额" width="120">
          <template #default="scope">
            ¥{{ scope.row.contract_amount.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)" style="cursor: pointer" @click="showStatusHistory(scope.row)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="manager_name" label="项目经理" width="100" />
        <el-table-column prop="start_date" label="进场日" width="120" />
        <el-table-column label="操作" width="300" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" plain @click="openPaymentDialog(scope.row)">
              付款申请
            </el-button>
            <el-button type="success" size="small" plain @click="openSettlementDialog(scope.row)">
              项目结算
            </el-button>
            <el-button type="info" size="small" plain @click="openInvoiceDialog(scope.row)">
              发票申请
            </el-button>
            <el-dropdown>
              <el-button type="warning" size="small" plain>
                状态操作
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-if="scope.row.status === '立项中'" @click="changeStatus(scope.row, '设计中')">
                    开始设计
                  </el-dropdown-item>
                  <el-dropdown-item v-if="scope.row.status === '设计中'" @click="changeStatus(scope.row, '搭建中')">
                    开始搭建
                  </el-dropdown-item>
                  <el-dropdown-item v-if="scope.row.status === '搭建中'" @click="changeStatus(scope.row, '执行中')">
                    开始执行
                  </el-dropdown-item>
                  <el-dropdown-item v-if="scope.row.status === '执行中'" @click="changeStatus(scope.row, '已结项')">
                    项目结项
                  </el-dropdown-item>
                  <el-dropdown-item v-if="scope.row.status !== '暂停' && scope.row.status !== '已结项'" @click="pauseProject(scope.row)">
                    暂停项目
                  </el-dropdown-item>
                  <el-dropdown-item v-if="scope.row.status !== '已结项'" @click="cancelProject(scope.row)">
                    取消项目
                  </el-dropdown-item>
                  <el-dropdown-item v-if="scope.row.status === '暂停'" @click="restartProject(scope.row)">
                    重启项目
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
          :total="projects.length"
        />
      </div>
    </el-card>
    
    <!-- 项目结算弹窗 -->
    <el-dialog
      v-model="settlementDialogVisible"
      title="项目结算"
      width="600px"
    >
      <el-form :model="settlementForm" label-width="100px">
        <el-form-item label="项目名称">
          <el-input v-model="settlementForm.projectName" disabled />
        </el-form-item>
        <el-form-item label="合同额">
          <el-input v-model="settlementForm.contractAmount" disabled />
        </el-form-item>
        <el-form-item label="人工成本">
          <el-input v-model="settlementForm.laborCost" type="number" />
        </el-form-item>
        <el-form-item label="材料成本">
          <el-input v-model="settlementForm.materialCost" type="number" />
        </el-form-item>
        <el-form-item label="外协费">
          <el-input v-model="settlementForm.outsourcingCost" type="number" />
        </el-form-item>
        <el-form-item label="行政费">
          <el-input v-model="settlementForm.adminCost" type="number" />
        </el-form-item>
        <el-form-item label="其他费用">
          <el-input v-model="settlementForm.otherCost" type="number" />
        </el-form-item>
        <el-form-item label="总成本">
          <el-input v-model="settlementForm.totalCost" disabled />
        </el-form-item>
        <el-form-item label="利润">
          <el-input v-model="settlementForm.profit" disabled />
        </el-form-item>
        <el-form-item label="结算状态">
          <el-select v-model="settlementForm.status" placeholder="选择结算状态">
            <el-option label="待结算" value="待结算" />
            <el-option label="已结算" value="已结算" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="settlementDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitSettlement">提交结算</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 新建项目弹窗 -->
    <el-dialog
      v-model="createDialogVisible"
      title="新建项目"
      width="600px"
    >
      <el-form :model="createForm" label-width="100px">
        <el-form-item label="项目名称">
          <el-input v-model="createForm.name" placeholder="客户名+项目类型" />
        </el-form-item>
        <el-form-item label="客户">
          <el-input v-model="createForm.customerName" placeholder="客户名称" />
        </el-form-item>
        <el-form-item label="合同额">
          <el-input v-model="createForm.contractAmount" type="number" placeholder="项目总金额" />
        </el-form-item>
        <el-form-item label="项目经理">
          <el-select v-model="createForm.managerId" placeholder="选择项目经理">
            <el-option label="李经理" value="1" />
            <el-option label="王经理" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="进场日">
          <el-date-picker v-model="createForm.startDate" type="date" placeholder="选择日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="createForm.status" placeholder="选择状态">
            <el-option label="立项中" value="立项中" />
            <el-option label="设计中" value="设计中" />
            <el-option label="搭建中" value="搭建中" />
            <el-option label="执行中" value="执行中" />
            <el-option label="已结项" value="已结项" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitCreate">创建项目</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 付款申请弹窗 -->
    <el-dialog
      v-model="paymentDialogVisible"
      title="付款申请"
      width="600px"
    >
      <el-form :model="paymentForm" label-width="100px">
        <el-form-item label="申请日期">
          <el-date-picker v-model="paymentForm.date" type="date" placeholder="选择日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="关联项目">
          <el-select v-model="paymentForm.projectId" placeholder="选择项目">
            <el-option v-for="project in projects" :key="project.id" :label="project.name" :value="project.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="付款类型">
          <el-select v-model="paymentForm.payType" placeholder="选择付款类型">
            <el-option label="材料款" value="材料款" />
            <el-option label="人工费" value="人工费" />
            <el-option label="外包费" value="外包费" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="收款方">
          <el-input v-model="paymentForm.payee" placeholder="供应商/工人/合作方" />
        </el-form-item>
        <el-form-item label="金额">
          <el-input v-model="paymentForm.amount" type="number" placeholder="付款金额" />
        </el-form-item>
        <el-form-item label="付款事由">
          <el-input v-model="paymentForm.reason" type="textarea" placeholder="具体说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="paymentDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitPayment">提交申请</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 发票申请弹窗 -->
    <el-dialog
      v-model="invoiceDialogVisible"
      title="发票申请"
      width="600px"
    >
      <el-form :model="invoiceForm" label-width="100px">
        <el-form-item label="申请日期">
          <el-date-picker v-model="invoiceForm.date" type="date" placeholder="选择日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="关联项目">
          <el-select v-model="invoiceForm.projectId" placeholder="选择项目">
            <el-option v-for="project in projects" :key="project.id" :label="project.name" :value="project.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="开票金额">
          <el-input v-model="invoiceForm.amount" type="number" placeholder="开票金额" />
        </el-form-item>
        <el-form-item label="发票号">
          <el-input v-model="invoiceForm.invoiceNo" placeholder="发票号码" />
        </el-form-item>
        <el-form-item label="开票日期">
          <el-date-picker v-model="invoiceForm.invoiceDate" type="date" placeholder="选择日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="invoiceForm.remark" type="textarea" placeholder="备注说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="invoiceDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitInvoice">提交申请</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 状态变更确认弹窗 -->
    <el-dialog
      v-model="statusChangeDialogVisible"
      :title="`确认状态变更：${statusChangeForm.oldStatus} → ${statusChangeForm.newStatus}`"
      width="400px"
    >
      <el-form :model="statusChangeForm" label-width="80px">
        <el-form-item label="项目名称">
          <el-input v-model="statusChangeForm.projectName" disabled />
        </el-form-item>
        <el-form-item label="当前状态">
          <el-input v-model="statusChangeForm.oldStatus" disabled />
        </el-form-item>
        <el-form-item label="目标状态">
          <el-input v-model="statusChangeForm.newStatus" disabled />
        </el-form-item>
        <el-form-item label="变更原因">
          <el-input v-model="statusChangeForm.reason" type="textarea" placeholder="请输入变更原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="statusChangeDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmStatusChange">确认变更</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 状态历史记录弹窗 -->
    <el-dialog
      v-model="statusHistoryDialogVisible"
      :title="`${statusHistoryForm.projectName} - 状态历史`"
      width="600px"
    >
      <el-table :data="statusHistoryForm.history" style="width: 100%">
        <el-table-column prop="time" label="变更时间" width="180" />
        <el-table-column prop="oldStatus" label="变更前状态" width="120" />
        <el-table-column prop="newStatus" label="变更后状态" width="120" />
        <el-table-column prop="operator" label="操作人" width="100" />
        <el-table-column prop="reason" label="变更原因" />
      </el-table>
      <template #footer>
        <el-button @click="statusHistoryDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
    
    <!-- 特殊场景处理弹窗 -->
    <el-dialog
      v-model="specialActionDialogVisible"
      :title="specialActionForm.title"
      width="400px"
    >
      <el-form :model="specialActionForm" label-width="80px">
        <el-form-item label="项目名称">
          <el-input v-model="specialActionForm.projectName" disabled />
        </el-form-item>
        <el-form-item label="当前状态">
          <el-input v-model="specialActionForm.currentStatus" disabled />
        </el-form-item>
        <el-form-item label="操作类型">
          <el-input v-model="specialActionForm.actionType" disabled />
        </el-form-item>
        <el-form-item label="操作原因">
          <el-input v-model="specialActionForm.reason" type="textarea" placeholder="请输入操作原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="specialActionDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmSpecialAction">确认操作</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useProjectStore } from '../../stores'
import { Plus, Filter, Download, Search, ArrowDown } from '@element-plus/icons-vue'

const projectStore = useProjectStore()

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

// 弹窗状态
const settlementDialogVisible = ref(false)
const createDialogVisible = ref(false)
const paymentDialogVisible = ref(false)
const invoiceDialogVisible = ref(false)
const statusChangeDialogVisible = ref(false)
const statusHistoryDialogVisible = ref(false)
const specialActionDialogVisible = ref(false)

// 表单数据
const settlementForm = ref({
  projectName: '',
  contractAmount: '',
  laborCost: 0,
  materialCost: 0,
  outsourcingCost: 0,
  adminCost: 0,
  otherCost: 0,
  totalCost: 0,
  profit: 0,
  status: '待结算'
})

const createForm = ref({
  name: '',
  customerName: '',
  contractAmount: 0,
  managerId: '',
  startDate: new Date(),
  status: '立项中'
})

const paymentForm = ref({
  date: new Date(),
  projectId: '',
  payType: '',
  payee: '',
  amount: 0,
  reason: ''
})

const invoiceForm = ref({
  date: new Date(),
  projectId: '',
  amount: 0,
  invoiceNo: '',
  invoiceDate: new Date(),
  remark: ''
})

// 状态变更表单
const statusChangeForm = ref({
  projectId: '',
  projectName: '',
  oldStatus: '',
  newStatus: '',
  reason: ''
})

// 状态历史记录表单
const statusHistoryForm = ref({
  projectId: '',
  projectName: '',
  history: []
})

// 特殊场景处理表单
const specialActionForm = ref({
  projectId: '',
  projectName: '',
  currentStatus: '',
  actionType: '',
  title: '',
  reason: ''
})

const projects = computed(() => projectStore.projects)

const filteredProjects = computed(() => {
  if (!searchQuery.value) {
    return projects.value
  }
  const query = searchQuery.value.toLowerCase()
  return projects.value.filter(project => 
    project.name.toLowerCase().includes(query) || 
    project.project_no.toLowerCase().includes(query)
  )
})

// 状态流转规则
const statusTransitions = computed(() => projectStore.statusTransitions)

const getStatusType = (status) => {
  const statusMap = {
    '立项中': 'primary',
    '设计中': 'primary',
    '搭建中': 'primary',
    '执行中': 'primary',
    '已结项': 'success',
    '暂停': 'warning'
  }
  return statusMap[status] || 'info'
}

// 打开新建项目弹窗
const openCreateDialog = () => {
  createForm.value = {
    name: '',
    customerName: '',
    contractAmount: 0,
    managerId: '',
    startDate: new Date(),
    status: '立项中'
  }
  createDialogVisible.value = true
}

// 提交新建项目
const submitCreate = () => {
  // 提交新建项目逻辑
  console.log('新建项目:', createForm.value)
  createDialogVisible.value = false
  // 这里可以添加实际的提交逻辑，比如调用API
}

// 打开付款申请弹窗
const openPaymentDialog = (project) => {
  paymentForm.value = {
    date: new Date(),
    projectId: project.id,
    payType: '',
    payee: '',
    amount: 0,
    reason: ''
  }
  paymentDialogVisible.value = true
}

// 提交付款申请
const submitPayment = () => {
  // 提交付款申请逻辑
  console.log('付款申请:', paymentForm.value)
  paymentDialogVisible.value = false
  // 这里可以添加实际的提交逻辑，比如调用API
}

// 打开发票申请弹窗
const openInvoiceDialog = (project) => {
  invoiceForm.value = {
    date: new Date(),
    projectId: project.id,
    amount: 0,
    invoiceNo: '',
    invoiceDate: new Date(),
    remark: ''
  }
  invoiceDialogVisible.value = true
}

// 提交发票申请
const submitInvoice = () => {
  // 提交发票申请逻辑
  console.log('发票申请:', invoiceForm.value)
  invoiceDialogVisible.value = false
  // 这里可以添加实际的提交逻辑，比如调用API
}

// 打开项目结算弹窗
const openSettlementDialog = (project) => {
  // 模拟从系统中获取费用数据
  const laborCost = 20000 // 从工人报工中计算
  const materialCost = 30000 // 从采购申请中计算
  const outsourcingCost = 15000 // 从付款申请中计算
  const adminCost = 5000 // 从费用报销中计算
  const otherCost = 2000 // 其他费用
  
  const totalCost = laborCost + materialCost + outsourcingCost + adminCost + otherCost
  const profit = project.contract_amount - totalCost
  
  settlementForm.value = {
    projectName: project.name,
    contractAmount: project.contract_amount,
    laborCost: laborCost,
    materialCost: materialCost,
    outsourcingCost: outsourcingCost,
    adminCost: adminCost,
    otherCost: otherCost,
    totalCost: totalCost,
    profit: profit,
    status: '待结算'
  }
  settlementDialogVisible.value = true
}

// 提交项目结算
const submitSettlement = () => {
  // 提交结算逻辑
  console.log('提交结算:', settlementForm.value)
  settlementDialogVisible.value = false
  // 这里可以添加实际的提交逻辑，比如调用API
}

// 监听成本变化，自动计算总成本和利润
watch(
  () => [settlementForm.value.laborCost, settlementForm.value.materialCost, settlementForm.value.outsourcingCost, settlementForm.value.adminCost, settlementForm.value.otherCost],
  () => {
    settlementForm.value.totalCost = settlementForm.value.laborCost + settlementForm.value.materialCost + settlementForm.value.outsourcingCost + settlementForm.value.adminCost + settlementForm.value.otherCost
    settlementForm.value.profit = settlementForm.value.contractAmount - settlementForm.value.totalCost
  },
  { deep: true }
)

// 状态变更相关函数
const changeStatus = (project, newStatus) => {
  statusChangeForm.value = {
    projectId: project.id,
    projectName: project.name,
    oldStatus: project.status,
    newStatus: newStatus,
    reason: ''
  }
  statusChangeDialogVisible.value = true
}

const confirmStatusChange = () => {
  // 确认状态变更逻辑
  console.log('确认状态变更:', statusChangeForm.value)
  // 使用store方法更新项目状态
  projectStore.changeStatus(
    statusChangeForm.value.projectId,
    statusChangeForm.value.newStatus,
    statusChangeForm.value.reason
  )
  statusChangeDialogVisible.value = false
  // 这里可以添加实际的状态变更逻辑，比如调用API
}

const showStatusHistory = (project) => {
  // 使用项目的实际状态历史数据
  const history = project.status_history.map(record => ({
    time: record.time,
    oldStatus: record.old_status,
    newStatus: record.new_status,
    operator: record.operator,
    reason: record.reason
  }))
  statusHistoryForm.value = {
    projectId: project.id,
    projectName: project.name,
    history: history
  }
  statusHistoryDialogVisible.value = true
}

// 特殊场景处理函数
const pauseProject = (project) => {
  specialActionForm.value = {
    projectId: project.id,
    projectName: project.name,
    currentStatus: project.status,
    actionType: '暂停项目',
    title: '暂停项目',
    reason: ''
  }
  specialActionDialogVisible.value = true
}

const cancelProject = (project) => {
  specialActionForm.value = {
    projectId: project.id,
    projectName: project.name,
    currentStatus: project.status,
    actionType: '取消项目',
    title: '取消项目',
    reason: ''
  }
  specialActionDialogVisible.value = true
}

const restartProject = (project) => {
  specialActionForm.value = {
    projectId: project.id,
    projectName: project.name,
    currentStatus: project.status,
    actionType: '重启项目',
    title: '重启项目',
    reason: ''
  }
  specialActionDialogVisible.value = true
}

const confirmSpecialAction = () => {
  // 确认特殊操作逻辑
  console.log('确认特殊操作:', specialActionForm.value)
  // 使用store方法处理特殊操作
  if (specialActionForm.value.actionType === '暂停项目') {
    projectStore.pauseProject(
      specialActionForm.value.projectId,
      specialActionForm.value.reason
    )
  } else if (specialActionForm.value.actionType === '取消项目') {
    projectStore.cancelProject(
      specialActionForm.value.projectId,
      specialActionForm.value.reason
    )
  } else if (specialActionForm.value.actionType === '重启项目') {
    projectStore.restartProject(
      specialActionForm.value.projectId,
      specialActionForm.value.reason
    )
  }
  specialActionDialogVisible.value = false
  // 这里可以添加实际的操作逻辑，比如调用API
}
</script>

<style scoped>
.project {
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

.status-flow-card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.status-flow-diagram {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.flow-node {
  background-color: white;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 15px;
  min-width: 150px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.node-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
}

.node-connections {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.connection {
  font-size: 14px;
  color: #666;
  padding: 3px 0;
}

.project-card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-link {
  color: #1890ff;
  text-decoration: none;
}

.project-link:hover {
  text-decoration: underline;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.status-flow-card {
  margin-bottom: 20px;
}

.status-flow-diagram {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.flow-node {
  background-color: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 15px;
  min-width: 200px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.node-title {
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.node-connections {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.connection {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
  padding-left: 10px;
  border-left: 2px solid #1890ff;
}

.node-title {
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
  text-align: center;
}

.node-connections {
  margin-top: 10px;
}
</style>