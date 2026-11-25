import axios from "axios";
import { getSession } from "next-auth/react";
import { API_BASE } from "./config";

export let api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use(async (config) => {
  let session = await getSession();
  if (session?.apiToken) config.headers.set("token", session.apiToken);
  return config;
});

export let apiError = (e: unknown, fallback = "Something went wrong. Please try again.") =>
  axios.isAxiosError(e) ? (e.response?.data?.message as string) ?? fallback : fallback;
