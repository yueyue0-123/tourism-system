<!-- eslint-disable -->
<template>
  <div class="scenic-frontend-container">

    <!-- 搜索和筛选区域 -->
    <div class="search-filter-section">
      <div class="section-container">
        <!-- 页面标题和统计 -->
        <div class="page-header">
          <div class="header-content">
            <h1 class="page-title">
              <span class="title-icon">🏞️</span>
              Исследуйте достопримечательности
            </h1>
            <p class="page-subtitle">
              Откройте красивые пейзажи и культурное наследие
            </p>
          </div>

        </div>

        <!-- 搜索栏 -->
        <div class="search-card">
          <div class="search-header">
            <h3 class="search-title">
              <el-icon><Search /></el-icon>
              Умный поиск
            </h3>
          </div>
            <div class="search-form">
              <div class="search-inputs">
                <div class="search-input-group">
                  <el-input
                    v-model="searchForm.name"
                    placeholder="Поиск по названию, региону или описанию..."
                    clearable
                    size="large"
                    class="main-search-input"
                    @keyup.enter="handleSearch"
                  >
                    <template #prefix>
                      <el-icon><Search /></el-icon>
                    </template>
                  </el-input>
                </div>
                <div class="search-input-group">
                  <el-input
                    v-model="searchForm.location"
                    placeholder="Фильтр по региону"
                    clearable
                    size="large"
                    @keyup.enter="handleSearch"
                  >
                    <template #prefix>
                      <el-icon><Location /></el-icon>
                    </template>
                  </el-input>
                </div>
                <div class="search-actions">
                  <el-button type="primary" @click="handleSearch" class="search-btn" size="large">
                    <el-icon><Search /></el-icon>
                    搜索
                  </el-button>
                  <el-button @click="resetSearch" class="reset-btn" size="large">
                    <el-icon><Refresh /></el-icon>
                    重置
                  </el-button>
                </div>
              </div>

              <!-- 搜索结果提示 -->
              <div v-if="searchForm.name || searchForm.location || searchForm.categoryId" class="search-tags">
                <el-tag
                  v-if="searchForm.name"
                  closable
                  @close="clearSearchName"
                  type="info"
                  effect="dark"
                  class="search-tag"
                >
                  关键词: {{ searchForm.name }}
                </el-tag>
                <el-tag
                  v-if="searchForm.location"
                  closable
                  @close="clearSearchLocation"
                  type="warning"
                  effect="dark"
                  class="search-tag"
                >
                  地区: {{ searchForm.location }}
                </el-tag>
                <el-tag
                  v-if="searchForm.categoryId && getCurrentCategoryName()"
                  closable
                  @close="clearSearchCategory"
                  type="success"
                  effect="dark"
                  class="search-tag"
                >
                  分类: {{ getCurrentCategoryName() }}
                </el-tag>
              </div>
            </div>

          <!-- 分类筛选 -->
          <div class="category-filter">
            <h3 class="filter-title">
              <el-icon><Grid /></el-icon>
              景点分类
            </h3>
            <div class="category-chips">
              <div
                v-for="category in categoryList"
                :key="category.id"
                class="category-chip"
                :class="{'active': searchForm.categoryId === category.id}"
                @click="handleCategoryChange(category.id)"
              >
                <span class="chip-text">{{ category.name }}</span>
                <span class="chip-count" v-if="category.count">({{ category.count }})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 景点列表区域 -->
      <div class="scenic-list-section">
        <div class="section-container">

          <div class="scenic-grid" v-if="tableData && tableData.length > 0">
            <div
              v-for="(item, index) in tableData"
              :key="item.id"
              class="scenic-card"
              :class="`delay-${(index % 6 + 1) * 100}`"
              @click="goDetail(item.id)"
            >
              <div class="card-image">
                <img :src="getImageUrl(item.imageUrl)" :alt="item.name" />
                <div class="image-overlay">
                  <div class="overlay-content">
                    <div class="scenic-rating">
                      <el-icon><Star /></el-icon>
                      {{ item.rating || '4.5' }}
                    </div>
                  </div>
                </div>
                <div class="card-badges">
                  <span v-if="item.categoryInfo" class="badge category">{{ item.categoryInfo.name }}</span>
                  <span v-if="item.price === 0" class="badge free">免费</span>
                  <span v-else-if="item.price > 0" class="badge price">¥{{ item.price }}</span>
                  <span v-if="collectionStatus[item.id]" class="badge collected">
                    <el-icon><Star /></el-icon>
                    已收藏
                  </span>
                </div>
              </div>
              <div class="card-content">
                <h3 class="scenic-name">{{ item.name }}</h3>
                <div class="scenic-location">
                  <el-icon><Location /></el-icon>
                  {{ item.location || '未知地区' }}
                </div>
                <p class="scenic-desc">{{ truncateText(item.description, 80) }}</p>
                <div class="card-footer">
                  <div class="card-meta">
                    <div class="meta-stats">
                      <span class="rating-info" v-if="item.rating">
                        <el-icon><Star /></el-icon>
                        {{ getDisplayRating(item.rating) }}
                      </span>
                      <span class="review-count">{{ formatReviewCount(item.reviewCount) }}</span>
                    </div>
                  </div>
                  <el-button type="primary" size="small" class="detail-btn" @click.stop="goDetail(item.id)">
                    查看详情
                  </el-button>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="empty-state">
            <div class="empty-icon">🔍</div>
            <h3 class="empty-title">暂无景点信息</h3>
            <p class="empty-desc">试试调整搜索条件或浏览其他分类</p>
            <el-button type="primary" @click="resetSearch" class="empty-action">
              重新搜索
            </el-button>
          </div>

          <!-- 分页 -->
          <div class="pagination-wrapper" v-if="total > 0">
            <el-pagination
              background
              layout="total, prev, pager, next, jumper"
              :current-page="currentPage"
              :page-size="pageSize"
              :total="total"
              @current-change="handleCurrentChange"
              class="modern-pagination"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import request from '@/utils/request'
import { useUserStore } from '@/store/user'
import { Search, Location, Refresh, Star, Grid } from '@element-plus/icons-vue'

const baseAPI = process.env.VUE_APP_BASE_API || '/api'
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const tableData = ref([])
const categoryList = ref([])
const currentPage = ref(1)
const pageSize = ref(8)
const total = ref(0)
const searchForm = reactive({
  name: '',
  location: '',
  categoryId: null
})
const collectionStatus = ref({}) // 收藏状态映射

// 检查是否登录
const isLoggedIn = computed(() => userStore.isLoggedIn)

const fetchCategories = async () => {
  try {
    await request.get('/scenic-category/tree', {}, {
      onSuccess: (res) => {
        categoryList.value = res || [];
      }
    });
  } catch (error) {
    console.error('获取分类列表失败:', error);
    categoryList.value = [];
  }
}

const fetchScenicSpots = async () => {
  try {
    await request.get('/scenic/page', {
      name: searchForm.name,
      location: searchForm.location,
      categoryId: searchForm.categoryId,
      currentPage: currentPage.value,
      size: pageSize.value
    }, {
      onSuccess: (res) => {
        tableData.value = res.records || []
        total.value = res.total || 0
        
        // 如果用户已登录，检查收藏状态
        if (isLoggedIn.value && tableData.value.length > 0) {
          checkCollectionStatus()
        }

        // 获取评论统计信息
        if (tableData.value.length > 0) {
          fetchBatchCommentStats()
        }
      }
    })
  } catch (error) {
    console.error('获取景点列表失败:', error)
    tableData.value = []
    total.value = 0
  }
}

// 检查景点收藏状态
const checkCollectionStatus = async () => {
  // 提取景点ID列表
  const scenicIds = tableData.value.map(item => item.id)
  if (scenicIds.length === 0) return
  
  try {
    await request.post('/scenic-collection/batch-is-collected', scenicIds, {
      showDefaultMsg: false,
      onSuccess: (res) => {
        collectionStatus.value = res || {}
      }
    })
  } catch (error) {
    console.error('获取收藏状态失败:', error)
  }
}

// 处理URL搜索参数
const handleUrlParams = () => {
  const searchParam = route.query.search
  const categoryParam = route.params.categoryId

  if (searchParam) {
    // 如果有搜索参数，设置到搜索表单中
    searchForm.name = decodeURIComponent(searchParam)
  }

  if (categoryParam) {
    // 如果有分类参数，设置分类ID
    searchForm.categoryId = parseInt(categoryParam)
  }
}

// 监听路由变化
watch(() => route.query, (newQuery) => {
  if (newQuery.search !== undefined) {
    searchForm.name = newQuery.search ? decodeURIComponent(newQuery.search) : ''
    currentPage.value = 1
    fetchScenicSpots()
  }
}, { immediate: false })

watch(() => route.params.categoryId, (newCategoryId) => {
  if (newCategoryId !== undefined) {
    searchForm.categoryId = newCategoryId ? parseInt(newCategoryId) : null
    currentPage.value = 1
    fetchScenicSpots()
  }
}, { immediate: false })

onMounted(() => {
  fetchCategories();
  handleUrlParams();
  fetchScenicSpots();
})

const handleSearch = () => {
  currentPage.value = 1
  fetchScenicSpots()
}

const resetSearch = () => {
  searchForm.name = ''
  searchForm.location = ''
  searchForm.categoryId = null // 重置分类ID
  currentPage.value = 1
  fetchScenicSpots()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchScenicSpots()
}

const handleCategoryChange = (categoryId) => {
  // 如果点击当前已选中的分类，则取消选择
  if (searchForm.categoryId === categoryId) {
    searchForm.categoryId = null
  } else {
    searchForm.categoryId = categoryId
  }
  currentPage.value = 1
  fetchScenicSpots()
}

const goDetail = (id) => {
  router.push(`/scenic/${id}`)
}

// 清除搜索条件的方法
const clearSearchName = () => {
  searchForm.name = ''
  handleSearch()
}

const clearSearchLocation = () => {
  searchForm.location = ''
  handleSearch()
}

const clearSearchCategory = () => {
  searchForm.categoryId = null
  handleSearch()
}

// 获取当前选中分类的名称
const getCurrentCategoryName = () => {
  if (!searchForm.categoryId) return ''
  const category = categoryList.value.find(cat => cat.id === searchForm.categoryId)
  return category ? category.name : ''
}

// 获取图片完整URL
const getImageUrl = (url) => {
  if (!url) return '/default-scenic.jpg'
  return url.startsWith('http') ? url : baseAPI + url
}

// 截取文本
const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

// 格式化评价数量
const formatReviewCount = (count) => {
  if (!count || count === 0) return '暂无评价'
  if (count === 1) return '1条评价'
  return `${count}条评价`
}

// 获取评分显示
const getDisplayRating = (rating) => {
  if (!rating) return '4.5'
  return parseFloat(rating).toFixed(1)
}

// 批量获取评论统计信息
const fetchBatchCommentStats = async () => {
  // 为每个景点获取评论统计
  for (const item of tableData.value) {
    try {
      await request.get('/comment/page', {
        scenicId: item.id,
        currentPage: 1,
        size: 1  // 只需要获取总数
      }, {
        showDefaultMsg: false,
        onSuccess: (res) => {
          // 更新景点的评论数量
          item.reviewCount = res.total || 0
        }
      })
    } catch (error) {
      console.error(`获取景点${item.id}评论统计失败:`, error)
      item.reviewCount = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.scenic-frontend-container {
  min-height: 100vh;
  background: #f8fafc;
  font-family: "思源黑体", "Source Han Sans", "Noto Sans CJK SC", sans-serif;
  color: #333;
  
// 通用容器样式
.section-container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 40px 20px;
}

// 搜索筛选区域
.search-filter-section {
  background: white;
  padding: 0;
}

// 页面头部
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding: 40px 0 20px;
  border-bottom: 1px solid #e2e8f0;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 8px;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 12px;

  .title-icon {
    font-size: 32px;
  }
}

.page-subtitle {
  text-align: left;
  font-size: 16px;
  color: #64748b;
  margin: 0;
}




.search-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
  border: 1px solid #e2e8f0;
}

.search-header {
  margin-bottom: 20px;
}

.search-title {
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  .el-icon {
    color: #667eea;
  }
}

.search-form {
  .search-inputs {
    display: grid;
    grid-template-columns: 2fr 1fr auto;
    gap: 16px;
    align-items: end;
    margin-bottom: 20px;
  }

  .search-input-group {
    display: flex;
    flex-direction: column;
  }

  .main-search-input {
    :deep(.el-input__wrapper) {
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border: 2px solid #e2e8f0;
      transition: all 0.3s ease;

      &:hover {
        border-color: #667eea;
      }

      &.is-focus {
        border-color: #667eea;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
      }
    }
  }

  .search-actions {
    display: flex;
    gap: 12px;
  }

  .search-btn {
    background: linear-gradient(45deg, #667eea, #764ba2);
    border: none;
    border-radius: 12px;
    font-weight: 600;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
    }
  }

  .reset-btn {
    border-radius: 12px;
    border: 2px solid #e2e8f0;
    color: #64748b;
    background: white;

    &:hover {
      border-color: #667eea;
      color: #667eea;
      background: #f8fafc;
    }
  }
}

.search-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  .search-tag {
    border-radius: 20px;
    font-weight: 500;
  }
}

// 分类筛选
.category-filter {
  margin-top: 20px;
}

.filter-title {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  .el-icon {
    color: #667eea;
  }
}

.category-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.category-chip {
  padding: 8px 16px;
  border-radius: 20px;
  border: 2px solid #e2e8f0;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;

  &:hover {
    border-color: #667eea;
    color: #667eea;
    transform: translateY(-1px);
  }

  &.active {
    background: linear-gradient(45deg, #667eea, #764ba2);
    border-color: transparent;
    color: white;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  .chip-count {
    margin-left: 4px;
    opacity: 0.7;
  }
}

// 景点列表区域
.scenic-list-section {
  background: white;
  margin: 0;
  padding-top: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 12px;

  .title-icon {
    font-size: 28px;
  }
}

.results-info {
  font-size: 16px;
  color: #64748b;

  .highlight {
    color: #667eea;
    font-weight: 600;
  }
}

// 景点网格布局
.scenic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.scenic-card {
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s ease;
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);

    .card-image img {
      transform: scale(1.1);
    }

    .image-overlay {
      opacity: 1;
    }
  }
}

.card-image {
  height: 220px;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: flex-end;
  padding: 20px;
}

.overlay-content {
  color: white;

  .scenic-rating {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 600;

    .el-icon {
      margin-right: 4px;
      color: #ffd700;
    }
  }
}

.card-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(10px);

  &.category {
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
  }

  &.free {
    background: linear-gradient(45deg, #10b981, #059669);
    color: white;
  }

  &.price {
    background: rgba(255, 255, 255, 0.9);
    color: #333;
  }

  &.collected {
    background: linear-gradient(45deg, #f59e0b, #d97706);
    color: white;
    display: flex;
    align-items: center;
    gap: 2px;
  }
}
  
.card-content {
  padding: 20px;
}

.scenic-name {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 700;
  color: #2d3748;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
}

.scenic-location {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #64748b;
  margin-bottom: 12px;

  .el-icon {
    margin-right: 4px;
    color: #667eea;
  }
}

.scenic-desc {
  font-size: 14px;
  color: #64748b;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
  margin-bottom: 16px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-meta {
  .meta-stats {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 12px;
    color: #64748b;
  }

  .rating-info {
    display: flex;
    align-items: center;
    gap: 2px;
    color: #667eea;
    font-weight: 600;

    .el-icon {
      color: #ffd700;
      font-size: 14px;
    }
  }

  .review-count {
    color: #94a3b8;
  }
}

.detail-btn {
  border-radius: 20px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  font-weight: 600;
  padding: 8px 16px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
}
  
// 空状态
.empty-state {
  text-align: center;
  padding: 80px 20px;

  .empty-icon {
    font-size: 64px;
    margin-bottom: 20px;
  }

  .empty-title {
    font-size: 24px;
    font-weight: 600;
    color: #2d3748;
    margin: 0 0 8px;
  }

  .empty-desc {
    font-size: 16px;
    color: #64748b;
    margin: 0 0 24px;
  }

  .empty-action {
    background: linear-gradient(45deg, #667eea, #764ba2);
    border: none;
    border-radius: 20px;
    padding: 12px 24px;
    font-weight: 600;
  }
}

// 分页样式
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.modern-pagination {
  :deep(.el-pagination) {
    .el-pager li {
      border-radius: 8px;
      margin: 0 4px;
      transition: all 0.3s ease;

      &:hover {
        background: #667eea;
        color: white;
      }

      &.is-active {
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
      }
    }

    .btn-prev,
    .btn-next {
      border-radius: 8px;
      transition: all 0.3s ease;

      &:hover {
        background: #667eea;
        color: white;
      }
    }
  }
}

}
</style> 