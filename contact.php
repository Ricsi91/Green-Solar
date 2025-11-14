<?php
session_start();
require __DIR__ . '/header.php';
$old = $_SESSION['old'] ?? [];
$success = $_SESSION['success'] ?? null;
$error = $_SESSION['error'] ?? null;
unset($_SESSION['success'], $_SESSION['error'], $_SESSION['old']);
?>
<section>
  <h1>Kapcsolat</h1>
  <?php if ($success): ?>
    <p style="color:green"><?=htmlspecialchars($success)?></p>
  <?php endif; ?>
  <?php if ($error): ?>
    <p style="color:red"><?=htmlspecialchars($error)?></p>
  <?php endif; ?>
  <form action="send_contact.php" method="post">
    <label>Név<br><input type="text" name="name" value="<?=htmlspecialchars($old['name'] ?? '')?>" required></label><br>
    <label>Email<br><input type="email" name="email" value="<?=htmlspecialchars($old['email'] ?? '')?>" required></label><br>
    <label>Üzenet<br><textarea name="message" required><?=htmlspecialchars($old['message'] ?? '')?></textarea></label><br>
    <button type="submit">Küldés</button>
  </form>
</section>
<?php require __DIR__ . '/footer.php';
