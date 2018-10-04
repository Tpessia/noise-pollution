<?php

session_start();

if ($params = json_decode(file_get_contents('php://input'),true)) {
    $username = $params["username"];
    $password = $params["password"];

    $_SESSION["username"] = $username;
    $_SESSION["password"] = $password;
}
else {
    die('Error: ' . 'Invalid parameters');
}

?>