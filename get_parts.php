<?php
require_once "db.php";
$conn = db();

$sql = "SELECT id, nev FROM alkatresz ORDER BY nev ASC";
$result = $conn->query($sql);

$parts = [];
while ($row = $result->fetch_assoc()) {
    $parts[] = $row;
}

header("Content-Type: application/json; charset=utf-8");
echo json_encode($parts);
?>
