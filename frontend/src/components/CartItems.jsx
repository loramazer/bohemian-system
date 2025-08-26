import React from 'react';
import '../styles/CartItems.css';


const CartItems = ({ items, onEmptyCart }) => {
    return (
        <div className="cart-items-container">
            <div className="cart-items-header">
                <span>Produto</span>
                <span>Preço</span>
                <span>Quantidade</span>
                <span>Total</span>
            </div>
            {items.map(item => (
                <div key={item.id} className="cart-item">
                    <div className="cart-item-product">
                        <img src={item.image} alt={item.name} className="cart-item-image" />
                        <div className="cart-item-details">
                            <h4>{item.name}</h4>
                            <p>Tamanho: P</p>
                        </div>
                    </div>
                    <span className="cart-item-price">R${item.price.toFixed(2)}</span>
                    <input type="number" value={item.quantity} min="1" className="cart-item-quantity" />
                    <span className="cart-item-total">R${(item.price * item.quantity).toFixed(2)}</span>
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