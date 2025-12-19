<script setup lang="ts">
import type { Order } from '@/types/order'

import { Modal } from 'bootstrap'
import { onMounted, onUnmounted, useTemplateRef } from 'vue'

interface OrderDetailModalProps {
  order: Order
}

const { order } = defineProps<OrderDetailModalProps>()

const modalRef = useTemplateRef<HTMLDivElement>('modalRef')
let modal: Modal | null = null

onMounted(() => {
  if (modalRef.value) {
    modal = new Modal(modalRef.value)
  }
})

onUnmounted(() => {
  if (modal) {
    modal.dispose()
  }
})

const openModal = () => {
  if (modal) {
    modal.show()
  }
}

const closeModal = () => {
  if (modal) {
    modal.hide()
  }
}

defineExpose({
  openModal,
  closeModal,
})
</script>

<template>
  <div
    ref="modalRef"
    class="modal fade"
    id="orderDetailModal"
    tabindex="-1"
    aria-labelledby="orderDetailModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content rounded-lg">
        <div class="modal-header">
          <h5 class="modal-title" id="orderDetailModalLabel">訂單詳細資訊</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>
            <strong>訂單編號:</strong> <span id="modalOrderNumber">{{ order.id }}</span>
          </p>
          <p>
            <strong>日期:</strong>
            <span id="modalOrderDate">{{
              new Date(order.create_at * 1000).toLocaleDateString()
            }}</span>
          </p>
          <p>
            <strong>客戶名稱:</strong>
            <span id="modalCustomerName">{{ order.user.name }}</span>
          </p>
          <p>
            <strong>地址:</strong>
            <span id="modalShippingAddress">{{ order.user.address }}</span>
          </p>
          <p>
            <strong>Email:</strong>
            <span id="modalCustomerEmail">{{ order.user.email }}</span>
          </p>
          <p>
            <strong>聯絡電話:</strong>
            <span id="modalCustomerPhone">{{ order.user.tel }}</span>
          </p>
          <hr />
          <h6>訂購商品</h6>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>商品名稱</th>
                <th>數量</th>
                <th>小計</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="productObj in order.products" :key="productObj.id">
                <td>{{ productObj.product.title }}</td>
                <td>{{ productObj.qty }}</td>
                <td>{{ productObj.final_total.toLocaleString('zh-TW') }}</td>
              </tr>
            </tbody>
          </table>
          <hr />
          <p class="h5 text-end">
            <strong>總金額:</strong>
            <span id="modalOrderAmount" class="text-danger">{{
              order.total.toLocaleString('zh-TW')
            }}</span>
            元
          </p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary rounded-lg"
            data-bs-dismiss="modal"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
