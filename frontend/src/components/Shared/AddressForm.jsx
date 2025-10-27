import React, { useState } from 'react';
import '../../styles/AddressForm.css'; // Vamos criar este CSS no próximo passo

const AddressForm = ({ onSave, onCancel, initialData = {} }) => {
    // Usamos initialData para pré-preencher o formulário (útil para edição no futuro)
    const [formData, setFormData] = useState({
        rua: initialData.rua || '',
        numero: initialData.numero || '',
        complemento: initialData.complemento || '',
        bairro: initialData.bairro || '',
        cidade: initialData.cidade || '',
        estado: initialData.estado || '',
        cep: initialData.cep || '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Lógica de busca de CEP (Bônus)
    const handleCepBlur = async (e) => {
        const cep = e.target.value.replace(/\D/g, ''); // Limpa o CEP
        if (cep.length !== 8) return;

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            if (!response.ok) throw new Error('CEP não encontrado');

            const data = await response.json();
            if (data.erro) throw new Error('CEP não encontrado');

            // Preenche o formulário com os dados do ViaCEP
            setFormData(prev => ({
                ...prev,
                rua: data.logradouro,
                bairro: data.bairro,
                cidade: data.localidade,
                estado: data.uf,
                cep: data.cep, // Formata o CEP
            }));
            setError('');
        } catch (err) {
            console.error("Erro ao buscar CEP:", err);
            setError('CEP não encontrado. Preencha manualmente.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validação simples
        if (!formData.rua || !formData.numero || !formData.cidade || !formData.cep) {
            setError('Preencha todos os campos obrigatórios (Rua, Nº, Cidade, CEP).');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // A função onSave é o 'handleSaveAddress' que veio da CheckoutPage
            await onSave(formData);
        } catch (error) {
            setError('Falha ao salvar. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="address-form-container" onSubmit={handleSubmit}>
            <h4>Novo Endereço</h4>
            {error && <p className="form-error">{error}</p>}

            <div className="form-group">
                <label htmlFor="cep">CEP</label>
                <input
                    type="text"
                    id="cep"
                    name="cep"
                    value={formData.cep}
                    onChange={handleChange}
                    onBlur={handleCepBlur} // Adiciona a busca de CEP
                    placeholder="00000-000"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="rua">Rua / Logradouro</label>
                <input
                    type="text"
                    id="rua"
                    name="rua"
                    value={formData.rua}
                    onChange={handleChange}
                    placeholder="Ex: Rua das Flores"
                    required
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="numero">Número</label>
                    <input
                        type="text"
                        id="numero"
                        name="numero"
                        value={formData.numero}
                        onChange={handleChange}
                        placeholder="123"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="complemento">Complemento (Opcional)</label>
                    <input
                        type="text"
                        id="complemento"
                        name="complemento"
                        value={formData.complemento}
                        onChange={handleChange}
                        placeholder="Apto 4B"
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="bairro">Bairro</label>
                <input
                    type="text"
                    id="bairro"
                    name="bairro"
                    value={formData.bairro}
                    onChange={handleChange}
                    placeholder="Centro"
                    required
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="cidade">Cidade</label>
                    <input
                        type="text"
                        id="cidade"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleChange}
                        placeholder="São Paulo"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="estado">Estado (UF)</label>
                    <input
                        type="text"
                        id="estado"
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                        placeholder="SP"
                        maxLength="2"
                        required
                    />
                </div>
            </div>

            <div className="form-actions">
                <button
                    type="button"
                    className="btn-cancel"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="btn-save"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Salvando...' : 'Salvar Endereço'}
                </button>
            </div>
        </form>
    );
};

export default AddressForm;