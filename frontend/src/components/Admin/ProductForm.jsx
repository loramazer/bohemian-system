// loramazer/bohemian-system/bohemian-system-refatorar-organizacao/frontend/src/components/Admin/ProductForm.jsx

import React from 'react';
import '../../styles/ProductForm.css';

const ProductForm = ({ categories = [], formData = {}, onFormChange, formErrors = {} }) => {
    
    const ErrorText = ({ field }) => (
        formErrors[field] ? <p className="error-text">{formErrors[field]}</p> : null
    );

    return (
        <div className="product-form-container">
            <div className={`form-group ${formErrors.nome ? 'has-error' : ''}`}>
                <label htmlFor="nome" title="Digite o nome do arranjo, buquê ou planta">Nome do Produto ⓘ</label>
                <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome || ''}
                    onChange={onFormChange}
                    // Dica ajustada para FLORES
                    title="Ex: Buquê de Rosas, Orquídea Branca em Vaso, Arranjo Seco Boho" 
                />
                <ErrorText field="nome" />
            </div>

            <div className={`form-group ${formErrors.descricao ? 'has-error' : ''}`}>
                <label htmlFor="descricao" title="Descreva as flores usadas, tamanho e ocasiões">Descrição ⓘ</label>
                <textarea
                    id="descricao"
                    name="descricao"
                    value={formData.descricao || ''}
                    onChange={onFormChange}
                    // Dica ajustada para FLORES
                    title="Ex: Arranjo delicado com mix de flores do campo e eucalipto. Acompanha vaso de vidro. Ideal para centro de mesa."
                ></textarea>
                <ErrorText field="descricao" />
            </div>

            <div className={`form-group ${formErrors.categoria ? 'has-error' : ''}`}>
                <label htmlFor="categoria">Categoria</label>
                <select 
                    id="categoria" 
                    name="categoria" 
                    value={formData.categoria || ''} 
                    onChange={onFormChange}
                    title="Selecione a categoria (Ex: Buquês, Cestas, Decoração, Casamento)"
                >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((cat) => (
                        <option key={cat.id_categoria} value={cat.nome}>
                            {cat.nome}
                        </option>
                    ))}
                </select>
                <ErrorText field="categoria" />
            </div>

            <div className="form-group-row">
                <div className={`form-group ${formErrors.precoRegular ? 'has-error' : ''}`}>
                    <label htmlFor="precoRegular">Preço Regular</label>
                    <input
                        type="text"
                        id="precoRegular"
                        name="precoRegular"
                        value={formData.precoRegular || ''}
                        onChange={onFormChange}
                        title="Use ponto para centavos. Ex: 120.00"
                    />
                    <ErrorText field="precoRegular" />
                </div>
                
                <div className="form-group">
                    <label htmlFor="precoPromocao">Preço na Promoção</label>
                    <input
                        type="text"
                        id="precoPromocao"
                        name="precoPromocao"
                        value={formData.precoPromocao || ''}
                        onChange={onFormChange}
                        title="Opcional. Ex: 99.90"
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductForm;