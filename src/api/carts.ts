import type {
  AddCartParams,
  AddCartResponse,
  DeleteCartResponse,
  EditCartParams,
  EditCartResponse,
  GetCartResponse,
  ApplyCouponParams,
  ApplyCouponResponse,
} from '@/types/cart'
import axios, { type AxiosResponse } from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL
const API_PATH = import.meta.env.VITE_API_PATH

const cartApi = axios.create({
  baseURL: BASE_URL,
})

cartApi.interceptors.request.use(
  (request) => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1')

    if (token) {
      request.headers['Authorization'] = token
    }

    return request
  },
  (error) => {
    return Promise.reject(error)
  },
)

cartApi.interceptors.response.use(
  (response) => {
    return Promise.resolve(response)
  },
  (error) => {
    return Promise.reject(error.response.data)
  },
)

// ==========================================
// 客戶端 API
// ==========================================

// 取得購物車資訊
export const apiGetCartInfo = (): Promise<AxiosResponse<GetCartResponse>> =>
  cartApi.get(`/v2/api/${API_PATH}/cart`)

// 新增購物車項目
export const apiAddCartItem = (params: AddCartParams): Promise<AxiosResponse<AddCartResponse>> =>
  cartApi.post(`/v2/api/${API_PATH}/cart`, { data: params })

// 編輯購物車項目
export const apiEditCartItem = (
  params: EditCartParams,
): Promise<AxiosResponse<EditCartResponse>> => {
  const { id, data } = params
  return cartApi.put(`/v2/api/${API_PATH}/cart/${id}`, { data })
}

// 刪除購物車項目
export const apiDeleteCartItem = (itemId: string): Promise<AxiosResponse<DeleteCartResponse>> =>
  cartApi.delete(`/v2/api/${API_PATH}/cart/${itemId}`)

// 刪除全部購物車項目
export const apiDeleteAllCart = (): Promise<AxiosResponse<DeleteCartResponse>> =>
  cartApi.delete(`/v2/api/${API_PATH}/carts`)

// 套用折扣碼
export const apiApplyCoupon = (
  params: ApplyCouponParams,
): Promise<AxiosResponse<ApplyCouponResponse>> =>
  cartApi.post(`/v2/api/${API_PATH}/coupon`, {
    data: params,
  })
