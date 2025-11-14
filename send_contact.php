<?php
session_start();
require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/config.php';
require __DIR__ . '/db.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');

$_SESSION['old'] = ['name'=>$name,'email'=>$email,'message'=>$message];

if (!$name || !filter_var($email, FILTER_VALIDATE_EMAIL) || !$message) {
    $_SESSION['error'] = 'Kérlek töltsd ki az összes mezőt érvényes emaillel.';
    header('Location: contact.php');
    exit;
}

try {
    $stmt = $pdo->prepare('INSERT INTO messages (name,email,message,created_at) VALUES (?, ?, ?, NOW())');
    $stmt->execute([$name, $email, $message]);
} catch (Exception $e) {
    $_SESSION['error'] = 'Hiba az üzenet mentésekor: ' . $e->getMessage();
    header('Location: contact.php');
    exit;
}

// send email to site owner
$mail = new PHPMailer(true);
try {
    $cfg = require __DIR__ . '/config.php';
    $mail->isSMTP();
    $mail->Host = $cfg['smtp']['host'];
    $mail->SMTPAuth = true;
    $mail->Username = $cfg['smtp']['username'];
    $mail->Password = $cfg['smtp']['password'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = $cfg['smtp']['port'];
    $mail->setFrom($cfg['smtp']['from_email'], $cfg['smtp']['from_name']);
    $mail->addAddress($cfg['smtp']['username']);
    $mail->Subject = 'Új üzenet a kapcsolati űrlapról';
    $body = "Név: {$name}\nEmail: {$email}\n\nÜzenet:\n{$message}";
    $mail->Body = $body;
    $mail->send();
    $_SESSION['success'] = 'Az üzenet elküldve! Köszönjük.';
} catch (Exception $e) {
    $_SESSION['success'] = 'Az üzenet elmentve, de a levelezés sikertelen: ' . $mail->ErrorInfo;
}

header('Location: contact.php');
exit;
