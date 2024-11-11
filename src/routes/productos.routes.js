import { Router } from 'express';
import multer from 'multer';
import { getProductos, getProductosxid, postProductos, putProductos, deleteProductos } from '../controladores/productosCtrl.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

// Rutas
router.get('/productos', getProductos);
router.get('/productos/:id', getProductosxid);
router.post('/productos', upload.single('prod_imagen'), postProductos);
router.put('/productos/:id', upload.single('prod_imagen'), putProductos);
router.delete('/productos/:id', deleteProductos);

export default router;
