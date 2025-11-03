// src/pages/PaginaSucesso.jsx

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function PaginaSucesso() {
    const [searchParams] = useSearchParams();
    const [mensagem, setMensagem] = useState('Processando seu pagamento...');

    // --- CORREÇÃO AQUI ---
    useEffect(() => {
        console.log("--- PÁGINA DE STATUS CARREGADA ---");

        const paymentId = searchParams.get('payment_id');
        const status = searchParams.get('status');
        console.log("[DEBUG] payment_id:", paymentId, "status:", status);

        // Agora, chamamos o backend para 'approved' E 'pending'
        if (paymentId && (status === 'approved' || status === 'pending')) {
            console.log(`[DEBUG] Status ${status}. Chamando backend para registrar...`);
            // A função 'confirmarPedido' no backend agora vai registrar
            // tanto pedidos aprovados quanto pendentes.
            registrarPedidoNoBackend(paymentId, status);

        } else if (status === 'failure' || status === 'rejected') {
            console.error("[DEBUG] Pagamento falhou ou foi rejeitado.");
            setMensagem('Houve um problema ao processar seu pagamento. Tente novamente.');

        } else {
            console.error("[DEBUG] Condição IF FALHOU. (paymentId ou status inválidos)");
            setMensagem('Não foi possível processar seu pagamento. (Código: URL_DADOS_INVALIDOS)');
        }
    }, [searchParams]);

    const registrarPedidoNoBackend = async (paymentId, status) => {
        console.log("[DEBUG] Chamando fetch() para /api/pagamentos/confirmar-pedido...");

        try {
            const response = await fetch('http://localhost:3000/api/pagamentos/confirmar-pedido', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId }), // Só precisamos enviar o paymentId
            });

            console.log("[DEBUG] Resposta do fetch:", response);

            if (!response.ok) {
                throw new Error('Falha no registro do pedido no backend');
            }

            const dadosPedido = await response.json();

            // Mensagem de sucesso baseada no status
            if (status === 'approved') {
                setMensagem(`Pedido #${dadosPedido.id_pedido} confirmado com sucesso!`);
            } else if (status === 'pending') {
                setMensagem(`Pedido #${dadosPedido.id_pedido} registrado. Aguardando pagamento.`);
            }

        } catch (error) {
            console.error("[DEBUG] Erro DENTRO do fetch:", error);
            setMensagem('Erro ao registrar seu pedido. (Código: FETCH_FAILED)');
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