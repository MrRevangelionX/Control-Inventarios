const Categoria = require('../models/categoria.model');

module.exports = {
  async index(req, res, next) {
    try {
      const categorias = await Categoria.findAll();
      res.render('categorias/index', { pageTitle: 'Categorias', categorias });
    } catch (err) {
      next(err);
    }
  },

  nuevo(req, res) {
    res.render('categorias/form', { pageTitle: 'Nueva categoria', categoria: null });
  },

  async crear(req, res, next) {
    try {
      const { nombre, descripcion } = req.body;
      if (!nombre || !nombre.trim()) {
        req.flash('error', 'El nombre de la categoria es obligatorio');
        return res.redirect('/categorias/nueva');
      }
      await Categoria.create({ nombre: nombre.trim(), descripcion });
      req.flash('success', `Categoria "${nombre}" creada correctamente`);
      res.redirect('/categorias');
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        req.flash('error', 'Ya existe una categoria con ese nombre');
        return res.redirect('/categorias/nueva');
      }
      next(err);
    }
  },

  async editar(req, res, next) {
    try {
      const categoria = await Categoria.findById(req.params.id);
      if (!categoria) {
        req.flash('error', 'Categoria no encontrada');
        return res.redirect('/categorias');
      }
      res.render('categorias/form', { pageTitle: 'Editar categoria', categoria });
    } catch (err) {
      next(err);
    }
  },

  async actualizar(req, res, next) {
    try {
      const { nombre, descripcion } = req.body;
      if (!nombre || !nombre.trim()) {
        req.flash('error', 'El nombre de la categoria es obligatorio');
        return res.redirect(`/categorias/${req.params.id}/editar`);
      }
      await Categoria.update(req.params.id, { nombre: nombre.trim(), descripcion });
      req.flash('success', 'Categoria actualizada correctamente');
      res.redirect('/categorias');
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        req.flash('error', 'Ya existe una categoria con ese nombre');
        return res.redirect(`/categorias/${req.params.id}/editar`);
      }
      next(err);
    }
  },

  async eliminar(req, res, next) {
    try {
      const totalItems = await Categoria.countItems(req.params.id);
      if (totalItems > 0) {
        req.flash('error', 'No se puede eliminar: la categoria tiene items asociados');
        return res.redirect('/categorias');
      }
      await Categoria.remove(req.params.id);
      req.flash('success', 'Categoria eliminada correctamente');
      res.redirect('/categorias');
    } catch (err) {
      next(err);
    }
  }
};
