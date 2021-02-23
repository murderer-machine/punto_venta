-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-02-2021 a las 22:27:26
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
  `id_usuario` int(11) NOT NULL,
  `tipo_negocio` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `t_subagentes`
--

INSERT INTO `t_subagentes` (`id`, `nombres`, `apellidos`, `abreviatura`, `correo`, `celular`, `direccion`, `referencia`, `ubicacion`, `avatar`, `fecha_activacion`, `fecha_creacion`, `id_usuario`, `tipo_negocio`) VALUES
(1, 'ana lucia', 'suarez huancachoque', 'km16', 'luciasuareshuancachoque@gmail.com', '967262027', 'ciudad de dios mz 20, lt 1 - yura km 16', 'paradero de combis en el km 16 carretera a yura', '', '', '0000-00-00', '0000-00-00 00:00:00', 1, 'multiservicios'),
(2, 'Ronald', 'choque umasi', 'villa el paraiso', 'abudioletters@gmail.com', '966656455', 'villa paraiso m3, c-2', 'a cinco cuadras arriba del grifo villa el pariso', '', '', '0000-00-00', '0000-00-00 00:00:00', 1, 'tienda y agente bcp'),
(3, 'paolo miguel', 'valencia calderon', 'el palacio ii', 'paolo8.v@gmail.com', '950100548', 'urb. el palacio H - 12', 'a una cuadra de la puerta de ingreso de campo verde', '', '', '0000-00-00', '0000-00-00 00:00:00', 1, 'multiservicios'),
(4, 'cristian harold', 'Paredes  Canaza', 'av. v.a.b', 'cristianparedescanaza@gmail.om', '958100637', 'av. victor andres belaunde mz b, lote 19', 'a lado de la cevicheria cevichop', '', '', '0000-00-00', '0000-00-00 00:00:00', 1, 'minimarket'),
(5, 'carlos abel', 'gonzales mesa', 'umacollo', 'carlosh8@gmail.com', '987941119', 'calle lazo de los rios, 103 - umacollo', 'a dos casa de la  pamaderia astoria', '', '', '0000-00-00', '0000-00-00 00:00:00', 1, 'servivo tecnico y agente bcp'),
(6, 'alfredo', 'melchor z', 'plaza las americas', 'mary_borja@hotmail.com', '054-521530', 'plaza las americas', 'en la esquina del semaforo de la plaza las americas', '', '', '0000-00-00', '0000-00-00 00:00:00', 1, 'multiservicios'),
(7, 'rossana catalina', 'valdivia huanca', 'av. Emmel', 'anasor1107@gmail.com', '958954402', 'av. emmel 200 - arequipa', 'a 3 cuadras de tienda francos', '', '', '0000-00-00', '0000-00-00 00:00:00', 1, 'multiservicios'),
(8, 'susana rudy', 'huamani ruelas', 'san miguel', 'shuanabi007@gmail.com', '983467331', 'san miguel de piura - 404', 'al frente del restaurante el moustrito', '', '', '0000-00-00', '0000-00-00 00:00:00', 1, 'multiservicios'),
(9, 'milagros isabel', 'caichaya cary', 'familia', 'kadets.3d2@hotmail.com', '941468452', 'urb. la colina II A - 18, jacobo Hunter', 'a tres cuadras del grifo primax', '', '', '0000-00-00', '0000-00-00 00:00:00', 1, 'minimarket'),
(10, 'eresa jesusa', 'ramirez colquehuanca', 'comercial teresita', 'administracion@transcomser.pe', '993449015', 'urb. san juan de dios - jacobo hunter', 'entre la calle san miguel grau con san juan de dios', '', '', '0000-00-00', '0000-00-00 00:00:00', 1, 'multiservicios'),
(11, 'rosa angela', 'puma rojas', 'tiabaya ovalo', 'rossangeluz2030@gmail.com', '959697781', 'urb. el retiro A-3 tiabaya antigua panamericana', 'entrada a la carretera antigua', '', '', '0000-00-00', '0000-00-00 00:00:00', 1, 'tienda y agente bcp'),
(12, 'maria isabel', 'lazaraso paco', 'av. Peru pachacutec', 'ysabelita272@gmail.com', '959755902', 'av. peru 305 - pachacutec', 'avenida principal', '', '', '0000-00-00', '0000-00-00 00:00:00', 1, 'agente bcp y internet'),
(13, 'shirley fiorella', 'paco tisnado', 'ovalo muni hunter', 'dina2244@hotmail.com', '962394346', 'av.viña del mar', 'en el ovalo de la municipalidad de hunter', '', '', '0000-00-00', '0000-00-00 00:00:00', 1, 'botica'),
(14, 'estanislada mercedez', 'escobar talledo', 'pro-hogar', 'stanysc@hotmail.com', '920822678', 'av. prohogar - 601, miraflores', 'al frente de gambarini', '', '', '0000-00-00', '0000-00-00 00:00:00', 1, 'tienda y agente bcp'),
(15, 'rosmery', 'ticona mamani', 'tienda alessandra', 'rossyticonam@gmail.com', '970789553', 'calle miguel grau 204. la libertad', 'a lado de la municipalidad de cerro colorado', '', '', '0000-00-00', '0000-00-00 00:00:00', 1, 'tienda'),
(16, 'adriana isabel', 'perea mamani', 'la isla', 'adriana12021988@gmail.com', '930261567', 'centro comercial la isla - zona c', 'en la esquina de la isla co  direccion al cementerio de pachacutec', '', '', '0000-00-00', '0000-00-00 00:00:00', 1, 'venta de soat'),
(17, 'elena maribel', 'checa achaco', 'dean valdivia', 'dulio_060987@gmail.com', '999391664', 'calle dean valdivia - 515 - cercado', 'a lado de caja arequipa', '', '', '0000-00-00', '0000-00-00 00:00:00', 1, 'cochera'),
(18, 'cinthya', 'romero suyo', 'virgen de guadalupe', 'cynthya.romero.suyo@gmail.com', '940436172', 'a. ramon castilla conmicalea bastidas 691 - tomilla, en adelante', 'a tres cuadras del estadio de la tomilla', '', '', '0000-00-00', '0000-00-00 00:00:00', 1, 'multiservicios'),
(19, 'lely alicia', 'cornejo rivera', 'rafaela', 'aliciainternew@yahoo.com', '959932766', 'av. Victor andres belaunde - 109 - umacollo', 'a lado de mapfre', '', '', '0000-00-00', '0000-00-00 00:00:00', 1, 'multiservicios'),
(20, 'elizabeth dalila', 'patiño ataucuri', 'el temblorcito', 'dalilapatibo@gmail.com', '958128135', 'calle 20 de abril 400, francisco bolognesi - cayma', 'finalizando la calle francisco bolognesi', '', '', '0000-00-00', '0000-00-00 00:00:00', 1, 'multiservicios'),
(21, 'beberly felipa', 'cancino mamani', 'minimarket eli', 'beberlycancinomamank@gmail.com', '981276294', 'jose santos chocano213 - umacollo', 'en el parque la catolica', '', '', '0000-00-00', '0000-00-00 00:00:00', 1, 'tienda'),
(22, 'heber amaru', 'colquehuanca moroco', 'comercial rodmard', 'heber@gmail.com', '951515775', 'malecon progresista 206, urb progresista paucarpata', 'pasando el puente santa rosa', '', '', '0000-00-00', '0000-00-00 00:00:00', 1, 'tienda'),
(23, 'silvia', 'chalco', 'silvanita', 'silvia.chalco@hotmail', '958334001', 'av. Progreso 771 - miraflores', 'cerca a la calle puene arnao', '', '', '0000-00-00', '0000-00-00 00:00:00', 1, 'multiservicios'),
(24, 'rina hermelinda', 'avendaño', 'b. virgen de chapi', 'sin correo', '992340376', 'av. Nicolas de pierola 302 - mariscal castilla', 'a lado de la comisaria de pachacutec', '', '', '0000-00-00', '0000-00-00 00:00:00', 1, 'botica'),
(25, 'olga lidia', 'luque laura', 'librería lidia', 'laura_lu22@hotmail.com', '973039925', 'av.jose santos atahualpa v-4, pachacutec', 'al frente del colegio', '', '', '0000-00-00', '0000-00-00 00:00:00', 1, 'mutiservicios'),
(26, 'hammerly yonathan', 'guevara avendaño', 'shekinah', 'yano_nat_23@hotmail.com', '992341036', 'av. los incas 702, semirural pachacutec', 'a 8 cuadras de la avenida peru', '', '', '0000-00-00', '0000-00-00 00:00:00', 1, 'botica'),
(27, 'georgina yanira', 'alvarez bautista', 'siah', 'eyalvarez@gmail.com', '958100762', 'jr. Progreso mhz 12. lote 4 - pachacutec', 'al frente de un parquesito', '', '', '0000-00-00', '0000-00-00 00:00:00', 1, 'multiservicios');

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
(1, 6, '60355c1557e73.pdf', 1, 1, '2021-02-23 14:48:37'),
(2, 1, '60356326a5636.pdf', 1, 0, '2021-02-23 15:18:46'),
(3, 1, '6035652c1554a.pdf', 1, 0, '2021-02-23 15:27:24');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `t_subagentes_vouchers`
--

CREATE TABLE `t_subagentes_vouchers` (
  `id` int(11) NOT NULL,
  `id_subagente_venta` int(11) NOT NULL,
  `fecha_operacion` text NOT NULL,
  `nro_operacion` int(11) NOT NULL,
  `banco` text NOT NULL,
  `nombre_cuenta` text NOT NULL,
  `nombre_archivo_imagen` text NOT NULL,
  `observaciones` text NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha_creacion` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `t_subagentes_vouchers`
--

INSERT INTO `t_subagentes_vouchers` (`id`, `id_subagente_venta`, `fecha_operacion`, `nro_operacion`, `banco`, `nombre_cuenta`, `nombre_archivo_imagen`, `observaciones`, `id_usuario`, `fecha_creacion`) VALUES
(1, 1, '2021-02-02', 2, '02/02/2021', '02/02/2021', ',60355c1557e73_0.jpg,60355c1557e73_1.jpg', '02/02/2021', 1, '2021-02-23 14:49:13');

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
-- Indices de la tabla `t_subagentes_vouchers`
--
ALTER TABLE `t_subagentes_vouchers`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de la tabla `t_subagentes_ventas`
--
ALTER TABLE `t_subagentes_ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `t_subagentes_vouchers`
--
ALTER TABLE `t_subagentes_vouchers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `t_usuarios`
--
ALTER TABLE `t_usuarios`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
