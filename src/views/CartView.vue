<script setup lang="ts">
import AppFooter from '@/components/AppFooter.vue'
import AppNavbar from '@/components/AppNavbar.vue'

import DeleteModal from '@/components/DeleteModal.vue'

import { apiClientGetProducts } from '@/api/products'
import type { CartData, EditCartParams } from '@/types/cart'
import type { ProductData } from '@/types/product'

import { onMounted, ref, useTemplateRef, watch, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { storeToRefs } from 'pinia'

// import Swiper JS
import Swiper from 'swiper'
import { Autoplay } from 'swiper/modules'
// import Swiper styles
import 'swiper/css'

const cartStore = useCartStore()
const { cart, isUpdating, isApplyingCoupon } = storeToRefs(cartStore)

const couponCode = ref('')

const deleteModalRef = useTemplateRef<InstanceType<typeof DeleteModal>>('deleteModalRef')

const recommendProducts = ref<ProductData[]>([])
const swiperContainer = useTemplateRef<HTMLElement>('swiperContainer')
const swiper = ref<InstanceType<typeof Swiper> | null>(null)

enum EditType {
  PLUS = 'plus',
  MINUS = 'minus',
}

const handleEditCartItem = (type: EditType, cartItem: CartData) => {
  const params: EditCartParams = {
    id: cartItem.id,
    data: {
      product_id: cartItem.product_id,
      qty: type === EditType.PLUS ? cartItem.qty + 1 : cartItem.qty - 1,
    },
  }
  cartStore.editCartItem(params)
}

const handleDeleteCartItem = (itemId: string) => {
  cartStore.deleteCartItem(itemId)
}

const handleApplyCoupon = async () => {
  if (!couponCode.value) {
    return
  }

  await cartStore.applyCoupon(couponCode.value)
  couponCode.value = ''
}

const openDeleteModal = () => {
  deleteModalRef.value?.openModal(() => {
    cartStore.deleteAllCart()
  })
}

// 取得推薦產品
const getRecommendProducts = async () => {
  try {
    const res = await apiClientGetProducts({})
    recommendProducts.value = res.data.products
  } catch (error) {
    alert('取得推薦產品失敗')
    console.log(error)
  }
}

onMounted(() => {
  getRecommendProducts()
})

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
    <div
      v-if="cart?.carts.length === 0"
      class="min-vh-100 d-flex flex-column justify-content-center align-items-center"
    >
      <p class="text-center">目前購物車還沒有任何商品</p>
      <div class="my-6">
        <RouterLink to="/products" class="btn btn-lg btn-dark rounded-3">前往逛逛</RouterLink>
      </div>
    </div>
    <div v-else class="mt-3">
      <h3 class="mt-3 mb-4">購物車</h3>
      <div class="row">
        <div class="col-md-8">
          <table class="table">
            <thead>
              <tr>
                <th scope="col" class="border-0 ps-0">產品名稱</th>
                <th scope="col" class="border-0">產品數量</th>
                <th scope="col" class="border-0">價格</th>
                <th scope="col" class="border-0"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="cartItem in cart?.carts"
                :key="cartItem.id"
                class="border-bottom border-top"
              >
                <th scope="row" class="border-0 px-0 font-weight-normal py-4">
                  <img
                    :src="cartItem.product.imageUrl"
                    :alt="cartItem.product.title"
                    style="width: 72px; height: 72px; object-fit: cover"
                  />
                  <p class="mb-0 fw-bold ms-3 d-inline-block">{{ cartItem.product.title }}</p>
                </th>
                <td class="border-0 align-middle" style="max-width: 160px">
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <button
                        @click="() => handleEditCartItem(EditType.MINUS, cartItem)"
                        :disabled="cartItem.qty === 1 || isUpdating"
                        class="btn btn-outline-dark border-0 py-2"
                        type="button"
                        id="button-addon1"
                      >
                        <i class="fas fa-minus"></i>
                      </button>
                    </div>
                    <input
                      type="text"
                      class="form-control border-0 text-center my-auto shadow-none"
                      readonly
                      aria-label="Example text with button addon"
                      aria-describedby="button-addon1"
                      :value="cartItem.qty"
                    />
                    <div class="input-group-append">
                      <button
                        @click="() => handleEditCartItem(EditType.PLUS, cartItem)"
                        :disabled="isUpdating"
                        class="btn btn-outline-dark border-0 py-2"
                        type="button"
                      >
                        <i class="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </td>
                <td class="border-0 align-middle">
                  <p v-if="cartItem.coupon" class="mb-0 ms-autotext-muted">
                    <del>NT${{ cartItem.total.toLocaleString('zh-TW') }}</del>
                  </p>
                  <p class="mb-0 ms-auto">NT${{ cartItem.final_total.toLocaleString('zh-TW') }}</p>
                  <p v-if="cartItem.coupon" class="mb-0 badge bg-danger text-white mt-1">
                    {{ cartItem.coupon.title }}
                  </p>
                </td>
                <td class="border-0 align-middle">
                  <button
                    @click="() => handleDeleteCartItem(cartItem.id)"
                    :disabled="isUpdating"
                    class="btn btn-outline-dark border-0 py-2"
                    type="button"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="d-flex mb-3 justify-content-between align-items-center">
            <div class="input-group w-50">
              <input
                v-model.trim="couponCode"
                type="text"
                class="form-control rounded-0 border-bottom border-top-0 border-start-0 border-end-0 shadow-none"
                placeholder="折扣碼"
              />
              <div class="input-group-append">
                <button
                  @click="handleApplyCoupon"
                  :disabled="isApplyingCoupon"
                  class="btn btn-outline-dark border-bottom border-top-0 border-start-0 border-end-0 rounded-0"
                  type="button"
                  id="button-addon2"
                >
                  <i class="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
            <button @click="openDeleteModal()" type="button" class="btn btn-outline-danger w-25">
              清空購物車
            </button>
          </div>
        </div>
        <div class="col-md-4">
          <div class="border p-4 mb-4">
            <h4 class="fw-bold mb-4">訂單資訊</h4>
            <table class="table text-muted border-bottom">
              <tbody>
                <tr>
                  <th scope="row" class="border-0 px-0 pt-4 font-weight-normal">小計</th>
                  <td class="text-end border-0 px-0 pt-4">
                    NT${{ cart?.total.toLocaleString('zh-TW') }}
                  </td>
                </tr>
                <tr>
                  <th scope="row" class="border-0 px-0 pt-0 pb-4 font-weight-normal">付款方式</th>
                  <td class="text-end border-0 px-0 pt-0 pb-4">ApplePay</td>
                </tr>
              </tbody>
            </table>
            <div class="d-flex justify-content-between mt-4">
              <p class="mb-0 h4 fw-bold">總計</p>
              <p class="mb-0 h4 fw-bold">NT${{ cart?.final_total.toLocaleString('zh-TW') }}</p>
            </div>
            <RouterLink to="/checkout" class="btn btn-dark w-100 mt-4">前往結帳</RouterLink>
          </div>
        </div>
      </div>
      <div class="my-5" v-if="recommendProducts.length">
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
                        >NT${{ recommendProduct.origin_price.toLocaleString('zh-TW') }}</del
                      ></span
                    >
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <AppFooter />

  <DeleteModal ref="deleteModalRef" title="清空購物車" content="確定要清空購物車嗎？" />
</template>

<style lang="scss" scoped></style>
