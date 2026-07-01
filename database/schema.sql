-- Esquema de base de datos para Control y Mantenimiento de Inventarios
CREATE DATABASE IF NOT EXISTS control_inventarios
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE control_inventarios;

-- Categorias de items
CREATE TABLE IF NOT EXISTS categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Items del inventario, identificados por codigo unico y asociados a una categoria
CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(50) NOT NULL UNIQUE,
  nombre VARCHAR(150) NOT NULL,
  descripcion VARCHAR(255) NULL,
  categoria_id INT NOT NULL,
  unidad_medida VARCHAR(30) NOT NULL DEFAULT 'unidad',
  stock INT NOT NULL DEFAULT 0,
  stock_minimo INT NOT NULL DEFAULT 0,
  precio DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  estado ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_items_categoria FOREIGN KEY (categoria_id)
    REFERENCES categorias(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Movimientos de inventario: entradas, salidas y ajustes de stock
CREATE TABLE IF NOT EXISTS movimientos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_id INT NOT NULL,
  tipo ENUM('entrada', 'salida', 'ajuste') NOT NULL,
  cantidad INT NOT NULL,
  stock_anterior INT NOT NULL,
  stock_nuevo INT NOT NULL,
  motivo VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_movimientos_item FOREIGN KEY (item_id)
    REFERENCES items(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_items_categoria ON items(categoria_id);
CREATE INDEX idx_movimientos_item ON movimientos(item_id);

-- Datos de ejemplo
INSERT INTO categorias (nombre, descripcion) VALUES
  ('Electronica', 'Equipos y componentes electronicos'),
  ('Oficina', 'Insumos y articulos de oficina'),
  ('Limpieza', 'Productos de limpieza e higiene')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

INSERT INTO items (codigo, nombre, descripcion, categoria_id, unidad_medida, stock, stock_minimo, precio) VALUES
  ('ELEC-001', 'Mouse inalambrico', 'Mouse optico inalambrico USB', 1, 'unidad', 25, 5, 12.50),
  ('OFIC-001', 'Resma de papel carta', 'Papel bond carta 75g', 2, 'paquete', 40, 10, 4.75),
  ('LIMP-001', 'Desinfectante multiusos', 'Desinfectante 1 litro', 3, 'botella', 8, 10, 3.20)
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);
