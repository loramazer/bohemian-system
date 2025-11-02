// src/pages/PaginaSucesso.jsx

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function PaginaSucesso() {
    const [searchParams] = useSearchParams();
    const [mensagem, setMensagem] = useState('Processando seu pagamento...');

    useEffect(() => {
        console.log("--- PÁGINA DE SUCESSO CARREGADA ---");

        try {
            const paymentId = searchParams.get('payment_id');
            const status = searchParams.get('status');
            console.log("[DEBUG] payment_id:", paymentId, "status:", status);

            // --- MUDANÇA: Não precisamos mais do localStorage ---
            // const dadosSalvosString = localStorage.getItem(...); // REMOVA ISSO

            if (paymentId && status === 'approved') {
                console.log("[DEBUG] Condição IF passou. Chamando backend...");

                // --- MUDANÇA: Enviar apenas o paymentId ---
                confirmarPagamentoNoBackend(paymentId);

                // localStorage.removeItem(...); // REMOVA ISSO

            } else if (status === 'pending') {
                console.log("[DEBUG] Pagamento pendente (PIX/Boleto). Aguardando webhook.");
                setMensagem('Seu pagamento está pendente. Você receberá a confirmação assim que for aprovado.');
            } else {
                console.error("[DEBUG] Condição IF FALHOU. Status:", status);
                setMensagem('Houve um problema ao processar seu pagamento. (Código: URL_DADOS_INVALIDOS)');
                // localStorage.removeItem(...); // REMOVA ISSO
            }

        } catch (error) {
            console.error("--- ERRO FATAL NO USEEFFECT ---", error);
            setMensagem('Erro crítico ao ler dados da página.');
        }

    }, [searchParams]);

    // --- MUDANÇA: Receber apenas 'paymentId' ---
    const confirmarPagamentoNoBackend = async (paymentId) => {
        console.log("[DEBUG] Chamando fetch() para /api/pagamentos/confirmar-pedido...");

        try {
            const response = await fetch('http://localhost:3000/api/pagamentos/confirmar-pedido', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // --- MUDANÇA: Enviar apenas 'paymentId' ---
                body: JSON.stringify({ paymentId }),
            });

            console.log("[DEBUG] Resposta do fetch:", response);

            if (!response.ok) {
                throw new Error('Falha na confirmação do backend');
            }

            const dadosPedido = await response.json();
            console.log("[DEBUG] Pedido confirmado! Resposta:", dadosPedido);
            setMensagem(`Pedido #${dadosPedido.id_pedido || dadosPedido.id} confirmado com sucesso!`);

        } catch (error) {
            console.error("[DEBUG] Erro DENTRO do fetch:", error);
            setMensagem('Erro ao confirmar seu pedido. (Código: FETCH_FAILED)');
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