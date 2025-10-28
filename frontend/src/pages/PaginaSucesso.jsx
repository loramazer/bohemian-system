// Exemplo em React (com react-router-dom v6)
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function PaginaSucesso() {
    const [searchParams] = useSearchParams();
    const [mensagem, setMensagem] = useState('Processando seu pagamento...');

    useEffect(() => {
        // 1. Pega os dados da URL
        const paymentId = searchParams.get('payment_id');
        const status = searchParams.get('status');

        if (paymentId && status === 'approved') {
            // 2. Envia os dados para o seu back-end para verificação
            confirmarPagamentoNoBackend(paymentId);
        } else {
            setMensagem('Houve um problema ao processar seu pagamento.');
        }
    }, [searchParams]);

    // Função que fala com sua API
    const confirmarPagamentoNoBackend = async (paymentId) => {
        try {
            // 3. O back-end vai verificar e salvar no banco
            // (Esta rota /api/confirmar-pedido é você quem cria no seu back-end)
            const response = await fetch('http://localhost:8080/api/confirmar-pedido', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId: paymentId }),
            });

            if (!response.ok) {
                throw new Error('Falha na confirmação');
            }

            const dadosPedido = await response.json();
            setMensagem(`Pedido #${dadosPedido.id} confirmado com sucesso!`);

        } catch (error) {
            setMensagem('Erro ao confirmar seu pedido. Entre em contato conosco.');
        }
    };

    return (
        <div>
            <h1>Status do Pedido</h1>
            <p>{mensagem}</p>
        </div>
    );
}

export default PaginaSucesso;