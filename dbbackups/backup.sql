-- MySQL dump 10.13  Distrib 5.7.17, for osx10.11 (x86_64)
--
-- Host: localhost    Database: music-player
-- ------------------------------------------------------
-- Server version	5.7.17

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
-- Table structure for table `Albums`
--

DROP TABLE IF EXISTS `Albums`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Albums` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `keyname` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `artist_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `keyname` (`keyname`),
  KEY `fk_artist_id` (`artist_id`),
  CONSTRAINT `fk_artist_id` FOREIGN KEY (`artist_id`) REFERENCES `Artists` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Albums`
--

LOCK TABLES `Albums` WRITE;
/*!40000 ALTER TABLE `Albums` DISABLE KEYS */;
INSERT INTO `Albums` VALUES (15,'Keane.Under the Iron Sea','Under the Iron Sea','2017-04-25 10:25:37','2017-04-25 10:25:37',7);
/*!40000 ALTER TABLE `Albums` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Artists`
--

DROP TABLE IF EXISTS `Artists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Artists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `keyname` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `keyname` (`keyname`)
) ENGINE=InnoDB AUTO_INCREMENT=273 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Artists`
--

LOCK TABLES `Artists` WRITE;
/*!40000 ALTER TABLE `Artists` DISABLE KEYS */;
INSERT INTO `Artists` VALUES (7,'Keane','Keane','2017-04-25 08:04:11','2017-04-25 08:04:11'),(8,'Muse','Muse','2017-04-25 08:04:11','2017-04-25 08:04:11');
/*!40000 ALTER TABLE `Artists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Songs`
--

DROP TABLE IF EXISTS `Songs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Songs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `keyname` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `artist_id` int(11) DEFAULT NULL,
  `album_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `keyname` (`keyname`),
  KEY `artist_id_fk` (`artist_id`),
  KEY `album_id_fk` (`album_id`),
  CONSTRAINT `album_id_fk` FOREIGN KEY (`album_id`) REFERENCES `Albums` (`id`),
  CONSTRAINT `artist_id_fk` FOREIGN KEY (`artist_id`) REFERENCES `Artists` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=265 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Songs`
--

LOCK TABLES `Songs` WRITE;
/*!40000 ALTER TABLE `Songs` DISABLE KEYS */;
INSERT INTO `Songs` VALUES (22,'Keane.Bedshaped','Bedshaped','2017-04-25 09:25:18','2017-04-25 09:25:18',7,NULL),(23,'Muse.Hysteria','Hysteria','2017-04-25 09:25:18','2017-04-25 09:25:18',8,NULL),(24,'Muse.Knights of Cydonia','Knights of Cydonia','2017-04-25 09:25:18','2017-04-25 09:25:18',8,NULL),(79,'50 ways to say goodbye - Train','50 ways to say goodbye - Train','2017-04-25 11:54:31','2017-04-25 11:54:31',NULL,NULL),(80,'Happy Together - The Turtles','Happy Together - The Turtles','2017-04-25 11:54:31','2017-04-25 11:54:31',NULL,NULL),(113,'Keane.Under the Iron Sea.A Bad Dream','A Bad Dream','2017-04-25 12:15:46','2017-04-25 12:15:46',NULL,15);
/*!40000 ALTER TABLE `Songs` ENABLE KEYS */;
UNLOCK TABLES;
--
-- WARNING: old server version. The following dump may be incomplete.
--
DELIMITER ;;
/*!50003 SET SESSION SQL_MODE="ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION" */;;
/*!50003 CREATE */ /*!50017 DEFINER=`root`@`localhost` */ /*!50003 TRIGGER `song_insert_allow_only_one_album_or_artist_or_none` BEFORE INSERT ON `Songs` FOR EACH ROW BEGIN
		IF (new.artist_id IS NOT NULL and new.album_id IS NOT NULL) THEN
			set new.album_id = null;
		end if;
	end */;;
DELIMITER ;
--
-- WARNING: old server version. The following dump may be incomplete.
--
DELIMITER ;;
/*!50003 SET SESSION SQL_MODE="ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION" */;;
/*!50003 CREATE */ /*!50017 DEFINER=`root`@`localhost` */ /*!50003 TRIGGER `song_update_allow_only_one_album_or_artist_or_none` BEFORE UPDATE ON `Songs` FOR EACH ROW BEGIN
		IF new.album_id IS NOT NULL THEN
			set new.artist_id = null;
		ELSEIF new.artist_id IS NOT NULL THEN
			set new.album_id = null;
		end if;
	end */;;
DELIMITER ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-04-25 13:46:36
