<template>
  <div>
    <!-- 欢迎卡片与概览 -->
    <div class="mb-6">
      <div class="rounded-lg shadow-lg p-6" :class="isDarkMode
        ? 'bg-gradient-to-r from-blue-800 to-blue-900'
        : 'bg-gradient-to-r from-blue-500 to-blue-700'">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 class="text-white text-2xl font-bold">欢迎回来，{{userName}}</h1>
            <p class="text-blue-100 mt-1">今天是 {{currentDate}} · 最后登录时间: {{lastLoginTime}}</p>
          </div>
          <div class="mt-4 md:mt-0">
            <button
                class="bg-white/20 hover:bg-white/30 text-white rounded-lg px-4 py-2 transition-all duration-200 flex items-center"
                @click="refreshData"
            >
              <Icon icon="mdi:refresh" class="mr-2" :class="{ 'animate-spin': isRefreshing }" />
              刷新数据
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 关键数据卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <!-- 系统状态卡片 -->
      <div class="rounded-lg shadow-md p-6 transition-transform hover:scale-105 duration-300"
           :class="isDarkMode ? 'bg-gray-800' : 'bg-white'">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">系统状态</p>
            <h3 class="text-2xl font-bold" :class="systemStatus.color">{{ systemStatus.label }}</h3>
          </div>
          <div :class="`${systemStatus.bgColor} p-3 rounded-full`">
            <Icon :icon="systemStatus.icon" class="h-6 w-6 text-white" />
          </div>
        </div>
        <div class="mt-4">
          <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
            已运行时间: <span class="font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">{{ uptime }}</span>
          </p>
        </div>
      </div>

      <!-- CPU使用率卡片 -->
      <div class="rounded-lg shadow-md p-6 transition-transform hover:scale-105 duration-300"
           :class="isDarkMode ? 'bg-gray-800' : 'bg-white'">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">CPU使用率</p>
            <h3 class="text-2xl font-bold"
                :class="cpuUsage < 50 ? (isDarkMode ? 'text-green-400' : 'text-green-600') :
                        cpuUsage < 80 ? (isDarkMode ? 'text-yellow-400' : 'text-yellow-600') :
                        (isDarkMode ? 'text-red-400' : 'text-red-600')">
              {{ cpuUsage }}%
            </h3>
          </div>
          <div class="bg-blue-600 p-3 rounded-full">
            <Icon icon="mdi:cpu-64-bit" class="h-6 w-6 text-white" />
          </div>
        </div>
        <div class="mt-4">
          <div class="w-full rounded-full h-2.5" :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-200'">
            <div class="h-2.5 rounded-full"
                 :class="cpuUsage < 50 ? 'bg-green-600' : cpuUsage < 80 ? 'bg-yellow-500' : 'bg-red-600'"
                 :style="`width: ${cpuUsage}%`"></div>
          </div>
        </div>
      </div>

      <!-- 内存使用率卡片 -->
      <div class="rounded-lg shadow-md p-6 transition-transform hover:scale-105 duration-300"
           :class="isDarkMode ? 'bg-gray-800' : 'bg-white'">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">内存使用率</p>
            <h3 class="text-2xl font-bold"
                :class="memoryUsage < 50 ? (isDarkMode ? 'text-green-400' : 'text-green-600') :
                        memoryUsage < 80 ? (isDarkMode ? 'text-yellow-400' : 'text-yellow-600') :
                        (isDarkMode ? 'text-red-400' : 'text-red-600')">
              {{ memoryUsage }}%
            </h3>
          </div>
          <div class="bg-purple-600 p-3 rounded-full">
            <Icon icon="mdi:memory" class="h-6 w-6 text-white" />
          </div>
        </div>
        <div class="mt-4">
          <div class="w-full rounded-full h-2.5" :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-200'">
            <div class="h-2.5 rounded-full"
                 :class="memoryUsage < 50 ? 'bg-green-600' : memoryUsage < 80 ? 'bg-yellow-500' : 'bg-red-600'"
                 :style="`width: ${memoryUsage}%`"></div>
          </div>
          <p class="text-sm mt-2" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
            <span class="font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">{{ usedMemory }} GB</span> / {{ totalMemory }} GB
          </p>
        </div>
      </div>

      <!-- 网络状态卡片 -->
      <div class="rounded-lg shadow-md p-6 transition-transform hover:scale-105 duration-300"
           :class="isDarkMode ? 'bg-gray-800' : 'bg-white'">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">网络状态</p>
            <div class="flex items-center">
              <h3 class="text-2xl font-bold" :class="isDarkMode ? 'text-blue-400' : 'text-blue-600'">{{ networkSpeed }}</h3>
              <span class="ml-1" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">Mbps</span>
            </div>
          </div>
          <div class="bg-green-600 p-3 rounded-full">
            <Icon icon="mdi:server-network" class="h-6 w-6 text-white" />
          </div>
        </div>
        <div class="mt-4 flex items-center justify-between text-sm">
          <div>
            <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">下载:
              <span class="font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">{{ downloadSpeed }} MB/s</span>
            </p>
          </div>
          <div>
            <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">上传:
              <span class="font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">{{ uploadSpeed }} MB/s</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 安全状态与系统监控 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- 安全状态卡片 -->
      <div class="rounded-lg shadow-md p-6 col-span-1" :class="isDarkMode ? 'bg-gray-800' : 'bg-white'">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">安全状态</h3>
          <span class="px-2 py-1 text-xs rounded-full font-medium"
                :class="securityStatus.level === 'high' ?
                  (isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800') :
                  securityStatus.level === 'medium' ?
                  (isDarkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800') :
                  (isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800')">
            {{ securityStatus.text }}
          </span>
        </div>

        <div class="space-y-4">
          <div v-for="(item, index) in securityChecks" :key="index"
               class="flex items-center p-3 rounded-lg"
               :class="item.status === 'passed' ?
                  (isDarkMode ? 'bg-green-900/20' : 'bg-green-50') :
                  item.status === 'warning' ?
                  (isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50') :
                  (isDarkMode ? 'bg-red-900/20' : 'bg-red-50')">
            <div class="p-2 rounded-full mr-3"
                 :class="item.status === 'passed' ?
                    (isDarkMode ? 'bg-green-800' : 'bg-green-200') :
                    item.status === 'warning' ?
                    (isDarkMode ? 'bg-yellow-800' : 'bg-yellow-200') :
                    (isDarkMode ? 'bg-red-800' : 'bg-red-200')">
              <Icon :icon="item.icon"
                    :class="item.status === 'passed' ?
                       (isDarkMode ? 'text-green-400' : 'text-green-700') :
                       item.status === 'warning' ?
                       (isDarkMode ? 'text-yellow-400' : 'text-yellow-700') :
                       (isDarkMode ? 'text-red-400' : 'text-red-700')"
                    class="h-5 w-5" />
            </div>
            <div>
              <p class="font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-800'">{{ item.name }}</p>
              <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 最近活动和网络监控 -->
      <div class="rounded-lg shadow-md p-6 col-span-1 lg:col-span-2" :class="isDarkMode ? 'bg-gray-800' : 'bg-white'">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">网络活动</h3>
          <button class="text-sm flex items-center hover:underline" :class="isDarkMode ? 'text-blue-400' : 'text-blue-600'">
            查看详情
            <Icon icon="mdi:chevron-right" class="h-4 w-4" />
          </button>
        </div>

        <div class="space-y-4">
          <div v-for="(activity, index) in networkActivities" :key="index"
               class="flex items-start pb-3 last:pb-0"
               :class="index !== networkActivities.length - 1 ? (isDarkMode ? 'border-b border-gray-700' : 'border-b border-gray-200') : ''">
            <div class="p-2 rounded-full mr-3 mt-1"
                 :class="activity.type === 'info' ?
                    (isDarkMode ? 'bg-blue-900/40' : 'bg-blue-100') :
                    activity.type === 'warning' ?
                    (isDarkMode ? 'bg-yellow-900/40' : 'bg-yellow-100') :
                    activity.type === 'danger' ?
                    (isDarkMode ? 'bg-red-900/40' : 'bg-red-100') :
                    (isDarkMode ? 'bg-green-900/40' : 'bg-green-100')">
              <Icon :icon="activity.icon" class="h-5 w-5"
                    :class="activity.type === 'info' ?
                      (isDarkMode ? 'text-blue-400' : 'text-blue-700') :
                      activity.type === 'warning' ?
                      (isDarkMode ? 'text-yellow-400' : 'text-yellow-700') :
                      activity.type === 'danger' ?
                      (isDarkMode ? 'text-red-400' : 'text-red-700') :
                      (isDarkMode ? 'text-green-400' : 'text-green-700')" />
            </div>
            <div class="flex-1">
              <div class="flex justify-between">
                <p class="font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-800'">{{ activity.title }}</p>
                <span class="text-xs" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">{{ activity.time }}</span>
              </div>
              <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">{{ activity.description }}</p>
              <div v-if="activity.details" class="mt-2">
                <div class="text-xs p-2 rounded" :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-100'">
                  <p class="font-mono" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">{{ activity.details }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速操作及服务状态 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 快速操作 -->
      <div class="rounded-lg shadow-md p-6" :class="isDarkMode ? 'bg-gray-800' : 'bg-white'">
        <h3 class="text-lg font-bold mb-4" :class="isDarkMode ? 'text-white' : 'text-gray-800'">快速操作</h3>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <button v-for="(action, index) in quickActions" :key="index"
                  class="flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-200"
                  :class="isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'">
            <div class="p-3 rounded-full mb-2" :class="action.bgColor">
              <Icon :icon="action.icon" class="h-5 w-5 text-white" />
            </div>
            <span class="text-sm font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-800'">{{ action.name }}</span>
          </button>
        </div>
      </div>

      <!-- 服务状态 -->
      <div class="rounded-lg shadow-md p-6" :class="isDarkMode ? 'bg-gray-800' : 'bg-white'">
        <h3 class="text-lg font-bold mb-4" :class="isDarkMode ? 'text-white' : 'text-gray-800'">服务状态</h3>

        <div class="space-y-3">
          <div v-for="(service, index) in services" :key="index"
               class="flex items-center justify-between p-3 rounded-lg"
               :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-100'">
            <div class="flex items-center">
              <div class="p-2 rounded-full mr-3" :class="service.bgColor">
                <Icon :icon="service.icon" class="h-5 w-5 text-white" />
              </div>
              <span class="font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-800'">{{ service.name }}</span>
            </div>
            <div class="flex items-center">
              <span class="h-2 w-2 rounded-full mr-2"
                    :class="service.status === 'running' ? 'bg-green-500' :
                            service.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'"></span>
              <span class="text-xs uppercase font-medium"
                    :class="service.status === 'running' ?
                       (isDarkMode ? 'text-green-400' : 'text-green-600') :
                       service.status === 'warning' ?
                       (isDarkMode ? 'text-yellow-400' : 'text-yellow-600') :
                       (isDarkMode ? 'text-red-400' : 'text-red-600')">
                {{ service.statusText }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, inject, watch} from 'vue';
import {Icon} from '@iconify/vue';

// 获取暗黑模式状态 - 从父组件注入
const isDarkMode = inject('isDarkMode', ref(false));

// 用户信息
const userName = ref('管理员');
const lastLoginTime = ref('2025-04-08 08:32');
const currentDate = ref(new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long'
}));

// 系统状态数据
const cpuUsage = ref(42);
const memoryUsage = ref(56);
const totalMemory = ref(32);
const usedMemory = computed(() => {
  return ((memoryUsage.value / 100) * totalMemory.value).toFixed(1);
});
const networkSpeed = ref(985);
const downloadSpeed = ref(12.5);
const uploadSpeed = ref(3.8);
const uptime = ref('7天8小时34分钟');

// 系统状态指示器
const systemStatus = computed(() => {
  if (cpuUsage.value < 50 && memoryUsage.value < 70) {
    return {
      label: '正常',
      color: isDarkMode.value ? 'text-green-400' : 'text-green-600',
      bgColor: 'bg-green-600',
      icon: 'mdi:check-circle'
    };
  } else if (cpuUsage.value < 80 && memoryUsage.value < 85) {
    return {
      label: '轻负载',
      color: isDarkMode.value ? 'text-yellow-400' : 'text-yellow-600',
      bgColor: 'bg-yellow-500',
      icon: 'mdi:alert-circle'
    };
  } else {
    return {
      label: '重负载',
      color: isDarkMode.value ? 'text-red-400' : 'text-red-600',
      bgColor: 'bg-red-600',
      icon: 'mdi:alert'
    };
  }
});

// 安全状态
const securityStatus = ref({
  level: 'high',
  text: '安全保护中'
});

// 安全检查项
const securityChecks = ref([
  {
    name: '防火墙',
    description: '防火墙已启用并正常运行',
    status: 'passed',
    icon: 'mdi:shield'
  },
  {
    name: '恶意软件防护',
    description: '已更新至最新病毒库(2025.04.05)',
    status: 'passed',
    icon: 'mdi:virus'
  },
  {
    name: '系统更新',
    description: '有2个可用更新待安装',
    status: 'warning',
    icon: 'mdi:update'
  },
  {
    name: '漏洞扫描',
    description: '上次扫描: 2天前，未发现漏洞',
    status: 'passed',
    icon: 'mdi:shield-search'
  }
]);

// 网络活动
const networkActivities = ref([
  {
    type: 'danger',
    icon: 'mdi:shield-alert',
    title: '检测到SSH暴力破解尝试',
    description: '来自IP 192.168.1.123的多次失败登录',
    time: '刚刚',
    details: 'SSH: 15 failed login attempts from 192.168.1.123 in 3 minutes'
  },
  {
    type: 'info',
    icon: 'mdi:server',
    title: '服务器自动备份完成',
    description: '每日备份任务成功完成',
    time: '35分钟前'
  },
  {
    type: 'warning',
    icon: 'mdi:cpu-64-bit',
    title: 'CPU使用率峰值',
    description: '检测到CPU峰值使用率超过85%',
    time: '1小时前'
  },
  {
    type: 'success',
    icon: 'mdi:security',
    title: '安全扫描完成',
    description: '定期安全扫描已完成，未发现问题',
    time: '3小时前'
  }
]);

// 快速操作
const quickActions = ref([
  {
    name: '系统扫描',
    icon: 'mdi:virus-scan',
    bgColor: 'bg-blue-600'
  },
  {
    name: '网络诊断',
    icon: 'mdi:lan',
    bgColor: 'bg-green-600'
  },
  {
    name: '系统更新',
    icon: 'mdi:update',
    bgColor: 'bg-purple-600'
  },
  {
    name: '防火墙设置',
    icon: 'mdi:firewall',
    bgColor: 'bg-orange-600'
  },
  {
    name: '备份数据',
    icon: 'mdi:database',
    bgColor: 'bg-cyan-600'
  },
  {
    name: '性能监控',
    icon: 'mdi:chart-line',
    bgColor: 'bg-red-600'
  }
]);

// 服务状态
const services = ref([
  {
    name: 'Web服务器',
    icon: 'mdi:web',
    status: 'running',
    statusText: '运行中',
    bgColor: 'bg-blue-600'
  },
  {
    name: '数据库服务',
    icon: 'mdi:database',
    status: 'running',
    statusText: '运行中',
    bgColor: 'bg-green-600'
  },
  {
    name: 'DNS服务器',
    icon: 'mdi:dns',
    status: 'warning',
    statusText: '警告',
    bgColor: 'bg-orange-600'
  },
  {
    name: '代理服务器',
    icon: 'mdi:server-network',
    status: 'running',
    statusText: '运行中',
    bgColor: 'bg-purple-600'
  },
  {
    name: '邮件服务',
    icon: 'mdi:email',
    status: 'error',
    statusText: '错误',
    bgColor: 'bg-red-600'
  }
]);

// 刷新数据状态
const isRefreshing = ref(false);

// 刷新数据方法
const refreshData = () => {
  isRefreshing.value = true;

  // 模拟数据加载
  setTimeout(() => {
    // 更新CPU使用率（随机值在30-75之间）
    cpuUsage.value = Math.floor(Math.random() * 45) + 30;

    // 更新内存使用率（随机值在40-80之间）
    memoryUsage.value = Math.floor(Math.random() * 40) + 40;

    // 更新网络速度（随机值在800-1000之间）
    networkSpeed.value = Math.floor(Math.random() * 200) + 800;
    downloadSpeed.value = (Math.random() * 15 + 8).toFixed(1);
    uploadSpeed.value = (Math.random() * 5 + 1).toFixed(1);

    isRefreshing.value = false;
  }, 1000);
};

// 监视暗黑模式变化，更新依赖于它的计算属性
watch(isDarkMode, () => {
  // 这会强制更新 systemStatus 计算属性
  cpuUsage.value = cpuUsage.value + 0.001;
  setTimeout(() => {
    cpuUsage.value = cpuUsage.value - 0.001;
  }, 0);
});

// 组件挂载时初始化
onMounted(() => {
  // 这里可以添加初始化代码，如从API获取实时数据
  refreshData();
});
</script>