import axios from "axios";
import { redirect } from "next/navigation";

const API_BASE = "http://localhost:8787/api/auth";

const getCsrfToken = async (): Promise<string> => {
  const existing = localStorage.getItem("authjs.csrf-token");

  if (existing) {
    return existing;
  }

  const { data } = await axios.get(`${API_BASE}/csrf`, {
    withCredentials: true,
  });

  localStorage.setItem("authjs.csrf-token", data.csrfToken);

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

  const response = await axios.post(
    "http://localhost:8787/api/auth/callback/credentials",
    {
      email: payload.email,
      password: payload.password,
      csrfToken: data,
    },
    {
      withCredentials: true,
    },
  );

  return response;
};

// Get user session
const GetUserSession = async () => {
  const response = await axios.get("http://localhost:8787/api/protected", {
    withCredentials: true,
  });

  return response;
};

export { SignupFn, SigninFn, GetUserSession };
