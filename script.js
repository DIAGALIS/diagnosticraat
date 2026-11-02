(function () {
  var S = window.SITE || {};
  var NB = ' ';
  var $ = function (id) { return document.getElementById(id); };
  var all = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };

  // ——— Informations communes lues dans config.js ———
  all('[data-site]').forEach(function (el) {
    var v = S[el.getAttribute('data-site')];
    if (v) el.textContent = v;
  });
  all('[data-pack]').forEach(function (el) {
    var v = S.packs && S.packs[el.getAttribute('data-pack')];
    if (v != null) el.textContent = v + NB + '€';
  });
  all('[data-tel-href]').forEach(function (a) { if (S.telLien) a.href = 'tel:' + S.telLien; });
  all('[data-mail-href]').forEach(function (a) {
    if (S.email && S.email.indexOf('@') > 0) { a.href = 'mailto:' + S.email; a.textContent = S.email; }
  });
  all('[data-if="promo"]').forEach(function (el) { el.hidden = !S.promo; });

  // ——— Suivi Google Ads avec consentement ———
  var KEY = 'diagalis_consent';
  function getChoice() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setChoice(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  var loaded = false;

  function gtagInit() {
    if (loaded || !S.gtagId) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' });
    if (getChoice() === 'granted') grant();
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(S.gtagId);
    document.head.appendChild(s);
    window.gtag('js', new Date());
    window.gtag('config', S.gtagId);
    fireConversionOnThanks();
  }
  function grant() {
    if (window.gtag) window.gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' });
  }
  function fireConversionOnThanks() {
    if (!document.body.hasAttribute('data-conversion') || !S.conversionLabel || !window.gtag) return;
    try { if (sessionStorage.getItem('diagalis_conv')) return; sessionStorage.setItem('diagalis_conv', '1'); } catch (e) {}
    window.gtag('event', 'conversion', { send_to: S.gtagId + '/' + S.conversionLabel });
  }
  all('a[data-tel-href]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (window.gtag && S.callLabel) window.gtag('event', 'conversion', { send_to: S.gtagId + '/' + S.callLabel });
    });
  });

  var banner = $('consent');
  function showBanner() { if (banner) banner.hidden = false; }
  function choose(v) {
    setChoice(v);
    if (banner) banner.hidden = true;
    if (v === 'granted') { gtagInit(); grant(); fireConversionOnThanks(); }
  }
  if (S.gtagId && banner) {
    $('consent-accept').addEventListener('click', function () { choose('granted'); });
    $('consent-refuse').addEventListener('click', function () { choose('denied'); });
    all('[data-cookie-settings]').forEach(function (b) { b.hidden = false; b.addEventListener('click', showBanner); });
    var c = getChoice();
    if (!c) showBanner();
    if (c === 'granted' || S.chargerAvantConsentement) gtagInit();
  }

  // ——— Questionnaire « mon chantier est-il concerné ? » ———
  var qual = $('qualifier');
  if (qual) {
    var verdict = $('verdict');
    var upd = function () {
      var a = qual.querySelector('input[name="q1"]:checked').value;
      var b = qual.querySelector('input[name="q2"]:checked').value;
      var k = a === 'avant' ? (b === 'oui' ? 'yes' : 'later') : (a === 'apres' ? 'no' : 'unknown');
      verdict.querySelector('.verdict-t').textContent = qual.getAttribute('data-' + k + '-t');
      verdict.querySelector('.verdict-p').textContent = qual.getAttribute('data-' + k + '-p');
    };
    all('#qualifier input').forEach(function (i) { i.addEventListener('change', upd); });
    upd();
  }

  // ——— Formulaire ———
  var form = $('devis-form');
  if (!form) return;
  var recap = $('recap'), err = $('err');
  var presets = { projet: form.getAttribute('data-projet'), bien: form.getAttribute('data-bien') };
  ['projet', 'bien'].forEach(function (k) {
    if (!presets[k]) return;
    var sel = $(k);
    Array.prototype.forEach.call(sel.options, function (o) { if (o.text === presets[k]) sel.value = o.value; });
  });

  function selText(id) { var s = $(id); return s.options[s.selectedIndex].text; }

  function collect() {
    var p = {
      profil: form.elements['profil'].value,
      projet: selText('projet'),
      bien: selText('bien'),
      ville: $('ville').value.trim(),
      nom: $('nom').value.trim(),
      telephone: $('tel').value.trim(),
      theme: document.body.getAttribute('data-lp') || '',
      page: location.pathname
    };
    var q = new URLSearchParams(location.search);
    ['gclid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(function (k) {
      if (q.get(k)) p[k] = q.get(k);
    });
    return p;
  }

  function showRecap(p) {
    var rows = [['Vous êtes', p.profil], [(document.querySelector('label[for="projet"]') || { textContent: 'Projet' }).textContent, p.projet], ['Bien', p.bien], ['Ville', p.ville], ['Nom', p.nom], ['Téléphone', p.telephone]];
    var list = $('recap-list');
    list.textContent = '';
    rows.forEach(function (r) {
      var dt = document.createElement('dt'); dt.textContent = r[0];
      var dd = document.createElement('dd'); dd.textContent = r[1];
      list.appendChild(dt); list.appendChild(dd);
    });
    form.hidden = true;
    $('form-intro').hidden = true;
    recap.hidden = false;
    recap.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    err.hidden = true;
    if ($('website').value) { location.href = 'merci.html'; return; }  // champ piège rempli : robot
    var p = collect();
    if (!S.formEndpoint) { showRecap(p); return; }
    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    var label = btn.textContent;
    btn.textContent = 'Envoi en cours…';
    fetch(S.formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(p)
    }).then(function (r) {
      if (!r.ok) throw new Error('http ' + r.status);
      location.href = 'merci.html';
    }).catch(function () {
      btn.disabled = false;
      btn.textContent = label;
      err.textContent = "L'envoi a échoué. Réessayez ou appelez-nous au " + (S.tel || '') + '.';
      err.hidden = false;
    });
  });

  $('edit').addEventListener('click', function () {
    recap.hidden = true;
    form.hidden = false;
    $('form-intro').hidden = false;
    $('ville').focus();
  });
})();

/* Saisie semi-automatique de la ville (API publique geo.api.gouv.fr) */
(function () {
  var v = document.getElementById('ville');
  if (!v || !window.fetch) return;
  var dl = document.createElement('datalist'); dl.id = 'villes';
  v.setAttribute('list', 'villes'); v.parentNode.appendChild(dl);
  var t, last = '';
  v.addEventListener('input', function () {
    clearTimeout(t);
    var q = v.value.trim();
    if (q.length < 3 || q === last || /\(\d{5}\)$/.test(q)) return;
    t = setTimeout(function () {
      last = q;
      fetch('https://geo.api.gouv.fr/communes?nom=' + encodeURIComponent(q) + '&fields=nom,codesPostaux&boost=population&limit=8')
        .then(function (r) { return r.json(); })
        .then(function (a) {
          dl.innerHTML = '';
          a.forEach(function (c) {
            var o = document.createElement('option');
            o.value = c.nom + ' (' + ((c.codesPostaux || [])[0] || '') + ')';
            dl.appendChild(o);
          });
        }).catch(function () {});
    }, 250);
  });
})();
