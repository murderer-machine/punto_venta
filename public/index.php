<?php

require_once '../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__));
$dotenv->load();

use alekas\core\Aplicacion;
use alekas\controllers\auth\SessionController;
use alekas\controllers\SubagentesController;

$url = $_GET['alekas_url'] ?? "/";

$app = new Aplicacion($url, dirname(__DIR__));

//Rutas GET

$app->ruta->get('logout', [SessionController::class, 'logout']);
$app->ruta->get('subagentes/mostrar', [SubagentesController::class, 'mostrar']);
$app->ruta->get('subagentes/ventas', [SubagentesController::class, 'ventasNoPagado']);
$app->ruta->get('subagentes/ventaspagado', [SubagentesController::class, 'ventasPagado']);
//Rutas POST
$app->ruta->post('login', [SessionController::class, 'login']);
$app->ruta->post('subagentes/subir', [SubagentesController::class, 'subir']);
$app->ruta->post('subagentes/subirvoucher', [SubagentesController::class, 'subirVoucher']);

//Vistas
$app->ruta->get('/', 'ingreso');
$app->ruta->get('inicio', 'inicio');
$app->ruta->get('ventas', 'ventas');






//Funciones


$app->Run();




