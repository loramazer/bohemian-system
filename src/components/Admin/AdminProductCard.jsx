import React from 'react';
import './AdminProductCard.css';

const AdminProductCard = ({ name, price, description, sold, goal, image }) => {
    const soldPercentage = (sold / goal) * 100;

    return (
        <div className="admin-product-card">
            <div className="card-header-admin">
                <img src={image} alt={name} className="admin-product-image" />
                <div className="admin-product-details">
                    <h3 className="admin-product-name">{name}</h3>
                    <p className="admin-product-price">{price}</p>
                </div>
                <div className="card-menu-icon">
                    <span>...</span>
                </div>
            </div>

            <div className="admin-product-description">
                <p>Descrição</p>
                <p>{description}</p>
            </div>

            <div className="admin-product-stats">
                <div className="stat-row">
                    <p>Vendidos</p>
                    <p>↑ {sold}</p>
                </div>
                <div className="progress-bar">
                    <div className="progress" style={{ width: `${soldPercentage}%` }}></div>
                </div>

                <div className="stat-row">
                    <p>Meta</p>
                    <p>↑ {goal}</p>
                </div>
                <div className="progress-bar">
                    <div className="progress" style={{ width: `${soldPercentage}%` }}></div>
                </div>
            </div>
        </div>
    );
};

export default AdminProductCard;