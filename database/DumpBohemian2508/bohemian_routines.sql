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
-- Temporary view structure for view `pedidos_pendentes_pagamento`
--

DROP TABLE IF EXISTS `pedidos_pendentes_pagamento`;
/*!50001 DROP VIEW IF EXISTS `pedidos_pendentes_pagamento`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `pedidos_pendentes_pagamento` AS SELECT 
 1 AS `id_pedido`,
 1 AS `cliente`,
 1 AS `status_transacao`,
 1 AS `dataPedido`,
 1 AS `data_entrega`*/;
SET character_set_client = @saved_cs_client;

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
-- Temporary view structure for view `entregas_amanha`
--

DROP TABLE IF EXISTS `entregas_amanha`;
/*!50001 DROP VIEW IF EXISTS `entregas_amanha`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `entregas_amanha` AS SELECT 
 1 AS `id_pedido`,
 1 AS `cliente`,
 1 AS `data_entrega`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `clientes_fieis`
--

DROP TABLE IF EXISTS `clientes_fieis`;
/*!50001 DROP VIEW IF EXISTS `clientes_fieis`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `clientes_fieis` AS SELECT 
 1 AS `cliente`,
 1 AS `total_pedidos`,
 1 AS `total_gasto`*/;
SET character_set_client = @saved_cs_client;

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
-- Final view structure for view `pedidos_pendentes_pagamento`
--

/*!50001 DROP VIEW IF EXISTS `pedidos_pendentes_pagamento`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `pedidos_pendentes_pagamento` AS select `p`.`id_pedido` AS `id_pedido`,`c`.`nome` AS `cliente`,`fp`.`status_transacao` AS `status_transacao`,`p`.`dataPedido` AS `dataPedido`,`p`.`data_entrega` AS `data_entrega` from ((`pedido` `p` join `cliente` `c` on((`p`.`fk_cliente_id_cliente` = `c`.`id_cliente`))) join `forma_pagamento` `fp` on((`p`.`fk_forma_pagamento_id_forma_pagamento` = `fp`.`id_forma_pagamento`))) where (`fp`.`status_transacao` <> 'Aprovado') */;
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

--
-- Final view structure for view `entregas_amanha`
--

/*!50001 DROP VIEW IF EXISTS `entregas_amanha`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `entregas_amanha` AS select `p`.`id_pedido` AS `id_pedido`,`c`.`nome` AS `cliente`,`p`.`data_entrega` AS `data_entrega` from (`pedido` `p` join `cliente` `c` on((`p`.`fk_cliente_id_cliente` = `c`.`id_cliente`))) where (`p`.`data_entrega` = (curdate() + interval 1 day)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `clientes_fieis`
--

/*!50001 DROP VIEW IF EXISTS `clientes_fieis`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `clientes_fieis` AS select `c`.`nome` AS `cliente`,count(`p`.`id_pedido`) AS `total_pedidos`,sum((`ip`.`precoUnitario` * `ip`.`quantidade`)) AS `total_gasto` from ((`cliente` `c` join `pedido` `p` on((`c`.`id_cliente` = `p`.`fk_cliente_id_cliente`))) join `itempedido` `ip` on((`p`.`id_pedido` = `ip`.`fk_pedido_id_pedido`))) group by `c`.`id_cliente` order by `total_gasto` desc */;
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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-25 20:13:04
