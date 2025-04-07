<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
        {{ isEditMode ? '编辑节点' : '创建节点' }}
      </h1>
      <p class="mt-2" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
        {{ isEditMode ? '修改集控节点的配置信息' : '创建新的集控节点并添加到网络中' }}
      </p>
    </div>

    <!-- 表单卡片 -->
    <div class="rounded-lg shadow-sm overflow-hidden" :class="isDarkMode ? 'bg-gray-800' : 'bg-white'">
      <form @submit.prevent="submitForm">
        <div class="p-6 space-y-6">
          <!-- 基础信息区块 -->
          <div>
            <h2 class="text-lg font-medium mb-4" :class="isDarkMode ? 'text-gray-200' : 'text-gray-700'">基础信息</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- 节点ID -->
              <div v-if="isEditMode">
                <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">节点ID</label>
                <input
                    type="text"
                    disabled
                    v-model="form.id"
                    class="w-full px-3 py-2 rounded-lg border focus:outline-none bg-opacity-50 transition-colors duration-200"
                    :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-500'"
                />
              </div>

              <!-- 节点名称 -->
              <div>
                <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  节点名称 <span class="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    v-model="form.name"
                    class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors duration-200"
                    :class="getFieldClass('name')"
                    placeholder="输入节点名称"
                />
                <p v-if="errors.name" class="mt-1 text-sm text-red-500">{{ errors.name }}</p>
              </div>

              <!-- 节点位置 -->
              <div>
                <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  节点位置 <span class="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    v-model="form.location"
                    class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors duration-200"
                    :class="getFieldClass('location')"
                    placeholder="输入物理位置"
                />
                <p v-if="errors.location" class="mt-1 text-sm text-red-500">{{ errors.location }}</p>
              </div>

              <!-- IP地址 -->
              <div>
                <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  IP地址 <span class="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    v-model="form.ip"
                    class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors duration-200"
                    :class="getFieldClass('ip')"
                    placeholder="例如: 192.168.1.100"
                />
                <p v-if="errors.ip" class="mt-1 text-sm text-red-500">{{ errors.ip }}</p>
              </div>
            </div>
          </div>

          <!-- 连接配置区块 -->
          <div>
            <h2 class="text-lg font-medium mb-4" :class="isDarkMode ? 'text-gray-200' : 'text-gray-700'">连接配置</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- 端口 -->
              <div>
                <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  端口
                </label>
                <input
                    type="number"
                    v-model="form.port"
                    class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors duration-200"
                    :class="getFieldClass('port')"
                    placeholder="默认: 8080"
                    min="1"
                    max="65535"
                />
                <p v-if="errors.port" class="mt-1 text-sm text-red-500">{{ errors.port }}</p>
              </div>

              <!-- 连接超时 -->
              <div>
                <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  连接超时（秒）
                </label>
                <input
                    type="number"
                    v-model="form.timeout"
                    class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors duration-200"
                    :class="getFieldClass('timeout')"
                    placeholder="默认: 30"
                    min="1"
                    max="300"
                />
                <p v-if="errors.timeout" class="mt-1 text-sm text-red-500">{{ errors.timeout }}</p>
              </div>

              <!-- 认证方式 -->
              <div>
                <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  认证方式
                </label>
                <select
                    v-model="form.authType"
                    class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors duration-200"
                    :class="getFieldClass('authType')"
                >
                  <option value="none">无认证</option>
                  <option value="basic">基础认证</option>
                  <option value="token">令牌认证</option>
                  <option value="certificate">证书认证</option>
                </select>
              </div>

              <!-- 频率 -->
              <div>
                <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  心跳频率（秒）
                </label>
                <input
                    type="number"
                    v-model="form.heartbeatInterval"
                    class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors duration-200"
                    :class="getFieldClass('heartbeatInterval')"
                    placeholder="默认: 60"
                    min="5"
                    max="3600"
                />
                <p v-if="errors.heartbeatInterval" class="mt-1 text-sm text-red-500">{{ errors.heartbeatInterval }}</p>
              </div>
            </div>
          </div>

          <!-- 高级配置区块 -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-medium" :class="isDarkMode ? 'text-gray-200' : 'text-gray-700'">高级配置</h2>
              <button
                  type="button"
                  @click="showAdvanced = !showAdvanced"
                  class="text-sm flex items-center focus:outline-none transition-colors duration-200"
                  :class="isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'"
              >
                <span>{{ showAdvanced ? '收起' : '展开' }}</span>
                <Icon :icon="showAdvanced ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="ml-1 w-5 h-5" />
              </button>
            </div>

            <div v-if="showAdvanced" class="space-y-6 animate-fade-in">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- 启用SSL -->
                <div class="flex items-center">
                  <input
                      type="checkbox"
                      id="useSSL"
                      v-model="form.useSSL"
                      class="w-4 h-4 rounded focus:ring-blue-500"
                      :class="isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'"
                  />
                  <label for="useSSL" class="ml-2 text-sm font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                    启用SSL加密
                  </label>
                </div>

                <!-- 是否主节点 -->
                <div class="flex items-center">
                  <input
                      type="checkbox"
                      id="isPrimary"
                      v-model="form.isPrimary"
                      class="w-4 h-4 rounded focus:ring-blue-500"
                      :class="isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'"
                  />
                  <label for="isPrimary" class="ml-2 text-sm font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                    设为主节点
                  </label>
                </div>

                <!-- 节点组 -->
                <div>
                  <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                    节点组
                  </label>
                  <select
                      v-model="form.group"
                      class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors duration-200"
                      :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-400'"
                  >
                    <option value="default">默认组</option>
                    <option value="production">生产环境</option>
                    <option value="staging">测试环境</option>
                    <option value="development">开发环境</option>
                  </select>
                </div>

                <!-- 优先级 -->
                <div>
                  <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                    优先级
                  </label>
                  <input
                      type="number"
                      v-model="form.priority"
                      class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors duration-200"
                      :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-400'"
                      placeholder="1-100，数字越大优先级越高"
                      min="1"
                      max="100"
                  />
                </div>
              </div>

              <!-- 备注信息 -->
              <div>
                <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  备注信息
                </label>
                <textarea
                    v-model="form.description"
                    rows="3"
                    class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors duration-200"
                    :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-400'"
                    placeholder="输入关于此节点的备注信息..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- 表单操作按钮 -->
        <div class="px-6 py-4 border-t flex justify-end gap-3" :class="isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'">
          <button
              type="button"
              @click="$router.back()"
              class="px-4 py-2 rounded-lg border font-medium transition-colors duration-200"
              :class="isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'"
          >
            取消
          </button>
          <button
              type="button"
              @click="resetForm"
              class="px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              :class="isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
          >
            重置
          </button>
          <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 rounded-lg font-medium shadow-sm transition-colors duration-200 flex items-center"
              :class="isSubmitting ?
              (isDarkMode ? 'bg-blue-800 text-blue-300 cursor-wait' : 'bg-blue-400 text-white cursor-wait') :
              (isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700')"
          >
            <span v-if="isSubmitting" class="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></span>
            {{ isSubmitting ? '提交中...' : (isEditMode ? '保存修改' : '创建节点') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

// 获取全局暗黑模式状态
const isDarkMode = inject('isDarkMode', ref(false));
const router = useRouter();
const route = useRoute();

// 判断是编辑模式还是创建模式
const isEditMode = computed(() => {
  return route.params.id !== undefined;
});

// 表单数据
const form = reactive({
  id: '',
  name: '',
  location: '',
  ip: '',
  port: 8080,
  timeout: 30,
  authType: 'none',
  heartbeatInterval: 60,
  useSSL: false,
  isPrimary: false,
  group: 'default',
  priority: 50,
  description: ''
});

// 表单验证错误
const errors = reactive({});

// 表单状态
const isSubmitting = ref(false);
const showAdvanced = ref(false);

// 获取字段样式类
const getFieldClass = (field) => {
  const baseClass = isDarkMode.value ?
      'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600' :
      'bg-white border-gray-300 text-gray-700 focus:ring-blue-400';

  const errorClass = isDarkMode.value ?
      'border-red-500 focus:ring-red-600' :
      'border-red-500 focus:ring-red-400';

  return errors[field] ? errorClass : baseClass;
};

// 表单验证
const validateForm = () => {
  const newErrors = {};

  // 名称验证
  if (!form.name.trim()) {
    newErrors.name = '节点名称不能为空';
  } else if (form.name.length > 50) {
    newErrors.name = '节点名称不能超过50个字符';
  }

  // 位置验证
  if (!form.location.trim()) {
    newErrors.location = '节点位置不能为空';
  }

  // IP地址验证
  const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!form.ip.trim()) {
    newErrors.ip = 'IP地址不能为空';
  } else if (!ipPattern.test(form.ip)) {
    newErrors.ip = '请输入有效的IP地址';
  }

  // 端口验证
  if (form.port < 1 || form.port > 65535) {
    newErrors.port = '端口号必须在1-65535范围内';
  }

  // 超时验证
  if (form.timeout < 1 || form.timeout > 300) {
    newErrors.timeout = '超时时间必须在1-300秒范围内';
  }

  // 心跳频率验证
  if (form.heartbeatInterval < 5 || form.heartbeatInterval > 3600) {
    newErrors.heartbeatInterval = '心跳频率必须在5-3600秒范围内';
  }

  // 更新错误对象
  Object.keys(errors).forEach(key => {
    delete errors[key];
  });

  Object.keys(newErrors).forEach(key => {
    errors[key] = newErrors[key];
  });

  return Object.keys(newErrors).length === 0;
};

// 提交表单
const submitForm = async () => {
  // 验证表单
  if (!validateForm()) {
    // 滚动到第一个错误
    const firstError = document.querySelector('.text-red-500');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  try {
    isSubmitting.value = true;

    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (isEditMode.value) {
      // 编辑模式 - 这里应该调用更新API
      console.log('更新节点:', form);
      // 模拟API请求成功
    } else {
      // 创建模式 - 这里应该调用创建API
      console.log('创建节点:', form);
      // 模拟API请求成功
    }

    // 成功后跳转到列表页
    router.push('/control/list');
  } catch (error) {
    console.error('表单提交失败:', error);
    // 这里可以添加错误处理，如显示错误通知等
  } finally {
    isSubmitting.value = false;
  }
};

// 重置表单
const resetForm = () => {
  if (isEditMode.value) {
    // 编辑模式下重置为原始数据
    loadNodeData();
  } else {
    // 创建模式下重置为默认值
    Object.assign(form, {
      name: '',
      location: '',
      ip: '',
      port: 8080,
      timeout: 30,
      authType: 'none',
      heartbeatInterval: 60,
      useSSL: false,
      isPrimary: false,
      group: 'default',
      priority: 50,
      description: ''
    });
  }

  // 清除所有错误
  Object.keys(errors).forEach(key => {
    delete errors[key];
  });
};

// 加载节点数据 (编辑模式)
const loadNodeData = async () => {
  if (!isEditMode.value) return;

  try {
    // 这里应该调用API获取节点数据
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    // 模拟获取的节点数据
    const nodeData = {
      id: route.params.id,
      name: '测试节点-' + route.params.id,
      location: '北京数据中心',
      ip: '192.168.1.100',
      port: 8080,
      timeout: 30,
      authType: 'basic',
      heartbeatInterval: 60,
      useSSL: true,
      isPrimary: false,
      group: 'production',
      priority: 80,
      description: '这是一个测试节点的详细描述。'
    };

    // 更新表单数据
    Object.assign(form, nodeData);
  } catch (error) {
    console.error('获取节点数据失败:', error);
    // 这里可以添加错误处理，如显示错误通知等
  }
};

// 组件挂载时加载数据
onMounted(() => {
  if (isEditMode.value) {
    loadNodeData();
  }
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
