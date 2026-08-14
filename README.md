# Chat con IA — React + Vite

Aplicación de chat con inteligencia artificial que transmite las respuestas en tiempo real (streaming). Es un ejercicio práctico de React construido con TypeScript y Vite, que integra el SDK de OpenAI (compatible con OpenRouter) y sigue una arquitectura de tres capas.

## ¿De qué va el proyecto?

Es un clon funcional de un asistente conversacional estilo ChatGPT donde puedes:

- Enviar mensajes y recibir respuestas de la IA **token a token** (streaming en vivo).
- **Detener** la generación en cualquier momento con un botón.
- Ver indicadores de escritura (puntitos animados) mientras la IA responde.
- Leer las respuestas con **formato Markdown** completo: listas, tablas, código resaltado, etc.
- Cambiar entre **tema claro y oscuro** con un switch sol/luna.
- Disfrutar de una experiencia pulida: scroll automático inteligente, burbujas por rol, pantalla de bienvenida con sugerencias.

La clave de la API **nunca se expone en el frontend**: vive en el servidor, por lo que la app se puede desplegar de forma segura en Vercel.

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Estado global | Zustand (chat) + Context API (configuración/usuario/tema) |
| Renderizado Markdown | react-markdown + remark-gfm + remark-breaks |
| Backend | Node HTTP nativo (middleware de Vite + handler serverless para Vercel) |
| IA | SDK oficial de OpenAI (compatible con OpenRouter) con `stream: true` |
| Estilos | CSS propio (App.css) |

## Implementaciones destacadas

### Arquitectura de 3 capas
- **UI** (`src/components/*`): renderiza y captura eventos, sin lógica de negocio ni `fetch`.
- **Estado global** (`src/store/chatStore.ts` con Zustand y `src/context/` con Context API): datos y acciones. Sin prop drilling.
- **Servicios** (`src/services/chatService.ts`): `streamChat()` puro, sin React, habla con la API.
- **Backend** (`server/chatCore.ts`, `server/chat.ts`, `api/chat.ts`): llama a la IA con `stream: true` y reenvía los tokens al cliente.

### Streaming de la IA
- El frontend lee `response.body` con `.getReader()` y un único `TextDecoder` reutilizado entre fragmentos.
- El backend recorre el stream de la API con `for await` y envía cada token con `TextEncoder`.
- **AbortController**: se aborta la petición tanto al pulsar "Detener" como al desmontar el componente. Los errores de aborto no se muestran como fallos reales.

### Seguridad
- La API key se lee solo en el servidor (`.env`, ignorado por git). No hay variables `VITE_*` expuestas al cliente.
- Cliente de OpenAI creado de forma **lazy** (por petición) para evitar fallos al construir si falta la key.
- **Protecciones del endpoint** `/api/chat`: rate limiting por IP, límites de tamaño de body, de mensajes y de caracteres, y un system prompt anti-prompt-injection.

### UX
- Loader con spinner, input deshabilitado y botón "Detener" mientras la IA procesa.
- Typing indicator con tres puntitos animados.
- Auto-scroll suave solo cuando el usuario está al fondo de la conversación.
- Burbujas diferenciadas por rol (usuario a la derecha, asistente a la izquierda).
- Bloques de código con etiqueta de lenguaje.

## Requisitos previos

- Node.js 18+ y npm.

## Instalación y uso

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno (backend)
cp .env.example .env
# Rellena solo uno de estos proveedores:
#   - Opción A (OpenAI): OPENAI_API_KEY=sk-... y OPENAI_MODEL=gpt-4o-mini
#   - Opción B (OpenRouter): OPENROUTER_API_KEY=sk-or-... y OPENAI_BASE_URL=https://openrouter.ai/api/v1

# Arrancar en desarrollo (incluye el endpoint /api/chat)
npm run dev
```

## Scripts

```bash
npm run dev        # Servidor de desarrollo (Vite + API de chat)
npm run build      # Compilar para producción
npm run preview    # Previsualizar el build
npm run lint       # ESLint
npm run typecheck  # TypeScript
```

## Despliegue en Vercel

1. Importa el repositorio en Vercel con framework **Vite** (build `vite build`, output `dist`).
2. En **Settings → Environment Variables** añade las variables del proveedor elegido (las mismas que en `.env`).
3. Despliega.

El handler serverless (`api/chat.ts`) queda autocontenido para que Vercel lo despliegue sin problemas.

## Estructura del proyecto

```
├── api/                 # Handler serverless para Vercel
├── server/              # Backend local (middleware de Vite)
│   ├── chat.ts          # Monta /api/chat en dev y preview
│   └── chatCore.ts      # Lógica del endpoint: validación, rate limit, streaming
├── src/
│   ├── components/      # UI: chat, header, input, mensajes, welcome...
│   ├── context/         # Context API: usuario y tema
│   ├── services/        # chatService.ts: streamChat()
│   ├── store/           # chatStore.ts: estado global con Zustand
│   └── types/           # Tipos compartidos
```