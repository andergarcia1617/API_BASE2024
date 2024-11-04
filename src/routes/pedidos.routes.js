import {Router} from 'express';

import {getPedidos, getpedidosxid,postPedidos, putPedidos, patchPedidos, deletePedidos} from '../controladores/pedidosCtrl.js';
import { verifyToken } from '../middlewares/authMiddleware.js';



const router = Router();

// Armar nuestras rutas

router.get('/pedidos', verifyToken, getPedidos); // Select
router.get('/pedidos/:id', verifyToken, getpedidosxid); // Select por id
router.post('/pedidos',  postPedidos); // Insertar
router.put('/pedidos/:id', verifyToken, putPedidos); // Update completo
router.patch('/pedidos/:id', verifyToken, patchPedidos); // Update parcial
router.delete('/pedidos/:id', verifyToken, deletePedidos); // Eliminar

export default router;
