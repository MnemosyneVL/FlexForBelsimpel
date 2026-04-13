# Node.js container for the React Router v7 frontend.
#
# This runs the Vite dev server with SSR (server-side rendering).
# SSR means the server generates the HTML before sending it to the browser,
# so users see content immediately instead of a blank page with a spinner.
#
# Why Node 20 LTS?
#   - Long Term Support = stable and maintained until April 2026
#   - React Router v7 requires Node 18+

FROM node:20-alpine

WORKDIR /app

# Copy package files first (Docker caching trick).
# If package.json hasn't changed, Docker reuses the cached npm install layer
# instead of reinstalling everything — saves minutes on rebuilds.
COPY frontend/package*.json ./

RUN npm install

# Copy the rest of the frontend application code
COPY frontend/ .

# Port 3000: React Router v7 dev server
# Port 6006: Storybook component library
EXPOSE 3000 6006

# Start the React Router v7 development server
CMD ["npm", "run", "dev"]
