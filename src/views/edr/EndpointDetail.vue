<template>
  <div>
    <!-- 页面标题和操作栏 -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
      <div class="flex items-center">
        <button @click="goBack"
                :class="isDarkMode ? 'mr-3 text-gray-400 hover:text-gray-300' : 'mr-3 text-gray-500 hover:text-gray-700'">
          <Icon icon="mdi:arrow-left" class="h-6 w-6" />
        </button>
        <h1 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
          终端详情: {{ endpoint.name }}
          <span v-if="endpoint" class="ml-2 text-sm px-2.5 py-1 inline-flex leading-5 font-semibold rounded-full"
                :class="statusClass(endpoint.status)">
            {{ statusText(endpoint.status) }}
          </span>
        </h1>
      </div>
      <div class="flex flex-wrap gap-3 mt-4 md:mt-0">
        <button
            @click="scanEndpoint"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-500'"
        >
          <Icon icon="mdi:scan" class="mr-2 h-5 w-5" />
          执行扫描
        </button>
        <button
            @click="isolateEndpoint"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode ? 'bg-yellow-600 text-white hover:bg-yellow-700' : 'bg-yellow-600 text-white hover:bg-yellow-500'"
        >
          <Icon icon="mdi:server-network-off" class="mr-2 h-5 w-5" />
          网络隔离
        </button>
        <button
            @click="refreshEndpoint"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'"
        >
          <Icon icon="mdi:refresh" class="mr-2 h-5 w-5" />
          刷新
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" :class="isDarkMode ? 'border-blue-400' : 'border-blue-600'"></div>
    </div>

    <div v-else-if="endpoint" class="space-y-6">
      <!-- 终端基本信息 -->
      <div class="rounded-xl shadow-sm overflow-hidden"
           :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
        <div class="px-6 py-4 border-b" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
          <h2 class="text-lg font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-800'">基本信息</h2>
        </div>
        <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">主机名:</span>
            <p class="text-sm mt-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">{{ endpoint.name }}</p>
          </div>
          <div>
            <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">IP地址:</span>
            <p class="text-sm mt-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">{{ endpoint.ip }}</p>
          </div>
          <div>
            <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">MAC地址:</span>
            <p class="text-sm mt-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">{{ endpoint.mac }}</p>
          </div>
          <div>
            <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">操作系统:</span>
            <p class="text-sm mt-1 flex items-center" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              <Icon :icon="getOsIcon(endpoint.os)" class="mr-2 h-5 w-5" />
              {{ endpoint.os }} {{ endpoint.osVersion }}
            </p>
          </div>
          <div>
            <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">终端分组:</span>
            <p class="text-sm mt-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">{{ endpoint.group }}</p>
          </div>
          <div>
            <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">代理版本:</span>
            <p class="text-sm mt-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">{{ endpoint.agentVersion }}</p>
          </div>
          <div>
            <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">最后在线时间:</span>
            <p class="text-sm mt-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">{{ formatDate(endpoint.lastOnline, true) }}</p>
          </div>
          <div>
            <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">状态:</span>
            <p class="mt-1">
              <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="statusClass(endpoint.status)">
                {{ statusText(endpoint.status) }}
              </span>
            </p>
          </div>
        </div>
      </div>

      <!-- 硬件信息 -->
      <div class="rounded-xl shadow-sm overflow-hidden"
           :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
        <div class="px-6 py-4 border-b" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
          <h2 class="text-lg font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-800'">硬件信息</h2>
        </div>
        <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">CPU:</span>
            <p class="text-sm mt-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">{{ endpoint.hardware.cpu }}</p>
          </div>
          <div>
            <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">内存:</span>
            <p class="text-sm mt-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">{{ endpoint.hardware.memory }}</p>
          </div>
          <div>
            <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">磁盘:</span>
            <p class="text-sm mt-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">{{ endpoint.hardware.disk }}</p>
          </div>
          <div>
            <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">显卡:</span>
            <p class="text-sm mt-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">{{ endpoint.hardware.gpu }}</p>
          </div>
        </div>
      </div>

      <!-- 安全状态 -->
      <div class="rounded-xl shadow-sm overflow-hidden"
           :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
        <div class="px-6 py-4 border-b" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
          <h2 class="text-lg font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-800'">安全状态</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div class="rounded-lg p-4" :class="[
              endpoint.securityStatus.overallStatus === 'safe' ?
                (isDarkMode ? 'bg-green-900/30 border border-green-800' : 'bg-green-50 border border-green-200') :
                (endpoint.securityStatus.overallStatus === 'warning' ?
                  (isDarkMode ? 'bg-yellow-900/30 border border-yellow-800' : 'bg-yellow-50 border border-yellow-200') :
                  (isDarkMode ? 'bg-red-900/30 border border-red-800' : 'bg-red-50 border border-red-200'))
            ]">
              <div class="flex items-center">
                <Icon
                    :icon="endpoint.securityStatus.overallStatus === 'safe' ? 'mdi:shield-check' : (endpoint.securityStatus.overallStatus === 'warning' ? 'mdi:shield-alert' : 'mdi:shield-off')"
                    class="h-8 w-8 mr-3"
                    :class="[
                    endpoint.securityStatus.overallStatus === 'safe' ?
                      (isDarkMode ? 'text-green-500' : 'text-green-600') :
                      (endpoint.securityStatus.overallStatus === 'warning' ?
                        (isDarkMode ? 'text-yellow-500' : 'text-yellow-600') :
                        (isDarkMode ? 'text-red-500' : 'text-red-600'))
                  ]"
                />
                <div>
                  <h3 class="text-sm font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">总体安全状态</h3>
                  <p class="text-lg font-bold" :class="[
                    endpoint.securityStatus.overallStatus === 'safe' ?
                      (isDarkMode ? 'text-green-400' : 'text-green-700') :
                      (endpoint.securityStatus.overallStatus === 'warning' ?
                        (isDarkMode ? 'text-yellow-400' : 'text-yellow-700') :
                        (isDarkMode ? 'text-red-400' : 'text-red-700'))
                  ]">
                    {{
                      endpoint.securityStatus.overallStatus === 'safe' ? '安全' :
                          (endpoint.securityStatus.overallStatus === 'warning' ? '警告' : '危险')
                    }}
                  </p>
                </div>
              </div>
            </div>

            <div class="rounded-lg p-4" :class="isDarkMode ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-50 border border-gray-200'">
              <div class="flex items-center">
                <Icon icon="mdi:virus" class="h-8 w-8 mr-3" :class="isDarkMode ? 'text-blue-400' : 'text-blue-600'" />
                <div>
                  <h3 class="text-sm font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">最近扫描</h3>
                  <p class="text-lg font-bold" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                    {{ formatDate(endpoint.securityStatus.lastScan) }}
                  </p>
                </div>
              </div>
            </div>

            <div class="rounded-lg p-4" :class="isDarkMode ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-50 border border-gray-200'">
              <div class="flex items-center">
                <Icon icon="mdi:update" class="h-8 w-8 mr-3" :class="isDarkMode ? 'text-blue-400' : 'text-blue-600'" />
                <div>
                  <h3 class="text-sm font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">引擎更新</h3>
                  <p class="text-lg font-bold" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                    {{ formatDate(endpoint.securityStatus.lastUpdate) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-sm font-medium mb-3" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">安全组件状态</h3>
              <div class="space-y-3">
                <div v-for="(component, index) in endpoint.securityStatus.components" :key="index"
                     class="flex justify-between items-center p-2 rounded"
                     :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-100'">
                  <span class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-800'">{{ component.name }}</span>
                  <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="[
                          component.status === 'enabled' ?
                            (isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800') :
                            (component.status === 'disabled' ?
                              (isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800') :
                              (isDarkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'))
                        ]">
                    {{
                      component.status === 'enabled' ? '已启用' :
                          (component.status === 'disabled' ? '已禁用' : '需要注意')
                    }}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium mb-3" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">安全漏洞</h3>
              <div v-if="endpoint.securityStatus.vulnerabilities.length > 0" class="space-y-3">
                <div v-for="(vuln, index) in endpoint.securityStatus.vulnerabilities" :key="index"
                     class="flex justify-between items-center p-2 rounded"
                     :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-100'">
                  <div class="flex items-center">
                    <span class="inline-block h-2 w-2 rounded-full mr-2"
                          :class="[
                            vuln.severity === 'high' ?
                              'bg-red-500' :
                              (vuln.severity === 'medium' ?
                                'bg-yellow-500' :
                                'bg-blue-500')
                          ]">
                    </span>
                    <span class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-800'">{{ vuln.name }}</span>
                  </div>
                  <button class="text-xs px-3 py-1 rounded"
                          :class="isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-500'">
                    修复
                  </button>
                </div>
              </div>
              <div v-else class="text-center p-4 rounded" :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-100'">
                <span class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">未发现漏洞</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 事件历史 -->
      <div class="rounded-xl shadow-sm overflow-hidden"
           :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
        <div class="px-6 py-4 border-b" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
          <h2 class="text-lg font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-800'">事件历史</h2>
        </div>
        <div class="p-6">
          <div v-if="endpoint.events && endpoint.events.length > 0" class="divide-y" :class="isDarkMode ? 'divide-gray-700' : 'divide-gray-200'">
            <div v-for="(event, index) in endpoint.events" :key="index" class="py-4 flex items-start">
              <div :class="[
                'flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center',
                event.type === 'alert' ?
                  (isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600') :
                  (event.type === 'warning' ?
                    (isDarkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-600') :
                    (isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'))
              ]">
                <Icon
                    :icon="event.type === 'alert' ? 'mdi:alert-circle' : (event.type === 'warning' ? 'mdi:alert' : 'mdi:information')"
                    class="h-5 w-5"
                />
              </div>
              <div class="ml-4 flex-1">
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-800'">{{ event.title }}</h3>
                  <span class="text-xs" :class="isDarkMode ? 'text-gray-500' : 'text-gray-500'">{{ formatDate(event.timestamp) }}</span>
                </div>
                <p class="mt-1 text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">{{ event.description }}</p>
              </div>
            </div>
          </div>
          <div v-else class="text-center p-8">
            <Icon icon="mdi:history" class="h-12 w-12 mx-auto mb-3" :class="isDarkMode ? 'text-gray-600' : 'text-gray-400'" />
            <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">暂无事件记录</p>
          </div>
        </div>
      </div>

      <!-- 操作按钮组 -->
      <div class="flex flex-wrap gap-4 justify-end mt-6">
        <button
            @click="remoteControl"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-600 text-white hover:bg-indigo-500'"
        >
          <Icon icon="mdi:remote-desktop" class="mr-2 h-5 w-5" />
          远程控制
        </button>
        <button
            @click="updateAgent"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-600 text-white hover:bg-green-500'"
        >
          <Icon icon="mdi:update" class="mr-2 h-5 w-5" />
          更新代理
        </button>
        <button
            @click="restartAgent"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-orange-600 text-white hover:bg-orange-500'"
        >
          <Icon icon="mdi:restart" class="mr-2 h-5 w-5" />
          重启代理
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, onBeforeUnmount } from 'vue';
import { Icon } from '@iconify/vue';
import { useRouter, useRoute } from 'vue-router';

// 获取路由信息
const router = useRouter();
const route = useRoute();

// 获取全局暗黑模式状态
const isDarkMode = inject('isDarkMode', ref(false));

// 加载状态
const loading = ref(true);

// 终端ID和数据
const endpointId = ref(route.params.id);
const endpoint = ref(null);

// 状态样式
const statusClass = (status) => {
  if (isDarkMode.value) {
    const darkStatusMap = {
      'online': 'bg-green-900 text-green-300',
      'offline': 'bg-gray-700 text-gray-300',
      'warning': 'bg-yellow-900 text-yellow-300',
      'critical': 'bg-red-900 text-red-300',
    };
    return darkStatusMap[status] || 'bg-gray-700 text-gray-300';
  } else {
    const lightStatusMap = {
      'online': 'bg-green-100 text-green-800',
      'offline': 'bg-gray-100 text-gray-800',
      'warning': 'bg-yellow-100 text-yellow-800',
      'critical': 'bg-red-100 text-red-800',
    };
    return lightStatusMap[status] || 'bg-gray-100 text-gray-800';
  }
};

// 状态文本
const statusText = (status) => {
  const statusMap = {
    'online': '在线',
    'offline': '离线',
    'warning': '警告',
    'critical': '危险',
  };
  return statusMap[status] || status;
};

// 获取操作系统图标
const getOsIcon = (os) => {
  if (os.includes('Windows')) return 'mdi:microsoft-windows';
  if (os.includes('Linux')) return 'mdi:linux';
  if (os.includes('macOS')) return 'mdi:apple';
  return 'mdi:laptop';
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

  // 简化显示，今天的只显示时间，非今天的显示日期
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

// 返回上一页
const goBack = () => {
  router.push('/edr/endpoints');
};

// 扫描终端
const scanEndpoint = () => {
  // 实际应用中这里会调用API扫描终端
  alert(`开始扫描终端: ${endpoint.value.name}`);
};

// 隔离终端
const isolateEndpoint = () => {
  // 实际应用中这里会调用API隔离终端
  alert(`隔离终端: ${endpoint.value.name}`);
};

// 刷新终端
const refreshEndpoint = async () => {
  loading.value = true;
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // 重新加载数据
    await loadEndpointData();
  } finally {
    loading.value = false;
  }
};

// 远程控制
const remoteControl = () => {
  // 在实际应用中，你可能会调用API启动远程控制会话
  alert(`正在连接终端: ${endpoint.value.name} 进行远程控制`);
};

// 更新代理
const updateAgent = () => {
  // 在实际应用中，你可能会调用API更新代理
  alert(`更新 ${endpoint.value.name} 的代理软件`);
};

// 重启代理
const restartAgent = () => {
  // 在实际应用中，你可能会调用API重启代理
  alert(`重启 ${endpoint.value.name} 的代理服务`);
};

// 加载终端数据
const loadEndpointData = async () => {
  try {
    // 模拟从API获取数据
    await new Promise(resolve => setTimeout(resolve, 800));

    // 模拟终端详情数据
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

    endpoint.value = {
      id: endpointId.value,
      name: 'ENDPOINT-001',
      ip: '192.168.1.101',
      mac: '00:1B:44:11:3A:B7',
      os: 'Windows',
      osVersion: '10 Pro 21H2',
      status: 'warning',
      lastOnline: now.toISOString(),
      agentVersion: '1.5.2',
      group: '研发部门',
      hardware: {
        cpu: 'Intel Core i7-10700K @ 3.80GHz',
        memory: '16GB DDR4',
        disk: 'SSD 512GB',
        gpu: 'NVIDIA GeForce RTX 3070'
      },
      securityStatus: {
        overallStatus: 'warning',
        lastScan: threeDaysAgo.toISOString(),
        lastUpdate: threeDaysAgo.toISOString(),
        components: [
          { name: '实时保护', status: 'enabled' },
          { name: '网络防护', status: 'enabled' },
          { name: '行为监控', status: 'enabled' },
          { name: '入侵防御', status: 'warning' },
          { name: '设备控制', status: 'disabled' }
        ],
        vulnerabilities: [
          { name: 'CVE-2022-1234 - Windows权限提升漏洞', severity: 'high' },
          { name: 'CVE-2022-5678 - 浏览器远程代码执行漏洞', severity: 'medium' }
        ]
      },
      events: [
        {
          timestamp: new Date(now.getTime() - 15 * 60 * 1000),
          type: 'info',
          title: '扫描完成',
          description: '完成了系统扫描，未发现威胁'
        },
        {
          timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
          type: 'info',
          title: '代理更新',
          description: '代理软件已更新至最新版本 1.5.2'
        },
        {
          timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000),
          type: 'warning',
          title: '可疑连接尝试',
          description: '检测到可疑连接尝试，已被阻止'
        },
        {
          timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
          type: 'alert',
          title: '恶意软件检测',
          description: '在 C:\\Users\\Admin\\Downloads\\suspicious.exe 中检测到恶意软件'
        }
      ]
    };
  } catch (error) {
    console.error('获取终端详情失败:', error);
    // 添加错误处理逻辑
  }
};

// 定时刷新
let refreshInterval = null;

onMounted(async () => {
  try {
    await loadEndpointData();

    // 如果终端在线，设置定时刷新
    if (endpoint.value && endpoint.value.status === 'online') {
      refreshInterval = setInterval(() => {
        // 在实际应用中，这里可能会是一个轻量级的状态刷新API调用
        console.log('自动刷新终端状态...');
      }, 30000); // 每30秒刷新一次
    }
  } finally {
    loading.value = false;
  }
});

onBeforeUnmount(() => {
  // 组件卸载前清除定时器
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
</script>
