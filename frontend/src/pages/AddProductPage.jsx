import React, { useState, useEffect } from 'react';
import ProductForm from '../components/Admin/ProductForm.jsx'; 
import ImageUpload from '../components/Shared/ImageUpload.jsx';
import ContentWrapper from '../components/Shared/ContentWrapper.jsx';
import apiClient from '../api.js'; // ⬅️ NOVO: Importar o cliente Axios

import '../styles/AddProductPage.css';

const AddProductPage = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    categoria: '',
    cores: ['', '', ''],
    precoRegular: '',
    precoPromocao: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/categorias'); 
        
        const data = response.data;
        
        if (!response.status === 200) throw new Error('Erro ao buscar categorias');
        
        setCategories(data); 
      } catch (err) {
        // Captura o erro do Axios
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
  };

  const handleColorChange = (e, index) => {
    const newColors = [...formData.cores];
    newColors[index] = e.target.value;
    setFormData(prev => ({ ...prev, cores: newColors }));
  };

  const handleFileChange = (updater) => {
    setUploadedFiles(updater);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nome', formData.nome);
      formDataToSend.append('descricao', formData.descricao);
      formDataToSend.append('status', 'ativo'); 
      formDataToSend.append('preco_venda', formData.precoRegular);
      
      formDataToSend.append('categoria', formData.categoria);

      if (uploadedFiles.length > 0) {
        formDataToSend.append('imagem', uploadedFiles[0].file); 
      }

      const response = await apiClient.post('/produtos', formDataToSend, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });

      if (response.status !== 201) throw new Error('Erro ao salvar produto');
      
      const data = response.data;

      alert('Produto criado com sucesso! ID: ' + data.produto.id_produto);

      setFormData({
        nome: '',
        descricao: '',
        categoria: '',
        cores: ['', '', ''],
        precoRegular: '',
        precoPromocao: ''
      });
      setUploadedFiles([]);

    } catch (err) {
      console.error('Erro ao salvar produto:', err);
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
              onColorChange={handleColorChange}
            />
            <div className="upload-container">
              <ImageUpload
                uploadedFiles={uploadedFiles}
                onFileChange={handleFileChange}
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
                      cores: ['', '', ''],
                      precoRegular: '',
                      precoPromocao: ''
                    });
                    setUploadedFiles([]);
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