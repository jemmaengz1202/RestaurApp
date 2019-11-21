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

export async function uploadImage(imageFormData: FormData) {
  const res = await axiosInstance({
    url: "/attachments/images/upload",
    method: "POST",
    data: imageFormData,
    headers: { "Content-Type": "multipart/form-data" }
  });
  const imageName = res.data.result.files.file[0].name;
  return `${API_URL}/attachments/images/download/${imageName}`;
}
