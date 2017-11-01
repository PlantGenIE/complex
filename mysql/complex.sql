-- MySQL dump 10.13  Distrib 5.5.57, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: complex_new
-- ------------------------------------------------------
-- Server version	5.5.57-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `GO`
--

DROP TABLE IF EXISTS `GO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `GO` (
  `go_i` int(11) unsigned NOT NULL,
  `go_id` varchar(10) NOT NULL,
  `name` varchar(250) NOT NULL,
  `nsp` char(1) NOT NULL,
  PRIMARY KEY (`go_i`),
  UNIQUE KEY `go_id` (`go_id`) USING HASH
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `atCorr`
--

DROP TABLE IF EXISTS `atCorr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `atCorr` (
  `at_i1` int(11) NOT NULL,
  `at_i2` int(11) NOT NULL,
  `corr` float DEFAULT NULL,
  PRIMARY KEY (`at_i1`,`at_i2`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `atCorrTF`
--

DROP TABLE IF EXISTS `atCorrTF`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `atCorrTF` (
  `at_i1` int(11) NOT NULL,
  `at_i2` int(11) NOT NULL,
  `corr` float DEFAULT NULL,
  PRIMARY KEY (`at_i1`,`at_i2`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `atGO`
--

DROP TABLE IF EXISTS `atGO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `atGO` (
  `g_i` int(11) unsigned NOT NULL,
  `go_i` int(11) unsigned NOT NULL,
  PRIMARY KEY (`g_i`,`go_i`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `atGene`
--

DROP TABLE IF EXISTS `atGene`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `atGene` (
  `at_i` int(11) unsigned NOT NULL,
  `at_id` varchar(45) DEFAULT NULL,
  `pfam` varchar(100) DEFAULT NULL,
  `taird` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`at_i`),
  UNIQUE KEY `at_id` (`at_id`) USING HASH
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `atGene_old`
--

DROP TABLE IF EXISTS `atGene_old`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `atGene_old` (
  `at_i` int(11) unsigned NOT NULL,
  `at_id` varchar(45) DEFAULT NULL,
  `pfam` varchar(100) DEFAULT NULL,
  `taird` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`at_i`),
  UNIQUE KEY `at_id` (`at_id`) USING HASH
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `atTF`
--

DROP TABLE IF EXISTS `atTF`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `atTF` (
  `tf_i` int(11) NOT NULL AUTO_INCREMENT,
  `tf_id` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`tf_i`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `at_gg_centr`
--

DROP TABLE IF EXISTS `at_gg_centr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `at_gg_centr` (
  `g_i` int(11) unsigned NOT NULL,
  `th` int(11) unsigned NOT NULL,
  `degrees` float NOT NULL,
  `degrees_r` int(11) unsigned NOT NULL,
  `betweenness` float NOT NULL,
  `betweenness_r` int(11) unsigned NOT NULL,
  `closeness` float NOT NULL,
  `closeness_r` int(11) unsigned NOT NULL,
  `eigenvector` float NOT NULL,
  `eigenvector_r` int(11) unsigned NOT NULL,
  `transitivity` float NOT NULL,
  `transitivity_r` int(11) unsigned NOT NULL,
  `avnn` float NOT NULL,
  `avnn_r` int(11) unsigned NOT NULL,
  PRIMARY KEY (`g_i`,`th`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary table structure for view `atcorr_view`
--

DROP TABLE IF EXISTS `atcorr_view`;
/*!50001 DROP VIEW IF EXISTS `atcorr_view`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `atcorr_view` (
  `at_i1` tinyint NOT NULL,
  `at_i2` tinyint NOT NULL,
  `at_id` tinyint NOT NULL,
  `corr` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `atgo_sl`
--

DROP TABLE IF EXISTS `atgo_sl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `atgo_sl` (
  `go_id` varchar(15) NOT NULL DEFAULT '',
  `gene` varchar(20) DEFAULT NULL,
  KEY `GENE` (`gene`),
  KEY `GO` (`go_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `atos`
--

DROP TABLE IF EXISTS `atos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `atos` (
  `at_i1` int(11) NOT NULL,
  `at_i2` int(11) NOT NULL,
  `corr1` float NOT NULL,
  `os_i1` int(11) NOT NULL,
  `os_i2` int(11) NOT NULL,
  `corr2` float NOT NULL,
  PRIMARY KEY (`at_i1`,`at_i2`,`os_i1`,`os_i2`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `atosNod`
--

DROP TABLE IF EXISTS `atosNod`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `atosNod` (
  `os_i` int(11) NOT NULL,
  `at_i` int(11) NOT NULL,
  `pval` float DEFAULT NULL,
  `type` varchar(6) DEFAULT NULL,
  `corr` int(11) DEFAULT NULL,
  KEY `type` (`type`),
  KEY `corr` (`corr`),
  KEY `at_i` (`at_i`),
  KEY `os_i` (`os_i`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `atos_old`
--

DROP TABLE IF EXISTS `atos_old`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `atos_old` (
  `at_i1` int(11) NOT NULL,
  `at_i2` int(11) NOT NULL,
  `corr1` float NOT NULL,
  `os_i1` int(11) NOT NULL,
  `os_i2` int(11) NOT NULL,
  `corr2` float NOT NULL,
  PRIMARY KEY (`at_i1`,`at_i2`,`os_i1`,`os_i2`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `atptNod`
--

DROP TABLE IF EXISTS `atptNod`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `atptNod` (
  `pt_i` int(11) NOT NULL,
  `at_i` int(11) NOT NULL,
  `pval` float NOT NULL,
  `type` varchar(6) NOT NULL DEFAULT '',
  `corr` int(11) NOT NULL,
  KEY `type` (`type`),
  KEY `corr` (`corr`),
  KEY `pt_i` (`pt_i`),
  KEY `at_i` (`at_i`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `go_infoslim`
--

DROP TABLE IF EXISTS `go_infoslim`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `go_infoslim` (
  `go_id` varchar(15) NOT NULL DEFAULT '',
  `go_desc` varchar(100) DEFAULT NULL,
  `namespace` varchar(11) DEFAULT NULL,
  PRIMARY KEY (`go_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `osCorr`
--

DROP TABLE IF EXISTS `osCorr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `osCorr` (
  `os_i1` int(11) NOT NULL,
  `os_i2` int(11) NOT NULL,
  `corr` float DEFAULT NULL,
  PRIMARY KEY (`os_i1`,`os_i2`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `osCorrTF`
--

DROP TABLE IF EXISTS `osCorrTF`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `osCorrTF` (
  `os_i1` int(11) NOT NULL,
  `os_i2` int(11) NOT NULL,
  `corr` float DEFAULT NULL,
  PRIMARY KEY (`os_i1`,`os_i2`),
  KEY `os_i2` (`os_i2`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `osGO`
--

DROP TABLE IF EXISTS `osGO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `osGO` (
  `g_i` int(11) unsigned NOT NULL,
  `go_i` int(11) unsigned NOT NULL,
  PRIMARY KEY (`g_i`,`go_i`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `osGene`
--

DROP TABLE IF EXISTS `osGene`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `osGene` (
  `os_i` int(11) unsigned NOT NULL,
  `os_id` varchar(45) DEFAULT NULL,
  `pfam` varchar(100) DEFAULT NULL,
  `taird` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`os_i`),
  UNIQUE KEY `os_id` (`os_id`) USING HASH
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `osGene_old`
--

DROP TABLE IF EXISTS `osGene_old`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `osGene_old` (
  `os_i` int(11) unsigned NOT NULL,
  `os_id` varchar(45) DEFAULT NULL,
  `pfam` varchar(100) DEFAULT NULL,
  `taird` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`os_i`),
  UNIQUE KEY `os_id` (`os_id`) USING HASH
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `osTF`
--

DROP TABLE IF EXISTS `osTF`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `osTF` (
  `tf_i` int(11) NOT NULL AUTO_INCREMENT,
  `tf_id` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`tf_i`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `os_gg_centr`
--

DROP TABLE IF EXISTS `os_gg_centr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `os_gg_centr` (
  `g_i` int(11) unsigned NOT NULL,
  `th` int(11) unsigned NOT NULL,
  `degrees` float NOT NULL,
  `degrees_r` int(11) unsigned NOT NULL,
  `betweenness` float NOT NULL,
  `betweenness_r` int(11) unsigned NOT NULL,
  `closeness` float NOT NULL,
  `closeness_r` int(11) unsigned NOT NULL,
  `eigenvector` float NOT NULL,
  `eigenvector_r` int(11) unsigned NOT NULL,
  `transitivity` float NOT NULL,
  `transitivity_r` int(11) unsigned NOT NULL,
  `avnn` float NOT NULL,
  `avnn_r` int(11) unsigned NOT NULL,
  PRIMARY KEY (`g_i`,`th`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `osatNod`
--

DROP TABLE IF EXISTS `osatNod`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `osatNod` (
  `at_i` int(11) NOT NULL,
  `os_i` int(11) NOT NULL,
  `pval` float DEFAULT NULL,
  `type` varchar(6) DEFAULT NULL,
  `corr` int(11) DEFAULT NULL,
  KEY `type` (`type`),
  KEY `corr` (`corr`),
  KEY `at_i` (`at_i`),
  KEY `os_i` (`os_i`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary table structure for view `oscorr_view`
--

DROP TABLE IF EXISTS `oscorr_view`;
/*!50001 DROP VIEW IF EXISTS `oscorr_view`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `oscorr_view` (
  `os_i1` tinyint NOT NULL,
  `os_i2` tinyint NOT NULL,
  `os_id` tinyint NOT NULL,
  `corr` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `osgo_sl`
--

DROP TABLE IF EXISTS `osgo_sl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `osgo_sl` (
  `go_id` varchar(15) NOT NULL DEFAULT '',
  `gene` varchar(20) DEFAULT NULL,
  KEY `GO` (`go_id`),
  KEY `GENE` (`gene`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `osptNod`
--

DROP TABLE IF EXISTS `osptNod`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `osptNod` (
  `pt_i` int(11) NOT NULL,
  `os_i` int(11) NOT NULL,
  `pval` float NOT NULL,
  `type` varchar(6) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL DEFAULT '',
  `corr` int(1) NOT NULL,
  KEY `corr` (`corr`),
  KEY `type` (`type`),
  KEY `pt_i` (`pt_i`),
  KEY `os_i` (`os_i`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ptCorr`
--

DROP TABLE IF EXISTS `ptCorr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ptCorr` (
  `pt_i1` int(11) NOT NULL,
  `pt_i2` int(11) NOT NULL,
  `corr` float DEFAULT NULL,
  PRIMARY KEY (`pt_i1`,`pt_i2`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ptCorrTF`
--

DROP TABLE IF EXISTS `ptCorrTF`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ptCorrTF` (
  `pt_i1` int(11) NOT NULL,
  `pt_i2` int(11) NOT NULL,
  `corr` float DEFAULT NULL,
  PRIMARY KEY (`pt_i1`,`pt_i2`),
  KEY `pt_i2` (`pt_i2`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ptGO`
--

DROP TABLE IF EXISTS `ptGO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ptGO` (
  `g_i` int(11) unsigned NOT NULL,
  `go_i` int(11) unsigned NOT NULL,
  PRIMARY KEY (`g_i`,`go_i`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ptGene`
--

DROP TABLE IF EXISTS `ptGene`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ptGene` (
  `pt_i` int(11) unsigned NOT NULL,
  `pt_id` varchar(45) DEFAULT NULL,
  `pfam` varchar(100) DEFAULT NULL,
  `taird` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`pt_i`),
  UNIQUE KEY `pt_id` (`pt_id`) USING HASH
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ptGene_old`
--

DROP TABLE IF EXISTS `ptGene_old`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ptGene_old` (
  `pt_i` int(11) unsigned NOT NULL,
  `pt_id` varchar(45) DEFAULT NULL,
  `pfam` varchar(100) DEFAULT NULL,
  `taird` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`pt_i`),
  UNIQUE KEY `pt_id` (`pt_id`) USING HASH
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ptTF`
--

DROP TABLE IF EXISTS `ptTF`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ptTF` (
  `tf_i` int(11) NOT NULL AUTO_INCREMENT,
  `tf_id` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`tf_i`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pt_gg_centr`
--

DROP TABLE IF EXISTS `pt_gg_centr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pt_gg_centr` (
  `g_i` int(11) unsigned NOT NULL,
  `th` int(11) unsigned NOT NULL,
  `degrees` float NOT NULL,
  `degrees_r` int(11) unsigned NOT NULL,
  `betweenness` float NOT NULL,
  `betweenness_r` int(11) unsigned NOT NULL,
  `closeness` float NOT NULL,
  `closeness_r` int(11) unsigned NOT NULL,
  `eigenvector` float NOT NULL,
  `eigenvector_r` int(11) unsigned NOT NULL,
  `transitivity` float NOT NULL,
  `transitivity_r` int(11) unsigned NOT NULL,
  `avnn` float NOT NULL,
  `avnn_r` int(11) unsigned NOT NULL,
  PRIMARY KEY (`g_i`,`th`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ptat`
--

DROP TABLE IF EXISTS `ptat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ptat` (
  `pt_i1` int(11) NOT NULL,
  `pt_i2` int(11) NOT NULL,
  `corr1` float NOT NULL,
  `at_i1` int(11) NOT NULL,
  `at_i2` int(11) NOT NULL,
  `corr2` float NOT NULL,
  PRIMARY KEY (`pt_i1`,`pt_i2`,`at_i1`,`at_i2`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ptatNod`
--

DROP TABLE IF EXISTS `ptatNod`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ptatNod` (
  `pt_i` int(11) NOT NULL,
  `at_i` int(11) NOT NULL,
  `pval` float NOT NULL,
  `type` varchar(6) NOT NULL DEFAULT '',
  `corr` int(11) NOT NULL,
  KEY `type` (`type`),
  KEY `corr` (`corr`),
  KEY `pt_i` (`pt_i`),
  KEY `at_i` (`at_i`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary table structure for view `ptcorr_view`
--

DROP TABLE IF EXISTS `ptcorr_view`;
/*!50001 DROP VIEW IF EXISTS `ptcorr_view`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `ptcorr_view` (
  `pt_i1` tinyint NOT NULL,
  `pt_i2` tinyint NOT NULL,
  `pt_id` tinyint NOT NULL,
  `corr` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `ptgo_sl`
--

DROP TABLE IF EXISTS `ptgo_sl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ptgo_sl` (
  `go_id` varchar(15) NOT NULL DEFAULT '',
  `gene` varchar(20) DEFAULT NULL,
  KEY `GENE` (`gene`),
  KEY `GO` (`go_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ptos`
--

DROP TABLE IF EXISTS `ptos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ptos` (
  `pt_i1` int(11) NOT NULL,
  `pt_i2` int(11) NOT NULL,
  `corr1` float NOT NULL,
  `os_i1` int(11) NOT NULL,
  `os_i2` int(11) NOT NULL,
  `corr2` float NOT NULL,
  PRIMARY KEY (`pt_i1`,`pt_i2`,`os_i1`,`os_i2`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ptosNod`
--

DROP TABLE IF EXISTS `ptosNod`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ptosNod` (
  `os_i` int(11) NOT NULL,
  `pt_i` int(11) NOT NULL,
  `pval` float NOT NULL,
  `type` varchar(6) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL DEFAULT '',
  `corr` int(1) NOT NULL,
  KEY `corr` (`corr`),
  KEY `type` (`type`),
  KEY `pt_i` (`pt_i`),
  KEY `os_i` (`os_i`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ptos_old`
--

DROP TABLE IF EXISTS `ptos_old`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ptos_old` (
  `pt_i1` int(11) NOT NULL,
  `pt_i2` int(11) NOT NULL,
  `corr1` float NOT NULL,
  `os_i1` int(11) NOT NULL,
  `os_i2` int(11) NOT NULL,
  `corr2` float NOT NULL,
  PRIMARY KEY (`pt_i1`,`pt_i2`,`os_i1`,`os_i2`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Final view structure for view `atcorr_view`
--

/*!50001 DROP TABLE IF EXISTS `atcorr_view`*/;
/*!50001 DROP VIEW IF EXISTS `atcorr_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`chanaka`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `atcorr_view` AS select `atCorr`.`at_i1` AS `at_i1`,`atCorr`.`at_i2` AS `at_i2`,`atGene`.`at_id` AS `at_id`,`atCorr`.`corr` AS `corr` from (`atCorr` join `atGene` on(((`atCorr`.`at_i1` = `atGene`.`at_i`) or (`atCorr`.`at_i2` = `atGene`.`at_i`)))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `oscorr_view`
--

/*!50001 DROP TABLE IF EXISTS `oscorr_view`*/;
/*!50001 DROP VIEW IF EXISTS `oscorr_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`chanaka`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `oscorr_view` AS select `osCorr`.`os_i1` AS `os_i1`,`osCorr`.`os_i2` AS `os_i2`,`osGene`.`os_id` AS `os_id`,`osCorr`.`corr` AS `corr` from (`osCorr` join `osGene` on(((`osCorr`.`os_i1` = `osGene`.`os_i`) or (`osCorr`.`os_i2` = `osGene`.`os_i`)))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `ptcorr_view`
--

/*!50001 DROP TABLE IF EXISTS `ptcorr_view`*/;
/*!50001 DROP VIEW IF EXISTS `ptcorr_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`chanaka`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `ptcorr_view` AS select `ptCorr`.`pt_i1` AS `pt_i1`,`ptCorr`.`pt_i2` AS `pt_i2`,`ptGene`.`pt_id` AS `pt_id`,`ptCorr`.`corr` AS `corr` from (`ptCorr` join `ptGene` on(((`ptCorr`.`pt_i1` = `ptGene`.`pt_i`) or (`ptCorr`.`pt_i2` = `ptGene`.`pt_i`)))) */;
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

-- Dump completed on 2017-11-01 10:20:56
