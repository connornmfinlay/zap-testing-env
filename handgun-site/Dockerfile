# ---- build stage ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci || npm i
COPY . .
RUN npm run build

# ---- runtime stage ----
FROM nginx:alpine
# replace the default server block with ours
COPY nginx.default.conf /etc/nginx/conf.d/default.conf
# copy the static build
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
# simple healthcheck
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
