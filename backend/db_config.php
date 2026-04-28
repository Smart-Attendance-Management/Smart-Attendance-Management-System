<?php
header("Access-Control-Allow-Origin: *"); // Allows React to talk to PHP
header("Access-Control-Allow-Headers: *");

$host = "localhost";
$user = "root";
$pass = "";
$dbname = "attendance_db";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>