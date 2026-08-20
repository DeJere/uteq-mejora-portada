# UTEQ — Prototipo de portada institucional

Propuesta de reorganizacion del menu principal de [uteq.edu.ec](https://www.uteq.edu.ec/),
basada en un estudio de usabilidad (DTPO-UTEQ, Relaciones Publicas).

🌐 **Demo:** https://uteq-mejora.netlify.app/

## Menu reorganizado (segun la propuesta)

Un unico menu de navegacion (se elimino la doble barra), con 6 secciones ordenadas
por prioridad segun la encuesta aplicada a 30 miembros de la comunidad universitaria
(26 jun – 11 jul 2026):

1. **Carreras** — 77% en P7, la seccion mas buscada al entrar (P5).
2. **Admision** — 50% en P7; boton "Postulate ahora" visible desde el primer pantallazo.
3. **Estudiantes** — tramites (47%) y vida estudiantil (30%): SGA, biblioteca, bienestar, becas.
4. **Investigacion** — produccion cientifica (23%) + vinculacion/convenios (33%).
5. **Noticias** — 30% de menciones en P7, con fechas y categorias reales.
6. **Contacto** — canal de atencion pedido en P11–P12; incluye "La Universidad"
   (autoridades, normativa, planificacion, identidad) para no perder ese contenido.

El Campus Virtual (SGA) queda como boton fijo y permanente en la cabecera. Las imagenes
de carreras y noticias se tomaron directamente de uteq.edu.ec (banners reales por carrera
y portadas reales de noticias), y todos los enlaces redirigen a las paginas correspondientes
del sitio oficial. Base del cambio: `Propuesta_Menu_UTEQ 1.pptx` (estudio DTPO-UTEQ).

## Estructura

| Archivo | Que es |
|---|---|
| `index.html` | Estructura de la pagina |
| `styles.css` | Estilos propios (lo que Tailwind no cubre) |
| `script.js` | Menus, carrusel, agenda, buscador, formulario, accesibilidad y chat |
| `assets/` | Imagenes reales y logo |
| `netlify/functions/chat.js` | Funcion serverless que conecta el chat con Groq (produccion) |
| `server.py` | Servidor local equivalente, para desarrollo |
| `netlify.toml` | Configuracion de despliegue |

**Framework de diseno:** Tailwind CSS (uno solo, por CDN). Pensado para portarse a React.

## El chatbot

Funciona en dos modos y cambia solo:

- **IA en linea** — hay backend disponible y responde el modelo `llama-3.3-70b-versatile` de Groq.
- **Modo local** — no hay backend; responde un motor de palabras clave incluido en `script.js`.

El encabezado del chat indica en cual de los dos esta. Asi el prototipo **nunca queda mudo**,
ni siquiera abriendo `index.html` con doble clic.

### Configurar la clave

> [!] La `GROQ_API_KEY` no esta en este repositorio y no debe estarlo.
> En una pagina estatica cualquiera podria leerla desde "ver codigo fuente".

**En Netlify (produccion)**
Site configuration → Environment variables → agregar `GROQ_API_KEY`.
Luego redesplegar el sitio.

**En local (desarrollo)**
```bash
cp .env.example .env      # y pon tu clave dentro
pip install -r requirements.txt
python server.py          # -> http://localhost:5000
```
`server.py` tambien busca el `.env` en carpetas superiores, o donde indique la
variable `UTEQ_ENV`.

## Accesibilidad

Correcciones aplicadas segun el reporte WAVE del estudio: todas las imagenes con `alt`,
sin enlaces vacios, jerarquia de encabezados correcta. Ademas incluye un panel flotante
con alto contraste, subrayado de enlaces y ajuste de tamano de texto.
