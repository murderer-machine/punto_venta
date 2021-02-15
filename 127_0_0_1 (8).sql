-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-02-2021 a las 22:09:21
-- Versión del servidor: 10.4.13-MariaDB
-- Versión de PHP: 7.4.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `confianza_general`
--
CREATE DATABASE IF NOT EXISTS `confianza_general` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `confianza_general`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `t_subagentes`
--

CREATE TABLE `t_subagentes` (
  `id` int(11) NOT NULL,
  `nombres` varchar(255) NOT NULL,
  `apellidos` varchar(255) NOT NULL,
  `abreviatura` varchar(255) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `celular` varchar(255) NOT NULL,
  `direccion` text NOT NULL,
  `referencia` text NOT NULL,
  `ubicacion` text NOT NULL,
  `avatar` varchar(255) NOT NULL,
  `fecha_activacion` date NOT NULL,
  `fecha_creacion` datetime NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `t_subagentes`
--

INSERT INTO `t_subagentes` (`id`, `nombres`, `apellidos`, `abreviatura`, `correo`, `celular`, `direccion`, `referencia`, `ubicacion`, `avatar`, `fecha_activacion`, `fecha_creacion`, `id_usuario`) VALUES
(1, 'ana lucia', 'suarez huancachoque', 'km 16', 'luciasuareshuancachoque@gmail.com', '967262027', 'ciudad de dios mz 20, lt 1 - yura km 16', '', '', '', '2021-01-06', '2021-02-12 15:57:06', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `t_subagentes_ventas`
--

CREATE TABLE `t_subagentes_ventas` (
  `id` int(11) NOT NULL,
  `id_subagente` int(11) NOT NULL,
  `nombre_archivo_pdf` varchar(255) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `pagado` int(11) NOT NULL COMMENT '0 = no pagado\r\n1 = pagado',
  `fecha_creacion` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `t_subagentes_ventas`
--

INSERT INTO `t_subagentes_ventas` (`id`, `id_subagente`, `nombre_archivo_pdf`, `id_usuario`, `pagado`, `fecha_creacion`) VALUES
(1, 1, '602ad6814d9ea.pdf', 1, 0, '2021-02-15 15:16:01'),
(2, 1, '602ad734af4a9.pdf', 1, 0, '2021-02-15 15:19:00'),
(3, 1, '602ad78dc0226.pdf', 1, 0, '2021-02-15 15:20:29'),
(4, 1, '602adb4ed7eaa.pdf', 1, 0, '2021-02-15 15:36:30'),
(5, 1, '602adb602ec4e.pdf', 1, 0, '2021-02-15 15:36:48'),
(6, 1, '602adb7081fe3.pdf', 1, 0, '2021-02-15 15:37:04'),
(7, 1, '602adb72e75b2.pdf', 1, 0, '2021-02-15 15:37:06'),
(8, 1, '602addba858e9.pdf', 1, 0, '2021-02-15 15:46:50'),
(9, 1, '602adfff189ab.pdf', 1, 0, '2021-02-15 15:56:31'),
(10, 1, '602ae023c038f.pdf', 1, 0, '2021-02-15 15:57:07'),
(11, 1, '602ae1128d3fb.pdf', 1, 0, '2021-02-15 16:01:06');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `t_usuarios`
--

CREATE TABLE `t_usuarios` (
  `id` bigint(20) NOT NULL,
  `dni` varchar(255) COLLATE utf8_spanish2_ci NOT NULL,
  `nombres` varchar(255) COLLATE utf8_spanish2_ci NOT NULL,
  `apellidos` varchar(255) COLLATE utf8_spanish2_ci NOT NULL,
  `direccion` text COLLATE utf8_spanish2_ci NOT NULL,
  `correo` varchar(255) COLLATE utf8_spanish2_ci NOT NULL,
  `celular` varchar(9) COLLATE utf8_spanish2_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_spanish2_ci NOT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `t_usuarios`
--

INSERT INTO `t_usuarios` (`id`, `dni`, `nombres`, `apellidos`, `direccion`, `correo`, `celular`, `password`, `fecha_creacion`) VALUES
(1, '45463902', 'marco antonio', 'rodriguez salinas', 'urb. las mercedes d-12', 'marcorodriguez@confianzayvida.com', '986211925', 'c41c6d91d6a2eb5bc4c2de1eb4b7caf8a2ce528cf3efb52578d581a1a1006ce35edb757b2d0e3daa12261833037b70aef0147716876e1c41841bf8c2ffbebce6', '2020-08-13 09:02:44');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `t_subagentes`
--
ALTER TABLE `t_subagentes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`);

--
-- Indices de la tabla `t_subagentes_ventas`
--
ALTER TABLE `t_subagentes_ventas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `t_usuarios`
--
ALTER TABLE `t_usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `t_subagentes`
--
ALTER TABLE `t_subagentes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `t_subagentes_ventas`
--
ALTER TABLE `t_subagentes_ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `t_usuarios`
--
ALTER TABLE `t_usuarios`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
