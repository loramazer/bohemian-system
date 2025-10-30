// loramazer/bohemian-system/bohemian-system-front-back-carrinhos/frontend/src/components/CartItems.jsx

import React from 'react';
import '../styles/CartItems.css';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

const CartItems = ({ items, onEmptyCart, onUpdateQuantity, onRemoveItem }) => {
    if (!items || items.length === 0) {
        return (
            <div className="cart-items-container">
                <p>Seu carrinho está vazio.</p>
                <div className="cart-actions">
                    <Link to="../products" className="more-items-btn">Ver Produtos</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-items-container">
            <div className="cart-items-header">
                <span>Produto</span>
                <span>Preço Unitário</span>
                <span>Quantidade</span>
                <span>Total</span>
                <span></span>
            </div>
            {items.map(item => (
                // Use o ID do item que vem do banco de dados como chave
                <div key={item.id_item_carrinho} className="cart-item">
                    <div className="cart-item-product">
                        {/* Imagem e nome do produto precisarão vir do backend no futuro */}
                        {/* <img src={item.imagem_url} alt={item.nome_produto} className="cart-item-image" /> */}
                        <div className="cart-item-details">
                            {/* Ajustado para usar os campos do backend */}
                            <h4>{item.nome_produto || 'Nome do Produto'}</h4>
                        </div>
                    </div>
                    <span className="cart-item-price">
                        R${parseFloat(item.preco_unitario).toFixed(2)}
                    </span>
                    <select
                        value={item.quantidade}
                        className="cart-item-quantity"
                        onChange={(e) => onUpdateQuantity(item.id_item_carrinho, parseInt(e.target.value))}
                    >
                        {[...Array(10).keys()].map(x => (
                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                        ))}
                    </select>
                    <span className="cart-item-total">
                        R${(parseFloat(item.preco_unitario) * item.quantidade).toFixed(2)}
                    </span>
                    <button 
                        className="cart-item-remove-btn" 
                        onClick={() => onRemoveItem(item.id_item_carrinho)}
                    >
                        <FaTrash /> {/* Usando o ícone */}
                    </button>
                </div>
            ))}
            <div className="cart-actions">
                <Link to="../products" className="more-items-btn">Selecionar mais produtos</Link>
                <button className="empty-cart-btn" onClick={onEmptyCart}>Esvaziar Carrinho</button>
            </div>
        </div>
    );
};

export default CartItems;