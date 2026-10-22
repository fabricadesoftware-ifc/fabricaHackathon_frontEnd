# Build do front (Vue + Vite) e entrega estática com nginx.
# A URL da API é lida em tempo de execução (variável VITE_API_URL do container),
# então não é preciso rebuildar a imagem para trocar de ambiente.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx vite build

FROM nginx:1.27-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY deploy/40-config.sh /docker-entrypoint.d/40-config.sh
RUN chmod +x /docker-entrypoint.d/40-config.sh
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 5000
