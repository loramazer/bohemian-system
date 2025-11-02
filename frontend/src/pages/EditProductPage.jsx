// loramazer/bohemian-system/bohemian-system-refatorar-organizacao/frontend/src/pages/EditProductPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProductForm from '../components/Admin/ProductForm.jsx'; 
import ImageUpload from '../components/Shared/ImageUpload.jsx';
import ContentWrapper from '../components/Shared/ContentWrapper.jsx';
import apiClient from '../api.js'; 
import { FeedbackContext } from '../context/FeedbackContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';

// Reutiliza o CSS da página de Adicionar
import '../styles/AddProductPage.css';

const EditProductPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useContext(AuthContext);
    const { showToast } = useContext(FeedbackContext);

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

    // 1. Buscar dados
    useEffect(() => {
        if (authLoading) return;
        if (!user || user.admin !== 1) {
            navigate('/');
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                // Busca de Categorias (sem /api/, pois apiClient já o tem)
                const catResponse = await apiClient.get('/categorias');
                setCategories(catResponse.data);

                // Busca do Produto (sem /api/, pois apiClient já o tem)
                const prodResponse = await apiClient.get(`/produtos/${productId}`);
                const product = prodResponse.data;

                setFormData({
                    nome: product.nome,
                    descricao: product.descricao,
                    categoria: '', // A API /produtos/:id precisa retornar a categoria
                    precoRegular: product.preco_venda,
                    precoPromocao: product.preco_promocao || ''
                });
                
                try {
                    const imageUrls = JSON.parse(product.imagem_url || '[]');
                    if (Array.isArray(imageUrls)) {
                        setUploadedFiles(imageUrls.map(url => ({
                            file: null,
                            name: url.split('/').pop(),
                            url: url,
                            status: 'completed'
                        })));
                    }
                } catch (e) {
                    console.warn("Produto com formato de imagem legado (string única)"); // Este é o log que você vê
                    if (product.imagem_url) {
                         setUploadedFiles([{
                            file: null,
                            name: product.imagem_url.split('/').pop(),
                            url: product.imagem_url,
                            status: 'completed'
                        }]);
                    }
                }

            } catch (err) {
                setError(err.message);
                console.error('Erro ao carregar dados para edição:', err);
                showToast('Erro ao carregar dados do produto.', 'warning');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [productId, user, authLoading, navigate, showToast]);


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
        if (!formData.categoria.trim()) errors.categoria = 'A Categoria é obrigatória (selecione novamente).';
        if (!formData.precoRegular.trim()) errors.precoRegular = 'O Preço Regular é obrigatório.';
        if (uploadedFiles.length === 0) errors.imagens = 'É obrigatório ter pelo menos 1 imagem.';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // 2. HandleSubmit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('nome', formData.nome);
            formDataToSend.append('descricao', formData.descricao);
            formDataToSend.append('status', 'ativo'); 
            formDataToSend.append('preco_venda', formData.precoRegular);
            formDataToSend.append('categoria', formData.categoria);
            
            uploadedFiles.forEach(fileWrapper => {
                if (fileWrapper.file) {
                    formDataToSend.append('imagens', fileWrapper.file);
                } else {
                    formDataToSend.append('imagens', fileWrapper.url);
                }
            });

            // --- CORREÇÃO AQUI ---
            // Removemos o prefixo /api/ da chamada
            // ANTES: const response = await apiClient.put(`/api/produtos/${productId}`, formDataToSend, {
            // DEPOIS:
            const response = await apiClient.put(`/produtos/${productId}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status !== 200) throw new Error('Erro ao atualizar produto');
            
            showToast('Produto atualizado com sucesso!', 'success');
            navigate('/admin/products'); 

        } catch (err) {
            console.error('Erro ao atualizar produto:', err); // Este é o log que você vê
            const errorMsg = err.response?.data?.message || 'Erro ao salvar. Tente novamente.';
            showToast(errorMsg, 'warning');
        }
    };

    if (loading) return <ContentWrapper><p>Carregando produto...</p></ContentWrapper>;
    if (error) return <ContentWrapper><p>Erro: {error}</p></ContentWrapper>;

    return (
        <ContentWrapper>
            <div className="add-product-page"> 
                
                <div className="admin-breadcrumbs" style={{ marginBottom: '10px' }}>
                    <Link to="/dashboard">Painel</Link> &gt; <Link to="/admin/products">Produtos</Link> &gt; <span>Editar Produto</span>
                </div>
                
                <h2 className="page-title">Editar Produto</h2>
                
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
                                    Salvar Alterações
                                </button>
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => navigate('/admin/products')}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </ContentWrapper>
    );
};

export default EditProductPage;