import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ContentWrapper from '../components/Shared/ContentWrapper.jsx';
import AddressForm from '../components/Shared/AddressForm.jsx'; 
import apiClient from '../api.js';
import { AuthContext } from '../context/AuthContext.jsx';
import { FeedbackContext } from '../context/FeedbackContext.jsx';
import { FaTrash } from 'react-icons/fa';

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

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);

    useEffect(() => {
        if (authLoading) return; 
        if (!user) {
            navigate('/api/login'); 
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

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.put('/api/usuario/me', {
                nome: formData.nome,
                email: formData.email,
                telefone: formData.telefone,
            });
            showToast('Dados atualizados com sucesso!', 'success');
            setFormData(prev => ({ ...prev, nome: response.data.usuario.nome }));
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            showToast(error.response?.data?.message || 'Erro ao atualizar dados.', 'warning');
        }
    };

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
            setPasswordData({ senhaAtual: '', novaSenha: '' }); 
        } catch (error) {
            console.error("Erro ao alterar senha:", error);
            showToast(error.response?.data?.message || 'Erro ao alterar senha.', 'warning');
        }
    };

    const handleSaveAddress = async (newAddressData) => {
        try {
            await apiClient.post('/api/enderecos', newAddressData);
            showToast('Endereço salvo com sucesso!', 'success');
            setShowAddForm(false);
            const response = await apiClient.get('/api/usuario/me');
            setAddresses(response.data.enderecos || []);
        } catch (error) {
            console.error("Erro ao salvar endereço:", error);
            showToast(error.response?.data?.message || 'Erro ao salvar endereço.', 'warning');
        }
    };

    const handleAskDeleteAddress = (addressId) => {
        setAddressToDelete(addressId); 
        setShowDeleteModal(true);    
    };

    const handleConfirmDelete = async () => {
        if (!addressToDelete) return;

        try {
            const response = await apiClient.delete(`/api/enderecos/${addressToDelete}`);
            setAddresses(response.data.enderecos || []); 
            showToast('Endereço removido.', 'trash-removed'); 
        } catch (error) {
            console.error("Erro ao remover endereço:", error);
            showToast(error.response?.data?.message || 'Erro ao remover endereço.', 'warning');
        } finally {
            setShowDeleteModal(false); 
            setAddressToDelete(null);  
        }
    };
    

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setAddressToDelete(null);
    };


    if (loadingData || authLoading) {
        return <ContentWrapper><div>Carregando...</div></ContentWrapper>;
    }

    return (
        <ContentWrapper>
            {}
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
                    {}
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

                        {}
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

                    {}
                    <div className="account-card">
                        <h2>Meus Endereços</h2>
                        
                        <div className="address-list-account">
                            {addresses.length === 0 && !showAddForm && (
                                <p>Nenhum endereço cadastrado.</p>
                            )}
                            {addresses.map(addr => (
                                <div key={addr.id_endereco} className="address-card-account">
                                    <div className="address-card-header">
                                        {}
                                        <strong>{addr.rua}, {addr.numero}</strong>
                                        <button 
                                            onClick={() => handleAskDeleteAddress(addr.id_endereco)}
                                            className="address-delete-btn"
                                            title="Excluir endereço"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                    {}
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