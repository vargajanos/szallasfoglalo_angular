-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Jan 08. 08:41
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `13a_szallasfoglalo`
--
CREATE DATABASE IF NOT EXISTS `13a_szallasfoglalo` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `13a_szallasfoglalo`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `accomodations`
--

CREATE TABLE `accomodations` (
  `id` varchar(40) NOT NULL,
  `title` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL,
  `price` double NOT NULL DEFAULT 0,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `rating` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `accomodations`
--

INSERT INTO `accomodations` (`id`, `title`, `address`, `price`, `phone`, `email`, `description`, `rating`) VALUES
('adewqerewqerwqerewqrqesdf', 'Elizabeth Hotel', '6500 Baja, Bokodi út 17-21.', 6890, '34534543', 'hotelelizabet@gmail.com', NULL, 5),
('d5d79ab5-944f-4bb3-b777-483791885047', 'Balázska', 'Balázs', 8000, '123456', 'en@gmail.com', 'nagyon szép nagyon jó', 0),
('dd425aa7-4be1-473b-aef5-80842a4c12a3', 'Én', 'te', 3, '420', 'aron@gmail.com', 'sad', 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `bookings`
--

CREATE TABLE `bookings` (
  `id` varchar(40) NOT NULL,
  `userID` varchar(40) NOT NULL,
  `accomID` varchar(40) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `personCount` int(11) NOT NULL,
  `checkout` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `bookings`
--

INSERT INTO `bookings` (`id`, `userID`, `accomID`, `startDate`, `endDate`, `personCount`, `checkout`) VALUES
('29d7b3c5-d89c-4ab6-b805-0e52b22ae014', 'da4b9237bacccdf19c0760cab7aec4a8359010b0', 'adewqerewqerwqerewqrqesdf', '2025-01-30', '2025-02-13', 5, 482300);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `images`
--

CREATE TABLE `images` (
  `ID` varchar(40) NOT NULL,
  `roomID` varchar(40) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` varchar(40) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `passwd` varchar(40) NOT NULL,
  `role` varchar(20) NOT NULL,
  `secret` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `passwd`, `role`, `secret`) VALUES
('2c7e0c65-870c-48a3-9097-e939575d27fd', 'Csoki', 'csoki@gmail.com', '7333ece0972560aefbad2a7260aad81ecbe89de2', 'user', '7248feaa77e873d31d864b5cf5b4d35a779d07b9'),
('4f0d6337-a989-4458-9883-c74f6bc878a2', 'szabi', 'szabiszaxi@gmail.com', '385fe082016df07e7cb9301f9355912fe38a8dfa', 'user', 'f6f9ad72-89bf-46d4-9a9f-694e9a499a67'),
('ad58597b-73fd-42c5-87ad-ed3081cbf416', 'paci', 'paci@gmail.com', 'e41b6f672f16670102c5edc71d533ed5dc69236e', 'user', 'fe493ff1-c7c1-4a6a-b009-756b265fb7d3'),
('da4b9237bacccdf19c0760cab7aec4a8359010b0', 'admin', 'admin@gmail.com', '7af2d10b73ab7cd8f603937f7697cb5fe432c7ff', 'admin', '331a4f44a6a875b2ce139ae0c9ce5bb5e1ec0d97');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `accomodations`
--
ALTER TABLE `accomodations`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userID` (`userID`),
  ADD KEY `accomID` (`accomID`);

--
-- A tábla indexei `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `roomID` (`roomID`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`accomID`) REFERENCES `accomodations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
