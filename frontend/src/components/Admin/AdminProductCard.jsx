import React, { useState } from 'react';
import { FaEllipsisV, FaPencilAlt, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import '../../styles/AdminProductCard.css';
import placeholderImage from '../../../public/5.png'; 

// Menu agora inclui a opção de Ativar/Desativar
const ActionMenu = ({ onEdit, onDelete, onToggleStatus, isActive }) => (
    <div className="admin-card-menu-dropdown">
        <button onClick={onEdit}>
            <FaPencilAlt /> Editar
        </button>
        
        {/* Botão de mudar status dentro do menu */}
        <button onClick={onToggleStatus} style={{ color: isActive ? '#e67e22' : '#27ae60' }}>
            {isActive ? <><FaEyeSlash /> Desativar</> : <><FaEye /> Ativar</>}
        </button>

        <button onClick={onDelete} className="delete-btn">
            <FaTrash /> Excluir
        </button>
    </div>
);

const AdminProductCard = ({ product, onEdit, onDelete, onToggleStatus }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    let displayImage = product.imagem_url;
    try {
        const parsedUrls = JSON.parse(product.imagem_url);
        if (Array.isArray(parsedUrls) && parsedUrls.length > 0) {
            displayImage = parsedUrls[0];
        }
    } catch (e) {}
    
    const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco_venda);
    const isActive = product.ativo === 1 || product.ativo === true;

    return (
        <div className={`admin-product-card ${!isActive ? 'inactive-card' : ''}`}>
            <div className="card-header-admin">
                <img src={displayImage || placeholderImage} alt={product.nome} className="admin-product-image" />
                

                <div className="admin-product-details">
                    <h4 className="admin-product-name">{product.nome}</h4>
                    <p className="admin-product-price">{formattedPrice}</p>
                </div>

                {/* Menu Dropdown (Sem o switch aqui) */}
                <div className="admin-card-menu-container">
                    <FaEllipsisV 
                        className="card-menu-icon" 
                        onClick={() => setMenuOpen(!menuOpen)} 
                    />
                    {menuOpen && (
                        <ActionMenu 
                            onEdit={() => onEdit(product.id_produto)} 
                            onDelete={() => onDelete(product)}
                            onToggleStatus={() => onToggleStatus(product)}
                            isActive={isActive}
                        />
                    )}
                </div>
            </div>

            <div className="admin-product-description">
                <p>{product.descricao?.substring(0, 80)}...</p>
            </div>
            
            <div className="admin-product-stats">
                <span className={`status-text ${isActive ? 'active' : 'inactive'}`}>
                    {isActive ? '● Visível na Loja' : '● Oculto da Loja'}
                </span>
            </div>
        </div>
    );
};

export default AdminProductCard;