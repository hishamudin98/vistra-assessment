import axios, { AxiosRequestConfig, Method } from "axios";
import type { ApiResponse } from "@/types/document.types";

const basePath = "/api/core";

/**
 * Generic API request wrapper
 * @param method - HTTP method (GET, POST, PUT, PATCH, DELETE)
 * @param url - API endpoint (relative to basePath)
 * @param data - Request body data (optional)
 * @param config - Axios request configuration (optional)
 * @returns Promise with ApiResponse wrapper
 */
export const apiRequest = async <T>(
  method: Method,
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const response = await axios({
    method,
    url: `${basePath}${url}`,
    data,
    ...config,
  });
  return response.data;
};
