<?php
function db() {
    $servername = "localhost";
    $username   = "root";
    $password   = "";
    $dbname     = "Napelem";
    $socket     = "/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock";

    file_put_contents("debug_log.txt", "db() elindult\n", FILE_APPEND);
    $conn = new mysqli($servername, $username, $password, $dbname, null, $socket);
    file_put_contents("debug_log.txt", "Kapcsolódási kísérlet: host=$servername, db=$dbname, socket=$socket\n", FILE_APPEND);

    if ($conn->connect_error) {
        file_put_contents("debug_log.txt", "❌ Kapcsolódási hiba: " . $conn->connect_error . "\n", FILE_APPEND);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(["error" => "Adatbázis kapcsolat hiba: " . $conn->connect_error]);
        exit;
    }

    // 🔹 Karakterkódolás és collation beállítás (MariaDB kompatibilis)
    if (!$conn->set_charset("utf8mb4")) {
        file_put_contents("debug_log.txt", "⚠️ set_charset hiba: " . $conn->error . "\n", FILE_APPEND);
    }

    $conn->query("SET NAMES 'utf8mb4' COLLATE 'utf8mb4_hungarian_ci'");
    $conn->query("SET CHARACTER SET 'utf8mb4'");
    $conn->query("SET collation_connection = 'utf8mb4_hungarian_ci'");

    file_put_contents("debug_log.txt", "✅ DB kapcsolat rendben, ékezet támogatás beállítva\n", FILE_APPEND);
    return $conn;
}
?>
