// 優惠券資料型別
export type CouponData = {
  id: string
  title: string
  code: string
  is_enabled: 0 | 1
  percent: number
  due_date: number
}

// 分頁資訊型別
export type Pagination = {
  total_pages: number
  current_page: number
  has_pre: boolean
  has_next: boolean
  category: string
}

// 建立優惠券參數型別
export type CreateCouponParams = Omit<CouponData, 'id'>

// 編輯優惠券參數型別
export type EditCouponParams = {
  id: string
  data: CreateCouponParams
}

// 取得優惠券列表回應型別
export type GetCouponsResponse = {
  success: boolean
  coupons: CouponData[]
  pagination: Pagination
  messages: unknown[]
}

// 訊息回應型別
type MessageResponse = {
  success: boolean
  message: string
}

export type CreateCouponResponse = MessageResponse
export type EditCouponResponse = MessageResponse
export type DeleteCouponResponse = MessageResponse
