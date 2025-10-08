// src/components/Catalog/ProductGrid.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../Shared/ProductCard.jsx';
import '../../styles/ProductGrid.css';

const ProductGrid = ({ products }) => {
    return (
        <div className="product-grid-container">
            <div className="product-grid">
                {products && products.length > 0 ? (
                    products.map(product => (
                        <Link to={`/product/${product.id_produto}`} key={product.id_produto} style={{ textDecoration: 'none' }}>
                            <ProductCard
                                name={product.nome}
                                price={`R$${product.preco_promocao || product.preco_venda}`}
                                oldPrice={product.preco_promocao ? `R$${product.preco_venda}` : null}
                                imageSrc={product.imagem_url} 
                                code={product.codigo_produto} // Adicione esta linha se houver
                                tag={product.tag || null} // Exemplo de como passar a tag
                            />
                        </Link>
                    ))
                ) : (
                    <p>Nenhum produto encontrado.</p>
                )}
            </div>
        </div>
    );
};

export default ProductGrid;