
set -euo pipefail

cd "$(dirname "$(realpath "$0")")"

echo "======================================"
echo "    MEDICLINIC DEVELOPMENT SERVER"
echo "======================================"

# START DOCKER

echo "[1/5] Starting MySQL and Redis..."

docker compose -f ../docker-compose.yml up -d --wait mysql redis

# DATABASE CONFIGURATION

echo "[2/5] Configuring database..."

export DB_PORT=$(docker compose \
    -f ../docker-compose.yml \
    port mysql 3306 | awk -F: '{print $NF}')

export DB_USERNAME=mediclinic

if [ -z "${DB_PASSWORD:-}" ]; then
    read -rsp "MySQL password: " DB_PASSWORD
    echo
fi

export DB_PASSWORD

# REDIS CONFIGURATION

echo "[3/5] Configuring Redis..."

export REDIS_HOST=127.0.0.1
export REDIS_PORT=6379

# JWT CONFIGURATION

echo "[4/5] Configuring JWT..."

SECRET_DIR="$HOME/.config/mediclinic"
SECRET_FILE="$SECRET_DIR/jwt-secret"

umask 077

mkdir -p "$SECRET_DIR"
chmod 700 "$SECRET_DIR"

if [ ! -s "$SECRET_FILE" ]; then

    echo "Generating JWT secret..."

    openssl rand -base64 32 > "$SECRET_FILE"

fi

chmod 600 "$SECRET_FILE"

export JWT_SECRET="$(cat "$SECRET_FILE")"

# APPLICATION CONFIGURATION

export ADMIN_EMAIL=admin@mediclinic.local
export APP_ORIGIN=http://127.0.0.1:5173

unset ADMIN_PASSWORD
unset ADMIN_NEW_PASSWORD

echo ""
echo "======================================"
echo "DB Port     : $DB_PORT"
echo "DB Username : $DB_USERNAME"
echo "Redis Host  : $REDIS_HOST"
echo "Redis Port  : $REDIS_PORT"
echo "JWT Length  : ${#JWT_SECRET}"
echo "Profile     : dev"
echo "======================================"
echo ""

# START SPRING BOOT

echo "[5/5] Starting Spring Boot..."

exec ./mvnw spring-boot:run \
    -Dspring-boot.run.profiles=dev
