import axios, { type AxiosResponse } from 'axios'

import type {
  DeleteOrderResponse,
  GetOrdersResponse,
  CreateOrderParams,
  CreateOrderResponse,
  PayOrderResponse,
  GetOrderByIdResponse,
} from '@/types/order'

const BASE_URL = import.meta.env.VITE_BASE_URL
const API_PATH = import.meta.env.VITE_API_PATH

const orderApi = axios.create({
  baseURL: BASE_URL,
})

orderApi.interceptors.request.use(
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

orderApi.interceptors.response.use(
  (response) => {
    return Promise.resolve(response)
  },
  (error) => {
    return Promise.reject(error.response.data)
  },
)

export const apiGetOrders = (params: {
  page?: string
}): Promise<AxiosResponse<GetOrdersResponse>> =>
  orderApi.get(`/v2/api/${API_PATH}/admin/orders`, { params })

export const apiDeleteOrder = (orderId: string): Promise<AxiosResponse<DeleteOrderResponse>> =>
  orderApi.delete(`/v2/api/${API_PATH}/admin/order/${orderId}`)

// ==========================================
// 客戶端 API
// ==========================================

export const apiClientCreateOrder = (
  params: CreateOrderParams,
): Promise<AxiosResponse<CreateOrderResponse>> =>
  orderApi.post(`/v2/api/${API_PATH}/order`, { data: params })

export const apiClientPayOrder = (orderId: string): Promise<AxiosResponse<PayOrderResponse>> =>
  orderApi.post(`/v2/api/${API_PATH}/pay/${orderId}`)

export const apiClientGetOrderById = (
  orderId: string,
): Promise<AxiosResponse<GetOrderByIdResponse>> =>
  orderApi.get(`/v2/api/${API_PATH}/order/${orderId}`)
