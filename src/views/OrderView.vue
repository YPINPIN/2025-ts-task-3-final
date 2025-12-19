<script setup lang="ts">
import AppFooter from '@/components/AppFooter.vue'
import AppNavbar from '@/components/AppNavbar.vue'

import { apiClientGetOrderById, apiClientPayOrder } from '@/api/order'
import type { Order } from '@/types/order'

import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const step = ref<1 | 2>(1) // 定義只有 1 或 2
const searchOrderId = ref<string>('')

const isSearching = ref<boolean>(false)
const isProcessingPayment = ref<boolean>(false)

const order = ref<Order | null>(null)

const handleOrderSearch = async () => {
  if (!searchOrderId.value) return

  try {
    step.value = 1
    isSearching.value = true
    const res = await apiClientGetOrderById(searchOrderId.value)

    if (res.data.order) {
      order.value = res.data.order
    } else {
      alert('查無訂單資料')
      order.value = null
    }
  } catch (error) {
    alert('查無訂單資料')
    order.value = null
    console.log(error)
  } finally {
    isSearching.value = false
  }
}

const handleProcessPayment = async () => {
  if (!order.value?.id) return

  try {
    isProcessingPayment.value = true
    await apiClientPayOrder(order.value.id)
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
  </div>

  <div
    class="position-relative d-flex align-items-center justify-content-center"
    style="min-height: 400px"
  >
    <div
      class="position-absolute"
      style="
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-image: url(https://images.unsplash.com/photo-1656275537622-7837184a0dcc?q=80&w=1350&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D);
        background-position: center center;
        background-size: cover;
        background-repeat: no-repeat;
        opacity: 0.1;
      "
    ></div>
    <h2 class="fw-bold">訂單查詢</h2>
  </div>

  <div class="container">
    <div class="my-6">
      <div class="d-flex mb-4 justify-content-between align-items-center">
        <div class="input-group w-100 w-md-50">
          <input
            v-model.trim="searchOrderId"
            type="text"
            class="form-control rounded-0 border-bottom border-top-0 border-start-0 border-end-0 shadow-none"
            placeholder="請輸入訂單編號"
          />
          <div class="input-group-append">
            <button
              @click="handleOrderSearch"
              :disabled="isSearching"
              class="btn btn-outline-dark border-bottom border-top-0 border-start-0 border-end-0 rounded-0"
              type="button"
              id="button-addon2"
            >
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>

      <template v-if="order">
        <div class="row justify-content-center">
          <div class="col-md-12">
            <div v-if="step === 1">
              <h3 class="fw-bold mb-2 pt-3">訂單詳細資訊</h3>
              <p class="fw-bold mb-2 text-success">訂單編號：{{ order.id }}</p>
            </div>
            <div v-else-if="step === 2 && !order.is_paid">
              <h3 class="fw-bold mb-2 pt-3">選擇付款方式</h3>
              <p class="fw-bold mb-2 text-success">訂單編號：{{ order.id }}</p>
            </div>
          </div>
        </div>
        <div class="row justify-content-center pt-3 pb-5">
          <div class="col-md-12">
            <div class="border p-4 mb-4">
              <div class="d-flex flex-column justify-content-center gap-2">
                <div v-for="orderItem in order.products" :key="orderItem.id" class="d-flex">
                  <img
                    :src="orderItem.product.imageUrl"
                    :alt="orderItem.product.title"
                    class="me-2"
                    style="width: 48px; height: 48px; object-fit: cover"
                  />
                  <div class="w-100">
                    <div class="d-flex justify-content-between">
                      <p class="mb-0 fw-bold">{{ orderItem.product.title }}</p>
                      <p class="mb-0">NT${{ orderItem.final_total.toLocaleString('zh-TW') }}</p>
                    </div>
                    <p class="mb-0 fw-bold">x{{ orderItem.qty }}</p>
                  </div>
                </div>
              </div>
              <table class="table mt-4 border-top border-bottom text-muted">
                <tbody>
                  <tr>
                    <th scope="row" class="border-0 px-0 pt-0 pb-4 font-weight-normal">付款方式</th>
                    <td class="text-end border-0 px-0 pt-0 pb-4">ApplePay</td>
                  </tr>
                </tbody>
              </table>
              <div class="d-flex justify-content-between mt-4">
                <p class="mb-0 h4 fw-bold">總計</p>
                <p class="mb-0 h4 fw-bold">NT${{ order.total.toLocaleString('zh-TW') }}</p>
              </div>
            </div>
          </div>
          <div class="col-md-12">
            <div v-if="step === 1">
              <p>
                <strong>日期:</strong>
                <span>{{ new Date(order.create_at * 1000).toLocaleDateString() }}</span>
              </p>
              <p>
                <strong>訂單狀態：</strong>
                <span
                  class="badge"
                  :class="{ 'bg-success': order.is_paid, 'bg-danger': !order.is_paid }"
                  >{{ order.is_paid ? '已付款' : '未付款' }}</span
                >
              </p>
              <p>
                <strong>電子信箱:</strong>
                <span>{{ order.user.email }}</span>
              </p>
              <p>
                <strong>姓名:</strong>
                <span>{{ order.user.name }}</span>
              </p>
              <p>
                <strong>手機:</strong>
                <span>{{ order.user.tel }}</span>
              </p>
              <p>
                <strong>地址:</strong>
                <span>{{ order.user.address }}</span>
              </p>
              <p v-if="order.message">
                <strong>留言:</strong>
                <span>{{ order.message }}</span>
              </p>
            </div>
            <div v-else-if="step === 2 && !order.is_paid" class="card rounded-0">
              <div class="card-header bg-white border-0 py-3">
                <p class="mb-0 position-relative custom-checkout-label">Apple Pay</p>
              </div>
            </div>
            <hr />
            <div
              class="d-flex flex-column-reverse flex-md-row mt-4 justify-content-between align-items-md-center align-items-end w-100"
            >
              <template v-if="step === 1">
                <button
                  v-if="!order.is_paid"
                  @click="step = 2"
                  type="button"
                  class="btn btn-dark py-3 px-7 ms-auto"
                >
                  選擇付款方式
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
  </div>
  <AppFooter />
</template>

<style lang="scss" scoped></style>
