<template>
  <div class="min-h-screen flex flex-col md:flex-row" :class="isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'">
    <!-- 左侧品牌区域（中等尺寸以上设备） -->
    <div class="hidden md:flex md:w-1/2 lg:w-2/3 flex-col justify-between bg-gradient-to-br p-8"
         :class="isDarkMode ? 'from-gray-800 to-gray-900' : 'from-blue-600 to-blue-700'">
      <div>
        <!-- 品牌标识 -->
        <div class="flex items-center">
          <img src="../assets/Mist.png" class="h-10 w-auto" alt="米斯特模板" />
          <span class="ml-3 text-2xl font-bold text-white">米斯特模板</span>
        </div>

        <!-- 欢迎信息 -->
        <div class="mt-16 lg:mt-24">
          <h1 class="text-4xl lg:text-6xl font-bold text-white leading-tight">
            欢迎使用<br/>我们的应用
          </h1>
          <p class="mt-6 text-xl text-white opacity-80 max-w-xl">
            这是一个完整的米斯特应用模板，集成了Vue Router、Tailwind CSS和最佳实践。
          </p>
        </div>
      </div>

      <!-- 底部装饰 -->
      <div class="hidden lg:block">
        <svg class="w-full text-white opacity-10" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M0,128L48,117.3C96,107,192,85,288,96C384,107,480,149,576,149.3C672,149,768,107,864,80C960,53,1056,43,1152,48C1248,53,1344,75,1392,85.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </div>

    <!-- 右侧内容区域 -->
    <div class="w-full md:w-1/2 lg:w-1/3 flex flex-col"
         :class="isDarkMode ? 'bg-gray-900' : 'bg-white'">
      <!-- 顶部导航 -->
      <div class="flex justify-between items-center p-6">
        <!-- 移动设备上的品牌标识 -->
        <div class="flex items-center md:hidden">
          <img src="./assets/Mist.png" class="h-8 w-auto" alt="米斯特" />
          <span class="ml-2 text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">米斯特</span>
        </div>

        <!-- 主题切换按钮 -->
        <button
            @click="toggleDarkMode"
            class="p-2 rounded-full ml-auto transition-colors"
            :class="isDarkMode ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
        >
          <Icon :icon="isDarkMode ? 'mdi:white-balance-sunny' : 'mdi:moon-waning-crescent'" class="h-5 w-5" />
        </button>
      </div>

      <!-- 主要内容区域 -->
      <div class="flex-grow flex flex-col px-6 md:px-10 lg:px-16 py-8">
        <!-- 页面标题 -->
        <h2 class="text-2xl font-bold mb-8" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
          {{ pageTitle }}
        </h2>

        <!-- 内容区域 - 这里放置表单内容 -->
        <div class="w-full" :class="isDarkMode ? 'text-gray-200' : 'text-gray-800'">
          <!-- 测试硬编码内容 (仅当没有子内容时显示) -->
          <div v-if="!hasChildRoute" class="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg mb-4">
            <p class="text-red-700 dark:text-red-400 font-medium">子路由内容未加载</p>
            <p class="text-sm mt-2">当前路由: {{ route.fullPath }}</p>
            <p class="text-sm mt-1">路由名称: {{ route.name }}</p>

            <!-- 测试链接 -->
            <div class="mt-4 flex flex-col space-y-2">
              <router-link
                  to="/auth/login"
                  class="text-blue-600 hover:underline"
                  replace
              >
                尝试登录页面
              </router-link>
              <router-link
                  to="/auth/register"
                  class="text-blue-600 hover:underline"
                  replace
              >
                尝试注册页面
              </router-link>
            </div>
          </div>

          <!-- 实际的子组件内容将在这里渲染 -->
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>

        <!-- 底部链接区域 -->
        <div class="mt-10">
          <!-- 登录页显示注册链接 -->
          <div v-if="route.name === 'Login'" class="text-sm text-center">
            <span :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">还没有账户？</span>
            <router-link to="/auth/register" class="font-medium text-blue-600 hover:text-blue-500">
              立即注册
            </router-link>
          </div>

          <!-- 注册页显示登录链接 -->
          <div v-if="route.name === 'Register'" class="text-sm text-center">
            <span :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">已有账户？</span>
            <router-link to="/auth/login" class="font-medium text-blue-600 hover:text-blue-500">
              立即登录
            </router-link>
          </div>

          <!-- 忘记密码链接 -->
          <div v-if="route.name === 'Login'" class="text-sm text-center mt-2">
            <router-link to="/auth/forgot-password" class="font-medium text-blue-600 hover:text-blue-500">
              忘记密码？
            </router-link>
          </div>

          <!-- 重置密码页显示登录链接 -->
          <div v-if="['ForgotPassword', 'ResetPassword'].includes(route.name)" class="text-sm text-center">
            <router-link to="/auth/login" class="font-medium text-blue-600 hover:text-blue-500">
              返回登录
            </router-link>
          </div>
        </div>
      </div>

      <!-- 页脚 -->
      <footer class="py-4 px-6" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
        <p class="text-center text-sm">
          米斯特模板 © {{ new Date().getFullYear() }}
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, provide } from 'vue';
import { useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';

const route = useRoute();
const isDarkMode = ref(localStorage.getItem('darkMode') === 'true');

provide('isDarkMode', isDarkMode);

// 检查是否有子路由组件
const hasChildRoute = computed(() => {
  // 路由名称存在并且不是AuthLayout本身
  return route.name && route.name !== 'AuthLayout';
});

// 页面标题计算
const pageTitle = computed(() => {
  // 根据路由名称设置不同的标题
  const titles = {
    'Login': '登录账户',
    'Register': '创建账户',
    'ForgotPassword': '找回密码',
    'ResetPassword': '重置密码'
  };

  return titles[route.name] || route.meta.title || '认证';
});

// 切换暗黑模式
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('darkMode', isDarkMode.value);

  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// 组件挂载时初始化暗黑模式
onMounted(() => {
  // 初始化暗黑模式
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
  }

  // 调试信息
  console.log('AuthLayout mounted', {
    route: route.fullPath,
    routeName: route.name,
    hasChildRoute: hasChildRoute.value
  });
});
</script>

<style scoped>
/* 淡入淡出过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
