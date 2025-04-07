<template>
  <div>
    <!-- 页面标题和操作栏 -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
      <h1 class="text-2xl font-bold mb-4 md:mb-0" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
        集控地图
      </h1>
      <div class="flex flex-wrap gap-3">
        <button
            @click="refreshData"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200 transform hover:translate-y-[-2px]"
            :class="isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'"
        >
          <Icon icon="mdi:refresh" class="mr-2 h-5 w-5" :class="isLoading ? 'animate-spin' : ''" />
          刷新数据
        </button>
        <select
            v-model="mapType"
            class="px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2"
            :class="isDarkMode ? 'bg-gray-700 text-gray-200 focus:ring-blue-600 border-gray-600' : 'bg-white text-gray-700 focus:ring-blue-400 border-gray-300'"
        >
          <option value="world">世界地图</option>
          <option value="china">中国地图</option>
        </select>
      </div>
    </div>

    <!-- 节点统计卡片 -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
      <!-- 覆盖区域 -->
      <div class="rounded-lg shadow-sm p-6" :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
        <div class="flex items-center">
          <div class="p-3 rounded-full" :class="isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'">
            <Icon icon="mdi:earth" class="h-6 w-6" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">覆盖区域</p>
            <h3 class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
              {{ regions.length }} 个区域
            </h3>
          </div>
        </div>
      </div>

      <!-- 在线节点 -->
      <div class="rounded-lg shadow-sm p-6" :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
        <div class="flex items-center">
          <div class="p-3 rounded-full" :class="isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'">
            <Icon icon="mdi:server-network" class="h-6 w-6" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">在线节点</p>
            <h3 class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
              {{ activeNodes.length }} / {{ controls.length }}
            </h3>
          </div>
        </div>
      </div>

      <!-- 数据流量 -->
      <div class="rounded-lg shadow-sm p-6" :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
        <div class="flex items-center">
          <div class="p-3 rounded-full" :class="isDarkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'">
            <Icon icon="mdi:access-point-network" class="h-6 w-6" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">数据流量</p>
            <h3 class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
              {{ totalTraffic.toFixed(1) }} TB
            </h3>
          </div>
        </div>
      </div>

      <!-- 响应时间 -->
      <div class="rounded-lg shadow-sm p-6" :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
        <div class="flex items-center">
          <div class="p-3 rounded-full" :class="isDarkMode ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600'">
            <Icon icon="mdi:clock-outline" class="h-6 w-6" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">平均响应时间</p>
            <h3 class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
              {{ avgResponseTime }} ms
            </h3>
          </div>
        </div>
      </div>
    </div>

    <!-- 地图容器 -->
    <div class="rounded-lg shadow-sm overflow-hidden" :class="isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'">
      <div class="flex justify-between items-center px-6 py-4 border-b"
           :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
        <h2 class="text-lg font-medium" :class="isDarkMode ? 'text-gray-200' : 'text-gray-700'">
          {{ mapType === 'world' ? '全球集控节点分布' : '中国集控节点分布' }}
        </h2>
        <div class="flex items-center space-x-4">
          <div class="flex items-center">
            <span class="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            <span class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">在线</span>
          </div>
          <div class="flex items-center">
            <span class="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
            <span class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">警告</span>
          </div>
          <div class="flex items-center">
            <span class="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
            <span class="text-sm" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">离线</span>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="flex justify-center items-center" style="height: 500px;">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
             :class="isDarkMode ? 'border-blue-400' : 'border-blue-600'"></div>
      </div>

      <!-- 地图 - 修复：使用更可靠的样式 -->
      <div v-show="!isLoading" id="map-wrapper" class="relative" style="height: 500px; width: 100%;">
        <div id="leaflet-map" ref="mapContainer" class="absolute inset-0" style="height: 500px !important; width: 100% !important;"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, onBeforeUnmount, watch, nextTick, onUpdated } from 'vue';
import { Icon } from '@iconify/vue';
import 'leaflet/dist/leaflet.css';

// 修复：将Leaflet导入延迟到onMounted阶段，避免SSR问题
let L;

// 获取全局暗黑模式状态
const isDarkMode = inject('isDarkMode', ref(false));
const isLoading = ref(true);
const mapType = ref('world');
const mapContainer = ref(null);
const controls = ref([]);
const regions = ref([]);
const mapInitialized = ref(false); // 跟踪地图是否已初始化
const initRetryCount = ref(0); // 重试计数器

// 地图和标记
let map = null;
let markers = {};
let animationFrames = {};
let tileLayer = null;

// 节点状态颜色
const nodeStatusColors = {
  'online': '#10B981', // 绿色
  'warning': '#F59E0B', // 黄色
  'offline': '#EF4444', // 红色
  'maintenance': '#6D28D9' // 紫色
};

// 计算活跃节点
const activeNodes = computed(() => {
  return controls.value.filter(node => node.status === 'online');
});

// 计算总流量
const totalTraffic = computed(() => {
  return controls.value.reduce((sum, node) => sum + (node.traffic || 0), 0) / 1000; // GB to TB
});

// 计算平均响应时间
const avgResponseTime = computed(() => {
  if (controls.value.length === 0) return 0;
  const sum = controls.value.reduce((acc, node) => acc + (node.responseTime || 0), 0);
  return Math.round(sum / controls.value.length);
});

// 新增：安全地销毁地图
const safeDestroyMap = () => {
  // 清除所有动画
  Object.keys(animationFrames).forEach(key => {
    cancelAnimationFrame(animationFrames[key]);
  });
  animationFrames = {};

  // 清除现有标记
  if (markers) {
    Object.values(markers).forEach(markerGroup => {
      if (markerGroup.main && markerGroup.main.remove) markerGroup.main.remove();
      if (markerGroup.glow && markerGroup.glow.remove) markerGroup.glow.remove();
    });
    markers = {};
  }

  // 移除瓦片图层
  if (tileLayer && map) {
    map.removeLayer(tileLayer);
    tileLayer = null;
  }

  // 销毁地图
  if (map) {
    try {
      map.off();
      map.remove();
    } catch (e) {
      console.error('地图销毁时发生错误:', e);
    }
    map = null;
  }

  mapInitialized.value = false;
};

// 刷新数据
const refreshData = async () => {
  isLoading.value = true;
  // 确保先销毁地图
  safeDestroyMap();

  try {
    await loadData();
    // 使用setTimeout给DOM足够的时间更新
    setTimeout(() => {
      initMap();
      isLoading.value = false;
    }, 300);
  } catch (error) {
    console.error('刷新数据失败:', error);
    isLoading.value = false;
  }
};

// 修复：配置Leaflet默认图标
const setupLeafletIcons = () => {
  // 修复默认图标路径问题
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
  });
};

// 初始化地图
const initMap = () => {
  // 确保Leaflet已加载
  if (!L) {
    console.error('Leaflet还未加载，无法初始化地图');
    return;
  }

  // 检查地图容器是否存在
  if (!mapContainer.value) {
    console.error('地图容器未找到');
    if (initRetryCount.value < 3) {
      initRetryCount.value++;
      setTimeout(initMap, 500);
    }
    return;
  }

  // 确保先销毁已有地图
  safeDestroyMap();

  // 确保Leaflet图标正确配置
  setupLeafletIcons();

  try {
    // 创建地图 - 添加调试日志
    console.log('初始化地图，容器:', mapContainer.value);

    // 创建地图实例
    map = L.map('leaflet-map', {
      center: [30, 105], // 中国中心位置
      zoom: mapType.value === 'china' ? 4 : 2,
      zoomControl: false,
      worldCopyJump: true,
      attributionControl: true
    });

    // 添加瓦片图层
    const tileLayerUrl = isDarkMode.value
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

    tileLayer = L.tileLayer(tileLayerUrl, {
      attribution,
      maxZoom: 19,
      minZoom: 2
    }).addTo(map);

    // 添加缩放控件到右下角
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    // 如果显示中国地图，设置适当的边界
    if (mapType.value === 'china') {
      map.fitBounds([
        [18, 73], // 西南角
        [54, 135]  // 东北角
      ]);
    }

    // 地图初始化完成后触发重新渲染
    setTimeout(() => {
      if (map) {
        map.invalidateSize(true);
        updateMarkers();
        mapInitialized.value = true;
      }
    }, 200);

    console.log('地图初始化完成');
  } catch (error) {
    console.error('地图初始化失败:', error);
  }
};

// 更新标记
const updateMarkers = () => {
  if (!map) {
    console.error('地图未初始化，无法添加标记');
    return;
  }

  // 清除所有动画
  Object.keys(animationFrames).forEach(key => {
    cancelAnimationFrame(animationFrames[key]);
  });
  animationFrames = {};

  // 清除现有标记
  Object.values(markers).forEach(markerGroup => {
    if (markerGroup.main) markerGroup.main.remove();
    if (markerGroup.glow) markerGroup.glow.remove();
  });
  markers = {};

  // 添加新标记
  controls.value.forEach(node => {
    if (!node.latitude || !node.longitude) return;

    const coords = [node.latitude, node.longitude];
    const color = nodeStatusColors[node.status] || nodeStatusColors.offline;

    // 发光效果圆圈
    const glowMarker = L.circleMarker(coords, {
      radius: 12,
      color: color,
      fillColor: color,
      fillOpacity: 0.2,
      weight: 0,
      opacity: 0.5,
      pane: 'markerPane'
    }).addTo(map);

    // 核心圆点
    const circleMarker = L.circleMarker(coords, {
      radius: 5,
      color: color,
      fillColor: color,
      fillOpacity: 1,
      weight: 1,
      opacity: 1,
      pane: 'markerPane'
    }).addTo(map);

    // 添加弹出窗 - 使用改进的样式
    circleMarker.bindPopup(
        createPopupContent(node),
        {
          className: 'custom-popup',
          closeButton: true,
          autoClose: false,
          closeOnEscapeKey: true
        }
    );

    // 储存标记
    markers[node.id] = {
      main: circleMarker,
      glow: glowMarker
    };

    // 启动呼吸动画
    startBreathingEffect(node.id, glowMarker);
  });

  // 修复：确保地图在显示标记后重新调整大小
  if (map) {
    setTimeout(() => {
      map.invalidateSize(true);

      // 调整地图视图以显示所有标记
      const markerArray = Object.values(markers).map(m => m.main);
      if (markerArray.length > 0) {
        try {
          const group = L.featureGroup(markerArray);
          map.fitBounds(group.getBounds(), { padding: [50, 50] });
        } catch (error) {
          console.error('设置地图边界失败:', error);
        }
      }
    }, 300);
  }
};

// 创建弹出窗内容 - 改进样式
const createPopupContent = (node) => {
  return `
    <div class="node-popup">
      <div class="node-popup-header" style="background-color: ${nodeStatusColors[node.status]}10; border-left: 4px solid ${nodeStatusColors[node.status]};">
        <div class="node-title">${node.name}</div>
        <div class="node-status" style="background-color: ${nodeStatusColors[node.status]}20; color: ${nodeStatusColors[node.status]};">
          <span class="status-dot" style="background-color: ${nodeStatusColors[node.status]};"></span>
          ${getStatusText(node.status)}
        </div>
      </div>
      <div class="node-popup-content">
        <div class="info-grid">
          <div class="info-label">节点ID:</div>
          <div class="info-value">${node.id}</div>

          <div class="info-label">位置:</div>
          <div class="info-value">${node.location}</div>

          <div class="info-label">IP地址:</div>
          <div class="info-value">${node.ip}</div>

          <div class="info-label">流量:</div>
          <div class="info-value">${node.traffic ? node.traffic.toFixed(1) + ' GB' : '0 GB'}</div>

          <div class="info-label">响应时间:</div>
          <div class="info-value">${node.responseTime ? node.responseTime + ' ms' : '无数据'}</div>

          <div class="info-label">坐标:</div>
          <div class="info-value">${node.latitude.toFixed(4)}, ${node.longitude.toFixed(4)}</div>
        </div>
      </div>
    </div>
  `;
};

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    'online': '在线',
    'offline': '离线',
    'warning': '警告',
    'maintenance': '维护中'
  };
  return statusMap[status] || '未知';
};

// 标记呼吸效果
const startBreathingEffect = (nodeId, marker) => {
  if (!marker) return;

  let growing = true;
  let size = 12;
  const minSize = 12;
  const maxSize = 18;
  const step = 0.3;

  const animate = () => {
    if (!map || !marker || !marker._map) {
      if (animationFrames[nodeId]) {
        cancelAnimationFrame(animationFrames[nodeId]);
        delete animationFrames[nodeId];
      }
      return;
    }

    if (growing) {
      size = Math.min(size + step, maxSize);
      if (size >= maxSize) growing = false;
    } else {
      size = Math.max(size - step, minSize);
      if (size <= minSize) growing = true;
    }

    marker.setRadius(size);
    animationFrames[nodeId] = requestAnimationFrame(animate);
  };

  animationFrames[nodeId] = requestAnimationFrame(animate);
};

// 加载数据
const loadData = async () => {
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // 模拟节点数据
    controls.value = [
      { id: 'CTRL-001', name: '北京主控中心', location: '北京市海淀区', status: 'online', ip: '192.168.1.100', latitude: 39.9042, longitude: 116.4074, traffic: 756, responseTime: 68 },
      { id: 'CTRL-002', name: '上海备份中心', location: '上海市浦东新区', status: 'online', ip: '192.168.2.100', latitude: 31.2304, longitude: 121.4737, traffic: 543, responseTime: 75 },
      { id: 'CTRL-003', name: '广州节点', location: '广州市天河区', status: 'warning', ip: '192.168.3.100', latitude: 23.1291, longitude: 113.2644, traffic: 421, responseTime: 112 },
      { id: 'CTRL-004', name: '深圳节点', location: '深圳市南山区', status: 'online', ip: '192.168.4.100', latitude: 22.5431, longitude: 114.0579, traffic: 387, responseTime: 88 },
      { id: 'CTRL-005', name: '成都节点', location: '成都市高新区', status: 'offline', ip: '192.168.5.100', latitude: 30.5728, longitude: 104.0668, traffic: 0, responseTime: 0 },
      { id: 'CTRL-006', name: '武汉节点', location: '武汉市洪山区', status: 'online', ip: '192.168.6.100', latitude: 30.5928, longitude: 114.3896, traffic: 256, responseTime: 98 },
      { id: 'CTRL-007', name: '西安节点', location: '西安市雁塔区', status: 'maintenance', ip: '192.168.7.100', latitude: 34.3416, longitude: 108.9398, traffic: 89, responseTime: 145 },
      { id: 'CTRL-008', name: '纽约节点', location: '美国纽约', status: 'online', ip: '72.21.91.10', latitude: 40.7128, longitude: -74.0060, traffic: 623, responseTime: 180 },
      { id: 'CTRL-009', name: '伦敦节点', location: '英国伦敦', status: 'online', ip: '84.15.64.22', latitude: 51.5074, longitude: -0.1278, traffic: 485, responseTime: 165 },
      { id: 'CTRL-010', name: '东京节点', location: '日本东京', status: 'warning', ip: '118.23.45.67', latitude: 35.6762, longitude: 139.6503, traffic: 392, responseTime: 128 },
      { id: 'CTRL-011', name: '悉尼节点', location: '澳大利亚悉尼', status: 'online', ip: '45.78.92.34', latitude: -33.8688, longitude: 151.2093, traffic: 278, responseTime: 220 },
      { id: 'CTRL-012', name: '新加坡节点', location: '新加坡', status: 'online', ip: '182.54.89.21', latitude: 1.3521, longitude: 103.8198, traffic: 517, responseTime: 115 }
    ];

    // 提取区域信息
    regions.value = Array.from(new Set(controls.value.map(node => node.location))).map(location => ({
      name: location,
      nodes: controls.value.filter(node => node.location === location).length
    }));

  } catch (error) {
    console.error('获取集控地图数据失败:', error);
  }
};

// 监听主题变化重新初始化地图
watch(isDarkMode, () => {
  // 当已经有了地图时才处理
  if (mapInitialized.value) {
    isLoading.value = true;

    // 使用setTimeout确保DOM已更新
    setTimeout(() => {
      safeDestroyMap();
      initMap();
      isLoading.value = false;
    }, 300);
  }
});

// 监听地图类型变化重新初始化地图
watch(mapType, () => {
  // 当已经有了地图时才处理
  if (mapInitialized.value) {
    isLoading.value = true;

    // 使用setTimeout确保DOM已更新
    setTimeout(() => {
      safeDestroyMap();
      initMap();
      isLoading.value = false;
    }, 300);
  }
});

// 组件挂载时初始化
onMounted(async () => {
  isLoading.value = true;

  // 动态导入Leaflet以避免SSR问题
  try {
    L = await import('leaflet').then(module => module.default);
    console.log('Leaflet成功加载');
  } catch (error) {
    console.error('加载Leaflet失败:', error);
    isLoading.value = false;
    return;
  }

  try {
    // 加载数据
    await loadData();

    // 使用较长的延迟确保DOM已完全渲染
    setTimeout(() => {
      initMap();
      isLoading.value = false;
    }, 500);
  } catch (error) {
    console.error('初始化地图失败:', error);
    isLoading.value = false;
  }
});

// 组件更新后检查地图是否需要重新渲染
onUpdated(() => {
  if (map && mapInitialized.value) {
    setTimeout(() => {
      map.invalidateSize(true);
    }, 100);
  }
});

// 组件卸载前清理
onBeforeUnmount(() => {
  safeDestroyMap();
});
</script>

<style>
/* Leaflet必要样式 - 全局样式以确保覆盖 */
.leaflet-container {
  height: 100% !important;
  width: 100% !important;
  z-index: 1;
  background-color: #f8f9fa;
}

.dark .leaflet-container {
  background-color: #1a202c;
}

/* 自定义弹窗样式 */
.custom-popup {
  padding: 0 !important;
  margin: 0 !important;
  border-radius: 8px !important;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  min-width: 280px;
  max-width: 300px;
}

.custom-popup .leaflet-popup-content-wrapper {
  background: transparent !important;
  color: inherit !important;
  border-radius: 8px;
  padding: 0 !important;
  margin: 0 !important;
  box-shadow: none !important;
  border: none !important;
}

.custom-popup .leaflet-popup-content {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
}

.custom-popup .leaflet-popup-tip {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.dark .custom-popup .leaflet-popup-tip {
  background: rgba(31, 41, 55, 0.95);
  border-color: rgba(75, 85, 99, 0.4);
}

/* 节点弹窗样式 */
.node-popup {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.98);
}

.dark .node-popup {
  background: rgba(31, 41, 55, 0.98);
  color: #e5e7eb;
}

.node-popup-header {
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
}

.dark .node-popup-header {
  border-bottom-color: rgba(75, 85, 99, 0.5);
}

.node-title {
  font-weight: 600;
  font-size: 15px;
  color: #111827;
}

.dark .node-title {
  color: #f3f4f6;
}

.node-status {
  font-size: 12px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 4px;
  display: inline-block;
}

.node-popup-content {
  padding: 14px 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px 12px;
}

.info-label {
  color: #6b7280;
  font-size: 13px;
  font-weight: 500;
}

.dark .info-label {
  color: #9ca3af;
}

.info-value {
  color: #1f2937;
  font-size: 13px;
}

.dark .info-value {
  color: #e5e7eb;
}

/* 确保地图区域可见 */
.map-area {
  height: 100% !important;
  width: 100% !important;
  z-index: 1;
  background-color: #eee;
}

/* 地图控件样式优化 */
.leaflet-control-zoom {
  border: none !important;
  border-radius: 8px !important;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
}

.leaflet-control-zoom a {
  background-color: white !important;
  color: #374151 !important;
  border: none !important;
  transition: all 0.2s ease;
}

.dark .leaflet-control-zoom a {
  background-color: #2d3748 !important;
  color: #e5e7eb !important;
}

.leaflet-control-zoom a:hover {
  background-color: #f3f4f6 !important;
  color: #111827 !important;
}

.dark .leaflet-control-zoom a:hover {
  background-color: #374151 !important;
  color: #f9fafb !important;
}

.leaflet-control-zoom-in {
  border-bottom: 1px solid #e5e7eb !important;
}

.dark .leaflet-control-zoom-in {
  border-bottom: 1px solid #4b5563 !important;
}
</style>