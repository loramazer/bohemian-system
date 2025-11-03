import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/HelpModal.css';

const AdminHelpContent = () => (
    <>
        <h2><i className="fas fa-user-shield"></i> Ajuda do Administrador</h2>
        
        <div className="help-section">
            <h3>Painel Principal</h3>
            <p><strong>Dashboard (<code>/dashboard</code>):</strong> Esta é sua central de controle. Aqui você vê métricas vitais da loja, como faturamento total, número de pedidos, e listas de produtos mais vendidos e pedidos recentes.</p>
        </div>
        
        <div className="help-section">
            <h3>Gerenciamento de Produtos</h3>
            <p><strong>Listar Produtos (<code>/admin/products</code>):</strong> Visualize todos os produtos cadastrados na loja. Você pode usar a busca para encontrar itens específicos e clicar em "Editar" ou "Excluir".</p>
            <p><strong>Adicionar Produto (<code>/admin/products/add</code>):</strong> Formulário para cadastrar um novo item. Preencha nome, descrição, preço, estoque e faça o upload das imagens.</p>
            <p><strong>Editar Produto (<code>/admin/products/edit/:id</code>):</strong> Página para atualizar as informações de um produto que já existe no catálogo.</p>
        </div>
        
        <div className="help-section">
            <h3>Gerenciamento de Pedidos</h3>
            <p><strong>Listar Pedidos (<code>/admin/orders</code>):</strong> Veja a lista completa de todos os pedidos feitos pelos clientes. Você pode filtrar os pedidos por status (ex: Pendente, Pago, Enviado).</p>
            <p><strong>Detalhes do Pedido (<code>/admin/orders/:id</code>):</strong> Visualize as informações completas de um único pedido, incluindo os produtos comprados, o endereço de entrega do cliente e o status do pagamento. É aqui que você pode atualizar o status do pedido (ex: "Em processamento" para "Enviado").</p>
        </div>
    </>
);


const UserHelpContent = () => (
    <>
        <h2><i className="fas fa-question-circle"></i> Ajuda do Usuário</h2>
        
        <div className="help-section">
            <h3>Navegação e Compras</h3>
            <p><strong>Página Inicial (<code>/</code>):</strong> A vitrine da nossa loja. Veja os destaques, promoções e novas coleções.</p>
            <p><strong>Catálogo (<code>/products</code>):</strong> Explore todos os nossos produtos. Você pode filtrar por categoria ou ordenar por preço.</p>
            <p><strong>Detalhes do Produto (<code>/product/:id</code>):</strong> Veja mais fotos, leia a descrição completa, selecione tamanho (se aplicável) e adicione o item ao seu carrinho.</p>
        </div>

        <div className="help-section">
            <h3>Processo de Compra</h3>
            <p><strong>Carrinho (<code>/cart</code>):</strong> Revise todos os itens que você selecionou. Aqui você pode alterar quantidades ou remover produtos antes de finalizar.</p>
            <p><strong>Checkout (<code>/checkout</code>):</strong> O último passo! Informe seu endereço de entrega e escolha a forma de pagamento para concluir sua compra.</p>
            <p><strong>Sucesso do Pedido (<code>/pedido/sucesso</code>):</strong> Página de confirmação que aparece após seu pagamento ser aprovado. Obrigado por comprar conosco!</p>
        </div>

        <div className="help-section">
            <h3>Minha Conta</h3>
            <p><strong>Login (<code>/login</code>):</strong> Acesse sua conta para ver seus pedidos e gerenciar seus dados.</p>
            <p><strong>Cadastro (<code>/register</code>):</strong> Crie uma conta para salvar seus endereços e ter um histórico de compras.</p>
            <p><strong>Minha Conta (<code>/minha-conta</code>):</strong> (Após o login) Altere seus dados pessoais, senha e gerencie seus endereços cadastrados.</p>
            <p><strong>Meus Pedidos (<code>/meus-pedidos</code>):</strong> Acompanhe o status de entrega de todos os pedidos que você já fez.</p>
            <p><strong>Lista de Desejos (<code>/wishlist</code>):</strong> Veja os produtos que você marcou com <i className="fas fa-heart"></i> para comprar mais tarde.</p>
            <p><strong>Recuperar Senha (<code>/forgot-password</code>):</strong> Esqueceu sua senha? Insira seu e-mail aqui para receber um link de redefinição.</p>
        </div>
        
        <div className="help-section">
            <h3>Sobre a Loja</h3>
            <p><strong>Sobre Nós (<code>/sobre-nos</code>):</strong> Conheça mais sobre a nossa história e o que nos inspira.</p>
            <p><strong>Contato (<code>/contato</code>):</strong> Tem alguma dúvida? Envie-nos uma mensagem através do formulário de contato.</p>
        </div>
    </>
);


const HelpModal = ({ isVisible, onClose }) => {

  const { user } = useContext(AuthContext); 

  const isAdmin = user && user.admin === 1;

  if (!isVisible) {
    return null;
  }

  const handleOverlayClick = (e) => {
    if (e.target.id === 'help-modal-overlay') {
      onClose();
    }
  };

  return (
    <div className="help-modal-overlay" id="help-modal-overlay" onClick={handleOverlayClick}>
      <div className="help-modal-content">
        <button className="help-modal-close" onClick={onClose}>
          &times;
        </button>
        
        {/* Renderiza o conteúdo com base no tipo de usuário */}
        {isAdmin ? <AdminHelpContent /> : <UserHelpContent />}
        
        <div className="help-modal-footer">
            Pressione <strong>ESC</strong> ou <strong>F1</strong> para fechar.
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
