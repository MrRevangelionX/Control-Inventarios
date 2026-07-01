const express = require('express');
const router = express.Router();
const movimientoController = require('../controllers/movimiento.controller');

router.get('/', movimientoController.index);
router.get('/nuevo', movimientoController.nuevo);
router.post('/', movimientoController.crear);

module.exports = router;
