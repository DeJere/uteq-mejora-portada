# Prototipo portada UTEQ

## Que es cada archivo
- `index.html` — estructura de la pagina (HTML).
- `styles.css` — estilos propios del prototipo.
- `script.js` — toda la interaccion (menus, carrusel, agenda, buscador, chat).
- `server.py` — servidor: sirve la pagina y conecta el chat con Groq.
- `requirements.txt` — librerias que necesita `server.py`.
- `assets/` — imagenes y logo.

Framework de diseno: **Tailwind CSS** (uno solo, por CDN). Portable a React.

## Como abrirlo

**Opcion A — solo ver la pagina (rapido)**
Doble clic en `index.html`. Todo funciona menos el chat con IA:
el chat responde con el motor local de palabras clave.

**Opcion B — con el chatbot de Groq (completo)**
```
pip install -r requirements.txt
python server.py
```
Luego abrir http://localhost:5000

El servidor busca automaticamente tu archivo `.env` (el que ya tienes en
`Downloads/Proto UTEQ/.env`) y de ahi lee `GROQ_API_KEY`.

## Importante sobre la clave
La `GROQ_API_KEY` **nunca** se escribe en el HTML ni en el JavaScript.
Si estuviera ahi, cualquier persona que abra la pagina podria verla y usarla.
Por eso vive solo en `.env`, del lado del servidor.

Cuando el chat esta conectado a la IA, el encabezado del chat dice
"IA en linea". Si el servidor no esta corriendo, dice "modo local".
