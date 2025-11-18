<?php
header('Content-Type: application/json; charset=utf-8');

error_reporting(E_ALL);
// ne törje szét a JSON-t HTML hibával:
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/proba_error.log');

$servername = "localhost";
$username   = "root";
$password   = "";
$dbname     = "Proba";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["error" => $conn->connect_error], JSON_UNESCAPED_UNICODE);
    exit;
}
$conn->set_charset("utf8mb4");

$action = $_GET['action'] ?? '';

/* 🔹 FELHASZNÁLÓK OLVASÁSA (READ) */
if ($action === 'read') {
    $sql = "
        SELECT 
            f.ID,
            f.Név,
            f.Felhasználónév,
            f.Jelszó,
            f.JogosultsagID,
            j.Jogosultság AS Jogosultság
        FROM `Felhasználók` f
        LEFT JOIN `Jogosultságok` j ON f.`JogosultsagID` = j.`ID`
        ORDER BY f.`ID` ASC
    ";

    $result = $conn->query($sql);
    if (!$result) {
        echo json_encode(["error" => $conn->error], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }

    echo json_encode($rows, JSON_UNESCAPED_UNICODE);
    exit;
}

/* 🔹 JOGOSULTSÁGOK LEKÉRÉSE DROPDOWNHOZ */
if ($action === 'roles') {
    $sql = "SELECT `ID`, `Jogosultság` FROM `Jogosultságok` ORDER BY `ID` ASC";
    $result = $conn->query($sql);

    if (!$result) {
        echo json_encode(["error" => $conn->error], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row; // ["ID" => .., "Jogosultság" => ..]
    }

    echo json_encode($rows, JSON_UNESCAPED_UNICODE);
    exit;
}

/*
 * Innentől: ADD / UPDATE / DELETEMANY – JSON-t várunk a törzsben
 */
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!is_array($data)) {
    echo json_encode(["error" => "Érvénytelen JSON törzs."], JSON_UNESCAPED_UNICODE);
    exit;
}

/* 🔹 HOZZÁADÁS (ADD) */
if ($action === 'add') {
    $nev         = trim($data['nev'] ?? '');
    $felhasznalo = trim($data['felhasznalo'] ?? '');
    $jelszo      = trim($data['jelszo'] ?? '');
    $jogosultsag = intval($data['jogosultsag_id'] ?? 0);

    if ($nev === '' || $felhasznalo === '' || $jelszo === '' || $jogosultsag <= 0) {
        echo json_encode(["error" => "Hiányzó adat!"], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = $conn->prepare("
        INSERT INTO `Felhasználók` (`Név`, `Felhasználónév`, `Jelszó`, `JogosultsagID`)
        VALUES (?, ?, ?, ?)
    ");
    if (!$stmt) {
        echo json_encode(["error" => "Előkészítési hiba: " . $conn->error], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt->bind_param("sssi", $nev, $felhasznalo, $jelszo, $jogosultsag);

    if (!$stmt->execute()) {
        echo json_encode(["error" => "Beszúrási hiba: " . $stmt->error], JSON_UNESCAPED_UNICODE);
        $stmt->close();
        exit;
    }

    $stmt->close();
    echo json_encode(["status" => "ok"], JSON_UNESCAPED_UNICODE);
    exit;
}

/* 🔹 MÓDOSÍTÁS (UPDATE) */
if ($action === 'update') {
    $id          = intval($data['id'] ?? 0);
    $nev         = trim($data['nev'] ?? '');
    $felhasznalo = trim($data['felhasznalo'] ?? '');
    $jelszo      = trim($data['jelszo'] ?? '');
    $jogosultsag = intval($data['jogosultsag_id'] ?? 0);

    if ($id <= 0 || $nev === '' || $felhasznalo === '' || $jelszo === '' || $jogosultsag <= 0) {
        echo json_encode(["error" => "Hiányzó vagy hibás adat módosításhoz!"], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = $conn->prepare("
        UPDATE `Felhasználók`
        SET `Név` = ?, `Felhasználónév` = ?, `Jelszó` = ?, `JogosultsagID` = ?
        WHERE `ID` = ?
    ");
    if (!$stmt) {
        echo json_encode(["error" => "Előkészítési hiba (update): " . $conn->error], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt->bind_param("sssii", $nev, $felhasznalo, $jelszo, $jogosultsag, $id);

    if (!$stmt->execute()) {
        echo json_encode(["error" => "Módosítási hiba: " . $stmt->error], JSON_UNESCAPED_UNICODE);
        $stmt->close();
        exit;
    }

    $stmt->close();
    echo json_encode(["status" => "ok"], JSON_UNESCAPED_UNICODE);
    exit;
}

/* 🔹 TÖRLÉS (DELETE TÖBB ELEM) */
if ($action === 'deleteMany') {
    $ids = $data['ids'] ?? [];

    if (!empty($ids) && is_array($ids)) {
        $safeIds = array_map('intval', $ids);
        $safeIds = array_filter($safeIds, fn($v) => $v > 0);
        if (!empty($safeIds)) {
            $idList = implode(',', $safeIds);
            $sqlDel = "DELETE FROM `Felhasználók` WHERE `ID` IN ($idList)";
            if (!$conn->query($sqlDel)) {
                echo json_encode(["error" => "Törlési hiba: " . $conn->error], JSON_UNESCAPED_UNICODE);
                exit;
            }
        }
    }

    echo json_encode(["status" => "ok"], JSON_UNESCAPED_UNICODE);
    exit;
}

// Ha idáig eljut, ismeretlen action:
echo json_encode(["error" => "Ismeretlen action: " . $action], JSON_UNESCAPED_UNICODE);
$conn->close();
