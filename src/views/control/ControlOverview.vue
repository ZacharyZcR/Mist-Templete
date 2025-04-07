<template>
  <div>
    <!-- 页面标题和操作 -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
      <h1 class="text-2xl font-bold mb-4 md:mb-0" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
        集控总览
      </h1>
      <div class="flex flex-wrap gap-3">
        <button
            @click="refreshData"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200 transform hover:translate-y-[-2px]"
            :class="isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'"
        >
          <Icon icon="mdi:refresh" class="mr-2 h-5 w-5" :class="isLoading ? 'animate-spin' : ''" />
          刷新数据
        </button>
        <router-link
            to="/control/map"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200 transform hover:translate-y-[-2px] bg-blue-600 text-white hover:bg-blue-700"
        >
          <Icon icon="mdi:map" class="mr-2 h-5 w-5" />
          查看地图
        </router-link>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" :class="isDarkMode ? 'border-blue-400' : 'border-blue-600'"></div>
    </div>

    <div v-else>
      <!-- 主要指标卡片 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <!-- 总节点数 -->
        <div class="rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md"
             :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">总节点数</p>
              <h3 class="text-2xl font-bold mt-2" :class="isDarkMode ? 'text-white' : 'text-gray-800'">{{ metrics.totalNodes }}</h3>
            </div>
            <div class="p-3 rounded-full" :class="isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'">
              <Icon icon="mdi:server-network" class="h-6 w-6" />
            </div>
          </div>
          <div class="mt-4 flex items-center">
            <span :class="metrics.nodeGrowth > 0 ? 'text-green-500' : 'text-red-500'">
              <Icon :icon="metrics.nodeGrowth > 0 ? 'mdi:arrow-up' : 'mdi:arrow-down'" class="h-4 w-4 inline" />
              {{ Math.abs(metrics.nodeGrowth) }}%
            </span>
            <span class="ml-2 text-xs" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">相比上月</span>
          </div>
        </div>

        <!-- 在线节点 -->
        <div class="rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md"
             :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">在线节点</p>
              <h3 class="text-2xl font-bold mt-2" :class="isDarkMode ? 'text-white' : 'text-gray-800'">{{ metrics.onlineNodes }}</h3>
            </div>
            <div class="p-3 rounded-full" :class="isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'">
              <Icon icon="mdi:check-circle" class="h-6 w-6" />
            </div>
          </div>
          <div class="mt-4">
            <div class="w-full bg-gray-200 rounded-full h-2.5" :class="isDarkMode ? 'bg-gray-700' : ''">
              <div class="bg-green-600 h-2.5 rounded-full" :style="`width: ${Math.round(metrics.onlineNodes / metrics.totalNodes * 100)}%`"></div>
            </div>
            <p class="text-xs mt-1 text-right" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
              {{ Math.round(metrics.onlineNodes / metrics.totalNodes * 100) }}% 在线率
            </p>
          </div>
        </div>

        <!-- 警告节点 -->
        <div class="rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md"
             :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">警告节点</p>
              <h3 class="text-2xl font-bold mt-2" :class="isDarkMode ? 'text-white' : 'text-gray-800'">{{ metrics.warningNodes }}</h3>
            </div>
            <div class="p-3 rounded-full" :class="isDarkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-600'">
              <Icon icon="mdi:alert-circle" class="h-6 w-6" />
            </div>
          </div>
          <div class="mt-4">
            <router-link to="/control/list" class="text-sm font-medium hover:underline"
                         :class="isDarkMode ? 'text-blue-400' : 'text-blue-600'">
              查看详情 →
            </router-link>
          </div>
        </div>

        <!-- 系统健康度 -->
        <div class="rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md"
             :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">系统健康度</p>
              <h3 class="text-2xl font-bold mt-2" :class="isDarkMode ? 'text-white' : 'text-gray-800'">{{ metrics.systemHealth }}%</h3>
            </div>
            <div class="p-3 rounded-full"
                 :class="getHealthColor(metrics.systemHealth)">
              <Icon :icon="getHealthIcon(metrics.systemHealth)" class="h-6 w-6" />
            </div>
          </div>
          <div class="mt-4">
            <div class="w-full bg-gray-200 rounded-full h-2.5" :class="isDarkMode ? 'bg-gray-700' : ''">
              <div class="h-2.5 rounded-full"
                   :class="getHealthBarColor(metrics.systemHealth)"
                   :style="`width: ${metrics.systemHealth}%`"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 节点状态分布和性能指标 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- 节点状态分布 -->
        <div class="rounded-lg shadow-sm p-6" :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
          <h2 class="text-lg font-medium mb-4" :class="isDarkMode ? 'text-gray-200' : 'text-gray-700'">节点状态分布</h2>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div class="w-40 h-40 relative">
              <div class="absolute inset-0 flex items-center justify-center flex-col">
                <span class="text-3xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
                  {{ metrics.totalNodes }}
                </span>
                <span class="text-xs" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">总节点数</span>
              </div>
              <!-- 这里模拟一个环形图，实际项目中应使用图表库 -->
              <svg viewBox="0 0 36 36" class="w-full h-full transform -rotate-90">
                <!-- 在线节点(绿色) -->
                <path
                    :d="describeArc(18, 18, 15, 0, (metrics.onlineNodes / metrics.totalNodes) * 360)"
                    :class="isDarkMode ? 'stroke-green-500' : 'stroke-green-400'"
                    class="stroke-[3] fill-none"
                ></path>
                <!-- 离线节点(灰色) -->
                <path
                    :d="describeArc(18, 18, 15,
                    (metrics.onlineNodes / metrics.totalNodes) * 360,
                    (metrics.onlineNodes / metrics.totalNodes) * 360 + (metrics.offlineNodes / metrics.totalNodes) * 360)"
                    :class="isDarkMode ? 'stroke-gray-600' : 'stroke-gray-300'"
                    class="stroke-[3] fill-none"
                ></path>
                <!-- 警告节点(黄色) -->
                <path
                    :d="describeArc(18, 18, 15,
                    (metrics.onlineNodes / metrics.totalNodes) * 360 + (metrics.offlineNodes / metrics.totalNodes) * 360,
                    (metrics.onlineNodes / metrics.totalNodes) * 360 + (metrics.offlineNodes / metrics.totalNodes) * 360 + (metrics.warningNodes / metrics.totalNodes) * 360)"
                    :class="isDarkMode ? 'stroke-yellow-500' : 'stroke-yellow-400'"
                    class="stroke-[3] fill-none"
                ></path>
                <!-- 错误节点(红色) -->
                <path
                    :d="describeArc(18, 18, 15,
                    (metrics.onlineNodes / metrics.totalNodes) * 360 + (metrics.offlineNodes / metrics.totalNodes) * 360 + (metrics.warningNodes / metrics.totalNodes) * 360,
                    360)"
                    :class="isDarkMode ? 'stroke-red-500' : 'stroke-red-400'"
                    class="stroke-[3] fill-none"
                ></path>
              </svg>
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex items-center">
                <span class="w-3 h-3 rounded-full bg-green-400 mr-2"></span>
                <span :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">在线</span>
                <span class="ml-auto font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-800'">{{ metrics.onlineNodes }}</span>
              </div>
              <div class="flex items-center">
                <span class="w-3 h-3 rounded-full mr-2" :class="isDarkMode ? 'bg-gray-600' : 'bg-gray-300'"></span>
                <span :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">离线</span>
                <span class="ml-auto font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-800'">{{ metrics.offlineNodes }}</span>
              </div>
              <div class="flex items-center">
                <span class="w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>
                <span :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">警告</span>
                <span class="ml-auto font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-800'">{{ metrics.warningNodes }}</span>
              </div>
              <div class="flex items-center">
                <span class="w-3 h-3 rounded-full bg-red-400 mr-2"></span>
                <span :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">错误</span>
                <span class="ml-auto font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-800'">{{ metrics.errorNodes }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 系统性能 -->
        <div class="rounded-lg shadow-sm p-6" :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
          <h2 class="text-lg font-medium mb-4" :class="isDarkMode ? 'text-gray-200' : 'text-gray-700'">系统性能</h2>
          <div class="space-y-6">
            <!-- CPU使用率 -->
            <div>
              <div class="flex justify-between mb-1">
                <span class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">CPU 使用率</span>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-800'">{{ performance.cpu }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5" :class="isDarkMode ? 'bg-gray-700' : ''">
                <div class="bg-blue-600 h-2.5 rounded-full" :style="`width: ${performance.cpu}%`"></div>
              </div>
            </div>
            <!-- 内存使用率 -->
            <div>
              <div class="flex justify-between mb-1">
                <span class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">内存使用率</span>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-800'">{{ performance.memory }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5" :class="isDarkMode ? 'bg-gray-700' : ''">
                <div class="bg-purple-600 h-2.5 rounded-full" :style="`width: ${performance.memory}%`"></div>
              </div>
            </div>
            <!-- 网络带宽 -->
            <div>
              <div class="flex justify-between mb-1">
                <span class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">网络带宽使用率</span>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-800'">{{ performance.network }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5" :class="isDarkMode ? 'bg-gray-700' : ''">
                <div class="bg-teal-600 h-2.5 rounded-full" :style="`width: ${performance.network}%`"></div>
              </div>
            </div>
            <!-- 存储空间 -->
            <div>
              <div class="flex justify-between mb-1">
                <span class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">存储空间使用率</span>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-800'">{{ performance.storage }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5" :class="isDarkMode ? 'bg-gray-700' : ''">
                <div class="bg-amber-600 h-2.5 rounded-full" :style="`width: ${performance.storage}%`"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 最近告警和快速操作 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 最近告警 -->
        <div class="lg:col-span-2 rounded-lg shadow-sm overflow-hidden" :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
          <div class="px-6 py-4 border-b flex justify-between items-center" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
            <h2 class="text-lg font-medium" :class="isDarkMode ? 'text-gray-200' : 'text-gray-700'">最近告警</h2>
            <button class="text-sm hover:underline" :class="isDarkMode ? 'text-blue-400' : 'text-blue-600'">
              查看全部
            </button>
          </div>

          <div v-if="recentAlerts.length === 0" class="px-6 py-12 flex flex-col items-center justify-center">
            <Icon icon="mdi:bell-off" class="h-12 w-12 mb-4" :class="isDarkMode ? 'text-gray-600' : 'text-gray-400'" />
            <p class="text-center" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
              暂无告警信息
            </p>
          </div>

          <ul v-else class="divide-y" :class="isDarkMode ? 'divide-gray-700' : 'divide-gray-200'">
            <li v-for="(alert, index) in recentAlerts" :key="index" class="px-6 py-4 hover:transition-all duration-150"
                :class="isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'">
              <div class="flex items-start">
                <div :class="`rounded-full p-2 mr-3 flex-shrink-0 ${getAlertSeverityClass(alert.severity)}`">
                  <Icon :icon="getAlertSeverityIcon(alert.severity)" class="h-5 w-5" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                    {{ alert.message }}
                  </p>
                  <p class="text-sm mt-1" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                    节点: {{ alert.nodeName }} ({{ alert.nodeId }})
                  </p>
                  <div class="mt-2 flex items-center">
                    <span class="text-xs" :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'">
                      {{ formatTime(alert.time) }}
                    </span>
                    <button class="ml-auto text-xs px-2 py-1 rounded-full"
                            :class="isDarkMode ? 'bg-gray-700 text-blue-400 hover:bg-gray-600' : 'bg-gray-100 text-blue-600 hover:bg-gray-200'">
                      处理
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- 快速操作 -->
        <div class="rounded-lg shadow-sm" :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
          <div class="px-6 py-4 border-b" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
            <h2 class="text-lg font-medium" :class="isDarkMode ? 'text-gray-200' : 'text-gray-700'">快速操作</h2>
          </div>
          <div class="p-6 space-y-4">
            <router-link
                to="/control/create"
                class="block w-full py-3 px-4 rounded-lg text-center font-medium transition-colors duration-200"
                :class="isDarkMode ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'"
            >
              <div class="flex items-center justify-center">
                <Icon icon="mdi:plus-circle" class="h-5 w-5 mr-2" />
                <span>创建新节点</span>
              </div>
            </router-link>

            <button
                class="block w-full py-3 px-4 rounded-lg text-center font-medium transition-colors duration-200"
                :class="isDarkMode ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30' : 'bg-green-50 text-green-600 hover:bg-green-100'"
            >
              <div class="flex items-center justify-center">
                <Icon icon="mdi:refresh" class="h-5 w-5 mr-2" />
                <span>同步所有节点</span>
              </div>
            </button>

            <button
                class="block w-full py-3 px-4 rounded-lg text-center font-medium transition-colors duration-200"
                :class="isDarkMode ? 'bg-amber-600/20 text-amber-400 hover:bg-amber-600/30' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'"
            >
              <div class="flex items-center justify-center">
                <Icon icon="mdi:puzzle" class="h-5 w-5 mr-2" />
                <span>运行诊断</span>
              </div>
            </button>

            <button
                class="block w-full py-3 px-4 rounded-lg text-center font-medium transition-colors duration-200"
                :class="isDarkMode ? 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/30' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'"
            >
              <div class="flex items-center justify-center">
                <Icon icon="mdi:chart-box" class="h-5 w-5 mr-2" />
                <span>生成报告</span>
              </div>
            </button>
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
const isLoading = ref(true);

// 系统概览指标
const metrics = ref({
  totalNodes: 0,
  onlineNodes: 0,
  offlineNodes: 0,
  warningNodes: 0,
  errorNodes: 0,
  systemHealth: 0,
  nodeGrowth: 0
});

// 系统性能数据
const performance = ref({
  cpu: 0,
  memory: 0,
  network: 0,
  storage: 0
});

// 最近告警
const recentAlerts = ref([]);

// 刷新数据
const refreshData = async () => {
  isLoading.value = true;
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    await loadData();
  } catch (error) {
    console.error('刷新数据失败:', error);
  } finally {
    isLoading.value = false;
  }
};

// 获取健康状态颜色
const getHealthColor = (health) => {
  if (isDarkMode.value) {
    if (health >= 90) return 'bg-green-900/30 text-green-400';
    if (health >= 70) return 'bg-blue-900/30 text-blue-400';
    if (health >= 50) return 'bg-yellow-900/30 text-yellow-400';
    return 'bg-red-900/30 text-red-400';
  } else {
    if (health >= 90) return 'bg-green-100 text-green-600';
    if (health >= 70) return 'bg-blue-100 text-blue-600';
    if (health >= 50) return 'bg-yellow-100 text-yellow-600';
    return 'bg-red-100 text-red-600';
  }
};

// 获取健康状态图标
const getHealthIcon = (health) => {
  if (health >= 90) return 'mdi:shield-check';
  if (health >= 70) return 'mdi:shield';
  if (health >= 50) return 'mdi:shield-alert';
  return 'mdi:shield-off';
};

// 获取健康度进度条颜色
const getHealthBarColor = (health) => {
  if (health >= 90) return 'bg-green-600';
  if (health >= 70) return 'bg-blue-600';
  if (health >= 50) return 'bg-yellow-600';
  return 'bg-red-600';
};

// 获取告警严重程度类
const getAlertSeverityClass = (severity) => {
  if (isDarkMode.value) {
    const severityMap = {
      'critical': 'bg-red-900/30 text-red-400',
      'major': 'bg-amber-900/30 text-amber-400',
      'minor': 'bg-yellow-900/30 text-yellow-400',
      'info': 'bg-blue-900/30 text-blue-400'
    };
    return severityMap[severity] || 'bg-gray-900/30 text-gray-400';
  } else {
    const severityMap = {
      'critical': 'bg-red-100 text-red-600',
      'major': 'bg-amber-100 text-amber-600',
      'minor': 'bg-yellow-100 text-yellow-600',
      'info': 'bg-blue-100 text-blue-600'
    };
    return severityMap[severity] || 'bg-gray-100 text-gray-600';
  }
};

// 获取告警严重程度图标
const getAlertSeverityIcon = (severity) => {
  const severityMap = {
    'critical': 'mdi:alert-circle',
    'major': 'mdi:alert',
    'minor': 'mdi:alert-outline',
    'info': 'mdi:information'
  };
  return severityMap[severity] || 'mdi:bell';
};

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
};

// 生成SVG圆弧路径
const describeArc = (x, y, radius, startAngle, endAngle) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
};

// 极坐标转笛卡尔坐标
const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
};

// 加载数据
const loadData = async () => {
  try {
    // 这里应该是真实的API调用
    // 模拟数据
    metrics.value = {
      totalNodes: 18,
      onlineNodes: 12,
      offlineNodes: 3,
      warningNodes: 2,
      errorNodes: 1,
      systemHealth: 85,
      nodeGrowth: 12
    };

    performance.value = {
      cpu: 45,
      memory: 62,
      network: 38,
      storage: 72
    };

    recentAlerts.value = [
      {
        severity: 'critical',
        message: 'CPU使用率超过95%',
        nodeName: '主控节点A',
        nodeId: 'CTRL-001',
        time: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      },
      {
        severity: 'major',
        message: '内存使用率超过80%',
        nodeName: '边缘节点C',
        nodeId: 'CTRL-003',
        time: new Date(Date.now() - 45 * 60 * 1000).toISOString()
      },
      {
        severity: 'minor',
        message: '网络连接不稳定',
        nodeName: '备用节点B',
        nodeId: 'CTRL-002',
        time: new Date(Date.now() - 120 * 60 * 1000).toISOString()
      },
      {
        severity: 'info',
        message: '系统已自动完成更新',
        nodeName: '测试节点E',
        nodeId: 'CTRL-005',
        time: new Date(Date.now() - 180 * 60 * 1000).toISOString()
      }
    ];
  } catch (error) {
    console.error('获取集控总览数据失败:', error);
  }
};

// 组件挂载时加载数据
onMounted(async () => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1200));
    await loadData();
  } catch (error) {
    console.error('获取集控总览数据失败:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>
