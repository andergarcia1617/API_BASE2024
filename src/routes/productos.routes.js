import { Router } from 'express';
import { getProductos, getproductosxid, postProducto, putProducto, patchProducto, deleteProducto } from '../controladores/productos.Ctrl.js';
import multer from 'multer';

const router = Router();

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage }); // Initialize multer with storage configuration

// Set up routes
router.get('/productos', getProductos); // Select
router.get('/productos/:id', getproductosxid); // Select by id
router.post('/productos', upload.single('image'), postProducto); // Insert with image upload
router.put('/productos/:id', putProducto); // Full update
router.patch('/productos/:id', patchProducto); // Partial update
router.delete('/productos/:id', deleteProducto); // Delete

export default router;
