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

    // ---- Corps HTML soigné (DA portfolio) + fallback texte (AltBody) ----
    // Valeurs échappées (anti-injection HTML dans le mail) ; message : sauts de ligne -> <br>.
    $mail->isHTML(true);
    $h = static function ($s) { return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8'); };
    $nameH    = $h($name);
    $emailH   = $h($email);
    $subjectH = $h($subject);
    $messageH = nl2br($h($message));

    $mail->Body = <<<HTML
<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f1ea;-webkit-text-size-adjust:100%;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea;"><tr><td align="center" style="padding:28px 14px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:#ffffff;border:1px solid #e7e2da;border-radius:14px;overflow:hidden;">
<tr><td style="background:#14110f;padding:26px 30px 22px;">
<div style="font-family:'Courier New',Consolas,monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#f7c948;">Portfolio &#183; Paul Sabourault</div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:26px;font-weight:800;color:#ffffff;letter-spacing:-0.4px;margin-top:8px;">Nouveau message</div>
</td></tr>
<tr><td style="height:4px;line-height:4px;font-size:0;background:#ff004f;background:linear-gradient(90deg,#ff004f 0%,#f7c948 100%);">&nbsp;</td></tr>
<tr><td style="padding:26px 30px 6px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:6px 0;width:80px;vertical-align:top;font-family:'Courier New',Consolas,monospace;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#9a8f82;">Nom</td><td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:600;color:#1a1613;">$nameH</td></tr>
<tr><td style="padding:6px 0;vertical-align:top;font-family:'Courier New',Consolas,monospace;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#9a8f82;">Email</td><td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;"><a href="mailto:$emailH" style="color:#d11346;text-decoration:none;font-weight:600;">$emailH</a></td></tr>
<tr><td style="padding:6px 0;vertical-align:top;font-family:'Courier New',Consolas,monospace;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#9a8f82;">Sujet</td><td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#1a1613;">$subjectH</td></tr>
</table>
</td></tr>
<tr><td style="padding:12px 30px 6px;">
<div style="font-family:'Courier New',Consolas,monospace;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#9a8f82;margin-bottom:10px;">Message</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f4;border-left:3px solid #f7c948;border-radius:8px;"><tr><td style="padding:16px 18px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#28221d;">$messageH</td></tr></table>
</td></tr>
<tr><td style="padding:22px 30px 26px;">
<div style="border-top:1px solid #eee6db;padding-top:16px;font-family:'Courier New',Consolas,monospace;font-size:11px;line-height:1.7;color:#a49a8d;">R&#233;ponds directement &#224; ce mail : il repart vers $nameH.<br>Envoy&#233; depuis portfolio-sbrt.com</div>
</td></tr>
</table>
</td></tr></table>
</body></html>
HTML;

    $mail->AltBody = "Nouveau message depuis le portfolio\n\n"
        . "Nom    : {$name}\n"
        . "Email  : {$email}\n"
        . "Sujet  : {$subject}\n\n"
        . "Message :\n{$message}\n\n"
        . "--\nReponds directement a ce mail (Reply-To : {$email}).\nEnvoye depuis portfolio-sbrt.com\n";

    $mail->send();
    respond(true, 'Message envoyé, merci. Je te réponds vite.', $isAjax);
} catch (Exception $e) {
    // $mail->ErrorInfo dispo pour les logs serveur (ne pas exposer au client)
    respond(false, "L'envoi a échoué. Réessaie, ou écris-moi par email.", $isAjax);
}
