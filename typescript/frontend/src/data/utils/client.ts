/* eslint-disable import/no-anonymous-default-export */
import {SearchParamOptions} from '@/types';
import type {AxiosResponse} from 'axios';
import axios from 'axios';

export const Axios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REST_API_ENDPOINT,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const responseBody = (response: AxiosResponse) => response.data;

export class HttpClient {
  static async get<T>(url: string, params?: unknown) {
    const response = await Axios.get<T>(url, { params });
    return response.data;
  }

  static async post<T>(url: string, data: unknown, options?: any) {
    const response = await Axios.post<T>(url, data, options);
    return response.data;
  }

  static async put<T>(url: string, data: unknown) {
    const response = await Axios.put<T>(url, data);
    return response.data;
  }

  static async delete<T>(url: string) {
    const response = await Axios.delete<T>(url);
    return response.data;
  }

  static formatSearchParams(params: Partial<SearchParamOptions>) {
    return Object.entries(params)
      .filter(([, value]) => Boolean(value))
      .map(([k, v]) =>
        ['type', 'categories', 'id', 'name'].includes(k)
          ? `${k}.slug:${v}`
          : `${k}:${v}`
      )
      .join(';');
  }
}

export default new HttpClient();
