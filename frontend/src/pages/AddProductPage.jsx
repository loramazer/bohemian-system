import React, { useState, useEffect, useContext } from 'react'; 
import ProductForm from '../components/Admin/ProductForm.jsx'; 
import ImageUpload from '../components/Shared/ImageUpload.jsx';
import ContentWrapper from '../components/Shared/ContentWrapper.jsx';
import apiClient from '../api.js'; 
import { FeedbackContext } from '../context/FeedbackContext.jsx'; 

import '../styles/AddProductPage.css';

const AddProductPage = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    categoria: '',
    precoRegular: '',
    precoPromocao: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({}); 
  
  const { showToast } = useContext(FeedbackContext);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/api/categorias'); 
        
        const data = response.data;
        
        if (!response.status === 200) throw new Error('Erro ao buscar categorias');
        
        setCategories(data); 
      } catch (err) {
        setError(err.message);
        console.error('Erro ao buscar categorias:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleFileChange = (updater) => {
    setUploadedFiles(updater);
  };
  
  const validateForm = () => {
    const errors = {};
    if (!formData.nome.trim()) errors.nome = 'O Nome do Produto é obrigatório.';
    if (!formData.descricao.trim()) errors.descricao = 'A Descrição é obrigatória.';
    if (!formData.categoria.trim()) errors.categoria = 'A Categoria é obrigatória.';
    if (!formData.precoRegular.trim()) errors.precoRegular = 'O Preço Regular é obrigatório.';
    if (uploadedFiles.length === 0) errors.imagens = 'É obrigatório enviar pelo menos 1 imagem.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return; 
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nome', formData.nome);
      formDataToSend.append('descricao', formData.descricao);
      formDataToSend.append('status', 'ativo'); 
      formDataToSend.append('preco_venda', formData.precoRegular);
      formDataToSend.append('categoria', formData.categoria);

      if (uploadedFiles.length > 0) {
        uploadedFiles.forEach((fileWrapper) => {
          formDataToSend.append('imagens', fileWrapper.file); 
        });
      }

      const response = await apiClient.post('/api/produtos', formDataToSend, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });

      if (response.status !== 201) throw new Error('Erro ao salvar produto');

      showToast('Produto criado com sucesso!', 'success');

      setFormData({
        nome: '',
        descricao: '',
        categoria: '',
        precoRegular: '',
        precoPromocao: ''
      });
      setUploadedFiles([]);
      setFormErrors({});

    } catch (err) {
      console.error('Erro ao salvar produto:', err);
      
      const errorMsg = err.response?.data?.message || 'Erro ao salvar produto. Tente novamente.';
      showToast(errorMsg, 'wishlist-removed');
    }
  };

  if (loading) return <p>Carregando categorias...</p>;
  if (error) return <p>Erro ao carregar categorias: {error}</p>;

  return (
    <ContentWrapper>
      <main className="add-product-page">
        <h2 className="page-title">Adicionar Novo Produto</h2>
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-main">
            <ProductForm
              categories={categories}
              formData={formData}
              onFormChange={handleFormChange}
              formErrors={formErrors}
            />
            <div className="upload-container">
              <ImageUpload
                uploadedFiles={uploadedFiles}
                onFileChange={handleFileChange}
                error={formErrors.imagens} 
              />
              <div className="upload-buttons">
                <button type="submit" className="save-btn">
                  Salvar Produto
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setFormData({
                      nome: '',
                      descricao: '',
                      categoria: '',
                      precoRegular: '',
                      precoPromocao: ''
                    });
                    setUploadedFiles([]);
                    setFormErrors({}); 
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </ContentWrapper>
  );
};

export default AddProductPage;