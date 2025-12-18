import {
  apiAddCartItem,
  apiDeleteAllCart,
  apiDeleteCartItem,
  apiEditCartItem,
  apiGetCartInfo,
  apiApplyCoupon,
} from '@/api/carts'
import type { AddCartParams, CartInfo, EditCartParams } from '@/types/cart'

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const cart = ref<CartInfo>({
    carts: [],
    total: 0,
    final_total: 0,
  })

  const isUpdating = ref<boolean>(false)
  const isApplyingCoupon = ref<boolean>(false)

  const getCartInfo = async () => {
    try {
      const res = await apiGetCartInfo()
      cart.value = res.data.data
    } catch (error) {
      alert('取得購物車失敗')
      console.log(error)
    }
  }

  const addCartItem = async (params: AddCartParams) => {
    try {
      const res = await apiAddCartItem(params)
      const message = res.data.message
      alert(message)
      await getCartInfo()
    } catch (error) {
      alert('加入購物車失敗')
      console.log(error)
    }
  }

  const editCartItem = async (params: EditCartParams) => {
    try {
      isUpdating.value = true

      const res = await apiEditCartItem(params)
      const message = res.data.message
      alert(message)
      await getCartInfo()
    } catch (error) {
      alert('修改購物車失敗')
      console.log(error)
    } finally {
      isUpdating.value = false
    }
  }

  const deleteCartItem = async (itemId: string) => {
    try {
      isUpdating.value = true

      const res = await apiDeleteCartItem(itemId)
      const message = res.data.message
      alert(message)
      await getCartInfo()
    } catch (error) {
      alert('刪除購物車項目失敗')
      console.log(error)
    } finally {
      isUpdating.value = false
    }
  }

  const deleteAllCart = async () => {
    try {
      isUpdating.value = true

      const res = await apiDeleteAllCart()
      const message = res.data.message
      alert(message)
      await getCartInfo()
    } catch (error) {
      alert('刪除購物車失敗')
      console.log(error)
    } finally {
      isUpdating.value = false
    }
  }

  const applyCoupon = async (code: string) => {
    try {
      isApplyingCoupon.value = true

      const res = await apiApplyCoupon({ code })
      const message = res.data.message
      alert(message)
      await getCartInfo()
    } catch (error) {
      alert('套用優惠券失敗，優惠券已過期或不存在')
      console.log(error)
    } finally {
      isApplyingCoupon.value = false
    }
  }

  return {
    cart,
    isUpdating,
    isApplyingCoupon,
    getCartInfo,
    addCartItem,
    editCartItem,
    deleteCartItem,
    deleteAllCart,
    applyCoupon,
  }
})
