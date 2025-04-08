<template>
  <div>
    <!-- 页面标题和操作栏 -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
      <h1 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
        防火墙规则管理
      </h1>
      <div class="flex flex-wrap gap-3 mt-4 md:mt-0">
        <button
            @click="openCreateRuleModal"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-500'"
        >
          <Icon icon="mdi:plus" class="mr-2 h-5 w-5" />
          添加规则
        </button>
        <button
            @click="exportRules"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'"
        >
          <Icon icon="mdi:download" class="mr-2 h-5 w-5" />
          导出规则
        </button>
      </div>
    </div>

    <!-- 过滤和搜索 -->
    <div class="mb-6 p-4 rounded-xl shadow-sm"
         :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon icon="mdi:magnify" class="h-5 w-5" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'" />
            </div>
            <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索规则..."
                class="pl-10 pr-4 py-2 w-full rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                :class="isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
            />
          </div>
        </div>
        <div class="flex flex-wrap gap-3">
          <select
              v-model="statusFilter"
              class="px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
              :class="isDarkMode
              ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
              : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
          >
            <option value="all">全部状态</option>
            <option value="enabled">已启用</option>
            <option value="disabled">已禁用</option>
          </select>
          <select
              v-model="typeFilter"
              class="px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
              :class="isDarkMode
              ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
              : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
          >
            <option value="all">全部类型</option>
            <option value="allow">允许</option>
            <option value="deny">拒绝</option>
            <option value="drop">丢弃</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" :class="isDarkMode ? 'border-blue-400' : 'border-blue-600'"></div>
    </div>

    <!-- 规则列表 -->
    <div v-else-if="filteredRules.length > 0" class="rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md mb-6"
         :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y" :class="isDarkMode ? 'divide-gray-700' : 'divide-gray-200'">
          <thead :class="isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              优先级
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              规则名称
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              类型
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              来源
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              目标
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              端口/协议
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              状态
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              操作
            </th>
          </tr>
          </thead>
          <tbody :class="isDarkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'">
          <tr v-for="rule in filteredRules" :key="rule.id"
              class="transition-colors duration-150"
              :class="isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'">
            <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              {{ rule.priority }}
              <div class="flex gap-1 mt-1">
                <button @click="moveRuleUp(rule)" :disabled="rule.priority === 1"
                        class="text-xs p-1 rounded" :class="isDarkMode ? 'hover:bg-gray-600 disabled:text-gray-600' : 'hover:bg-gray-200 disabled:text-gray-400'">
                  <Icon icon="mdi:arrow-up" class="h-4 w-4" />
                </button>
                <button @click="moveRuleDown(rule)" :disabled="rule.priority === rules.length"
                        class="text-xs p-1 rounded" :class="isDarkMode ? 'hover:bg-gray-600 disabled:text-gray-600' : 'hover:bg-gray-200 disabled:text-gray-400'">
                  <Icon icon="mdi:arrow-down" class="h-4 w-4" />
                </button>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              {{ rule.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span
                    class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="ruleTypeClass(rule.type)"
                >
                  {{ ruleTypeText(rule.type) }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              {{ rule.source }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              {{ rule.destination }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              {{ rule.ports }} ({{ rule.protocol }})
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <label class="inline-flex relative items-center cursor-pointer">
                  <input type="checkbox" :checked="rule.enabled" class="sr-only peer" @change="toggleRuleStatus(rule)">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                       :class="isDarkMode
                           ? 'peer-checked:bg-blue-600 dark:bg-gray-700 dark:peer-checked:bg-blue-600'
                           : 'peer-checked:bg-blue-600'"></div>
                </label>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
              <div class="flex justify-end space-x-2">
                <button @click="openEditRuleModal(rule)"
                        class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  <Icon icon="mdi:pencil" class="h-5 w-5" />
                </button>
                <button @click="confirmDeleteRule(rule)"
                        class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                  <Icon icon="mdi:delete" class="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-20 rounded-xl shadow-sm"
         :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
      <Icon icon="mdi:shield-off" class="h-16 w-16 mx-auto" :class="isDarkMode ? 'text-gray-600' : 'text-gray-400'" />
      <h3 class="mt-4 text-lg font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
        暂无防火墙规则
      </h3>
      <p class="mt-2 text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
        添加规则以保护您的系统安全
      </p>
      <button
          @click="openCreateRuleModal"
          class="mt-5 inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
          :class="isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-500'"
      >
        <Icon icon="mdi:plus" class="mr-2 h-5 w-5" />
        添加规则
      </button>
    </div>

    <!-- 创建/编辑规则的模态框 -->
    <div v-if="showRuleModal" class="fixed inset-0 flex items-center justify-center z-50" @click.self="closeRuleModal">
      <div class="fixed inset-0 bg-black opacity-50"></div>
      <div class="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 md:mx-auto"
           :class="isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'">
        <button @click="closeRuleModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <Icon icon="mdi:close" class="h-6 w-6" />
        </button>

        <h2 class="text-xl font-bold mb-6">{{ isEditing ? '编辑规则' : '创建新规则' }}</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              规则名称
            </label>
            <input
                v-model="ruleForm.name"
                type="text"
                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                :class="isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              规则类型
            </label>
            <select
                v-model="ruleForm.type"
                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                :class="isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
            >
              <option value="allow">允许</option>
              <option value="deny">拒绝</option>
              <option value="drop">丢弃</option>
            </select>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                来源地址
              </label>
              <input
                  v-model="ruleForm.source"
                  type="text"
                  placeholder="IP地址或网段 (如: 192.168.1.0/24)"
                  class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                  :class="isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                  : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                目标地址
              </label>
              <input
                  v-model="ruleForm.destination"
                  type="text"
                  placeholder="IP地址或网段 (如: 10.0.0.0/8)"
                  class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                  :class="isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                  : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                端口范围
              </label>
              <input
                  v-model="ruleForm.ports"
                  type="text"
                  placeholder="单个端口或范围 (如: 80,443 或 1000-2000)"
                  class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                  :class="isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                  : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                协议
              </label>
              <select
                  v-model="ruleForm.protocol"
                  class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                  :class="isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                  : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
              >
                <option value="TCP">TCP</option>
                <option value="UDP">UDP</option>
                <option value="ICMP">ICMP</option>
                <option value="ANY">ANY</option>
              </select>
            </div>
          </div>

          <div class="flex items-center">
            <input
                type="checkbox"
                id="rule-enabled"
                v-model="ruleForm.enabled"
                class="w-4 h-4 rounded"
                :class="isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'"
            >
            <label for="rule-enabled" class="ml-2 text-sm font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              启用规则
            </label>
          </div>

          <div class="flex items-center">
            <input
                type="checkbox"
                id="rule-log"
                v-model="ruleForm.log"
                class="w-4 h-4 rounded"
                :class="isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'"
            >
            <label for="rule-log" class="ml-2 text-sm font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              记录日志
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              描述
            </label>
            <textarea
                v-model="ruleForm.description"
                rows="3"
                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                :class="isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
            ></textarea>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button
              @click="closeRuleModal"
              class="px-4 py-2 rounded-lg font-medium transition-all duration-200"
              :class="isDarkMode
              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
          >
            取消
          </button>
          <button
              @click="saveRule"
              class="px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700"
          >
            {{ isEditing ? '保存更改' : '创建规则' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue';
import { Icon } from '@iconify/vue';

// 获取全局暗黑模式状态
const isDarkMode = inject('isDarkMode', ref(false));

// 加载状态
const loading = ref(true);

// 过滤条件
const searchQuery = ref('');
const statusFilter = ref('all');
const typeFilter = ref('all');

// 模态框状态和表单
const showRuleModal = ref(false);
const isEditing = ref(false);
const ruleForm = ref({
  id: null,
  name: '',
  type: 'allow',
  source: '',
  destination: '',
  ports: '',
  protocol: 'TCP',
  priority: 1,
  enabled: true,
  log: true,
  description: ''
});

// 防火墙规则列表
const rules = ref([]);

// 过滤后的规则
const filteredRules = computed(() => {
  return rules.value.filter(rule => {
    // 状态过滤
    if (statusFilter.value !== 'all') {
      if (statusFilter.value === 'enabled' && !rule.enabled) return false;
      if (statusFilter.value === 'disabled' && rule.enabled) return false;
    }

    // 类型过滤
    if (typeFilter.value !== 'all' && rule.type !== typeFilter.value) return false;

    // 搜索查询
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      return rule.name.toLowerCase().includes(query) ||
          rule.source.toLowerCase().includes(query) ||
          rule.destination.toLowerCase().includes(query) ||
          rule.description?.toLowerCase().includes(query);
    }

    return true;
  });
});

// 规则类型样式
const ruleTypeClass = (type) => {
  if (isDarkMode.value) {
    const darkTypeMap = {
      'allow': 'bg-green-900 text-green-300',
      'deny': 'bg-red-900 text-red-300',
      'drop': 'bg-orange-900 text-orange-300',
    };
    return darkTypeMap[type] || 'bg-gray-700 text-gray-300';
  } else {
    const lightTypeMap = {
      'allow': 'bg-green-100 text-green-800',
      'deny': 'bg-red-100 text-red-800',
      'drop': 'bg-orange-100 text-orange-800',
    };
    return lightTypeMap[type] || 'bg-gray-100 text-gray-800';
  }
};

// 规则类型文本
const ruleTypeText = (type) => {
  const typeMap = {
    'allow': '允许',
    'deny': '拒绝',
    'drop': '丢弃',
  };
  return typeMap[type] || type;
};

// 打开创建规则模态框
const openCreateRuleModal = () => {
  isEditing.value = false;
  ruleForm.value = {
    id: null,
    name: '',
    type: 'allow',
    source: '',
    destination: '',
    ports: '',
    protocol: 'TCP',
    priority: rules.value.length + 1,
    enabled: true,
    log: true,
    description: ''
  };
  showRuleModal.value = true;
};

// 打开编辑规则模态框
const openEditRuleModal = (rule) => {
  isEditing.value = true;
  ruleForm.value = { ...rule };
  showRuleModal.value = true;
};

// 关闭规则模态框
const closeRuleModal = () => {
  showRuleModal.value = false;
};

// 保存规则
const saveRule = () => {
  if (isEditing.value) {
    // 更新规则
    const index = rules.value.findIndex(r => r.id === ruleForm.value.id);
    if (index !== -1) {
      rules.value[index] = { ...ruleForm.value };
    }
  } else {
    // 创建新规则
    const newRule = {
      ...ruleForm.value,
      id: `rule-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    rules.value.push(newRule);
  }

  // 更新本地存储
  localStorage.setItem('firewallRules', JSON.stringify(rules.value));

  // 关闭模态框
  closeRuleModal();
};

// 切换规则状态
const toggleRuleStatus = (rule) => {
  rule.enabled = !rule.enabled;
  localStorage.setItem('firewallRules', JSON.stringify(rules.value));
};

// 移动规则优先级
const moveRuleUp = (rule) => {
  if (rule.priority <= 1) return;

  const currentIndex = rule.priority - 1;
  const targetRule = rules.value.find(r => r.priority === rule.priority - 1);

  if (targetRule) {
    targetRule.priority += 1;
    rule.priority -= 1;

    // 重新排序数组
    rules.value.sort((a, b) => a.priority - b.priority);
    localStorage.setItem('firewallRules', JSON.stringify(rules.value));
  }
};

const moveRuleDown = (rule) => {
  if (rule.priority >= rules.value.length) return;

  const targetRule = rules.value.find(r => r.priority === rule.priority + 1);

  if (targetRule) {
    targetRule.priority -= 1;
    rule.priority += 1;

    // 重新排序数组
    rules.value.sort((a, b) => a.priority - b.priority);
    localStorage.setItem('firewallRules', JSON.stringify(rules.value));
  }
};

// 确认删除规则
const confirmDeleteRule = (rule) => {
  if (confirm(`确定要删除规则 "${rule.name}" 吗？`)) {
    deleteRule(rule);
  }
};

// 删除规则
const deleteRule = (rule) => {
  const index = rules.value.findIndex(r => r.id === rule.id);
  if (index !== -1) {
    rules.value.splice(index, 1);

    // 更新其他规则的优先级
    rules.value.forEach((r, i) => {
      r.priority = i + 1;
    });

    // 更新本地存储
    localStorage.setItem('firewallRules', JSON.stringify(rules.value));
  }
};

// 导出规则
const exportRules = () => {
  const dataStr = JSON.stringify(rules.value, null, 2);
  const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  const exportName = `firewall-rules-${new Date().toISOString().split('T')[0]}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportName);
  linkElement.click();
};

// 组件挂载时加载数据
onMounted(async () => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // 从本地存储获取数据
    const savedRules = localStorage.getItem('firewallRules');

    if (savedRules) {
      rules.value = JSON.parse(savedRules);
    } else {
      // 模拟示例数据
      rules.value = [
        {
          id: 'rule-1',
          name: '允许SSH访问',
          type: 'allow',
          source: '192.168.1.0/24',
          destination: 'ANY',
          ports: '22',
          protocol: 'TCP',
          priority: 1,
          enabled: true,
          log: true,
          description: '允许内部网络SSH访问',
          createdAt: '2025-03-15T08:30:00Z'
        },
        {
          id: 'rule-2',
          name: '允许Web访问',
          type: 'allow',
          source: 'ANY',
          destination: '10.0.2.15',
          ports: '80,443',
          protocol: 'TCP',
          priority: 2,
          enabled: true,
          log: true,
          description: '允许HTTP和HTTPS访问Web服务器',
          createdAt: '2025-03-16T09:20:00Z'
        },
        {
          id: 'rule-3',
          name: '阻止远程端口扫描',
          type: 'drop',
          source: '0.0.0.0/0',
          destination: 'ANY',
          ports: '1-1024',
          protocol: 'TCP',
          priority: 3,
          enabled: true,
          log: true,
          description: '阻止外部对常用端口的扫描',
          createdAt: '2025-03-17T10:15:00Z'
        },
        {
          id: 'rule-4',
          name: '拒绝特定IP',
          type: 'deny',
          source: '45.12.34.56',
          destination: 'ANY',
          ports: 'ANY',
          protocol: 'ANY',
          priority: 4,
          enabled: false,
          log: true,
          description: '拒绝已知恶意IP的所有连接',
          createdAt: '2025-03-18T11:05:00Z'
        },
        {
          id: 'rule-5',
          name: '允许DNS请求',
          type: 'allow',
          source: '10.0.0.0/8',
          destination: '8.8.8.8,8.8.4.4',
          ports: '53',
          protocol: 'UDP',
          priority: 5,
          enabled: true,
          log: false,
          description: '允许内部网络使用Google DNS',
          createdAt: '2025-03-19T14:25:00Z'
        }
      ];

      // 保存到本地存储
      localStorage.setItem('firewallRules', JSON.stringify(rules.value));
    }
  } catch (error) {
    console.error('获取防火墙规则失败:', error);
    // 这里可以添加错误处理逻辑
  } finally {
    loading.value = false;
  }
});
</script>
