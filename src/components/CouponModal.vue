<script setup lang="ts">
import { apiCreateCoupon, apiEditCoupon } from '@/api/coupons'
import type { CouponData } from '@/types/coupon'
import { Modal } from 'bootstrap'
import { onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'

import { formatDate } from '@/utils/date'

interface CouponModalProps {
  coupon: CouponData
}

const { coupon } = defineProps<CouponModalProps>()

const emit = defineEmits(['get-coupons'])

const modalRef = useTemplateRef<HTMLDivElement>('modalRef')

let modal: Modal | null = null

const getInitialCouponData = (): CouponData => ({
  id: '',
  title: '',
  code: '',
  is_enabled: 0,
  percent: 0,
  due_date: Date.now() / 1000,
})

const formCoupon = ref<CouponData>(getInitialCouponData())
const formTitle = ref<string>('新增優惠券')

const isEditMode = ref(false)
const isLoading = ref(false)

watch(
  () => coupon,
  (newCoupon: CouponData) => {
    if (newCoupon.id) {
      formCoupon.value = { ...newCoupon }
      isEditMode.value = true
      formTitle.value = '編輯優惠券'
    } else {
      formCoupon.value = getInitialCouponData()
      formTitle.value = '新增優惠券'
      isEditMode.value = false
    }
  },
  { immediate: true, deep: true },
)

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

const handleDateChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const dateValue = new Date(target.value).getTime() / 1000
  formCoupon.value.due_date = dateValue
}

const saveCoupon = async () => {
  isLoading.value = true

  const { id, ...couponData } = formCoupon.value

  try {
    if (isEditMode.value && id) {
      await apiEditCoupon({ id: formCoupon.value.id, data: couponData })
    } else {
      await apiCreateCoupon(couponData)
    }
    closeModal()
  } catch (error) {
    alert(isEditMode.value ? '編輯優惠券失敗' : '新增優惠券失敗')
    console.log(error)
  } finally {
    isLoading.value = false
    emit('get-coupons')
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
    id="couponModal"
    tabindex="-1"
    aria-labelledby="couponModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content rounded-lg">
        <div class="modal-header">
          <h5 class="modal-title" id="couponModalLabel">{{ formTitle }}</h5>
          <button
            @click="closeModal"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label for="couponTitle" class="form-label">優惠券標題</label>
              <input
                v-model="formCoupon.title"
                type="text"
                class="form-control rounded-lg"
                id="couponTitle"
                placeholder="例如：新會員專屬折扣"
              />
            </div>
            <div class="mb-3">
              <label for="couponCode" class="form-label">優惠碼</label>
              <input
                v-model="formCoupon.code"
                type="text"
                class="form-control rounded-lg"
                id="couponCode"
                placeholder="例如：NEW2026"
              />
            </div>
            <div class="mb-3">
              <label for="couponDiscount" class="form-label">折扣</label>
              <input
                v-model.number="formCoupon.percent"
                type="number"
                max="100"
                min="0"
                class="form-control rounded-lg"
                id="couponDiscount"
                placeholder="例如：90 代表 9 折"
              />
            </div>
            <div class="mb-3">
              <label for="couponEndDate" class="form-label">截止日</label>
              <input
                :value="formatDate(formCoupon.due_date)"
                @change="handleDateChange"
                type="date"
                class="form-control rounded-lg"
                id="couponEndDate"
              />
            </div>
            <div class="mb-3 d-flex align-items-center">
              <label class="form-label me-3 mb-0">啟用</label>
              <div class="form-check form-switch">
                <input
                  v-model="formCoupon.is_enabled"
                  class="form-check-input"
                  type="checkbox"
                  id="flexSwitchCouponEnable"
                  :true-value="1"
                  :false-value="0"
                />
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button @click="closeModal" type="button" class="btn btn-outline-secondary rounded-lg">
            取消
          </button>
          <button
            @click="saveCoupon"
            :disabled="isLoading"
            type="button"
            class="btn btn-dark rounded-lg"
          >
            儲存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
