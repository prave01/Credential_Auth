import axios from "axios";
import { useRouter } from "next/navigation";

const api = axios.create({
  baseURL: "http://localhost:8787/api",
  withCredentials: true,
});

export const attachInterceptor = (router: ReturnType<typeof useRouter>) => {
  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // mark as retried

        try {
          // Call refresh endpoint
          await axios.post(
            "http://localhost:8787/api/auth/refresh",
            {},
            { withCredentials: true },
          );

          // Retry original request
          return api(originalRequest);
        } catch (err) {
          console.log("No refresh token found");
          router.push("/auth?target=login");
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    },
  );
};

export default api;
