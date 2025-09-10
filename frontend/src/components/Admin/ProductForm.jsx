import React from 'react';
import './ProductForm.css';

const ProductForm = () => {
    return (
        <div className="product-form-container">
            <div className="form-group">
                <label>Nome do Produto</label>
                <input type="text" placeholder="Lorem ipsum" />
            </div>
            <div className="form-group">
                <label>Descrição</label>
                <textarea placeholder="Lorem Ipsum Is A Dummy Text"></textarea>
            </div>
            <div className="form-group">
                <label>Categoria</label>
                <select>
                    <option>Sneaker</option>
                </select>
            </div>
            <div className="form-group">
                <label>Cores</label>
                <div className="color-inputs">
                    <input type="text" placeholder="Lorem" />
                    <input type="text" placeholder="Lorem" />
                    <input type="text" placeholder="#32A53" />
                </div>
            </div>
            <div className="form-group-row">
                <div className="form-group">
                    <label>Preço Regular</label>
                    <input type="text" placeholder="R$300" />
                </div>
                <div className="form-group">
                    <label>Preço na Promoção</label>
                    <input type="text" placeholder="R$260" />
                </div>
            </div>
        </div>
    );
};

export default ProductForm;