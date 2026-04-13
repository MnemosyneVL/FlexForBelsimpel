# PHP-FPM with all extensions needed for the Belsimpel stack.
#
# This container runs TWO processes via supervisord:
#   1. php-fpm — handles HTTP requests forwarded by Nginx
#   2. queue worker — processes async jobs from RabbitMQ
#
# Why php:8.3-fpm-alpine?
#   - Alpine is a tiny Linux distro (~5MB), keeping the image small
#   - FPM (FastCGI Process Manager) is the standard way to run PHP behind Nginx

FROM php:8.3-fpm-alpine

# Install system libraries that PHP extensions need to compile against.
# Each line comment explains which PHP extension needs it.
RUN apk add --no-cache \
    # For supervisord (runs both php-fpm and queue worker)
    supervisor \
    # For pdo_mysql extension (MariaDB connection)
    mariadb-client \
    # For GD image processing (if needed for phone images)
    libpng-dev libjpeg-turbo-dev \
    # For zip extension (Composer needs it)
    libzip-dev \
    # For sockets extension (RabbitMQ AMQP protocol uses raw sockets)
    linux-headers

# Install PHP extensions one by one so it's clear what each is for.
RUN docker-php-ext-install \
    # PDO MySQL driver — lets PHP talk to MariaDB
    pdo_mysql \
    # Process Control — needed for Laravel's queue worker to handle signals gracefully
    pcntl \
    # Sockets — required by the RabbitMQ client (AMQP protocol)
    sockets \
    # BCMath — precise decimal math for price calculations (€19.99 + €5.50)
    bcmath \
    # Zip — Composer uses this to extract downloaded packages
    zip

# Install Redis PHP extension from PECL (PHP Extension Community Library).
# This lets Laravel use Redis for caching and sessions.
RUN apk add --no-cache autoconf g++ make \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del autoconf g++ make

# Copy Composer from the official Composer image.
# This is a multi-stage build trick — instead of installing Composer manually,
# we just copy the binary from an image that already has it.
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set up supervisord to manage our two processes.
# Copy config files from the docker/php directory
COPY docker/php/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Custom PHP settings for development
COPY docker/php/php.ini /usr/local/etc/php/conf.d/custom.ini

# Create log directory for supervisord
RUN mkdir -p /var/log/supervisor

WORKDIR /var/www/html

# Copy backend code into the image (for production builds).
# In development, docker-compose mounts ./backend as a volume instead.
COPY backend/ .

# Supervisord starts both php-fpm and the queue worker
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
