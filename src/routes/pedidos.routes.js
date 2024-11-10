import {Router} from 'express';

import {getPedidos, getpedidosxid,postPedidos, putPedidos, patchPedidos, deletePedidos} from '../controladores/pedidosCtrl.js';


const router = Router();

// Armar nuestras rutas

router.get('/pedidos', getPedidos); // Select
router.get('/pedidos/:id', getpedidosxid); // Select por id
router.post('/pedidos', postPedidos); // Insertar
router.put('/pedidos/:id', putPedidos); // Update completo
router.patch('/pedidos/:id', patchPedidos); // Update parcial
router.delete('/pedidos/:id', deletePedidos); // Eliminar

export default router;