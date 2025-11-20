// frontend/src/pages/WishlistPage.jsx

import React, { useContext, useState } from 'react'; // NOVO: useState
import { Link } from 'react-router-dom';
import ContentWrapper from '../components/Shared/ContentWrapper.jsx';
import ProductCard from '../components/Shared/ProductCard.jsx';
import Pagination from '../components/Shared/Pagination.jsx'; // NOVO: Importar Paginação
import { FaHeartBroken } from 'react-icons/fa';
import '../styles/CatalogPage.css'; 
import '../styles/WishlistPage.css'; 

import { WishlistContext } from '../context/WishlistContext.jsx';
import { CartContext } from '../context/CartContext.jsx';

const ITEMS_PER_PAGE = 9; // Define quantos itens por página (ex: 8)

const WishlistPage = () => {
    const { wishlistItems, removeWishlistItem, isFavorited } = useContext(WishlistContext);
    const { addItem } = useContext(CartContext);
    
    const [currentPage, setCurrentPage] = useState(1);

    const handleRemove = (e, product) => {
        e.preventDefault(); 
        e.stopPropagation();
        removeWishlistItem(product.id_produto);
    };

    const handleAddToCart = (e, product) => {
        e.preventDefault(); 
        e.stopPropagation();
        addItem(product);
    };


    const totalItems = wishlistItems.length;
    const currentItems = wishlistItems.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };


    return (
        <ContentWrapper>
            <main className="wishlist-main">
                <div className="wishlist-breadcrumbs">
                    <Link to="/">Home</Link> &gt; <span>Lista de Desejos</span>
                </div>
                
                <div className="page-header">
                    <h2 className="page-title">Meus Produtos Curtidos ({totalItems})</h2>
                </div>
                
                {totalItems > 0 ? (
                    // NOVO: Adicionado 'fragment' ( <>...</> ) para agrupar a grade e a paginação
                    <> 
                        <div className="wishlist-grid product-grid">
                            {/* ATUALIZADO: Mapeia 'currentItems' (fatiados) em vez de 'wishlistItems' (todos) */}
                            {currentItems.map(product => (
                                <div key={product.id_produto} className="wishlist-item-wrapper">
                                    <ProductCard 
                                        product={product} 
                                        onAddToCart={(e) => handleAddToCart(e, product)}
                                        onAddToWishlist={(e) => handleRemove(e, product)}
                                        isFavorited={isFavorited(product.id_produto)}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* NOVO: Componente de Paginação */}
                        <Pagination 
                            currentPage={currentPage}
                            totalItems={totalItems}
                            itemsPerPage={ITEMS_PER_PAGE}
                            onPageChange={handlePageChange}
                        />
                    </>
                ) : (
                    <div className="empty-wishlist">
                        <FaHeartBroken className="empty-icon" />
                        <p>Sua lista de desejos está vazia. Comece a explorar nossos produtos!</p>
                        <Link to="/products" className="browse-button">Ver Catálogo</Link>
                    </div>
                )}
            </main>
        </ContentWrapper>
    );
};

export default WishlistPage;