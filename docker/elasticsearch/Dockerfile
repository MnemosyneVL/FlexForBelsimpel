# Elasticsearch 8.12 — the search engine behind phone/plan search.
#
# We use a custom Dockerfile instead of just the image because we need to
# set specific environment variables and potentially install plugins later.
#
# Key settings:
#   - single-node: we don't need a cluster for development
#   - security disabled: no username/password needed in dev
#   - 256MB heap: keeps memory usage reasonable on a dev machine

FROM elasticsearch:8.12.0

# These can also be set in docker-compose.yml, but having them here
# documents the expected configuration for this service.
ENV discovery.type=single-node
ENV xpack.security.enabled=false
ENV ES_JAVA_OPTS="-Xms256m -Xmx256m"
