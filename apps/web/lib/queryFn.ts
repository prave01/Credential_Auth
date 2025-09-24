import axios from "axios";

const SignupFn = async (payload: {
  email: string;
  userName: string;
  password: string;
}) => {
  const { data } = await axios.get("http://localhost:8787/api/auth/csrf", {
    withCredentials: true,
  });

  const response = await axios.post(
    "http://localhost:8787/api/auth/callback/credentials",
    {
      ...payload,
      csrfToken: data.csrfToken,
    },
    {
      withCredentials: true,
    },
  );

  return response;
};

export { SignupFn };
