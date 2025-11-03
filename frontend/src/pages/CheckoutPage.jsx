import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import apiClient from '../api';
import '../styles/CheckoutPage.css';
import AddressForm from '../components//Shared/AddressForm';


const CheckoutPage = () => {
    const { user } = useContext(AuthContext);

    const { cartItems, loading: loadingCart } = useContext(CartContext);

    const [isCreatingPreference, setIsCreatingPreference] = useState(false);
    const [paymentError, setPaymentError] = useState('');

    const [deliveryOption, setDeliveryOption] = useState('retirada');
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const storeAddress = "R. Mal. Deodoro da Fonseca, 51 - Centro - Ponta Grossa, PR";

    const fetchAddresses = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/api/enderecos');
            setAddresses(response.data);
            if (response.data.length > 0 && !selectedAddressId) {
                setSelectedAddressId(response.data[0].id_endereco);
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
    }, [user]);

    const handleSaveAddress = async (formData) => {
        await apiClient.post('/api/enderecos', formData);
        fetchAddresses();
        setShowAddForm(false);
    };

    const renderAddressList = () => {
        if (isLoading) return <p>Carregando endereços...</p>;
        if (addresses.length === 0) return <div className="address-notice"><p>Você não possui nenhum endereço cadastrado.</p></div>;

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

    const subtotal = cartItems.reduce((acc, item) => acc + item.preco_unitario * item.quantidade, 0);

    const shippingCost = deliveryOption === 'retirada' ? 0 : 15.00;

    const total = subtotal + shippingCost;

    const handleGoToPayment = async () => {
        setPaymentError('');

        if (deliveryOption === 'entrega' && !selectedAddressId) {
            setPaymentError('Por favor, selecione um endereço de entrega...');
            return;
        }
        if (cartItems.length === 0) { /* ... */ }

        if (!user || !user.id) {
            setPaymentError('Erro: Usuário não autenticado.');
            return;
        }

        setIsCreatingPreference(true);
        try {
            const enderecoParaSalvar = deliveryOption === 'retirada' ? null : selectedAddressId;

            const response = await apiClient.post('/api/pagamentos/criar-preferencia', {
                cartItems: cartItems,
                shippingCost: shippingCost,
                deliveryOption: deliveryOption,
                selectedAddressId: enderecoParaSalvar, 
                clienteId: user.id, 
            });

            if (response.data.init_point) {

                window.location.href = response.data.init_point;
            }

        } catch (error) {
            console.error("Erro ao criar preferência:", error);
            setPaymentError('Não foi possível iniciar o pagamento. Tente novamente.');
        } finally {
            setIsCreatingPreference(false);
        }
    };


    return (
        <div className="checkout-page-grid">

            {}
            <main className="checkout-container">
                <h2>Como você prefere receber seu pedido?</h2>
                <div className="delivery-options">
                    {}
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
                            <strong>{storeAddress}</strong>
                        </div>
                    ) : (
                        <div className="delivery-info">
                            <h3>Endereço de Entrega</h3>
                            {renderAddressList()}
                            {!showAddForm && (
                                <button className="add-address-btn" onClick={() => setShowAddForm(true)}>
                                    + Adicionar novo endereço
                                </button>
                            )}
                            {showAddForm && (
                                <AddressForm
                                    onSave={handleSaveAddress}
                                    onCancel={() => setShowAddForm(false)}
                                />
                            )}
                        </div>
                    )}
                </div>
            </main>

            {}
            <aside className="checkout-summary-container">
                <h3>Resumo do Pedido</h3>

                {loadingCart ? (
                    <p>Carregando carrinho...</p>
                ) : (
                    <div className="summary-details">
                        {cartItems.map(item => (
                            <div className="summary-item" key={item.id_item_carrinho}>
                                <span className="item-name">{item.quantidade}x {item.nome}</span>
                                <span className="item-price">R$ {(item.preco_unitario * item.quantidade).toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="summary-line">
                            <span>Subtotal</span>
                            <span>R$ {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-line">
                            <span>Frete</span>
                            <span>{shippingCost === 0 ? 'Grátis' : `R$ ${shippingCost.toFixed(2)}`}</span>
                        </div>
                        <div className="summary-line total">
                            <span>Total</span>
                            <span>R$ {total.toFixed(2)}</span>
                        </div>
                    </div>
                )}

                {}
                <button
                    className="payment-btn"
                    onClick={handleGoToPayment}
                    disabled={loadingCart || isCreatingPreference}
                >
                    {isCreatingPreference ? 'Processando...' : 'Ir para Pagamento'}
                </button>

                {paymentError && (
                    <p className="payment-error">{paymentError}</p>
                )}
            </aside>
        </div>
    );
};

export default CheckoutPage;