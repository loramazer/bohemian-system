import React from 'react';
import './ProductForm.css';

const ProductForm = ({ categories = [], formData = {}, onFormChange, onColorChange }) => {
    return (
        <div className="product-form-container">
            <div className="form-group">
                <label htmlFor="nome">Nome do Produto</label>
                <input
                    type="text"
                    id="nome"
                    name="nome"
                    placeholder="Lorem ipsum"
                    value={formData.nome || ''}
                    onChange={onFormChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="descricao">Descrição</label>
                <textarea
                    id="descricao"
                    name="descricao"
                    placeholder="Lorem Ipsum Is A Dummy Text"
                    value={formData.descricao || ''}
                    onChange={onFormChange}
                ></textarea>
            </div>
            <div className="form-group">
                <label htmlFor="categoria">Categoria</label>
                <select id="categoria" name="categoria" value={formData.categoria || ''} onChange={onFormChange}>
                    <option value="">Selecione uma categoria</option>
                    {categories.map((cat) => (
                        <option key={cat.id_categoria} value={cat.nome}>
                            {cat.nome}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>Cores</label>
                <div className="color-inputs">
                    <input
                        type="text"
                        name="cores[0]"
                        placeholder="Cor 1"
                        value={formData.cores?.[0] || ''}
                        onChange={(e) => onColorChange(e, 0)}
                    />
                    <input
                        type="text"
                        name="cores[1]"
                        placeholder="Cor 2"
                        value={formData.cores?.[1] || ''}
                        onChange={(e) => onColorChange(e, 1)}
                    />
                    <input
                        type="text"
                        name="cores[2]"
                        placeholder="Cor 3"
                        value={formData.cores?.[2] || ''}
                        onChange={(e) => onColorChange(e, 2)}
                    />
                </div>
            </div>
            <div className="form-group-row">
                <div className="form-group">
                    <label htmlFor="precoRegular">Preço Regular</label>
                    <input
                        type="text"
                        id="precoRegular"
                        name="precoRegular"
                        placeholder="R$300"
                        value={formData.precoRegular || ''}
                        onChange={onFormChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="precoPromocao">Preço na Promoção</label>
                    <input
                        type="text"
                        id="precoPromocao"
                        name="precoPromocao"
                        placeholder="R$260"
                        value={formData.precoPromocao || ''}
                        onChange={onFormChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductForm;