<?php
// forward_to_mechanic.php
header('Content-Type: application/json; charset=utf-8');

require_once 'db.php';

$conn = db();

// A JS JSON-t küld: { row_ids: [1, 2, 3] }
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data) || !isset($data['row_ids']) || !is_array($data['row_ids']) || count($data['row_ids']) === 0) {
    echo json_encode([
        'success' => false,
        'message' => 'Hiányzó vagy érvénytelen row_ids.'
    ]);
    exit;
}

// int-re konvertálás, kiszűrjük a 0/negatív értékeket
$rowIds = array_map('intval', $data['row_ids']);
$rowIds = array_filter($rowIds, fn($id) => $id > 0);

if (empty($rowIds)) {
    echo json_encode([
        'success' => false,
        'message' => 'Nincsenek érvényes projekt ID-k.'
    ]);
    exit;
}

// 3-as státusz = "Beszerelés alatt"
$idList = implode(',', $rowIds);
$sql = "UPDATE projekt SET statusz_id = 3 WHERE id IN ($idList)";

if ($conn->query($sql) === TRUE) {
    echo json_encode([
        'success' => true,
        'message' => 'Rendelés(ek) státusza frissítve (Beszerelés alatt).'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Adatbázis hiba: ' . $conn->error
    ]);
}

$conn->close();
