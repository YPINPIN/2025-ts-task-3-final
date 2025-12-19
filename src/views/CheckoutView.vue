<script setup lang="ts">
import AppNavbar from '@/components/AppNavbar.vue'

import { apiClientCreateOrder, apiClientPayOrder } from '@/api/order'
import type { CreateOrderParams } from '@/types/order'

import { ref, computed, useTemplateRef } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { storeToRefs } from 'pinia'

const router = useRouter()

const cartStore = useCartStore()
const { cart } = storeToRefs(cartStore)

if (cart.value.carts.length === 0) {
  router.push('/cart')
}

const submitBtn = useTemplateRef<HTMLButtonElement>('submitBtn')

type FormData = CreateOrderParams['user'] & {
  message: string
}

const form = ref<FormData>({
  email: '',
  name: '',
  tel: '',
  address: '',
  message: '',
})

const orderId = ref<string | null>(null)

const step = ref<1 | 2>(1) // 定義只有 1 或 2
const isSubmitting = ref<boolean>(false)
const isProcessingPayment = ref<boolean>(false)

const isEmailValid = computed(() => {
  const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  return form.value.email && emailPattern.test(form.value.email.trim())
})

const isNameValid = computed(() => {
  return form.value.name && form.value.name.trim() !== ''
})

const isPhoneValid = computed(() => {
  const phonePattern = /^09\d{8}$/
  return form.value.tel && phonePattern.test(form.value.tel)
})

const isAddressValid = computed(() => {
  return form.value.address && form.value.address.trim() !== ''
})

const handleNextStep = () => {
  if (orderId.value) {
    // 已經建立過訂單，直接進入選擇結帳方式
    step.value = 2
    return
  }

  submitBtn.value?.click()
}

// 建立訂單
const handleSubmitOrder = async () => {
  try {
    isSubmitting.value = true

    const { message, ...user } = form.value

    const orderData: CreateOrderParams = {
      user,
      message,
    }

    const res = await apiClientCreateOrder(orderData)
    orderId.value = res.data.orderId
    step.value = 2
    alert(res.data.message)
  } catch (error) {
    alert('訂單建立失敗')
    console.log(error)
  } finally {
    isSubmitting.value = false
  }
}

const handleProcessPayment = async () => {
  if (!orderId.value) return

  try {
    isProcessingPayment.value = true
    await apiClientPayOrder(orderId.value)
    router.push('/checkout-success')
  } catch (error) {
    alert('付款失敗')
    console.log(error)
  } finally {
    isProcessingPayment.value = false
  }
}
</script>

<template>
  <div class="container">
    <AppNavbar />
    <template v-if="cart?.carts && cart?.carts.length > 0">
      <div class="row justify-content-center">
        <div class="col-md-10">
          <div v-if="step === 1 && orderId">
            <h3 class="fw-bold mb-2 pt-3">訂單已成立</h3>
            <p class="fw-bold mb-2 text-success">訂單編號：{{ orderId }}</p>
          </div>
          <h3 v-else-if="step === 1" class="fw-bold mb-4 pt-3">輸入結帳資訊</h3>
          <div v-else-if="step === 2 && orderId">
            <h3 class="fw-bold mb-2 pt-3">選擇付款方式</h3>
            <p class="fw-bold mb-2 text-success">訂單編號：{{ orderId }}</p>
          </div>
        </div>
      </div>
      <div class="row flex-row-reverse justify-content-center pb-5">
        <div class="col-md-4">
          <div class="border p-4 mb-4">
            <div class="d-flex flex-column justify-content-center gap-2">
              <div v-for="cartItem in cart?.carts" :key="cartItem.id" class="d-flex">
                <img
                  :src="cartItem.product.imageUrl"
                  :alt="cartItem.product.title"
                  class="me-2"
                  style="width: 48px; height: 48px; object-fit: cover"
                />
                <div class="w-100">
                  <div class="d-flex justify-content-between">
                    <p class="mb-0 fw-bold">{{ cartItem.product.title }}</p>
                    <p class="mb-0">NT${{ cartItem.final_total.toLocaleString('zh-TW') }}</p>
                  </div>
                  <p class="mb-0 fw-bold">x{{ cartItem.qty }}</p>
                </div>
              </div>
            </div>
            <table class="table mt-4 border-top border-bottom text-muted">
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
          </div>
        </div>
        <div class="col-md-6">
          <form v-if="step === 1" @submit.prevent="handleSubmitOrder">
            <div class="mb-2">
              <label for="email" class="text-muted mb-0">電子信箱</label>
              <input
                v-model="form.email"
                required
                type="email"
                class="form-control"
                id="email"
                placeholder="example@gmail.com"
                :disabled="orderId ? true : false"
              />
              <span v-if="!isEmailValid" class="text-danger small mt-1">
                請輸入正確的電子信箱
              </span>
            </div>
            <div class="mb-2">
              <label for="name" class="text-muted mb-0">姓名</label>
              <input
                v-model="form.name"
                required
                type="text"
                class="form-control"
                id="name"
                placeholder="王漂亮"
                :disabled="orderId ? true : false"
              />
              <span v-if="!isNameValid" class="text-danger small mt-1"> 請輸入姓名 </span>
            </div>
            <div class="mb-2">
              <label for="tel" class="text-muted mb-0">手機</label>
              <input
                v-model="form.tel"
                required
                type="text"
                class="form-control"
                id="tel"
                placeholder="0912345678"
                :disabled="orderId ? true : false"
              />
              <span v-if="!isPhoneValid" class="text-danger small mt-1">
                請輸入正確的手機號碼
              </span>
            </div>
            <div class="mb-2">
              <label for="address" class="text-muted mb-0">地址</label>
              <input
                v-model="form.address"
                required
                type="text"
                class="form-control"
                id="address"
                placeholder="高雄市新興區"
                :disabled="orderId ? true : false"
              />
              <span v-if="!isAddressValid" class="text-danger small mt-1"> 請輸入正確的地址 </span>
            </div>
            <div class="mb-2">
              <label for="message" class="text-muted mb-0">留言</label>
              <textarea
                v-model="form.message"
                class="form-control"
                rows="3"
                id="message"
                :disabled="orderId ? true : false"
              ></textarea>
            </div>
            <button ref="submitBtn" type="submit" class="d-none"></button>
          </form>
          <div v-else class="card rounded-0">
            <div class="card-header bg-white border-0 py-3">
              <p class="mb-0 position-relative custom-checkout-label">Apple Pay</p>
            </div>
          </div>
          <div
            class="d-flex flex-column-reverse flex-md-row mt-4 justify-content-between align-items-md-center align-items-end w-100"
          >
            <template v-if="step === 1">
              <RouterLink to="/cart" class="text-dark mt-md-0 mt-3"
                ><i class="fas fa-chevron-left me-2"></i>返回</RouterLink
              >
              <button
                @click="handleNextStep"
                :disabled="
                  isSubmitting || !isEmailValid || !isNameValid || !isPhoneValid || !isAddressValid
                "
                type="button"
                class="btn btn-dark py-3 px-7"
              >
                {{ orderId ? '選擇付款方式' : '送出訂單' }}
              </button>
            </template>
            <template v-else>
              <button
                @click="step = 1"
                type="button"
                class="link-dark bg-transparent border-0 mt-md-0 mt-3 p-0"
              >
                <i class="fas fa-chevron-left me-2"></i>返回
              </button>
              <button
                @click="handleProcessPayment"
                :disabled="isProcessingPayment"
                type="button"
                class="btn btn-dark py-3 px-7"
              >
                結帳
              </button>
            </template>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped></style>
