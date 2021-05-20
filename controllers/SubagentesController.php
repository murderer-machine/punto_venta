<?php

namespace alekas\controllers;

use alekas\core\Request;
use alekas\models\Subagentes;
use alekas\core\Controller;
use alekas\core\Aplicacion;
use alekas\models\SubagentesVentas;
use alekas\controllers\auth\SessionController;
use alekas\models\SubagentesVouchers;
use alekas\corelib\FechaHora;

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
            if ($respuesta['error'] == 0) {
                $venta = SubagentesVentas::getById($_POST['id_subagente_venta']);
                $venta->setPagado(1);
                $venta->update();
            }
            return $this->json($respuesta['error']);
        } else {
            return $this->json($respuesta['error'] = 2);
        }
    }

    public static function scriptSubirVoucher($output_dir) {
        file_exists('.' . $output_dir) ? '' : mkdir('.' . $output_dir, 0777);
        $dividido = explode('/', $output_dir);
        if (isset($_FILES["documento"])) {
            $error = $_FILES["documento"]["error"];
            if (!is_array($_FILES["documento"]["name"])) {
                $fileName = $_FILES["documento"]["name"];
                $FileType = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
                $move = move_uploaded_file($_FILES["documento"]["tmp_name"], "." . $output_dir . '/' . $dividido[5] . '.' . $FileType);
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
                $archivos = '';
                $fileCount = count($_FILES["documento"]["name"]);
                for ($i = 0; $i < $fileCount; $i++) {
                    $fileName = $_FILES["documento"]["name"][$i];
                    $FileType = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
                    $move = move_uploaded_file($_FILES["documento"]["tmp_name"][$i], "." . $output_dir . '/' . $dividido[5] . '_' . $i . '.' . $FileType);
                    $condicion_archivo = $archivos == '' ? $archivos : $archivos . ',';
                    $archivos = $condicion_archivo . $dividido[5] . '_' . $i . '.' . $FileType;
                    if (!$move) {
                        return array(
                            'nombre_archivo' => $archivos,
                            'condicion' => false);
                        exit;
                    } else {
                        
                    }
                }
                return array(
                    'nombre_archivo' => $archivos,
                    'condicion' => true);
            }
        }
    }

    public function ventasNoPagado() {
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

    public function ventasPagado(Request $request) {
        $parametros = $request->parametros();
        $busqueda = [['pagado', 1]];
        !empty($parametros['id']) ? array_push($busqueda, ['id_subagente', $parametros['id']]) : '';
        $ventas = SubagentesVentas::select('
                t_subagentes_ventas.id,
                t_subagentes_ventas.id_subagente,
                t_subagentes_ventas.nombre_archivo_pdf,
                t_subagentes_ventas.id_usuario,
                t_subagentes_ventas.pagado,
                t_subagentes_ventas.fecha_creacion,
                t_subagentes_vouchers.fecha_operacion,
                t_subagentes_vouchers.nro_operacion,
                t_subagentes_vouchers.banco,
                t_subagentes_vouchers.nombre_cuenta,
                t_subagentes_vouchers.nombre_archivo_imagen,
                t_subagentes_vouchers.observaciones')
                ->join('t_subagentes_vouchers', 't_subagentes_vouchers.id_subagente_venta', '=', 't_subagentes_ventas.id')
                ->where($busqueda)
                ->whereDate('t_subagentes_ventas.fecha_creacion', $parametros['fecha_inicio'] == '' ? fecha : $parametros['fecha_inicio'], $parametros['fecha_final'] == '' ? fecha : $parametros['fecha_final'])
                ->orderBy([['id', 'DESC']])
                ->run()
                ->datos();
        foreach ($ventas as $key => $value) {
            $id_subagente = Subagentes::select('id,abreviatura')->where([['id', $value['id_subagente']]])->run()->datos();
            $fecha = explode(' ', $value['fecha_creacion']);
            $nombre_archivo_voucher = explode('.', $value['nombre_archivo_pdf']);
            $ventas[$key]['fecha_operacion'] = FechaHora::CambiarTipo($value['fecha_operacion']);
            $ventas[$key]['ruta'] = "/documentos_subidos/certificados_pv/PV. " . mb_strtoupper($id_subagente[0]['abreviatura']) . "/" . $fecha[0] . "/" . $value['nombre_archivo_pdf'];
            $ventas[$key]['ruta_voucher'] = "/documentos_subidos/certificados_pv/PV. " . mb_strtoupper($id_subagente[0]['abreviatura']) . "/" . $fecha[0] . "/" . $nombre_archivo_voucher[0] . "/";
            $ventas[$key]['id_subagente'] = $id_subagente[0];
            $ventas[$key]['nombre_archivo_imagen'] = explode(',', $value['nombre_archivo_imagen']);
            $ventas[$key]['datos_soat'] = rand(0, 1);
        }
        return $this->json($ventas);
    }

}
