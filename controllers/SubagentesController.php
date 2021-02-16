<?php

namespace alekas\controllers;

use alekas\core\Request;
use alekas\models\Subagentes;
use alekas\core\Controller;
use alekas\core\Aplicacion;
use alekas\models\SubagentesVentas;
use alekas\controllers\auth\SessionController;

class SubagentesController extends Controller {

    public function __construct() {
        $this->VerificaSession();
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
        $subaganteventas = new SubagentesVentas(null, $_POST['id_subagente'], SubagentesController::scriptSubir($output_dir), SessionController::idDesencriptado(), 0, fecha_hora);
        $respuesta = $subaganteventas->create();
        return $this->json($respuesta['error']);
    }

    public static function scriptSubir($output_dir) {
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

    public function ventas() {
        $ventas = SubagentesVentas::select()->where([['pagado', 0]])->orderBy([['id', 'DESC']])->run()->datos();
        foreach ($ventas as $key => $value) {
            $id_subagente = Subagentes::select('id,abreviatura')->where([['id', $value['id_subagente']]])->run()->datos();
            $fecha = explode(' ', $value['fecha_creacion']);
            $ventas[$key]['ruta'] = "/documentos_subidos/certificados_pv/PV. " . mb_strtoupper($id_subagente[0]['abreviatura']) . "/" . $fecha[0] . "/" . $value['nombre_archivo_pdf'];
            $ventas[$key]['id_subagente'] = $id_subagente[0];
        }
        return $this->json($ventas);
    }

}
