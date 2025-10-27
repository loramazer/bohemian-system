// loramazer/bohemian-system/bohemian-system-refatorar-organizacao/frontend/src/components/Admin/ProductForm.jsx

import React from 'react';
import '../../styles/ProductForm.css';

// NOVO: Inclui formErrors
const ProductForm = ({ categories = [], formData = {}, onFormChange, formErrors = {} }) => {
    
    // NOVO: Componente auxiliar para exibir o erro
    const ErrorText = ({ field }) => (
        formErrors[field] ? <p className="error-text">{formErrors[field]}</p> : null
    );

    return (
        <div className="product-form-container">
            <div className={`form-group ${formErrors.nome ? 'has-error' : ''}`}>
                <label htmlFor="nome">Nome do Produto</label>
                <input
                    type="text"
                    id="nome"
                    name="nome"
                    placeholder="Lorem ipsum"
                    value={formData.nome || ''}
                    onChange={onFormChange}
                />
                <ErrorText field="nome" /> {/* EXIBE O ERRO */}
            </div>
            <div className={`form-group ${formErrors.descricao ? 'has-error' : ''}`}>
                <label htmlFor="descricao">Descrição</label>
                <textarea
                    id="descricao"
                    name="descricao"
                    placeholder="Lorem Ipsum Is A Dummy Text"
                    value={formData.descricao || ''}
                    onChange={onFormChange}
                ></textarea>
                <ErrorText field="descricao" /> {/* EXIBE O ERRO */}
            </div>
            <div className={`form-group ${formErrors.categoria ? 'has-error' : ''}`}>
                <label htmlFor="categoria">Categoria</label>
                <select id="categoria" name="categoria" value={formData.categoria || ''} onChange={onFormChange}>
                    <option value="">Selecione uma categoria</option>
                    {categories.map((cat) => (
                        <option key={cat.id_categoria} value={cat.nome}>
                            {cat.nome}
                        </option>
                    ))}
                </select>
                <ErrorText field="categoria" /> {/* EXIBE O ERRO */}
            </div>
            <div className="form-group-row">
                <div className={`form-group ${formErrors.precoRegular ? 'has-error' : ''}`}>
                    <label htmlFor="precoRegular">Preço Regular</label>
                    <input
                        type="text"
                        id="precoRegular"
                        name="precoRegular"
                        placeholder="R$300"
                        value={formData.precoRegular || ''}
                        onChange={onFormChange}
                    />
                    <ErrorText field="precoRegular" /> {/* EXIBE O ERRO */}
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