# Production Dockerfile for Next.js frontend
FROM node:18-alpine as base
WORKDIR /app
COPY frontend/package.json ./
COPY frontend/package-lock.json ./
RUN npm install --production=false
COPY frontend/. ./

RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
