# Stage 1: Build the Next.js application

FROM node:18 AS build

WORKDIR /app
 
# Copy package.json and install dependencies

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps
 
 
# Copy the rest of the application

COPY . ./
 
# Build the Next.js app

RUN npm run build
 
# Stage 2: Serve the Next.js app with Node.js (Not Apache)

FROM node:18 AS runner

WORKDIR /app
 
# Copy only the necessary build files

COPY --from=build /app/.next .next

COPY --from=build /app/public public

COPY --from=build /app/package.json package.json

COPY --from=build /app/node_modules node_modules
 
EXPOSE 80

ENV NAME World
 
CMD ["npm", "run", "start", "--", "--port", "80"]
 
