# Nginx reverse proxy — the "front door" of the application.
#
# Every request from the browser hits Nginx first.
# Nginx decides where to send it based on the URL path:
#   /graphql or /graphiql → PHP-FPM (Laravel backend)
#   Everything else → Node.js (React frontend)

FROM nginx:1.25-alpine

# Replace the default Nginx config with ours
COPY default.conf /etc/nginx/conf.d/default.conf
