import {Router} from 'express';
import { getpedidos_detalle, postpedidos_detalle, getpedidos_detallexid, putpedidos_detalle, patchpedidos_detalle, deletepedidos_detalle} from '../controladores/pedidos_detalleCtrl.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Armar nuestras rutas

router.get('/pedidos_detalle', verifyToken, getpedidos_detalle); // Select
router.get('/pedidos_detalle/:id', verifyToken, getpedidos_detallexid); // Select por id
router.post('/pedidos_detalle', verifyToken, postpedidos_detalle); // Insertar
router.put('/pedidos_detalle/:id',verifyToken, putpedidos_detalle); // Update completo
router.patch('/pedidos_detalle/:id', verifyToken, patchpedidos_detalle); // Update parcial
router.delete('/pedidos_detalle/:id', verifyToken, deletepedidos_detalle); // Eliminar

export default router;
