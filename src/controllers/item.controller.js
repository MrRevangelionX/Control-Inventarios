const Item = require('../models/item.model');
const Categoria = require('../models/categoria.model');

module.exports = {
  async index(req, res, next) {
    try {
      const { codigo, categoria_id, estado } = req.query;
      const [items, categorias] = await Promise.all([
        Item.findAll({ codigo, categoria_id, estado }),
        Categoria.findAll()
      ]);
      res.render('items/index', {
        pageTitle: 'Items',
        items,
        categorias,
        filtros: { codigo: codigo || '', categoria_id: categoria_id || '', estado: estado || '' }
      });
    } catch (err) {
      next(err);
    }
  },

  async nuevo(req, res, next) {
    try {
      const categorias = await Categoria.findAll();
      res.render('items/form', { pageTitle: 'Nuevo item', item: null, categorias });
    } catch (err) {
      next(err);
    }
  },

  async crear(req, res, next) {
    try {
      const { codigo, nombre, descripcion, categoria_id, unidad_medida, stock, stock_minimo, precio } = req.body;

      if (!codigo || !codigo.trim() || !nombre || !nombre.trim() || !categoria_id) {
        req.flash('error', 'Codigo, nombre y categoria son obligatorios');
        return res.redirect('/items/nuevo');
      }

      await Item.create({
        codigo: codigo.trim().toUpperCase(),
        nombre: nombre.trim(),
        descripcion,
        categoria_id,
        unidad_medida: unidad_medida || 'unidad',
        stock: parseInt(stock, 10) || 0,
        stock_minimo: parseInt(stock_minimo, 10) || 0,
        precio: parseFloat(precio) || 0
      });

      req.flash('success', `Item "${codigo}" creado correctamente`);
      res.redirect('/items');
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        req.flash('error', 'Ya existe un item con ese codigo');
        return res.redirect('/items/nuevo');
      }
      next(err);
    }
  },

  async editar(req, res, next) {
    try {
      const [item, categorias] = await Promise.all([
        Item.findById(req.params.id),
        Categoria.findAll()
      ]);
      if (!item) {
        req.flash('error', 'Item no encontrado');
        return res.redirect('/items');
      }
      res.render('items/form', { pageTitle: 'Editar item', item, categorias });
    } catch (err) {
      next(err);
    }
  },

  async actualizar(req, res, next) {
    try {
      const { nombre, descripcion, categoria_id, unidad_medida, stock_minimo, precio, estado } = req.body;

      if (!nombre || !nombre.trim() || !categoria_id) {
        req.flash('error', 'Nombre y categoria son obligatorios');
        return res.redirect(`/items/${req.params.id}/editar`);
      }

      await Item.update(req.params.id, {
        nombre: nombre.trim(),
        descripcion,
        categoria_id,
        unidad_medida: unidad_medida || 'unidad',
        stock_minimo: parseInt(stock_minimo, 10) || 0,
        precio: parseFloat(precio) || 0,
        estado: estado === 'inactivo' ? 'inactivo' : 'activo'
      });

      req.flash('success', 'Item actualizado correctamente');
      res.redirect('/items');
    } catch (err) {
      next(err);
    }
  },

  async eliminar(req, res, next) {
    try {
      await Item.remove(req.params.id);
      req.flash('success', 'Item eliminado correctamente');
      res.redirect('/items');
    } catch (err) {
      next(err);
    }
  }
};
