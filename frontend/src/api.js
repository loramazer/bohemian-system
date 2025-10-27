// frontend/src/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Lê a URL do backend (http://localhost:3000) do arquivo .env
});

// Adiciona um interceptor para incluir o token de autenticação em todas as requisições
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Pega o token salvo no login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- NOVO CÓDIGO ADICIONADO ---

/**
 * Busca os produtos da API com base nos filtros e paginação.
 * @param {object} params - Objeto com os parâmetros da query (page, limit, categories, sort, maxPrice, search)
 * @returns {Promise<object>} - Os dados da resposta (ex: { products: [], pages: 0, totalProducts: 0 })
 */
export const getProducts = async (params) => {
  try {
    // O Axios transforma o objeto 'params' em query string
    // ex: /produtos?page=1&limit=9&sort=price_asc
    const response = await apiClient.get('/produtos', { params });
    return response.data; // Retorna os dados da resposta (ex: { products: [...], pages: 5 })
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    // Lança o erro para que o CatalogPage.jsx possa tratá-lo
    throw error.response ? error.response.data : error;
  }
};

/**
 * Busca todas as categorias da API.
 * @returns {Promise<Array>} - Um array de objetos de categoria
 */
export const getCategories = async () => {
  try {
    const response = await apiClient.get('/categorias');
    return response.data; // Retorna o array de categorias
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    throw error.response ? error.response.data : error;
  }
};

// --- FIM DO NOVO CÓDIGO ---

// A exportação default do apiClient continua aqui
export default apiClient;

// A chave '}' extra que estava aqui foi removida.