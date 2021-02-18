<?php

namespace alekas\models;

use alekas\core\Model;

class SubagentesVouchers extends Model {

    protected static $table = "t_subagentes_vouchers";
    public $id;
    public $id_subagente_venta;
    public $fecha_operacion;
    public $nro_operacion;
    public $banco;
    public $nombre_cuenta;
    public $observaciones;
    public $nombre_archivo_imagen;
    public $id_usuario;
    public $fecha_creacion;

    function __construct($id, $id_subagente_venta, $fecha_operacion, $nro_operacion, $banco, $nombre_cuenta, $observaciones, $nombre_archivo_imagen, $id_usuario, $fecha_creacion) {
        $this->id = $id;
        $this->id_subagente_venta = $id_subagente_venta;
        $this->fecha_operacion = $fecha_operacion;
        $this->nro_operacion = $nro_operacion;
        $this->banco = $banco;
        $this->nombre_cuenta = $nombre_cuenta;
        $this->observaciones = $observaciones;
        $this->nombre_archivo_imagen = $nombre_archivo_imagen;
        $this->id_usuario = $id_usuario;
        $this->fecha_creacion = $fecha_creacion;
    }

    function getId() {
        return $this->id;
    }

    function getId_subagente_venta() {
        return $this->id_subagente_venta;
    }

    function getFecha_operacion() {
        return $this->fecha_operacion;
    }

    function getNro_operacion() {
        return $this->nro_operacion;
    }

    function getBanco() {
        return $this->banco;
    }

    function getNombre_cuenta() {
        return $this->nombre_cuenta;
    }

    function getObservaciones() {
        return $this->observaciones;
    }

    function getNombre_archivo_imagen() {
        return $this->nombre_archivo_imagen;
    }

    function getId_usuario() {
        return $this->id_usuario;
    }

    function getFecha_creacion() {
        return $this->fecha_creacion;
    }

    function setId($id): void {
        $this->id = $id;
    }

    function setId_subagente_venta($id_subagente_venta): void {
        $this->id_subagente_venta = $id_subagente_venta;
    }

    function setFecha_operacion($fecha_operacion): void {
        $this->fecha_operacion = $fecha_operacion;
    }

    function setNro_operacion($nro_operacion): void {
        $this->nro_operacion = $nro_operacion;
    }

    function setBanco($banco): void {
        $this->banco = $banco;
    }

    function setNombre_cuenta($nombre_cuenta): void {
        $this->nombre_cuenta = $nombre_cuenta;
    }

    function setObservaciones($observaciones): void {
        $this->observaciones = $observaciones;
    }

    function setNombre_archivo_imagen($nombre_archivo_imagen): void {
        $this->nombre_archivo_imagen = $nombre_archivo_imagen;
    }

    function setId_usuario($id_usuario): void {
        $this->id_usuario = $id_usuario;
    }

    function setFecha_creacion($fecha_creacion): void {
        $this->fecha_creacion = $fecha_creacion;
    }

}
