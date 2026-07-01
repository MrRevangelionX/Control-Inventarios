const pool = require('../config/db');

const Categoria = {
  async findAll() {
    const [rows] = await pool.query(
      `SELECT c.*, COUNT(i.id) AS total_items
       FROM categorias c
       LEFT JOIN items i ON i.categoria_id = c.id
       GROUP BY c.id
       ORDER BY c.nombre ASC`
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM categorias WHERE id = ?', [id]);
    return rows[0];
  },

  async create({ nombre, descripcion }) {
    const [result] = await pool.query(
      'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
      [nombre, descripcion || null]
    );
    return result.insertId;
  },

  async update(id, { nombre, descripcion }) {
    await pool.query(
      'UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?',
      [nombre, descripcion || null, id]
    );
  },

  async remove(id) {
    await pool.query('DELETE FROM categorias WHERE id = ?', [id]);
  },

  async countItems(id) {
    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM items WHERE categoria_id = ?', [id]);
    return rows[0].total;
  }
};

module.exports = Categoria;
