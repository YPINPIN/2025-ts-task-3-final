<script setup lang="ts">
import { apiGetCoupons, apiDeleteCoupon } from '@/api/coupons'

import DeleteModal from '@/components/DeleteModal.vue'
import CouponModal from '@/components/CouponModal.vue'

import type { CouponData, Pagination } from '@/types/coupon'
import { onMounted, ref, useTemplateRef, watch } from 'vue'

import { formatCouponDate } from '@/utils/date'

const couponModalRef = useTemplateRef<InstanceType<typeof CouponModal>>('couponModalRef')
const deleteModalRef = useTemplateRef<InstanceType<typeof DeleteModal>>('deleteModalRef')

const currentPage = ref<string>('1')

const coupons = ref<CouponData[]>([])

const pagination = ref<Pagination>({
  total_pages: 0,
  current_page: 0,
  has_pre: false,
  has_next: false,
  category: '',
})

const getCoupons = async () => {
  try {
    const res = await apiGetCoupons({ page: currentPage.value })
    coupons.value = res.data.coupons
    pagination.value = res.data.pagination
    const pageStr = pagination.value.current_page.toString()
    if (currentPage.value !== pageStr) {
      currentPage.value = pageStr
    }
  } catch (error) {
    alert('取得優惠券列表失敗')
    console.log(error)
  }
}
onMounted(() => {
  getCoupons()
})

const getInitialCouponData = (): CouponData => ({
  id: '',
  title: '',
  code: '',
  is_enabled: 0,
  percent: 0,
  due_date: Date.now() / 1000,
})

const tempCoupon = ref<CouponData>(getInitialCouponData())

const openModal = (coupon: CouponData | null) => {
  if (coupon) {
    tempCoupon.value = coupon
  } else {
    tempCoupon.value = getInitialCouponData()
  }

  couponModalRef.value?.openModal()
}

const openDeleteModal = (couponId: string) => {
  deleteModalRef.value?.openModal(() => handleDeleteCoupon(couponId))
}

const handleDeleteCoupon = async (couponId: string): Promise<void> => {
  try {
    await apiDeleteCoupon(couponId)
  } catch (error) {
    alert('刪除優惠券失敗')
    console.log(error)
  } finally {
    getCoupons()
  }
}

watch(currentPage, () => {
  getCoupons()
})
</script>

<template>
  <div class="d-flex justify-content-end align-items-center mb-4">
    <button @click="openModal(null)" type="button" class="btn btn-dark rounded-lg px-4 py-2">
      <i class="fas fa-plus me-2"></i>新增優惠券
    </button>
  </div>
  <div class="card shadow-sm rounded-lg flex-grow-1">
    <div class="card-body p-4">
      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead>
            <tr>
              <th scope="col">優惠券標題</th>
              <th scope="col">優惠碼</th>
              <th scope="col">折扣</th>
              <th scope="col">截止日</th>
              <th scope="col" class="text-center">啟用</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="coupon in coupons" :key="coupon.id">
              <td>{{ coupon.title }}</td>
              <td>{{ coupon.code }}</td>
              <td>{{ coupon.percent }}</td>
              <td>
                {{ formatCouponDate(coupon.due_date) }}
              </td>
              <td class="text-center">
                <div
                  class="form-check form-switch d-flex justify-content-center align-items-center"
                >
                  <input
                    readonly
                    class="form-check-input"
                    style="pointer-events: none"
                    type="checkbox"
                    :checked="Boolean(coupon.is_enabled)"
                  />
                </div>
              </td>
              <td class="text-nowrap">
                <button
                  @click="openModal(coupon)"
                  type="button"
                  class="btn btn-sm btn-outline-dark rounded-lg me-2"
                >
                  編輯
                </button>
                <button
                  @click="openDeleteModal(coupon.id)"
                  type="button"
                  class="btn btn-sm btn-outline-danger rounded-lg"
                >
                  刪除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav class="d-flex justify-content-center mt-4">
        <ul class="pagination">
          <li class="page-item">
            <button
              @click="currentPage = String(Number(currentPage) - 1)"
              :disabled="!pagination?.has_pre"
              type="button"
              class="page-link"
              :class="{ disabled: !pagination?.has_pre }"
              aria-label="Previous"
            >
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>
          <li v-for="pageNum in pagination?.total_pages" :key="pageNum" class="page-item">
            <button
              @click="currentPage = pageNum.toString()"
              :disabled="currentPage === pageNum.toString()"
              type="button"
              class="page-link"
              :class="{ active: currentPage === pageNum.toString() }"
            >
              {{ pageNum }}
            </button>
          </li>
          <li class="page-item">
            <button
              @click="currentPage = String(Number(currentPage) + 1)"
              :disabled="!pagination?.has_next"
              class="page-link"
              :class="{ disabled: !pagination?.has_next }"
              type="button"
              aria-label="Next"
            >
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>

  <CouponModal ref="couponModalRef" :coupon="tempCoupon" @get-coupons="getCoupons" />
  <DeleteModal ref="deleteModalRef" title="刪除優惠券" content="確定要刪除此優惠券嗎？" />
</template>

<style lang="scss" scoped></style>
