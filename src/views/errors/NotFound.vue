<template>
  <div class="min-h-screen flex items-center justify-center p-4"
       :class="isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'">
    <div class="max-w-md w-full text-center">
      <!-- 错误图标/图示 -->
      <div class="mx-auto w-24 h-24 mb-4 flex items-center justify-center rounded-full"
           :class="isDarkMode ? 'bg-indigo-900' : 'bg-indigo-100'">
        <Icon
            icon="mdi:map-marker-question"
            class="h-12 w-12"
            :class="isDarkMode ? 'text-indigo-500' : 'text-indigo-600'"
        />
      </div>

      <!-- 错误代码 -->
      <h1 class="text-6xl font-bold mb-2" :class="isDarkMode ? 'text-indigo-500' : 'text-indigo-600'">404</h1>

      <!-- 错误标题 -->
      <h2 class="text-2xl font-semibold mb-3">页面未找到</h2>

      <!-- 错误描述 -->
      <p class="mb-6 text-lg" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
        抱歉，您请求的页面不存在或已被移除。
      </p>

      <!-- 可能原因 -->
      <div class="mb-8 p-4 rounded-lg" :class="isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'">
        <h3 class="font-medium mb-2">可能的原因：</h3>
        <ul class="text-left text-sm space-y-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
          <li class="flex items-start">
            <Icon icon="mdi:circle-small" class="h-5 w-5 mt-0.5 flex-shrink-0" />
            <span>您输入的URL可能有误</span>
          </li>
          <li class="flex items-start">
            <Icon icon="mdi:circle-small" class="h-5 w-5 mt-0.5 flex-shrink-0" />
            <span>该页面可能已被移动或删除</span>
          </li>
          <li class="flex items-start">
            <Icon icon="mdi:circle-small" class="h-5 w-5 mt-0.5 flex-shrink-0" />
            <span>您可能点击了失效的链接</span>
          </li>
        </ul>
      </div>

      <!-- 搜索框（可选） -->
      <div class="mb-6 relative" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
        <div class="relative">
          <input
              type="text"
              v-model="searchQuery"
              placeholder="搜索内容..."
              class="w-full px-4 py-2 pr-10 rounded-lg border focus:ring-2 focus:outline-none"
              :class="isDarkMode
              ? 'bg-gray-800 border-gray-700 focus:ring-indigo-500 text-white placeholder-gray-500'
              : 'bg-white border-gray-300 focus:ring-indigo-500 text-gray-800 placeholder-gray-400'"
          />
          <button
              class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-md"
              :class="isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'"
              @click="search"
          >
            <Icon icon="mdi:magnify" class="h-5 w-5" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'" />
          </button>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <router-link
            to="/"
            class="px-4 py-2 rounded-md font-medium transition-colors"
            :class="isDarkMode
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'"
        >
          返回首页
        </router-link>

        <button
            @click="goBack"
            class="px-4 py-2 rounded-md font-medium transition-colors"
            :class="isDarkMode
            ? 'bg-gray-700 hover:bg-gray-600 text-white'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'"
        >
          返回上一页
        </button>
      </div>

      <!-- 常用链接 -->
      <div class="mt-8">
        <h3 class="text-sm font-medium mb-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
          您可能在寻找：
        </h3>
        <div class="flex flex-wrap justify-center gap-2">
          <router-link
              v-for="link in popularLinks"
              :key="link.path"
              :to="link.path"
              class="px-3 py-1 text-sm rounded-full transition-colors"
              :class="isDarkMode
              ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'"
          >
            {{ link.name }}
          </router-link>
        </div>
      </div>

      <!-- 报告问题 -->
      <div class="mt-8 text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
        发现问题？
        <a href="#" class="font-medium hover:underline" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
          报告此错误
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

const router = useRouter();
const isDarkMode = computed(() => document.documentElement.classList.contains('dark'));
const searchQuery = ref('');

// 常用链接
const popularLinks = [
  { name: '仪表盘', path: '/' },
  { name: '组件展示', path: '/components' },
  { name: '用户列表', path: '/users' },
  { name: '产品管理', path: '/business/products' },
  { name: '系统设置', path: '/settings' }
];

// 返回上一页
const goBack = () => {
  router.go(-1);
};

// 搜索功能（示例实现）
const search = () => {
  if (searchQuery.value.trim()) {
    // 这里可以实现实际的搜索逻辑，例如导航到搜索结果页
    // 示例：router.push({ path: '/search', query: { q: searchQuery.value } });

    // 目前仅清空搜索框作为示例
    alert(`搜索: ${searchQuery.value}`);
    searchQuery.value = '';
  }
};
</script>