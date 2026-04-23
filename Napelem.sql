-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: localhost
-- Létrehozás ideje: 2026. Ápr 23. 19:20
-- Kiszolgáló verziója: 10.4.28-MariaDB
-- PHP verzió: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `Napelem`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `alkatresz`
--

CREATE TABLE `alkatresz` (
  `id` int(11) NOT NULL,
  `nev` varchar(100) NOT NULL,
  `ar` decimal(12,2) NOT NULL CHECK (`ar` >= 0),
  `max_db_rekesz` int(11) NOT NULL CHECK (`max_db_rekesz` > 0),
  `rekesz_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `alkatresz`
--

INSERT INTO `alkatresz` (`id`, `nev`, `ar`, `max_db_rekesz`, `rekesz_id`) VALUES
(1, 'EcoFlow Solarmodul 400W', 270000.00, 20, 5),
(2, 'Huawei SUN2000-5KTL-L1 5 kW inverter', 300000.00, 5, 12),
(3, 'Konzol szett', 15000.00, 50, 27),
(4, 'DC kábel 10m', 3000.00, 100, 43),
(5, 'Teszt termék', 1000.00, 10, 90);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `Felhasználók`
--

CREATE TABLE `Felhasználók` (
  `ID` int(11) NOT NULL,
  `Név` varchar(20) DEFAULT NULL,
  `Felhasználónév` varchar(20) DEFAULT NULL,
  `Jelszó` varchar(255) DEFAULT NULL,
  `JogosultsagID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `Felhasználók`
--

INSERT INTO `Felhasználók` (`ID`, `Név`, `Felhasználónév`, `Jelszó`, `JogosultsagID`) VALUES
(18, 'Fehér Richárd', 'Ricsi', '$2y$10$p33PXLqwlIwVs2Im.3gtxuT0bv7W8iMSs7bERLryfSh09jqVFibD6', 7),
(19, 'Proba Pista', 'Proba', '$2y$10$6JHVU66CfKd4vJuXiCx5E.I7pC4cn2U1RdpPvewn6PUPImZGmK42G', 3),
(20, 'proba', 'admin', '$2y$10$xrD/cXMBI4fKv5/owV1QGua.e5v/YiOgwCLrC/FYGiJgabWJLn9mm', 7),
(21, 'Kis Károly', 'Karcsi', '$2y$10$ruShJ7VlB/8d1xwYVF6.gebH87sZWAoc7u0MTvo/MSzmFf91kEGFy', 6);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `Jogosultságok`
--

CREATE TABLE `Jogosultságok` (
  `ID` int(11) NOT NULL,
  `Jogosultság` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `Jogosultságok`
--

INSERT INTO `Jogosultságok` (`ID`, `Jogosultság`) VALUES
(1, 'Admin'),
(3, 'Felhasználó'),
(4, 'Raktáros'),
(5, 'Raktárvezető'),
(6, 'Mérnök'),
(7, 'Fejlesztő'),
(8, 'Szerelő');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `projekt`
--

CREATE TABLE `projekt` (
  `id` int(11) NOT NULL,
  `nev` varchar(100) NOT NULL,
  `helyszin` varchar(255) DEFAULT NULL,
  `megrendelo_elerhetoseg` varchar(150) DEFAULT NULL,
  `letrehozva` datetime NOT NULL DEFAULT current_timestamp(),
  `ar` int(11) DEFAULT NULL,
  `statusz_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `projekt`
--

INSERT INTO `projekt` (`id`, `nev`, `helyszin`, `megrendelo_elerhetoseg`, `letrehozva`, `ar`, `statusz_id`) VALUES
(3, 'Fehér Richárd', 'Zalaegerszeg, Példa utca 4.', '0630/1234567', '2025-11-18 12:43:14', 552000, 4),
(4, 'kispist', 'zalaegersgz', '312335', '2025-11-19 19:28:20', 1089000, 4),
(5, 'Példa', 'Péter', '0620/1234567', '2025-11-22 10:31:24', 570000, 4),
(6, 'Zöld Zoli', 'Zalaegerszeg, Példa utca 4.', '0630/1234567', '2025-11-22 10:50:45', 579000, 4),
(7, 'Nagy Zoltan', 'Botfa', '0630/1234567', '2025-11-22 10:57:36', 588000, 4),
(8, 'Kis Józsi', 'Bagod', '0620/1234567', '2025-11-22 11:05:34', 273000, 4),
(9, 'Példa Béla', 'zalaegerszeg', '0630/1234567', '2025-11-22 11:13:52', 273000, 6),
(10, 'Adrián', 'Zalaegerszeg', '0620/1234567', '2025-11-22 13:01:33', 1140000, 6),
(11, 'Kis pista', 'Zalaegerszeg, Példa utca 4.', '06301234567', '2026-02-14 10:52:18', 285000, 6),
(12, 'Fehér Richárd', 'Zalaegerszeg, Példa utca 4.', '0630/1234567', '2026-04-23 17:44:56', 840000, 3);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `projekt_alkatresz`
--

CREATE TABLE `projekt_alkatresz` (
  `id` int(11) NOT NULL,
  `projekt_id` int(11) NOT NULL,
  `alkatresz_id` int(11) NOT NULL,
  `mennyiseg` int(11) NOT NULL CHECK (`mennyiseg` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `projekt_alkatresz`
--

INSERT INTO `projekt_alkatresz` (`id`, `projekt_id`, `alkatresz_id`, `mennyiseg`) VALUES
(1, 3, 4, 4),
(2, 3, 1, 2),
(3, 4, 1, 4),
(4, 4, 4, 3),
(5, 5, 1, 1),
(6, 5, 2, 1),
(7, 6, 4, 3),
(8, 6, 2, 1),
(9, 6, 1, 1),
(10, 7, 4, 1),
(11, 7, 1, 1),
(12, 7, 2, 1),
(13, 7, 3, 1),
(14, 8, 4, 1),
(15, 8, 1, 1),
(16, 9, 4, 1),
(17, 9, 1, 1),
(18, 10, 1, 2),
(19, 10, 2, 2),
(20, 11, 1, 1),
(21, 11, 3, 1),
(22, 12, 1, 2),
(23, 12, 2, 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rekesz`
--

CREATE TABLE `rekesz` (
  `id` int(11) NOT NULL,
  `oszlop` varchar(11) DEFAULT NULL,
  `sor` int(11) DEFAULT NULL,
  `polc` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `rekesz`
--

INSERT INTO `rekesz` (`id`, `oszlop`, `sor`, `polc`) VALUES
(1, 'A', 1, 1),
(2, 'A', 1, 2),
(3, 'A', 1, 3),
(4, 'A', 1, 4),
(5, 'A', 2, 1),
(6, 'A', 2, 2),
(7, 'A', 2, 3),
(8, 'A', 2, 4),
(9, 'A', 3, 1),
(10, 'A', 3, 2),
(11, 'A', 3, 3),
(12, 'A', 3, 4),
(13, 'A', 4, 1),
(14, 'A', 4, 2),
(15, 'A', 4, 3),
(16, 'A', 4, 4),
(17, 'A', 5, 1),
(18, 'A', 5, 2),
(19, 'A', 5, 3),
(20, 'A', 5, 4),
(21, 'B', 1, 1),
(22, 'B', 1, 2),
(23, 'B', 1, 3),
(24, 'B', 1, 4),
(25, 'B', 2, 1),
(26, 'B', 2, 2),
(27, 'B', 2, 3),
(28, 'B', 2, 4),
(29, 'B', 3, 1),
(30, 'B', 3, 2),
(31, 'B', 3, 3),
(32, 'B', 3, 4),
(33, 'B', 4, 1),
(34, 'B', 4, 2),
(35, 'B', 4, 3),
(36, 'B', 4, 4),
(37, 'B', 5, 1),
(38, 'B', 5, 2),
(39, 'B', 5, 3),
(40, 'B', 5, 4),
(41, 'C', 1, 1),
(42, 'C', 1, 2),
(43, 'C', 1, 3),
(44, 'C', 1, 4),
(45, 'C', 2, 1),
(46, 'C', 2, 2),
(47, 'C', 2, 3),
(48, 'C', 2, 4),
(49, 'C', 3, 1),
(50, 'C', 3, 2),
(51, 'C', 3, 3),
(52, 'C', 3, 4),
(53, 'C', 4, 1),
(54, 'C', 4, 2),
(55, 'C', 4, 3),
(56, 'C', 4, 4),
(57, 'C', 5, 1),
(58, 'C', 5, 2),
(59, 'C', 5, 3),
(60, 'C', 5, 4),
(61, 'D', 1, 1),
(62, 'D', 1, 2),
(63, 'D', 1, 3),
(64, 'D', 1, 4),
(65, 'D', 2, 1),
(66, 'D', 2, 2),
(67, 'D', 2, 3),
(68, 'D', 2, 4),
(69, 'D', 3, 1),
(70, 'D', 3, 2),
(71, 'D', 3, 3),
(72, 'D', 3, 4),
(73, 'D', 4, 1),
(74, 'D', 4, 2),
(75, 'D', 4, 3),
(76, 'D', 4, 4),
(77, 'D', 5, 1),
(78, 'D', 5, 2),
(79, 'D', 5, 3),
(80, 'D', 5, 4),
(81, 'E', 1, 1),
(82, 'E', 1, 2),
(83, 'E', 1, 3),
(84, 'E', 1, 4),
(85, 'E', 2, 1),
(86, 'E', 2, 2),
(87, 'E', 2, 3),
(88, 'E', 2, 4),
(89, 'E', 3, 1),
(90, 'E', 3, 2),
(91, 'E', 3, 3),
(92, 'E', 3, 4),
(93, 'E', 4, 1),
(94, 'E', 4, 2),
(95, 'E', 4, 3),
(96, 'E', 4, 4),
(97, 'E', 5, 1),
(98, 'E', 5, 2),
(99, 'E', 5, 3),
(100, 'E', 5, 4),
(101, 'F', 1, 1),
(102, 'F', 1, 2),
(103, 'F', 1, 3),
(104, 'F', 1, 4),
(105, 'F', 2, 1),
(106, 'F', 2, 2),
(107, 'F', 2, 3),
(108, 'F', 2, 4),
(109, 'F', 3, 1),
(110, 'F', 3, 2),
(111, 'F', 3, 3),
(112, 'F', 3, 4),
(113, 'F', 4, 1),
(114, 'F', 4, 2),
(115, 'F', 4, 3),
(116, 'F', 4, 4),
(117, 'F', 5, 1),
(118, 'F', 5, 2),
(119, 'F', 5, 3),
(120, 'F', 5, 4);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rekesz_keszlet`
--

CREATE TABLE `rekesz_keszlet` (
  `id` int(11) NOT NULL,
  `rekesz_id` int(11) NOT NULL,
  `alkatresz_id` int(11) NOT NULL,
  `mennyiseg` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `Statusz`
--

CREATE TABLE `Statusz` (
  `id` int(11) NOT NULL,
  `nev` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `Statusz`
--

INSERT INTO `Statusz` (`id`, `nev`) VALUES
(1, 'New'),
(2, 'Draft'),
(3, 'Wait'),
(4, 'Scheduled'),
(5, 'InProgress'),
(6, 'Completed'),
(7, 'Failed');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `webshop`
--

CREATE TABLE `webshop` (
  `id` int(11) NOT NULL,
  `nev` varchar(30) NOT NULL,
  `leiras` varchar(100) DEFAULT NULL,
  `ar` decimal(12,2) NOT NULL,
  `kep` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `webshop`
--

INSERT INTO `webshop` (`id`, `nev`, `leiras`, `ar`, `kep`) VALUES
(2, 'JINKO Tiger Neo N-type 425 W ', '54HL4-(V) 410-430 W fekete keretes, monokristályos napelem – raklapos kiszerelés', 639900.00, 'img/product/product1.jpg'),
(3, 'Huawei | 600W-P1 optimalizáló', '-', 20090.00, 'img/product/product2.jpg'),
(4, 'Huawei Napelem inverter 8kW', '-', 402990.00, 'img/product/product3.jpg'),
(5, 'Huawei Napelem inverter 5kW', '-', 382990.00, 'img/product/product4.jpg');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `alkatresz`
--
ALTER TABLE `alkatresz`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_alkatresz_rekesz` (`rekesz_id`);

--
-- A tábla indexei `Felhasználók`
--
ALTER TABLE `Felhasználók`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `Jogosultság ID` (`JogosultsagID`);

--
-- A tábla indexei `Jogosultságok`
--
ALTER TABLE `Jogosultságok`
  ADD PRIMARY KEY (`ID`);

--
-- A tábla indexei `projekt`
--
ALTER TABLE `projekt`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_projekt_statusz` (`statusz_id`);

--
-- A tábla indexei `projekt_alkatresz`
--
ALTER TABLE `projekt_alkatresz`
  ADD PRIMARY KEY (`id`),
  ADD KEY `alkatresz_id` (`alkatresz_id`),
  ADD KEY `idx_pa_projalka` (`projekt_id`,`alkatresz_id`);

--
-- A tábla indexei `rekesz`
--
ALTER TABLE `rekesz`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `rekesz_keszlet`
--
ALTER TABLE `rekesz_keszlet`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rekesz_id` (`rekesz_id`),
  ADD KEY `alkatresz_id` (`alkatresz_id`);

--
-- A tábla indexei `Statusz`
--
ALTER TABLE `Statusz`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `webshop`
--
ALTER TABLE `webshop`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `alkatresz`
--
ALTER TABLE `alkatresz`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `Felhasználók`
--
ALTER TABLE `Felhasználók`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT a táblához `Jogosultságok`
--
ALTER TABLE `Jogosultságok`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT a táblához `projekt`
--
ALTER TABLE `projekt`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT a táblához `projekt_alkatresz`
--
ALTER TABLE `projekt_alkatresz`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT a táblához `rekesz`
--
ALTER TABLE `rekesz`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

--
-- AUTO_INCREMENT a táblához `rekesz_keszlet`
--
ALTER TABLE `rekesz_keszlet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `Statusz`
--
ALTER TABLE `Statusz`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT a táblához `webshop`
--
ALTER TABLE `webshop`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `alkatresz`
--
ALTER TABLE `alkatresz`
  ADD CONSTRAINT `fk_alkatresz_rekesz` FOREIGN KEY (`rekesz_id`) REFERENCES `rekesz` (`id`);

--
-- Megkötések a táblához `projekt`
--
ALTER TABLE `projekt`
  ADD CONSTRAINT `fk_projekt_statusz` FOREIGN KEY (`statusz_id`) REFERENCES `statusz` (`id`) ON UPDATE CASCADE;

--
-- Megkötések a táblához `projekt_alkatresz`
--
ALTER TABLE `projekt_alkatresz`
  ADD CONSTRAINT `projekt_alkatresz_ibfk_1` FOREIGN KEY (`projekt_id`) REFERENCES `projekt` (`id`),
  ADD CONSTRAINT `projekt_alkatresz_ibfk_2` FOREIGN KEY (`alkatresz_id`) REFERENCES `alkatresz` (`id`);

--
-- Megkötések a táblához `rekesz_keszlet`
--
ALTER TABLE `rekesz_keszlet`
  ADD CONSTRAINT `rekesz_keszlet_ibfk_1` FOREIGN KEY (`rekesz_id`) REFERENCES `rekesz` (`id`),
  ADD CONSTRAINT `rekesz_keszlet_ibfk_2` FOREIGN KEY (`alkatresz_id`) REFERENCES `alkatresz` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
