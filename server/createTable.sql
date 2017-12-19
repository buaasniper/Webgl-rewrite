--
-- Table structure for table `features`
--

DROP TABLE IF EXISTS `maintable`;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `maintable` (
  `IP` varchar(32) DEFAULT NULL,
  `agent` text,
  `pichashes` text,
  `time` datetime DEFAULT CURRENT_TIMESTAMP,
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `clientid` varchar(64) DEFAULT NULL,
  KEY `clientid` (`clientid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `maintable`
--

LOCK TABLES `maintable` WRITE;
UNLOCK TABLES;
