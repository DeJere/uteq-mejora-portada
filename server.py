# -*- coding: utf-8 -*-
"""
Servidor del prototipo UTEQ.

Hace dos cosas:
  1. Sirve el sitio estatico (index.html, styles.css, script.js, assets/).
  2. Expone POST /api/chat, que consulta el modelo de Groq usando la clave
     que ya tienes en tu archivo .env  (GROQ_API_KEY).

La clave NUNCA se escribe en el HTML ni en el JavaScript: se queda aqui,
en el servidor. Por eso el chat necesita este proceso corriendo.

Uso:
    pip install -r requirements.txt
    python server.py
    -> abrir http://localhost:5000
"""
import os
from pathlib import Path

from flask import Flask, request, jsonify, send_from_directory
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent

# Busca el .env en varios lugares, en orden:
#   1. La variable de entorno UTEQ_ENV, si la definiste a mano.
#   2. Esta carpeta y todas las carpetas superiores.
#   3. Ubicaciones conocidas del proyecto (el .env quedo en Descargas
#      cuando la boveda se movio al Escritorio).
def buscar_env():
    manual = os.getenv("UTEQ_ENV")
    if manual and Path(manual).is_file():
        yield Path(manual)
    for carpeta in [BASE_DIR, *BASE_DIR.parents]:
        yield carpeta / ".env"
    casa = Path.home()
    for conocida in (
        casa / "Downloads" / "Proto UTEQ" / ".env",
        casa / "Descargas" / "Proto UTEQ" / ".env",
        casa / "Desktop" / "obsidian" / ".env",
        casa / "Escritorio" / "obsidian" / ".env",
    ):
        yield conocida


for posible in buscar_env():
    if posible.is_file():
        load_dotenv(posible)
        print(f"[ok] .env cargado desde: {posible}")
        break
else:
    print("[aviso] no se encontro ningun .env; el chat respondera en modo local.")
    print("        Puedes indicarlo a mano:  set UTEQ_ENV=C:\\ruta\\a\\.env")

MODELO = "llama-3.3-70b-versatile"

CONTEXTO = """Eres el asistente virtual del sitio web institucional de la
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
- Orienta al usuario indicandole en que seccion del sitio esta lo que busca.
"""

app = Flask(__name__, static_folder=None)

_llm = None
_error_llm = None


def obtener_llm():
    """Crea el cliente de Groq una sola vez."""
    global _llm, _error_llm
    if _llm is not None or _error_llm is not None:
        return _llm
    if not os.getenv("GROQ_API_KEY"):
        _error_llm = "falta GROQ_API_KEY"
        return None
    try:
        from langchain_groq import ChatGroq
        _llm = ChatGroq(model=MODELO, temperature=0.3, max_tokens=400)
    except Exception as exc:                      # noqa: BLE001
        _error_llm = str(exc)
        print(f"[error] no se pudo iniciar el modelo: {exc}")
    return _llm


@app.post("/api/chat")
def chat():
    datos = request.get_json(silent=True) or {}
    mensaje = (datos.get("message") or "").strip()
    if not mensaje:
        return jsonify(error="mensaje vacio"), 400

    llm = obtener_llm()
    if llm is None:
        # 503 -> el navegador usa automaticamente el motor local de palabras clave
        return jsonify(error=f"modelo no disponible ({_error_llm})"), 503

    mensajes = [("system", CONTEXTO)]
    for turno in (datos.get("history") or [])[-6:]:
        rol = "human" if turno.get("role") == "user" else "ai"
        contenido = (turno.get("content") or "").strip()
        if contenido:
            mensajes.append((rol, contenido))
    mensajes.append(("human", mensaje))

    try:
        respuesta = llm.invoke(mensajes)
        return jsonify(reply=respuesta.content)
    except Exception as exc:                      # noqa: BLE001
        print(f"[error] fallo la consulta al modelo: {exc}")
        return jsonify(error=str(exc)), 503


@app.get("/")
def inicio():
    return send_from_directory(BASE_DIR, "index.html")


@app.get("/<path:recurso>")
def estaticos(recurso):
    return send_from_directory(BASE_DIR, recurso)


if __name__ == "__main__":
    print("Prototipo UTEQ -> http://localhost:5000")
    app.run(host="127.0.0.1", port=5000, debug=False)
