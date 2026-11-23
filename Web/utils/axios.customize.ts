import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // gửi/nhận HttpOnly Cookie chứa Refresh Token
});

// Request Interceptor
instance.interceptors.request.use(
  function (config) {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Response Interceptor
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh") 
    ) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data?.accessToken || res.data?.data?.accessToken;
        
        if (typeof window !== "undefined" && newAccessToken) {
          localStorage.setItem("access_token", newAccessToken);
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }
        return Promise.reject(refreshError);
      }
    }

    const backendError = error.response?.data || {
      message: "An unexpected error occurred",
      status: error.response?.status || 500,
      code: "UNKNOWN_ERROR",
    };
    return Promise.reject(backendError);
  }
);

export default instance;
