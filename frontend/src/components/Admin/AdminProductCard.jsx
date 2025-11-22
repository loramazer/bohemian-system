import React, { useState } from 'react';
import { FaEllipsisV, FaPencilAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import '../../styles/AdminProductCard.css';
import placeholderImage from '../../../public/5.png'; 

const ActionMenu = ({ onEdit, onToggleStatus, isActive }) => (
    <div className="admin-card-menu-dropdown">
        <button onClick={onEdit}>
            <FaPencilAlt /> Editar
        </button>
        
        {/* ÚNICA AÇÃO DE STATUS: Ativar ou Desativar */}
        <button onClick={onToggleStatus} style={{ color: isActive ? '#e67e22' : '#27ae60' }}>
            {isActive ? <><FaEyeSlash /> Desativar</> : <><FaEye /> Ativar</>}
        </button>
    </div>
);

const AdminProductCard = ({ product, onEdit, onToggleStatus }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    let displayImage = product.imagem_url;
    try {
        const parsedUrls = JSON.parse(product.imagem_url);
        if (Array.isArray(parsedUrls) && parsedUrls.length > 0) {
            displayImage = parsedUrls[0];
        }
    } catch (e) {}
    
    const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco_venda);
    
    // Verifica status
    const isActive = product.ativo === 1 || product.ativo === true;

    return (
        <div className={`admin-product-card ${!isActive ? 'inactive-card' : ''}`}>
            <div className="card-header-admin">
                <img src={displayImage || placeholderImage} alt={product.nome} className="admin-product-image" />
            

                <div className="admin-product-details">
                    <h4 className="admin-product-name">{product.nome}</h4>
                    <p className="admin-product-price">{formattedPrice}</p>
                </div>

                <div className="admin-card-menu-container">
                    <FaEllipsisV 
                        className="card-menu-icon" 
                        onClick={() => setMenuOpen(!menuOpen)} 
                    />
                    {menuOpen && (
                        <ActionMenu 
                            onEdit={() => onEdit(product.id_produto)} 
                            onToggleStatus={() => onToggleStatus(product)}
                            isActive={isActive}
                        />
                    )}
                </div>
            </div>

            <div className="admin-product-description">
                <p>{product.descricao?.substring(0, 80)}...</p>
            </div>
        </div>
    );
};

export default AdminProductCard;