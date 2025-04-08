<template>
  <div>
    <!-- 页面标题和操作栏 -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
      <h1 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
        防火墙日志查询
      </h1>
      <div class="flex flex-wrap gap-3 mt-4 md:mt-0">
        <button
            @click="exportLogs"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'"
        >
          <Icon icon="mdi:download" class="mr-2 h-5 w-5" />
          导出日志
        </button>
        <button
            @click="refreshLogs"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-500'"
        >
          <Icon icon="mdi:refresh" class="mr-2 h-5 w-5" />
          刷新
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
                placeholder="搜索日志..."
                class="pl-10 pr-4 py-2 w-full rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
                :class="isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
            />
          </div>
        </div>
        <div class="flex flex-wrap gap-3">
          <select
              v-model="actionFilter"
              class="px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
              :class="isDarkMode
              ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
              : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
          >
            <option value="all">全部操作</option>
            <option value="ALLOW">已允许</option>
            <option value="DENY">已拒绝</option>
            <option value="DROP">已丢弃</option>
          </select>
          <select
              v-model="timeFilter"
              class="px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
              :class="isDarkMode
              ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
              : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
          >
            <option value="1h">最近1小时</option>
            <option value="24h">最近24小时</option>
            <option value="7d">最近7天</option>
            <option value="30d">最近30天</option>
            <option value="all">全部时间</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" :class="isDarkMode ? 'border-blue-400' : 'border-blue-600'"></div>
    </div>

    <!-- 日志列表 -->
    <div v-else-if="filteredLogs.length > 0" class="rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md mb-6"
         :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y" :class="isDarkMode ? 'divide-gray-700' : 'divide-gray-200'">
          <thead :class="isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              时间
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              操作
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              来源 IP
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              目标 IP
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              协议/端口
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              规则
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              操作
            </th>
          </tr>
          </thead>
          <tbody :class="isDarkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'">
          <tr v-for="log in filteredLogs" :key="log.id"
              class="transition-colors duration-150"
              :class="isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'">
            <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              {{ formatDate(log.timestamp) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span
                    class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="logActionClass(log.action)"
                >
                  {{ logActionText(log.action) }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              {{ log.sourceIP }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              {{ log.destinationIP }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              {{ log.protocol }} / {{ log.port }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              {{ log.ruleName }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
              <button @click="viewLogDetails(log)"
                      class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                <Icon icon="mdi:information-outline" class="h-5 w-5" />
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="px-6 py-3 flex items-center justify-between border-t" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
        <div class="flex-1 flex justify-between sm:hidden">
          <button @click="prevPage" :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md"
                  :class="isDarkMode
                ? 'border-gray-700 bg-gray-800 text-gray-300 disabled:opacity-50'
                : 'border-gray-300 bg-white text-gray-700 disabled:opacity-50'">
            上一页
          </button>
          <button @click="nextPage" :disabled="currentPage >= totalPages"
                  class="ml-3 relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md"
                  :class="isDarkMode
                ? 'border-gray-700 bg-gray-800 text-gray-300 disabled:opacity-50'
                : 'border-gray-300 bg-white text-gray-700 disabled:opacity-50'">
            下一页
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-700'">
              显示第 <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> 到
              <span class="font-medium">{{ Math.min(currentPage * pageSize, totalItems) }}</span> 条，
              共 <span class="font-medium">{{ totalItems }}</span> 条记录
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button @click="prevPage" :disabled="currentPage === 1"
                      class="relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium"
                      :class="isDarkMode
                    ? 'border-gray-700 bg-gray-800 text-gray-300 disabled:opacity-50'
                    : 'border-gray-300 bg-white text-gray-700 disabled:opacity-50'">
                <span class="sr-only">上一页</span>
                <Icon icon="mdi:chevron-left" class="h-5 w-5" />
              </button>
              <button @click="nextPage" :disabled="currentPage >= totalPages"
                      class="relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium"
                      :class="isDarkMode
                    ? 'border-gray-700 bg-gray-800 text-gray-300 disabled:opacity-50'
                    : 'border-gray-300 bg-white text-gray-700 disabled:opacity-50'">
                <span class="sr-only">下一页</span>
                <Icon icon="mdi:chevron-right" class="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-20 rounded-xl shadow-sm"
         :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
      <Icon icon="mdi:file-document-outline" class="h-16 w-16 mx-auto" :class="isDarkMode ? 'text-gray-600' : 'text-gray-400'" />
      <h3 class="mt-4 text-lg font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
        暂无日志记录
      </h3>
      <p class="mt-2 text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
        防火墙尚未记录任何匹配当前筛选条件的日志
      </p>
    </div>

    <!-- 日志详情模态框 -->
    <div v-if="showLogModal" class="fixed inset-0 flex items-center justify-center z-50" @click.self="closeLogModal">
      <div class="fixed inset-0 bg-black opacity-50"></div>
      <div class="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 md:mx-auto"
           :class="isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'">
        <button @click="closeLogModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <Icon icon="mdi:close" class="h-6 w-6" />
        </button>

        <h2 class="text-xl font-bold mb-6">日志详情</h2>

        <div v-if="selectedLog" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">时间:</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ formatDate(selectedLog.timestamp, true) }}
                </p>
              </div>

              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">操作:</span>
                <p>
                  <span
                      class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="logActionClass(selectedLog.action)"
                  >
                    {{ logActionText(selectedLog.action) }}
                  </span>
                </p>
              </div>

              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">规则名称:</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ selectedLog.ruleName }}
                </p>
              </div>

              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">规则ID:</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ selectedLog.ruleId }}
                </p>
              </div>
            </div>

            <div class="space-y-2">
              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">来源:</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ selectedLog.sourceIP }}{{ selectedLog.sourcePort ? ':' + selectedLog.sourcePort : '' }}
                </p>
              </div>

              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">目标:</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ selectedLog.destinationIP }}:{{ selectedLog.port }}
                </p>
              </div>

              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">协议:</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ selectedLog.protocol }}
                </p>
              </div>

              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">接口:</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ selectedLog.interface }}
                </p>
              </div>
            </div>
          </div>

          <div v-if="selectedLog.packet">
            <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">数据包信息:</span>
            <pre class="mt-1 p-3 text-xs overflow-x-auto rounded"
                 :class="isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'">{{ selectedLog.packet }}</pre>
          </div>

          <div v-if="selectedLog.message">
            <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">消息:</span>
            <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              {{ selectedLog.message }}
            </p>
          </div>
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

// 过滤条件和搜索
const searchQuery = ref('');
const actionFilter = ref('all');
const timeFilter = ref('24h');

// 分页
const currentPage = ref(1);
const pageSize = ref(10);

// 日志列表
const logs = ref([]);
const selectedLog = ref(null);
const showLogModal = ref(false);

// 过滤后的日志
const filteredLogs = computed(() => {
  let result = logs.value.filter(log => {
    // 操作类型过滤
    if (actionFilter.value !== 'all' && log.action !== actionFilter.value) {
      return false;
    }

    // 时间过滤
    if (timeFilter.value !== 'all') {
      const now = new Date();
      const logDate = new Date(log.timestamp);
      let timeLimit;

      switch(timeFilter.value) {
        case '1h':
          timeLimit = 60 * 60 * 1000; // 1小时
          break;
        case '24h':
          timeLimit = 24 * 60 * 60 * 1000; // 24小时
          break;
        case '7d':
          timeLimit = 7 * 24 * 60 * 60 * 1000; // 7天
          break;
        case '30d':
          timeLimit = 30 * 24 * 60 * 60 * 1000; // 30天
          break;
      }

      if ((now - logDate) > timeLimit) {
        return false;
      }
    }

    // 搜索查询
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      return log.sourceIP.toLowerCase().includes(query) ||
          log.destinationIP.toLowerCase().includes(query) ||
          log.ruleName.toLowerCase().includes(query) ||
          log.protocol.toLowerCase().includes(query);
    }

    return true;
  });

  // 按时间降序排序
  result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return result;
});

// 分页结果
const paginatedLogs = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  return filteredLogs.value.slice(startIndex, startIndex + pageSize.value);
});

// 总项目数和总页数
const totalItems = computed(() => filteredLogs.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

// 分页导航
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// 日志操作样式
const logActionClass = (action) => {
  if (isDarkMode.value) {
    const darkActionMap = {
      'ALLOW': 'bg-green-900 text-green-300',
      'DENY': 'bg-red-900 text-red-300',
      'DROP': 'bg-orange-900 text-orange-300',
    };
    return darkActionMap[action] || 'bg-gray-700 text-gray-300';
  } else {
    const lightActionMap = {
      'ALLOW': 'bg-green-100 text-green-800',
      'DENY': 'bg-red-100 text-red-800',
      'DROP': 'bg-orange-100 text-orange-800',
    };
    return lightActionMap[action] || 'bg-gray-100 text-gray-800';
  }
};

// 日志操作文本
const logActionText = (action) => {
  const actionMap = {
    'ALLOW': '已允许',
    'DENY': '已拒绝',
    'DROP': '已丢弃',
  };
  return actionMap[action] || action;
};

// 格式化日期
const formatDate = (timestamp, detailed = false) => {
  const date = new Date(timestamp);

  if (detailed) {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  // 简化显示，今天的日志只显示时间，非今天的显示日期
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } else {
    return date.toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

// 查看日志详情
const viewLogDetails = (log) => {
  selectedLog.value = log;
  showLogModal.value = true;
};

// 关闭日志详情模态框
const closeLogModal = () => {
  showLogModal.value = false;
};

// 导出日志
const exportLogs = () => {
  const dataStr = JSON.stringify(filteredLogs.value, null, 2);
  const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  const exportName = `firewall-logs-${new Date().toISOString().split('T')[0]}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportName);
  linkElement.click();
};

// 刷新日志
const refreshLogs = async () => {
  loading.value = true;
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // 重新加载数据
    await loadLogs();
  } finally {
    loading.value = false;
  }
};

// 加载日志数据
const loadLogs = async () => {
  try {
    // 模拟从API获取数据
    // 在实际应用中，这里应该是一个API调用
    await new Promise(resolve => setTimeout(resolve, 800));

    // 生成模拟日志数据
    const mockLogs = [];
    const actions = ['ALLOW', 'DENY', 'DROP'];
    const protocols = ['TCP', 'UDP', 'ICMP'];
    const interfaces = ['eth0', 'eth1', 'wan0'];
    const ruleNames = ['允许SSH访问', '允许Web访问', '阻止远程端口扫描', '拒绝特定IP', '允许DNS请求'];

    // 生成过去30天内的随机日志
    const now = new Date();
    for (let i = 0; i < 50; i++) {
      const randomDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      const action = actions[Math.floor(Math.random() * actions.length)];
      const protocol = protocols[Math.floor(Math.random() * protocols.length)];
      const ruleIndex = Math.floor(Math.random() * ruleNames.length);

      mockLogs.push({
        id: `log-${i + 1}`,
        timestamp: randomDate.toISOString(),
        action: action,
        sourceIP: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        sourcePort: Math.floor(Math.random() * 65535),
        destinationIP: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        port: Math.floor(Math.random() * 65535),
        protocol: protocol,
        interface: interfaces[Math.floor(Math.random() * interfaces.length)],
        ruleName: ruleNames[ruleIndex],
        ruleId: `rule-${ruleIndex + 1}`,
        packet: protocol === 'TCP' ?
            `Flags [S], seq 1000:1040, win 64240, options [mss 1460], length 40` :
            (protocol === 'UDP' ? `length 56` : `type 8, code 0`),
        message: action === 'ALLOW' ?
            '连接已建立' :
            (action === 'DENY' ? '连接被拒绝' : '数据包已丢弃')
      });
    }

    logs.value = mockLogs;
  } catch (error) {
    console.error('获取防火墙日志失败:', error);
    // 添加错误处理逻辑
  }
};

// 组件挂载时加载数据
onMounted(async () => {
  try {
    await loadLogs();
  } finally {
    loading.value = false;
  }
});
</script>
