import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ContentWrapper from '../components/Shared/ContentWrapper.jsx';
import '../styles/UserOrderPage.css';
import { AuthContext } from '../context/AuthContext.jsx';

import img1 from '../assets/1.png';
import img2 from '../assets/2.png';
import img3 from '../assets/3.png';
import img4 from '../assets/4.png';
import img5 from '../assets/5.png';


// --- Dados Mock (Simulação de Pedidos) ---
const mockOrders = [
    { 
        id: 'BH20251025-001', date: '2025-10-25', status: 'Em Preparação', 
        items: [
            { productId: 'P001', name: 'Buquê "Bohemian Sunrise"', quantity: 1, img: img1, price: 189.90 },
            { productId: 'P002', name: 'Vinho Tinto Artesanal', quantity: 1, img: img2, price: 89.00 }
        ],
        shipping: 'R. das Flores, 123', total: 278.90
    },
    { 
        id: 'BH20250915-002', date: '2025-09-15', status: 'Entregue', 
        items: [
            { productId: 'P003', name: 'Arranjo de Mesa "Lavanda Dream"', quantity: 2, img: img3, price: 120.00 }
        ],
        shipping: 'Av. Brasil, 456', total: 240.00
    },
    { 
        id: 'BH20250810-003', date: '2025-08-10', status: 'Entregue', 
        items: [
            { productId: 'P004', name: 'Cesta Gourmet Premium', quantity: 1, img: img4, price: 350.00 },
            { productId: 'P005', name: 'Cartão Exclusivo', quantity: 1, img: img5, price: 15.00 }
        ],
        shipping: 'R. Central, 789', total: 365.00
    },
    { 
        id: 'BH20250701-004', date: '2025-07-01', status: 'Cancelado', 
        items: [
            { productId: 'P001', name: 'Buquê "Bohemian Sunrise"', quantity: 1, img: img1, price: 189.90 }
        ],
        shipping: 'Av. Principal, 10', total: 189.90
    },
];

// Função para agrupar pedidos por mês/ano
const groupOrdersByMonth = (orders) => {
    return orders.reduce((groups, order) => {
        const month = new Date(order.date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        if (!groups[month]) {
            groups[month] = [];
        }
        groups[month].push(order);
        return groups;
    }, {});
};

// Componente para o Detalhe da Compra (simulando a segunda tela)
const PurchaseDetail = ({ order, onProductClick }) => {
    return (
        <div className="purchase-detail-card">
            <h4 className="detail-title">Detalhes da Compra <span className="order-id">#{order.id}</span></h4>
            <div className="detail-grid">
                
                {/* Itens do Pedido */}
                <div className="detail-items">
                    {order.items.map(item => (
                        <div key={item.productId} className="detail-item-row">
                            {/* IMAGEM: Adicionada classe 'product-detail-img' para controle de tamanho */}
                            <img src={item.img} alt={item.name} className="detail-item-img product-detail-img" /> 
                            <div className="detail-item-info">
                                <p className="item-name">{item.name}</p>
                                <p className="item-qty">{item.quantity} unidade(s)</p>
                                <button onClick={() => onProductClick(item.productId)} className="product-link-btn">
                                    Ver descrição do produto
                                </button>
                            </div>
                            <p className="item-price">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                        </div>
                    ))}
                </div>

                {/* Resumo da Compra */}
                <div className="detail-summary">
                    <h5 className="summary-heading">Resumo Financeiro</h5>
                    <div className="summary-row"><span>Subtotal:</span><span>R$ {order.total.toFixed(2).replace('.', ',')}</span></div>
                    <div className="summary-row"><span>Frete:</span><span className="shipping-cost">Grátis</span></div>
                    <div className="summary-row summary-total"><span>Total:</span><span>R$ {order.total.toFixed(2).replace('.', ',')}</span></div>
                </div>
            </div>
            
            <div className="detail-shipping-info">
                <p>Status: <span className={`order-status status-${order.status.toLowerCase().replace(' ', '-')}`}>{order.status}</span></p>
                <p>Enviado para: {order.shipping}</p>
            </div>
            
            <Link to={`/help/${order.id}`} className="help-link">Precisa de Ajuda com este pedido?</Link>
        </div>
    );
};

// Componente Principal
const UserOrdersPage = () => {
    const navigate = useNavigate(); 
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 4;

    const filteredOrders = mockOrders; 

    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const startIndex = (currentPage - 1) * ordersPerPage;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ordersPerPage);
    
    const groupedOrders = groupOrdersByMonth(paginatedOrders);

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

    return (
        <ContentWrapper>
            <main className="orders-main-content">
                <h1 className="page-title">Meu Histórico de Pedidos</h1>

                <section className="orders-list-section">
                    
                    {Object.keys(groupedOrders).length === 0 ? (
                        <p className="no-results">Nenhum pedido encontrado.</p>
                    ) : (
                        Object.keys(groupedOrders).map(month => (
                            <div key={month} className="month-group">
                                <h2 className="month-title">{month}</h2>
                                {groupedOrders[month].map(order => (
                                    <div key={order.id} className="order-item-card">
                                        
                                        <div className="order-header">
                                            <span className={`order-status status-${order.status.toLowerCase().replace(' ', '-')}`}>{order.status}</span>
                                            <span className="order-date">Pedido em: {new Date(order.date).toLocaleDateString('pt-BR')}</span>
                                        </div>
                                        
                                        <div className="order-summary-row">
                                            <div className="product-info-summary">
                                                <img src={order.items[0].img} alt={order.items[0].name} className="product-summary-img" />
                                                <div className="product-details">
                                                    <p className="product-name">{order.items[0].name}</p>
                                                    {order.items.length > 1 && (
                                                        <p className="more-items-count"> + {order.items.length - 1} item(s) no total</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* BOTÕES DE AÇÃO: APENAS 'Ver Compra' */}
                                            <div className="order-actions single-action">
                                                <button 
                                                    onClick={() => handleViewPurchase(order.id)} 
                                                    className={`action-btn view-btn ${selectedOrderId === order.id ? 'active' : ''}`}
                                                >
                                                    {selectedOrderId === order.id ? 'Fechar Detalhes' : 'Ver Compra'}
                                                </button>
                                                {/* Botão 'Comprar Novamente' REMOVIDO */}
                                            </div>
                                        </div>
                                        
                                        {/* DETALHE DA COMPRA (Toggle) */}
                                        {selectedOrderId === order.id && (
                                            <PurchaseDetail order={order} onProductClick={handleProductClick} />
                                        )}
                                    </div>
                                ))}
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