<?php
$servername = "sql204.infinityfree.com";
$username   = "if0_40239572";
$password   = "Ricsipunto91";
$dbname     = "if0_40239572_felhasznalok";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Kapcsolódási hiba: " . $conn->connect_error);
}

echo "<h3>Táblák az adatbázisban:</h3><ul>";

$result = $conn->query("SHOW TABLES");
if (!$result) {
    die("Lekérdezési hiba: " . $conn->error);
}

while ($row = $result->fetch_array()) {
    echo "<li>" . htmlspecialchars($row[0]) . "</li>";
}

echo "</ul>";

$conn->close();
?>
