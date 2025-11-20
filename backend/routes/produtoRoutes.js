const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/', produtoController.getAll);
router.get('/:id', produtoController.getById);

router.post('/', adminMiddleware, produtoController.uploadMiddleware, produtoController.create); 

router.put('/:id', adminMiddleware, produtoController.update); 
router.delete('/:id', adminMiddleware, produtoController.remove);

const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });




router.post(
    '/', 
    adminMiddleware, 
    upload.array('imagens', 5), 
    produtoController.create
);


router.put(
    '/:id', 
    adminMiddleware, 
    upload.array('imagens', 5), 
    produtoController.update 
);

router.delete('/:id', adminMiddleware, produtoController.remove);

module.exports = router;