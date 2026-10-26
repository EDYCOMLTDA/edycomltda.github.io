/* EDYCOM Ltda. · interacciones del sitio (JavaScript sin dependencias) */
(function () {
  'use strict';

  var WHATSAPP = '56966554182';
  var EMAIL = 'edycom@edycom.cl';
  var doc = document;
  doc.documentElement.classList.add('js');

  function byId(id) { return doc.getElementById(id); }
  function each(list, fn) { Array.prototype.forEach.call(list, fn); }

  /* Menú en celular y tablet */
  var menuBtn = doc.querySelector('.menu-btn');
  var nav = byId('menu');
  if (menuBtn && nav) {
    var setMenu = function (open) {
      nav.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    menuBtn.addEventListener('click', function () {
      setMenu(!nav.classList.contains('is-open'));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenu(false);
        menuBtn.focus();
      }
    });
    var wide = window.matchMedia('(min-width: 1101px)');
    var onWide = function (e) { if (e.matches) setMenu(false); };
    if (wide.addEventListener) wide.addEventListener('change', onWide);
    else if (wide.addListener) wide.addListener(onWide);
  }

  /* Pestañas de productos: Fabricación propia / Productos de línea */
  var tabs = doc.querySelectorAll('.tab[data-tab]');
  var panels = doc.querySelectorAll('.cards[data-panel]');
  function showTab(name) {
    each(tabs, function (t) {
      t.setAttribute('aria-pressed', t.getAttribute('data-tab') === name ? 'true' : 'false');
    });
    each(panels, function (p) {
      p.classList.toggle('is-active', p.getAttribute('data-panel') === name);
    });
  }
  each(tabs, function (t) {
    t.addEventListener('click', function () { showTab(t.getAttribute('data-tab')); });
  });
  doc.addEventListener('click', function (e) {
    var link = e.target.closest('[data-show-tab]');
    if (link) showTab(link.getAttribute('data-show-tab'));
  });

  /* Formulario de cotización: arma el mensaje para WhatsApp o correo */
  var form = byId('form-cotizacion');
  if (form) {
    var fields = {
      nombre: byId('f-nombre'),
      empresa: byId('f-empresa'),
      telefono: byId('f-telefono'),
      correo: byId('f-correo'),
      producto: byId('f-producto'),
      cantidad: byId('f-cantidad'),
      detalle: byId('f-detalle')
    };
    var order = [['Nombre', 'nombre'], ['Empresa', 'empresa'], ['Teléfono', 'telefono'], ['Correo', 'correo'],
      ['Producto', 'producto'], ['Cantidad', 'cantidad'], ['Detalle', 'detalle']];
    var sendWa = byId('send-wa');
    var sendMail = byId('send-mail');
    var status = byId('form-status');
    var errNombre = byId('f-nombre-error');
    var errContacto = byId('f-contacto-error');
    var tried = false;

    var val = function (key) { return String(fields[key].value || '').trim(); };

    var build = function () {
      var lines = ['Hola EDYCOM, quiero solicitar una cotización.'];
      order.forEach(function (pair) {
        if (val(pair[1])) lines.push(pair[0] + ': ' + val(pair[1]));
      });
      var subject = 'Solicitud de cotización' + (val('empresa') ? ' - ' + val('empresa') : '');
      return {
        ready: Boolean(val('nombre') && (val('telefono') || val('correo'))),
        wa: 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(lines.join('\n')),
        mail: 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\r\n'))
      };
    };

    var render = function () {
      var m = build();
      var noName = !val('nombre');
      var noContact = !(val('telefono') || val('correo'));
      sendWa.href = m.ready ? m.wa : '#cotizacion';
      sendWa.target = m.ready ? '_blank' : '_self';
      sendMail.href = m.ready ? m.mail : '#cotizacion';
      fields.nombre.setAttribute('aria-invalid', tried && noName ? 'true' : 'false');
      fields.telefono.setAttribute('aria-invalid', tried && noContact ? 'true' : 'false');
      fields.correo.setAttribute('aria-invalid', tried && noContact ? 'true' : 'false');
      errNombre.hidden = !(tried && noName);
      errContacto.hidden = !(tried && noContact);
      status.textContent = m.ready
        ? 'Listo: al enviar se abrirá WhatsApp o tu correo con el mensaje escrito. Si el correo no se abre, escríbenos a ' + EMAIL + '.'
        : 'Completa tu nombre y un teléfono o correo para enviar la solicitud.';
      return m;
    };

    var showErrors = function () {
      tried = true;
      render();
      (val('nombre') ? fields.telefono : fields.nombre).focus();
    };

    var guard = function (e) {
      if (build().ready) { render(); return; }
      e.preventDefault();
      showErrors();
    };

    form.addEventListener('input', render);
    form.addEventListener('change', render);
    sendWa.addEventListener('click', guard);
    sendMail.addEventListener('click', guard);
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    form.addEventListener('keydown', function (e) {
      var tag = e.target.tagName;
      if (e.key !== 'Enter' || e.isComposing || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'A' || tag === 'BUTTON') return;
      e.preventDefault();
      if (!build().ready) { showErrors(); return; }
      render();
      sendWa.click();
    });

    /* Los enlaces "Cotizar ..." de cada producto lo dejan elegido en el formulario */
    doc.addEventListener('click', function (e) {
      var link = e.target.closest('[data-producto]');
      if (!link) return;
      fields.producto.value = link.getAttribute('data-producto');
      render();
    });

    render();
  }

  /* Botón flotante de WhatsApp: se oculta en la portada y en Contacto */
  var wa = doc.querySelector('.wa-float');
  if (wa) {
    var setShown = function (show) {
      wa.classList.toggle('is-shown', show);
      if (show) { wa.removeAttribute('aria-hidden'); wa.removeAttribute('tabindex'); }
      else { wa.setAttribute('aria-hidden', 'true'); wa.setAttribute('tabindex', '-1'); }
    };
    var watched = [byId('inicio'), byId('contacto')].filter(Boolean);
    if ('IntersectionObserver' in window && watched.length) {
      var seen = {};
      setShown(false);
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { seen[en.target.id] = en.isIntersecting; });
        setShown(!Object.keys(seen).some(function (k) { return seen[k]; }));
      }, { threshold: 0.12 });
      watched.forEach(function (el) { io.observe(el); });
    } else {
      setShown(true);
    }
  }

  /* Video de la planta: se carga solo al pedirlo */
  each(doc.querySelectorAll('.play[data-video]'), function (btn) {
    var video = byId(btn.getAttribute('data-video'));
    if (!video) return;
    video.controls = false;
    btn.hidden = false;
    btn.addEventListener('click', function () {
      video.controls = true;
      btn.hidden = true;
      video.focus();
      var playing = video.play();
      if (playing && playing.catch) {
        playing.catch(function () { video.controls = true; });
      }
    });
  });

  /* Galería de piezas: en celular y tablet muestra 6 y un botón para ver todas */
  each(doc.querySelectorAll('.gallery__more'), function (btn) {
    var gallery = btn.closest('.gallery');
    var total = gallery.querySelectorAll('.tiles li').length;
    btn.hidden = false;
    btn.addEventListener('click', function () {
      var open = !gallery.classList.contains('is-expanded');
      gallery.classList.toggle('is-expanded', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'Ver menos piezas' : 'Ver las ' + total + ' piezas';
      if (!open) gallery.scrollIntoView({ block: 'start' });
    });
  });

  /* Visor de fotos ampliadas */
  var lb = byId('lightbox');
  if (lb && typeof lb.showModal === 'function') {
    var lbImg = byId('lightbox-img');
    var lbCaption = byId('lightbox-caption');
    var lbCount = byId('lightbox-count');
    var group = [];
    var index = 0;
    var opener = null;
    var show = function (i) {
      index = (i + group.length) % group.length;
      var link = group[index];
      var thumb = link.querySelector('img');
      lbImg.src = link.getAttribute('href');
      lbImg.alt = thumb ? thumb.alt : '';
      lbCaption.textContent = link.getAttribute('data-caption') || lbImg.alt;
      lbCount.textContent = '(' + (index + 1) + ' de ' + group.length + ')';
    };
    doc.addEventListener('click', function (e) {
      var link = e.target.closest('a[data-gallery]');
      if (!link || e.ctrlKey || e.metaKey || e.shiftKey || e.button > 0) return;
      e.preventDefault();
      group = Array.prototype.slice.call(doc.querySelectorAll('a[data-gallery="' + link.getAttribute('data-gallery') + '"]'));
      opener = link;
      show(group.indexOf(link));
      lb.showModal();
    });
    lb.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-lb]');
      if (btn) {
        var action = btn.getAttribute('data-lb');
        if (action === 'close') lb.close();
        else show(index + (action === 'next' ? 1 : -1));
      } else if (e.target === lb) {
        lb.close();
      }
    });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); }
    });
    var startX = null;
    var startY = null;
    lb.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      var dy = e.changedTouches[0].clientY - startY;
      startX = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(index + (dx < 0 ? 1 : -1));
    });
    lb.addEventListener('close', function () {
      lbImg.removeAttribute('src');
      if (opener) opener.focus();
    });
  }

  /* Año del pie de página */
  var year = byId('year');
  if (year) year.textContent = String(Math.max(2026, new Date().getFullYear()));
})();
