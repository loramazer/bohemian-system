// loramazer/bohemian-system/bohemian-system-refatorar-organizacao/frontend/src/pages/UserOrderPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ContentWrapper from '../components/Shared/ContentWrapper.jsx';
import apiClient from '../api.js'; 
import { AuthContext } from '../context/AuthContext.jsx';
import '../styles/UserOrderPage.css'; 

// --- FUNÇÕES DE STATUS ---

// FUNÇÃO 1: Formata o status do PAGAMENTO (Vem da forma_pagamento)
const formatPaymentStatus = (status) => {
    if (!status) return 'Indefinido';
    
    const statusMap = {
        'pending': 'Pendente',
        'approved': 'Aprovado',
        'in_process': 'Em Processamento',
        'authorized': 'Autorizado',
        'delivered': 'Entregue',     
        'cancelled': 'Cancelado',
        'rejected': 'Rejeitado'
    };

    return statusMap[status.toLowerCase()] || status.charAt(0).toUpperCase() + status.slice(1);
};

// FUNÇÃO 2: Formata o status do PEDIDO (Vem do pedido)
const formatOrderStatus = (status) => {
    return status || 'Indefinido';
};

// FUNÇÃO 3: Mapeia o Status do Pedido para uma classe CSS
const getOrderStatusClass = (status) => {
    if (!status) return 'indefinido';
    const s = status.toLowerCase();
    
    // Mapeia seus status logísticos para as classes de estilo existentes
    if (s === 'em preparação') return 'in-process'; 
    if (s === 'pendente') return 'pending'; 
    if (s === 'cancelado') return 'cancelled'; 
    if (s === 'enviado') return 'authorized'; 
    if (s === 'entregue') return 'approved'; 
    
    return 'indefinido'; // Fallback
};

// Componente para o Detalhe da Compra (Renderiza dados reais)
const PurchaseDetail = ({ order, onProductClick }) => {
    
    const address = `${order.rua}, ${order.numero}${order.complemento ? ' - ' + order.complemento : ''}, ${order.cidade}/${order.estado}`;

    // Define o frete fixo
    const frete = 15.00;
    // Calcula o total real
    const totalComFrete = parseFloat(order.total_pedido) + frete;

    return (
        <div className="purchase-detail-card">
            <h4 className="detail-title">Detalhes da Compra <span className="order-id">#{order.id_pedido}</span></h4>
            <div className="detail-grid">
                
                {/* Itens do Pedido */}
                <div className="detail-items">
                    {order.itens.map(item => (
                        <div key={item.id_produto} className="detail-item-row">
                            <img src={item.imagem_url} alt={item.nome_produto} className="detail-item-img" /> 
                            <div className="detail-item-info">
                                <p className="item-name">{item.nome_produto}</p>
                                <p className="item-qty">{item.quantidade} unidade(s)</p>
                                <button onClick={() => onProductClick(item.id_produto)} className="product-link-btn">
                                    Ver descrição do produto
                                </button>
                            </div>
                            <p className="item-price">R$ {parseFloat(item.precoUnitario).toFixed(2).replace('.', ',')}</p>
                        </div>
                    ))}
                </div>

                {/* Resumo da Compra */}
                <div className="detail-summary">
                    <h5 className="summary-heading">Resumo Financeiro</h5>
                    <div className="summary-row">
                        <span>Subtotal:</span>
                        <span>R$ {parseFloat(order.total_pedido).toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="summary-row">
                        <span>Frete:</span>
                        <span className="shipping-cost">R$ {frete.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="summary-row summary-total">
                        <span>Total:</span>
                        <span>R$ {totalComFrete.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>
            </div>
            
            <div className="detail-shipping-info">
                 <p>Status do Pagamento: <span className={`order-status status-${order.status.toLowerCase().replace(/_|-/g, '-')}`}>
                    {formatPaymentStatus(order.status)}
                </span></p>
                {/* CORREÇÃO AQUI: Usa a mesma lógica de classes para cores do Status do Pedido */}
                <p>Status do Pedido: <span className={`order-status status-${getOrderStatusClass(order.status_pedido)}`}>
                    {formatOrderStatus(order.status_pedido)}
                </span></p>
                <p>Enviado para: {address}</p> 
            </div>
        </div>
    );
};

// Função groupOrdersByMonth (inalterada)
const groupOrdersByMonth = (orders) => {
    return orders.reduce((groups, order) => {
        const month = new Date(order.dataPedido).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
        if (!groups[month]) {
            groups[month] = [];
        }
        groups[month].push(order);
        return groups;
    }, {});
};


// Componente Principal
const UserOrdersPage = () => {
    const navigate = useNavigate(); 
    const { user, loading: authLoading } = useContext(AuthContext); 
    
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 4; 

    useEffect(() => {
        if (!authLoading && user) {
            const fetchOrders = async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await apiClient.get('/api/pedidos/meus-pedidos');
                    setOrders(response.data);
                } catch (err) {
                    console.error("Erro ao buscar pedidos:", err);
                    setError("Não foi possível carregar seus pedidos.");
                } finally {
                    setLoading(false);
                }
            };
            fetchOrders();
        } else if (!authLoading && !user) {
            navigate('/login', { state: { from: '/meus-pedidos' } });
        }
    }, [user, authLoading, navigate]); 

    
    const handleViewPurchase = (orderId) => {
        setSelectedOrderId(selectedOrderId === orderId ? null : orderId);
    };

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`); 
    };
    
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            setSelectedOrderId(null); 
        }
    };
    
    const totalOrders = orders.length;
    const totalPages = Math.ceil(totalOrders / ordersPerPage);
    const startIndex = (currentPage - 1) * ordersPerPage;
    const paginatedOrders = orders.slice(startIndex, startIndex + ordersPerPage);
    const groupedOrders = groupOrdersByMonth(paginatedOrders);


    if (loading || authLoading) {
        return <ContentWrapper><div className="loader">Carregando seus pedidos...</div></ContentWrapper>;
    }

    if (error) {
        return <ContentWrapper><div className="error-message">{error}</div></ContentWrapper>;
    }

    return (
        <ContentWrapper>
            <main className="orders-main-content">
                <h1 className="page-title">Meu Histórico de Pedidos</h1>

                <section className="orders-list-section">
                    
                    {totalOrders === 0 ? (
                        <p className="no-results">Você ainda não fez nenhum pedido.</p>
                    ) : (
                        Object.keys(groupedOrders).map(month => (
                            <div key={month} className="month-group">
                                <h2 className="month-title">{month}</h2>
                                {groupedOrders[month].map(order => {
                                    const firstItemImage = order.itens[0]?.imagem_url || ''; 

                                    return (
                                        <div key={order.id_pedido} className="order-item-card">
                                            
                                            <div className="order-header">
                                                {/* Status do Pedido (logístico) no resumo */}
                                                <span className={`order-status status-${getOrderStatusClass(order.status_pedido)}`}>
                                                    {formatOrderStatus(order.status_pedido)}
                                                </span>
                                                <span className="order-date">
                                                    Pedido em: {new Date(order.dataPedido).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>
                                            
                                            <div className="order-summary-row">
                                                <div className="product-info-summary">
                                                    <img src={firstItemImage} alt={order.itens[0].nome_produto} className="product-summary-img" />
                                                    <div className="product-details">
                                                        <p className="product-name">{order.itens[0]?.nome_produto || 'Pedido sem itens cadastrados'}</p>
                                                        {order.itens.length > 1 && (
                                                            <p className="more-items-count"> + {order.itens.length - 1} item(s) no total</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="order-actions single-action">
                                                    <button 
                                                        onClick={() => handleViewPurchase(order.id_pedido)} 
                                                        className={`action-btn view-btn ${selectedOrderId === order.id_pedido ? 'active' : ''}`}
                                                    >
                                                        {selectedOrderId === order.id_pedido ? 'Fechar Detalhes' : 'Ver Compra'}
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {selectedOrderId === order.id_pedido && (
                                                <PurchaseDetail order={order} onProductClick={handleProductClick} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))
                    )}
                    
                </section>
                
                {/* PAGINAÇÃO */}
                {totalPages > 1 && (
                    <div className="orders-pagination">
                        <button 
                            onClick={() => handlePageChange(currentPage - 1)} 
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </button>
                        <span>Página {currentPage} de {totalPages}</span>
                        <button 
                            onClick={() => handlePageChange(currentPage + 1)} 
                            disabled={currentPage === totalPages}
                        >
                            Próximo
                        </button>
                    </div>
                )}
            </main>
        </ContentWrapper>
    );
};

export default UserOrdersPage;