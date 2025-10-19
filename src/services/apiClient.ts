import axios from "axios";
import { AppConfig } from "../config";

const apiClient = axios.create({
  baseURL: AppConfig.BACKEND_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response && error.response.status === 401) {
      const returnUrl = window.location.href;
      const loginUrl = `${
        AppConfig.LOGIN_PAGE_URL
      }?returnUrl=${encodeURIComponent(returnUrl)}`;

      window.location.href = loginUrl;
    }

    return Promise.reject(error);
  }
);

export default apiClient;
