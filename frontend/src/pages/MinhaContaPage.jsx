// frontend/src/pages/MinhaContaPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ContentWrapper from '../components/Shared/ContentWrapper.jsx';
import AddressForm from '../components/Shared/AddressForm.jsx'; // Reutilizamos o formulário
import apiClient from '../api.js';
import { AuthContext } from '../context/AuthContext.jsx';
import { FeedbackContext } from '../context/FeedbackContext.jsx';
import { FaTrash } from 'react-icons/fa';

// --- NOVO: Importar o modal de confirmação ---
import ConfirmationModal from '../components/Shared/ConfirmationModal.jsx'; 
import '../styles/MinhaContaPage.css'; 

const MinhaContaPage = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const { showToast } = useContext(FeedbackContext);
    const navigate = useNavigate();

    const [loadingData, setLoadingData] = useState(true);
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
    });
    const [passwordData, setPasswordData] = useState({
        senhaAtual: '',
        novaSenha: '',
    });
    const [addresses, setAddresses] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);

    // --- NOVO: State para controlar o modal de exclusão ---
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);
    // --- FIM NOVO ---

    // Efeito para buscar dados do perfil ao carregar a página
    useEffect(() => {
        if (authLoading) return; // Espera a autenticação verificar
        if (!user) {
            navigate('/api/login'); // Redireciona se não estiver logado
            return;
        }

        const fetchProfile = async () => {
            try {
                setLoadingData(true);
                const response = await apiClient.get('/api/usuario/me');
                const { nome, login, telefone, enderecos } = response.data;
                setFormData({ nome, email: login, telefone: telefone || '' });
                setAddresses(enderecos || []);
            } catch (error) {
                console.error("Erro ao buscar perfil:", error);
                showToast('Erro ao carregar seus dados.', 'warning');
            } finally {
                setLoadingData(false);
            }
        };

        fetchProfile();
    }, [user, authLoading, navigate, showToast]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    // Salva dados pessoais (nome, email, telefone)
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.put('/api/usuario/me', {
                nome: formData.nome,
                email: formData.email,
                telefone: formData.telefone,
            });
            showToast('Dados atualizados com sucesso!', 'success');
            // Atualiza o nome no formData (caso o token JWT demore para atualizar)
            setFormData(prev => ({ ...prev, nome: response.data.usuario.nome }));
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            showToast(error.response?.data?.message || 'Erro ao atualizar dados.', 'warning');
        }
    };

    // Salva a nova senha
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!passwordData.senhaAtual || !passwordData.novaSenha) {
            showToast('Preencha a senha atual e a nova senha.', 'warning');
            return;
        }
        try {
            await apiClient.put('/usuario/me', {
                senhaAtual: passwordData.senhaAtual,
                novaSenha: passwordData.novaSenha,
            });
            showToast('Senha alterada com sucesso!', 'success');
            setPasswordData({ senhaAtual: '', novaSenha: '' }); // Limpa os campos
        } catch (error) {
            console.error("Erro ao alterar senha:", error);
            showToast(error.response?.data?.message || 'Erro ao alterar senha.', 'warning');
        }
    };

    // Salva um novo endereço (reutilizando o controller existente)
    const handleSaveAddress = async (newAddressData) => {
        try {
            await apiClient.post('/api/enderecos', newAddressData);
            showToast('Endereço salvo com sucesso!', 'success');
            setShowAddForm(false);
            // Re-busca os dados para atualizar a lista
            const response = await apiClient.get('/api/usuario/me');
            setAddresses(response.data.enderecos || []);
        } catch (error) {
            console.error("Erro ao salvar endereço:", error);
            showToast(error.response?.data?.message || 'Erro ao salvar endereço.', 'warning');
        }
    };

    // --- MUDANÇA: Abre o modal de confirmação ---
    const handleAskDeleteAddress = (addressId) => {
        setAddressToDelete(addressId); // Salva o ID do endereço que queremos deletar
        setShowDeleteModal(true);      // Abre o modal
    };

    // --- NOVO: Função que o modal chama ao confirmar ---
    const handleConfirmDelete = async () => {
        if (!addressToDelete) return;

        try {
            const response = await apiClient.delete(`/api/enderecos/${addressToDelete}`);
            setAddresses(response.data.enderecos || []); // Atualiza a lista
            showToast('Endereço removido.', 'trash-removed'); // Toast cinza com ícone de lixeira
        } catch (error) {
            console.error("Erro ao remover endereço:", error);
            showToast(error.response?.data?.message || 'Erro ao remover endereço.', 'warning');
        } finally {
            setShowDeleteModal(false); // Fecha o modal
            setAddressToDelete(null);  // Limpa o ID
        }
    };
    
    // --- NOVO: Função para fechar o modal ---
    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setAddressToDelete(null);
    };


    if (loadingData || authLoading) {
        return <ContentWrapper><div>Carregando...</div></ContentWrapper>;
    }

    return (
        <ContentWrapper>
            {/* --- NOVO: Renderiza o modal se showDeleteModal for true --- */}
            {showDeleteModal && (
                <ConfirmationModal
                    title="Excluir Endereço"
                    message="Tem certeza que deseja excluir este endereço? Esta ação não pode ser desfeita."
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    confirmText="Sim, Excluir"
                />
            )}

            <main className="account-main-content">
                <div className="account-breadcrumbs">
                    <Link to="/">Home</Link> &gt; <span>Minha Conta</span>
                </div>
                
                <div className="account-container">
                    {/* Card de Dados Pessoais */}
                    <div className="account-card">
                        <h2>Meus Dados</h2>
                        <form className="account-form" onSubmit={handleProfileSubmit}>
                            <div className="form-group">
                                <label htmlFor="nome">Nome Completo</label>
                                <input
                                    type="text"
                                    id="nome"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">E-mail (Login)</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="telefone">Telefone</label>
                                <input
                                    type="tel"
                                    id="telefone"
                                    name="telefone"
                                    value={formData.telefone}
                                    onChange={handleFormChange}
                                    placeholder="(XX) XXXXX-XXXX"
                                />
                            </div>
                            <button type="submit" className="save-btn">Salvar Alterações</button>
                        </form>

                        {/* Seção de Alterar Senha */}
                        <div className="password-change-section">
                            <h3>Alterar Senha</h3>
                            <form className="account-form" onSubmit={handlePasswordSubmit}>
                                <div className="form-group">
                                    <label htmlFor="senhaAtual">Senha Atual</label>
                                    <input
                                        type="password"
                                        id="senhaAtual"
                                        name="senhaAtual"
                                        value={passwordData.senhaAtual}
                                        onChange={handlePasswordChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="novaSenha">Nova Senha</label>
                                    <input
                                        type="password"
                                        id="novaSenha"
                                        name="novaSenha"
                                        value={passwordData.novaSenha}
                                        onChange={handlePasswordChange}
                                    />
                                </div>
                                <button type="submit" className="save-btn">Alterar Senha</button>
                            </form>
                        </div>
                    </div>

                    {/* Card de Endereços */}
                    <div className="account-card">
                        <h2>Meus Endereços</h2>
                        
                        <div className="address-list-account">
                            {addresses.length === 0 && !showAddForm && (
                                <p>Nenhum endereço cadastrado.</p>
                            )}
                            {addresses.map(addr => (
                                <div key={addr.id_endereco} className="address-card-account">
                                    <div className="address-card-header">
                                        {/* CORREÇÃO: Mostra 'rua' (que vem traduzido do alias do DB) */}
                                        <strong>{addr.rua}, {addr.numero}</strong>
                                        <button 
                                            // --- MUDANÇA: Chama a função que abre o modal ---
                                            onClick={() => handleAskDeleteAddress(addr.id_endereco)}
                                            className="address-delete-btn"
                                            title="Excluir endereço"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                    {/* CORREÇÃO: Mostra 'cidade' e 'estado' */}
                                    <p>{addr.cidade} - {addr.estado}</p>
                                    <p>CEP: {addr.cep}</p>
                                </div>
                            ))}
                        </div>

                        {showAddForm ? (
                            <AddressForm
                                onSave={handleSaveAddress}
                                onCancel={() => setShowAddForm(false)}
                            />
                        ) : (
                            <button className="add-address-btn-account" onClick={() => setShowAddForm(true)}>
                                + Adicionar Novo Endereço
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </ContentWrapper>
    );
};

export default MinhaContaPage;