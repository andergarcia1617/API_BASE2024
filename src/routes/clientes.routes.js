import {Router} from 'express';
import {getClientes, getclientesxid, postCliente, putCliente, patchCliente, deleteCliente} from '../controladores/clientesCtrl.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Armar nuestras rutas

router.get('/clientes', verifyToken, getClientes); 
router.get('/clientes/:id', verifyToken, getclientesxid); 
router.post('/clientes', verifyToken, postCliente); // Insertar
router.put('/clientes/:id', verifyToken, putCliente); // Update completo
router.patch('/clientes/:id', verifyToken, patchCliente); // Update parcial
router.delete('/clientes/:id', verifyToken, deleteCliente); // Eliminar

export default router;
