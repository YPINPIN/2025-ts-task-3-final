import type { CouponData } from './coupon'
import type { ProductData } from './product'

export type CartData = {
  id: string
  product: ProductData
  product_id: string
  qty: number
  total: number
  final_total: number
  coupon?: CouponData
}

export type CartInfo = {
  carts: CartData[]
  total: number
  final_total: number
}

export type AddCartParams = Pick<CartData, 'product_id' | 'qty'>

export type EditCartParams = {
  id: string
  data: AddCartParams
}

export type GetCartResponse = {
  success: boolean
  data: CartInfo
  message: unknown[]
}

export type AddCartResponse = {
  success: boolean
  message: string
  data: Omit<CartData, 'coupon'>
}

export type EditCartResponse = {
  success: boolean
  message: string
  data: AddCartParams
}

export type DeleteCartResponse = {
  success: boolean
  message: string
}

export type ApplyCouponParams = Pick<CouponData, 'code'>

export type ApplyCouponResponse = {
  success: boolean
  message: string
  data: {
    final_total: number
  }
}
