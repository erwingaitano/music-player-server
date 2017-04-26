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
  `artist_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `keyname` (`keyname`),
  KEY `fk_artist_id` (`artist_id`),
  CONSTRAINT `fk_artist_id` FOREIGN KEY (`artist_id`) REFERENCES `Artists` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Albums`
--

LOCK TABLES `Albums` WRITE;
/*!40000 ALTER TABLE `Albums` DISABLE KEYS */;
INSERT INTO `Albums` VALUES (15,'Keane.Under the Iron Sea','Under the Iron Sea',7,'2017-04-25 10:25:37','2017-04-25 10:25:37');
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
) ENGINE=InnoDB AUTO_INCREMENT=293 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Artists`
--

LOCK TABLES `Artists` WRITE;
/*!40000 ALTER TABLE `Artists` DISABLE KEYS */;
INSERT INTO `Artists` VALUES (7,'Keane','Keane','2017-04-25 08:04:11','2017-04-25 08:04:11'),(8,'Muse','Muse','2017-04-25 08:04:11','2017-04-25 08:04:11'),(276,'The Turtles','The Turtles','2017-04-25 13:56:39','2017-04-25 13:56:39'),(277,'Train','Train','2017-04-25 13:56:39','2017-04-25 13:56:39'),(280,'Eminem','Eminem','2017-04-25 14:01:11','2017-04-25 14:01:11'),(282,'Rhapsody','Rhapsody','2017-04-25 14:01:11','2017-04-25 14:01:11'),(283,'Richard Clayderman','Richard Clayderman','2017-04-25 14:01:11','2017-04-25 14:01:11'),(284,'Toto','Toto','2017-04-25 14:01:11','2017-04-25 14:01:11');
/*!40000 ALTER TABLE `Artists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PlaylistSongs`
--

DROP TABLE IF EXISTS `PlaylistSongs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PlaylistSongs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `playlist_id` int(11) NOT NULL,
  `song_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `playlist_id_fk` (`playlist_id`),
  KEY `song_id_fk` (`song_id`),
  CONSTRAINT `playlist_id_fk` FOREIGN KEY (`playlist_id`) REFERENCES `Playlists` (`id`),
  CONSTRAINT `song_id_fk` FOREIGN KEY (`song_id`) REFERENCES `Songs` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PlaylistSongs`
--

LOCK TABLES `PlaylistSongs` WRITE;
/*!40000 ALTER TABLE `PlaylistSongs` DISABLE KEYS */;
INSERT INTO `PlaylistSongs` VALUES (1,1,275,'2017-04-25 18:57:09','2017-04-25 18:57:09'),(2,1,286,'2017-04-25 18:56:56','2017-04-25 18:56:56'),(3,2,23,'2017-04-25 19:02:16','2017-04-25 19:02:16'),(4,2,24,'2017-04-25 19:02:48','2017-04-25 19:02:48'),(5,2,279,'2017-04-25 19:02:53','2017-04-25 19:02:53');
/*!40000 ALTER TABLE `PlaylistSongs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Playlists`
--

DROP TABLE IF EXISTS `Playlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Playlists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Playlists`
--

LOCK TABLES `Playlists` WRITE;
/*!40000 ALTER TABLE `Playlists` DISABLE KEYS */;
INSERT INTO `Playlists` VALUES (1,'Non skippables','2017-04-25 18:55:58','2017-04-25 18:55:58'),(2,'Alternative','2017-04-25 19:01:49','2017-04-25 19:01:49');
/*!40000 ALTER TABLE `Playlists` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=299 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Songs`
--

LOCK TABLES `Songs` WRITE;
/*!40000 ALTER TABLE `Songs` DISABLE KEYS */;
INSERT INTO `Songs` VALUES (22,'Keane.Bedshaped','Bedshaped','2017-04-25 09:25:18','2017-04-25 09:25:18',7,NULL),(23,'Muse.Hysteria','Hysteria','2017-04-25 09:25:18','2017-04-25 09:25:18',8,NULL),(24,'Muse.Knights of Cydonia','Knights of Cydonia','2017-04-25 09:25:18','2017-04-25 09:25:18',8,NULL),(113,'Keane.Under the Iron Sea.A Bad Dream','A Bad Dream','2017-04-25 12:15:46','2017-04-25 12:15:46',NULL,15),(274,'The Turtles.Happy Together','Happy Together','2017-04-25 13:56:39','2017-04-25 13:56:39',276,NULL),(275,'Train.50 ways to say goodbye','50 ways to say goodbye','2017-04-25 13:56:39','2017-04-25 13:56:39',277,NULL),(278,'Eminem.Lose Yourself','Lose Yourself','2017-04-25 14:01:11','2017-04-25 14:01:11',280,NULL),(279,'Muse.Stockholm Syndrome','Stockholm Syndrome','2017-04-25 14:01:11','2017-04-25 14:01:11',8,NULL),(282,'Rhapsody.Magic Of The Wizard\'s Dream','Magic Of The Wizard\'s Dream','2017-04-25 14:01:11','2017-04-25 14:01:11',282,NULL),(283,'Rhapsody.Magic Of The Wizard\'s Dream ft. Christopher Lee','Magic Of The Wizard\'s Dream ft. Christopher Lee','2017-04-25 14:01:11','2017-04-25 14:01:11',282,NULL),(284,'Richard Clayderman.Love Story','Love Story','2017-04-25 14:01:11','2017-04-25 14:01:11',283,NULL),(286,'Toto.Africa','Africa','2017-04-25 14:01:11','2017-04-25 14:01:11',284,NULL);
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

-- Dump completed on 2017-04-25 19:31:05
