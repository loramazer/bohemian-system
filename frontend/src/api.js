import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const getProducts = async (params) => {
  try {

    const response = await apiClient.get('/api/produtos', { params });
    return response.data; 
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error.response ? error.response.data : error;
  }
};


export const getCategories = async () => {
  try {
    const response = await apiClient.get('/api/categorias');
    return response.data; 
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    throw error.response ? error.response.data : error;
  }
};

export default apiClient;