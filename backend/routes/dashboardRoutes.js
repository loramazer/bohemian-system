const express = require('express');
const router = express.Router();

console.log("--- [DEBUG] Carregando dashboardRoutes.js ATUALIZADO ---");

// Importe as novas funções do controller
const {
    getKpiData,
    getBestSellers,
    getMonthlyRevenue,
    getRecentOrders,
    getOrderDetails,
    getAllPedidosAdmin,
    updatePedidoStatus
} = require('../controllers/dashboardController');

const adminMiddleware = require('../middlewares/adminMiddleware');

// Rotas de KPIs e gráficos (existentes)
router.get('/kpis', adminMiddleware, getKpiData);
router.get('/best-sellers', adminMiddleware, getBestSellers);
router.get('/monthly-revenue', adminMiddleware, getMonthlyRevenue);
router.get('/recent-orders', adminMiddleware, getRecentOrders);

// --- CORREÇÃO DEFINITIVA ---

// 1. Rota ESPECÍFICA vem primeiro
// Rota para buscar todos os pedidos com filtros
router.get('/orders/all', adminMiddleware, getAllPedidosAdmin);

// 2. Rota GENÉRICA (com parâmetro) vem depois
router.get('/orders/:id', adminMiddleware, getOrderDetails);

// Rota para atualizar o status de um pedido
router.put('/orders/status/:id', adminMiddleware, updatePedidoStatus);

// -------------------------------

module.exports = router;