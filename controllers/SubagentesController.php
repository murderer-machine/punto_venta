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
use alekas\models\DatosSoat;
use alekas\models\EmpresasSeguro;
use alekas\models\ProductosSeguro;
use Dompdf\Dompdf;
use alekas\corelib\Numeros;

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
            $datos_soat = DatosSoat::select()->where([['id_subagente_venta', $value['id']]])->run()->datos();
            $ventas[$key]['datos_soat'] = empty($datos_soat) ? 0 : 1;
        }
        return $this->json($ventas);
    }

    public function ventasPagadoPDF(Request $request) {
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
                t_subagentes_vouchers.observaciones,
                t_datos_soat.id_empresa')
                ->join('t_subagentes_vouchers', 't_subagentes_vouchers.id_subagente_venta', '=', 't_subagentes_ventas.id')
                ->join('t_datos_soat', 't_datos_soat.id_subagente_venta', '=', 't_subagentes_ventas.id')
                ->where($busqueda)
                ->whereDate('t_subagentes_ventas.fecha_creacion', $parametros['fecha_inicio'] == '' ? fecha : $parametros['fecha_inicio'], $parametros['fecha_final'] == '' ? fecha : $parametros['fecha_final'])
                ->orderBy([['id_empresa', 'ASC']])
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
            $datos_soat = DatosSoat::select()->where([['id_subagente_venta', $value['id']]])->run()->datos();
            $ventas[$key]['datos_soat'] = empty($datos_soat) ? array() : $datos_soat[0];
            if (!empty($datos_soat)) {
                $empresa = EmpresasSeguro::select('nombre')->where([['id', $datos_soat[0]['id_empresa']]])->run()->datos();
                $producto = ProductosSeguro::select('nombre')->where([['id', $datos_soat[0]['id_producto']]])->run()->datos();
                $ventas[$key]['datos_soat']['id_empresa'] = $empresa[0];
                $ventas[$key]['datos_soat']['id_producto'] = $producto[0];
            }
        }

        $path = 'img/logoPDF.jpg';
        $type = pathinfo($path, PATHINFO_EXTENSION);
        $data = file_get_contents($path);
        $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
        $daticos = '<img src="' . $base64 . '" width="300"><br/><br/>';

        $cabeza_tabla = '<table style="font-size:9px;">
                            <tr>
                                <th style="border:1px solid black;padding:2px;background-color:#00B0F0">F. DE VENTA</th>
                                <th style="border:1px solid black;padding:2px;background-color:#00B0F0">EMPRESA</th>
                                <th style="border:1px solid black;padding:2px;background-color:#00B0F0">PRODUCTO</th>
                                <th style="border:1px solid black;padding:2px;background-color:#00B0F0">PÓLIZA</th>
                                <th style="border:1px solid black;padding:2px;background-color:#00B0F0">PLACA</th>
                                <th style="border:1px solid black;padding:2px;background-color:#00B0F0">PRIMA TOTAL</th>
                                <th style="border:1px solid black;padding:2px;background-color:#00B0F0">PRIMA NETA</th>
                                <th style="border:1px solid black;padding:2px;background-color:#00B0F0">COMISION</th>
                                <th style="border:1px solid black;padding:2px;background-color:#00B0F0">%</th>
                                <th style="border:1px solid black;padding:2px;background-color:#00B0F0">COM. AGENTE</th>
                                <th style="border:1px solid black;padding:2px;background-color:#00B0F0">DATOS DEL CLIENTE</th>
                                <th style="border:1px solid black;padding:2px;background-color:#00B0F0">TIPO EMISION</th>                                
                            </tr>
                        '
        ;
        $pie_tabla = '</table>';
        $cuerpo_tabla = '';
        $importe = 0;
        $prima_neta = 0;
        $comision_broker = 0;
        $comision_agente = 0;

        foreach ($ventas as $value) {
            $importe = $importe + $value['datos_soat']['importe'];
            $prima_neta = $prima_neta + $value['datos_soat']['prima_neta'];
            $comision_broker = $comision_broker + $value['datos_soat']['comision_broker'];
            $comision_agente = $comision_agente + $value['datos_soat']['comision_agente'];
            $cuerpo_tabla = $cuerpo_tabla . '
                        
                        <tr> 
                            <td style="border:1px solid black;padding:2px;text-align: center;vertical-align:middle;">' . $value['fecha_operacion'] . '</td>
                            <td style="border:1px solid black;padding:2px;text-align: center;vertical-align:middle;">' . mb_strtoupper($value['datos_soat']['id_empresa']['nombre']) . '</td>    
                            <td style="border:1px solid black;padding:2px;text-align: center;vertical-align:middle;">' . mb_strtoupper($value['datos_soat']['id_producto']['nombre']) . '</td>    
                            <td style="border:1px solid black;padding:2px;text-align: center;vertical-align:middle;">' . $value['datos_soat']['nro_poliza'] . '</td>
                            <td style="border:1px solid black;padding:2px;text-align: center;vertical-align:middle;">' . $value['datos_soat']['placa'] . '</td>
                            <td style="border:1px solid black;padding:2px;text-align: center;vertical-align:middle;">' . $value['datos_soat']['importe'] . '</td>
                            <td style="border:1px solid black;padding:2px;text-align: center;vertical-align:middle;">' . $value['datos_soat']['prima_neta'] . '</td>
                            <td style="border:1px solid black;padding:2px;text-align: center;vertical-align:middle;">' . $value['datos_soat']['comision_broker'] . '</td>
                            <td style="border:1px solid black;padding:2px;text-align: center;vertical-align:middle;">' . $value['datos_soat']['porcentaje'] . ' %</td>
                            <td style="border:1px solid black;padding:2px;text-align: center;vertical-align:middle;">' . $value['datos_soat']['comision_agente'] . '</td>
                            <td style="border:1px solid black;padding:2px;text-align: center;vertical-align:middle;">' . $value['datos_soat']['datos_cliente'] . '</td>
                            <td style="border:1px solid black;padding:2px;text-align: center;vertical-align:middle;">DIGITAL</td>     
                        </tr>
                    ';
        }
        $tabla_totales = '
                <br/>
                <table style="font-size:12px;">
                    <tr>
                        <td style="border:1px solid black;padding:2px;background-color:#00B0F0">TOTAL PRIMA TOTAL : </td>
                        <td style="border:1px solid black;padding:2px;">' . Numeros::convertirDecimal($importe) . '</td>
                    </tr>
                     <tr>
                        <td style="border:1px solid black;padding:2px;background-color:#00B0F0">TOTAL PRIMA NETA : </td>
                        <td style="border:1px solid black;padding:2px;">' . Numeros::convertirDecimal($prima_neta) . '</td>
                    </tr>
                     <tr>
                        <td style="border:1px solid black;padding:2px;background-color:#00B0F0">TOTAL COMISION BROKER : </td>
                        <td style="border:1px solid black;padding:2px;">' . Numeros::convertirDecimal($comision_broker) . '</td>
                    </tr>
                     <tr>
                        <td style="border:1px solid black;padding:2px;background-color:#FFFF00">TOTAL COMISION AGENTE : </td>
                        <td style="border:1px solid black;padding:2px;">' . Numeros::convertirDecimal($comision_agente) . '</td>
                    </tr>
                </table>';
        $daticos = $daticos . $cabeza_tabla . $cuerpo_tabla . $pie_tabla . $tabla_totales;

        //echo $daticos;
        $dompdf = new Dompdf();
        $dompdf->loadHtml($daticos);
        $dompdf->setPaper('A4', 'landscape');
        $dompdf->render();
        $dompdf->stream('reporte');
    }

}
