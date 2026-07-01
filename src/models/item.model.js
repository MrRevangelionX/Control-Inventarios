const pool = require('../config/db');

const BASE_SELECT = `
  SELECT i.*, c.nombre AS categoria_nombre
  FROM items i
  JOIN categorias c ON c.id = i.categoria_id
`;

const Item = {
  async findAll({ codigo, categoria_id, estado } = {}) {
    const conditions = [];
    const params = [];

    if (codigo) {
      conditions.push('(i.codigo LIKE ? OR i.nombre LIKE ?)');
      params.push(`%${codigo}%`, `%${codigo}%`);
    }
    if (categoria_id) {
      conditions.push('i.categoria_id = ?');
      params.push(categoria_id);
    }
    if (estado) {
      conditions.push('i.estado = ?');
      params.push(estado);
    }

    let sql = BASE_SELECT;
    if (conditions.length) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY i.codigo ASC';

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(`${BASE_SELECT} WHERE i.id = ?`, [id]);
    return rows[0];
  },

  async findByCodigo(codigo) {
    const [rows] = await pool.query('SELECT * FROM items WHERE codigo = ?', [codigo]);
    return rows[0];
  },

  async findLowStock() {
    const [rows] = await pool.query(
      `${BASE_SELECT} WHERE i.stock <= i.stock_minimo AND i.estado = 'activo' ORDER BY i.stock ASC`
    );
    return rows;
  },

  async create({ codigo, nombre, descripcion, categoria_id, unidad_medida, stock, stock_minimo, precio }) {
    const [result] = await pool.query(
      `INSERT INTO items (codigo, nombre, descripcion, categoria_id, unidad_medida, stock, stock_minimo, precio)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [codigo, nombre, descripcion || null, categoria_id, unidad_medida, stock || 0, stock_minimo || 0, precio || 0]
    );
    return result.insertId;
  },

  async update(id, { nombre, descripcion, categoria_id, unidad_medida, stock_minimo, precio, estado }) {
    await pool.query(
      `UPDATE items
       SET nombre = ?, descripcion = ?, categoria_id = ?, unidad_medida = ?, stock_minimo = ?, precio = ?, estado = ?
       WHERE id = ?`,
      [nombre, descripcion || null, categoria_id, unidad_medida, stock_minimo || 0, precio || 0, estado, id]
    );
  },

  async remove(id) {
    await pool.query('DELETE FROM items WHERE id = ?', [id]);
  },

  async updateStock(connection, id, nuevoStock) {
    await connection.query('UPDATE items SET stock = ? WHERE id = ?', [nuevoStock, id]);
  }
};

module.exports = Item;
