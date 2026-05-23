import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'
import BackendLayout from '@/layouts/BackendLayout.vue'

// 后台路由
export const backendRoutes = [
  {
    path: '/back',
    component: BackendLayout,
    redirect: '/back/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/backend/Dashboard.vue'),
        meta: { title: 'Главная', icon: 'HomeFilled' }
      },
      {
        path: 'user',
        name: 'UserManagement',
        component: () => import('@/views/backend/user/index.vue'),
        meta: { title: 'Управление пользователями', icon: 'User' }
      },
      {
        path: 'profile',
        name: 'BackendProfile',
        component: () => import('@/views/backend/user/PersonInfo.vue'),
        meta: { title: 'Личная информация', icon: 'UserFilled' }
      },
      {
        path: 'scenic',
        name: 'ScenicManagement',
        component: () => import('@/views/backend/scenic/index.vue'),
        meta: { title: 'Управление достопримечательностями', icon: 'Location' }
      },
      {
        path: 'category',
        name: 'CategoryManagement',
        component: () => import('@/views/backend/category/CategoryList.vue'),
        meta: { title: 'Управление категориями', icon: 'Menu' }
      },
      {
        path: 'comment',
        name: 'CommentManagement',
        component: () => import('@/views/backend/comment/index.vue'),
        meta: { title: 'Управление комментариями', icon: 'ChatDotRound' }
      },
      {
        path: 'guide',
        name: 'GuideManagement',
        component: () => import('@/views/backend/guide/GuideList.vue'),
        meta: { title: 'Управление путеводителями', icon: 'Document' }
      },
      {
        path: 'collection',
        name: 'CollectionManagement',
        component: () => import('@/views/backend/collection/CollectionList.vue'),
        meta: { title: 'Управление избранным', icon: 'Star' }
      },
      {
        path: 'ticket',
        name: 'TicketManagement',
        component: () => import('@/views/backend/ticket/index.vue'),
        meta: { title: 'Управление билетами', icon: 'Ticket' }
      },
      {
        path: 'order',
        name: 'OrderManagement',
        component: () => import('@/views/backend/order/index.vue'),
        meta: { title: 'Управление заказами', icon: 'List' }
      },
      {
        path: 'accommodation',
        name: 'AccommodationManagement',
        component: () => import('@/views/backend/accommodation/index.vue'),
        meta: { title: 'Управление проживанием', icon: 'House' }
      },
      {
        path: 'carousel',
        name: 'CarouselManagement',
        component: () => import('@/views/backend/carousel/index.vue'),
        meta: { title: 'Управление каруселью', icon: 'Picture' }
      }
    ]
  }
]

// 前台路由配置
const frontendRoutes = [
  {
    path: '/',
    component: () => import('@/layouts/FrontendLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/frontend/Home.vue'),
        meta: { title: 'Главная' }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/frontend/profile/index.vue'),
        meta: { title: 'Личный кабинет', requiresAuth: true }
      },
      {
        path: 'accommodation',
        name: 'AccommodationList',
        component: () => import('@/views/frontend/accommodation/index.vue'),
        meta: { title: 'Проживание рядом' }
      },
      {
        path: 'accommodation/:id',
        name: 'AccommodationDetail',
        component: () => import('@/views/frontend/accommodation/detail.vue'),
        meta: { title: 'Детали проживания' }
      },
      {
        path: 'tickets',
        name: 'Tickets',
        component: () => import('@/views/frontend/ticket/index.vue'),
        meta: { title: 'Бронирование билетов' }
      },
      {
        path: 'ticket/booking/:id',
        name: 'TicketBooking',
        component: () => import('@/views/frontend/ticket/booking.vue'),
        meta: { title: 'Заказ билетов', requiresAuth: true }
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('@/views/frontend/orders/index.vue'),
        meta: { title: 'Мои заказы', requiresAuth: true }
      },
      {
        path: 'scenic',
        name: 'ScenicList',
        component: () => import('@/views/frontend/scenic/ScenicList.vue'),
        meta: { title: 'Список достопримечательностей' }
      },
      {
        path: 'scenic/:id',
        name: 'ScenicDetail',
        component: () => import('@/views/frontend/scenic/ScenicDetail.vue'),
        meta: { title: 'Детали достопримечательности' }
      },
      {
        path: 'scenic/category/:categoryId',
        name: 'ScenicByCategory',
        component: () => import('@/views/frontend/scenic/ScenicList.vue'),
        props: true,
        meta: { title: 'Категории достопримечательностей' }
      },
      {
        path: 'guide',
        name: 'GuideList',
        component: () => import('@/views/frontend/guide/GuideList.vue'),
        meta: { title: 'Список путеводителей' }
      },
      {
        path: 'guide/detail/:id',
        name: 'GuideDetail',
        component: () => import('@/views/frontend/guide/GuideDetail.vue'),
        meta: { title: 'Детали путеводителя' }
      },
      {
        path: 'guide/edit',
        name: 'GuideEdit',
        component: () => import('@/views/frontend/guide/GuideEdit.vue'),
        meta: { title: 'Создать путеводитель', requiresAuth: true }
      },
      {
        path: 'my-guide',
        name: 'MyGuideList',
        component: () => import('@/views/frontend/guide/MyGuideList.vue'),
        meta: { title: 'Мои путеводители', requiresAuth: true }
      },
      {
        path: 'collection',
        name: 'Collection',
        component: () => import('@/views/frontend/collection/MyCollection.vue'),
        meta: { title: 'Моё избранное', requiresAuth: true }
      },
      {
        path: 'payment/alipay/:id',
        name: 'AlipayPayment',
        component: () => import('@/views/frontend/payment/alipay-form.vue'),
        meta: { title: 'Оплата через Alipay', requiresAuth: true }
      },
      {
        path: 'payment-failed',
        name: 'PaymentFailed',
        component: () => import('@/views/frontend/payment/payment-failed.vue'),
        meta: { title: 'Ошибка оплаты' }
      },
      {
        path: 'payment/result',
        name: 'PaymentResult',
        component: () => import('@/views/frontend/payment/payment-result.vue'),
        meta: { title: 'Результат оплаты' }
      }
    ] 
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { title: 'Вход' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/Register.vue'),
    meta: { title: 'Регистрация' }
  }
]

// 错误页面路由
const errorRoutes = [
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '404' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

// 路由配置
const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...frontendRoutes,
    ...backendRoutes,
    ...errorRoutes
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - Туристическая информационная система`
  }

  const userStore = useUserStore()
  console.log("Current route:", to.path)
  console.log("User status:", {
    isLoggedIn: userStore.isLoggedIn,
    isUser: userStore.isUser
  })

  // 检查是否需要登录权限
  if (to.matched.some(record => record.meta.requiresAuth) && !userStore.isLoggedIn) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // 已登录用户的路由控制
  if (userStore.isLoggedIn) {
    // 处理登录页面访问
    if (to.path === '/login') {
      next(userStore.isUser ? '/' : '/back/dashboard')
      return
    }

    if (!userStore.isUser) {
      // 非普通用户只能访问后台路由
      if (to.path.startsWith('/back')) {
        next()
      } else {
        next('/back/dashboard')
      }
      return
    } else {
      // 普通用户只能访问前台路由
      if (to.path.startsWith('/back')) {
        next('/')
      } else {
        next()
      }
      return
    }
  } else {
    // 未登录用户
    if (to.path.startsWith('/back')) {
      next('/login')
      return
    }
  }

  next()
})

export default router
