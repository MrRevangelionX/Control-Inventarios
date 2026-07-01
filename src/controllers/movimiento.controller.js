const Movimiento = require('../models/movimiento.model');
const Item = require('../models/item.model');

module.exports = {
  async index(req, res, next) {
    try {
      const { item_id } = req.query;
      const [movimientos, items] = await Promise.all([
        Movimiento.findAll({ item_id }),
        Item.findAll()
      ]);
      res.render('movimientos/index', { pageTitle: 'Movimientos', movimientos, items, filtroItemId: item_id || '' });
    } catch (err) {
      next(err);
    }
  },

  async nuevo(req, res, next) {
    try {
      const items = await Item.findAll({ estado: 'activo' });
      res.render('movimientos/form', {
        pageTitle: 'Nuevo movimiento',
        items,
        itemPreseleccionado: req.query.item_id || ''
      });
    } catch (err) {
      next(err);
    }
  },

  async crear(req, res, next) {
    try {
      const { item_id, tipo, cantidad, motivo } = req.body;
      const cantidadNum = parseInt(cantidad, 10);

      if (!item_id || !tipo || !cantidadNum || cantidadNum <= 0) {
        req.flash('error', 'Item, tipo y una cantidad valida son obligatorios');
        return res.redirect('/movimientos/nuevo');
      }

      await Movimiento.registrar({ item_id, tipo, cantidad: cantidadNum, motivo });
      req.flash('success', 'Movimiento registrado y stock actualizado correctamente');
      res.redirect('/movimientos');
    } catch (err) {
      req.flash('error', err.message || 'No se pudo registrar el movimiento');
      res.redirect('/movimientos/nuevo');
    }
  }
};
