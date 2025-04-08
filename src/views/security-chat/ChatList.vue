<template>
  <div>
    <!-- 页面标题和操作栏 -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
      <h1 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
        安全模型对话列表
      </h1>
      <div class="flex flex-wrap gap-3 mt-4 md:mt-0">
        <button
            @click="exportChats"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'"
        >
          <Icon icon="mdi:download" class="mr-2 h-5 w-5" />
          导出对话
        </button>
        <button
            @click="refreshChats"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-500'"
        >
          <Icon icon="mdi:refresh" class="mr-2 h-5 w-5" />
          刷新
        </button>
        <button
            @click="createNewChat"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-600 text-white hover:bg-green-500'"
        >
          <Icon icon="mdi:plus" class="mr-2 h-5 w-5" />
          新建对话
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
                placeholder="搜索对话..."
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
            <option value="active">进行中</option>
            <option value="completed">已完成</option>
            <option value="archived">已归档</option>
          </select>
          <select
              v-model="modelFilter"
              class="px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
              :class="isDarkMode
              ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
              : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
          >
            <option value="all">全部模型</option>
            <option value="security-gpt-4">安全GPT-4</option>
            <option value="security-gpt-3.5">安全GPT-3.5</option>
            <option value="security-llama">安全LLAMA</option>
            <option value="security-defender">安全卫士</option>
          </select>
          <select
              v-model="timeFilter"
              class="px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200"
              :class="isDarkMode
              ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
              : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
          >
            <option value="1d">最近1天</option>
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

    <!-- 对话列表 -->
    <div v-else-if="filteredChats.length > 0" class="rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md mb-6"
         :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y" :class="isDarkMode ? 'divide-gray-700' : 'divide-gray-200'">
          <thead :class="isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              对话名称
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              状态
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              安全模型
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              消息数
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              创建时间
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              最后更新
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
              操作
            </th>
          </tr>
          </thead>
          <tbody :class="isDarkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'">
          <tr v-for="chat in paginatedChats" :key="chat.id"
              class="transition-colors duration-150"
              :class="isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'">
            <td class="px-6 py-4 whitespace-nowrap" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              <div class="flex items-center">
                <Icon :icon="getModelIcon(chat.model)" class="h-5 w-5 mr-2" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" />
                <span class="font-medium">{{ chat.title }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                  class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="chatStatusClass(chat.status)"
              >
                {{ chatStatusText(chat.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              {{ formatModelName(chat.model) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              {{ chat.messageCount }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              {{ formatDate(chat.createdAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              {{ formatDate(chat.updatedAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
              <button @click="continueChat(chat)"
                      class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                <Icon icon="mdi:message-text-outline" class="h-5 w-5" title="继续对话" />
              </button>
              <button @click="viewChatDetails(chat)"
                      class="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                <Icon icon="mdi:information-outline" class="h-5 w-5" title="查看详情" />
              </button>
              <button @click="confirmDeleteChat(chat)"
                      class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                <Icon icon="mdi:delete-outline" class="h-5 w-5" title="删除对话" />
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
      <Icon icon="mdi:chat-outline" class="h-16 w-16 mx-auto" :class="isDarkMode ? 'text-gray-600' : 'text-gray-400'" />
      <h3 class="mt-4 text-lg font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
        暂无对话记录
      </h3>
      <p class="mt-2 text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
        当前没有匹配条件的安全模型对话，点击"新建对话"开始与安全模型交流
      </p>
      <button
          @click="createNewChat"
          class="mt-4 inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
          :class="isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-500'"
      >
        <Icon icon="mdi:plus" class="mr-2 h-5 w-5" />
        新建对话
      </button>
    </div>

    <!-- 对话详情模态框 -->
    <div v-if="showChatModal" class="fixed inset-0 flex items-center justify-center z-50" @click.self="closeChatModal">
      <div class="fixed inset-0 bg-black opacity-50"></div>
      <div class="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 md:mx-auto"
           :class="isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'">
        <button @click="closeChatModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <Icon icon="mdi:close" class="h-6 w-6" />
        </button>

        <h2 class="text-xl font-bold mb-6">对话详情</h2>

        <div v-if="selectedChat" class="space-y-6">
          <div class="border-b pb-4" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
            <h3 class="text-lg font-semibold" :class="isDarkMode ? 'text-gray-200' : 'text-gray-800'">
              {{ selectedChat.title }}
            </h3>
            <div class="mt-2 flex items-center gap-2">
              <span
                  class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="chatStatusClass(selectedChat.status)"
              >
                {{ chatStatusText(selectedChat.status) }}
              </span>
              <span class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                ID: {{ selectedChat.id }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">创建时间:</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ formatDate(selectedChat.createdAt, true) }}
                </p>
              </div>

              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">最后更新:</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ formatDate(selectedChat.updatedAt, true) }}
                </p>
              </div>

              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">安全模型:</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ formatModelName(selectedChat.model) }}
                </p>
              </div>
            </div>

            <div class="space-y-2">
              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">消息数:</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ selectedChat.messageCount }}
                </p>
              </div>

              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">创建者:</span>
                <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                  {{ selectedChat.createdBy }}
                </p>
              </div>

              <div>
                <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">标签:</span>
                <div class="flex flex-wrap gap-1 mt-1">
                  <span v-for="tag in selectedChat.tags" :key="tag"
                        class="px-2 py-0.5 text-xs rounded"
                        :class="isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'">
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedChat.description">
            <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">描述:</span>
            <p class="mt-1 text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
              {{ selectedChat.description }}
            </p>
          </div>

          <div class="pt-4 flex space-x-3 border-t" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
            <button
                @click="continueChat(selectedChat)"
                class="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                :class="isDarkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-600 text-white hover:bg-blue-500'"
            >
              <Icon icon="mdi:message-text-outline" class="mr-2 inline-block h-4 w-4" />
              继续对话
            </button>
            <button
                @click="confirmDeleteChat(selectedChat)"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                :class="isDarkMode
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-red-600 text-white hover:bg-red-500'"
            >
              <Icon icon="mdi:delete-outline" class="mr-2 inline-block h-4 w-4" />
              删除对话
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 删除确认模态框 -->
    <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center z-50" @click.self="closeDeleteModal">
      <div class="fixed inset-0 bg-black opacity-50"></div>
      <div class="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4 md:mx-auto"
           :class="isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'">
        <h2 class="text-xl font-bold mb-4">确认删除</h2>
        <p class="mb-6" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
          您确定要删除对话"{{ chatToDelete?.title }}"吗？此操作不可撤销。
        </p>
        <div class="flex justify-end space-x-4">
          <button
              @click="closeDeleteModal"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              :class="isDarkMode
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'"
          >
            取消
          </button>
          <button
              @click="deleteChat"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              :class="isDarkMode
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-red-600 text-white hover:bg-red-500'"
          >
            删除
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

// 加载状态
const loading = ref(true);

// 过滤条件和搜索
const searchQuery = ref('');
const statusFilter = ref('all');
const modelFilter = ref('all');
const timeFilter = ref('30d');

// 分页
const currentPage = ref(1);
const pageSize = ref(10);

// 对话列表
const chats = ref([]);
const selectedChat = ref(null);
const showChatModal = ref(false);
const chatToDelete = ref(null);
const showDeleteModal = ref(false);

// 过滤后的对话
const filteredChats = computed(() => {
  let result = chats.value.filter(chat => {
    // 状态过滤
    if (statusFilter.value !== 'all' && chat.status !== statusFilter.value) {
      return false;
    }

    // 模型过滤
    if (modelFilter.value !== 'all' && chat.model !== modelFilter.value) {
      return false;
    }

    // 时间过滤
    if (timeFilter.value !== 'all') {
      const now = new Date();
      const chatDate = new Date(chat.updatedAt);
      let timeLimit;

      switch(timeFilter.value) {
        case '1d':
          timeLimit = 1 * 24 * 60 * 60 * 1000; // 1天
          break;
        case '7d':
          timeLimit = 7 * 24 * 60 * 60 * 1000; // 7天
          break;
        case '30d':
          timeLimit = 30 * 24 * 60 * 60 * 1000; // 30天
          break;
      }

      if ((now - chatDate) > timeLimit) {
        return false;
      }
    }

    // 搜索查询
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      return chat.title.toLowerCase().includes(query) ||
          chat.description?.toLowerCase().includes(query) ||
          chat.tags.some(tag => tag.toLowerCase().includes(query));
    }

    return true;
  });

  // 按更新时间降序排序
  result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return result;
});

// 分页结果
const paginatedChats = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  return filteredChats.value.slice(startIndex, startIndex + pageSize.value);
});

// 总项目数和总页数
const totalItems = computed(() => filteredChats.value.length);
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

// 获取模型图标
const getModelIcon = (model) => {
  const iconMap = {
    'security-gpt-4': 'mdi:brain',
    'security-gpt-3.5': 'mdi:brain',
    'security-llama': 'mdi:shield-check',
    'security-defender': 'mdi:shield-account'
  };
  return iconMap[model] || 'mdi:chat';
};

// 格式化模型名称
const formatModelName = (modelId) => {
  const nameMap = {
    'security-gpt-4': '安全 GPT-4',
    'security-gpt-3.5': '安全 GPT-3.5',
    'security-llama': '安全 LLAMA',
    'security-defender': '安全卫士'
  };
  return nameMap[modelId] || modelId;
};

// 对话状态样式
const chatStatusClass = (status) => {
  if (isDarkMode.value) {
    const darkStatusMap = {
      'active': 'bg-green-900 text-green-300',
      'completed': 'bg-blue-900 text-blue-300',
      'archived': 'bg-gray-700 text-gray-300',
    };
    return darkStatusMap[status] || 'bg-gray-700 text-gray-300';
  } else {
    const lightStatusMap = {
      'active': 'bg-green-100 text-green-800',
      'completed': 'bg-blue-100 text-blue-800',
      'archived': 'bg-gray-100 text-gray-800',
    };
    return lightStatusMap[status] || 'bg-gray-100 text-gray-800';
  }
};

// 对话状态文本
const chatStatusText = (status) => {
  const statusMap = {
    'active': '进行中',
    'completed': '已完成',
    'archived': '已归档',
  };
  return statusMap[status] || status;
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
      minute: '2-digit'
    });
  } else {
    return date.toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit'
    });
  }
};

// 查看对话详情
const viewChatDetails = (chat) => {
  selectedChat.value = chat;
  showChatModal.value = true;
};

// 关闭对话详情模态框
const closeChatModal = () => {
  showChatModal.value = false;
};

// 继续对话
const continueChat = (chat) => {
  // 关闭模态框（如果打开）
  showChatModal.value = false;

  // 跳转到对话详情页面
  router.push(`/security-chat/detail/${chat.id}`);
};

// 新建对话
const createNewChat = () => {
  router.push('/security-chat/new');
};

// 确认删除对话
const confirmDeleteChat = (chat) => {
  chatToDelete.value = chat;
  showDeleteModal.value = true;
  // 如果详情模态框打开，则关闭它
  showChatModal.value = false;
};

// 关闭删除确认模态框
const closeDeleteModal = () => {
  showDeleteModal.value = false;
  chatToDelete.value = null;
};

// 删除对话
const deleteChat = async () => {
  if (!chatToDelete.value) return;

  try {
    // 在实际应用中，这里应该调用API删除对话
    console.log(`删除对话: ${chatToDelete.value.id}`);

    // 从列表中移除
    chats.value = chats.value.filter(chat => chat.id !== chatToDelete.value.id);

    // 关闭模态框
    closeDeleteModal();
  } catch (error) {
    console.error('删除对话失败:', error);
    // 处理错误...
  }
};

// 导出对话
const exportChats = () => {
  const dataStr = JSON.stringify(filteredChats.value, null, 2);
  const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  const exportName = `security-chats-${new Date().toISOString().split('T')[0]}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportName);
  linkElement.click();
};

// 刷新对话列表
const refreshChats = async () => {
  loading.value = true;
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // 重新加载数据
    await loadChats();
  } finally {
    loading.value = false;
  }
};

// 加载对话数据
const loadChats = async () => {
  try {
    // 模拟从API获取数据
    // 在实际应用中，这里应该是一个API调用
    await new Promise(resolve => setTimeout(resolve, 800));

    // 生成模拟对话数据
    const mockChats = [];
    const statuses = ['active', 'completed', 'archived'];
    const models = ['security-gpt-4', 'security-gpt-3.5', 'security-llama', 'security-defender'];
    const tags = ['安全检测', '威胁分析', '漏洞扫描', '网络防护', '合规检查', '安全培训'];
    const titles = [
      '安全风险评估对话',
      '网络流量异常分析',
      '系统漏洞分析会话',
      '恶意软件行为分析',
      '安全配置审查',
      '防火墙规则评估',
      '身份验证系统检查',
      '安全合规性评估',
      '数据泄露检测对话',
      '威胁情报分析'
    ];

    // 生成过去30天内的随机对话
    const now = new Date();
    for (let i = 0; i < 35; i++) {
      const createdDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      const updatedDate = new Date(createdDate.getTime() + Math.random() * (now - createdDate));
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const model = models[Math.floor(Math.random() * models.length)];
      const messageCount = Math.floor(Math.random() * 30) + 2; // 至少2条消息

      // 随机选择2-3个标签
      const chatTags = [];
      const tagCount = Math.floor(Math.random() * 2) + 2;
      for (let j = 0; j < tagCount; j++) {
        const randomTag = tags[Math.floor(Math.random() * tags.length)];
        if (!chatTags.includes(randomTag)) {
          chatTags.push(randomTag);
        }
      }

      const title = titles[Math.floor(Math.random() * titles.length)];

      mockChats.push({
        id: `chat-${i + 1}`,
        title: `${title} #${i + 1}`,
        status: status,
        model: model,
        messageCount: messageCount,
        createdAt: createdDate.toISOString(),
        updatedAt: updatedDate.toISOString(),
        createdBy: '系统管理员',
        tags: chatTags,
        description: `这是一个使用${formatModelName(model)}进行的安全分析会话，涵盖了${chatTags.join('、')}等安全主题。`
      });
    }

    chats.value = mockChats;
  } catch (error) {
    console.error('获取对话列表失败:', error);
    // 添加错误处理逻辑
  }
};

// 组件挂载时加载数据
onMounted(async () => {
  try {
    await loadChats();
  } finally {
    loading.value = false;
  }
});
</script>
