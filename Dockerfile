FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["npm", "start"] 