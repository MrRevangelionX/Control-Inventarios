const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoria.controller');

router.get('/', categoriaController.index);
router.get('/nueva', categoriaController.nuevo);
router.post('/', categoriaController.crear);
router.get('/:id/editar', categoriaController.editar);
router.put('/:id', categoriaController.actualizar);
router.delete('/:id', categoriaController.eliminar);

module.exports = router;
