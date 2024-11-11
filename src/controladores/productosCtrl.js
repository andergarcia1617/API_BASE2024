import { conmysql } from '../db.js';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const subirImagen = (file) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
            { resource_type: 'image' },
            (error, result) => {
                if (error) return reject(new Error("Error al subir imagen a Cloudinary"));
                resolve(result.secure_url); // Retorna la URL de la imagen
            }
        );
        uploadStream.end(file.buffer);
    });
};

const crearProductoEnBD = async (datosProducto) => {
    const query = 'INSERT INTO productos SET ?';
    try {
        const [result] = await conmysql.query(query, datosProducto);
        return { id: result.insertId, ...datosProducto };
    } catch (error) {
        throw new Error('Error al guardar el producto en la base de datos: ' + error.message);
    }
};

export const getProductos = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM productos');
        res.json({ datos: result, message: "La consulta se realizó con éxito" });
    } catch (error) {
        return res.status(500).json({ datos: null, message: 'Algo salió mal' });
    }
};

export const getProductosxid = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM productos WHERE prod_id=?', [req.params.id]);
        if (result.length <= 0) return res.status(404).json({ id: 0, message: "Producto no encontrado" });
        res.json(result[0]);
    } catch (error) {
        return res.status(500).json({ message: 'Algo salió mal' });
    }
};

// productosCtrl.js

export const postProductos = async (req, res) => {
    try {
        console.log("Archivo de imagen:", req.file); 
        console.log("Datos del producto:", req.body);

        // Subir la imagen a Cloudinary
        if (req.file) {
            const uploadedImageUrl = await subirImagen(req.file);
            req.body.prod_imagen = uploadedImageUrl;
        }

        // Crear el producto en la base de datos con los datos de req.body
        const nuevoProducto = await crearProductoEnBD(req.body);

        res.status(201).json({
            message: "Producto creado exitosamente",
            producto: nuevoProducto,
        });
    } catch (error) {
        console.error("Error al crear el producto:", error);
        res.status(500).json({
            message: "Error al crear el producto",
        });
    }
};



export const putProductos = async (req, res) => {
    try {
        console.log("Archivo de imagen:", req.file);
        console.log("Datos del producto:", req.body);

        if (req.file) {
            const uploadedImageUrl = await subirImagen(req.file);
            req.body.prod_imagen = uploadedImageUrl;
        }

        const productoActualizado = await actualizarProductoEnBD(req.params.id, req.body);

        res.status(200).json({
            message: "Producto actualizado exitosamente",
            producto: productoActualizado,
        });
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({
            message: "Error al actualizar el producto",
        });
    }
};


export const deleteProductos = async (req, res) => {
    try {
        const [result] = await conmysql.query('DELETE FROM productos WHERE prod_id=?', [req.params.id]);
        if (result.affectedRows <= 0) return res.status(404).json({ id: 0, message: "No se pudo eliminar el producto" });

        res.json({ id: 1, message: 'Producto eliminado con éxito :)' });
    } catch (error) {
        return res.status(500).json({ message: 'Algo salió mal' });
    }
};
