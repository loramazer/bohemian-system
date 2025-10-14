-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: bohemian
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `descricao` text,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cidade`
--

DROP TABLE IF EXISTS `cidade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cidade` (
  `id_cidade` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `sigla_UF` char(2) NOT NULL,
  PRIMARY KEY (`id_cidade`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `endereco`
--

DROP TABLE IF EXISTS `endereco`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `endereco` (
  `id_endereco` int NOT NULL AUTO_INCREMENT,
  `numero` varchar(10) DEFAULT NULL,
  `complemento` varchar(100) DEFAULT NULL,
  `id_cidade` int NOT NULL,
  `cep` varchar(8) DEFAULT NULL,
  `nome` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_endereco`),
  KEY `endereco_ibfk_1` (`id_cidade`),
  CONSTRAINT `endereco_ibfk_1` FOREIGN KEY (`id_cidade`) REFERENCES `cidade` (`id_cidade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_cep_format` CHECK (regexp_like(`cep`,_utf8mb4'^[0-9]{8}$'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `faturamento_mensal`
--

DROP TABLE IF EXISTS `faturamento_mensal`;
/*!50001 DROP VIEW IF EXISTS `faturamento_mensal`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `faturamento_mensal` AS SELECT 
 1 AS `mes`,
 1 AS `total_faturado`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `forma_pagamento`
--

DROP TABLE IF EXISTS `forma_pagamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forma_pagamento` (
  `id_forma_pagamento` int NOT NULL AUTO_INCREMENT,
  `descricao` varchar(100) NOT NULL,
  `status_transacao` enum('pending','approved','authorized','in_process','in_mediation','rejected','cancelled','refunded','charged_back') NOT NULL DEFAULT 'pending',
  `codigo_pagamento` varchar(100) DEFAULT NULL,
  `id_transacao_mp` varchar(100) DEFAULT NULL,
  `codigo_gateway` varchar(100) DEFAULT NULL,
  `data_pagamento` date DEFAULT NULL,
  `qr_code` text,
  `qr_code_url` text,
  PRIMARY KEY (`id_forma_pagamento`),
  UNIQUE KEY `id_transacao_mp` (`id_transacao_mp`),
  UNIQUE KEY `id_transacao_mp_2` (`id_transacao_mp`),
  CONSTRAINT `chk_dt_pago` CHECK ((((`status_transacao` = _utf8mb4'approved') and (`data_pagamento` is not null)) or ((`status_transacao` <> _utf8mb4'approved') and (`data_pagamento` is null))))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `item_carrinho`
--

DROP TABLE IF EXISTS `item_carrinho`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_carrinho` (
  `id_item_carrinho` int NOT NULL AUTO_INCREMENT,
  `id_produto` int DEFAULT NULL,
  `quantidade` int NOT NULL,
  `preco_unitario` decimal(10,2) NOT NULL,
  `id_carrinho` int DEFAULT NULL,
  PRIMARY KEY (`id_item_carrinho`),
  KEY `fk_itemcarrinho_produto` (`id_produto`),
  KEY `fk_itemcarrinho_carrinho` (`id_carrinho`),
  CONSTRAINT `fk_itemcarrinho_carrinho` FOREIGN KEY (`id_carrinho`) REFERENCES `carrinho` (`id_carrinho`),
  CONSTRAINT `fk_itemcarrinho_produto` FOREIGN KEY (`id_produto`) REFERENCES `produto` (`id_produto`),
  CONSTRAINT `item_carrinho_chk_1` CHECK ((`quantidade` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `itempedido`
--

DROP TABLE IF EXISTS `itempedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itempedido` (
  `id_itemPedido` int NOT NULL AUTO_INCREMENT,
  `quantidade` int NOT NULL,
  `precoUnitario` decimal(10,2) NOT NULL,
  `fk_pedido_id_pedido` int NOT NULL,
  `fk_produto_id_produto` int NOT NULL,
  PRIMARY KEY (`id_itemPedido`),
  KEY `fk_produto_id_produto` (`fk_produto_id_produto`),
  KEY `itempedido_ibfk_1` (`fk_pedido_id_pedido`),
  CONSTRAINT `itempedido_ibfk_1` FOREIGN KEY (`fk_pedido_id_pedido`) REFERENCES `pedido` (`id_pedido`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `itempedido_ibfk_2` FOREIGN KEY (`fk_produto_id_produto`) REFERENCES `produto` (`id_produto`),
  CONSTRAINT `chk_preco_unit_pos` CHECK ((`precoUnitario` >= 0)),
  CONSTRAINT `chk_quantidade_pos` CHECK ((`quantidade` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_resets` (
  `id_reset` int NOT NULL AUTO_INCREMENT,
  `fk_cliente_id` int NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `fk_usuario_id` int NOT NULL,
  PRIMARY KEY (`id_reset`),
  UNIQUE KEY `token_UNIQUE` (`token`),
  KEY `fk_passwordresets_usuario` (`fk_usuario_id`),
  CONSTRAINT `fk_passwordresets_usuario` FOREIGN KEY (`fk_usuario_id`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pedido`
--

DROP TABLE IF EXISTS `pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido` (
  `id_pedido` int NOT NULL AUTO_INCREMENT,
  `data_entrega` date DEFAULT NULL,
  `dataPedido` date NOT NULL,
  `fk_cliente_id_cliente` int NOT NULL,
  `fk_forma_pagamento_id_forma_pagamento` int NOT NULL,
  `fk_endereco_id_endereco` int NOT NULL,
  PRIMARY KEY (`id_pedido`),
  KEY `fk_cliente_id_cliente` (`fk_cliente_id_cliente`),
  KEY `fk_forma_pagamento_id_forma_pagamento` (`fk_forma_pagamento_id_forma_pagamento`),
  KEY `fk_endereco_id_endereco` (`fk_endereco_id_endereco`),
  CONSTRAINT `pedido_ibfk_2` FOREIGN KEY (`fk_forma_pagamento_id_forma_pagamento`) REFERENCES `forma_pagamento` (`id_forma_pagamento`),
  CONSTRAINT `pedido_ibfk_3` FOREIGN KEY (`fk_endereco_id_endereco`) REFERENCES `endereco` (`id_endereco`),
  CONSTRAINT `chk_data_entrega` CHECK (((`data_entrega` is null) or (`data_entrega` >= `dataPedido`)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `pedidos_da_semana`
--

DROP TABLE IF EXISTS `pedidos_da_semana`;
/*!50001 DROP VIEW IF EXISTS `pedidos_da_semana`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `pedidos_da_semana` AS SELECT 
 1 AS `id_pedido`,
 1 AS `data_entrega`,
 1 AS `dataPedido`,
 1 AS `fk_cliente_id_cliente`,
 1 AS `fk_forma_pagamento_id_forma_pagamento`,
 1 AS `fk_endereco_id_endereco`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `produto`
--

DROP TABLE IF EXISTS `produto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produto` (
  `id_produto` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `preco_venda` decimal(10,2) NOT NULL,
  `descricao` text,
  `ativo` tinyint(1) DEFAULT NULL,
  `imagem_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_produto`),
  KEY `idx_produto_nome` (`nome`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `produtocategoria`
--

DROP TABLE IF EXISTS `produtocategoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produtocategoria` (
  `fk_produto_id_produto` int NOT NULL,
  `fk_categoria_id_categoria` int NOT NULL,
  PRIMARY KEY (`fk_produto_id_produto`,`fk_categoria_id_categoria`),
  KEY `fk_categoria_id_categoria` (`fk_categoria_id_categoria`),
  CONSTRAINT `produtocategoria_ibfk_1` FOREIGN KEY (`fk_produto_id_produto`) REFERENCES `produto` (`id_produto`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `produtocategoria_ibfk_2` FOREIGN KEY (`fk_categoria_id_categoria`) REFERENCES `categoria` (`id_categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `produtos_mais_vendidos`
--

DROP TABLE IF EXISTS `produtos_mais_vendidos`;
/*!50001 DROP VIEW IF EXISTS `produtos_mais_vendidos`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `produtos_mais_vendidos` AS SELECT 
 1 AS `nome`,
 1 AS `total_vendido`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `senha` varchar(100) NOT NULL,
  `login` varchar(50) DEFAULT NULL,
  `admin` tinyint(1) DEFAULT '0',
  `nome` varchar(255) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `fk_id_endereco` int DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `login` (`login`),
  KEY `fk_usuario_endereco` (`fk_id_endereco`),
  CONSTRAINT `fk_usuario_endereco` FOREIGN KEY (`fk_id_endereco`) REFERENCES `endereco` (`id_endereco`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `vw_produtos_mais_vendidos`
--

DROP TABLE IF EXISTS `vw_produtos_mais_vendidos`;
/*!50001 DROP VIEW IF EXISTS `vw_produtos_mais_vendidos`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_produtos_mais_vendidos` AS SELECT 
 1 AS `nome`,
 1 AS `total_vendido`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `faturamento_mensal`
--

/*!50001 DROP VIEW IF EXISTS `faturamento_mensal`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `faturamento_mensal` AS select date_format(`p`.`dataPedido`,'%Y-%m') AS `mes`,sum((`i`.`precoUnitario` * `i`.`quantidade`)) AS `total_faturado` from (`pedido` `p` join `itempedido` `i` on((`p`.`id_pedido` = `i`.`fk_pedido_id_pedido`))) group by `mes` order by `mes` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `pedidos_da_semana`
--

/*!50001 DROP VIEW IF EXISTS `pedidos_da_semana`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `pedidos_da_semana` AS select `pedido`.`id_pedido` AS `id_pedido`,`pedido`.`data_entrega` AS `data_entrega`,`pedido`.`dataPedido` AS `dataPedido`,`pedido`.`fk_cliente_id_cliente` AS `fk_cliente_id_cliente`,`pedido`.`fk_forma_pagamento_id_forma_pagamento` AS `fk_forma_pagamento_id_forma_pagamento`,`pedido`.`fk_endereco_id_endereco` AS `fk_endereco_id_endereco` from `pedido` where (`pedido`.`data_entrega` between curdate() and (curdate() + interval 7 day)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `produtos_mais_vendidos`
--

/*!50001 DROP VIEW IF EXISTS `produtos_mais_vendidos`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `produtos_mais_vendidos` AS select `pr`.`nome` AS `nome`,sum(`ip`.`quantidade`) AS `total_vendido` from (`itempedido` `ip` join `produto` `pr` on((`ip`.`fk_produto_id_produto` = `pr`.`id_produto`))) group by `pr`.`nome` order by `total_vendido` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_produtos_mais_vendidos`
--

/*!50001 DROP VIEW IF EXISTS `vw_produtos_mais_vendidos`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_produtos_mais_vendidos` AS select `pr`.`nome` AS `nome`,sum(`ip`.`quantidade`) AS `total_vendido` from (`itempedido` `ip` join `produto` `pr` on((`pr`.`id_produto` = `ip`.`fk_produto_id_produto`))) group by `pr`.`nome` order by `total_vendido` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-13 22:07:37
