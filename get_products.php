<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "db.php";

$conn = db();

/*
 * alkatresz tábla mezők:
 *   id
 *   nev
 *   max_db_rekesz  -> ebben van a készlet (darabszám)
 */

$sql = "
    SELECT 
        id,
        nev,
        max_db_rekesz AS qty
    FROM alkatresz
    ORDER BY nev ASC
";

$result = $conn->query($sql);

$rows = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $rows[] = [
            'id'  => (int)$row['id'],
            'nev' => $row['nev'],
            'qty' => (int)$row['qty']
        ];
    }
}

$conn->close();

echo json_encode($rows, JSON_UNESCAPED_UNICODE);
