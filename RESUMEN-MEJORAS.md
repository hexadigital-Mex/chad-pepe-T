# Resumen de mejoras y soluciones — 2026-08-11

Proyecto: Chat con React + TypeScript + Vite + streaming de IA.

---

## 1. Arquitectura de 3 capas (refactor completo)

Estado final del proyecto, separado en capas:

| Capa | Archivos | Responsabilidad |
|---|---|---|
| UI | `src/components/*` | Renderizar, capturar eventos. Sin lógica de negocio ni fetch. |
| Estado global | `src/store/chatStore.ts` (Zustand), `src/context/settings.ts` + `SettingsProvider.tsx` (Context) | Datos de la app y acciones que los modifican. |
| Servicios | `src/services/chatService.ts` | `streamChat()` puro, sin React, habla con la API. |
| Backend | `server/chatCore.ts`, `server/chat.ts`, `api/chat.ts` | Llama a OpenAI/OpenRouter con `stream: true` y reenvía tokens. |

- **Zustand** (`create<ChatStore>()`): estado `messages`, `isLoading`, `isStreaming`, `error`, `draft` + acciones `addUserMessage`, `updateLastAssistantMessage`, `sendMessage` (async, usa `get()`/`set()`), `stop`. Suscripción selectiva: un componente que solo lee `messages` no se re-renderiza cuando cambia `isLoading`.
- **Context API** para configuración que cambia poco: `user` y `theme` (toggle claro/oscuro aplica `data-theme='dark'`).
- **Sin prop drilling**: `MessageItem` recibe solo `id` y lee su mensaje del store; `MessageInput` lee `draft`/`isLoading` y llama `sendMessage` del store.

## 2. Conexión a la API con streaming

- **Capa de servicios** (`streamChat`) hace `fetch POST /api/chat`, lee `response.body` con `.getReader()`, `TextDecoder` creado UNA vez fuera del ciclo con `decode(value, { stream: true })` (crítico para emojis/tildes).
- **Backend**: `server/chat.ts` montado como middleware de Vite (`configureServer` + `configurePreviewServer`) para `npm run dev`. Usa el **SDK oficial de OpenAI** con `stream: true`, recorre con `for await`, extrae `chunk.choices[0]?.delta?.content` (`string | undefined`) y lo envía con `TextEncoder`.
- **AbortController**: se crea por request, se pasa `signal` al fetch, botón "Detener" llama `controller.abort()`, y al desmontar `ChatApp` se aborta la petición en vuelo. `AbortError` se captura y no se muestra como error real.

## 3. Seguridad: la API key NO está en el frontend

- La key se movió de variables `VITE_*` (que se exponían en el bundle del cliente) a variables de **servidor** en `.env` (`.gitignore`): `OPENAI_API_KEY`/`OPENROUTER_API_KEY`, `OPENAI_BASE_URL`, `OPENAI_MODEL`.
- `src/vite-env.d.ts` quedó sin variables `VITE_`.
- Causa real de un 401 persistente: la key tenía un **espacio inicial** (` sk-or-v1-...`), que rompía el header `Authorization`. Se corrigió recortando espacios.

## 4. UX profesional

- **Loader**: `isLoading` + spinner en el botón, input deshabilitado, texto "La IA está procesando tu mensaje..." y botón "Detener". Sin silencio visual.
- **Typing indicator**: `isStreaming`. Se agrega un mensaje temporal del asistente con `content: ""` al historial; los tokens se anexan con actualización funcional (`updateLastAssistantMessage`). Se muestran **3 puntitos animados** (estilo WhatsApp/iMessage) cuando el último mensaje del asistente está vacío o muy corto, con desvanecido suave al llegar texto.
- **Historial tipado**: arreglo de `Message { id, role: 'user'|'assistant'|'system', content }`, se itera con `.map()` y `key={message.id}` (nunca el índice).
- **Auto-scroll inteligente**: `<div>` ancla con `useRef`, `scrollIntoView({ behavior: 'smooth' })`, y solo si el usuario estaba al fondo (`scrollTop + clientHeight >= scrollHeight - 50`).
- **Burbujas por role**: `message-user` (derecha) vs `message-assistant` (izquierda).
- **Formatting markdown** (`react-markdown` + `remark-gfm` + `remark-breaks`): párrafos, listas, tablas y **bloques de código encapsulados** con etiqueta de lenguaje (`.code-block`).
- **Pantalla de bienvenida** estilo ChatGPT: saludo con nombre (del Context), subtítulo y sugerencias **genéricas** (explicar conceptos, redactar correos, ideas, resumir textos) que envían el mensaje al hacer clic.
- **Header limpio**: se eliminó el botón/etiqueta de "Invitado" (sin función). El cambio de tema es ahora un **switch sol/luna** con knob deslizante: icono de sol con degradado naranja llamativo en tema claro y luna con degradado violeta/índigo en tema oscuro.

## 5. Despliegue en Vercel

### GitHub
```
git init
git add .
git commit -m "..."
git branch -M main
git remote add origin https://github.com/hexadigital-Mex/chad-pepe-T.git
git push -u origin main
```
El `.env` nunca se sube (`.gitignore`). Identidad git se configura con `git config --global user.name/user.email`.

### Vercel
1. Importar el repo → framework Vite (build `vite build`, output `dist`).
2. **Settings → Environment Variables** (entorno Production):
   - `OPENROUTER_API_KEY` = `sk-or-v1-...`
   - `OPENAI_BASE_URL` = `https://openrouter.ai/api/v1`
   - `OPENAI_MODEL` = `openai/gpt-4o-mini`
   - *(o equivalentes de OpenAI: `OPENAI_API_KEY`, `OPENAI_MODEL=gpt-4o-mini`)*
3. Redeploy.

### Errores de producción corregidos
| Error | Causa | Solución |
|---|---|---|
| `FUNCTION_INVOCATION_FAILED` | El SDK de OpenAI lanzaba AL CONSTRUIR el cliente si faltaba la key (se creaba al cargar el módulo) | Crear el cliente **lazily** (por request) y responder `500` claro si falta la key |
| `TS2835` / `Cannot find name 'process'/'Buffer'` | Vercel typechequea `api/` con config propia (`nodenext`, sin `@types/node`) | Build ahora es `vite build` (sin `tsc`); `api/chat.ts` autocontenido (sin imports relativos). Eran diagnostics no fatales (el build completaba y desplegaba) |

## Estado final

- `npm run typecheck` ✅
- `npm run lint` ✅
- `npm run build` ✅
- Streaming real verificado local y en el handler serverless (200 + tokens).
- Repo: https://github.com/hexadigital-Mex/chad-pepe-T — rama `main`.