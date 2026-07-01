const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item.controller');

router.get('/', itemController.index);
router.get('/nuevo', itemController.nuevo);
router.post('/', itemController.crear);
router.get('/:id/editar', itemController.editar);
router.put('/:id', itemController.actualizar);
router.delete('/:id', itemController.eliminar);

module.exports = router;
