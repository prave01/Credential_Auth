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
      if (error.response.status === 401) {
        try {
          await axios.post(
            "http://localhost:8787/api/auth/refresh",
            {},
            { withCredentials: true },
          );
          return api(error?.config);
        } catch {
          router.push("/auth?target=login");
        }
      }
      return Promise.reject(error);
    },
  );
};

export default api;
