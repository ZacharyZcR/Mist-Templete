<template>
  <div>
    <!-- 页面标题和操作栏 -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
      <h1 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
        安全模型管理
      </h1>
      <div class="flex flex-wrap gap-3 mt-4 md:mt-0">
        <button
            @click="refreshModels"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-500'"
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

    <!-- 模型列表 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="model in models" :key="model.id"
           class="rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
           :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">

        <!-- 模型头部 -->
        <div class="p-4 flex justify-between items-start"
             :class="model.enabled
               ? (isDarkMode ? 'border-b border-blue-800 bg-blue-900/20' : 'border-b border-blue-100 bg-blue-50')
               : (isDarkMode ? 'border-b border-gray-700 bg-gray-700/30' : 'border-b border-gray-200 bg-gray-50')">
          <div class="flex items-center">
            <Icon
                :icon="getModelIcon(model.type)"
                class="h-8 w-8 mr-3"
                :class="model.enabled
                ? (isDarkMode ? 'text-blue-400' : 'text-blue-600')
                : (isDarkMode ? 'text-gray-400' : 'text-gray-500')"
            />
            <div>
              <h3 class="text-lg font-semibold" :class="isDarkMode ? 'text-gray-200' : 'text-gray-800'">
                {{ model.name }}
              </h3>
              <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                {{ model.provider }} · {{ model.version }}
              </p>
            </div>
          </div>
          <div class="flex items-center">
            <span
                class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full mr-3"
                :class="model.enabled
                ? (isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800')
                : (isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800')"
            >
              {{ model.enabled ? '已启用' : '已禁用' }}
            </span>
            <button
                @click="toggleModelStatus(model)"
                class="p-1.5 rounded-md transition-colors duration-200"
                :class="model.enabled
                ? (isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100')
                : (isDarkMode ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-gray-100')"
            >
              <Icon :icon="model.enabled ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off'" class="h-6 w-6" />
            </button>
          </div>
        </div>

        <!-- 模型内容 -->
        <div class="p-4">
          <div class="mb-4">
            <p class="text-sm mb-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
              {{ model.description }}
            </p>
            <div class="flex flex-wrap gap-1 mt-2">
              <span v-for="capability in model.capabilities" :key="capability"
                    class="px-2 py-0.5 text-xs rounded"
                    :class="isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'">
                {{ capability }}
              </span>
            </div>
          </div>

          <!-- 模型参数 -->
          <div class="mb-4">
            <h4 class="text-sm font-medium mb-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              模型参数
            </h4>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="p-2 rounded" :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-50'">
                <span :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">温度值:</span>
                <span class="float-right font-medium" :class="isDarkMode ? 'text-gray-200' : 'text-gray-800'">
                  {{ model.parameters.temperature }}
                </span>
              </div>
              <div class="p-2 rounded" :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-50'">
                <span :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">最大长度:</span>
                <span class="float-right font-medium" :class="isDarkMode ? 'text-gray-200' : 'text-gray-800'">
                  {{ model.parameters.maxLength }}
                </span>
              </div>
              <div class="p-2 rounded" :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-50'">
                <span :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">Top P:</span>
                <span class="float-right font-medium" :class="isDarkMode ? 'text-gray-200' : 'text-gray-800'">
                  {{ model.parameters.topP }}
                </span>
              </div>
              <div class="p-2 rounded" :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-50'">
                <span :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">频率惩罚:</span>
                <span class="float-right font-medium" :class="isDarkMode ? 'text-gray-200' : 'text-gray-800'">
                  {{ model.parameters.frequencyPenalty }}
                </span>
              </div>
            </div>
          </div>

          <!-- 模型状态 -->
          <div class="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <span :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">API状态:</span>
              <span
                  class="ml-2 px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="model.status === 'online'
                  ? (isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800')
                  : (isDarkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800')"
              >
                {{ model.status === 'online' ? '在线' : '维护中' }}
              </span>
            </div>
            <div>
              <span :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">最后更新:</span>
              <span class="ml-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                {{ formatDate(model.lastUpdated) }}
              </span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex justify-end space-x-3 pt-3 border-t" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
            <button
                @click="configureModel(model)"
                class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                :class="isDarkMode
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'"
            >
              <Icon icon="mdi:tune" class="mr-1 inline-block h-4 w-4" />
              配置
            </button>
            <button
                @click="viewModelDetails(model)"
                class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                :class="isDarkMode
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-600 text-white hover:bg-blue-500'"
            >
              <Icon icon="mdi:information-outline" class="mr-1 inline-block h-4 w-4" />
              详情
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 模型配置模态框 -->
    <div v-if="showConfigModal" class="fixed inset-0 flex items-center justify-center z-50" @click.self="closeConfigModal">
      <div class="fixed inset-0 bg-black opacity-50"></div>
      <div class="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4 md:mx-auto"
           :class="isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'">
        <button @click="closeConfigModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <Icon icon="mdi:close" class="h-6 w-6" />
        </button>

        <h2 class="text-xl font-bold mb-6">模型配置</h2>

        <div v-if="selectedModel" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              模型名称
            </label>
            <input
                v-model="selectedModel.name"
                type="text"
                class="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none transition-colors duration-200"
                :class="isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              温度值
            </label>
            <input
                v-model.number="selectedModel.parameters.temperature"
                type="range"
                min="0"
                max="2"
                step="0.1"
                class="w-full"
            />
            <div class="flex justify-between text-xs" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
              <span>0 (确定性)</span>
              <span>{{ selectedModel.parameters.temperature }}</span>
              <span>2 (创造性)</span>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              最大生成长度
            </label>
            <input
                v-model.number="selectedModel.parameters.maxLength"
                type="number"
                min="100"
                max="8000"
                class="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none transition-colors duration-200"
                :class="isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              Top P (核采样)
            </label>
            <input
                v-model.number="selectedModel.parameters.topP"
                type="range"
                min="0"
                max="1"
                step="0.05"
                class="w-full"
            />
            <div class="flex justify-between text-xs" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
              <span>0</span>
              <span>{{ selectedModel.parameters.topP }}</span>
              <span>1</span>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              频率惩罚
            </label>
            <input
                v-model.number="selectedModel.parameters.frequencyPenalty"
                type="range"
                min="0"
                max="2"
                step="0.1"
                class="w-full"
            />
            <div class="flex justify-between text-xs" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
              <span>0 (重复)</span>
              <span>{{ selectedModel.parameters.frequencyPenalty }}</span>
              <span>2 (多样)</span>
            </div>
          </div>

          <div class="pt-4 flex space-x-3 border-t" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
            <button
                @click="closeConfigModal"
                class="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                :class="isDarkMode
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'"
            >
              取消
            </button>
            <button
                @click="saveModelConfig"
                class="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                :class="isDarkMode
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-600 text-white hover:bg-blue-500'"
            >
              保存配置
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 模型详情模态框 -->
    <div v-if="showDetailsModal" class="fixed inset-0 flex items-center justify-center z-50" @click.self="closeDetailsModal">
      <div class="fixed inset-0 bg-black opacity-50"></div>
      <div class="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-xl w-full mx-4 md:mx-auto"
           :class="isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'">
        <button @click="closeDetailsModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <Icon icon="mdi:close" class="h-6 w-6" />
        </button>

        <h2 class="text-xl font-bold mb-6">模型详情</h2>

        <div v-if="selectedModel" class="space-y-4">
          <div class="flex items-center">
            <Icon
                :icon="getModelIcon(selectedModel.type)"
                class="h-10 w-10 mr-4"
                :class="selectedModel.enabled
                ? (isDarkMode ? 'text-blue-400' : 'text-blue-600')
                : (isDarkMode ? 'text-gray-400' : 'text-gray-500')"
            />
            <div>
              <h3 class="text-lg font-semibold" :class="isDarkMode ? 'text-gray-200' : 'text-gray-800'">
                {{ selectedModel.name }}
              </h3>
              <p class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                {{ selectedModel.provider }} · {{ selectedModel.version }}
              </p>
            </div>
          </div>

          <div class="pt-4 border-t" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
            <p class="text-sm mb-4" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
              {{ selectedModel.description }}
            </p>

            <div class="mb-4">
              <h4 class="text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                能力列表
              </h4>
              <div class="flex flex-wrap gap-1">
                <span v-for="capability in selectedModel.capabilities" :key="capability"
                      class="px-2 py-1 text-xs rounded"
                      :class="isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'">
                  {{ capability }}
                </span>
              </div>
            </div>

            <div class="mb-4">
              <h4 class="text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                模型信息
              </h4>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">模型ID:</span>
                  <span class="ml-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                    {{ selectedModel.id }}
                  </span>
                </div>
                <div>
                  <span :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">API状态:</span>
                  <span
                      class="ml-2 px-2 py-0.5 rounded-full text-xs font-medium"
                      :class="selectedModel.status === 'online'
                      ? (isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800')
                      : (isDarkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800')"
                  >
                    {{ selectedModel.status === 'online' ? '在线' : '维护中' }}
                  </span>
                </div>
                <div>
                  <span :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">创建时间:</span>
                  <span class="ml-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                    {{ formatDate(selectedModel.createdAt, true) }}
                  </span>
                </div>
                <div>
                  <span :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">最后更新:</span>
                  <span class="ml-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                    {{ formatDate(selectedModel.lastUpdated, true) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="mb-4">
              <h4 class="text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                使用统计
              </h4>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">总调用次数:</span>
                  <span class="ml-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                    {{ selectedModel.usage.totalCalls.toLocaleString() }}
                  </span>
                </div>
                <div>
                  <span :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">平均响应时间:</span>
                  <span class="ml-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                    {{ selectedModel.usage.avgResponseTime }} ms
                  </span>
                </div>
                <div>
                  <span :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">今日调用次数:</span>
                  <span class="ml-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                    {{ selectedModel.usage.todayCalls.toLocaleString() }}
                  </span>
                </div>
                <div>
                  <span :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">成功率:</span>
                  <span class="ml-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                    {{ selectedModel.usage.successRate }}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-4 flex space-x-3 border-t" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
            <button
                @click="configureModel(selectedModel)"
                class="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                :class="isDarkMode
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'"
            >
              <Icon icon="mdi:tune" class="mr-2 inline-block h-4 w-4" />
              配置模型
            </button>
            <button
                @click="toggleModelStatus(selectedModel)"
                class="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                :class="selectedModel.enabled
                ? (isDarkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-600 text-white hover:bg-red-500')
                : (isDarkMode ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-600 text-white hover:bg-green-500')"
            >
              <Icon :icon="selectedModel.enabled ? 'mdi:power' : 'mdi:power-off'" class="mr-2 inline-block h-4 w-4" />
              {{ selectedModel.enabled ? '禁用模型' : '启用模型' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, reactive } from 'vue';
import { Icon } from '@iconify/vue';

// 获取全局暗黑模式状态
const isDarkMode = inject('isDarkMode', ref(false));

// 加载状态
const loading = ref(true);

// 模型数据
const models = ref([]);
const selectedModel = ref(null);
const showConfigModal = ref(false);
const showDetailsModal = ref(false);

// 获取模型图标
const getModelIcon = (modelType) => {
  const iconMap = {
    'gpt': 'mdi:brain',
    'llama': 'mdi:shield-check',
    'defender': 'mdi:shield-account',
    'bert': 'mdi:chart-bubble'
  };
  return iconMap[modelType] || 'mdi:robot';
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
      minute: '2-digit'
    });
  }

  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit'
  });
};

// 切换模型状态
const toggleModelStatus = (model) => {
  model.enabled = !model.enabled;
  model.lastUpdated = new Date().toISOString();

  // 如果有详情模态框打开，则更新模态框中的内容
  if (showDetailsModal.value && selectedModel.value && selectedModel.value.id === model.id) {
    selectedModel.value = { ...model };
  }
};

// 配置模型
const configureModel = (model) => {
  // 创建深拷贝防止直接修改原数据
  selectedModel.value = JSON.parse(JSON.stringify(model));
  showConfigModal.value = true;

  // 如果详情模态框已打开，先关闭它
  showDetailsModal.value = false;
};

// 关闭配置模态框
const closeConfigModal = () => {
  showConfigModal.value = false;
};

// 保存模型配置
const saveModelConfig = () => {
  if (!selectedModel.value) return;

  // 查找并更新模型
  const index = models.value.findIndex(m => m.id === selectedModel.value.id);
  if (index !== -1) {
    models.value[index] = {
      ...selectedModel.value,
      lastUpdated: new Date().toISOString()
    };
  }

  // 关闭模态框
  closeConfigModal();
};

// 查看模型详情
const viewModelDetails = (model) => {
  selectedModel.value = { ...model };
  showDetailsModal.value = true;

  // 如果配置模态框已打开，先关闭它
  showConfigModal.value = false;
};

// 关闭详情模态框
const closeDetailsModal = () => {
  showDetailsModal.value = false;
};

// 刷新模型列表
const refreshModels = async () => {
  loading.value = true;
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // 重新加载数据
    await loadModels();
  } finally {
    loading.value = false;
  }
};

// 加载模型数据
const loadModels = async () => {
  try {
    // 模拟从API获取数据
    await new Promise(resolve => setTimeout(resolve, 800));

    // 简化的模拟数据
    const mockModels = [
      {
        id: 'security-gpt-4',
        name: '安全 GPT-4',
        type: 'gpt',
        provider: 'OpenAI',
        version: '4.0',
        description: '基于OpenAI GPT-4的高级安全模型，专注于安全威胁检测和分析，包含网络安全、系统安全和应用安全知识。',
        capabilities: ['威胁识别', '漏洞分析', '安全配置检查', '安全最佳实践'],
        status: 'online',
        enabled: true,
        parameters: {
          temperature: 0.7,
          maxLength: 4000,
          topP: 0.95,
          frequencyPenalty: 0.5
        },
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        usage: {
          totalCalls: 24583,
          todayCalls: 352,
          avgResponseTime: 320,
          successRate: 99.7
        }
      },
      {
        id: 'security-gpt-35',
        name: '安全 GPT-3.5',
        type: 'gpt',
        provider: 'OpenAI',
        version: '3.5',
        description: '经济高效的安全分析模型，基于GPT-3.5，适用于一般安全评估和风险识别场景。',
        capabilities: ['基本威胁检测', '安全合规检查', '基本安全建议'],
        status: 'online',
        enabled: true,
        parameters: {
          temperature: 0.8,
          maxLength: 2000,
          topP: 0.9,
          frequencyPenalty: 0.3
        },
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        lastUpdated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        usage: {
          totalCalls: 87652,
          todayCalls: 845,
          avgResponseTime: 180,
          successRate: 99.8
        }
      },
      {
        id: 'security-llama',
        name: '安全 LLAMA',
        type: 'llama',
        provider: 'Meta AI',
        version: '2.0',
        description: '基于Meta的LLAMA模型的开源安全辅助工具，特别擅长代码安全审查和网络安全分析。',
        capabilities: ['代码安全检查', '网络防护分析', 'IoT安全评估'],
        status: 'online',
        enabled: true,
        parameters: {
          temperature: 0.5,
          maxLength: 3000,
          topP: 0.85,
          frequencyPenalty: 0.7
        },
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        usage: {
          totalCalls: 12845,
          todayCalls: 203,
          avgResponseTime: 250,
          successRate: 98.5
        }
      },
      {
        id: 'security-defender',
        name: '安全卫士',
        type: 'defender',
        provider: '本地模型',
        version: '1.5',
        description: '本地化部署的安全模型，不依赖外部API，适用于保密性要求高的场景，专注于防火墙配置和内网安全。',
        capabilities: ['防火墙规则分析', '内网安全评估', '网络流量分析', '访问控制审计'],
        status: 'maintenance',
        enabled: false,
        parameters: {
          temperature: 0.4,
          maxLength: 1500,
          topP: 0.8,
          frequencyPenalty: 0.6
        },
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        usage: {
          totalCalls: 8734,
          todayCalls: 0,
          avgResponseTime: 150,
          successRate: 97.8
        }
      }
    ];

    models.value = mockModels;
  } catch (error) {
    console.error('获取模型列表失败:', error);
  }
};

// 组件挂载时加载数据
onMounted(async () => {
  try {
    await loadModels();
  } finally {
    loading.value = false;
  }
});
</script>
