CREATE TABLE `password_resets` (
  `id_reset` INT NOT NULL AUTO_INCREMENT,
  `fk_cliente_id` INT NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  PRIMARY KEY (`id_reset`),
  UNIQUE KEY `token_UNIQUE` (`token`),
  FOREIGN KEY (`fk_cliente_id`) REFERENCES `cliente` (`id_cliente`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;