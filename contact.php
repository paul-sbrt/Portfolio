<?php
/**
 * contact.php — traitement du formulaire de contact du portfolio.
 * Envoie le message via SMTP O2switch vers la boîte pro, avec anti-spam
 * (honeypot + time-trap), validation serveur et anti-injection d'en-têtes.
 *
 * Réponse : JSON {ok, message} en AJAX (fetch) ; sinon redirection ?sent=1|0.
 *
 * ⚠️ DÉPLOIEMENT (O2switch) :
 *   1. Renseigner $CONFIG ci-dessous (identifiants JAMAIS commités en clair —
 *      idéalement via variables d'environnement / fichier hors web root).
 *   2. Installer PHPMailer : `composer require phpmailer/phpmailer`
 *      (ou déposer le dossier PHPMailer/ et adapter les require).
 *   3. Côté front : passer SIMULATE = false dans contact.js.
 *   Testé au déploiement (SMTP/PHP ne tournent pas en local).
 */

// CONFIG : chargée depuis contact.secret.php (HORS git, déposé sur le serveur au
// déploiement). Voir contact.secret.example.php pour le modèle. Chargement plus bas,
// une fois respond() disponible, pour échouer proprement si le fichier manque.

$isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH'])
    && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';

/** Réponse unifiée : JSON en AJAX, redirection sinon. */
function respond($ok, $message, $isAjax)
{
    if ($isAjax) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE);
    } else {
        header('Location: index.html?sent=' . ($ok ? '1' : '0'));
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Méthode non autorisée.', $isAjax);
}

// ---- Config secrète (contact.secret.php, hors git, sur le serveur) ----
$secretFile = __DIR__ . '/contact.secret.php';
$CONFIG = is_file($secretFile) ? require $secretFile : null;
if (
    !is_array($CONFIG)
    || empty($CONFIG['smtp_pass'])
    || strpos((string) ($CONFIG['smtp_pass'] . $CONFIG['to']), 'REMPLIR') !== false
) {
    // Fichier absent ou identifiants non renseignés : on ne tente pas d'envoyer.
    respond(false, "Le formulaire n'est pas encore configuré. Écris-moi directement par email.", $isAjax);
}
// Défauts non secrets (surchargeables par contact.secret.php).
$CONFIG += [
    'to_name'        => 'Paul Sabourault',
    'from'           => 'contact@portfolio-sbrt.com',
    'from_name'      => 'Portfolio Paul Sabourault',
    'smtp_port'      => 465,
    'smtp_secure'    => 'ssl',
    'subject_prefix' => '[Portfolio] ',
    'min_seconds'    => 2,
];

// ---- Anti-spam : honeypot (champ caché rempli = bot) ----
if (!empty($_POST['website'])) {
    // on répond "ok" sans rien envoyer : le bot ne sait pas qu'il est filtré
    respond(true, 'Message envoyé.', $isAjax);
}
// ---- Anti-spam : time-trap (formulaire soumis trop vite) ----
$ts = isset($_POST['ts']) ? (int) $_POST['ts'] : 0; // ms (Date.now côté client)
if ($ts > 0 && (time() * 1000 - $ts) < $CONFIG['min_seconds'] * 1000) {
    respond(false, 'Soumission trop rapide, réessaie.', $isAjax);
}

// ---- Récupération + validation ----
$name    = trim($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');

$errors = [];
if ($name === '' || mb_strlen($name) > 120)                       $errors[] = 'nom';
if (!filter_var($email, FILTER_VALIDATE_EMAIL))                   $errors[] = 'email';
if ($subject === '' || mb_strlen($subject) > 160)                 $errors[] = 'sujet';
if ($message === '' || mb_strlen($message) > 5000)                $errors[] = 'message';
if ($errors) {
    respond(false, 'Champs invalides : ' . implode(', ', $errors), $isAjax);
}

// ---- Anti-injection d'en-têtes SMTP : pas de retours ligne dans les en-têtes ----
$oneline = static function ($s) { return trim(str_replace(["\r", "\n", "%0a", "%0d"], ' ', $s)); };
$name    = $oneline($name);
$email   = $oneline($email);
$subject = $oneline($subject);

// ---- Envoi via PHPMailer + SMTP O2switch ----
require __DIR__ . '/vendor/autoload.php'; // ou les require manuels de PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host       = $CONFIG['smtp_host'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $CONFIG['smtp_user'];
    $mail->Password   = $CONFIG['smtp_pass'];
    $mail->SMTPSecure = $CONFIG['smtp_secure'];
    $mail->Port       = (int) $CONFIG['smtp_port'];
    $mail->CharSet    = 'UTF-8';

    // From = adresse DU DOMAINE (conformité SPF/DKIM O2switch, jamais l'email du
    // visiteur) ; Reply-To = le visiteur, pour lui répondre directement.
    $mail->setFrom($CONFIG['from'], $CONFIG['from_name'] . ' · ' . $name);
    $mail->addAddress($CONFIG['to'], $CONFIG['to_name']);
    $mail->addReplyTo($email, $name);

    $mail->Subject = $CONFIG['subject_prefix'] . $subject;
    $mail->Body    = "Nom : {$name}\nEmail : {$email}\nSujet : {$subject}\n\n{$message}\n";

    $mail->send();
    respond(true, 'Message envoyé, merci. Je te réponds vite.', $isAjax);
} catch (Exception $e) {
    // $mail->ErrorInfo dispo pour les logs serveur (ne pas exposer au client)
    respond(false, "L'envoi a échoué. Réessaie, ou écris-moi par email.", $isAjax);
}
