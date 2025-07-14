let estadoLocal = "inicio"; // Para controlar el flujo
let datosCita = {
  nombre: '',
  correo: '',
  fecha: '',
  proyecto: ''
};

// Mostrar/ocultar el bot y bienvenida
document.getElementById("botToggle").addEventListener("click", () => {
  const box = document.getElementById("botBox");
  const contenedor = document.getElementById("botMessages");
  const yaMostrada = contenedor.dataset.bienvenidaMostrada;

  box.style.display = box.style.display === "flex" ? "none" : "flex";

  if (!yaMostrada && box.style.display === "flex") {
    agregarMensaje("AxelBot", "¡Hola! Soy AxelBot 🤖 ¿Quieres agendar una cita, hacer una cotización o conocer mis proyectos?");
    contenedor.dataset.bienvenidaMostrada = "true";
  }
});
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const contenedor = document.getElementById("botMessages");

function agregarMensaje(origen, texto) {
  const clase = origen === "AxelBot" ? "message-bot" : "message-user";
  const p = document.createElement("p");
  p.className = clase;
  p.innerHTML = `<strong>${origen}:</strong><br>${texto}`;
  contenedor.appendChild(p);
  // Scroll suave
  contenedor.scrollTo({ top: contenedor.scrollHeight, behavior: "smooth" });
}

function mostrarEscribiendo() {
  const contenedor = document.getElementById("botMessages");
  const p = document.createElement("p");
  p.id = "escribiendo";
  p.className = "message-bot";
  p.innerHTML = `<strong>AxelBot:</strong><br><span class="sniper-dots"><span></span><span></span><span></span></span>`;
  contenedor.appendChild(p);
  contenedor.scrollTo({ top: contenedor.scrollHeight, behavior: "smooth" });
}

function eliminarEscribiendo() {
  const escribiendo = document.getElementById("escribiendo");
  if (escribiendo) escribiendo.remove();
}

function obtenerRespuesta(mensaje) {
  // Aquí puedes hacer fetch o lógica avanzada
  return modoLocal(mensaje);
}

function enviarMensaje() {
  const mensaje = input.value.trim();
  if (!mensaje) return;

  agregarMensaje("Tú", mensaje);
  input.value = "";

  // Deshabilitar input y botón para evitar spam
  input.disabled = true;
  sendBtn.disabled = true;

  mostrarEscribiendo();

  // Simular delay variable entre 1.2s y 2.5s
  const delay = 1200 + Math.random() * 1300;

  setTimeout(() => {
    const respuesta = obtenerRespuesta(mensaje);
    eliminarEscribiendo();
    agregarMensaje("AxelBot", respuesta);

    // Rehabilitar input y botón
    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
  }, delay);
}

// Eventos
sendBtn.addEventListener("click", enviarMensaje);
input.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    enviarMensaje();
  }
});


// 💬 Modo local
function modoLocal(texto) {
  texto = texto.toLowerCase();

  if (estadoLocal === "inicio") {
    if (texto.includes("agendar")) {
      estadoLocal = "agendar_nombre";
      return "Perfecto, para agendar una cita dime tu nombre completo.";
    }

    if (texto.includes("cotizar") || texto.includes("cotización")) {
      estadoLocal = "cotizar_detalle";
      datosCita.proyecto = "Cotización";
      return "¡Claro! ¿Qué servicio deseas cotizar? (ej: tienda, portafolio, sistema...)";
    }

    if (texto.includes("proyecto")) {
      return "Puedes ver mis proyectos en la sección 'Mis proyectos' más abajo en esta misma página.";
    }

    return "¿Te gustaría agendar una cita, hacer una cotización o conocer mis proyectos?";
  }

  // --- Flujo cita ---
  if (estadoLocal === "agendar_nombre") {
    datosCita.nombre = texto;
    estadoLocal = "agendar_correo";
    return `Gracias ${datosCita.nombre}. Ahora, dime tu correo electrónico.`;
  }

  if (estadoLocal === "agendar_correo") {
    datosCita.correo = texto;
    estadoLocal = "agendar_fecha";
    return `Perfecto. ¿Para qué fecha y hora deseas agendar la cita?`;
  }

if (estadoLocal === "agendar_fecha") {
  datosCita.fecha = texto;
  estadoLocal = "inicio";

  enviarCita(); // Llamas la función externa

  return "⏳ Guardando tu cita... un momento por favor.";
}

  // --- Flujo cotización ---
  if (estadoLocal === "cotizar_detalle") {
    datosCita.proyecto = texto;
    estadoLocal = "cotizar_nombre";
    return "Perfecto. ¿Cuál es tu nombre completo?";
  }

  if (estadoLocal === "cotizar_nombre") {
    datosCita.nombre = texto;
    estadoLocal = "cotizar_correo";
    return `Gracias ${datosCita.nombre}. Ahora necesito tu correo electrónico.`;
  }

  if (estadoLocal === "cotizar_correo") {
    datosCita.correo = texto;
    datosCita.fecha = new Date().toLocaleString();
    estadoLocal = "inicio";
    return `📄 Cotización para "${datosCita.proyecto}" registrada. Te contactaré pronto, ${datosCita.nombre}.`;
  }

  return "¿Te gustaría agendar una cita, cotizar un servicio o ver mis proyectos?";
}

function enviarCita() {
  fetch("guardar_cita.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosCita)
  })
  .then(res => res.json()) // parsear como JSON
  .then(data => {
    console.log("Respuesta PHP:", data);
    if (data.success) {
      agregarMensaje("AxelBot", `📅 ¡Cita agendada tentativamente para: ${datosCita.fecha}! Te contactaré por WhatsApp para confirmarla.`);
      
      // Limpiar datos
      datosCita = {
        nombre: '',
        correo: '',
        proyecto: '',
        fecha: ''
      };
    } else {
      agregarMensaje("AxelBot", "❌ No se pudo guardar tu cita: " + data.msg);
    }
  })
  .catch(err => {
    console.error("Error al enviar cita:", err);
    agregarMensaje("AxelBot", "❌ Ocurrió un error al guardar tu cita. Intenta más tarde.");
  });
}

function mostrarGuardandoCita() {
  const contenedor = document.getElementById("botMessages");
  contenedor.innerHTML += `
    <div id="citaLoader" class="loader-card">
      <div><strong>AxelBot:</strong></div>
      <div class="loader-dots">
        <span></span><span></span><span></span>
      </div>
      <div>Guardando tu cita...</div>
    </div>`;
  contenedor.scrollTop = contenedor.scrollHeight;
}

function eliminarGuardandoCita() {
  const loader = document.getElementById("citaLoader");
  if (loader) loader.remove();
}
