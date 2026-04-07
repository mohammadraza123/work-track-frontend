import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const addLeave = async (body: {
  reason: string;
  startDate: string;
  endDate: string;
}) => {
  const res = await api.post("leave/add", body);
  return res.data;
};

export const getAllLeaves = async () => {
  const res = await api.get("leave/");
  return res.data;
};

export const getLeaveById = async ({ id }: { id: string }) => {
  return axios.get(`leave/${id}`);
};