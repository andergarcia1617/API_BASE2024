import { conmysql } from '../db.js';

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

export const postProductos = async (req, res) => {
    try {
      const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo } = req.body;
      const prod_imagen = req.file ? `/uploads/${req.file.filename}` : null;  // Obtener el nombre del archivo
  
      // Verificar si el producto ya existe
      const [fila] = await conmysql.query('Select * from productos where prod_codigo=?', [prod_codigo]);
      if (fila.length > 0) {
        return res.status(404).json({
          id: 0,
          message: 'Producto con código: ' + prod_codigo + ' ya está registrado'
        });
      }
  
      // Insertar el nuevo producto
      const [rows] = await conmysql.query('INSERT INTO productos (prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen) VALUES(?,?,?,?,?,?)',
        [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen]);
  
      res.send({
        id: rows.insertId,
        message: 'Producto registrado con éxito :)'
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  

export const putProductos = async (req, res) => {
    try {
        const { id } = req.params;
        const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen } = req.body;
        const [result] = await conmysql.query(
            'UPDATE productos SET prod_codigo=?, prod_nombre=?, prod_stock=?, prod_precio=?, prod_activo=?, prod_imagen=? WHERE prod_id=?',
            [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen, id]
        );
        if (result.affectedRows <= 0) return res.status(404).json({ message: 'Producto no encontrado' });

        const [rows] = await conmysql.query('SELECT * FROM productos WHERE prod_id=?', [id]);
        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({ message: 'Algo salió mal' });
    }
};

export const patchProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen } = req.body;
        const [result] = await conmysql.query(
            'UPDATE productos SET prod_codigo=IFNULL(?,prod_codigo), prod_nombre=IFNULL(?,prod_nombre), prod_stock=IFNULL(?,prod_stock), prod_precio=IFNULL(?,prod_precio), prod_activo=IFNULL(?,prod_activo), prod_imagen=IFNULL(?,prod_imagen) WHERE prod_id=?',
            [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen, id]
        );
        if (result.affectedRows <= 0) return res.status(404).json({ message: 'Producto no encontrado' });

        const [rows] = await conmysql.query('SELECT * FROM productos WHERE prod_id=?', [id]);
        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({ message: 'Algo salió mal' });
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
