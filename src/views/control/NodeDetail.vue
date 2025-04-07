<template>
  <div>
    <!-- 页面标题和操作栏 -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
      <div class="flex items-center">
        <button
            @click="router.back()"
            class="mr-4 rounded-lg p-2 transition-colors duration-200"
            :class="isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'"
        >
          <Icon icon="mdi:arrow-left" class="h-6 w-6" />
        </button>
        <h1 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
          节点详情
        </h1>
      </div>
      <div class="flex flex-wrap gap-3 mt-4 md:mt-0">
        <button
            @click="toggleMaintenanceMode"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="node.status === 'maintenance'
              ? (isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700')
              : (isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50')"
        >
          <Icon :icon="node.status === 'maintenance' ? 'mdi:tools-off' : 'mdi:tools'" class="mr-2 h-5 w-5" />
          {{ node.status === 'maintenance' ? '退出维护模式' : '进入维护模式' }}
        </button>
        <router-link
            :to="`/control/edit/${nodeId}`"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-amber-600 text-white hover:bg-amber-500'"
        >
          <Icon icon="mdi:pencil" class="mr-2 h-5 w-5" />
          编辑节点
        </router-link>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" :class="isDarkMode ? 'border-blue-400' : 'border-blue-600'"></div>
    </div>

    <div v-else>
      <!-- 状态卡片 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <!-- 节点状态 -->
        <div class="rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md"
             :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
          <div class="flex items-center">
            <div class="p-3 rounded-full" :class="statusIconClass">
              <Icon :icon="statusIcon" class="h-6 w-6" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">节点状态</p>
              <h3 class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
                {{ statusText }}
              </h3>
            </div>
          </div>
        </div>

        <!-- 上线时间 -->
        <div class="rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md"
             :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
          <div class="flex items-center">
            <div class="p-3 rounded-full" :class="isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'">
              <Icon icon="mdi:clock-outline" class="h-6 w-6" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">运行时间</p>
              <h3 class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
                {{ uptimeText }}
              </h3>
            </div>
          </div>
        </div>

        <!-- CPU使用率 -->
        <div class="rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md"
             :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
          <div class="flex items-center">
            <div class="p-3 rounded-full" :class="isDarkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'">
              <Icon icon="mdi:cpu-64-bit" class="h-6 w-6" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">CPU 使用率</p>
              <h3 class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
                {{ node.cpuUsage }}%
              </h3>
            </div>
          </div>
        </div>

        <!-- 内存使用率 -->
        <div class="rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md"
             :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
          <div class="flex items-center">
            <div class="p-3 rounded-full" :class="isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'">
              <Icon icon="mdi:memory" class="h-6 w-6" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">内存使用率</p>
              <h3 class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
                {{ node.memoryUsage }}%
              </h3>
            </div>
          </div>
        </div>
      </div>

      <!-- 节点信息和监控图表 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- 节点基本信息 -->
        <div class="rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
             :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
          <div class="px-6 py-4 border-b" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
            <h2 class="text-lg font-medium" :class="isDarkMode ? 'text-gray-200' : 'text-gray-700'">
              节点信息
            </h2>
          </div>
          <div class="p-6">
            <div class="flex items-center mb-6">
              <div class="h-16 w-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mr-4"
                   :class="isDarkMode ? 'bg-gray-700' : ''">
                <Icon icon="mdi:server" class="h-8 w-8" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'" />
              </div>
              <div>
                <h3 class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">{{ node.name }}</h3>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">{{ node.id }}</p>
              </div>
            </div>

            <div class="space-y-3 text-sm">
              <div class="flex justify-between items-center p-2 rounded-lg"
                   :class="isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'">
                <span :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">位置:</span>
                <span :class="isDarkMode ? 'text-gray-200 font-medium' : 'text-gray-800 font-medium'">{{ node.location }}</span>
              </div>
              <div class="flex justify-between items-center p-2 rounded-lg"
                   :class="isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'">
                <span :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">IP地址:</span>
                <span :class="isDarkMode ? 'text-gray-200 font-medium' : 'text-gray-800 font-medium'">{{ node.ip }}</span>
              </div>
              <div class="flex justify-between items-center p-2 rounded-lg"
                   :class="isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'">
                <span :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">MAC地址:</span>
                <span :class="isDarkMode ? 'text-gray-200 font-medium' : 'text-gray-800 font-medium'">{{ node.mac }}</span>
              </div>
              <div class="flex justify-between items-center p-2 rounded-lg"
                   :class="isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'">
                <span :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">系统版本:</span>
                <span :class="isDarkMode ? 'text-gray-200 font-medium' : 'text-gray-800 font-medium'">{{ node.osVersion }}</span>
              </div>
              <div class="flex justify-between items-center p-2 rounded-lg"
                   :class="isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'">
                <span :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">软件版本:</span>
                <span :class="isDarkMode ? 'text-gray-200 font-medium' : 'text-gray-800 font-medium'">{{ node.softwareVersion }}</span>
              </div>
              <div class="flex justify-between items-center p-2 rounded-lg"
                   :class="isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'">
                <span :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">上次更新:</span>
                <span :class="isDarkMode ? 'text-gray-200 font-medium' : 'text-gray-800 font-medium'">{{ formatDate(node.lastUpdate) }}</span>
              </div>
              <div class="flex justify-between items-center p-2 rounded-lg"
                   :class="isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'">
                <span :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">安装日期:</span>
                <span :class="isDarkMode ? 'text-gray-200 font-medium' : 'text-gray-800 font-medium'">{{ formatDate(node.installDate) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 性能图表 -->
        <div class="lg:col-span-2 rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
             :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
          <div class="px-6 py-4 border-b" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-medium" :class="isDarkMode ? 'text-gray-200' : 'text-gray-700'">
                性能监控
              </h2>
              <div class="flex space-x-2">
                <button
                    @click="activeChart = 'cpu'"
                    class="px-3 py-1.5 text-xs rounded-md transition-all duration-200"
                    :class="activeChart === 'cpu'
                    ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white')
                    : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')"
                >
                  CPU
                </button>
                <button
                    @click="activeChart = 'memory'"
                    class="px-3 py-1.5 text-xs rounded-md transition-all duration-200"
                    :class="activeChart === 'memory'
                    ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white')
                    : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')"
                >
                  内存
                </button>
                <button
                    @click="activeChart = 'network'"
                    class="px-3 py-1.5 text-xs rounded-md transition-all duration-200"
                    :class="activeChart === 'network'
                    ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white')
                    : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')"
                >
                  网络
                </button>
              </div>
            </div>
          </div>

          <!-- 图表区域 -->
          <div class="p-4 h-72">
            <div v-if="activeChart === 'cpu'" class="h-full">
              <apexchart
                  type="area"
                  height="100%"
                  :options="cpuChartOptions"
                  :series="cpuChartSeries"
              ></apexchart>
            </div>

            <div v-if="activeChart === 'memory'" class="h-full">
              <apexchart
                  type="area"
                  height="100%"
                  :options="memoryChartOptions"
                  :series="memoryChartSeries"
              ></apexchart>
            </div>

            <div v-if="activeChart === 'network'" class="h-full">
              <apexchart
                  type="line"
                  height="100%"
                  :options="networkChartOptions"
                  :series="networkChartSeries"
              ></apexchart>
            </div>
          </div>
        </div>
      </div>

      <!-- 连接日志 -->
      <div class="rounded-xl shadow-sm overflow-hidden mb-6 transition-all duration-300 hover:shadow-md"
           :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
        <div class="px-6 py-4 border-b" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
          <h2 class="text-lg font-medium" :class="isDarkMode ? 'text-gray-200' : 'text-gray-700'">
            连接日志
          </h2>
        </div>
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
                事件
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
                详情
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
                状态
              </th>
            </tr>
            </thead>
            <tbody :class="isDarkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'">
            <tr v-for="(log, index) in node.connectionLogs" :key="index"
                class="transition-colors duration-150"
                :class="isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'">
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                {{ formatDate(log.time) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                {{ log.event }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                {{ log.details }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                  <span
                      class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="logStatusClass(log.status)"
                  >
                    {{ log.status }}
                  </span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex flex-wrap gap-4 justify-end">
        <button
            @click="restartNode"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200 transform hover:translate-y-[-2px]"
            :class="isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'"
        >
          <Icon icon="mdi:restart" class="mr-2 h-5 w-5" />
          重启节点
        </button>
        <button
            @click="pingNode"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200 transform hover:translate-y-[-2px]"
            :class="isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'"
        >
          <Icon icon="mdi:connection" class="mr-2 h-5 w-5" />
          测试连接
        </button>
        <button
            @click="updateNode"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200 transform hover:translate-y-[-2px]"
            :class="isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'"
        >
          <Icon icon="mdi:update" class="mr-2 h-5 w-5" />
          更新软件
        </button>
        <button
            @click="deleteNode"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200 transform hover:translate-y-[-2px] bg-red-600 text-white hover:bg-red-700"
        >
          <Icon icon="mdi:delete" class="mr-2 h-5 w-5" />
          删除节点
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';
// 无需导入VueApexCharts，因为我们已在main.js中全局注册

// 获取全局暗黑模式状态
const isDarkMode = inject('isDarkMode', ref(false));
const router = useRouter();
const route = useRoute();

// 获取节点ID
const nodeId = route.params.id;

// 加载状态
const loading = ref(true);

// 节点数据
const node = ref({});

// 活动图表类型
const activeChart = ref('cpu');

// 生成过去24小时的时间点（每小时一个）
const generateTimePoints = () => {
  const timePoints = [];
  const now = new Date();

  for (let i = 23; i >= 0; i--) {
    const date = new Date(now);
    date.setHours(now.getHours() - i);
    timePoints.push(date.getTime());
  }

  return timePoints;
};

// 生成随机数据系列
const generateRandomSeries = (baseValue, variance) => {
  return generateTimePoints().map(() => {
    return Math.floor(baseValue + (Math.random() * variance * 2) - variance);
  });
};

// 时间点
const timePoints = generateTimePoints();

// CPU图表数据
const cpuChartSeries = ref([
  {
    name: 'CPU使用率',
    data: []
  }
]);

// 内存图表数据
const memoryChartSeries = ref([
  {
    name: '内存使用率',
    data: []
  }
]);

// 网络图表数据
const networkChartSeries = ref([
  {
    name: '上传速率',
    data: []
  },
  {
    name: '下载速率',
    data: []
  }
]);

// 生成基本图表配置
const getBaseChartOptions = (title, yAxisTitle, colors) => {
  return {
    chart: {
      id: 'performance-chart',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true
        }
      },
      zoom: {
        enabled: true
      },
      fontFamily: 'inherit',
      foreColor: isDarkMode.value ? '#E5E7EB' : '#4B5563',
      background: 'transparent'
    },
    colors: colors,
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    title: {
      text: title,
      align: 'left',
      style: {
        fontSize: '16px',
        fontWeight: '500',
        color: isDarkMode.value ? '#E5E7EB' : '#374151'
      }
    },
    grid: {
      borderColor: isDarkMode.value ? '#374151' : '#E5E7EB',
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      padding: {
        left: 10,
        right: 10
      }
    },
    tooltip: {
      theme: isDarkMode.value ? 'dark' : 'light',
      x: {
        format: 'HH:mm'
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: {
        colors: isDarkMode.value ? '#E5E7EB' : '#4B5563'
      }
    },
    xaxis: {
      type: 'datetime',
      categories: timePoints,
      labels: {
        format: 'HH:mm',
        style: {
          colors: isDarkMode.value ? '#9CA3AF' : '#6B7280'
        }
      },
      axisBorder: {
        color: isDarkMode.value ? '#4B5563' : '#E5E7EB'
      },
      axisTicks: {
        color: isDarkMode.value ? '#4B5563' : '#E5E7EB'
      }
    },
    yaxis: {
      title: {
        text: yAxisTitle,
        style: {
          color: isDarkMode.value ? '#9CA3AF' : '#6B7280'
        }
      },
      labels: {
        style: {
          colors: isDarkMode.value ? '#9CA3AF' : '#6B7280'
        }
      }
    },
    fill: {
      opacity: 0.2,
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.5,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100]
      }
    }
  };
};

// CPU图表配置
const cpuChartOptions = computed(() => {
  return getBaseChartOptions(
      'CPU使用率历史',
      '百分比 (%)',
      ['#8B5CF6']
  );
});

// 内存图表配置
const memoryChartOptions = computed(() => {
  return getBaseChartOptions(
      '内存使用率历史',
      '百分比 (%)',
      ['#10B981']
  );
});

// 网络图表配置
const networkChartOptions = computed(() => {
  return {
    ...getBaseChartOptions(
        '网络流量历史',
        'MB/s',
        ['#3B82F6', '#EC4899']
    ),
    stroke: {
      curve: 'straight',
      width: 2
    }
  };
});

// 监听暗黑模式变化，更新图表
watch(isDarkMode, () => {
  // 通过重新赋值让图表重新渲染以应用新的主题
  cpuChartSeries.value = [...cpuChartSeries.value];
  memoryChartSeries.value = [...memoryChartSeries.value];
  networkChartSeries.value = [...networkChartSeries.value];
});

// 计算图表图标
const chartIcon = computed(() => {
  const icons = {
    'cpu': 'mdi:chart-line',
    'memory': 'mdi:chart-areaspline',
    'network': 'mdi:chart-bar'
  };
  return icons[activeChart.value] || 'mdi:chart-line';
});

// 计算图表标题
const chartTitle = computed(() => {
  const titles = {
    'cpu': 'CPU 使用率',
    'memory': '内存使用率',
    'network': '网络流量'
  };
  return titles[activeChart.value] || '';
});

// 计算状态图标和样式
const statusIcon = computed(() => {
  const icons = {
    'online': 'mdi:check-circle',
    'offline': 'mdi:alert-circle',
    'warning': 'mdi:alert',
    'error': 'mdi:close-circle',
    'maintenance': 'mdi:tools'
  };
  return icons[node.value.status] || 'mdi:help-circle';
});

// 状态图标背景颜色
const statusIconClass = computed(() => {
  if (isDarkMode.value) {
    const darkBgMap = {
      'online': 'bg-green-900/30 text-green-400',
      'offline': 'bg-red-900/30 text-red-400',
      'warning': 'bg-yellow-900/30 text-yellow-400',
      'error': 'bg-red-900/30 text-red-400',
      'maintenance': 'bg-blue-900/30 text-blue-400'
    };
    return darkBgMap[node.value.status] || 'bg-gray-700/50 text-gray-400';
  } else {
    const lightBgMap = {
      'online': 'bg-green-100 text-green-600',
      'offline': 'bg-red-100 text-red-600',
      'warning': 'bg-yellow-100 text-yellow-600',
      'error': 'bg-red-100 text-red-600',
      'maintenance': 'bg-blue-100 text-blue-600'
    };
    return lightBgMap[node.value.status] || 'bg-gray-100 text-gray-600';
  }
});

// 状态文本
const statusText = computed(() => {
  const statusMap = {
    'online': '在线',
    'offline': '离线',
    'warning': '警告',
    'error': '错误',
    'maintenance': '维护中'
  };
  return statusMap[node.value.status] || '未知';
});

// 运行时间文本
const uptimeText = computed(() => {
  if (!node.value.uptime) return '未知';

  // 处理天、小时、分钟
  const days = Math.floor(node.value.uptime / (24 * 60 * 60));
  const hours = Math.floor((node.value.uptime % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((node.value.uptime % (60 * 60)) / 60);

  if (days > 0) {
    return `${days}天 ${hours}小时`;
  } else if (hours > 0) {
    return `${hours}小时 ${minutes}分钟`;
  } else {
    return `${minutes}分钟`;
  }
});

// 日志状态样式
const logStatusClass = (status) => {
  if (isDarkMode.value) {
    const darkStatusMap = {
      '成功': 'bg-green-900 text-green-300',
      '失败': 'bg-red-900 text-red-300',
      '警告': 'bg-yellow-900 text-yellow-300',
      '信息': 'bg-blue-900 text-blue-300'
    };
    return darkStatusMap[status] || 'bg-gray-700 text-gray-300';
  } else {
    const lightStatusMap = {
      '成功': 'bg-green-100 text-green-800',
      '失败': 'bg-red-100 text-red-800',
      '警告': 'bg-yellow-100 text-yellow-800',
      '信息': 'bg-blue-100 text-blue-800'
    };
    return lightStatusMap[status] || 'bg-gray-100 text-gray-800';
  }
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '无数据';

  const date = new Date(dateString);
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// 切换维护模式
const toggleMaintenanceMode = () => {
  if (node.value.status === 'maintenance') {
    node.value.status = 'online';
  } else {
    node.value.status = 'maintenance';
  }

  // 实际应用中，这里应该调用API修改节点状态
  console.log(`已将节点状态切换为: ${node.value.status}`);
};

// 重启节点
const restartNode = () => {
  if (confirm('确定要重启此节点吗？')) {
    // 这里应该调用API重启节点
    console.log('重启节点:', nodeId);
  }
};

// 测试连接
const pingNode = () => {
  // 这里应该调用API测试节点连接
  console.log('测试节点连接:', nodeId);
  alert('连接测试成功，延迟：56ms');
};

// 更新软件
const updateNode = () => {
  if (confirm('确定要更新此节点的软件吗？')) {
    // 这里应该调用API更新节点软件
    console.log('更新节点软件:', nodeId);
  }
};

// 删除节点
const deleteNode = () => {
  if (confirm('确定要删除此节点吗？此操作不可撤销。')) {
    // 这里应该调用API删除节点
    console.log('删除节点:', nodeId);
    // 删除成功后返回列表页面
    router.push('/control/list');
  }
};

// 组件挂载时获取数据
onMounted(async () => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // 模拟节点详情数据 - 实际应用中应该从API获取
    node.value = {
      id: nodeId,
      name: nodeId === 'CTRL-001' ? '主控节点A' : '备用节点B',
      location: nodeId === 'CTRL-001' ? '北京数据中心' : '上海数据中心',
      status: nodeId === 'CTRL-001' ? 'online' : 'warning',
      ip: nodeId === 'CTRL-001' ? '192.168.1.100' : '192.168.2.50',
      mac: nodeId === 'CTRL-001' ? '00:1B:44:11:3A:B7' : '00:1B:44:11:5C:D3',
      osVersion: 'Linux 5.15.0-82-generic',
      softwareVersion: 'ControlSys v3.5.2',
      lastUpdate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      installDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      uptime: nodeId === 'CTRL-001' ? 432000 : 86400, // 秒数，5天 vs 1天
      cpuUsage: nodeId === 'CTRL-001' ? 32 : 45,
      memoryUsage: nodeId === 'CTRL-001' ? 48 : 62,
      connectionLogs: [
        {
          time: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          event: '系统检查',
          details: '定期系统状态检查',
          status: '成功'
        },
        {
          time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          event: '配置更新',
          details: '应用新的网络配置',
          status: '成功'
        },
        {
          time: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          event: '连接中断',
          details: '网络连接临时中断',
          status: '警告'
        },
        {
          time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          event: '系统重启',
          details: '计划内系统维护重启',
          status: '信息'
        },
        {
          time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          event: '软件更新',
          details: '更新到ControlSys v3.5.2',
          status: '成功'
        }
      ]
    };

    // 生成模拟图表数据
    cpuChartSeries.value = [
      {
        name: 'CPU使用率',
        data: generateRandomSeries(node.value.cpuUsage, 15)
      }
    ];

    memoryChartSeries.value = [
      {
        name: '内存使用率',
        data: generateRandomSeries(node.value.memoryUsage, 10)
      }
    ];

    networkChartSeries.value = [
      {
        name: '上传速率',
        data: generateRandomSeries(5, 3)
      },
      {
        name: '下载速率',
        data: generateRandomSeries(12, 6)
      }
    ];

  } catch (error) {
    console.error('获取节点详情失败:', error);
    // 这里可以添加错误处理逻辑
  } finally {
    loading.value = false;
  }
});
</script>

<style>
/* 可以添加一些全局样式，特别是图表相关的样式 */
.apexcharts-tooltip {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
  border-radius: 8px !important;
}

/* 图表工具栏样式优化 */
.apexcharts-toolbar {
  opacity: 0.8 !important;
  transition: opacity 0.2s ease-in-out !important;
}

.apexcharts-toolbar:hover {
  opacity: 1 !important;
}

/* 图表交互优化 */
.apexcharts-canvas {
  border-radius: 8px;
  overflow: hidden;
}
</style>