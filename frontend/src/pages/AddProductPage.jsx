// loramazer/bohemian-system/bohemian-system-refatorar-organizacao/frontend/src/pages/AddProductPage.jsx

import React, { useState, useEffect } from 'react';
import ProductForm from '../components/Admin/ProductForm.jsx'; 
import ImageUpload from '../components/Shared/ImageUpload.jsx';
import ContentWrapper from '../components/Shared/ContentWrapper.jsx';
import apiClient from '../api.js'; 

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/categorias'); 
        
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
    // Limpa o erro do campo assim que o usuário começa a digitar
    setFormErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleFileChange = (updater) => {
    setUploadedFiles(updater);
  };
  
  // Função de validação
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
    
    // CRÍTICO: Se a validação falhar, retorna sem fazer nada (sem alert)
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

      // Anexa todas as imagens
      if (uploadedFiles.length > 0) {
        uploadedFiles.forEach((fileWrapper) => {
          formDataToSend.append('imagens', fileWrapper.file); 
        });
      }

      const response = await apiClient.post('/produtos', formDataToSend, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });

      if (response.status !== 201) throw new Error('Erro ao salvar produto');
      
      const data = response.data;

      // Mantém um alerta para sucesso (opcional, pode ser trocado por um toast na aplicação real)
      alert('Produto criado com sucesso! ID: ' + data.produto.id_produto);

      // Limpar formulário após sucesso
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
      // Aqui você poderia definir um erro de servidor genérico no estado (opcional)
      alert('Erro ao salvar produto. Verifique o console.'); 
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