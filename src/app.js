import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import clientesRoutes from './routes/clientes.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import productosRoutes from './routes/productos.routes.js';
import pedidos_detalleRoutes from './routes/pedidos_detalle.routes.js';
import pedidosRoutes from './routes/pedidos.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const corsOptions = { 
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api', clientesRoutes);
app.use('/api', usuariosRoutes);
app.use('/api', productosRoutes);
app.use('/api', pedidos_detalleRoutes);
app.use('/api', pedidosRoutes);

app.use((req, res, next) => {
    res.status(400).json({
        message: 'Endpoint not found'
    });
});

export default app;
