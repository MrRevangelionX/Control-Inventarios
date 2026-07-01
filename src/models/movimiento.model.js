const pool = require('../config/db');

const Movimiento = {
  async findAll({ item_id } = {}) {
    let sql = `
      SELECT m.*, i.codigo AS item_codigo, i.nombre AS item_nombre
      FROM movimientos m
      JOIN items i ON i.id = m.item_id
    `;
    const params = [];
    if (item_id) {
      sql += ' WHERE m.item_id = ?';
      params.push(item_id);
    }
    sql += ' ORDER BY m.created_at DESC, m.id DESC';

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  // Registra un movimiento y actualiza el stock del item de forma atomica
  async registrar({ item_id, tipo, cantidad, motivo }) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [itemRows] = await connection.query(
        'SELECT stock FROM items WHERE id = ? FOR UPDATE',
        [item_id]
      );
      if (!itemRows.length) {
        throw new Error('El item no existe');
      }

      const stockAnterior = itemRows[0].stock;
      let stockNuevo;

      if (tipo === 'entrada') {
        stockNuevo = stockAnterior + cantidad;
      } else if (tipo === 'salida') {
        stockNuevo = stockAnterior - cantidad;
        if (stockNuevo < 0) {
          throw new Error('Stock insuficiente para realizar la salida');
        }
      } else if (tipo === 'ajuste') {
        stockNuevo = cantidad;
      } else {
        throw new Error('Tipo de movimiento invalido');
      }

      await connection.query('UPDATE items SET stock = ? WHERE id = ?', [stockNuevo, item_id]);

      await connection.query(
        `INSERT INTO movimientos (item_id, tipo, cantidad, stock_anterior, stock_nuevo, motivo)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [item_id, tipo, cantidad, stockAnterior, stockNuevo, motivo || null]
      );

      await connection.commit();
      return { stockAnterior, stockNuevo };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
};

module.exports = Movimiento;
