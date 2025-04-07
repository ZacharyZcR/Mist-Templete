<template>
  <div class="min-h-screen flex items-center justify-center p-4"
       :class="isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'">
    <div class="max-w-md w-full text-center">
      <!-- 错误图标/图示 -->
      <div class="mx-auto w-24 h-24 mb-4 flex items-center justify-center rounded-full"
           :class="isDarkMode ? 'bg-red-900' : 'bg-red-100'">
        <Icon
            icon="mdi:lock-alert"
            class="h-12 w-12"
            :class="isDarkMode ? 'text-red-500' : 'text-red-600'"
        />
      </div>

      <!-- 错误代码 -->
      <h1 class="text-6xl font-bold mb-2" :class="isDarkMode ? 'text-red-500' : 'text-red-600'">403</h1>

      <!-- 错误标题 -->
      <h2 class="text-2xl font-semibold mb-3">权限不足</h2>

      <!-- 错误描述 -->
      <p class="mb-6 text-lg" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
        很抱歉，您没有权限访问此页面。
      </p>

      <!-- 可能原因 -->
      <div class="mb-8 p-4 rounded-lg" :class="isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'">
        <h3 class="font-medium mb-2">可能的原因：</h3>
        <ul class="text-left text-sm space-y-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
          <li class="flex items-start">
            <Icon icon="mdi:circle-small" class="h-5 w-5 mt-0.5 flex-shrink-0" />
            <span>您的账户没有所需的访问权限</span>
          </li>
          <li class="flex items-start">
            <Icon icon="mdi:circle-small" class="h-5 w-5 mt-0.5 flex-shrink-0" />
            <span>您需要登录或使用不同的账户</span>
          </li>
          <li class="flex items-start">
            <Icon icon="mdi:circle-small" class="h-5 w-5 mt-0.5 flex-shrink-0" />
            <span>管理员需要为您分配相应权限</span>
          </li>
        </ul>
      </div>

      <!-- 操作按钮 -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <router-link
            to="/"
            class="px-4 py-2 rounded-md font-medium transition-colors"
            :class="isDarkMode
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'"
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

      <!-- 如果是未登录用户，显示登录链接 -->
      <div v-if="!isAuthenticated" class="mt-4 text-sm">
        <span :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">已有账户？</span>
        <router-link
            to="/auth/login"
            class="font-medium text-blue-600 hover:text-blue-500 ml-1"
        >
          立即登录
        </router-link>
      </div>

      <!-- 如果需要帮助 -->
      <div class="mt-8 text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
        如需帮助，请联系
        <a href="#" class="font-medium hover:underline" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
          系统管理员
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

const router = useRouter();
const isDarkMode = computed(() => document.documentElement.classList.contains('dark'));
const isAuthenticated = computed(() => Boolean(localStorage.getItem('token')));

// 返回上一页
const goBack = () => {
  router.go(-1);
};
</script>