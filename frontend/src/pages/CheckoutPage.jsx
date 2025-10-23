// src/pages/CheckoutPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../api';
// 1. IMPORTAR O CSS DA PÁGINA
import '../styles/CheckoutPage.css';
// 2. IMPORTAR O NOVO COMPONENTE DE FORMULÁRIO
import AddressForm from '../components/Shared/AddressForm';

const CheckoutPage = () => {
    const { user } = useContext(AuthContext);
    const [deliveryOption, setDeliveryOption] = useState('retirada');
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const storeAddress = "Rua das Flores, 123, Centro, São Paulo - SP";

    const fetchAddresses = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/enderecos');
            setAddresses(response.data);
            if (response.data.length > 0) {
                // Se não houver um endereço selecionado E a entrega estiver ativa, seleciona o primeiro
                if (deliveryOption === 'entrega' && !selectedAddressId) {
                    setSelectedAddressId(response.data[0].id_endereco);
                }
            }
        } catch (error) {
            console.error("Erro ao buscar endereços:", error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (user) {
            fetchAddresses();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Função para salvar um novo endereço
    const handleSaveAddress = async (formData) => {
        // A lógica de 'await' já está dentro do AddressForm
        // Apenas precisamos que ele nos diga que terminou.
        await apiClient.post('/enderecos', formData);
        fetchAddresses(); // Atualiza a lista
        setShowAddForm(false); // Esconde o formulário
    };

    // Renderiza a lista de endereços do usuário
    const renderAddressList = () => {
        if (isLoading) {
            return <p>Carregando endereços...</p>;
        }

        if (addresses.length === 0) {
            return (
                <div className="address-notice">
                    <p>Você não possui nenhum endereço cadastrado.</p>
                </div>
            );
        }

        return (
            <div className="address-list">
                {addresses.map(addr => (
                    <div
                        key={addr.id_endereco}
                        className={`address-card ${selectedAddressId === addr.id_endereco ? 'selected' : ''}`}
                        onClick={() => setSelectedAddressId(addr.id_endereco)}
                    >
                        <strong>{addr.rua}, {addr.numero}</strong>
                        <p>{addr.bairro}, {addr.cidade} - {addr.estado}</p>
                        <p>CEP: {addr.cep}</p>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <main className="checkout-container">
            <h2>Como você prefere receber seu pedido?</h2>

            <div className="delivery-options">
                <button
                    className={deliveryOption === 'retirada' ? 'active' : ''}
                    onClick={() => setDeliveryOption('retirada')}
                >
                    Retirada na Loja
                </button>
                <button
                    className={deliveryOption === 'entrega' ? 'active' : ''}
                    onClick={() => setDeliveryOption('entrega')}
                >
                    Receber em Casa
                </button>
            </div>

            <div className="delivery-content">
                {deliveryOption === 'retirada' ? (
                    <div className="pickup-info">
                        <h3>Retirada Grátis</h3>
                        <p>Seu pedido estará disponível em nosso endereço:</p>
                        <strong>{storeAddress}</strong>
                        <p className="shipping-cost">Custo do Frete: <strong>Grátis</strong></p>
                    </div>
                ) : (
                    <div className="delivery-info">
                        <h3>Endereço de Entrega</h3>
                        {renderAddressList()}

                        {/* 3. SUBSTITUIR O BOTÃO ANTIGO E O PLACEHOLDER */}

                        {/* Se o formulário NÃO estiver visível, mostre o botão "Adicionar" */}
                        {!showAddForm && (
                            <button className="add-address-btn" onClick={() => setShowAddForm(true)}>
                                + Adicionar novo endereço
                            </button>
                        )}

                        {/* Se o formulário ESTIVER visível, renderize o componente */}
                        {showAddForm && (
                            <AddressForm
                                onSave={handleSaveAddress}
                                onCancel={() => setShowAddForm(false)}
                            />
                        )}

                        {/* REGRA: Só mostra o frete se um endereço estiver selecionado */}
                        {selectedAddressId && (
                            <div className="shipping-cost">
                                <p>Custo do Frete: <strong>R$ 15,00 (Simulado)</strong></p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* (O Resumo do Pedido e o botão de "Ir para Pagamento" viriam aqui) */}
        </main>
    );
};

export default CheckoutPage;