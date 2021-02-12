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

$app->ruta->get('logout',[SessionController::class,'logout']);

//Rutas POST
$app->ruta->post('login', [SessionController::class,'login']);

//Vistas
$app->ruta->get('/', 'ingreso');
$app->ruta->get('inicio', 'inicio');
$app->ruta->get('subagentes/mostrar', [SubagentesController::class,'mostrar']);
$app->ruta->post('subagentes/subir', [SubagentesController::class,'subir']);


//Funciones


$app->Run();




