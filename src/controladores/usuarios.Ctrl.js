import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import { conmysql } from '../db.js';

// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM usuarios');
        res.json(result);
    } catch (error) {
        return res.status(500).json({ message: "Error al consultar usuario" });
    }
};

// Obtener usuario por ID
export const getusuariosxid = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM usuarios WHERE cli_id=?', [req.params.id]);
        if (result.length <= 0) return res.status(404).json({ cli_id: 0, message: "Usuario no encontrado" });
        res.json(result[0]);
    } catch (error) {
        return res.status(500).json({ message: 'Error del lado del servidor' });
    }
};


export const loginUsuario = async (req, res) => {
    try {
        const { usr_usuario, usr_clave } = req.body;

        // Buscar al usuario en la base de datos
        const [user] = await conmysql.query('SELECT * FROM usuarios WHERE usr_usuario = ?', [usr_usuario]);

        // Si el usuario no existe, enviar un mensaje de error
        if (user.length === 0) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        // Comparar la contraseña ingresada con la almacenada
        const passwordMatch = await bcrypt.compare(usr_clave, user[0].usr_clave);

        if (!passwordMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        // Si la contraseña es correcta, generar un token JWT
        const token = jwt.sign({ id: user[0].usr_id }, JWT_SECRET, { expiresIn: '1h' });

        // Enviar el token de vuelta al usuario
        res.json({ token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al autenticar usuario' });
    }
};


export const postUsuario = async (req, res) => {
    try {
        const { usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo } = req.body;

        // Generar salt y encriptar la clave
        const salt = await bcrypt.genSalt(2);
        const hashedClave = await bcrypt.hash(usr_clave, salt);

        // Insertar el usuario en la base de datos
        const [rows] = await conmysql.query(
            'INSERT INTO usuarios (usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo) VALUES (?, ?, ?, ?, ?, ?)',
            [usr_usuario, hashedClave, usr_nombre, usr_telefono, usr_correo, usr_activo]
        );

        // Enviar respuesta al cliente
        res.send({ id: rows.insertId });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al lado del servidor' });
    }
};


export const putUsuario = async (req, res) => {
    try {
        const id = req.params.id;
        const { usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo } = req.body;

        const [result] = await conmysql.query(
            'UPDATE usuarios SET usr_usuario=?, usr_clave=?, usr_nombre=?, usr_telefono=?, usr_correo=?, usr_activo=? WHERE usr_id=?',
            [usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo, id]
        );

        if (result.affectedRows <= 0) return res.status(404).json({ message: "Usuario no encontrado" });
        const [rows] = await conmysql.query('SELECT * FROM usuarios WHERE usr_id=?', [id]);
        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({ message: 'Error al lado del servidor' });
    }
};


export const patchUsuario = async (req, res) => {
    try {
        const id = req.params.id;
        const { usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo } = req.body;

        const [result] = await conmysql.query(
            'UPDATE usuarios SET usr_usuario = IFNULL(?, usr_usuario), usr_clave = IFNULL(?, usr_clave), usr_nombre = IFNULL(?, usr_nombre), usr_telefono = IFNULL(?, usr_telefono), usr_correo = IFNULL(?, usr_correo), usr_activo = IFNULL(?, usr_activo) WHERE usr_id = ?',
            [usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo, id]
        );

        if (result.affectedRows <= 0) return res.status(404).json({ message: "Usuario no encontrado" });
        const [rows] = await conmysql.query('SELECT * FROM usuarios WHERE usr_id = ?', [id]);
        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({ message: 'Error al lado del servidor' });
    }
};


export const deleteUsuario = async (req, res) => {
    try {
        const id = req.params.id;
        const [rows] = await conmysql.query('DELETE FROM usuarios WHERE usr_id = ?', [id]);

        if (rows.affectedRows <= 0) return res.status(400).json({ id: 0, message: "No se pudo eliminar el usuario" });
        res.sendStatus(202);
    } catch (error) {
        return res.status(500).json({ message: "Error del lado del servidor" });
    }
};
