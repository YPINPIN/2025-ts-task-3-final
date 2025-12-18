import HomeView from '@/views/HomeView.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('@/views/ProductsView.vue'),
      meta: { title: '產品列表' },
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: () => import('@/views/ProductDetailView.vue'),
      meta: { title: '產品詳細' },
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/CartView.vue'),
      meta: { title: '購物車' },
    },
    {
      path: '/admin',
      name: 'dashboard',
      component: () => import('@/components/Dashboard.vue'),
      meta: { title: '後台 - 儀表板' },
      children: [
        {
          path: 'product-management',
          name: 'product-management',
          component: () => import('@/views/ProductManagement.vue'),
          meta: { title: '後台 - 商品管理' },
        },
        {
          path: 'order-management',
          name: 'order-management',
          component: () => import('@/views/OrderManagement.vue'),
          meta: { title: '後台 - 訂單管理' },
        },
        {
          path: 'coupon-management',
          name: 'coupon-management',
          component: () => import('@/views/CouponManagement.vue'),
          meta: { title: '後台 - 優惠券管理' },
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: { title: '後台 - 登入' },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    return {
      top: 0,
      left: 0,
      behavior: 'smooth',
    }
  },
})

router.afterEach((to) => {
  document.title = to.meta.title ? '植感生活 | ' + to.meta.title : '植感生活'
})

export default router
