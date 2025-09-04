import React, { useState } from 'react';

const ProductForm = () => {
    const [nome, setNome] = useState('');
    const [preco_venda, setPrecoVenda] = useState('');
    const [descricao, setDescricao] = useState('');
    const [status, setStatus] = useState('ativo');
    const [imagem, setImagem] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('preco_venda', preco_venda);
        formData.append('descricao', descricao);
        formData.append('status', status);
        if (imagem) {
            formData.append('imagem', imagem);
        }

        try {
            const response = await fetch('http://localhost:3000/produtos', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                // Limpar o formulário
                setNome('');
                setPrecoVenda('');
                setDescricao('');
                setDescricao('');
                setStatus('ativo');
                setImagem(null);
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Erro ao criar produto:', error);
            alert('Erro ao criar produto. Tente novamente.');
        }
    };

    return (
        <div className="product-form-container">
            <h2>Criar Novo Produto</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-group">
                    <label htmlFor="nome">Nome do Produto</label>
                    <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="preco_venda">Preço de Venda</label>
                    <input type="number" id="preco_venda" value={preco_venda} onChange={(e) => setPrecoVenda(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="descricao">Descrição</label>
                    <textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)}></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="imagem">Imagem do Produto</label>
                    <input type="file" id="imagem" name="imagem" onChange={(e) => setImagem(e.target.files[0])} />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
                    </select>
                </div>
                <button type="submit">Salvar Produto</button>
            </form>
        </div>
    );
};

export default ProductForm;