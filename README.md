# Control-Inventarios

Control y mantenimiento de inventarios con manejo de items por codigo y categoria.

## Stack

- Node.js + Express
- EJS como motor de plantillas
- MySQL / MariaDB
- CSS plano para estilos
- SweetAlert2 para alertas y notificaciones

## Funcionalidades

- **Categorias**: alta, edicion y baja de categorias (no se puede eliminar una categoria con items asociados).
- **Items**: alta, edicion y baja de items identificados por un **codigo unico**, asociados a una **categoria**, con stock, stock minimo, unidad de medida y precio. Listado con filtros por codigo/nombre, categoria y estado.
- **Movimientos de inventario**: registro de entradas, salidas y ajustes de stock; cada movimiento actualiza el stock del item de forma atomica y queda en el historial.
- **Dashboard**: resumen de items, categorias, valor total del inventario y alertas de items por debajo del stock minimo.

## Requisitos

- Node.js 18+
- Un servidor MySQL o MariaDB accesible

## Instalacion

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Crear el archivo `.env` a partir de `.env.example` y ajustar las credenciales de MySQL:

   ```bash
   cp .env.example .env
   ```

3. Crear la base de datos y las tablas ejecutando el script `database/schema.sql` en tu servidor MySQL (por ejemplo con un cliente `mysql` o una herramienta como MySQL Workbench/DBeaver):

   ```bash
   mysql -u root -p < database/schema.sql
   ```

   El script crea la base `control_inventarios`, las tablas `categorias`, `items` y `movimientos`, y algunos datos de ejemplo.

4. Iniciar el servidor:

   ```bash
   npm run dev   # con recarga automatica (nodemon)
   # o
   npm start
   ```

5. Abrir [http://localhost:3000](http://localhost:3000)

## Estructura del proyecto

```
server.js                  Punto de entrada de la app
src/
  config/db.js             Pool de conexion a MySQL
  models/                  Acceso a datos (categoria, item, movimiento)
  controllers/              Logica de cada modulo
  routes/                   Rutas Express
  views/                     Vistas EJS (dashboard, categorias, items, movimientos)
public/
  css/style.css             Estilos
database/
  schema.sql                Esquema de base de datos + datos de ejemplo
```
