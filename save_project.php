<?php
header('Content-Type: application/json; charset=utf-8');

require "db.php";
$conn = db();

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!is_array($data)) {
    echo json_encode(["success" => false, "message" => "Hibás JSON."]);
    exit;
}

$nev      = trim($data["nev"] ?? "");
$helyszin = trim($data["helyszin"] ?? "");
$telefon  = trim($data["telefon"] ?? "");
$items    = $data["items"] ?? [];

if ($nev === "" || $helyszin === "" || $telefon === "" || !is_array($items) || count($items) === 0) {
    echo json_encode(["success" => false, "message" => "Hiányzó adatok a mentéshez."]);
    exit;
}

// tranzakció, hogy vagy minden mentődjön, vagy semmi
$conn->begin_transaction();

try {
    // 1) projekt fej mentése
    // feltételezzük, hogy a projekt táblában van: nev, helyszin, megrendelo_elerhetoseg
    // letrehozva és statusz_id mehetnek defaulttal
    $stmtProj = $conn->prepare("
        INSERT INTO projekt (nev, helyszin, megrendelo_elerhetoseg)
        VALUES (?, ?, ?)
    ");
    if (!$stmtProj) {
        throw new Exception("Projekt előkészítési hiba: " . $conn->error);
    }

    $stmtProj->bind_param("sss", $nev, $helyszin, $telefon);
    if (!$stmtProj->execute()) {
        throw new Exception("Projekt mentési hiba: " . $stmtProj->error);
    }

    $projektId = $stmtProj->insert_id;
    $stmtProj->close();

    // 2) tételek mentése projekt_alkatresz táblába
    // projekt_alkatresz: id, projekt_id, alkatresz_id, mennyiseg
    $stmtItem = $conn->prepare("
        INSERT INTO projekt_alkatresz (projekt_id, alkatresz_id, mennyiseg)
        VALUES (?, ?, ?)
    ");
    if (!$stmtItem) {
        throw new Exception("Tétel előkészítési hiba: " . $conn->error);
    }

    foreach ($items as $item) {
        $alkatresz_id = intval($item["alkatresz_id"] ?? 0);
        $mennyiseg    = intval($item["mennyiseg"] ?? 0);

        if ($alkatresz_id <= 0 || $mennyiseg <= 0) {
            throw new Exception("Érvénytelen tétel adat.");
        }

        $stmtItem->bind_param("iii", $projektId, $alkatresz_id, $mennyiseg);
        if (!$stmtItem->execute()) {
            throw new Exception("Tétel mentési hiba: " . $stmtItem->error);
        }
    }

    $stmtItem->close();

    // minden rendben, commit
    $conn->commit();
    $conn->close();

    echo json_encode(["success" => true, "message" => "Rendelés mentve."]);

} catch (Exception $e) {
    // hiba esetén visszagörgetünk
    $conn->rollback();
    $conn->close();

    echo json_encode([
        "success" => false,
        "message" => "Mentési hiba: " . $e->getMessage()
    ]);
}
