CREATE DATABASE  IF NOT EXISTS `zhimablog` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `zhimablog`;
-- MySQL dump 10.13  Distrib 5.6.11, for Win32 (x86)
--
-- Host: localhost    Database: zhimablog
-- ------------------------------------------------------
-- Server version	5.6.14

--
-- Table structure for table `z_post`
--

DROP TABLE IF EXISTS `z_post`;
CREATE TABLE `z_post` (
  `PST_ID` int(11) NOT NULL AUTO_INCREMENT,
  `PST_USR_ID` int(11) NOT NULL,
  `PST_USR_NICKNAME` VARCHAR(45) NOT NULL,
  `PST_CONTENT` varchar(500) NOT NULL,
  `PST_CREATE_DT` datetime NOT NULL,
  `PST_UPDATE_DT` datetime NOT NULL,
  PRIMARY KEY (`PST_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `z_user`
--

DROP TABLE IF EXISTS `z_user`;
CREATE TABLE `z_user` (
  `USR_ID` int(11) NOT NULL AUTO_INCREMENT,
  `USR_LOGIN` varchar(45) NOT NULL,
  `USR_NICKNAME` varchar(45) NOT NULL,
  `USR_EMAIL` varchar(45) NOT NULL,
  `USR_PASSWORD` varchar(45) NOT NULL,
  `USR_REGISTER_DT` datetime NOT NULL,
  PRIMARY KEY (`USR_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

