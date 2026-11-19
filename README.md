# Flora Frontend

Flora is a plant-care app. Create an account, add your plants, set up recurring care tasks such as watering and fertilizing, see what is due on your dashboard, and mark tasks as done. You can also keep a care log and a health log per plant, upload plant images and browse a plant library.

Live app: https://frontendflora-e0a0bxe6g2ggdkcc.norwayeast-01.azurewebsites.net/

Built with React, TypeScript, Vite, Tailwind CSS and shadcn/ui. Backend: [FloraBackend](https://github.com/CountKrakula/FloraBackend).

## Run it locally

You need [Node.js](https://nodejs.org/) 24 and the Flora backend running locally (see its README).

```bash
git clone https://github.com/CountKrakula/FloraFrontend.git
cd FloraFrontend
npm install
npm run dev
```

Open the address Vite prints, normally `http://localhost:5173`. Start the backend first with `dotnet run --launch-profile https`, so the API is available at `https://localhost:7064`.

The backend's `Frontend_Domain` setting must match the address you open the frontend on, otherwise the browser blocks the API calls (CORS).

## Environment variables

| Variable | Description | Development value |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Base URL of the backend API | `https://localhost:7064/` |

The values are in `.env.development` (used by `npm run dev`) and `.env.production` (used by `npm run build`, pointing to the deployed backend). Don't put secrets in these files, because everything in a Vite build is visible in the browser.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Deployment

A push to `main` builds the app and deploys it to Azure with GitHub Actions. There is no automated test suite in the frontend yet.