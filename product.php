<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "db.php";

$conn = db();

$sql = "SELECT id, nev, leiras, ar, kep FROM webshop";
$result = $conn->query($sql);

$products = [];

while ($row = $result->fetch_assoc()) {
    $products[] = $row;
}

echo json_encode($products, JSON_UNESCAPED_UNICODE);
$conn->close();
?>
