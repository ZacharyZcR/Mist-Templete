<template>
  <div>
    <!-- 页面标题和操作栏 -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
      <div>
        <div class="flex items-center">
          <button @click="goBack" class="mr-3 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
            <Icon icon="mdi:arrow-left" class="h-6 w-6" />
          </button>
          <h1 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
            {{ chat?.title || '对话详情' }}
          </h1>
        </div>
        <div class="mt-2 flex items-center gap-2" v-if="chat">
          <span
              class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
              :class="chatStatusClass(chat.status)"
          >
            {{ chatStatusText(chat.status) }}
          </span>
          <span class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
            模型: {{ formatModelName(chat.model) }}
          </span>
        </div>
      </div>
      <div class="flex flex-wrap gap-3 mt-4 md:mt-0">
        <button
            @click="exportChat"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
            :class="isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'"
        >
          <Icon icon="mdi:download" class="mr-2 h-5 w-5" />
          导出对话
        </button>
        <button
            @click="refreshChat"
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

    <!-- 对话内容 -->
    <div v-else-if="chat" class="mb-6 space-y-4">
      <!-- 对话基本信息卡片 -->
      <div class="p-4 rounded-xl shadow-sm"
           :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <div>
              <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">创建时间:</span>
              <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                {{ formatDate(chat.createdAt, true) }}
              </p>
            </div>

            <div>
              <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">最后更新:</span>
              <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                {{ formatDate(chat.updatedAt, true) }}
              </p>
            </div>

            <div>
              <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">安全模型:</span>
              <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                {{ formatModelName(chat.model) }}
              </p>
            </div>
          </div>

          <div class="space-y-2">
            <div>
              <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">消息数:</span>
              <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                {{ chat.messages?.length || 0 }}
              </p>
            </div>

            <div>
              <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">创建者:</span>
              <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
                {{ chat.createdBy }}
              </p>
            </div>

            <div v-if="chat.tags && chat.tags.length > 0">
              <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">标签:</span>
              <div class="flex flex-wrap gap-1 mt-1">
                <span v-for="tag in chat.tags" :key="tag"
                      class="px-2 py-0.5 text-xs rounded"
                      :class="isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="chat.description" class="mt-4">
          <span class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">描述:</span>
          <p class="mt-1 text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-900'">
            {{ chat.description }}
          </p>
        </div>
      </div>

      <!-- 对话消息列表 -->
      <div class="space-y-4">
        <div v-for="(message, index) in chat.messages" :key="index"
             class="p-4 rounded-xl"
             :class="[
               message.role === 'user'
                 ? (isDarkMode ? 'bg-blue-900/30 border border-blue-800' : 'bg-blue-50 border border-blue-100')
                 : (isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200')
             ]">
          <div class="flex items-start">
            <div class="flex-shrink-0 mr-3">
              <div class="w-8 h-8 rounded-full flex items-center justify-center"
                   :class="message.role === 'user'
                     ? (isDarkMode ? 'bg-blue-700' : 'bg-blue-500')
                     : (isDarkMode ? 'bg-green-700' : 'bg-green-500')">
                <Icon
                    :icon="message.role === 'user' ? 'mdi:account' : 'mdi:robot'"
                    class="h-5 w-5 text-white"
                />
              </div>
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1">
                <span class="font-medium" :class="isDarkMode ? 'text-gray-200' : 'text-gray-800'">
                  {{ message.role === 'user' ? '用户' : '安全模型' }}
                </span>
                <span class="text-xs" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                  {{ formatDate(message.timestamp) }}
                </span>
              </div>
              <div class="prose max-w-none" :class="isDarkMode ? 'prose-invert' : ''">
                <p class="whitespace-pre-wrap" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                  {{ message.content }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 新消息输入框 -->
      <div class="p-4 rounded-xl shadow-sm mt-6"
           :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
        <div class="flex flex-col space-y-4">
          <textarea
              v-model="newMessage"
              rows="4"
              placeholder="输入消息..."
              class="w-full rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200 p-3"
              :class="isDarkMode
              ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-600 focus:border-blue-600'
              : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'"
          ></textarea>
          <div class="flex justify-end">
            <button
                @click="sendMessage"
                :disabled="!newMessage.trim() || sending"
                class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200 disabled:opacity-50"
                :class="isDarkMode
                ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-700'
                : 'bg-blue-600 text-white hover:bg-blue-500 disabled:bg-gray-400'"
            >
              <Icon :icon="sending ? 'mdi:loading' : 'mdi:send'" class="mr-2 h-5 w-5" :class="{'animate-spin': sending}" />
              {{ sending ? '发送中...' : '发送' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 对话不存在状态 -->
    <div v-else class="text-center py-20 rounded-xl shadow-sm"
         :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
      <Icon icon="mdi:alert-circle-outline" class="h-16 w-16 mx-auto" :class="isDarkMode ? 'text-gray-600' : 'text-gray-400'" />
      <h3 class="mt-4 text-lg font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
        未找到对话
      </h3>
      <p class="mt-2 text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
        该对话可能已被删除或不存在
      </p>
      <button
          @click="goToList"
          class="mt-4 inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
          :class="isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-500'"
      >
        <Icon icon="mdi:arrow-left" class="mr-2 h-5 w-5" />
        返回列表
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// 获取全局暗黑模式状态
const isDarkMode = inject('isDarkMode', ref(false));

// 对话ID
const chatId = computed(() => route.params.id);

// 加载状态
const loading = ref(true);
const sending = ref(false);

// 对话数据
const chat = ref(null);

// 新消息
const newMessage = ref('');

// 导航回列表
const goBack = () => {
  router.go(-1);
};

// 导航到列表
const goToList = () => {
  router.push('/security-chat/list');
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

// 发送消息
const sendMessage = async () => {
  if (!newMessage.value.trim() || sending.value) return;

  try {
    sending.value = true;
    const messageContent = newMessage.value;
    newMessage.value = ''; // 清空输入框

    // 添加用户消息到对话
    chat.value.messages.push({
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString()
    });

    // 模拟处理延迟
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 添加AI响应（模拟）
    chat.value.messages.push({
      role: 'assistant',
      content: generateSecurityResponse(messageContent),
      timestamp: new Date().toISOString()
    });

    // 更新对话时间和消息数
    chat.value.updatedAt = new Date().toISOString();
    chat.value.messageCount = chat.value.messages.length;
  } catch (error) {
    console.error('发送消息失败:', error);
    // 可以添加错误提示
  } finally {
    sending.value = false;
  }
};

// 生成安全相关响应
const generateSecurityResponse = (query) => {
  const securityResponses = [
    `根据您提出的"${query.substring(0, 30)}${query.length > 30 ? '...' : ''}"问题，从安全角度分析如下：\n\n该操作存在潜在的安全风险，建议采取以下防护措施：\n1. 实施多因素认证\n2. 加强访问控制策略\n3. 定期审计系统日志\n4. 部署入侵检测系统\n\n如需更详细的安全评估，请提供系统架构和资产清单。`,

    `您询问的关于"${query.substring(0, 30)}${query.length > 30 ? '...' : ''}"的问题，涉及到网络安全的多个层面。\n\n威胁分析结果：\n- 威胁等级：中等\n- 可能的攻击向量：钓鱼、中间人攻击\n- 潜在影响：数据泄露、服务中断\n\n建议对网络流量进行加密，并实施网络分段策略以减轻风险。`,

    `针对"${query.substring(0, 30)}${query.length > 30 ? '...' : ''}"的安全建议：\n\n检测到的漏洞类型：配置错误、权限过度授权\n\n修复建议：\n1. 审查并更新安全配置基线\n2. 应用最小权限原则\n3. 实施变更管理流程\n4. 部署文件完整性监控\n\n建议参考NIST网络安全框架进行全面的安全评估。`,

    `安全分析报告：\n\n关于您提到的"${query.substring(0, 30)}${query.length > 30 ? '...' : ''}"，我们的安全模型识别出以下几点：\n\n- 合规状态：需要改进\n- 安全控制有效性：中等\n- 风险缓解优先级：高\n\n建议采取的安全措施包括实施强密码策略、定期安全培训、建立安全事件响应计划，以及部署高级威胁防护解决方案。`
  ];

  // 随机选择一个响应
  return securityResponses[Math.floor(Math.random() * securityResponses.length)];
};

// 导出对话
const exportChat = () => {
  if (!chat.value) return;

  const dataStr = JSON.stringify(chat.value, null, 2);
  const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  const exportName = `security-chat-${chat.value.id}-${new Date().toISOString().split('T')[0]}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportName);
  linkElement.click();
};

// 刷新对话
const refreshChat = async () => {
  loading.value = true;
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // 重新加载数据
    await loadChat();
  } finally {
    loading.value = false;
  }
};

// 加载对话数据
const loadChat = async () => {
  try {
    // 模拟从API获取数据
    // 在实际应用中，这里应该是一个API调用
    await new Promise(resolve => setTimeout(resolve, 800));

    // 模拟对话数据
    const mockChat = {
      id: chatId.value,
      title: `安全风险评估对话 #${chatId.value.split('-')[1] || '1'}`,
      status: 'active',
      model: 'security-gpt-4',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7天前
      updatedAt: new Date().toISOString(),
      createdBy: '系统管理员',
      tags: ['安全检测', '威胁分析', '网络防护'],
      description: '这是一个使用安全 GPT-4进行的安全分析会话，涵盖了安全检测、威胁分析、网络防护等安全主题。',
      messages: [
        {
          role: 'user',
          content: '我需要对我们的网络基础设施进行安全风险评估，请提供一个基本的评估框架。',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          role: 'assistant',
          content: '网络基础设施安全风险评估框架应包含以下几个核心方面：\n\n1. **资产识别与分类**\n   - 列出所有网络设备（路由器、交换机、防火墙等）\n   - 识别关键服务器和应用系统\n   - 确定数据资产及其敏感度级别\n\n2. **威胁建模**\n   - 识别潜在攻击者和威胁来源\n   - 分析可能的攻击途径和技术\n   - 评估威胁的可能性和潜在影响\n\n3. **漏洞评估**\n   - 进行网络扫描和渗透测试\n   - 检查配置错误和默认设置\n   - 审查补丁管理和更新状态\n   - 评估访问控制机制\n\n4. **风险分析**\n   - 将威胁与漏洞相关联\n   - 评估每个风险的可能性和影响\n   - 计算风险等级（通常为高/中/低）\n\n5. **控制评估**\n   - 审查现有安全控制措施的有效性\n   - 评估网络分段和安全域划分\n   - 检查加密实施和密钥管理\n   - 审核日志和监控系统\n\n6. **合规性检查**\n   - 对照相关法规和标准评估当前状态\n   - 确定合规性差距和需求\n\n7. **报告与建议**\n   - 记录发现的问题和风险\n   - 提供风险缓解建议和优先级\n   - 制定行动计划和实施时间表\n\n您需要根据组织的具体情况调整这个框架，并确定评估的深度和范围。建议采用循环渐进的方法，定期重新评估以适应不断变化的威胁环境。',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString() // 5分钟后
        },
        {
          role: 'user',
          content: '对于中小型企业，哪些是最关键的安全风险点？',
          timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() // 6天前
        },
        {
          role: 'assistant',
          content: '中小型企业通常面临以下关键安全风险点：\n\n1. **缺乏专业安全人员**\n   - 往往没有专职的安全团队\n   - 技术人员可能缺乏专业安全知识\n   - 安全意识和培训不足\n\n2. **有限的安全预算**\n   - 安全解决方案投资不足\n   - 依赖过时或基本的安全措施\n   - 缺乏全面的安全架构\n\n3. **员工安全行为**\n   - 弱密码使用普遍\n   - 钓鱼攻击易成功\n   - 个人设备混用工作数据\n\n4. **补丁管理不及时**\n   - 软件和系统更新延迟\n   - 使用过时或不再支持的软件\n   - 缺乏自动化补丁管理流程\n\n5. **备份不完善**\n   - 缺乏定期备份策略\n   - 备份数据未经测试\n   - 没有离线备份以防勒索软件\n\n6. **网络边界保护不足**\n   - 防火墙配置简单或过时\n   - 远程访问控制薄弱\n   - 缺少入侵检测/防御系统\n\n7. **访问控制问题**\n   - 过度授权权限\n   - 离职员工访问未及时撤销\n   - 缺少多因素认证\n\n8. **数据保护措施缺乏**\n   - 敏感数据未加密\n   - 数据分类不明确\n   - 缺少数据泄露检测机制\n\n9. **缺乏安全监控**\n   - 日志收集和分析不足\n   - 异常行为检测能力有限\n   - 安全事件响应程序不完善\n\n10. **第三方风险**\n    - 供应商安全审查不严格\n    - 云服务配置不安全\n    - API和集成点保护不足\n\n11. **物理安全漏洞**\n    - 设备保护不足\n    - 办公环境访问控制宽松\n    - 敏感材料处理不当\n\n建议中小企业优先关注这些方面，采取符合自身资源状况的措施，如：\n- 使用云安全服务减轻专业人员需求\n- 实施基本但严格的密码政策和多因素认证\n- 确保关键系统定期备份并测试恢复\n- 对员工进行定期安全意识培训\n- 建立基本的安全事件响应计划',
          timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString() // 10分钟后
        },
        {
          role: 'user',
          content: '我们发现了一些可疑的网络流量，请问如何确定是否是实际的安全威胁？',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2天前
        },
        {
          role: 'assistant',
          content: '确定可疑网络流量是否为实际安全威胁需要系统性的分析方法：\n\n### 初步分析\n\n1. **基本特征检查**\n   - 源IP和目标IP地址（是否来自异常地理位置或已知恶意IP范围）\n   - 端口号（是否为常见攻击目标如22、3389或非标准高端口）\n   - 协议类型（TCP、UDP、ICMP等）\n   - 流量大小和模式（突发、持续或周期性）\n\n2. **上下文信息收集**\n   - 流量发生的时间（非工作时间的活动更可疑）\n   - 相关系统是否有预期的合法用途\n   - 是否与已知维护活动或系统变更重合\n   - 相关账户活动历史和权限级别\n\n### 深入分析\n\n3. **流量内容检查**\n   - 检查数据包内容是否包含已知攻击特征\n   - 寻找可疑命令、脚本或编码数据\n   - 对加密流量进行TLS检查（如可行）\n   - 检测数据异常传输模式（如数据外泄）\n\n4. **行为分析**\n   - 流量是否表现出扫描或探测行为\n   - 是否存在重复的失败尝试\n   - 识别横向移动迹象（内部系统间异常连接）\n   - 检测命令与控制(C2)通信模式\n\n5. **关联分析**\n   - 与同时期其他安全事件相关联\n   - 查找其他系统上的相关活动\n   - 与威胁情报源比对IP、域名或哈希\n   - 审查同一资产上的其他日志（系统、应用、认证）\n\n### 确认与响应\n\n6. **验证发现**\n   - 使用多个数据源交叉验证\n   - 在测试环境中重现可疑行为（如可行）\n   - 咨询特定应用或系统专家确认行为异常性\n\n7. **严重性评估**\n   - 评估潜在影响和损害范围\n   - 确定受影响系统的重要性\n   - 评估威胁行为者的可能动机和能力\n\n### 实用工具与方法\n\n- 使用**网络分析工具**如Wireshark深入检查流量\n- 应用**安全信息和事件管理(SIEM)**系统关联事件\n- 利用**网络流量分析(NTA)**工具识别异常流量模式\n- 使用**沙箱环境**分析可疑文件或模拟可疑流量\n- 参考**威胁情报平台**验证IoCs(入侵指标)\n\n如发现确认为真实威胁，应立即按安全事件响应程序处理，包括隔离受影响系统、阻断恶意流量、保全证据并开展进一步调查。',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString() // 15分钟后
        }
      ]
    };

    mockChat.messageCount = mockChat.messages.length;
    chat.value = mockChat;
  } catch (error) {
    console.error('获取对话详情失败:', error);
    chat.value = null;
    // 处理错误...
  }
};

// 组件挂载时加载数据
onMounted(async () => {
  try {
    await loadChat();
  } finally {
    loading.value = false;
  }
});
</script>
