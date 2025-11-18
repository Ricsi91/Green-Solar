<?php
// complete_project.php
header('Content-Type: application/json; charset=utf-8');

require_once 'db.php';
$conn = db();

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data) || !isset($data['row_ids']) || !is_array($data['row_ids']) || count($data['row_ids']) === 0) {
    echo json_encode([
        'success' => false,
        'message' => 'Hiányzó vagy érvénytelen row_ids.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// int-re konvertálás, érvénytelenek kiszűrése
$rowIds = array_map('intval', $data['row_ids']);
$rowIds = array_filter($rowIds, fn($id) => $id > 0);

if (empty($rowIds)) {
    echo json_encode([
        'success' => false,
        'message' => 'Nincsenek érvényes projekt ID-k.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 4-es státusz = "Kész" / "Befejezve" (ha nálad más, ITT írd át)
$idList = implode(',', $rowIds);
$sql = "UPDATE projekt SET statusz_id = 4 WHERE id IN ($idList)";

if ($conn->query($sql) === TRUE) {
    echo json_encode([
        'success' => true,
        'message' => 'Rendelés(ek) státusza készre állítva.'
    ], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Adatbázis hiba: ' . $conn->error
    ], JSON_UNESCAPED_UNICODE);
}

$conn->close();
