// loramazer/bohemian-system/bohemian-system-refatorar-organizacao/frontend/src/components/Admin/AdminProductCard.jsx
import React, { useState } from 'react';
import { FaEllipsisV, FaPencilAlt, FaTrash } from 'react-icons/fa';
import '../../styles/AdminProductCard.css';
import placeholderImage from '../../../public/5.png'; // Imagem placeholder

// Componente de menu dropdown
const ActionMenu = ({ onEdit, onDelete }) => (
    <div className="admin-card-menu-dropdown">
        <button onClick={onEdit}><FaPencilAlt /> Editar</button>
        <button onClick={onDelete}><FaTrash /> Excluir</button>
    </div>
);

const AdminProductCard = ({ product, onEdit, onDelete }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    // Lógica para extrair a primeira imagem (igual ao ProductCard público)
    let displayImage = product.imagem_url;
    try {
        const parsedUrls = JSON.parse(product.imagem_url);
        if (Array.isArray(parsedUrls) && parsedUrls.length > 0) {
            displayImage = parsedUrls[0];
        }
    } catch (e) {
        // Ignora o erro se já for uma URL simples
    }
    
    // Formata o preço
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(product.preco_venda);

    // Limita a descrição
    const shortDescription = product.descricao.length > 100 
        ? product.descricao.substring(0, 100) + '...' 
        : product.descricao;

    return (
        <div className="admin-product-card">
            <div className="card-header-admin">
                <img 
                    src={displayImage || placeholderImage} 
                    alt={product.nome} 
                    className="admin-product-image" 
                />
                <div className="admin-product-details">
                    <h4 className="admin-product-name">{product.nome}</h4>
                    <p className="admin-product-price">{formattedPrice}</p>
                </div>
                <div className="admin-card-menu-container">
                    <FaEllipsisV 
                        className="card-menu-icon" 
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setMenuOpen(!menuOpen);
                        }}
                    />
                    {menuOpen && <ActionMenu onEdit={onEdit} onDelete={onDelete} />}
                </div>
            </div>

            <div className="admin-product-description">
                <p><strong>Descrição:</strong></p>
                <p>{shortDescription}</p>
            </div>

            <div className="admin-product-stats">
                <div className="stat-row">
                    <p>Status:</p>
                    <p>{product.ativo ? 'Ativo' : 'Inativo'}</p>
                </div>
                {/* Você pode adicionar mais estatísticas aqui (ex: vendas, estoque) se a API as fornecer */}
            </div>
        </div>
    );
};

export default AdminProductCard;