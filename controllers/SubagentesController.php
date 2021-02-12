<?php

namespace alekas\controllers;

use alekas\core\Request;
use alekas\models\Subagentes;
use alekas\core\Controller;
use alekas\core\Aplicacion;

class SubagentesController extends Controller {

    public function __construct() {
        ///$this->VerificaSession();
    }

    public function mostrar() {
        $subagentes = Subagentes::select('id,abreviatura')->run()->datos(true);
        print_r($subagentes);
    }

    public function subir(Request $request) {
        $output_dir = Aplicacion::$root_principal . "\\documentos_subidos\\certificados_pv\\".fecha;
        if (file_exists($output_dir)) {
            
        } else {
            mkdir($output_dir, 0777);
        }
        if (isset($_FILES["avatar"])) {
            $error = $_FILES["avatar"]["error"];
            if (!is_array($_FILES["avatar"]["name"])) {
                $fileName = $_FILES["avatar"]["name"];
                $imageFileType = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
                move_uploaded_file($_FILES["avatar"]["tmp_name"], $output_dir . '\\' . uniqid() . '.' . $imageFileType);
            } else {
                echo 'aqui';
                $fileCount = count($_FILES["avatar"]["name"]);
                for ($i = 0; $i < $fileCount; $i++) {
                    $fileName = $_FILES["avatar"]["name"][$i];
                    $imageFileType = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
                    move_uploaded_file($_FILES["avatar"]["tmp_name"][$i], $output_dir . '\\' . uniqid() . '.' . $imageFileType);
                }
            }
        }
    }
}
