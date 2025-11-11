<?php
header('Content-Type: application/json; charset=utf-8');
error_reporting(E_ALL);
ini_set('display_errors', 1);

$servername = "sql204.infinityfree.com";
$username   = "if0_40239572";
$password   = "Ricsipunto91";
$dbname     = "if0_40239572_felhasznalok";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["error" => "Adatbázis kapcsolat hiba: " . $conn->connect_error]);
    exit;
}

// 🔹 Ez a kulcssor hiányzott eddig
$conn->set_charset("utf8mb4");

// 🔹 POST form adatok fogadása
$felhasznalo = $_POST['felhasznalonev'] ?? '';
$jelszo = $_POST['jelszo'] ?? '';

if (empty($felhasznalo) || empty($jelszo)) {
    echo json_encode(["error" => "Hiányzó adat!"]);
    exit;
}

// 🔹 Bejelentkezés lekérdezés – ékezetes nevekkel
$sql = "
    SELECT 
        f.`ID`, 
        f.`Név`, 
        f.`Felhasználónév`, 
        f.`Jelszó`, 
        j.`Jogosultság`
    FROM `Felhasználók` AS f
    LEFT JOIN `Jogosultságok` AS j ON f.`Jogosultság ID` = j.`ID`
    WHERE f.`Felhasználónév` = ? AND f.`Jelszó` = ?
    LIMIT 1
";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["error" => "Lekérdezés előkészítési hiba: " . $conn->error]);
    $conn->close();
    exit;
}

$stmt->bind_param("ss", $felhasznalo, $jelszo);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    $user = $result->fetch_assoc();
    echo json_encode(["status" => "ok", "user" => $user], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(["status" => "error", "error" => "Hibás felhasználónév vagy jelszó."]);
}

$stmt->close();
$conn->close();
