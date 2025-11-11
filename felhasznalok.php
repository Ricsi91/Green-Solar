<?php
require_once "db.php";

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];
$conn = db();

switch ($method) {
    case 'GET':
        $sql = "
            SELECT f.`ID`, f.`Név`, f.`Felhasználónév`, f.`Jelszó`, j.`Jogosultság`
            FROM `Felhasználók` f
            LEFT JOIN `Jogosultságok` j ON f.`Jogosultság ID` = j.`ID`
            ORDER BY f.`ID`
        ";
        $res = $conn->query($sql);
        echo json_encode($res->fetch_all(MYSQLI_ASSOC), JSON_UNESCAPED_UNICODE);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);

        $nev = $data['nev'] ?? '';
        $felhasznalo = $data['felhasznalo'] ?? '';
        $jelszo = $data['jelszo'] ?? '';
        $jogid = $data['jogosultsag_id'] ?? 'NULL';

        if (!$nev || !$felhasznalo || !$jelszo) {
            echo json_encode(["error" => "Hiányzó adat!"]);
            break;
        }

        $stmt = $conn->prepare("
            INSERT INTO `Felhasználók` (`Név`, `Felhasználónév`, `Jelszó`, `Jogosultság ID`)
            VALUES (?, ?, ?, ?)
        ");
        $stmt->bind_param("sssi", $nev, $felhasznalo, $jelszo, $jogid);
        $stmt->execute();

        echo json_encode(["status" => "ok"]);
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"), true);
        $ids = $data['ids'] ?? [];
        if (empty($ids)) {
            echo json_encode(["error" => "Nincs ID"]);
            break;
        }

        $idList = implode(",", array_map("intval", $ids));
        $conn->query("DELETE FROM `Felhasználók` WHERE `ID` IN ($idList)");

        echo json_encode(["status" => "ok"]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Nem támogatott metódus"]);
}

$conn->close();
