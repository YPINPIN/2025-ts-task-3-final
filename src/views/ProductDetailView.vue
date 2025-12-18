<script setup lang="ts">
import AppFooter from '@/components/AppFooter.vue'
import AppNavbar from '@/components/AppNavbar.vue'

import { apiClientGetProductDetail, apiClientGetProducts } from '@/api/products'
import type { ProductData } from '@/types/product'

import { ref, computed, useTemplateRef, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import 'bootstrap/js/dist/carousel'

// import Swiper JS
import Swiper from 'swiper'
import { Autoplay } from 'swiper/modules'
// import Swiper styles
import 'swiper/css'

import { useCartStore } from '@/stores/cartStore'
const cartStore = useCartStore()

const route = useRoute()
const router = useRouter()

const productId = computed<string>(() => route.params.id as string)
const product = ref<ProductData | null>(null)

const allImages = computed(() => {
  return [product.value?.imageUrl, ...(product.value?.imagesUrl?.filter(Boolean) || [])]
})
const productNum = ref<number>(1)

const recommendProducts = ref<ProductData[]>([])
const swiperContainer = useTemplateRef<HTMLElement>('swiperContainer')
const swiper = ref<InstanceType<typeof Swiper> | null>(null)

// 取得產品詳細資訊
const getProductDetail = async () => {
  try {
    const res = await apiClientGetProductDetail(productId.value)

    product.value = res.data.product
    // 取得推薦產品
    getCategoryProducts(res.data.product.category)
  } catch (error) {
    alert('取得產品資訊失敗')
    console.log(error)
    router.push('/products')
  }
}

// 取得同分類推薦產品
const getCategoryProducts = async (category: string) => {
  try {
    const res = await apiClientGetProducts({ category })
    recommendProducts.value = res.data.products.filter((p) => p.id !== productId.value)
  } catch (error) {
    alert('取得推薦產品失敗')
    console.log(error)
  }
}

const handleAddCartItem = async () => {
  cartStore.addCartItem({
    product_id: productId.value,
    qty: productNum.value,
  })
}

// 監聽 productId 變化，取得產品詳細資訊
watch(
  productId,
  () => {
    productNum.value = 1
    getProductDetail()
  },
  { immediate: true },
)

// 根據推薦產品更新 Swiper
watch(recommendProducts, async () => {
  await nextTick() // 保證 swiper DOM 已渲染

  if (!swiperContainer.value) return

  if (swiper.value) {
    swiper.value.destroy(true, true)
    swiper.value = null
  }

  const slidesPerView = 2
  const isLoop = recommendProducts.value.length > slidesPerView

  swiper.value = new Swiper(swiperContainer.value, {
    modules: [Autoplay],
    loop: isLoop,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    slidesPerView,
    spaceBetween: 10,
  })
})
</script>

<template>
  <div class="container">
    <AppNavbar />
    <div class="row align-items-center">
      <div class="col-md-7">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb bg-white px-0 mb-0 py-3">
            <li class="breadcrumb-item"><RouterLink class="text-muted" to="/">首頁</RouterLink></li>
            <li class="breadcrumb-item">
              <RouterLink class="text-muted" to="/products">產品列表</RouterLink>
            </li>
            <li class="breadcrumb-item active" aria-current="page">產品詳細</li>
          </ol>
        </nav>
        <div id="carouselExample" class="carousel slide">
          <div class="carousel-container carousel-inner">
            <div
              v-for="(image, index) in allImages"
              :key="image"
              class="carousel-item"
              :class="{ active: index === 0 }"
            >
              <img
                :src="image"
                class="d-block w-100 object-fit-cover"
                :alt="`商品圖${index + 1}`"
              />
            </div>
          </div>
          <button
            class="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      <div class="col-md-5">
        <h2 class="fw-bold h1 mb-1">{{ product?.title }}</h2>
        <p class="mb-0 text-muted text-end">
          <del>NT${{ product?.origin_price?.toLocaleString('zh-TW') }}</del>
        </p>
        <p class="h4 fw-bold text-end">NT${{ product?.price?.toLocaleString('zh-TW') }}</p>
        <div class="row align-items-center">
          <div class="col-6">
            <div class="input-group my-3 bg-light rounded">
              <div class="input-group-prepend">
                <button
                  @click="productNum--"
                  :disabled="productNum <= 1"
                  class="btn btn-outline-dark border-0 py-2"
                  type="button"
                  id="button-addon1"
                >
                  <i class="fas fa-minus"></i>
                </button>
              </div>
              <input
                type="text"
                class="form-control border-0 text-center my-auto shadow-none bg-light"
                readonly
                :value="productNum"
              />
              <div class="input-group-append">
                <button
                  @click="productNum++"
                  class="btn btn-outline-dark border-0 py-2"
                  type="button"
                  id="button-addon2"
                >
                  <i class="fas fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="col-6">
            <button
              @click="handleAddCartItem"
              type="button"
              class="text-nowrap btn btn-dark w-100 py-2"
            >
              加入購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row my-5">
      <div class="col-md-4">
        <p>
          {{ product?.description }}
        </p>
      </div>
      <div class="col-md-3">
        <p style="white-space: pre-wrap" class="text-muted">{{ product?.content }}</p>
      </div>
    </div>
    <template v-if="recommendProducts.length">
      <h3 class="fw-bold">你可能會喜歡的商品</h3>
      <div ref="swiperContainer" class="swiper mt-4 mb-5">
        <div class="swiper-wrapper">
          <div
            v-for="recommendProduct in recommendProducts"
            :key="recommendProduct.id"
            class="swiper-slide"
          >
            <div class="card border-0 mb-4 position-relative position-relative">
              <img
                :src="recommendProduct.imageUrl"
                class="card-img-top object-fit-cover rounded-0"
                style="height: 280px"
                :alt="recommendProduct.title"
              />
              <div class="card-body p-0">
                <h4 class="mb-0 mt-3">
                  <RouterLink :to="`/products/${recommendProduct.id}`">{{
                    recommendProduct.title
                  }}</RouterLink>
                </h4>
                <p class="card-text mb-0">
                  NT${{ recommendProduct.price.toLocaleString('zh-TW') }}
                  <span class="text-muted"
                    ><del
                      >NT${{ recommendProduct.origin_price.toLocaleString('zh-TW') }}
                    </del></span
                  >
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
  <AppFooter />
</template>

<style lang="scss" scoped></style>
