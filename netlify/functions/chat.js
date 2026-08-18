// Funcion serverless de Netlify: conecta el chat del sitio con Groq.
//
// La clave NUNCA va en el repositorio. Se configura en Netlify:
//   Site configuration -> Environment variables -> GROQ_API_KEY
//
// Si la clave falta o Groq falla, se devuelve 503 y el navegador cae
// automaticamente al motor local de palabras clave (ver script.js).

const MODELO = "llama-3.3-70b-versatile";

const CONTEXTO = `Eres el asistente virtual del sitio web institucional de la
Universidad Tecnica Estatal de Quevedo (UTEQ), en Quevedo, provincia de Los Rios, Ecuador.

Datos verificados que puedes usar:
- Campus principal: Av. Walter Andrade Km 1.5 via a Santo Domingo, Quevedo, Los Rios, Ecuador.
- Contacto: relacionespublicas@uteq.edu.ec, telefono (05) 3-001-500.
- Sitio oficial: uteq.edu.ec | Biblioteca: biblioteca.uteq.edu.ec | Aula virtual/SGA: sga.uteq.edu.ec
- Revistas cientificas: revistas.uteq.edu.ec
- Cifras institucionales: 13.608 estudiantes, 39 carreras, 583 docentes,
  3.516 articulos publicados, 77 proyectos de investigacion, 372 libros publicados,
  121 convenios de vinculacion activos.
- Secciones del sitio: La UTEQ (autoridades, normativa, planificacion, identidad),
  Oferta academica (carreras, admision, posgrado, educacion continua),
  Investigacion, Vinculacion, Servicios (bienestar, biblioteca, aula virtual,
  transparencia) y Comunicacion (noticias, agenda, contacto).

Reglas:
- Responde SIEMPRE en espanol, en tono cordial e institucional.
- Se breve: maximo 4 frases, salvo que pidan detalle.
- Si no sabes un dato con certeza, dilo y sugiere escribir a
  relacionespublicas@uteq.edu.ec. No inventes fechas, costos ni requisitos.
- Orienta al usuario indicandole en que seccion del sitio esta lo que busca.`;

function json(statusCode, cuerpo) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(cuerpo),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "metodo no permitido" });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return json(503, { error: "falta GROQ_API_KEY en las variables de entorno" });

  let datos;
  try {
    datos = JSON.parse(event.body || "{}");
  } catch (e) {
    return json(400, { error: "json invalido" });
  }

  const mensaje = String(datos.message || "").trim();
  if (!mensaje) return json(400, { error: "mensaje vacio" });

  const mensajes = [{ role: "system", content: CONTEXTO }];
  for (const turno of (datos.history || []).slice(-6)) {
    const contenido = String((turno && turno.content) || "").trim();
    if (contenido) {
      mensajes.push({
        role: turno.role === "user" ? "user" : "assistant",
        content: contenido,
      });
    }
  }
  mensajes.push({ role: "user", content: mensaje });

  try {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODELO,
        messages: mensajes,
        temperature: 0.3,
        max_tokens: 400,
      }),
    });

    if (!r.ok) {
      const detalle = await r.text();
      return json(503, { error: `groq respondio ${r.status}`, detalle: detalle.slice(0, 300) });
    }

    const d = await r.json();
    const reply =
      d && d.choices && d.choices[0] && d.choices[0].message
        ? String(d.choices[0].message.content || "").trim()
        : "";
    if (!reply) return json(503, { error: "respuesta vacia del modelo" });
    return json(200, { reply });
  } catch (e) {
    return json(503, { error: String((e && e.message) || e) });
  }
};
