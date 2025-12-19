import type { CartData } from './cart'

export type Order = {
  create_at: number
  id: string
  is_paid: boolean
  message?: string
  paid_date?: number
  products: {
    [key: string]: CartData
  }
  total: number
  user: {
    address: string
    email: string
    name: string
    tel: string
  }
  num: number
}

export type Pagination = {
  total_pages: number
  current_page: number
  has_pre: boolean
  has_next: boolean
  category: string
}

export type GetOrdersResponse = {
  success: boolean
  orders: Order[]
  pagination: Pagination
  messages: unknown[]
}

export type DeleteOrderResponse = {
  success: boolean
  message: string
}

export type CreateOrderParams = Pick<Order, 'user' | 'message'>

export type CreateOrderResponse = {
  success: boolean
  message: string
  total: number
  create_at: number
  orderId: string
}

export type PayOrderResponse = {
  success: boolean
  message: string
}
