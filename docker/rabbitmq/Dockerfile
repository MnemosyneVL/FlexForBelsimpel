# RabbitMQ 3.13 with the management plugin enabled.
#
# The management plugin gives us a web dashboard at localhost:15672
# where you can see queues, messages, and consumers in real-time.
# Login with flex/secret (set in docker-compose.yml).
#
# Why RabbitMQ instead of using Redis for queues?
#   - Belsimpel specifically uses RabbitMQ in their stack
#   - RabbitMQ is a dedicated message broker with proper message persistence,
#     dead-letter exchanges, and routing — features Redis queues don't have
#   - Using both shows we understand when to use each tool

FROM rabbitmq:3.13-management-alpine
