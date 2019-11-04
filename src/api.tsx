import axios from 'axios';
import Usuario from './types/usuario';

export const API_URL = 'http://localhost:3000/api';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export async function getUser() {
  return await axiosInstance.request<Usuario>({
    url: '/usuarios/whoami',
    method: 'GET',
  });
};