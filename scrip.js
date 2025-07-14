document.addEventListener('DOMContentLoaded', () => {
  AOS.init();

  const toggleDesktop = document.getElementById("themeToggle");
  const toggleMobile = document.getElementById("themeToggleMobile");
  const body = document.body;

function aplicarModoOscuro(modo) {
  const thumbDesktop = toggleDesktop?.querySelector(".toggle-thumb");
  const thumbMobile = toggleMobile?.querySelector(".toggle-thumb");

  if (modo === "oscuro") {
    body.classList.add("dark-mode");
    body.classList.remove("claro");
    toggleDesktop?.setAttribute("aria-pressed", "true");
    toggleDesktop?.setAttribute("aria-label", "Cambiar a modo claro");
    toggleMobile?.setAttribute("aria-pressed", "true");
    toggleMobile?.setAttribute("aria-label", "Cambiar a modo claro");

    if (thumbDesktop) thumbDesktop.textContent = "☀️";
    if (thumbMobile) thumbMobile.textContent = "☀️";
  } else {
    body.classList.remove("dark-mode");
    body.classList.add("claro");
    toggleDesktop?.setAttribute("aria-pressed", "false");
    toggleDesktop?.setAttribute("aria-label", "Cambiar a modo oscuro");
    toggleMobile?.setAttribute("aria-pressed", "false");
    toggleMobile?.setAttribute("aria-label", "Cambiar a modo oscuro");

    if (thumbDesktop) thumbDesktop.textContent = "🌙";
    if (thumbMobile) thumbMobile.textContent = "🌙";
  }

  // 🧠 Aquí actualizamos las partículas según el modo
  cargarParticulas(modo);
}


  function detectarPreferencia() {
    if (window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro';
    }
    return 'claro';
  }

  let modoGuardado = localStorage.getItem("modo") || detectarPreferencia();
  aplicarModoOscuro(modoGuardado);

  // Listeners para ambos botones
  toggleDesktop?.addEventListener("click", () => {
    const modoActual = body.classList.contains("dark-mode") ? "oscuro" : "claro";
    const nuevoModo = modoActual === "oscuro" ? "claro" : "oscuro";
    localStorage.setItem("modo", nuevoModo);
    aplicarModoOscuro(nuevoModo);
  });

  toggleMobile?.addEventListener("click", () => {
    const modoActual = body.classList.contains("dark-mode") ? "oscuro" : "claro";
    const nuevoModo = modoActual === "oscuro" ? "claro" : "oscuro";
    localStorage.setItem("modo", nuevoModo);
    aplicarModoOscuro(nuevoModo);
  });
});

  function cargarParticulas(modo) {
  const style = getComputedStyle(document.body);
  const particleColor = style.getPropertyValue('--particles-color').trim();

  // Destruir partículas anteriores si existen
  if (window.pJSDom && window.pJSDom.length > 0) {
    // Destruye el primero
    window.pJSDom.forEach((pjs) => pjs.pJS.fn.vendors.destroypJS());
    // Limpia el contenedor
    const container = document.querySelector("#particles-js");
    if (container) container.innerHTML = "";
    // Vacía el array para que quede limpio
    window.pJSDom = [];
  }

  let config = {};

  if (modo === "oscuro") {
    config = {
      particles: {
        number: { value: 60, density: { enable: true, value_area: 800 } },
        color: { value: particleColor },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 120,
          color: particleColor,
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          out_mode: "out"
        }
      },
      interactivity: {
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" }
        },
        modes: {
          grab: { distance: 140, line_linked: { opacity: 1 } },
          push: { particles_nb: 4 }
        }
      },
      retina_detect: true
    };
  } else {
  // Modo claro: burbujas suaves y flotantes
  config = {
    particles: {
      number: {
        value: 80,
        density: { enable: true, value_area: 800 }
      },
      color: {
        value: ["#0000ff", "#00ff00", "#ff0000", "0400ff"] // variedad de tonos claritos
      },
      shape: {
        type: "circle",
        stroke: {
          width: 1,
          color: "#e0f0ff" // contorno leve tipo burbuja
        }
      },
      opacity: {
        value: 0.2,
        random: true,
        anim: {
          enable: true,
          speed: 0.5,
          opacity_min: 0.05,
          sync: false
        }
      },
      size: {
        value: 5,
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: 2,
          sync: false
        }
      },
      line_linked: { enable: false },
      move: {
        enable: true,
        speed: 1.2,
        direction: "top",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false
      }
    },
    interactivity: {
      events: {
        onhover: { enable: false },
        onclick: { enable: false }
      }
    },
    retina_detect: true
  };
}

particlesJS('particles-js', config);

}

  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links li a");

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 80;
      if (pageYOffset >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes(current)) {
        link.classList.add("active");
      }
    });
  });

  document.addEventListener("DOMContentLoaded", () => {
  const toggles = document.querySelectorAll(".toggle-desc");

  toggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const skill = btn.closest(".skill");
      const desc = skill.querySelector(".skill-desc");

      // Alternar clase "show" para mostrar u ocultar
      skill.classList.toggle("show");

      // Cambiar el símbolo del botón
      btn.textContent = skill.classList.contains("show") ? "−" : "+";
    });
  });
});

//configuracion de la ia bot 
  fetch('bot.html')
    .then(res => res.text())
    .then(html => {
      document.body.insertAdjacentHTML('beforeend', html);
      const script = document.createElement('script');
      script.src = 'bot.js';
      document.body.appendChild(script);
    });