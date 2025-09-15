// loramazer/bohemian-system/bohemian-system-front-back-carrinhos/frontend/src/components/CartItems.jsx

import React from 'react';
import '../styles/CartItems.css';
import { Link } from 'react-router-dom';

const CartItems = ({ items, onEmptyCart }) => {
    // Se o array de itens estiver vazio, mostre uma mensagem amigável
    if (!items || items.length === 0) {
        return (
            <div className="cart-items-container">
                <p>Seu carrinho está vazio.</p>
                <div className="cart-actions">
                    <Link to="./CatalogPage.jsx" className="more-items-btn">Ver Produtos</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-items-container">
            <div className="cart-items-header">
                <span>Produto</span>
                <span>Preço</span>
                <span>Quantidade</span>
                <span>Total</span>
            </div>
            {items.map(item => (
                // Use o ID do item que vem do banco de dados como chave
                <div key={item.item_id} className="cart-item">
                    <div className="cart-item-product">
                        {/* Imagem e nome do produto precisarão vir do backend no futuro */}
                        {/* <img src={item.imagem_url} alt={item.nome_produto} className="cart-item-image" /> */}
                        <div className="cart-item-details">
                            {/* Ajustado para usar os campos do backend */}
                            <h4>{item.nome_produto || 'Nome do Produto'}</h4>
                            <p>Tamanho: P</p>
                        </div>
                    </div>
                    <span className="cart-item-price">R${parseFloat(item.preco_unitario).toFixed(2)}</span>
                    <input
                        type="number"
                        value={item.quantidade}
                        min="1"
                        className="cart-item-quantity"
                        readOnly // A edição de quantidade será um próximo passo
                    />
                    <span className="cart-item-total">
                        R${(parseFloat(item.preco_unitario) * item.quantidade).toFixed(2)}
                    </span>
                </div>
            ))}
            <div className="cart-actions">
                <button className="more-items-btn">Mais Itens</button>
                <button className="empty-cart-btn" onClick={onEmptyCart}>Esvaziar</button>
            </div>
        </div>
    );
};

export default CartItems;