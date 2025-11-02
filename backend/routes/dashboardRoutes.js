const express = require('express');
const router = express.Router();

// Importe as novas funções do controller
const {
    getKpiData,
    getBestSellers,
    getMonthlyRevenue,
    getRecentOrders,
    getOrderDetails,
    getAllPedidosAdmin,  // <-- Esta linha é crucial
    updatePedidoStatus   // <-- Esta linha é crucial
} = require('../controllers/dashboardController');

const adminMiddleware = require('../middlewares/adminMiddleware');

// Rotas de KPIs e gráficos (existentes)
router.get('/kpis', adminMiddleware, getKpiData);
router.get('/best-sellers', adminMiddleware, getBestSellers);
router.get('/monthly-revenue', adminMiddleware, getMonthlyRevenue);
router.get('/recent-orders', adminMiddleware, getRecentOrders);
router.get('/orders/:id', adminMiddleware, getOrderDetails);


// --- ESTA É A PARTE QUE ESTÁ FALTANDO NO SEU SERVIDOR ---

// Rota para buscar todos os pedidos com filtros
router.get('/orders/all', adminMiddleware, getAllPedidosAdmin);

// Rota para atualizar o status de um pedido
router.put('/orders/status/:id', adminMiddleware, updatePedidoStatus);

// --------------------------------------------------------


module.exports = router;