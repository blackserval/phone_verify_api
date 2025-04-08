FROM node:18-alpine

# Cria usuário não-root
RUN addgroup -g 1001 appgroup && adduser -D -u 1001 -G appgroup appuser

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Muda o dono da pasta
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000
CMD ["npm", "start"]
