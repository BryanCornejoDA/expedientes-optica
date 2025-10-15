# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Deploy en Vercel

Si desplegas el `client` en Vercel y tu API está en otro deploy de Vercel (por ejemplo `expedientes-optica-server`), agrega una variable de entorno en el panel de Vercel llamada `VITE_API_URL` apuntando a la URL del servidor (por ejemplo `https://expedientes-optica-server.vercel.app`).

Pasos rápidos:

- En el proyecto `client` en Vercel, abre Settings → Environment Variables.
- Añade `VITE_API_URL` con valor `https://tu-deploy-server.vercel.app`.
- Redeploy del proyecto `client`.

Nota: en desarrollo local este proyecto usa `/api` como fallback para que puedas usar un proxy si corres el server localmente.

Además, si no defines `VITE_API_URL`, la app por defecto apunta a la API en Render:

`https://expedientes-optica.onrender.com/api`

Para usar otro servidor, establece `VITE_API_URL` en las Environment Variables del hosting o en tu `.env` local.
