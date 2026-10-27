FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

# Cai thu vien truoc de tan dung cache cua Docker
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Cong mac dinh; Render se truyen bien PORT luc chay
EXPOSE 5000

# Chay bang user khong co quyen root
USER node

# Bien moi truong (MONGODB_URI, PORT) duoc truyen luc chay container,
# KHONG ghi thong tin xac thuc trong Dockerfile
CMD ["node", "server.js"]
