import { Router } from 'express';
import multer from 'multer';
import { getProductos, getProductosxid, postProductos, putProductos, patchProducto, deleteProductos } from '../controladores/productosCtrl.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Carpeta donde se guardan las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });
const router = Router();

// Rutas
router.get('/productos', getProductos);
router.get('/productos/:id', getProductosxid);
router.post('/productos', upload.single('prod_imagen'), postProductos);
router.put('/productos/:id', putProductos);
router.patch('/productos/:id', patchProducto);
router.delete('/productos/:id', deleteProductos);

export default router;
