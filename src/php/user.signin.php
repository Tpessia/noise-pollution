<?php

if ($params = json_decode(file_get_contents('php://input'),true)) {
    // DB info

    $servername = $_SERVER["SERVER_ADDR"] == "127.0.0.1" ? "sql131.main-hosting.eu" : "mysql.hostinger.com.br";
    $username = "u643780299_user1";
    $password = "0123456789";
    $dbname = "u643780299_noise";

    // Create connection

    $conn = mysqli_connect($servername, $username, $password, $dbname);

    // Check connection

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }



    // User info

    $username = mysqli_real_escape_string($conn, $params["username"]);
    $password = mysqli_real_escape_string($conn, $params["password"]);

    // Encryption

    if ($keyfile = fopen("key.txt", "r")) {
        $key = fread($keyfile,filesize("key.txt"));

        $cipher = "aes-256-ctr";
        if (in_array($cipher, openssl_get_cipher_methods()))
        {
            // $ivlen = openssl_cipher_iv_length($cipher);
            // $iv = openssl_random_pseudo_bytes($ivlen);
            $iv = '3.14159265358979'; // Incorrect, the iv should be random
            $password = mysqli_real_escape_string($conn, openssl_encrypt($password, $cipher, $key, $options=0, $iv));
            
            // Insert

            $sql = "

                CALL user_sign_in('". $username ."','". $password ."');

            ";

            $result = mysqli_query($conn, $sql);

            if ($result) {
                if (mysqli_num_rows($result) > 0) {
                    while ($row = mysqli_fetch_assoc($result)) {
                        echo json_encode($row);
                    }
                }
                else {
                    die("Error: Query returned 0 results");
                }
            }
            else {
                die("Error: " . $sql . "<br>" . mysqli_error($conn));
            }
        }
        else {
            die("Invalid Cypher Method");
        }

        fclose($keyfile);
    }
    else {
        die("Invalid Key");
    }



    // Close connection

    mysqli_close($conn);
}
else {
    die('Error: ' . 'Invalid parameters');
}

?>