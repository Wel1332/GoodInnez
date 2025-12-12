  CREATE DATABASE IF NOT EXISTS `dbgoodinnez` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
  USE `dbgoodinnez`;
  -- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
  --
  -- Host: localhost    Database: dbgoodinnez
  -- ------------------------------------------------------
  -- Server version 9.4.0

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
  -- Table structure for table `booking`
  --

  DROP TABLE IF EXISTS `booking`;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE `booking` (
    `bookingid` int NOT NULL AUTO_INCREMENT,
    `checkin_time` datetime(6) DEFAULT NULL,
    `checkout_time` datetime(6) DEFAULT NULL,
    `total_price` decimal(38,2) DEFAULT NULL,
    `guestid` int DEFAULT NULL,
    `room_number` int DEFAULT NULL,
    PRIMARY KEY (`bookingid`),
    KEY `FKe70sq334mqfu8qliel97mrvfb` (`guestid`),
    KEY `FKjda5mu13yg7tp78q7256v8nc1` (`room_number`),
    CONSTRAINT `FKe70sq334mqfu8qliel97mrvfb` FOREIGN KEY (`guestid`) REFERENCES `guest` (`guestid`),
    CONSTRAINT `FKjda5mu13yg7tp78q7256v8nc1` FOREIGN KEY (`room_number`) REFERENCES `room` (`roomid`)
  ) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  /*!40101 SET character_set_client = @saved_cs_client */;

  --
  -- Dumping data for table `booking`
  --

  LOCK TABLES `booking` WRITE;
  /*!40000 ALTER TABLE `booking` DISABLE KEYS */;
  INSERT INTO `booking` VALUES (1,'2025-12-01 14:00:00.000000','2025-12-05 12:00:00.000000',10000.00,1,1),(2,'2025-12-03 15:00:00.000000','2025-12-07 11:00:00.000000',16000.00,2,2),(3,'2025-12-10 16:00:00.000000','2025-12-12 10:00:00.000000',12000.00,3,1),(4,'2025-12-15 14:00:00.000000','2025-12-18 12:00:00.000000',15000.00,1,2),(5,'2025-12-20 18:00:00.000000','2025-12-25 11:00:00.000000',22000.00,2,3),(6,'2025-12-22 12:00:00.000000','2025-12-24 09:00:00.000000',9500.00,3,1),(7,'2025-12-24 14:00:00.000000','2025-12-28 12:00:00.000000',13500.00,4,2),(8,'2025-12-28 10:00:00.000000','2025-12-30 11:00:00.000000',18000.00,1,3),(9,'2026-01-01 15:00:00.000000','2026-01-05 11:00:00.000000',25000.00,2,1),(10,'2026-01-05 13:00:00.000000','2026-01-10 11:00:00.000000',20000.00,3,2);
  /*!40000 ALTER TABLE `booking` ENABLE KEYS */;
  UNLOCK TABLES;

  --
  -- Table structure for table `employee`
  --

  DROP TABLE IF EXISTS `employee`;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE `employee` (
    `uniqueid` int NOT NULL AUTO_INCREMENT,
    `date_of_birth` date DEFAULT NULL,
    `email` varchar(255) DEFAULT NULL,
    `first_name` varchar(255) DEFAULT NULL,
    `hire_date` date DEFAULT NULL,
    `last_name` varchar(255) DEFAULT NULL,
    `phone` varchar(255) DEFAULT NULL,
    `position` varchar(255) DEFAULT NULL,
    `salary` decimal(38,2) DEFAULT NULL,
    `hotelid` int DEFAULT NULL,
    PRIMARY KEY (`uniqueid`),
    KEY `FK13vxlfdj0vxlhke206qllrich` (`hotelid`),
    CONSTRAINT `FK13vxlfdj0vxlhke206qllrich` FOREIGN KEY (`hotelid`) REFERENCES `hotel` (`hotelid`)
  ) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  /*!40101 SET character_set_client = @saved_cs_client */;

  --
  -- Dumping data for table `employee`
  --

  LOCK TABLES `employee` WRITE;
  /*!40000 ALTER TABLE `employee` DISABLE KEYS */;
  INSERT INTO `employee` VALUES (1,'1992-03-15','angela.lopez@example.com','Angela','2020-06-01','Lopez','09181234567','Front Desk',20000.00,1),(2,'1985-11-22','carlos.garcia@example.com','Carlos','2018-02-15','Garcia','09281234567','Manager',45000.00,1),(3,'1990-08-30','roselyn.tan@example.com','Roselyn','2019-09-10','Tan','09381234567','Housekeeping',18000.00,2),(4,'1993-01-25','ella.moreno@example.com','Ella','2021-05-01','Moreno','09191234567','Housekeeping',17000.00,2),(5,'1988-09-10','michael.jones@example.com','Michael','2017-03-15','Jones','09211234567','Front Desk',21000.00,2),(6,'1992-04-12','john.smith@example.com','John','2019-08-20','Smith','09321234567','Manager',50000.00,1),(7,'1990-07-05','karen.mendez@example.com','Karen','2020-11-25','Mendez','09151234567','Housekeeping',16000.00,3),(8,'1995-03-10','kevin.diaz@example.com','Kevin','2023-02-17','Diaz','09361234567','Front Desk',19000.00,2),(9,'1989-06-21','tiffany.royal@example.com','Tiffany','2016-08-10','Royal','09161234568','Manager',55000.00,1),(10,'1993-09-15','daniel.yap@example.com','Daniel','2022-06-01','Yap','09211234568','Housekeeping',17000.00,1);
  /*!40000 ALTER TABLE `employee` ENABLE KEYS */;
  UNLOCK TABLES;

  --
  -- Table structure for table `guest`
  --

  DROP TABLE IF EXISTS `guest`;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE `guest` (
    `guestid` int NOT NULL AUTO_INCREMENT,
    `address` varchar(255) DEFAULT NULL,
    `date_of_birth` date DEFAULT NULL,
    `email` varchar(255) DEFAULT NULL,
    `password` varchar(255) DEFAULT NULL,
    `first_name` varchar(255) DEFAULT NULL,
    `last_name` varchar(255) DEFAULT NULL,
    `phone` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`guestid`)
  ) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  /*!40101 SET character_set_client = @saved_cs_client */;

  --
  -- Dumping data for table `guest`
  --

  LOCK TABLES `guest` WRITE;
  /*!40000 ALTER TABLE `guest` DISABLE KEYS */;
  /*!40000 ALTER TABLE `guest` ENABLE KEYS */;
  UNLOCK TABLES;

  --
  -- Table structure for table `hotel`
  --

  DROP TABLE IF EXISTS `hotel`;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE `hotel` (
    `hotelid` int NOT NULL AUTO_INCREMENT,
    `address` varchar(255) DEFAULT NULL,
    `checkin_time` time(6) DEFAULT NULL,
    `checkout_time` time(6) DEFAULT NULL,
    `email` varchar(255) DEFAULT NULL,
    `name` varchar(255) DEFAULT NULL,
    `phone` varchar(255) DEFAULT NULL,
    `stars` int DEFAULT NULL,
    PRIMARY KEY (`hotelid`)
  ) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  /*!40101 SET character_set_client = @saved_cs_client */;

  --
  -- Dumping data for table `hotel`
  --

  LOCK TABLES `hotel` WRITE;
  /*!40000 ALTER TABLE `hotel` DISABLE KEYS */;
  INSERT INTO `hotel` VALUES (1,'cebu city',NULL,NULL,NULL,'test user','095069056',5),(2,'Osmeña Blvd, Cebu City','14:00:00.000000','12:00:00.000000','info@cebugrand.com','Cebu Grand Hotel','032-1234567',5),(3,'Gov. M. Cuenco Ave, Lahug','15:00:00.000000','11:00:00.000000','contact@lahugsuites.com','Lahug Suites','032-7654321',4),(4,'Ayala Center, Cebu City','14:00:00.000000','12:00:00.000000','info@ayalacenterhotel.com','Ayala Center Hotel','032-8765432',4),(5,'Banilad, Cebu City','16:00:00.000000','10:00:00.000000','contact@baniladinn.com','Banilad Inn','032-9998888',3),(6,'Cebu IT Park','15:00:00.000000','11:00:00.000000','reservations@cebutel.com','Cebu IT Park Hotel','032-2345678',4),(7,'Lahug, Cebu City','13:00:00.000000','12:00:00.000000','contact@horizonviewhotel.com','Horizon View Hotel','032-7654322',3);
  /*!40000 ALTER TABLE `hotel` ENABLE KEYS */;
  UNLOCK TABLES;

  --
  -- Table structure for table `payment`
  --

  DROP TABLE IF EXISTS `payment`;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE `payment` (
    `bookingid` int NOT NULL,
    `guestid` int NOT NULL,
    `room_number` int NOT NULL,
    `checkin_time` datetime(6) DEFAULT NULL,
    `checkout_time` datetime(6) DEFAULT NULL,
    `total_price` decimal(38,2) DEFAULT NULL,
    PRIMARY KEY (`bookingid`,`guestid`,`room_number`),
    KEY `FKbbx26yshjolcq3js7a0owxv6q` (`guestid`),
    KEY `FKps83kg42oqogsgoa6kwc006jl` (`room_number`),
    CONSTRAINT `FKbbx26yshjolcq3js7a0owxv6q` FOREIGN KEY (`guestid`) REFERENCES `guest` (`guestid`),
    CONSTRAINT `FKewpg3143tuu48nagw3xviqu6h` FOREIGN KEY (`bookingid`) REFERENCES `booking` (`bookingid`),
    CONSTRAINT `FKps83kg42oqogsgoa6kwc006jl` FOREIGN KEY (`room_number`) REFERENCES `room` (`roomid`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  /*!40101 SET character_set_client = @saved_cs_client */;

  --
  -- Dumping data for table `payment`
  --

  LOCK TABLES `payment` WRITE;
  /*!40000 ALTER TABLE `payment` DISABLE KEYS */;
  INSERT INTO `payment` VALUES (1,1,1,'2025-12-01 14:00:00.000000','2025-12-05 12:00:00.000000',10000.00),(2,2,2,'2025-12-03 15:00:00.000000','2025-12-07 11:00:00.000000',16000.00),(3,3,1,'2025-12-10 16:00:00.000000','2025-12-12 10:00:00.000000',12000.00),(4,4,2,'2025-12-15 14:00:00.000000','2025-12-18 12:00:00.000000',15000.00),(5,5,3,'2025-12-20 18:00:00.000000','2025-12-25 11:00:00.000000',22000.00),(6,6,1,'2025-12-22 12:00:00.000000','2025-12-24 09:00:00.000000',9500.00),(7,7,2,'2025-12-24 14:00:00.000000','2025-12-28 12:00:00.000000',13500.00),(8,8,3,'2025-12-28 10:00:00.000000','2025-12-30 11:00:00.000000',18000.00),(9,9,1,'2026-01-01 15:00:00.000000','2026-01-05 11:00:00.000000',25000.00),(10,10,2,'2026-01-05 13:00:00.000000','2026-01-10 11:00:00.000000',20000.00);
  /*!40000 ALTER TABLE `payment` ENABLE KEYS */;
  UNLOCK TABLES;

  --
  -- Table structure for table `room`
  --

  DROP TABLE IF EXISTS `room`;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE `room` (
    `roomid` int NOT NULL AUTO_INCREMENT,
    `status` varchar(255) DEFAULT NULL,
    `hotelid` int DEFAULT NULL,
    `typeid` int DEFAULT NULL,
    PRIMARY KEY (`roomid`),
    KEY `FK7bt2oc7b3h1cqba9crblkx1c4` (`hotelid`),
    KEY `FK5fnpp9ijvuo7kd9p2mmyr3lce` (`typeid`),
    CONSTRAINT `FK5fnpp9ijvuo7kd9p2mmyr3lce` FOREIGN KEY (`typeid`) REFERENCES `room_type` (`typeid`),
    CONSTRAINT `FK7bt2oc7b3h1cqba9crblkx1c4` FOREIGN KEY (`hotelid`) REFERENCES `hotel` (`hotelid`)
  ) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  /*!40101 SET character_set_client = @saved_cs_client */;

  --
  -- Dumping data for table `room`
  --

  LOCK TABLES `room` WRITE;
  /*!40000 ALTER TABLE `room` DISABLE KEYS */;
  INSERT INTO `room` VALUES (1,'Available',1,1),(2,'Occupied',1,2),(3,'Available',1,3),(4,'Available',2,1),(5,'Occupied',2,2);
  /*!40000 ALTER TABLE `room` ENABLE KEYS */;
  UNLOCK TABLES;

  --
  -- Table structure for table `room_type`
  --

  DROP TABLE IF EXISTS `room_type`;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE `room_type` (
    `typeid` int NOT NULL AUTO_INCREMENT,
    `capacity` int DEFAULT NULL,
    `description` varchar(255) DEFAULT NULL,
    `name` varchar(255) DEFAULT NULL,
    `price_per_night` decimal(38,2) DEFAULT NULL,
    PRIMARY KEY (`typeid`)
  ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  /*!40101 SET character_set_client = @saved_cs_client */;

  --
  -- Dumping data for table `room_type`
  --

  LOCK TABLES `room_type` WRITE;
  /*!40000 ALTER TABLE `room_type` DISABLE KEYS */;
  INSERT INTO `room_type` VALUES (1,2,'Basic room with 1 queen bed','Standard',2500.00),(2,2,'Spacious room with 1 king bed and city view','Deluxe',4000.00),(3,4,'Family room with 2 double beds','Family',5500.00);
  /*!40000 ALTER TABLE `room_type` ENABLE KEYS */;
  UNLOCK TABLES;

  --
  -- Table structure for table `app_route`
  --

  DROP TABLE IF EXISTS `app_route`;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE `app_route` (
    `id` int NOT NULL AUTO_INCREMENT,
    `path` varchar(255) DEFAULT NULL,
    `component_key` varchar(255) DEFAULT NULL,
    `required_role` varchar(255) DEFAULT NULL,
    `label` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  /*!40101 SET character_set_client = @saved_cs_client */;

  --
  -- Dumping data for table `app_route`
  --

  LOCK TABLES `app_route` WRITE;
  /*!40000 ALTER TABLE `app_route` DISABLE KEYS */;
  INSERT INTO `app_route` (path, component_key, required_role, label) VALUES 
  ('/', 'LandingPage', 'PUBLIC', 'Home'),
  ('/search', 'ListingPage', 'PUBLIC', 'Search'),
  ('/listings', 'ListingPage', 'PUBLIC', 'Search'),
  ('/hotel/:id', 'HotelDetails', 'PUBLIC', 'Details'),
  ('/booking', 'BookingPage', 'GUEST', 'Book Now'),
  ('/profile', 'GuestProfile', 'GUEST', 'My Profile'),
  ('/host/dashboard', 'HostDashboard', 'PARTNER', 'Dashboard'),
  ('/host/properties', 'HostProperties', 'PARTNER', 'My Properties'),
  ('/host/reservations', 'HostReservations', 'PARTNER', 'Reservations'),
  ('/host/transactions', 'HostTransactions', 'PARTNER', 'Transactions'),
  ('/host/add', 'AddProperty', 'PARTNER', 'List Property'),
  ('/host/edit/:id', 'AddProperty', 'PARTNER', 'Edit Property'),
  ('/my-bookings', 'MyBookings', 'GUEST', 'My Bookings'),
  ('/messages', 'MessagesPage', 'GUEST', 'Messages'),
  ('/notifications', 'NotificationsPage', 'GUEST', 'Notifications'),
  ('/booking-success', 'BookingSuccess', 'GUEST', 'Booking Success');
  /*!40000 ALTER TABLE `app_route` ENABLE KEYS */;
  UNLOCK TABLES;

  /*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

  /*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
  /*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
  /*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
  /*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
  /*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
  /*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
  /*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

  -- Dump completed on 2025-11-18 12:56:42