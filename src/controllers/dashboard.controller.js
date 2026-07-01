const pool = require('../config/db');
const Item = require('../models/item.model');

module.exports = {
  async index(req, res, next) {
    try {
      const [[{ totalItems }]] = await pool.query('SELECT COUNT(*) AS totalItems FROM items');
      const [[{ totalCategorias }]] = await pool.query('SELECT COUNT(*) AS totalCategorias FROM categorias');
      const [[{ valorInventario }]] = await pool.query(
        'SELECT COALESCE(SUM(stock * precio), 0) AS valorInventario FROM items'
      );
      const itemsBajoStock = await Item.findLowStock();

      res.render('dashboard/index', {
        pageTitle: 'Dashboard',
        totalItems,
        totalCategorias,
        valorInventario,
        itemsBajoStock
      });
    } catch (err) {
      next(err);
    }
  }
};
