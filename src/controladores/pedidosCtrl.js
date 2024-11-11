import { conmysql } from '../db.js';

export const getPedidos = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM pedidos');
        res.json(result);
    } catch (error) {
        return res.status(500).json({ message: "Error al consultar pedidos" });
    }
}



export const getpedidosxid = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM pedidos WHERE ped_id = ?', [req.params.id]);
        if (result.length <= 0) return res.status(404).json({ ped_id: 0, message: "Pedido no encontrado" });
        res.json(result[0]);
    } catch (error) {
        return res.status(500).json({ message: 'Error del lado del servidor' });
    }
}

export const postPedidos = async (req, res) => {
    try {
        const { cli_id, ped_fecha, usr_id, ped_estado, detalles } = req.body;

        // Crear el pedido
        const [rows] = await conmysql.query(
            'INSERT INTO pedidos (cli_id, ped_fecha, usr_id, ped_estado) VALUES (?, ?, ?, ?)',
            [cli_id, ped_fecha, usr_id, ped_estado]
        );
        const ped_id = rows.insertId;

        // Insertar los detalles del pedido
        for (const detalle of detalles) {
            await conmysql.query(
                'INSERT INTO pedidos_detalle (prod_id, ped_id, det_cantidad, det_precio) VALUES (?, ?, ?, ?)',
                [detalle.prod_id, ped_id, detalle.cantidad, detalle.prod_precio]
            );
        }

        res.send({ id: ped_id, message: 'Pedido creado con éxito' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al crear el pedido' });
    }
};


export const putPedidos = async (req, res) => {
    try {
        const id = req.params.id;
        const { cli_id, ped_fecha, usr_id, ped_estado } = req.body;
        const [result] = await conmysql.query(
            'UPDATE pedidos SET cli_id = ?, ped_fecha = ?, usr_id = ?, ped_estado = ? WHERE ped_id = ?',
            [cli_id, ped_fecha, usr_id, ped_estado, id]
        );

        if (result.affectedRows <= 0) return res.status(404).json({ message: "Pedido no encontrado" });

        const [rows] = await conmysql.query('SELECT * FROM pedidos WHERE ped_id = ?', [id]);
        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({ message: 'Error al lado del servidor' });
    }
}

export const patchPedidos = async (req, res) => {
    try {
        const id = req.params.id;
        const { cli_id, ped_fecha, usr_id, ped_estado } = req.body;
        const [result] = await conmysql.query(
            'UPDATE pedidos SET cli_id = IFNULL(?, cli_id), ped_fecha = IFNULL(?, ped_fecha), usr_id = IFNULL(?, usr_id), ped_estado = IFNULL(?, ped_estado) WHERE ped_id = ?',
            [cli_id, ped_fecha, usr_id, ped_estado, id]
        );

        if (result.affectedRows <= 0) return res.status(404).json({ message: "Pedido no encontrado" });

        const [rows] = await conmysql.query('SELECT * FROM pedidos WHERE ped_id = ?', [id]);
        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({ message: 'Error al lado del servidor' });
    }
}

export const deletePedidos = async (req, res) => {
    try {
        const [result] = await conmysql.query('DELETE FROM pedidos WHERE ped_id = ?', [req.params.id]);
        
        if (result.affectedRows <= 0) return res.status(404).json({ id: 0, message: "No se pudo eliminar el pedido" });
        
        res.sendStatus(202);  // Envía un código de estado 202 para indicar éxito en la eliminación
    } catch (error) {
        return res.status(500).json({ message: "Error del lado del servidor" });
    }
}