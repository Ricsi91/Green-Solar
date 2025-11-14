<?php
// Admin oldal (HTML -> PHP konverzió). A JS ugyanazt az API végpontot használja (proba.php).
?>
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Felhasználók kezelése - Admin</title>
  <link rel="stylesheet" href="style.css" />
  <script src="script.js" defer></script>
</head>
<body>
  <!-- FEJLÉC -->
  <header>
    <div class="header-top">
      <p>Cím: ——— | Email: ———</p>
    </div>

    <div class="header-main">
      <div class="logo">
        <a href="homepage.php">Green Solar</a>
      </div>
      <nav>
        <ul>
          <li><a href="product.php">Termékek</a></li>
          <li><a href="services.php">Szolgáltatások</a></li>
          <li><a href="index.php" class="active">Admin</a></li>
          <li><button id="logoutBtn" class="logout-btn">Kijelentkezés</button></li>
        </ul>
      </nav>
    </div>
  </header>

  <h2>Felhasználók táblázat</h2>

  <div id="form-container">
    <input type="text" id="nev" placeholder="Név" required />
    <input type="text" id="felhasznalonev" placeholder="Felhasználónév" required />
    <input type="password" id="jelszo" placeholder="Jelszó" required />

    <select id="jogosultsag" required>
      <option value="">Válassz jogosultságot...</option>
      <option value="1">Fogyasztó</option>
      <option value="2">Raktáros</option>
      <option value="3">User</option>
      <option value="4">Admin</option>
    </select>

    <button id="hozzaad" type="button">➕ Hozzáadás</button>
  </div>

  <div class="toolbar">
    <button id="modositasGomb" type="button">✏️ Módosítás</button>
    <button id="torlesGomb" type="button">🗑 Kijelöltek törlése</button>
  </div>

  <table id="felhasznalokTabla">
    <thead>
      <tr>
        <th class="check-col"></th>
        <th>ID</th>
        <th>Név</th>
        <th>Felhasználónév</th>
        <th>Jelszó</th>
        <th>Jogosultság</th>
      </tr>
    </thead>
    <tbody>
      <!-- ide tölti be a JS -->
    </tbody>
  </table>

  <footer>
    <p>© <?php echo date('Y'); ?> Green Solar – Minden jog fenntartva</p>
  </footer>
</body>
</html>
