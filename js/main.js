/* ==========================================================================
   L’Atelier Beauté de Julie : interactions & animations
   GSAP + ScrollTrigger + Lenis (tous hébergés en local, aucun service externe)
   ========================================================================== */
(() => {
  'use strict';

  const PLANITY = 'https://www.planity.com/latelier-beaute-de-julie-13510-eguilles';
  const TEL = '+33662214595';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reduce) root.classList.add('reduce');

  /* ------------------------------------------------------------------------
     DONNÉES (prestations, avis, horaires)
     ------------------------------------------------------------------------ */
  // [nom, durée en minutes, prix en €, note facultative]
  const SERVICES = [
    { id: 'mains', title: 'Mains', groups: [{ name: 'Manucure russe', items: [
      ['Manucure russe + vernis semi-permanent', 60, 45],
      ['Manucure russe + semi-permanent renforcé ou « gainage »', 90, 60, 'Renforcement de l’ongle naturel, finition ultra nette, tenue longue durée.'],
      ['Manucure russe + remplissage gel taille 1', 90, 60],
      ['Manucure russe + remplissage gel taille 2 ou 3', 120, 75],
      ['Manucure russe + pose complète avec rallongement Popit', 150, 90]
    ] }] },
    { id: 'pieds', title: 'Pieds', groups: [{ name: 'Pédicure russe', items: [
      ['Pédicure russe seule (sans pose de couleur)', 20, 25],
      ['Dépose du semi-permanent + pédicure russe', 30, 30],
      ['Pédicure russe + semi-permanent', 60, 45]
    ] }] },
    { id: 'lashlift', title: 'Rehaussement de cils', groups: [{ name: 'Lash lift', items: [
      ['Teinture + soin des cils', 20, 18],
      ['Rehaussement de cils seul (soin compris)', 40, 45],
      ['Rehaussement de cils + teinture + soin', 60, 60]
    ] }] },
    { id: 'extensions', title: 'Extensions de cils', groups: [
      { name: 'Cil à cil · noir', items: [
        ['Pose complète cil à cil', 120, 75], ['Remplissage 2 semaines', 45, 35], ['Remplissage 3 semaines', 60, 55],
        ['Remplissage 4 semaines', 90, 65, 'Au-delà de 4 semaines, une pose complète est appliquée.'], ['Dépose + pose complète cil à cil', 135, 85] ] },
      { name: 'Volume mixte · noir', items: [
        ['Pose complète volume mixte', 150, 85], ['Remplissage 2 semaines', 60, 45], ['Remplissage 3 semaines', 90, 65],
        ['Remplissage 4 semaines', 120, 75, 'Au-delà de 4 semaines, une pose complète est appliquée.'], ['Dépose + pose complète volume mixte', 165, 95] ] },
      { name: 'Volume russe · noir', items: [
        ['Pose complète volume russe', 160, 100], ['Remplissage 2 semaines', 80, 60], ['Remplissage 3 semaines', 105, 80],
        ['Remplissage 4 semaines', 120, 90, 'Au-delà de 4 semaines, une pose complète est appliquée.'], ['Dépose + pose complète volume russe', 180, 120], ['Volume russe destructuré', 180, 120] ] },
      { name: 'Cil à cil · marron', items: [
        ['Pose complète cil à cil marron', 120, 75], ['Remplissage 2 semaines', 45, 35], ['Remplissage 3 semaines', 90, 55],
        ['Remplissage 4 semaines', 90, 65, 'Au-delà de 4 semaines, une pose complète est appliquée.'], ['Dépose + pose complète cil à cil marron', 135, 85] ] },
      { name: 'Volume russe · marron', items: [
        ['Pose complète volume russe marron', 160, 100], ['Remplissage 2 semaines', 110, 60], ['Remplissage 3 semaines', 105, 80],
        ['Remplissage 4 semaines', 120, 90, 'Au-delà de 4 semaines, une pose complète est appliquée.'], ['Dépose + pose complète volume russe marron', 180, 120] ] }
    ] },
    { id: 'sourcils', title: 'Sourcils & épilation', groups: [
      { name: 'Brow lift & teinture', items: [
        ['Teinture + soin des sourcils', 30, 18],
        ['Brow lift seul (soin compris)', 40, 40, 'Lamination des sourcils : effet de 6 à 8 semaines selon le poil.'],
        ['Brow lift + épilation ou teinture', 50, 50],
        ['Brow lift + épilation + teinture + soin', 60, 60] ] },
      { name: 'Épilation au fil', items: [
        ['Épilation des sourcils à la pince (sans restructuration)', 30, 15],
        ['Épilation des sourcils au fil (sans restructuration)', 20, 15],
        ['Épilation de la lèvre supérieure au fil', 20, 15],
        ['Restructuration avec création de ligne + épilation au fil', 40, 30, 'Teinture en plus : + 7 €.'] ] }
    ] },
    { id: 'hommes', title: 'Manucure hommes', groups: [{ name: 'Sans couleur', items: [
      ['Manucure russe + soin des cuticules', 45, 30, 'Ongles raccourcis, cuticules nettes, huile nourrissante.']
    ] }] },
    { id: 'reprise', title: 'Reprise d’un autre salon', groups: [{ name: 'À valider avec Julie avant le rendez-vous', items: [
      ['Reprise d’une pose extérieure : extensions de cils', 10, 10, 'Écrivez d’abord à Julie avec des photos nettes, yeux ouverts puis fermés.'],
      ['Reprise d’une pose extérieure : mains / pieds', 10, 10, 'Envoyez des photos de vos ongles et la date de la pose une fois le rendez-vous pris.']
    ] }] }
  ];

  const REVIEWS = [
    ['Première fois chez Julie et sûrement pas la dernière ! Un super moment, un accueil au top et un résultat magnifique ! Merci pour ton travail, j’ai déjà hâte de revenir.', 'Cliente', 'Planity', '1 nov. 2026'],
    ['Un vrai moment de détente. Browlift, réhaussement de cils et gainage sur mes ongles abîmés : tout est impeccable. Elle est minutieuse et très à l’écoute. Je reviendrai avec plaisir !', 'Cliente', 'Planity', '25 oct. 2026'],
    ['Le travail de Julie est à la hauteur de ce qu’on peut lire. Elle est minutieuse et méticuleuse. En plus de son professionnalisme, elle nous accueille dans un cocon pour qu’on passe le meilleur moment.', 'Cliente', 'Planity', '2 oct. 2026'],
    ['Nouveau rendez-vous dans ce nouveau salon qui est juste magnifique et très accessible ! Julie est toujours autant perfectionniste et autant douée. Je recommande vivement.', 'Cliente', 'Planity', '27 sept. 2026'],
    ['Presque 6 h passées avec Julie pour manucure russe, pédicure russe (semi french avec remplissage) et pose d’extensions de cils : tout est parfait sur tous les plans ! Je recommande +++', 'Emma G.', 'Google', ''],
    ['Un nouveau lieu d’accueil pour l’atelier de Julie, mais toujours la même constance dans son professionnalisme, très à l’écoute des besoins de ses clientes. À conseiller sans modération.', 'Cliente', 'Planity', '30 sept. 2026'],
    ['Je suis super fan de ma pose cil à cil marron ! Le rendu est exactement comme je voulais : naturel, en mettant le regard en valeur. Julie est très à l’écoute et prend bien le temps de conseiller.', 'Cliente', 'Planity', '7 juil. 2026'],
    ['J’ai testé le combo rehaussement de cils et pédicure russe chez Julie, et le résultat n’a pas bougé d’un millimètre. Regard de biche impeccable au réveil et pieds d’une netteté chirurgicale.', 'Myriam P.', 'Google', ''],
    ['Plusieurs rendez-vous chez Julie et toujours autant satisfaite, si ce n’est plus à chaque fois. Manucure russe incroyable, qui tient sans problème au minimum 4 semaines. Souriante et bienveillante !', 'Cliente', 'Planity', '5 juil. 2026'],
    ['Quel plaisir ! Une jeune femme très professionnelle et pleine de douceur. Une pro qui maîtrise son domaine, ravie de mes extensions de cils et du gainage de mes ongles !', 'Cliente', 'Planity', '21 août 2026'],
    ['Merci beaucoup Julie pour cette mise à jour complète : manucure russe, renforcement et pédi-russe. Julie est très professionnelle et minutieuse sur tous les soins.', 'Charline T.', 'Google', ''],
    ['Julie a été au top. Mes ongles sont magnifiques, je les regarde toutes les deux minutes.', 'Cliente', 'Planity', '8 juil. 2026']
  ];

  // 0 = dimanche … 6 = samedi
  const HOURS = {
    1: [['10:30', '20:00']], 2: [['08:00', '20:30']], 3: [['08:00', '12:00'], ['14:00', '20:30']],
    4: [['09:00', '20:30']], 5: [['09:00', '19:30']], 6: [['09:30', '19:30']], 0: []
  };
  const DAY_NAMES = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const fmtDur = (m) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, '0') : ''}`);
  const fmtTime = (t) => t.replace(':', 'h').replace(/^0/, '').replace('h00', 'h');

  /* ------------------------------------------------------------------------
     RENDU : carte des prestations, avis, horaires
     ------------------------------------------------------------------------ */
  const picked = new Map();
  let serviceCount = 0;

  function renderServices() {
    const list = $('#serviceList');
    const chips = $('#carteChips');
    if (!list) return;
    let uid = 0;
    SERVICES.forEach((cat, ci) => {
      const count = cat.groups.reduce((a, g) => a + g.items.length, 0);
      serviceCount += count;
      const open = ci === 0;
      const sec = document.createElement('section');
      sec.className = 'cat' + (open ? ' is-open' : '');
      sec.id = 'cat-' + cat.id;
      let body = '';
      cat.groups.forEach((g) => {
        body += g.name ? `<p class="sub">${esc(g.name)}</p>` : '';
        body += '<ul>' + g.items.map(([name, dur, price, note]) => {
          const id = `${cat.id}-${uid++}`;
          return `<li class="row" data-id="${id}" data-name="${esc(name)}" data-dur="${dur}" data-price="${price}">
            <button class="row__add" type="button" aria-pressed="false" aria-label="Ajouter à ma sélection : ${esc(name)}"></button>
            <div class="row__txt"><strong>${esc(name)}</strong>${note ? `<span class="row__note">${esc(note)}</span>` : ''}</div>
            <span class="row__dur">${fmtDur(dur)}</span>
            <span class="row__price">${price}&nbsp;€</span>
          </li>`;
        }).join('') + '</ul>';
      });
      sec.innerHTML = `<h3 class="cat__h"><button class="cat__head" type="button" aria-expanded="${open}" aria-controls="catb-${cat.id}">
          <span>${esc(cat.title)}<small>${count}</small></span><span class="plus" aria-hidden="true"></span></button></h3>
        <div class="cat__body" id="catb-${cat.id}" role="region" aria-label="${esc(cat.title)}"><div class="cat__in">${body}</div></div>`;
      list.appendChild(sec);

      const chip = document.createElement('li');
      chip.innerHTML = `<button class="chip" type="button" data-cat="${cat.id}">${esc(cat.title)}</button>`;
      chips.appendChild(chip);
    });
    const stat = $('#statServices');
    if (stat) { stat.dataset.count = serviceCount; stat.textContent = serviceCount; }
  }

  function renderReviews() {
    const track = $('#revTrack');
    if (!track) return;
    const star = '<svg><use href="#i-star"/></svg>';
    track.innerHTML = REVIEWS.map(([text, who, src, date]) => `
      <article class="rev">
        <p class="rev__q">${esc(text)}</p>
        <div class="rev__foot">
          <div><div class="rev__who">${esc(who)}</div><div class="rev__meta">Avis ${esc(src)}${date ? ' · ' + esc(date) : ''}</div></div>
          <span class="rev__stars" role="img" aria-label="5 étoiles sur 5">${star.repeat(5)}</span>
        </div>
      </article>`).join('');
  }

  function parisNow() {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Paris', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    return { day, mins: (+get('hour')) * 60 + (+get('minute')) };
  }
  const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };

  function renderHours() {
    const ul = $('#hoursList');
    const status = $('#openStatus');
    if (!ul) return;
    const now = parisNow();
    ul.innerHTML = [1, 2, 3, 4, 5, 6, 0].map((d) => {
      const slots = HOURS[d];
      const txt = slots.length ? slots.map(([a, b]) => `${fmtTime(a)} – ${fmtTime(b)}`).join(' · ') : 'Fermé';
      return `<li class="${d === now.day ? 'is-today' : ''}${slots.length ? '' : ' is-closed'}"><span>${DAY_NAMES[d]}</span><span>${txt}</span></li>`;
    }).join('');

    // statut en direct
    let label = 'Fermé';
    let state = 'is-closed';
    const today = HOURS[now.day];
    const cur = today.find(([a, b]) => now.mins >= toMin(a) && now.mins < toMin(b));
    if (cur) {
      state = 'is-open';
      label = `Ouvert · jusqu’à ${fmtTime(cur[1])}`;
    } else {
      const later = today.find(([a]) => toMin(a) > now.mins);
      if (later) label = `Fermé · ouvre à ${fmtTime(later[0])}`;
      else {
        for (let i = 1; i <= 7; i++) {
          const d = (now.day + i) % 7;
          if (HOURS[d].length) { label = `Fermé · ouvre ${i === 1 ? 'demain' : DAY_NAMES[d].toLowerCase()} à ${fmtTime(HOURS[d][0][0])}`; break; }
        }
      }
    }
    status.classList.add(state);
    $('span', status).textContent = label;
  }

  renderServices();
  renderReviews();
  renderHours();
  const yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------------
     Accordéons (carte + FAQ)
     ------------------------------------------------------------------------ */
  let refreshT;
  const refreshSoon = () => { clearTimeout(refreshT); refreshT = setTimeout(() => window.ScrollTrigger && ScrollTrigger.refresh(), 60); };

  function bindAccordion(container, itemSel, btnSel, panelSel, single) {
    const items = $$(itemSel, container);
    const api = {
      items,
      open(it) {
        const b = $(btnSel, it), p = $(panelSel, it);
        b.setAttribute('aria-expanded', 'true'); it.classList.add('is-open'); p.removeAttribute('inert');
        if (reduce || !window.gsap) { p.style.height = 'auto'; refreshSoon(); return; }
        gsap.fromTo(p, { height: p.offsetHeight }, { height: 'auto', duration: 0.9, ease: 'expo.out', overwrite: true, onComplete: refreshSoon });
      },
      close(it) {
        const b = $(btnSel, it), p = $(panelSel, it);
        b.setAttribute('aria-expanded', 'false'); it.classList.remove('is-open');
        if (reduce || !window.gsap) { p.style.height = '0px'; p.setAttribute('inert', ''); refreshSoon(); return; }
        gsap.to(p, { height: 0, duration: 0.7, ease: 'expo.inOut', overwrite: true, onComplete: () => { p.setAttribute('inert', ''); refreshSoon(); } });
      }
    };
    items.forEach((it) => {
      const b = $(btnSel, it), p = $(panelSel, it);
      if (b.getAttribute('aria-expanded') === 'true') { it.classList.add('is-open'); p.style.height = 'auto'; }
      else p.setAttribute('inert', '');
      b.addEventListener('click', () => {
        const isOpen = it.classList.contains('is-open');
        if (single) items.forEach((o) => { if (o !== it && o.classList.contains('is-open')) api.close(o); });
        isOpen ? api.close(it) : api.open(it);
      });
    });
    return api;
  }
  const carteAcc = bindAccordion($('#serviceList'), '.cat', '.cat__head', '.cat__body', false);
  const faqAcc = bindAccordion($('#faqList'), '.acc', '.acc__q', '.acc__a', true);

  /* ------------------------------------------------------------------------
     Sélection de prestations (estimation + SMS)
     ------------------------------------------------------------------------ */
  function updatePick() {
    const pick = $('#pick');
    const n = picked.size;
    let mins = 0, total = 0;
    const names = [];
    picked.forEach((v) => { mins += v.dur; total += v.price; names.push(v.name); });
    $('#pickCount').textContent = `${n} soin${n > 1 ? 's' : ''}`;
    $('#pickMeta').innerHTML = `${fmtDur(mins)} · ${total}&nbsp;€`;
    pick.classList.toggle('is-visible', n > 0);
    document.body.classList.toggle('has-pick', n > 0);
    const body = n
      ? `Bonjour Julie, je souhaiterais prendre rendez-vous pour : ${names.join(' ; ')}. Durée estimée ${fmtDur(mins)}, total estimé ${total} €. Mes disponibilités : `
      : 'Bonjour Julie, je souhaiterais prendre rendez-vous.';
    $('#pickSms').href = `sms:${TEL}?&body=${encodeURIComponent(body)}`;
  }
  $('#serviceList').addEventListener('click', (e) => {
    const btn = e.target.closest('.row__add');
    if (!btn) return;
    const row = btn.closest('.row');
    const id = row.dataset.id;
    if (picked.has(id)) picked.delete(id);
    else picked.set(id, { name: row.dataset.name, dur: +row.dataset.dur, price: +row.dataset.price });
    const on = picked.has(id);
    row.classList.toggle('is-on', on);
    btn.setAttribute('aria-pressed', on);
    updatePick();
  });
  $('#pickClear').addEventListener('click', () => {
    picked.clear();
    $$('.row.is-on').forEach((r) => { r.classList.remove('is-on'); $('.row__add', r).setAttribute('aria-pressed', 'false'); });
    updatePick();
  });
  updatePick();

  /* ------------------------------------------------------------------------
     Vidéo d’ouverture
     ------------------------------------------------------------------------ */
  const video = $('#heroVideo');
  (function setupVideo() {
    if (!video || reduce) return; // mouvement réduit : on garde l’image de secours
    const small = matchMedia('(max-width: 800px)').matches || (navigator.connection && navigator.connection.saveData);
    video.src = small ? video.dataset.srcSd : video.dataset.srcHd;
    video.muted = true;
    video.setAttribute('playsinline', '');
    const p = video.play();
    if (p && p.catch) p.catch(() => {});
  })();

  /* ------------------------------------------------------------------------
     Si GSAP est indisponible : site lisible sans animation
     ------------------------------------------------------------------------ */
  if (!window.gsap || !window.ScrollTrigger) {
    root.classList.add('reduce');
    const l = $('#loader'); if (l) l.remove();
    $$('[data-split]').forEach((el) => { el.style.opacity = 1; });
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  const mm = gsap.matchMedia();

  /* ------------------------------------------------------------------------
     Découpe de texte (mots / lettres) avec masque
     ------------------------------------------------------------------------ */
  function split(el, mode, withLabel = true) {
    if (el._parts) return el._parts;
    const original = el.textContent.replace(/\s+/g, ' ').trim();
    const parts = [];
    const mk = (cls, txt) => { const s = document.createElement('span'); s.className = cls; if (txt != null) s.textContent = txt; return s; };
    const walk = (node) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/([ \t\r\n]+)/).forEach((tok) => {
            if (!tok) return;
            if (/^[ \t\r\n]+$/.test(tok)) { frag.appendChild(document.createTextNode(' ')); return; }
            if (mode === 'chars') {
              const wd = mk('wd'); wd.setAttribute('aria-hidden', 'true');
              Array.from(tok).forEach((ch) => { const w = mk('w'); const wi = mk('wi', ch); w.appendChild(wi); wd.appendChild(w); parts.push(wi); });
              frag.appendChild(wd);
            } else {
              const w = mk('w'); w.setAttribute('aria-hidden', 'true');
              const wi = mk('wi', tok); w.appendChild(wi); frag.appendChild(w); parts.push(wi);
            }
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    };
    walk(el);
    if (withLabel) { const sr = mk('sr', original); el.insertBefore(sr, el.firstChild); }
    el._parts = parts;
    return parts;
  }

  const heroChars = $$('.hero__title .line__in').flatMap((l) => split(l, 'chars', false));
  $$('[data-split]').forEach((el) => split(el, el.dataset.split || 'words'));
  // On remplace l’état initial CSS par un état GSAP explicite (sinon le décalage en px hérité de la CSS reste après l’animation)
  if (!reduce) gsap.set($$('.wi'), { y: 0, yPercent: 118 });

  /* ------------------------------------------------------------------------
     Défilement fluide (Lenis)
     ------------------------------------------------------------------------ */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  function scrollToEl(el, offset = 0) {
    let y;
    const st = ScrollTrigger.getAll().find((s) => s.trigger === el && s.pin);
    if (st) y = st.start;
    else y = el.getBoundingClientRect().top + window.scrollY - offset;
    if (lenis) lenis.scrollTo(y, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2) { e.preventDefault(); scrollToEl(document.body); return; }
    const target = $(id);
    if (!target) return;
    e.preventDefault();
    // cartes « Les soins » : ouvre la catégorie correspondante
    if (a.dataset.filter) {
      const cat = $('#cat-' + a.dataset.filter);
      if (cat) { carteAcc.items.forEach((it) => it !== cat && it.classList.contains('is-open') && carteAcc.close(it)); !cat.classList.contains('is-open') && carteAcc.open(cat); scrollToEl(cat, 120); return; }
    }
    closeMenu();
    scrollToEl(target, 0);
  });
  $$('.chip').forEach((c) => c.addEventListener('click', () => {
    const cat = $('#cat-' + c.dataset.cat);
    if (!cat) return;
    $$('.chip').forEach((x) => x.classList.toggle('is-active', x === c));
    if (!cat.classList.contains('is-open')) carteAcc.open(cat);
    scrollToEl(cat, 110);
  }));

  /* ------------------------------------------------------------------------
     Navigation : cachée au scroll vers le bas, menu mobile plein écran
     ------------------------------------------------------------------------ */
  const nav = $('#nav');
  const fab = $('#fab');
  const burger = $('#burger');
  const menu = $('#menu');
  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    menu.classList.add('is-open'); menu.removeAttribute('inert'); menu.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true'); burger.setAttribute('aria-label', 'Fermer le menu');
    nav.classList.add('menu-open'); nav.classList.remove('is-hidden');
    lenis && lenis.stop();
    if (!lenis) document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    if (!menuOpen) return;
    menuOpen = false;
    menu.classList.remove('is-open'); menu.setAttribute('inert', ''); menu.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Ouvrir le menu');
    nav.classList.remove('menu-open');
    lenis && lenis.start();
    document.body.style.overflow = '';
  }
  burger.addEventListener('click', () => (menuOpen ? closeMenu() : openMenu()));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeMenu(); closeLightbox(); } });

  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (self) => {
      const y = self.scroll();
      nav.classList.toggle('is-scrolled', y > 40);
      if (!menuOpen) {
        if (y > 280 && self.direction === 1) nav.classList.add('is-hidden');
        else if (self.direction === -1 || y <= 280) nav.classList.remove('is-hidden');
      }
      fab.classList.toggle('is-visible', y > innerHeight * 0.75);
    }
  });

  gsap.to('#progress span', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.2 } });

  /* ------------------------------------------------------------------------
     Micro-interactions : boutons magnétiques, tilt 3D + reflet, curseur
     ------------------------------------------------------------------------ */
  if (finePointer && !reduce) {
    $$('[data-magnetic]').forEach((el) => {
      const mx = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3.out' });
      const my = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3.out' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        mx((e.clientX - (r.left + r.width / 2)) * 0.32);
        my((e.clientY - (r.top + r.height / 2)) * 0.42);
      });
      el.addEventListener('pointerleave', () => { mx(0); my(0); });
    });

    $$('[data-tilt]').forEach((el) => {
      const glare = $('.glare', el);
      gsap.set(el, { transformPerspective: 900 });
      const rx = gsap.quickTo(el, 'rotationX', { duration: 0.7, ease: 'power3.out' });
      const ry = gsap.quickTo(el, 'rotationY', { duration: 0.7, ease: 'power3.out' });
      const gx = glare && gsap.quickTo(glare, 'x', { duration: 0.5, ease: 'power3.out' });
      const gy = glare && gsap.quickTo(glare, 'y', { duration: 0.5, ease: 'power3.out' });
      el.addEventListener('pointerenter', () => glare && gsap.to(glare, { opacity: 1, duration: 0.5 }));
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        ry((px - 0.5) * 11); rx(-(py - 0.5) * 11);
        if (glare) { gx(px * r.width); gy(py * r.height); }
      });
      el.addEventListener('pointerleave', () => { rx(0); ry(0); glare && gsap.to(glare, { opacity: 0, duration: 0.7 }); });
    });

    const cur = $('#cursor');
    const cx = gsap.quickTo(cur, 'x', { duration: 0.4, ease: 'power3.out' });
    const cy = gsap.quickTo(cur, 'y', { duration: 0.4, ease: 'power3.out' });
    window.addEventListener('pointermove', (e) => { cur.classList.add('is-on'); cx(e.clientX); cy(e.clientY); }, { passive: true });
    document.addEventListener('pointerover', (e) => {
      const drag = e.target.closest('[data-cursor="drag"]');
      const link = e.target.closest('a,button,[data-cursor]');
      cur.classList.toggle('is-drag', !!drag);
      cur.classList.toggle('is-link', !!link && !drag);
    });
    document.documentElement.addEventListener('pointerleave', () => cur.classList.remove('is-on'));
  }

  /* ------------------------------------------------------------------------
     Préchargeur : un œil qui s’ouvre → hero
     ------------------------------------------------------------------------ */
  let introDone = false;
  function heroIntro() {
    if (introDone) return;
    introDone = true;
    lenis && lenis.start();
    if (reduce) return;
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.fromTo('.hero__media', { scale: 1.3 }, { scale: 1.04, duration: 3.2, ease: 'power3.out' }, 0)
      .fromTo(heroChars, { yPercent: 118 }, { yPercent: 0, duration: 1.5, stagger: 0.04 }, 0.15)
      .fromTo('.hero__ghost', { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 2.4 }, 0.2)
      .fromTo('[data-hero-in]', { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 1.3, stagger: 0.14 }, 0.55)
      .fromTo('.hero__fg-in', { y: 90, opacity: 0, scale: 0.92 }, { y: 0, opacity: 1, scale: 1, duration: 1.8 }, 0.7)
      .fromTo('.nav', { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.out' }, 0.5);
  }

  function runLoader() {
    const loader = $('#loader');
    if (!loader) { heroIntro(); return; }
    if (reduce) { loader.remove(); heroIntro(); return; }

    const clip = $('#eyeClipPath');
    const count = $('#loaderCount');
    // forme d’œil (amande) qui s’agrandit au centre : le reste du préchargeur est découpé
    const eyeD = (t) => {
      const a = t * 1.02, b = t * 0.95, cx = 0.5, cy = 0.5;
      return `M0 0H1V1H0Z M${cx - a} ${cy}C${cx - a * 0.45} ${cy - b * 1.35} ${cx + a * 0.45} ${cy - b * 1.35} ${cx + a} ${cy}C${cx + a * 0.45} ${cy + b * 1.35} ${cx - a * 0.45} ${cy + b * 1.35} ${cx - a} ${cy}Z`;
    };
    clip.setAttribute('d', eyeD(0));

    const ready = new Promise((res) => {
      let done = false;
      const fin = () => { if (!done) { done = true; res(); } };
      if (video && !reduce) {
        video.addEventListener('canplay', fin, { once: true });
        video.addEventListener('loadeddata', fin, { once: true });
        if (video.readyState >= 3) fin();
      }
      setTimeout(fin, 3500);
    });

    const st = { p: 0, open: 0 };
    gsap.fromTo('.loader__eye', { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: 'expo.out' });
    gsap.fromTo('.loader__brand', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'expo.out', delay: 0.15 });

    const tl = gsap.timeline();
    tl.to(st, { p: 88, duration: 1.4, ease: 'power2.out', onUpdate: () => (count.textContent = Math.round(st.p)) })
      .add(() => { tl.pause(); ready.then(() => tl.play()); })
      .to(st, { p: 100, duration: 0.5, ease: 'power2.inOut', onUpdate: () => (count.textContent = Math.round(st.p)) })
      .to('.loader__center', { scale: 1.06, duration: 0.5, ease: 'power2.in' }, '<')
      .to(st, { open: 1, duration: 1.7, ease: 'expo.inOut', onUpdate: () => clip.setAttribute('d', eyeD(st.open)) }, '+=0.1')
      .add(heroIntro, '-=1.0')
      .add(() => loader.classList.add('is-done'));
    // garde-fou : si la vidéo ou un script tarde, on ne bloque jamais la page
    setTimeout(() => { if (!introDone) { loader.classList.add('is-done'); heroIntro(); } }, 9000);
  }
  runLoader();

  /* ------------------------------------------------------------------------
     Hero : parallax multicouche
     ------------------------------------------------------------------------ */
  const heroST = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
  gsap.to('.hero__media', { yPercent: 12, ease: 'none', scrollTrigger: heroST });
  gsap.to('.hero__ghost', { xPercent: -22, ease: 'none', scrollTrigger: heroST });
  gsap.to('.hero__inner', { yPercent: -10, opacity: 0.15, ease: 'none', scrollTrigger: { ...heroST, end: 'bottom 20%' } });
  mm.add('(min-width: 900px)', () => {
    gsap.to('.hero__fg', { yPercent: -55, ease: 'none', scrollTrigger: heroST });
    if (finePointer && !reduce) {
      const hero = $('.hero');
      const ax = gsap.quickTo('.hero__arch', 'x', { duration: 1.4, ease: 'power3.out' });
      const ay = gsap.quickTo('.hero__arch', 'y', { duration: 1.4, ease: 'power3.out' });
      const bx = gsap.quickTo('.hero__badge', 'x', { duration: 1.1, ease: 'power3.out' });
      const by = gsap.quickTo('.hero__badge', 'y', { duration: 1.1, ease: 'power3.out' });
      const gx = gsap.quickTo('.hero__ghost span', 'x', { duration: 1.8, ease: 'power3.out' });
      const move = (e) => {
        const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
        ax(nx * -30); ay(ny * -24); bx(nx * -62); by(ny * -46); gx(nx * 50);
      };
      hero.addEventListener('pointermove', move);
      return () => hero.removeEventListener('pointermove', move);
    }
  });

  /* ------------------------------------------------------------------------
     Titres et blocs : apparitions au scroll
     ------------------------------------------------------------------------ */
  if (!reduce) {
    $$('[data-split]').forEach((el) => {
      const chars = el.dataset.split === 'chars';
      gsap.fromTo(el._parts, { yPercent: 118 }, {
        yPercent: 0, duration: chars ? 1.5 : 1.3, ease: 'expo.out', stagger: chars ? 0.035 : 0.055,
        scrollTrigger: { trigger: el, start: chars ? 'top 98%' : 'top 88%', once: true }
      });
    });
    $$('[data-fade]').forEach((el) => gsap.fromTo(el, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));
    $$('[data-fade-group]').forEach((g) => gsap.fromTo(g.children, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.3, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: g, start: 'top 90%', once: true } }));
  }

  /* ------------------------------------------------------------------------
     Marquee : vitesse, sens et inclinaison pilotés par le scroll
     ------------------------------------------------------------------------ */
  (function marquee() {
    const rows = $$('[data-marquee] .marquee__row');
    if (!rows.length) return;
    const tweens = rows.map((row) => {
      const track = $('.marquee__track', row);
      const group = $('.marquee__group', track);
      for (let i = 0; i < 2; i++) { const c = group.cloneNode(true); c.setAttribute('aria-hidden', 'true'); track.appendChild(c); }
      const dir = +row.dataset.dir || -1;
      const tw = gsap.fromTo(track, { xPercent: dir < 0 ? 0 : -100 / 3 }, { xPercent: dir < 0 ? -100 / 3 : 0, duration: 36, ease: 'none', repeat: -1 });
      tw.totalTime(tw.duration() * 100); // marge de lecture pour pouvoir inverser le sens sans butée
      return tw;
    });
    if (reduce) { tweens.forEach((t) => t.pause()); return; }
    let ts = 1, target = 1, skew = 0, skewTarget = 0, inView = false;
    ScrollTrigger.create({
      trigger: '[data-marquee]', start: 'top bottom', end: 'bottom top',
      onToggle: (s) => (inView = s.isActive),
      onUpdate: (s) => {
        const v = s.getVelocity();
        target = (s.direction || 1) * (1 + Math.min(Math.abs(v) / 240, 9));
        skewTarget = gsap.utils.clamp(-9, 9, -v / 280);
      }
    });
    gsap.ticker.add(() => {
      if (!inView) return;
      ts += (target - ts) * 0.07;
      target += ((target >= 0 ? 1 : -1) - target) * 0.035;
      skew += (skewTarget - skew) * 0.12;
      skewTarget *= 0.9;
      tweens.forEach((t) => t.timeScale(ts));
      gsap.set(rows, { skewX: skew });
    });
  })();

  /* ------------------------------------------------------------------------
     Histoire : section pinnée, storytelling en 4 temps
     ------------------------------------------------------------------------ */
  mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
    const imgs = $$('.story__img'), steps = $$('.story__step'), dots = $$('.story__dots li'), num = $('#storyNum');
    const n = steps.length;
    gsap.set(steps.slice(1), { autoAlpha: 0, y: 60 });
    imgs.slice(1).forEach((c) => { gsap.set(c, { yPercent: 100 }); gsap.set($('img', c), { yPercent: -100 }); });
    const setActive = (i) => {
      dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
      steps.forEach((s, k) => s.classList.toggle('is-active', k === i));
      num.textContent = '0' + (i + 1);
    };
    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      scrollTrigger: {
        trigger: '.story', start: 'top top', end: () => '+=' + Math.round(innerHeight * n * 0.95),
        pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: (self) => {
          const D = tl.duration(); let idx = 0;
          for (let i = 1; i < n; i++) if (self.progress * D >= (i - 1) * 1.6 + 1.1) idx = i;
          setActive(idx);
        }
      }
    });
    for (let i = 1; i < n; i++) {
      const pos = (i - 1) * 1.6 + 0.6;
      tl.to(steps[i - 1], { autoAlpha: 0, y: -50, duration: 0.5 }, pos)
        .to(imgs[i], { yPercent: 0, duration: 1 }, pos)
        .to($('img', imgs[i]), { yPercent: 0, duration: 1 }, pos)
        .to($('img', imgs[i - 1]), { yPercent: 22, duration: 1 }, pos)
        .to(steps[i], { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, pos + 0.4);
    }
    tl.to({}, { duration: 0.9 });
    tl.to('.story__badge', { rotation: 360, duration: tl.duration(), ease: 'none' }, 0);
    gsap.fromTo('.story__frame', { scale: 0.92 }, { scale: 1, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.story', start: 'top 70%', once: true } });
  });

  /* ------------------------------------------------------------------------
     Soins : défilement horizontal piloté par le scroll vertical
     ------------------------------------------------------------------------ */
  mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
    const track = $('.soins__track');
    const bar = $('.soins__progress i');
    const dist = () => Math.max(1, track.scrollWidth - innerWidth);
    const tween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '.soins', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.9, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: (s) => gsap.set(bar, { scaleX: s.progress })
      }
    });
    $$('.card__img img').forEach((img) => {
      gsap.fromTo(img, { xPercent: -7 }, { xPercent: 7, ease: 'none', scrollTrigger: { trigger: img.closest('.card'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
    });
    $$('.card').forEach((card) => {
      gsap.from($('.card__in', card), { yPercent: 8, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 105%', end: 'left 70%', scrub: true } });
    });
  });

  /* ------------------------------------------------------------------------
     Chiffres : compteurs + amandes qui se dessinent
     ------------------------------------------------------------------------ */
  $$('.stat').forEach((st, i) => {
    const num = $('[data-count]', st);
    const end = parseFloat(num.dataset.count);
    const dec = +(num.dataset.decimals || 0);
    const fmt = (v) => v.toLocaleString('fr-FR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    num.textContent = fmt(reduce ? end : 0);
    if (reduce) return;
    const path = $('.stat__shape path', st);
    const o = { v: 0 };
    gsap.timeline({ scrollTrigger: { trigger: st, start: 'top 85%', once: true }, delay: i * 0.12 })
      .to(path, { strokeDashoffset: 0, duration: 2, ease: 'power3.inOut' }, 0)
      .to(o, { v: end, duration: 2.4, ease: 'power3.out', onUpdate: () => (num.textContent = fmt(o.v)) }, 0);
  });

  /* ------------------------------------------------------------------------
     Galerie : rideaux, parallax dans le cadre, lightbox
     ------------------------------------------------------------------------ */
  if (!reduce) {
    const origins = ['50% 0%', '50% 100%', '0% 50%', '100% 50%'];
    $$('.g').forEach((g, i) => {
      const curtain = $('.g__curtain', g), zoom = $('.g__zoom', g), img = $('.g__img', g);
      const o = i % 4, prop = o > 1 ? 'scaleX' : 'scaleY';
      gsap.set(curtain, { transformOrigin: origins[o] });
      gsap.timeline({ scrollTrigger: { trigger: g, start: 'top 92%', once: true } })
        .fromTo(curtain, { [prop]: 1 }, { [prop]: 0, duration: 1.4, ease: 'expo.inOut' }, 0)
        .fromTo(zoom, { scale: 1.3 }, { scale: 1, duration: 2, ease: 'expo.out' }, 0);
      gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: g, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }

  const lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap'), lbClose = $('#lbClose');
  let lbFrom = null;
  function openLightbox(btn) {
    const img = $('.g__img', btn);
    lbImg.src = img.currentSrc || img.src; lbImg.alt = img.alt; lbCap.textContent = $('.g__cap', btn).textContent;
    lbFrom = btn; lb.hidden = false;
    requestAnimationFrame(() => lb.classList.add('is-open'));
    lenis && lenis.stop();
    lbClose.focus();
  }
  function closeLightbox() {
    if (lb.hidden) return;
    lb.classList.remove('is-open');
    setTimeout(() => { lb.hidden = true; lbImg.removeAttribute('src'); }, 450);
    lenis && !menuOpen && lenis.start();
    lbFrom && lbFrom.focus();
  }
  $$('[data-lightbox]').forEach((b) => b.addEventListener('click', () => openLightbox(b)));
  lbClose.addEventListener('click', closeLightbox);
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });

  /* ------------------------------------------------------------------------
     Avis : carrousel glissant (souris, tactile, clavier, boutons, auto)
     ------------------------------------------------------------------------ */
  (function reviews() {
    const vp = $('#revViewport'), track = $('#revTrack'), bar = $('#revBar');
    const prev = $('#revPrev'), next = $('#revNext');
    if (!vp || !track) return;
    let min = 0, step = 300, dragging = false, startX = 0, startPos = 0, lastX = 0, vel = 0, auto = null, hover = false, visible = false;

    const getX = () => +gsap.getProperty(track, 'x') || 0;
    const clamp = (v) => Math.max(min, Math.min(0, v));
    const paint = () => { bar.style.transform = `scaleX(${Math.max(0.06, min ? getX() / min : 1)})`; };
    const measure = () => {
      const cs = getComputedStyle(vp);
      const inner = vp.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const first = $('.rev', track);
      step = first.offsetWidth + (parseFloat(getComputedStyle(track).columnGap) || 20);
      min = Math.min(0, -(track.scrollWidth - inner));
      gsap.set(track, { x: clamp(getX()) }); paint();
    };
    const to = (x, d = 1.1) => gsap.to(track, { x: clamp(x), duration: reduce ? 0 : d, ease: 'power3.out', overwrite: true, onUpdate: paint });
    const go = (dir) => {
      const i = Math.round(-getX() / step) + dir;
      if (dir > 0 && getX() <= min + 4) to(0, 1.6); else to(-i * step);
    };

    vp.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true; startX = lastX = e.clientX; startPos = getX(); vel = 0;
      gsap.killTweensOf(track); vp.setPointerCapture(e.pointerId);
    });
    vp.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      vel = e.clientX - lastX; lastX = e.clientX;
      const x = startPos + (e.clientX - startX);
      gsap.set(track, { x: x > 0 ? x * 0.35 : x < min ? min + (x - min) * 0.35 : x }); paint();
    });
    const end = () => { if (!dragging) return; dragging = false; to(getX() + vel * 16); };
    vp.addEventListener('pointerup', end); vp.addEventListener('pointercancel', end);
    vp.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); } });
    prev.addEventListener('click', () => go(-1));
    next.addEventListener('click', () => go(1));
    vp.addEventListener('mouseenter', () => (hover = true)); vp.addEventListener('mouseleave', () => (hover = false));
    vp.addEventListener('focusin', () => (hover = true)); vp.addEventListener('focusout', () => (hover = false));

    if (!reduce) {
      auto = setInterval(() => { if (!hover && !dragging && visible && !document.hidden) go(1); }, 4800);
      new IntersectionObserver((es) => (visible = es[0].isIntersecting), { threshold: 0.25 }).observe(vp);
      gsap.fromTo($$('.rev', track), { x: 140, opacity: 0 }, { x: 0, opacity: 1, duration: 1.5, stagger: 0.09, ease: 'expo.out', scrollTrigger: { trigger: vp, start: 'top 85%', once: true } });
    }
    measure();
    window.addEventListener('resize', measure);
    ScrollTrigger.addEventListener('refreshInit', measure);
  })();

  /* ------------------------------------------------------------------------
     CTA : parallax de fond, FAQ, carte lazy, finitions
     ------------------------------------------------------------------------ */
  if (!reduce) {
    gsap.fromTo('.cta__bg img', { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.orb', { scale: 0.7, rotation: -30, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: '.orb', start: 'top 85%', once: true } });
    gsap.fromTo('.find__map', { y: 70, scale: 0.94 }, { y: 0, scale: 1, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: '.find__map', start: 'top 88%', once: true } });
    gsap.fromTo('.policy b', { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.policy', start: 'top 90%', once: true } });
    gsap.fromTo('.rating__crit b', { scaleX: 0 }, { scaleX: 1, duration: 1.6, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.rating__crit', start: 'top 90%', once: true } });
  }

  const mapFrame = $('[data-map] iframe');
  if (mapFrame && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { mapFrame.src = mapFrame.dataset.src; io.disconnect(); } }, { rootMargin: '500px' });
    io.observe(mapFrame);
  } else if (mapFrame) mapFrame.src = mapFrame.dataset.src;

  setInterval(renderHoursStatusOnly, 60000);
  function renderHoursStatusOnly() {
    const s = $('#openStatus'); if (!s) return;
    s.classList.remove('is-open', 'is-closed');
    renderHours();
  }

  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
