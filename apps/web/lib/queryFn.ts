import { useAxios } from "@/app/hooks/useAxios";
import axios from "axios";

const API_BASE = "http://localhost:8787/api/auth";

const getCsrfToken = async (): Promise<string> => {
  // const existing = localStorage.getItem("authjs.csrf-token");
  //
  // if (existing) {
  //   return existing;
  // }
  //
  const { data } = await axios.get(`${API_BASE}/csrf`, {
    withCredentials: true,
  });

  localStorage.setItem("authjs.csrf-token", data);

  return data.csrfToken;
};

// Signup
const SignupFn = async (payload: {
  email: string;
  userName: string;
  password: string;
}) => {
  if (!payload.email || !payload.userName || !payload.password) {
    throw new Error("Invalid Credentials");
  }

  const csrfToken = await getCsrfToken();

  const response = await axios.post(
    `${API_BASE}/signup`,
    {
      ...payload,
      csrfToken,
    },
    {
      withCredentials: true,
      params: { redirect: false },
    },
  );

  return response;
};

// Signin
const SigninFn = async (payload: { email: string; password: string }) => {
  const data = await getCsrfToken();

  const loginResponse = await axios
    .post(
      "http://localhost:8787/api/auth/callback/credentials",
      {
        csrfToken: data,
        email: payload.email,
        password: payload.password,
      },
      { withCredentials: true },
    )
    .then(async (res) => {
      if (res?.request?.responseURL !== undefined) {
        const errorUrl = res?.request?.responseURL;
        if (String(errorUrl).includes("code")) {
          const error = String(errorUrl).toString().split("code=")[1] || null;
          if (error !== undefined || error !== null) {
            throw new Error(error?.toString().split("+").join(" "));
          }
        }
      }

      // create refresh-token
      await axios("http://localhost:8787/api/auth/generate-refreshtoken", {
        withCredentials: true,
      });
    })
    .catch((err) => {
      throw new Error(err);
    });

  return loginResponse;
};

// Signout
const SignoutFn = async () => {
  const data = await getCsrfToken();

  const response = await axios.post(
    `${API_BASE}/signout`,
    {
      csrfToken: data,
    },
    {
      withCredentials: true,
    },
  );

  return response;
};

// Get user session
const GetUserSession = async (api: ReturnType<typeof useAxios>) => {
  const response = await api("/protected");

  return response;
};

export { SignupFn, SigninFn, GetUserSession, SignoutFn };
