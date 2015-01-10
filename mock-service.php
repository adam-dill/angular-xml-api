<?php

$api = new api();

$raw = file_get_contents('php://input');
$xml = new SimpleXMLElement($raw);

//var_dump($xml);
$method = $xml->attributes()['method'];
$values = [];
if($xml->VALUES->VALUE != NULL) {
    $values = $xml->VALUES->VALUE;
}
$args = [];

foreach($values as $value)
{
    array_push($args, $value->attributes()['value']);
}
switch($method)
{
    case 'add':
        $api->add($args);
        break;

    case 'subtract':
        $api->subtract($args);
        break;

    case 'multiply':
        $api->multiply($args);
        break;

    case 'divide':
        $api->divide($args);
        break;

    case 'getMethods':
        $api->getMethods();
        break;

    default:
        $api->error("The method [$method] is not available.");
        break;
}


/**
 *
 *      Service API
 *      -----------
 *
 */
class api
{
    public function add($arr)
    {
        $value = 0;
        foreach($arr as $v) {
            $value += $v;
        }
        echo("<SERVICE type='add' status='OK' value='$value'></SERVICE>");
    }

    public function subtract($arr)
    {
        $value = 0;
        foreach($arr as $v) {
            $value -= $v;
        }
        echo("<SERVICE type='subtract' status='OK' value='$value'></SERVICE>");
    }

    public function multiply($arr)
    {
        $value = 0;
        foreach($arr as $v) {
            if($value == 0) {
                $value = $arr[0];
            } else {
                $value *= $v;
            }
        }
        echo("<SERVICE type='multiply' status='OK' value='$value'></SERVICE>");
    }

    public function divide($arr)
    {
        $value = 0;
        foreach($arr as $v) {
            if($value == 0) {
                $value = $arr[0];
            } else {
                $value /= $v;
            }
        }
        echo("<SERVICE type='divide' status='OK' value='$value'></SERVICE>");
    }

    //
    //      SERVICE INFORMATION
    //
    public function ping()
    {
        echo("<SERVICE type='ping' status='OK'></SERVICE>");
    }

    public function error($message)
    {
        echo("<SERVICE message='$message' status='FAILED'></SERVICE>");
    }

    public function getMethods()
    {
        $xmlstr = "<SERVICE type='getMethods' status='OK'><METHOD value='add'></METHOD><METHOD value='subtract'></METHOD><METHOD value='multiply'></METHOD><METHOD value='divide'></METHOD></SERVICE>";
        echo($xmlstr);
    }
}