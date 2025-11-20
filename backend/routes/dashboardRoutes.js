const express = require('express');
const router = express.Router();

console.log("--- [DEBUG] Carregando dashboardRoutes.js ATUALIZADO ---");

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

router.get('/kpis', adminMiddleware, getKpiData);
router.get('/best-sellers', adminMiddleware, getBestSellers);
router.get('/monthly-revenue', adminMiddleware, getMonthlyRevenue);
router.get('/recent-orders', adminMiddleware, getRecentOrders);


router.get('/orders/all', adminMiddleware, getAllPedidosAdmin);

router.get('/orders/:id', adminMiddleware, getOrderDetails);

router.put('/orders/status/:id', adminMiddleware, updatePedidoStatus);

module.exports = router;