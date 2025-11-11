<?php
header('Content-Type: application/json; charset=utf-8');
error_reporting(E_ALL);
ini_set('display_errors', 1);

$servername = "localhost";
$username   = "root";
$password   = "";
$dbname     = "Proba";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["error" => $conn->connect_error]));
}
$conn->set_charset("utf8mb4");

$action = $_GET['action'] ?? '';

// 🔹 OLVASÁS (Read)
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
        echo json_encode(["error" => $conn->error]);
        exit;
    }

    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }

    echo json_encode($rows, JSON_UNESCAPED_UNICODE);
    exit;
}

// 🔹 HOZZÁADÁS (Add)
elseif ($action === 'add') {
    $nev = $_POST['nev'] ?? '';
    $felhasznalo = $_POST['felhasznalo'] ?? '';
    $jelszo = $_POST['jelszo'] ?? '';
    $jogosultsag = $_POST['jogosultsag_id'] ?? 3;

    if (!$nev || !$felhasznalo || !$jelszo) {
        echo json_encode(["error" => "Hiányzó adat!"]);
        exit;
    }

    $nev = $conn->real_escape_string($nev);
    $felhasznalo = $conn->real_escape_string($felhasznalo);
    $jelszo = $conn->real_escape_string($jelszo);

    $sql = "
        INSERT INTO `Felhasználók` (`Név`, `Felhasználónév`, `Jelszó`, `JogosultsagID`)
        VALUES ('$nev', '$felhasznalo', '$jelszo', '$jogosultsag')
    ";

    if (!$conn->query($sql)) {
        echo json_encode(["error" => $conn->error]);
    } else {
        echo json_encode(["status" => "ok"]);
    }
    exit;
}

// 🔹 TÖRLÉS (Delete több elem)
elseif ($action === 'deleteMany') {
    $ids = $_POST['ids'] ?? [];

    if (!empty($ids)) {
        $safeIds = array_map('intval', $ids);
        $idList = implode(',', $safeIds);
        $conn->query("DELETE FROM `Felhasználók` WHERE `ID` IN ($idList)");
    }

    echo json_encode(["status" => "ok"]);
    exit;
}

$conn->close();
