<?php

$avatar = $_FILES["avatar"];
$userId = $_POST["userId"];

if (isset($avatar) && isset($userId)) {
    $target_dir = "../../public/users/avatars/";
    $file_name = $userId . "." . pathinfo($avatar["name"], PATHINFO_EXTENSION);
    $target_file = $target_dir . $file_name;
    
    $final_path = "public/users/avatars/" . $file_name;

    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

    // Check if image file is a actual image or fake image
    $check = getimagesize($avatar["tmp_name"]);
    if($check !== false) {
        $uploadOk = 1;
    } else {
        $uploadOk = "Not an image";
    }

    if($imageFileType != "jpg") {
        $uploadOk = "Wrong image format";
    }

    // Check file size
    if ($avatar["size"] > 1000000) { // 1 MB
        $uploadOk = "Image too large";
    }

    // Check if $uploadOk is Ok (1) or error
    if ($uploadOk == 1) {
        if (move_uploaded_file($avatar["tmp_name"], $target_file)) {

            $img = imagecreatefromjpeg($target_file);

            if ($img) {                
                $width  = imagesx($img);
                $height = imagesy($img);

                if ($width > $height) {
                    $size = $height;
                    $centerX = round(($width - $size) / 2);
                    $centerY = 0;
                }
                else if ($height > $width) {
                    $size = $width;
                    $centerX = 0;
                    $centerY = round(($height - $size) / 2);
                }
                else {
                    $size = $width;
                    $centerX = 0;
                    $centerY = 0;
                }

                $img2 = imagecrop($img, ['x' => $centerX, 'y' => $centerY, 'width' => $size, 'height' => $size]);

                if ($img2) {
                    imagejpeg($img2, $target_file);
                    imagedestroy($img2);
                }
                imagedestroy($img);
            }

            // Delete older imgs

            $files = glob($target_dir . $userId . ".*");

            foreach($files as $file) {
                if ($file != $target_file) {
                    unlink($file);
                }
            }

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

            $user_id = mysqli_real_escape_string($conn, $userId);
            $avatar_url = mysqli_real_escape_string($conn, $final_path);
            
            // Insert

            $sql = "

                CALL user_change_avatar('". $user_id ."','". $avatar_url ."');

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

            // Close connection

            mysqli_close($conn);
        } else {
            echo "Sorry, there was an error uploading your file. " . $uploadOk . ".";
        }
    } else {
        echo "Sorry, your file was not uploaded."  . $uploadOk . ".";
    }
}
else {
    die('Error: ' . 'Invalid parameters');
}

?>