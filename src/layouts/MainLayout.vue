<template>
  <div class="min-h-screen flex" :class="isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'">
    <!-- 侧边栏 - 在移动设备上可折叠 -->
    <aside
        class="fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out"
        :class="[
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        isDarkMode ? 'bg-gray-800 text-white border-r border-gray-700' : 'bg-white text-gray-800 border-r border-gray-200'
      ]"
    >
      <!-- 侧边栏头部 -->
      <div class="flex items-center justify-between h-16 px-4"
           :class="isDarkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'">
        <div class="flex items-center">
          <img src="../assets/Mist.png" class="h-8 w-auto transition-all hover:scale-110" alt="米斯特" />
          <span class="ml-2 text-xl font-bold">米斯特模板</span>
        </div>
        <button
            class="md:hidden rounded-md p-2 focus:outline-none"
            :class="isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'"
            @click="toggleSidebar"
        >
          <Icon icon="mdi:close" class="h-5 w-5" />
        </button>
      </div>

      <!-- 导航菜单 -->
      <div class="overflow-y-auto h-[calc(100vh-128px)]">
        <nav class="px-2 py-4 space-y-1">
          <!-- 遍历渲染单独的菜单项 -->
          <template v-for="item in sidebarItems" :key="item.id">
            <!-- 如果是普通菜单项 -->
            <router-link
                v-if="!item.isSection"
                :to="item.path"
                class="flex items-center px-4 py-2 rounded-md transition-all duration-200 hover:scale-105"
                :class="$route.path === item.path ?
                (isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-50 text-blue-600') :
                (isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')"
            >
              <Icon :icon="item.icon" class="mr-3 h-5 w-5" />
              <span>{{ item.title }}</span>
            </router-link>

            <!-- 如果是分组 -->
            <template v-else>
              <!-- 分组标题 -->
              <div class="pt-4 pb-2 px-4 text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                {{ item.title }}
              </div>

              <!-- 分组子项 -->
              <router-link
                  v-for="subItem in item.items"
                  :key="subItem.id"
                  :to="subItem.path"
                  class="flex items-center px-4 py-2 rounded-md transition-all duration-200 hover:scale-105"
                  :class="$route.path === subItem.path ?
                  (isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-50 text-blue-600') :
                  (isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')"
              >
                <Icon :icon="subItem.icon" class="mr-3 h-5 w-5" />
                <span>{{ subItem.title }}</span>
              </router-link>
            </template>
          </template>
        </nav>
      </div>

      <!-- 侧边栏底部 -->
      <div class="absolute bottom-0 w-full p-4 border-t"
           :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
        <div class="flex items-center justify-between">
          <span class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">主题</span>
          <button
              @click="toggleDarkMode"
              class="p-2 rounded-full ml-auto transition-colors"
              :class="isDarkMode ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          >
            <Icon :icon="isDarkMode ? 'mdi:white-balance-sunny' : 'mdi:moon-waning-crescent'" class="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>

    <!-- 主内容区 -->
    <div class="flex-1 md:ml-64">
      <!-- 头部导航栏 -->
      <header class="h-16 flex items-center sticky top-0 z-10 shadow-sm backdrop-blur-sm"
              :class="isDarkMode ? 'bg-gray-800/90 border-b border-gray-700' : 'bg-white/90 border-b border-gray-200'">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <!-- 移动端侧边栏切换按钮 -->
          <button
              class="md:hidden rounded-md p-2 focus:outline-none transition-transform hover:scale-110"
              :class="isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'"
              @click="toggleSidebar"
          >
            <Icon icon="mdi:menu" class="h-5 w-5" :class="isDarkMode ? 'text-white' : 'text-gray-800'" />
          </button>

          <!-- 页面标题 - 根据当前路由动态显示 -->
          <h1 class="text-lg font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-800'">{{ currentPageTitle }}</h1>

          <!-- 用户菜单/设置等 -->
          <div class="flex items-center space-x-4">
            <button class="rounded-full p-1 focus:outline-none relative transition-transform hover:scale-110"
                    :class="isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'">
              <Icon icon="mdi:bell-outline" class="h-5 w-5" :class="isDarkMode ? 'text-white' : 'text-gray-800'" />
              <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                3
              </span>
            </button>

            <div class="relative" ref="userMenuRef">
              <button
                  @click="toggleUserMenu"
                  class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white focus:outline-none transition-transform hover:scale-110 hover:bg-blue-600"
              >
                <span class="text-sm font-medium">U</span>
              </button>

              <!-- 用户下拉菜单 -->
              <div
                  v-if="isUserMenuOpen"
                  class="absolute right-0 mt-2 w-48 rounded-md shadow-lg transform origin-top-right transition-all duration-200"
                  :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'"
                  style="animation: dropdown 0.2s ease-out forwards;"
              >
                <div class="py-1">
                  <router-link
                      to="/profile"
                      class="block px-4 py-2 text-sm transition-colors duration-200"
                      :class="isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'"
                      @click="closeUserMenu"
                  >
                    个人资料
                  </router-link>
                  <router-link
                      to="/settings"
                      class="block px-4 py-2 text-sm transition-colors duration-200"
                      :class="isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'"
                      @click="closeUserMenu"
                  >
                    系统设置
                  </router-link>
                  <div class="border-t" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'"></div>

                  <a
                      href="#"
                      class="block px-4 py-2 text-sm transition-colors duration-200"
                      :class="isDarkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'"
                      @click="logout"
                  >
                    退出登录
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- 页面内容 -->
      <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div>
          <!-- 使用router-view显示路由组件 -->
          <router-view v-slot="{ Component }">
            <transition name="page" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>

      <!-- 页脚 -->
      <footer class="py-4 border-t"
              :class="isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-500'">
        <div class="container mx-auto px-4 text-center">
          <p class="text-sm">米斯特模板 © {{ new Date().getFullYear() }}</p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick, provide } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex'; // 获取 Vuex Store
import { Icon } from '@iconify/vue';
import { sidebarConfig } from '../config/sidebarConfig.js';

// 获取当前路由信息
const store = useStore(); // 创建 store 实例
const route = useRoute();

// 提供侧边栏配置项给模板使用
const sidebarItems = ref(sidebarConfig);

// 从Vuex中获取暗黑模式状态
const isDarkMode = computed(() => store.state.isDarkMode);

// 提供给子组件使用的暗黑模式状态
provide('isDarkMode', isDarkMode);

// 侧边栏是否打开（移动端）
const isSidebarOpen = ref(false);
// 用户菜单是否展开
const isUserMenuOpen = ref(false);
// 用户菜单的DOM引用，用于点击外部关闭菜单
const userMenuRef = ref(null);

// 计算属性：从路由元数据中获取当前页面标题
const currentPageTitle = computed(() => {
  return route.meta.title || '仪表盘';
});

// 监听暗黑模式变化，更新DOM和localStorage
watch(isDarkMode, async (newValue) => {
  // 使用nextTick确保DOM更新后再执行操作，减少重绘
  await nextTick();

  // 更新HTML元素的dark类
  if (newValue) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // 保存到localStorage
  localStorage.setItem('darkMode', newValue);
}, { immediate: true }); // 立即执行确保初始状态正确

// 组件挂载时的初始化
onMounted(() => {
  // 添加点击外部关闭用户菜单的事件监听
  document.addEventListener('click', handleOutsideClick);

  // 监听系统暗黑模式偏好变化
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // 只有用户没有显式设置过主题时才跟随系统
    if (localStorage.getItem('darkMode') === null) {
      isDarkMode.value = e.matches;
    }
  });
});

// 组件卸载前清理事件监听
onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick);

  // 清理系统主题偏好监听
  window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', () => {});
});

// 切换暗黑模式
const toggleDarkMode = () => {
  store.dispatch('toggleDarkMode'); // 触发 Vuex 的动作
};

// 切换侧边栏（移动设备）
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// 切换用户菜单
const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
};

// 关闭用户菜单
const closeUserMenu = () => {
  isUserMenuOpen.value = false;
};

// 处理点击菜单外部
const handleOutsideClick = (event) => {
  // 判断点击位置是否在用户菜单外部
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    isUserMenuOpen.value = false;
  }
};

// 退出登录
const logout = () => {
  // 清除token和用户信息
  localStorage.removeItem('token');
  localStorage.removeItem('permissions');

  // 重定向到登录页
  window.location.href = '/auth/login';
};
</script>

