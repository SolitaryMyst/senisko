#!/usr/bin/env bash
set -euo pipefail

# folders
mkdir -p senisko/apps/api/src
mkdir -p senisko/apps/web/pages
mkdir -p senisko/.github
cd senisko

######## root files ########
cat > .gitignore <<'EOF'
# Env
.env
.env.*
!**/.env.example

# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-lock.yaml
package-lock.json

# Next.js
.next/
out/
dist/
.cache/

# OS junk
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Logs
*.log
EOF

cat > docker-compose.yml <<'EOF'
services:
  caddy:
    image: caddy:latest
    ports: ["80:80", "443:443"]
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    depends_on: [web, api]
    restart: unless-stopped

  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    env_file: ./apps/web/.env.local
    expose: ["3000"]
    restart: unless-stopped

  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    env_file: ./apps/api/.env
    expose: ["4000"]
    restart: unless-stopped

volumes:
  caddy_data:
  caddy_config:
EOF

cat > Caddyfile <<'EOF'
senisko.com, www.senisko.com {
  reverse_proxy web:3000
}

api.senisko.com {
  reverse_proxy api:4000
}
EOF

######## API ########
cat > apps/api/package.json <<'EOF'
{
  "name": "api",
  "version": "1.0.0",
  "type": "module",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "helmet": "^7.1.0",
    "mongoose": "^8.5.1",
    "morgan": "^1.10.0"
  }
}
EOF

cat > apps/api/Dockerfile <<'EOF'
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm i --omit=dev
COPY src ./src
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "src/index.js"]
EOF

cat > apps/api/src/index.js <<'EOF'
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
// import mongoose from 'mongoose'; // enable when MONGODB_URI is set

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.get('/api/hello', (_req, res) => res.json({ msg: 'hi from api' }));

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    // if (process.env.MONGODB_URI) await mongoose.connect(process.env.MONGODB_URI);
    app.listen(PORT, () => console.log(`API listening on :${PORT}`));
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
}
start();
EOF

cat > apps/api/.env.example <<'EOF'
PORT=4000
# For Atlas:
# MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTERID.mongodb.net/app?retryWrites=true&w=majority
EOF

cp apps/api/.env.example apps/api/.env

######## WEB ########
cat > apps/web/package.json <<'EOF'
{
  "name": "web",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start -p 3000"
  },
  "dependencies": {
    "next": "^14.2.5",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
EOF

cat > apps/web/Dockerfile <<'EOF'
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci || npm i

FROM deps AS build
COPY . .
RUN npm run build

FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app ./
EXPOSE 3000
CMD ["npm", "start"]
EOF

cat > apps/web/next.config.js <<'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = { output: 'standalone' };
module.exports = nextConfig;
EOF

cat > apps/web/pages/index.js <<'EOF'
export default function Home() {
  return (
    <main style={{padding: 24, fontFamily: 'system-ui, sans-serif'}}>
      <h1>Senisko running</h1>
      <p>Frontend OK. API check: <code>https://api.senisko.com/health</code></p>
    </main>
  );
}
EOF

cat > apps/web/.env.local <<'EOF'
NEXT_PUBLIC_API_URL=https://api.senisko.com
EOF

echo "Scaffold complete."
echo "Next steps:"
echo "  cd senisko"
echo "  docker compose build && docker compose up -d"
echo "Check: https://senisko.com and https://api.senisko.com/health"
