<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json; charset=utf-8');

require_once "db.php";
// Debug log a PHP hibákhoz
file_put_contents("debug_log.txt", "register.php elindult: " . date("H:i:s") . "\n", FILE_APPEND);

error_reporting(E_ALL);
ini_set('display_errors', 1);

// JSON beolvasás
$raw = file_get_contents("php://input");
file_put_contents("debug_log.txt", "RAW input: $raw\n", FILE_APPEND);

$data = json_decode($raw, true);
if ($data === null) {
    echo json_encode([
        "error" => "Hibás JSON formátum",
        "raw" => $raw
    ]);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

file_put_contents("debug_log.txt", "register.php elindult: " . date("H:i:s") . "\n", FILE_APPEND);

// Csak POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "error" => "Nem POST! Érzékelt metódus: " . $_SERVER['REQUEST_METHOD'],
        "raw_input" => file_get_contents("php://input"),
        "headers" => getallheaders()
    ]);
    exit;
}


// Olvassuk a JSON body-t
$body = json_decode(file_get_contents("php://input"), true);
if (!is_array($body)) {
    echo json_encode(["error" => "Érvénytelen JSON!"]);
    exit;
}

$nev = trim($body['nev'] ?? '');
$felhasznalo = trim($body['felhasznalo'] ?? '');
$jelszo = $body['jelszo'] ?? '';
$jogid = 3;

if (!$nev || !$felhasznalo || !$jelszo) {
    echo json_encode(["error" => "Hiányzó adat!"]);
    exit;
}

$conn = db();
if (!$conn) {
    echo json_encode(["error" => "Adatbázis kapcsolat hiba"]);
    exit;
}

// Ellenőrzés (prepared)
$check = $conn->prepare("SELECT `ID` FROM `Felhasználók` WHERE `Felhasználónév` = ?");
if (!$check) {
    echo json_encode(["error" => "DB error (check prepare): " . $conn->error]);
    exit;
}
$check->bind_param("s", $felhasznalo);
$check->execute();
$res = $check->get_result();
if ($res && $res->num_rows > 0) {
    echo json_encode(["error" => "A felhasználónév már foglalt!"]);
    $check->close();
    $conn->close();
    exit;
}
$check->close();

// Hash
$hash = password_hash($jelszo, PASSWORD_DEFAULT);

// Beszúrás
$stmt = $conn->prepare("INSERT INTO `Felhasználók` (`Név`, `Felhasználónév`, `Jelszó`, `JogosultsagID`) VALUES (?, ?, ?, ?)");
if (!$stmt) {
    echo json_encode(["error" => "DB error (insert prepare): " . $conn->error]);
    exit;
}
$stmt->bind_param("sssi", $nev, $felhasznalo, $hash, $jogid);

if ($stmt->execute()) {
    echo json_encode(["status" => "ok"]);
} else {
    echo json_encode(["error" => "Adatbázis hiba: " . $stmt->error, "sqlstate" => $stmt->sqlstate]);
}

$stmt->close();
$conn->close();
