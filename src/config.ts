const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:7111";

export const AppConfig = {
  BACKEND_URL: backendUrl,
  ABOUT_PAGE_URL: `${backendUrl}/About`,
  LOGIN_PAGE_URL: `${backendUrl}/Login`,

  INFO_PAGE_URL: (id: string) => `${backendUrl}/Info/${id}`,

  SHORT_URL_REDIRECT: (shortCode: string) => `${backendUrl}/${shortCode}`,

  API: {
    URLS: "/api/v1/urls",
    AUTH_ME: "/api/v1/auth/me",
    DELETE_URL: (id: string) => `/api/v1/urls/${id}`,
  },
};
