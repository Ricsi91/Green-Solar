<?php
require_once "db.php";

error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json; charset=utf-8');

// Ellenőrizzük a metódust
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["error" => "POST szükséges!"]);
    exit;
}

// Ellenőrizzük, hogy jönnek-e adatok
if (empty($_POST['felhasznalonev']) || empty($_POST['jelszo'])) {
    echo json_encode(["error" => "Hiányzó adat!"]);
    exit;
}

$felhasznalo = $_POST['felhasznalonev'];
$jelszo = $_POST['jelszo'];

$conn = db();

$sql = "
    SELECT f.`ID`, f.`Név`, f.`Felhasználónév`, f.`Jelszó`, j.`Jogosultság`
    FROM `Felhasználók` f
    LEFT JOIN `Jogosultságok` j ON f.`JogosultsagID` = j.`ID`
    WHERE f.`Felhasználónév` = ?
    LIMIT 1
";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["error" => "Lekérdezés előkészítési hiba: " . $conn->error]);
    $conn->close();
    exit;
}

$stmt->bind_param("s", $felhasznalo);
$stmt->execute();
$res = $stmt->get_result();

if (!$res || $res->num_rows === 0) {
    echo json_encode(["error" => "Hibás felhasználónév vagy jelszó."]);
    $stmt->close();
    $conn->close();
    exit;
}

$user = $res->fetch_assoc();
$stored = $user['Jelszó'];

// Jelszó ellenőrzése
if (password_verify($jelszo, $stored)) {
    unset($user['Jelszó']); // ne küldjük vissza a hash-t
    echo json_encode(["status" => "ok", "user" => $user], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(["error" => "Hibás felhasználónév vagy jelszó."]);
}

$stmt->close();
$conn->close();
