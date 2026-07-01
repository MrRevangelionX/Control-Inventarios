require('dotenv').config();

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');

const dashboardRoutes = require('./src/routes/dashboard.routes');
const categoriaRoutes = require('./src/routes/categoria.routes');
const itemRoutes = require('./src/routes/item.routes');
const movimientoRoutes = require('./src/routes/movimiento.routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'control-inventarios-secret',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', dashboardRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/items', itemRoutes);
app.use('/movimientos', movimientoRoutes);

app.use((req, res) => {
  res.status(404).render('404');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error', { message: err.message || 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor de Control de Inventarios corriendo en http://localhost:${PORT}`);
});
