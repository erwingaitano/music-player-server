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
  `covers` json DEFAULT NULL,
  `artist_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `keyname` (`keyname`),
  KEY `fk_artist_id` (`artist_id`),
  CONSTRAINT `fk_artist_id` FOREIGN KEY (`artist_id`) REFERENCES `Artists` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Albums`
--

LOCK TABLES `Albums` WRITE;
/*!40000 ALTER TABLE `Albums` DISABLE KEYS */;
INSERT INTO `Albums` VALUES (15,'Keane.Under the Iron Sea','Under the Iron Sea','[\"/api/covers/_artists/Keane/_albums/Under the Iron Sea/_covers/1.jpg\"]',7,'2017-04-25 10:25:37','2017-04-25 22:50:42'),(34,'Keane.Hopes and Fears','Hopes and Fears','[]',7,'2017-04-25 22:50:42','2017-04-25 22:50:42');
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
  `covers` json DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `keyname` (`keyname`)
) ENGINE=InnoDB AUTO_INCREMENT=709 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Artists`
--

LOCK TABLES `Artists` WRITE;
/*!40000 ALTER TABLE `Artists` DISABLE KEYS */;
INSERT INTO `Artists` VALUES (7,'Keane','Keane','[]','2017-04-25 08:04:11','2017-04-25 22:58:16'),(8,'Muse','Muse','[\"/api/covers/_artists/Muse/_covers/1.jpg\"]','2017-04-25 08:04:11','2017-04-25 23:01:01'),(276,'The Turtles','The Turtles','[]','2017-04-25 13:56:39','2017-04-25 22:58:16'),(277,'Train','Train','[]','2017-04-25 13:56:39','2017-04-25 22:58:16'),(280,'Eminem','Eminem','[]','2017-04-25 14:01:11','2017-04-25 22:58:16'),(282,'Rhapsody','Rhapsody','[]','2017-04-25 14:01:11','2017-04-25 22:58:16'),(283,'Richard Clayderman','Richard Clayderman','[]','2017-04-25 14:01:11','2017-04-25 22:58:16'),(284,'Toto','Toto','[]','2017-04-25 14:01:11','2017-04-25 22:58:16');
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
  KEY `song_id_fk` (`song_id`),
  KEY `playlist_id` (`playlist_id`),
  CONSTRAINT `playlist_id` FOREIGN KEY (`playlist_id`) REFERENCES `Playlists` (`id`) ON DELETE CASCADE,
  CONSTRAINT `song_id_fk` FOREIGN KEY (`song_id`) REFERENCES `Songs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PlaylistSongs`
--

LOCK TABLES `PlaylistSongs` WRITE;
/*!40000 ALTER TABLE `PlaylistSongs` DISABLE KEYS */;
INSERT INTO `PlaylistSongs` VALUES (30,1,275,'2017-04-26 22:00:55','2017-04-26 22:00:55'),(32,1,286,'2017-04-26 22:01:47','2017-04-26 22:01:47'),(42,1,278,'2017-04-26 23:49:31','2017-04-26 23:49:31'),(46,1,680,'2017-04-27 00:04:34','2017-04-27 00:04:34'),(47,1,274,'2017-04-27 00:24:21','2017-04-27 00:24:21');
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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Playlists`
--

LOCK TABLES `Playlists` WRITE;
/*!40000 ALTER TABLE `Playlists` DISABLE KEYS */;
INSERT INTO `Playlists` VALUES (1,'Non skippables','2017-04-25 18:55:58','2017-04-25 18:55:58');
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
  `artist_id` int(11) DEFAULT NULL,
  `album_id` int(11) DEFAULT NULL,
  `covers` json DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `keyname` (`keyname`),
  KEY `artist_id_fk` (`artist_id`),
  KEY `album_id_fk` (`album_id`),
  CONSTRAINT `album_id_fk` FOREIGN KEY (`album_id`) REFERENCES `Albums` (`id`),
  CONSTRAINT `artist_id_fk` FOREIGN KEY (`artist_id`) REFERENCES `Artists` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=773 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Songs`
--

LOCK TABLES `Songs` WRITE;
/*!40000 ALTER TABLE `Songs` DISABLE KEYS */;
INSERT INTO `Songs` VALUES (24,'Muse.Knights of Cydonia','Knights of Cydonia',8,NULL,'[]','2017-04-25 09:25:18','2017-04-25 21:57:46'),(113,'Keane.Under the Iron Sea.A Bad Dream','A Bad Dream',NULL,15,'[]','2017-04-25 12:15:46','2017-04-25 21:57:46'),(274,'The Turtles.Happy Together','Happy Together',276,NULL,'[]','2017-04-25 13:56:39','2017-04-25 21:57:46'),(275,'Train.50 ways to say goodbye','50 ways to say goodbye',277,NULL,'[\"/api/covers/_artists/Train/50 ways to say goodbye/_covers/1.jpg\"]','2017-04-25 13:56:39','2017-04-25 22:15:01'),(278,'Eminem.Lose Yourself','Lose Yourself',280,NULL,'[]','2017-04-25 14:01:11','2017-04-25 21:57:45'),(279,'Muse.Stockholm Syndrome','Stockholm Syndrome',8,NULL,'[]','2017-04-25 14:01:11','2017-04-25 21:57:46'),(282,'Rhapsody.Magic Of The Wizard\'s Dream','Magic Of The Wizard\'s Dream',282,NULL,'[]','2017-04-25 14:01:11','2017-04-25 21:57:46'),(283,'Rhapsody.Magic Of The Wizard\'s Dream ft. Christopher Lee','Magic Of The Wizard\'s Dream ft. Christopher Lee',282,NULL,'[]','2017-04-25 14:01:11','2017-04-25 21:57:46'),(284,'Richard Clayderman.Love Story','Love Story',283,NULL,'[]','2017-04-25 14:01:11','2017-04-25 21:57:46'),(286,'Toto.Africa','Africa',284,NULL,'[]','2017-04-25 14:01:11','2017-04-25 21:57:46'),(300,'Muse.Hysteria','Hysteria',8,NULL,'[]','2017-04-25 21:15:18','2017-04-25 21:57:46'),(680,'Keane.Hopes and Fears.Bedshaped','Bedshaped',NULL,34,'[]','2017-04-25 22:50:42','2017-04-25 22:50:42'),(759,'Keane.Fly to Me','Fly to Me',7,NULL,'[]','2017-04-26 19:18:46','2017-04-26 19:18:46');
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

-- Dump completed on 2017-04-27  1:19:40
