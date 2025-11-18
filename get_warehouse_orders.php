<?php
header('Content-Type: application/json; charset=utf-8');

require_once 'db.php';
$conn = db();

$sql = "
    SELECT 
        p.id                     AS projekt_id,
        p.nev                    AS ugyfel_nev,
        p.helyszin               AS helyszin,
        p.megrendelo_elerhetoseg AS telefon,
        p.letrehozva             AS datum,
        s.nev                    AS statusz_nev,
        pa.alkatresz_id          AS alkatresz_id,
        pa.mennyiseg             AS mennyiseg
    FROM projekt p
    LEFT JOIN statusz           s  ON s.id          = p.statusz_id
    LEFT JOIN projekt_alkatresz pa ON pa.projekt_id = p.id
    ORDER BY p.letrehozva DESC, p.id DESC, pa.id ASC
";

$result = $conn->query($sql);

if (!$result) {
    echo json_encode([]);
    exit;
}

$ordersByProject = [];

while ($row = $result->fetch_assoc()) {
    $pid = (int)$row['projekt_id'];

    if (!isset($ordersByProject[$pid])) {
        $ordersByProject[$pid] = [
            'order_key' => 'proj_' . $pid,
            'nev'       => $row['ugyfel_nev'],
            'helyszin'  => $row['helyszin'],
            'telefon'   => $row['telefon'],
            'datum'     => $row['datum'],
            'statusz'   => $row['statusz_nev'],
            'items'     => [],
            'row_ids'   => [$pid]
        ];
    }

    if (!empty($row['alkatresz_id'])) {
        $ordersByProject[$pid]['items'][] = [
            'alkatresz_id' => (int)$row['alkatresz_id'],
            'nev'          => null,
            'mennyiseg'    => (int)$row['mennyiseg']
        ];
    }
}

$conn->close();

echo json_encode(array_values($ordersByProject), JSON_UNESCAPED_UNICODE);
