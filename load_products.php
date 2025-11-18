<?php
require "db.php";
$conn = db();

$result = $conn->query("SELECT id, nev, ar FROM alkatreszek ORDER BY nev ASC");

$products = [];

while ($row = $result->fetch_assoc()) {
    $products[] = $row;
}

header('Content-Type: application/json');
echo json_encode($products);
