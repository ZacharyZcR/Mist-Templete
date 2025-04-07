<template>
  <div class="w-full max-w-md mx-auto">
    <!-- 表单标题 -->
    <h1 class="text-2xl font-bold mb-6 text-center" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
      重置密码
    </h1>

    <!-- 说明文字 -->
    <p v-if="!isSubmitted && !tokenError" class="mb-6 text-center" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
      请设置您的新密码
    </p>

    <!-- 令牌错误提示 -->
    <div v-if="tokenError" class="mb-6 p-4 rounded-md" :class="isDarkMode
      ? 'bg-red-900/20 border border-red-800'
      : 'bg-red-50 border border-red-200'">
      <div class="flex items-center">
        <Icon icon="mdi:alert-circle" class="h-5 w-5 mr-2" :class="isDarkMode ? 'text-red-400' : 'text-red-500'" />
        <span :class="isDarkMode ? 'text-red-400' : 'text-red-700'">
          密码重置链接无效或已过期。请重新申请密码重置。
        </span>
      </div>
      <div class="mt-4 flex justify-center">
        <router-link
            to="/auth/forgot-password"
            class="px-4 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          返回找回密码
        </router-link>
      </div>
    </div>

    <!-- 成功提示 -->
    <div v-if="isSubmitted" class="mb-6 p-4 rounded-md" :class="isDarkMode
      ? 'bg-green-900/20 border border-green-800'
      : 'bg-green-50 border border-green-200'">
      <div class="flex items-center">
        <Icon icon="mdi:check-circle" class="h-5 w-5 mr-2" :class="isDarkMode ? 'text-green-400' : 'text-green-500'" />
        <span :class="isDarkMode ? 'text-green-400' : 'text-green-700'">
          密码已成功重置！现在您可以使用新密码登录您的账户。
        </span>
      </div>
      <div class="mt-4 flex justify-center">
        <button
            @click="goToLogin"
            class="px-4 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          前往登录
        </button>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="errorMessage && !isSubmitted && !tokenError" class="mb-6 p-4 rounded-md" :class="isDarkMode
      ? 'bg-red-900/20 border border-red-800'
      : 'bg-red-50 border border-red-200'">
      <div class="flex items-center">
        <Icon icon="mdi:alert-circle" class="h-5 w-5 mr-2" :class="isDarkMode ? 'text-red-400' : 'text-red-500'" />
        <span :class="isDarkMode ? 'text-red-400' : 'text-red-700'">{{ errorMessage }}</span>
      </div>
    </div>

    <!-- 重置密码表单 -->
    <form v-if="!isSubmitted && !tokenError" @submit.prevent="handleSubmit" class="space-y-5">
      <!-- 新密码 -->
      <div>
        <label for="password" class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
          新密码
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon icon="mdi:lock" class="h-5 w-5" :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'" />
          </div>
          <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full pl-10 pr-10 px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none"
              :class="isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
              : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500'"
              placeholder="设置新密码（至少8个字符）"
              :disabled="isSubmitting"
          />
          <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <Icon
                :icon="showPassword ? 'mdi:eye-off' : 'mdi:eye'"
                class="h-5 w-5"
                :class="isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'"
            />
          </button>
        </div>
        <p v-if="passwordError" class="mt-1 text-sm" :class="isDarkMode ? 'text-red-400' : 'text-red-600'">{{ passwordError }}</p>
      </div>

      <!-- 密码强度指示器 -->
      <div v-if="password">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">密码强度:</span>
          <span class="text-xs font-medium" :class="passwordStrengthTextColor">{{ passwordStrengthText }}</span>
        </div>
        <div class="w-full h-1.5 rounded-full overflow-hidden" :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-200'">
          <div
              class="h-full rounded-full transition-all duration-300"
              :class="passwordStrengthBarColor"
              :style="{ width: `${passwordStrength * 25}%` }"
          ></div>
        </div>
        <ul class="mt-2 text-xs space-y-1" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
          <li class="flex items-center">
            <Icon
                :icon="password.length >= 8 ? 'mdi:check-circle' : 'mdi:circle-outline'"
                class="h-3.5 w-3.5 mr-1.5"
                :class="password.length >= 8 ? 'text-green-500' : ''"
            />
            至少8个字符
          </li>
          <li class="flex items-center">
            <Icon
                :icon="/[A-Z]/.test(password) ? 'mdi:check-circle' : 'mdi:circle-outline'"
                class="h-3.5 w-3.5 mr-1.5"
                :class="/[A-Z]/.test(password) ? 'text-green-500' : ''"
            />
            至少1个大写字母
          </li>
          <li class="flex items-center">
            <Icon
                :icon="/[0-9]/.test(password) ? 'mdi:check-circle' : 'mdi:circle-outline'"
                class="h-3.5 w-3.5 mr-1.5"
                :class="/[0-9]/.test(password) ? 'text-green-500' : ''"
            />
            至少1个数字
          </li>
          <li class="flex items-center">
            <Icon
                :icon="/[^A-Za-z0-9]/.test(password) ? 'mdi:check-circle' : 'mdi:circle-outline'"
                class="h-3.5 w-3.5 mr-1.5"
                :class="/[^A-Za-z0-9]/.test(password) ? 'text-green-500' : ''"
            />
            至少1个特殊字符
          </li>
        </ul>
      </div>

      <!-- 确认密码 -->
      <div>
        <label for="confirmPassword" class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
          确认新密码
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon icon="mdi:lock-check" class="h-5 w-5" :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'" />
          </div>
          <input
              id="confirmPassword"
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              class="w-full pl-10 pr-10 px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none"
              :class="isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
              : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500'"
              placeholder="再次输入新密码"
              :disabled="isSubmitting"
          />
          <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <Icon
                :icon="showConfirmPassword ? 'mdi:eye-off' : 'mdi:eye'"
                class="h-5 w-5"
                :class="isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'"
            />
          </button>
        </div>
        <p v-if="confirmPasswordError" class="mt-1 text-sm" :class="isDarkMode ? 'text-red-400' : 'text-red-600'">{{ confirmPasswordError }}</p>
      </div>

      <!-- 提交按钮 -->
      <div>
        <button
            type="submit"
            class="w-full py-2 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isSubmitting || passwordStrength < 2"
        >
          <div class="flex items-center justify-center">
            <Icon v-if="isSubmitting" icon="mdi:loading" class="animate-spin h-5 w-5 mr-2" />
            {{ isSubmitting ? "提交中..." : "重置密码" }}
          </div>
        </button>
      </div>
    </form>

    <!-- 安全提示 -->
    <div v-if="!isSubmitted && !tokenError" class="mt-8 p-4 rounded-lg" :class="isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-600'">
      <p class="text-sm">
        <Icon icon="mdi:shield-lock" class="h-4 w-4 inline-block" />
        <span class="ml-1">安全提示：请勿在不同网站使用相同的密码，并定期更换密码以提高账户安全性。</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

const route = useRoute();
const router = useRouter();

// 获取令牌参数
const token = computed(() => route.params.token);

// 从父组件获取暗黑模式状态
const isDarkMode = inject('isDarkMode', ref(false));

// 表单数据
const password = ref('');
const confirmPassword = ref('');

// 错误信息
const passwordError = ref('');
const confirmPasswordError = ref('');
const errorMessage = ref('');
const tokenError = ref(false);

// 状态
const isSubmitting = ref(false);
const isSubmitted = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// 密码强度计算
const passwordStrength = computed(() => {
  let strength = 0;

  if (!password.value) return 0;

  // 长度至少8个字符
  if (password.value.length >= 8) strength++;

  // 包含大写字母
  if (/[A-Z]/.test(password.value)) strength++;

  // 包含数字
  if (/[0-9]/.test(password.value)) strength++;

  // 包含特殊字符
  if (/[^A-Za-z0-9]/.test(password.value)) strength++;

  return strength;
});

// 密码强度文本
const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value;
  if (strength === 0) return '非常弱';
  if (strength === 1) return '弱';
  if (strength === 2) return '中等';
  if (strength === 3) return '强';
  return '非常强';
});

// 密码强度条颜色
const passwordStrengthBarColor = computed(() => {
  const strength = passwordStrength.value;
  if (strength === 0) return isDarkMode.value ? 'bg-gray-600' : 'bg-gray-300';
  if (strength === 1) return 'bg-red-500';
  if (strength === 2) return 'bg-yellow-500';
  if (strength === 3) return 'bg-green-500';
  return 'bg-green-600';
});

// 密码强度文本颜色
const passwordStrengthTextColor = computed(() => {
  const strength = passwordStrength.value;
  if (strength === 0) return isDarkMode.value ? 'text-gray-500' : 'text-gray-600';
  if (strength === 1) return 'text-red-500';
  if (strength === 2) return 'text-yellow-500';
  if (strength === 3) return 'text-green-500';
  return 'text-green-600';
});

// 监听密码变化，清除相关错误
watch(password, () => {
  passwordError.value = '';
  if (confirmPassword.value) {
    if (password.value !== confirmPassword.value) {
      confirmPasswordError.value = '两次输入的密码不一致';
    } else {
      confirmPasswordError.value = '';
    }
  }
});

// 监听确认密码变化，检查是否匹配
watch(confirmPassword, () => {
  if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = '两次输入的密码不一致';
  } else {
    confirmPasswordError.value = '';
  }
});

// 组件加载时验证令牌
onMounted(() => {
  // 验证令牌是否存在
  if (!token.value) {
    tokenError.value = true;
    return;
  }

  // 在实际应用中，这里应该调用API验证令牌是否有效
  // 为了演示，我们假设令牌是有效的
  console.log('重置密码令牌:', token.value);

  // 模拟令牌验证失败的情况 (测试用，实际应用中删除)
  if (token.value === 'invalid') {
    tokenError.value = true;
  }
});

// 表单验证
const validateForm = () => {
  passwordError.value = '';
  confirmPasswordError.value = '';
  let isValid = true;

  // 密码验证
  if (!password.value) {
    passwordError.value = '请输入新密码';
    isValid = false;
  } else if (password.value.length < 8) {
    passwordError.value = '密码长度至少为8个字符';
    isValid = false;
  } else if (passwordStrength.value < 2) {
    passwordError.value = '密码强度不足，请设置更强的密码';
    isValid = false;
  }

  // 确认密码验证
  if (!confirmPassword.value) {
    confirmPasswordError.value = '请确认您的密码';
    isValid = false;
  } else if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = '两次输入的密码不一致';
    isValid = false;
  }

  return isValid;
};

// 提交表单
const handleSubmit = async () => {
  if (!validateForm()) return;

  // 清除之前的错误信息
  errorMessage.value = '';
  isSubmitting.value = true;

  try {
    // 在实际应用中，这里应该调用API提交新密码
    // 为了演示，我们模拟一个请求
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 模拟成功响应
    console.log('重置密码成功:', {
      token: token.value,
      newPassword: '***' // 不要实际记录密码
    });
    isSubmitted.value = true;
  } catch (error) {
    // 处理错误情况
    errorMessage.value = '重置密码时出错，请稍后重试';
    console.error('重置密码错误:', error);
  } finally {
    isSubmitting.value = false;
  }
};

// 前往登录页
const goToLogin = () => {
  router.push('/auth/login');
};
</script>