<?php
/**
 * MODÈLE de configuration du formulaire de contact.
 *
 * AU DÉPLOIEMENT (sur le serveur O2switch, JAMAIS dans git) :
 *   1. Copier ce fichier :   cp contact.secret.example.php contact.secret.php
 *   2. Remplir les valeurs "À REMPLIR AU DÉPLOIEMENT" ci-dessous.
 *   3. contact.secret.php est gitignored → les identifiants ne partent jamais sur GitHub
 *      et ne sont jamais écrasés par un rsync/déploiement.
 */
return [
    // Destinataire : la boîte pro de Paul qui reçoit les messages.
    'to'          => 'À REMPLIR AU DÉPLOIEMENT',            // ex. paul.sabourault0@gmail.com
    'to_name'     => 'Paul Sabourault',

    // Expéditeur : une adresse DU DOMAINE (conformité SPF/DKIM O2switch).
    'from'        => 'contact@portfolio-sbrt.com',
    'from_name'   => 'Portfolio Paul Sabourault',

    // SMTP O2switch (identifiants de la boîte contact@portfolio-sbrt.com).
    'smtp_host'   => 'portfolio-sbrt.com',                  // SMTP O2switch (confirmé)
    'smtp_user'   => 'contact@portfolio-sbrt.com',          // login SMTP = la boîte
    'smtp_pass'   => 'À REMPLIR AU DÉPLOIEMENT',            // mot de passe de la boîte (serveur uniquement)
    'smtp_port'   => 465,                                   // 465 = SSL implicite
    'smtp_secure' => 'ssl',                                 // 'ssl' pour 465 (surtout PAS 'tls')

    'subject_prefix' => '[Portfolio] ',
    'min_seconds'    => 2,                                  // time-trap anti-bot
];
