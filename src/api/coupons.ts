import type {
  GetCouponsResponse,
  CreateCouponParams,
  CreateCouponResponse,
  EditCouponParams,
  EditCouponResponse,
  DeleteCouponResponse,
} from '@/types/coupon'
import axios, { type AxiosResponse } from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL
const API_PATH = import.meta.env.VITE_API_PATH

const couponApi = axios.create({
  baseURL: BASE_URL,
})

couponApi.interceptors.request.use(
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

couponApi.interceptors.response.use(
  (response) => {
    return Promise.resolve(response)
  },
  (error) => {
    return Promise.reject(error.response.data)
  },
)

export const apiGetCoupons = (params: {
  page?: string
}): Promise<AxiosResponse<GetCouponsResponse>> =>
  couponApi.get(`/v2/api/${API_PATH}/admin/coupons`, {
    params,
  })

export const apiCreateCoupon = (
  params: CreateCouponParams,
): Promise<AxiosResponse<CreateCouponResponse>> =>
  couponApi.post(`/v2/api/${API_PATH}/admin/coupon`, {
    data: params,
  })

export const apiEditCoupon = (
  params: EditCouponParams,
): Promise<AxiosResponse<EditCouponResponse>> => {
  const { id, data } = params
  return couponApi.put(`/v2/api/${API_PATH}/admin/coupon/${id}`, {
    data,
  })
}

export const apiDeleteCoupon = (couponId: string): Promise<AxiosResponse<DeleteCouponResponse>> =>
  couponApi.delete(`/v2/api/${API_PATH}/admin/coupon/${couponId}`)
