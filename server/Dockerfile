FROM node:22.18.0-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:22.18.0-bookworm-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
RUN mkdir /app/data && chown node:node /app/data
USER node
EXPOSE 8788
CMD ["node", "dist/main.js"]

FROM build AS test
COPY test ./test
CMD ["npm", "test"]
