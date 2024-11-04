import { Router } from 'express';
import { getUsuarios, getusuariosxid, postUsuario, putUsuario, patchUsuario, deleteUsuario, loginUsuario } from '../controladores/usuarios.Ctrl.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
const router = Router();

router.get('/usuarios', verifyToken, getUsuarios); 
router.get('/usuarios/:id', verifyToken, getusuariosxid); 
router.post('/usuarios', postUsuario); 
router.put('/usuarios/:id', verifyToken, putUsuario); 
router.patch('/usuarios/:id', verifyToken, patchUsuario); 
router.delete('/usuarios/:id', verifyToken, deleteUsuario); 
router.post('/usuarios/login',  loginUsuario);

export default router;
