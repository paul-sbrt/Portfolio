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

// ====================== CONFIG — À REMPLIR AU DÉPLOIEMENT ======================
$CONFIG = [
    'to'            => 'REMPLIR@ton-domaine.fr',   // destinataire = ta boîte pro
    'to_name'       => 'Paul Sabourault',
    'smtp_host'     => 'REMPLIR.o2switch.net',      // ex. mail.ton-domaine.fr / xxxxx.o2switch.net
    'smtp_user'     => 'REMPLIR@ton-domaine.fr',    // login SMTP (souvent l'adresse complète)
    'smtp_pass'     => 'REMPLIR_MOT_DE_PASSE',      // mot de passe de la boîte — serveur uniquement
    'smtp_port'     => 465,                          // 465 (SSL) ou 587 (TLS)
    'smtp_secure'   => 'ssl',                        // 'ssl' pour 465, 'tls' pour 587
    'subject_prefix'=> '[Portfolio] ',
    'min_seconds'   => 2,                            // time-trap : soumission plus rapide = bot
];
// =============================================================================

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

    // From = TA boîte (conformité SPF/DKIM O2switch — pas l'email du visiteur) ;
    // Reply-To = le visiteur, pour lui répondre directement.
    $mail->setFrom($CONFIG['smtp_user'], 'Portfolio — ' . $name);
    $mail->addAddress($CONFIG['to'], $CONFIG['to_name']);
    $mail->addReplyTo($email, $name);

    $mail->Subject = $CONFIG['subject_prefix'] . $subject;
    $mail->Body    = "Nom : {$name}\nEmail : {$email}\nSujet : {$subject}\n\n{$message}\n";

    $mail->send();
    respond(true, 'Message envoyé — merci, je te réponds vite.', $isAjax);
} catch (Exception $e) {
    // $mail->ErrorInfo dispo pour les logs serveur (ne pas exposer au client)
    respond(false, "L'envoi a échoué. Réessaie, ou écris-moi par email.", $isAjax);
}
