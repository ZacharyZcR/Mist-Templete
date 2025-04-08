<template>
  <div>
    <!-- 页面标题和操作栏 -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
      <div class="flex items-center">
        <button @click="goBack" class="mr-3 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
          <Icon icon="mdi:arrow-left" class="h-6 w-6" />
        </button>
        <h1 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
          新建安全对话
        </h1>
      </div>
    </div>

    <!-- 新建对话表单 -->
    <div class="rounded-xl shadow-sm transition-all duration-300 hover:shadow-md mb-6"
         :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">

      <div class="p-5">
        <!-- 对话基本信息 -->
        <div class="mb-6 space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              对话标题 *
            </label>
            <input
                v-model="chatTitle"
                type="text"
                placeholder="输入对话标题"
                class="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none transition-colors duration-200"
                :class="isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              对话描述
            </label>
            <textarea
                v-model="chatDescription"
                rows="3"
                placeholder="输入对话描述（可选）"
                class="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none transition-colors duration-200"
                :class="isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              标签
            </label>
            <div class="mb-2 flex flex-wrap gap-2">
              <div
                  v-for="tag in selectedTags"
                  :key="tag"
                  class="flex items-center px-3 py-1 rounded-full text-sm"
                  :class="isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'"
              >
                <span>{{ tag }}</span>
                <button @click="removeTag(tag)" class="ml-2">
                  <Icon icon="mdi:close" class="h-4 w-4" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'" />
                </button>
              </div>
            </div>
            <div class="flex space-x-2">
              <input
                  v-model="tagInput"
                  type="text"
                  placeholder="添加标签"
                  @keydown.enter.prevent="addTag"
                  class="flex-1 rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none transition-colors duration-200"
                  :class="isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                  : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
              />
              <button
                  @click="addTag"
                  class="px-3 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
                  :class="isDarkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-600 text-white hover:bg-blue-500'"
              >
                添加
              </button>
            </div>
            <div class="mt-2">
              <div class="text-sm mb-1" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                建议标签:
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                    v-for="tag in suggestedTags"
                    :key="tag"
                    @click="addSuggestedTag(tag)"
                    class="px-2 py-1 text-xs rounded transition-colors duration-150"
                    :class="isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                >
                  {{ tag }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 模型选择 -->
        <div class="mb-6">
          <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
            选择安全模型 *
          </label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
                v-for="model in availableModels"
                :key="model.id"
                @click="selectModel(model)"
                class="border rounded-lg p-4 cursor-pointer transition-all duration-200"
                :class="[
                selectedModel && selectedModel.id === model.id
                  ? (isDarkMode ? 'border-blue-500 bg-blue-900/20' : 'border-blue-500 bg-blue-50')
                  : (isDarkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'),
                !model.enabled ? 'opacity-50 cursor-not-allowed' : ''
              ]"
            >
              <div class="flex items-center">
                <div class="h-10 w-10 flex items-center justify-center rounded-lg mr-3"
                     :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-100'">
                  <Icon :icon="getModelIcon(model.type)" class="h-6 w-6" :class="isDarkMode ? 'text-blue-400' : 'text-blue-600'" />
                </div>
                <div>
                  <div class="font-medium" :class="isDarkMode ? 'text-gray-200' : 'text-gray-800'">
                    {{ model.name }}
                  </div>
                  <div class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                    {{ model.provider }} · {{ model.version }}
                  </div>
                </div>

                <div v-if="selectedModel && selectedModel.id === model.id" class="ml-auto">
                  <Icon icon="mdi:check-circle" class="h-6 w-6 text-blue-500" />
                </div>
              </div>

              <div class="mt-3 text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
                {{ model.description }}
              </div>

              <div class="mt-2 flex flex-wrap gap-1">
                <span v-for="capability in model.capabilities.slice(0, 3)" :key="capability"
                      class="px-2 py-0.5 text-xs rounded"
                      :class="isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'">
                  {{ capability }}
                </span>
                <span v-if="model.capabilities.length > 3"
                      class="px-2 py-0.5 text-xs rounded"
                      :class="isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'">
                  +{{ model.capabilities.length - 3 }}
                </span>
              </div>

              <div v-if="!model.enabled" class="mt-2 text-xs text-red-500">
                此模型当前不可用
              </div>
            </div>
          </div>
        </div>

        <!-- 高级设置 -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              高级设置
            </label>
            <button
                @click="showAdvanced = !showAdvanced"
                class="text-sm font-medium"
                :class="isDarkMode ? 'text-blue-400' : 'text-blue-600'"
            >
              {{ showAdvanced ? '收起' : '展开' }}
            </button>
          </div>

          <div v-if="showAdvanced" class="p-4 rounded-lg space-y-4"
               :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-50'">

            <div>
              <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                初始提示语
              </label>
              <textarea
                  v-model="initialPrompt"
                  rows="3"
                  placeholder="输入初始提示语（可选），将作为对话的首条消息"
                  class="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none transition-colors duration-200"
                  :class="isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                  : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
              ></textarea>
              <div class="mt-1 text-xs" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                提示：可以设置具体的安全问题或设定对话上下文
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                温度值 (Temperature)
              </label>
              <input
                  v-model.number="temperature"
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  class="w-full"
              />
              <div class="flex justify-between text-xs" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                <span>0 (确定性)</span>
                <span>{{ temperature }}</span>
                <span>2 (创造性)</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                最大应答长度
              </label>
              <select
                  v-model="maxLength"
                  class="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none transition-colors duration-200"
                  :class="isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
                  : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
              >
                <option value="500">短 (500字符)</option>
                <option value="1000">中 (1000字符)</option>
                <option value="2000">长 (2000字符)</option>
                <option value="4000">超长 (4000字符)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-end space-x-4">
          <button
              @click="goBack"
              class="px-6 py-2 rounded-lg font-medium transition-all duration-200"
              :class="isDarkMode
              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'"
          >
            取消
          </button>
          <button
              @click="createChat"
              :disabled="!isFormValid || creating"
              class="px-6 py-2 rounded-lg font-medium shadow-sm transition-all duration-200 disabled:opacity-50"
              :class="isDarkMode
              ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-700'
              : 'bg-blue-600 text-white hover:bg-blue-500 disabled:bg-gray-400'"
          >
            <Icon v-if="creating" icon="mdi:loading" class="mr-2 inline-block h-5 w-5 animate-spin" />
            <Icon v-else icon="mdi:chat-plus-outline" class="mr-2 inline-block h-5 w-5" />
            {{ creating ? '创建中...' : '创建对话' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 获取全局暗黑模式状态
const isDarkMode = inject('isDarkMode', ref(false));

// 表单数据
const chatTitle = ref('');
const chatDescription = ref('');
const selectedTags = ref([]);
const tagInput = ref('');
const selectedModel = ref(null);
const initialPrompt = ref('');
const temperature = ref(0.7);
const maxLength = ref('2000');
const showAdvanced = ref(false);
const creating = ref(false);

// 可用安全模型
const availableModels = ref([]);

// 建议标签
const suggestedTags = [
  '威胁分析', '漏洞扫描', '安全配置', '网络防护',
  '合规检查', '安全培训', '风险评估', '事件响应'
];

// 表单验证
const isFormValid = computed(() => {
  return chatTitle.value.trim() !== '' && selectedModel.value !== null;
});

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

// 返回上一页
const goBack = () => {
  router.go(-1);
};

// 选择模型
const selectModel = (model) => {
  if (!model.enabled) {
    return; // 禁用的模型不可选
  }
  selectedModel.value = model;
};

// 添加标签
const addTag = () => {
  const tag = tagInput.value.trim();
  if (tag && !selectedTags.value.includes(tag)) {
    selectedTags.value.push(tag);
    tagInput.value = '';
  }
};

// 添加建议标签
const addSuggestedTag = (tag) => {
  if (!selectedTags.value.includes(tag)) {
    selectedTags.value.push(tag);
  }
};

// 移除标签
const removeTag = (tag) => {
  const index = selectedTags.value.indexOf(tag);
  if (index !== -1) {
    selectedTags.value.splice(index, 1);
  }
};

// 创建对话
const createChat = async () => {
  if (!isFormValid.value || creating.value) return;

  creating.value = true;

  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 创建对话数据
    const newChat = {
      id: `chat-${Date.now()}`,
      title: chatTitle.value,
      description: chatDescription.value,
      tags: selectedTags.value,
      model: selectedModel.value.id,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: '当前用户',
      messages: []
    };

    // 如果有初始提示语，添加到消息中
    if (initialPrompt.value.trim()) {
      newChat.messages.push({
        role: 'user',
        content: initialPrompt.value,
        timestamp: new Date().toISOString()
      });
    }

    console.log('创建的对话:', newChat);

    // 跳转到对话详情页
    router.push(`/security-chat/detail/${newChat.id}`);
  } catch (error) {
    console.error('创建对话失败:', error);
    // 处理错误...
  } finally {
    creating.value = false;
  }
};

// 加载模型数据
const loadModels = async () => {
  try {
    // 模拟从API获取数据
    await new Promise(resolve => setTimeout(resolve, 800));

    // 简化的模型数据
    availableModels.value = [
      {
        id: 'security-gpt-4',
        name: '安全 GPT-4',
        type: 'gpt',
        provider: 'OpenAI',
        version: '4.0',
        description: '高级安全模型，专注于威胁检测和分析，拥有全面的安全知识。',
        capabilities: ['威胁识别', '漏洞分析', '安全配置检查', '安全最佳实践'],
        enabled: true
      },
      {
        id: 'security-gpt-35',
        name: '安全 GPT-3.5',
        type: 'gpt',
        provider: 'OpenAI',
        version: '3.5',
        description: '经济高效的安全分析模型，适用于一般安全评估和风险识别场景。',
        capabilities: ['基本威胁检测', '安全合规检查', '基本安全建议'],
        enabled: true
      },
      {
        id: 'security-llama',
        name: '安全 LLAMA',
        type: 'llama',
        provider: 'Meta AI',
        version: '2.0',
        description: '开源安全辅助工具，特别擅长代码安全审查和网络安全分析。',
        capabilities: ['代码安全检查', '网络防护分析', 'IoT安全评估'],
        enabled: true
      },
      {
        id: 'security-defender',
        name: '安全卫士',
        type: 'defender',
        provider: '本地模型',
        version: '1.5',
        description: '本地化部署的安全模型，专注于防火墙配置和内网安全。',
        capabilities: ['防火墙规则分析', '内网安全评估', '网络流量分析', '访问控制审计'],
        enabled: false
      }
    ];
  } catch (error) {
    console.error('获取模型列表失败:', error);
  }
};

// 组件挂载时加载数据
onMounted(async () => {
  await loadModels();
});
</script>
