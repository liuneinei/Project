/*
Navicat MySQL Data Transfer

Source Server         : KefuProject
Source Server Version : 50629
Source Host           : drds5c08708617e9public.drds.aliyuncs.com:3306
Source Database       : dmykf

Target Server Type    : MYSQL
Target Server Version : 50629
File Encoding         : 65001

Date: 2018-01-23 11:26:21
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for kefu_users
-- ----------------------------
DROP TABLE IF EXISTS `kefu_users`;
CREATE TABLE `kefu_users` (
  `id` int(11) NOT NULL,
  `companyRltId` int(11) DEFAULT '0',
  `userName` varchar(50) DEFAULT NULL,
  `passWord` varchar(50) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `img` varchar(255) DEFAULT NULL,
  `type` int(11) DEFAULT '0',
  `status` int(11) DEFAULT '0',
  `sessionId` varchar(255) DEFAULT '0',
  `admitNum` int(11) DEFAULT NULL COMMENT '正在接待人数',
  `addTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `auto_shard_key_addTime` (`addTime`),
  KEY `auto_shard_key_companyRltId` (`companyRltId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 dbpartition by hash(`companyRltId`) tbpartition by MMDD(`addTime`) tbpartitions 3;

-- ----------------------------
-- Records of kefu_users
-- ----------------------------
INSERT INTO `kefu_users` VALUES ('2', '0', 'plan313.6266092117004', '202cb962ac59075b964b07152d234b70', '匿名', '', '99', '0', '91cbd8969166b42942a31f7030324970', '0', '2018-01-19 10:42:05');
INSERT INTO `kefu_users` VALUES ('1', '5', 'xiaozhou', '202cb962ac59075b964b07152d234b70', '小周', 'http://wx.qlogo.cn/mmopen/PiajxSqBRaEIsheHVqWCpiaGXiccpJCfFOLficadljvFjH\r\nic57lTsEOtAicgUjwU5UDWFaiaDH3C5a8Y6lKyMJZL8gg1A/0', '100', '0', '59a8fe15cab37a0ecf7db1447f1b5a51', '0', '2018-01-17 17:54:50');
