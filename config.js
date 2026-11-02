/* ================================================================
   CONFIGURATION : le seul fichier à modifier pour changer le téléphone,
   les prix « dès », la remise, brancher le formulaire ou activer le suivi
   Google Ads. Enregistrez, puis rechargez le site (Ctrl + Maj + R).
   ================================================================ */
window.SITE = {
  nom: "DIAGALIS",
  tel: "01 79 72 70 10",             // numéro affiché
  telLien: "+33179727010",     // numéro du bouton d'appel, format international sans espaces
  horaires: "Lun-Ven 9h-19h, Sam 9h-12h",
  adresse: "11 rue Albert Einstein, 77420 Champs-sur-Marne",
  email: "contact@diagalis.fr",
  delaiRapport: "48 h",

  // Remise affichée en pastille. Laissez "" pour la retirer.
  // Précisez ses conditions dans vos devis : Google Ads exige que l'offre soit exacte.
  promo: "",

  // Prix « dès » des packs, en euros
  packs: { appartement: 179, maison: 209, commerce: 249 },

  // FORMULAIRE : adresse d'envoi de votre service de formulaires
  // (par exemple Formspree : "https://formspree.io/f/xxxxxxxx").
  // Vide = mode démonstration : la demande s'affiche à l'écran mais n'est envoyée à personne.
  formEndpoint: "https://formspree.io/f/xeaapvzk",

  // GOOGLE ADS (laisser vide tant que le suivi n'est pas prévu)
  gtagId: "AW-11467076247",                 // identifiant de la balise Google, par exemple "AW-123456789"
  conversionLabel: "Fqt6CIG5_LAdEJfl9tsq",        // libellé de la conversion « formulaire envoyé », par exemple "AbCdEfGhIj"
  callLabel: "",              // libellé de la conversion « clic sur le téléphone » (facultatif)
  chargerAvantConsentement: false, // false = rien n'est chargé tant que le visiteur n'a pas accepté

  // MENTIONS LÉGALES ET CONFIDENTIALITÉ : à compléter
  raison: "DIAGALIS",
  forme: "EURL au capital de 1000 euros",
  siret: "890 486 962 00016",
  certification: "",
  assurance: "GAN",
  directeur: ""
};
