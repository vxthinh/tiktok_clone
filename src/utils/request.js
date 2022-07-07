import axios from 'axios';

const request = axios.create({
  baseURL: 'https://tiktok.fullstack.edu.vn/api/',
});

export const get = async (path, optional = {}) => {
  const response = await request.get(path, optional);
  return response.data;
};
export default request;
