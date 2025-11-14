<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Regisztráció</title>
  <link rel="stylesheet" href="style.css">
  <script src="script_register.js" defer></script>

  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f2f2f2;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    .reg-box {
      background: white;
      padding: 25px 30px;
      border-radius: 8px;
      box-shadow: 0 0 8px rgba(0,0,0,0.2);
      width: 310px;
      text-align: center;
    }
    h2 { margin-bottom: 20px; color: #333; }
    input { width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px; }
    button { width: 100%; padding: 8px; background: #007bff; color: white; border: none; border-radius: 4px; cursor:pointer;}
    button:hover { background: #0056b3; }
    #hibaUzenet { margin-top: 10px; font-size: 14px; color: red; }
  </style>
</head>
<body>

  <div class="reg-box">
    <h2>Regisztráció</h2>
    <input id="nev" type="text" placeholder="Név">
    <input id="felhasznalonev" type="text" placeholder="Felhasználónév">
    <input id="jelszo" type="password" placeholder="Jelszó">
    <button id="regBtn">✔ Regisztrálok</button>
    <div id="hibaUzenet"></div>
    <p>Már van fiókod? <a href="login.php">Bejelentkezés</a></p>
  </div>

</body>
</html>
