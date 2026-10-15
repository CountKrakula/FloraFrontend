import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
export const get = async <T>(url: string): Promise<T> => {
    const response = await api.get<T>(url);
    return response.data;
  },
  post = async <T>(url: string, data: unknown): Promise<T> => {
    const response = await api.post<T>(url, data);
    return response.data;
  },
  put = async <T>(url: string, data: unknown): Promise<T> => {
    const response = await api.put<T>(url, data);
    return response.data;
  },
  del = async <T>(url: string): Promise<T> => {
    const response = await api.delete<T>(url);
    return response.data;
  };
