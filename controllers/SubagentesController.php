<?php

namespace alekas\controllers;

use alekas\core\Request;
use alekas\models\Subagentes;
use alekas\core\Controller;
use alekas\core\Aplicacion;
use alekas\models\SubagentesVentas;
use alekas\controllers\auth\SessionController;
use alekas\models\SubagentesVouchers;

class SubagentesController extends Controller {

    public function __construct() {
        //$this->VerificaSession();
    }

    public function mostrar() {
        $subagentes = Subagentes::select('id,abreviatura')->run()->datos(true);
        return $subagentes;
    }

    public function subir() {
        $carpeta_agente = "./documentos_subidos/certificados_pv/PV. " . mb_strtoupper($_POST["nombre_subagente"]);
        file_exists($carpeta_agente) ? '' : mkdir($carpeta_agente, 0777);
        $output_dir = "./documentos_subidos/certificados_pv/PV. " . mb_strtoupper($_POST["nombre_subagente"]) . "/" . fecha;
        file_exists($output_dir) ? '' : mkdir($output_dir, 0777);
        $subaganteventas = new SubagentesVentas(null, $_POST['id_subagente'], SubagentesController::scriptSubirCertificado($output_dir), SessionController::idDesencriptado(), 0, fecha_hora);
        $respuesta = $subaganteventas->create();
        return $this->json($respuesta['error']);
    }

    public static function scriptSubirCertificado($output_dir) {
        if (isset($_FILES["documento"])) {
            $error = $_FILES["documento"]["error"];
            if (!is_array($_FILES["documento"]["name"])) {
                $fileName = $_FILES["documento"]["name"];
                $FileType = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
                $uniqid = uniqid();
                move_uploaded_file($_FILES["documento"]["tmp_name"], $output_dir . '\\' . $uniqid . '.' . $FileType);
            } else {
                $fileCount = count($_FILES["documento"]["name"]);
                for ($i = 0; $i < $fileCount; $i++) {
                    $fileName = $_FILES["documento"]["name"][$i];
                    $FileType = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
                    $uniqid = uniqid();
                    move_uploaded_file($_FILES["documento"]["tmp_name"][$i], $output_dir . '\\' . $uniqid . '.' . $FileType);
                }
            }
        }
        return $uniqid . '.' . $FileType;
    }

    public function subirVoucher() {
        $resultado = SubagentesController::scriptSubirVoucher($_POST['nombre_archivo_imagen']);
        if ($resultado['condicion']) {
            $voucher = new SubagentesVouchers(
                    null,
                    $_POST['id_subagente_venta'],
                    $_POST['fecha_operacion'],
                    $_POST['nro_operacion'],
                    $_POST['banco'],
                    $_POST['nombre_cuenta'],
                    $resultado['nombre_archivo'],
                    $_POST['observaciones'],
                    SessionController::idDesencriptado(),
                    fecha_hora);
            $respuesta = $voucher->create();
            return $this->json($respuesta['error']);
        } else {
            return $this->json($respuesta['error'] = 2);
        }
    }

    public static function scriptSubirVoucher($output_dir) {
        $dividido = explode('/', $output_dir);
        if (isset($_FILES["documento"])) {
            $error = $_FILES["documento"]["error"];
            if (!is_array($_FILES["documento"]["name"])) {
                $fileName = $_FILES["documento"]["name"];
                $FileType = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
                $move = move_uploaded_file($_FILES["documento"]["tmp_name"], "." . $output_dir . '.' . $FileType);
                if (!$move) {
                    return array(
                        'nombre_archivo' => $dividido[5] . '.' . $FileType,
                        'condicion' => false);
                } else {
                    return array(
                        'nombre_archivo' => $dividido[5] . '.' . $FileType,
                        'condicion' => true);
                }
            } else {
                $fileCount = count($_FILES["documento"]["name"]);
                for ($i = 0; $i < $fileCount; $i++) {
                    $fileName = $_FILES["documento"]["name"][$i];
                    $FileType = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
                    $move = move_uploaded_file($_FILES["documento"]["tmp_name"][$i], "." . $output_dir . '.' . $FileType);
                    if (!$move) {
                        return array(
                            'nombre_archivo' => $dividido[5] . '.' . $FileType,
                            'condicion' => false);
                    } else {
                        return array(
                            'nombre_archivo' => $dividido[5] . '.' . $FileType,
                            'condicion' => true);
                    }
                }
            }
        }
    }

    public function ventas() {
        $ventas = SubagentesVentas::select()->where([['pagado', 0]])->orderBy([['id', 'DESC']])->run()->datos();
        foreach ($ventas as $key => $value) {
            $id_subagente = Subagentes::select('id,abreviatura')->where([['id', $value['id_subagente']]])->run()->datos();
            $fecha = explode(' ', $value['fecha_creacion']);
            $nombre_archivo_voucher = explode('.', $value['nombre_archivo_pdf']);
            $ventas[$key]['ruta'] = "/documentos_subidos/certificados_pv/PV. " . mb_strtoupper($id_subagente[0]['abreviatura']) . "/" . $fecha[0] . "/" . $value['nombre_archivo_pdf'];
            $ventas[$key]['ruta_voucher'] = "/documentos_subidos/certificados_pv/PV. " . mb_strtoupper($id_subagente[0]['abreviatura']) . "/" . $fecha[0] . "/" . $nombre_archivo_voucher[0];
            $ventas[$key]['id_subagente'] = $id_subagente[0];
        }
        return $this->json($ventas);
    }

}
