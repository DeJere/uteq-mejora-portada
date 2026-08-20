// UTEQ — Prototipo de portada (Tailwind)
// Menú superior con submenús desplegables + menú móvil + carrusel del hero + agenda +
// búsqueda, formulario de contacto, panel de accesibilidad y chatbot local.
(function () {
  "use strict";
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---------- toast ---------- */
  function toast(msg) {
    var box = document.createElement("div");
    box.className = "bg-[#0d3d24] text-white px-3.5 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-start gap-2";
    box.innerHTML = '<i class="fas fa-circle-check text-amber-400 mt-0.5"></i><span>' + msg + "</span>";
    $("#toastContainer").appendChild(box);
    setTimeout(function () {
      box.style.transition = "opacity .2s ease";
      box.style.opacity = "0";
      setTimeout(function () { box.remove(); }, 220);
    }, 3600);
  }

  /* ---------- modal de información (contenido real por sección) ---------- */
  var infoData = {
    sga: ["Sistema de Gestión Académica (SGA)", "Acceso para estudiantes y docentes con cuenta institucional @uteq.edu.ec."],
    sagest: ["SAGEST", "Sistema de gestión institucional de uso administrativo."],
    correo: ["Correo institucional", "Acceso al correo @uteq.edu.ec para estudiantes, docentes y personal administrativo, a través de Google Workspace institucional."],
    comunicacion: ["Comunicación", "Canal oficial de prensa, boletines y solicitudes de cobertura institucional."],
    autoridades: ["Autoridades", "Rectorado, vicerrectorados académico y de investigación, y decanatos de las 5 facultades."],
    normativa: ["Normativa institucional", "Estatuto orgánico, reglamentos internos y resoluciones vigentes del Consejo Universitario."],
    planificacion: ["Planificación estratégica", "Plan Estratégico Institucional (PEI) y planificación operativa anual (POA)."],
    identidad: ["Identidad corporativa", "Manual de identidad corporativa: logotipo, colores institucionales y lineamientos de marca."],
    "educacion-continua": ["Educación continua", "Cursos, seminarios y talleres de capacitación abiertos a la comunidad, fuera de la malla de grado y posgrado."],
    "tour-virtual": ["Tour virtual", "Recorrido 360° por el campus principal — en preparación por el Departamento de Comunicación. Mientras tanto, puedes escribirnos a relacionespublicas@uteq.edu.ec para agendar una visita guiada."],
    "agenda-completa": ["Calendario académico completo", "El calendario académico oficial (matrículas, inicio/fin de clases, exámenes y receso) se publica en el sitio oficial uteq.edu.ec y se sincroniza aquí con las fechas más próximas."],
    convenios: ["Convenios", "Listado de convenios interinstitucionales vigentes con entidades públicas y privadas."],
    "tramite-vinc": ["Trámites de vinculación", "Formularios y requisitos para proponer nuevos proyectos o convenios de vinculación."],
    seguimiento: ["Seguimiento", "Reportes de avance y cumplimiento de los proyectos de vinculación en ejecución."],
    informes: ["Informes", "Informes anuales del Departamento de Vinculación con la Sociedad."],
    "servicios-est": ["Servicios estudiantiles", "Atención psicológica, médica y orientación académica para estudiantes."],
    ayudas: ["Ayudas socioeconómicas", "Becas y ayudas socioeconómicas dirigidas a estudiantes que requieren apoyo para continuar sus estudios."],
    "planif-actividades": ["Planificación de actividades", "Cronograma de actividades culturales, deportivas y de bienestar estudiantil."],
    lotaip: ["LOTAIP", "Información pública mensual publicada conforme a la Ley Orgánica de Transparencia y Acceso a la Información Pública."],
    rendicion: ["Rendición de cuentas", "Informes anuales de gestión institucional presentados a la comunidad universitaria."],
    datos: ["Datos institucionales", "Presupuesto, contratación pública y distributivo de personal."],
    privacidad: ["Política de privacidad", "El tratamiento de datos personales en este sitio se rige por la Ley Orgánica de Protección de Datos Personales (LOPDP) del Ecuador. Los datos del formulario de contacto se usan únicamente para responder tu mensaje."]
  };
  function openInfoModal(key) {
    var d = infoData[key];
    if (!d) return;
    $("#infoModalTitle").textContent = d[0];
    $("#infoModalText").textContent = d[1];
    var m = $("#infoModal");
    m.classList.remove("opacity-0", "pointer-events-none");
  }
  $all("[data-info]").forEach(function (el) {
    el.addEventListener("click", function () { openInfoModal(el.dataset.info); });
  });
  $("#closeInfoModal").addEventListener("click", function () {
    $("#infoModal").classList.add("opacity-0", "pointer-events-none");
  });
  $("#infoModal").addEventListener("click", function (e) {
    if (e.target === this) this.classList.add("opacity-0", "pointer-events-none");
  });

  /* ---------- idioma (barra superior) ---------- */
  var langMenu = $("#langMenu");
  function pintarFlechaIdioma() {
    var abierto = !langMenu.classList.contains("hidden");
    $("#langToggle").setAttribute("aria-expanded", abierto);
    var flecha = $("#langToggle i");
    if (flecha) flecha.style.transform = abierto ? "rotate(180deg)" : "";
  }
  $("#langToggle").addEventListener("click", function (e) {
    e.stopPropagation();
    langMenu.classList.toggle("hidden");
    pintarFlechaIdioma();
  });
  $all("[data-lang]").forEach(function (b) {
    b.addEventListener("click", function () {
      $all("[data-lang]").forEach(function (x) { x.removeAttribute("aria-current"); });
      b.setAttribute("aria-current", "true");
      $("#langLabel").textContent = b.dataset.lang.toUpperCase();
      langMenu.classList.add("hidden");
      pintarFlechaIdioma();
      toast(b.dataset.lang === "es" ? "Idioma: Español" : "Language: English (próximamente)");
    });
  });
  document.addEventListener("click", function (e) {
    if (!langMenu.contains(e.target) && e.target !== $("#langToggle") && !$("#langToggle").contains(e.target)) {
      langMenu.classList.add("hidden");
      pintarFlechaIdioma();
    }
  });

  /* ---------- menú de escritorio con submenús ---------- */
  var navItems = $all(".nav-item");
  function closeAllNavItems(except) {
    navItems.forEach(function (it) { if (it !== except) it.classList.remove("open"); });
  }
  navItems.forEach(function (item) {
    var btn = item.querySelector(".nav-btn");
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = item.classList.contains("open");
      closeAllNavItems(item);
      item.classList.toggle("open", !isOpen);
    });
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".nav-item")) closeAllNavItems(null);
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAllNavItems(null); });

  /* ---------- menú móvil (drawer + acordeón) ---------- */
  function openMobileFn() {
    $("#mobileDrawer").classList.remove("translate-x-full");
    $("#mobileOverlay").classList.remove("opacity-0", "pointer-events-none");
  }
  function closeMobileFn() {
    $("#mobileDrawer").classList.add("translate-x-full");
    $("#mobileOverlay").classList.add("opacity-0", "pointer-events-none");
  }
  $("#openMobileMenu").addEventListener("click", openMobileFn);
  $("#closeMobileMenu").addEventListener("click", closeMobileFn);
  $("#mobileOverlay").addEventListener("click", closeMobileFn);
  $all("#mobileDrawer nav > a").forEach(function (a) {
    a.addEventListener("click", closeMobileFn);
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMobileFn(); });

  $all(".m-acc-item").forEach(function (item) {
    var btn = item.querySelector(".m-acc-btn");
    btn.addEventListener("click", function () { item.classList.toggle("open"); });
    $all("a, button[data-info]", item).forEach(function (link) {
      link.addEventListener("click", closeMobileFn);
    });
  });

  /* ---------- carrusel del hero ---------- */
  var slides = $all(".hero-slide");
  var dotsWrap = $("#heroDots");
  var heroIdx = 0;
  var heroTimer = null;
  slides.forEach(function (s, i) {
    var d = document.createElement("button");
    d.className = "hero-dot" + (i === 0 ? " active" : "");
    d.setAttribute("aria-label", "Ir a la imagen " + (i + 1));
    d.addEventListener("click", function () { goToSlide(i); restartAutoplay(); });
    dotsWrap.appendChild(d);
  });
  var dots = $all(".hero-dot");
  function goToSlide(i) {
    heroIdx = (i + slides.length) % slides.length;
    slides.forEach(function (s, idx) { s.classList.toggle("active", idx === heroIdx); });
    dots.forEach(function (d, idx) { d.classList.toggle("active", idx === heroIdx); });
    var vid = slides[heroIdx].querySelector("video");
    if (vid) { vid.currentTime = 0; vid.play().catch(function () {}); }
  }
  function restartAutoplay() {
    if (heroTimer) clearInterval(heroTimer);
    heroTimer = setInterval(function () { goToSlide(heroIdx + 1); }, 7000);
  }
  $("#heroPrev").addEventListener("click", function () { goToSlide(heroIdx - 1); restartAutoplay(); });
  $("#heroNext").addEventListener("click", function () { goToSlide(heroIdx + 1); restartAutoplay(); });
  restartAutoplay();

  /* ---------- mini-carrusel de fotos en las tarjetas de carreras ---------- */
  $all("#carreras a.group").forEach(function (card, ci) {
    var ccSlides = $all(".cc-slide", card);
    var ccDots = $all(".cc-dots span", card);
    if (ccSlides.length < 2) return;
    var ccIdx = 0;
    setInterval(function () {
      ccIdx = (ccIdx + 1) % ccSlides.length;
      ccSlides.forEach(function (s, i) { s.classList.toggle("active", i === ccIdx); });
      ccDots.forEach(function (d, i) { d.classList.toggle("active", i === ccIdx); });
    }, 3800 + ci * 240); // pequeño desfase para que no cambien todas a la vez
  });

  /* ---------- agenda: mini calendario ---------- */
  var calMonths = [
    { label: "Junio 2026", year: 2026, month: 5, firstWeekdayMon0: 0, days: 30, events: [20] },
    { label: "Julio 2026", year: 2026, month: 6, firstWeekdayMon0: 2, days: 31, events: [8, 15, 22] },
    { label: "Agosto 2026", year: 2026, month: 7, firstWeekdayMon0: 5, days: 31, events: [18] }
  ];
  var calIdx = 1; // arranca en Julio 2026
  function renderCalendar() {
    var m = calMonths[calIdx];
    $("#calLabel").textContent = m.label;
    var grid = $("#calGrid");
    grid.innerHTML = "";
    for (var i = 0; i < m.firstWeekdayMon0; i++) {
      grid.appendChild(document.createElement("span"));
    }
    for (var d = 1; d <= m.days; d++) {
      var cell = document.createElement("span");
      var isEvent = m.events.indexOf(d) !== -1;
      cell.className = "py-1 rounded-full " + (isEvent ? "bg-amber-400 text-[#0d3d24] font-bold" : "text-gray-600");
      cell.textContent = d;
      grid.appendChild(cell);
    }
  }
  $("#calPrev").addEventListener("click", function () { calIdx = (calIdx - 1 + calMonths.length) % calMonths.length; renderCalendar(); });
  $("#calNext").addEventListener("click", function () { calIdx = (calIdx + 1) % calMonths.length; renderCalendar(); });
  renderCalendar();

  /* ---------- búsqueda (capa modal) ---------- */
  var capa = $("#capaBusqueda");
  $("#btnBuscar").addEventListener("click", function () {
    capa.classList.remove("hidden");
    $("#campoBusqueda").focus();
  });
  capa.addEventListener("click", function (e) { if (e.target === capa) capa.classList.add("hidden"); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") capa.classList.add("hidden"); });
  $("#campoBusquedaForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var val = $("#campoBusqueda").value.toLowerCase().trim();
    var map = {
      "carrera": "#carreras", "admision": "#admision", "admisión": "#admision",
      "noticia": "#noticias", "agenda": "#agenda", "calendario": "#agenda",
      "vinculacion": "#vinculacion", "vinculación": "#vinculacion",
      "bienestar": "#bienestar", "transparencia": "#transparencia", "lotaip": "#transparencia",
      "investigacion": "#investigacion", "investigación": "#investigacion",
      "universidad": "#universidad", "autoridades": "#universidad",
      "contacto": "#contacto"
    };
    var found = null;
    Object.keys(map).forEach(function (k) { if (val.indexOf(k) !== -1) found = map[k]; });
    capa.classList.add("hidden");
    if (found) { document.querySelector(found).scrollIntoView({ behavior: "smooth" }); toast("Mostrando resultados para “" + val + "”."); }
    else if (val) { toast("No se encontraron secciones para “" + val + "”. Prueba con Soporte en línea."); }
  });

  /* ---------- contacto ---------- */
  $("#contactForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var nF = $("#cNombre").closest(".field"), eF = $("#cEmail").closest(".field"), mF = $("#cMensaje").closest(".field");
    var ok = true;
    function setInvalid(field, input, isInvalid) {
      field.querySelector(".err").classList.toggle("hidden", !isInvalid);
      input.classList.toggle("border-red-500", isInvalid);
    }
    var nInvalid = !$("#cNombre").value.trim(); setInvalid(nF, $("#cNombre"), nInvalid); if (nInvalid) ok = false;
    var emailOk = /^\S+@\S+\.\S+$/.test($("#cEmail").value.trim()); setInvalid(eF, $("#cEmail"), !emailOk); if (!emailOk) ok = false;
    var mInvalid = !$("#cMensaje").value.trim(); setInvalid(mF, $("#cMensaje"), mInvalid); if (mInvalid) ok = false;
    if (!ok) { toast("Completa el formulario correctamente."); return; }
    toast("Mensaje enviado. Te responderemos a " + $("#cEmail").value.trim());
    this.reset();
    $all(".field input, .field textarea", this).forEach(function (i) { i.classList.remove("border-red-500"); });
    $all(".field .err", this).forEach(function (e2) { e2.classList.add("hidden"); });
  });

  /* ---------- accesibilidad ---------- */
  var textStep = 0;
  function setToggle(btn, on) {
    btn.classList.toggle("bg-emerald-100", on);
    btn.classList.toggle("bg-gray-200", !on);
    btn.setAttribute("aria-checked", on);
    var knob = btn.querySelector("span");
    knob.style.transform = on ? "translateX(16px)" : "translateX(0)";
  }
  $("#a11yFab").addEventListener("click", function (e) {
    e.stopPropagation();
    $("#a11yPanel").classList.toggle("opacity-0");
    $("#a11yPanel").classList.toggle("pointer-events-none");
    $("#chatPanel").classList.add("opacity-0", "pointer-events-none");
  });
  $("#footerA11y").addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
    $("#a11yPanel").classList.remove("opacity-0", "pointer-events-none");
  });
  $("#toggleContrast").addEventListener("click", function () {
    document.documentElement.classList.toggle("a11y-contrast");
    setToggle(this, document.documentElement.classList.contains("a11y-contrast"));
  });
  $("#toggleUnderline").addEventListener("click", function () {
    document.documentElement.classList.toggle("a11y-underline");
    setToggle(this, document.documentElement.classList.contains("a11y-underline"));
  });
  $("#textPlus").addEventListener("click", function () {
    if (textStep < 3) { textStep++; document.documentElement.style.fontSize = (100 + textStep * 12.5) + "%"; }
  });
  $("#textMinus").addEventListener("click", function () {
    if (textStep > 0) { textStep--; document.documentElement.style.fontSize = textStep === 0 ? "" : (100 + textStep * 12.5) + "%"; }
  });
  document.addEventListener("click", function (e) {
    var panel = $("#a11yPanel");
    if (!panel.contains(e.target) && e.target !== $("#a11yFab") && !$("#a11yFab").contains(e.target)) {
      panel.classList.add("opacity-0", "pointer-events-none");
    }
  });

  /* ---------- chatbot: soporte en línea (motor de intenciones por palabras clave, 100% local) ---------- */
  var CAMPUS = "Av. Walter Andrade Km 1.5 vía a Santo Domingo, cantón Quevedo, provincia de Los Ríos, Ecuador";
  var intents = [
    { id: "ubic-uteq", chips: "¿Dónde está la UTEQ?", kw: ["donde", "ubicacion", "ubicada", "direccion", "queda", "llegar", "como llego", "campus", "mapa"], kwBoost: ["universidad", "uteq"], a: "La UTEQ tiene su campus principal en " + CAMPUS + ". Todas las facultades funcionan dentro de este mismo campus." },
    { id: "fac-ing", chips: "Facultad de Ingeniería", kw: ["ingenieria", "software", "civil", "industrial", "sistemas", "computacion"], a: "La Facultad de Ciencias de la Ingeniería está dentro del campus principal (" + CAMPUS + "). Ahí se dictan carreras como Ingeniería en Software, Civil e Industrial." },
    { id: "fac-agro", chips: "Facultad Agropecuaria", kw: ["agropecuaria", "agroecologia", "agronomia", "agricola", "agraria"], a: "La Facultad de Ciencias Agropecuarias funciona en el campus principal (" + CAMPUS + ") y cuenta además con áreas experimentales agrícolas anexas." },
    { id: "fac-pec", chips: "Facultad Pecuaria", kw: ["pecuaria", "veterinaria", "zootecnia", "acuicultura"], a: "La Facultad de Ciencias Pecuarias está en el campus principal (" + CAMPUS + "), con áreas para prácticas de veterinaria, zootecnia y acuicultura." },
    { id: "fac-emp", chips: "Facultad Empresarial", kw: ["empresarial", "administracion", "contabilidad", "turismo", "negocios"], a: "La Facultad de Ciencias Empresariales está en el campus principal (" + CAMPUS + "). Incluye Administración de Empresas, Contabilidad y Auditoría, y Turismo." },
    { id: "fac-amb", chips: "Facultad Ambiental", kw: ["ambiental", "ambientales", "biotecnologia", "ecologia", "salud"], a: "La Facultad de Ciencias Ambientales está en el campus principal (" + CAMPUS + "), con laboratorios propios de Biotecnología e Ingeniería Ambiental." },
    { id: "universidad", chips: "La Universidad", kw: ["autoridades", "rector", "normativa", "reglamento", "estatuto", "planificacion", "identidad", "organizacion", "historia"], a: "En el menú Contacto → La Universidad encuentras autoridades, normativa institucional, planificación estratégica e identidad corporativa." },
    { id: "admision", chips: "Admisión", kw: ["admision", "postular", "postulacion", "inscribir", "inscripcion", "ingreso", "matricula", "matricularme", "cupo", "requisitos"], a: "El proceso de admisión está en el menú Admisión, con el botón “Postúlate ahora” visible desde la portada." },
    { id: "carreras", chips: "Carreras", kw: ["carrera", "carreras", "estudiar", "malla", "oferta academica"], a: "La UTEQ ofrece 39 carreras distribuidas en varias facultades. Puedes verlas todas en el menú Carreras y en la sección “Estudia con nosotros”." },
    { id: "agenda", chips: "Agenda", kw: ["agenda", "calendario", "fechas", "cronograma"], a: "La sección Próximas fechas (menú Noticias → Próximas fechas) muestra el mini calendario y las fechas importantes: matrículas, inicio de clases y actividades de bienestar." },
    { id: "noticias", chips: "Noticias", kw: ["noticia", "noticias", "novedades", "actualidad", "eventos"], a: "Las últimas noticias institucionales están en el menú Noticias, con actualidad de investigación, cooperación internacional y comunicados oficiales." },
    { id: "posgrado", chips: "Posgrado", kw: ["posgrado", "maestria", "maestrias"], a: "La oferta de maestrías está en el menú Carreras → Posgrado, con enlace directo al sitio de posgrados." },
    { id: "investigacion", chips: "Investigación", kw: ["investigacion", "cidu", "proyectos", "cientifica", "publicaciones", "revistas"], a: "La sección Investigación reúne la producción científica, las revistas indexadas y los proyectos de investigación de la UTEQ." },
    { id: "vinculacion", chips: "Vinculación", kw: ["vinculacion", "convenio", "convenios", "tramite de vinculacion", "seguimiento", "informe de vinculacion"], a: "Vinculación reúne convenios, trámites de vinculación y el seguimiento e informes de los proyectos con la comunidad. Hay 121 convenios activos." },
    { id: "bienestar", chips: "Bienestar", kw: ["bienestar", "beca", "becas", "socioeconomica", "psicologia", "salud estudiantil", "actividades"], a: "Bienestar Universitario incluye servicios estudiantiles, ayudas socioeconómicas y planificación de actividades." },
    { id: "transparencia", chips: "Transparencia", kw: ["transparencia", "lotaip", "rendicion de cuentas", "presupuesto", "contratacion publica"], a: "Transparencia reúne la LOTAIP, la rendición de cuentas y los datos institucionales, según la Ley Orgánica de Transparencia y Acceso a la Información Pública." },
    { id: "contacto", chips: "Contacto", kw: ["contacto", "telefono", "correo", "email", "escribir", "llamar", "numero"], a: "Puedes escribirnos a relacionespublicas@uteq.edu.ec o llamar al (05) 3-001-500, de lunes a viernes." },
    { id: "biblioteca", chips: "Biblioteca", kw: ["biblioteca", "libros", "catalogo"], a: "La Biblioteca General tiene su propio sitio en biblioteca.uteq.edu.ec, enlazado desde el menú Estudiantes." }
  ];
  var greetKw = ["hola", "buenas", "buenos dias", "buenas tardes", "hey"];
  var thanksKw = ["gracias", "muchas gracias", "ok gracias"];
  function normalize(s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim(); }
  function matchIntent(raw) {
    var text = normalize(raw);
    if (greetKw.some(function (k) { return text.indexOf(k) !== -1; })) return { a: "¡Hola! Puedo orientarte sobre ubicación de facultades, admisión, carreras, agenda, noticias, vinculación, bienestar, transparencia o contacto. ¿Qué necesitas saber?" };
    if (thanksKw.some(function (k) { return text.indexOf(k) !== -1; })) return { a: "¡Con gusto! Si tienes otra pregunta sobre la UTEQ, aquí estoy." };
    var best = null, bestScore = 0;
    intents.forEach(function (it) {
      var score = 0;
      it.kw.forEach(function (k) { if (text.indexOf(k) !== -1) score += k.split(" ").length; });
      if (it.kwBoost) it.kwBoost.forEach(function (k) { if (text.indexOf(k) !== -1) score += 0.5; });
      if (score > bestScore) { bestScore = score; best = it; }
    });
    if (best && bestScore > 0) return best;
    return { a: "No tengo esa información exacta todavía. Prueba preguntando por: ubicación de una facultad, admisión, carreras, agenda, noticias, vinculación, bienestar, transparencia o contacto. También puedes escribirnos a relacionespublicas@uteq.edu.ec." };
  }
  var chatOpened = false;
  function openChat() {
    $("#chatPanel").classList.remove("opacity-0", "pointer-events-none");
    $("#a11yPanel").classList.add("opacity-0", "pointer-events-none");
    if (!chatOpened) {
      chatOpened = true;
      addBotMsg("Hola, soy el soporte en línea de la UTEQ. Pregúntame, por ejemplo: “¿dónde queda la facultad de ingeniería?” o “¿cómo es la admisión?”. También puedes usar los botones de abajo.");
      renderChips();
    }
    setTimeout(function () { $("#chatInput").focus(); }, 150);
  }
  function closeChatFn() { $("#chatPanel").classList.add("opacity-0", "pointer-events-none"); }
  $("#chatFab").addEventListener("click", function (e) {
    e.stopPropagation();
    var isOpen = !$("#chatPanel").classList.contains("opacity-0");
    isOpen ? closeChatFn() : openChat();
  });
  $("#closeChat").addEventListener("click", closeChatFn);
  function addBotMsg(t) {
    var d = document.createElement("div");
    d.className = "max-w-[85%] px-3 py-2.5 rounded-xl text-[12.5px] leading-relaxed bg-white border border-gray-200 self-start";
    d.textContent = t;
    $("#chatBody").appendChild(d);
    $("#chatBody").scrollTop = $("#chatBody").scrollHeight;
  }
  function addUserMsg(t) {
    var d = document.createElement("div");
    d.className = "max-w-[85%] px-3 py-2.5 rounded-xl text-[12.5px] leading-relaxed bg-[#14603a] text-white self-end";
    d.textContent = t;
    $("#chatBody").appendChild(d);
    $("#chatBody").scrollTop = $("#chatBody").scrollHeight;
  }
  function showTyping() {
    var d = document.createElement("div");
    d.className = "chat-typing self-start bg-white border border-gray-200 px-3 py-3 rounded-xl flex gap-1";
    d.id = "chatTyping";
    d.innerHTML = "<span></span><span></span><span></span>";
    $("#chatBody").appendChild(d);
    $("#chatBody").scrollTop = $("#chatBody").scrollHeight;
  }
  function hideTyping() { var t = $("#chatTyping"); if (t) t.remove(); }
  // Endpoint del backend (server.py). Si no esta corriendo, el chat responde
  // con el motor local de palabras clave, para que el prototipo nunca quede mudo.
  var CHAT_API = "/api/chat";
  var chatHistory = [];
  function setChatMode(online) {
    var el = $("#chatMode");
    if (!el) return;
    el.textContent = online ? "Asistente UTEQ · IA en linea" : "Asistente UTEQ · modo local";
  }
  function askBot(text) {
    addUserMsg(text);
    showTyping();
    var enviado = chatHistory.slice(-6);
    chatHistory.push({ role: "user", content: text });
    var respondido = false;
    function responder(txt, online) {
      if (respondido) return;
      respondido = true;
      hideTyping();
      addBotMsg(txt);
      chatHistory.push({ role: "assistant", content: txt });
      chatHistory = chatHistory.slice(-8);
      setChatMode(online);
    }
    function local() { responder(matchIntent(text).a, false); }
    var falloTimer = setTimeout(local, 12000); // si el servidor tarda demasiado
    fetch(CHAT_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, history: enviado })
    })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (d) {
        clearTimeout(falloTimer);
        if (!d || !d.reply) throw new Error("respuesta vacia");
        responder(d.reply, true);
      })
      .catch(function () { clearTimeout(falloTimer); local(); });
  }
  function renderChips() {
    var wrap = $("#chatChips");
    wrap.innerHTML = "";
    intents.slice(0, 6).forEach(function (it) {
      var b = document.createElement("button");
      b.className = "bg-white border border-gray-200 px-2.5 py-1.5 rounded-full text-[10.5px] font-semibold text-[#14603a] hover:bg-emerald-50";
      b.textContent = it.chips;
      b.addEventListener("click", function () { askBot(it.chips); });
      wrap.appendChild(b);
    });
  }
  $("#chatForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var val = $("#chatInput").value.trim();
    if (!val) return;
    askBot(val);
    $("#chatInput").value = "";
  });
})();
