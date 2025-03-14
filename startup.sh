# #!/bin/bash

# echo "changing dir to backend"
# cd backend
# echo "installing packages..."
# npm install
# echo "stoping docker containers..."
# docker-compose down
# echo "removing docker volumes..."
# docker volume rm backend_pgdata
# echo "starting docker containers..."
# docker-compose up --build

# echo "waiting for backend to start..."
# while ! curl -s -o /dev/null -w "%{http_code}" localhost:3000 | grep -qE "200|302"; do
#     sleep 0.1
# done

# echo "backend started"

# # echo "changing dir to frontend"
# # cd ../e-hotel
# # echo "installing packages..."
# # npm install
# # echo "Starting frontend..."
# # npm run dev
# # echo "frontend started"

#!/bin/bash

echo "Changing dir to backend"
if [ ! -d "backend" ]; then
    echo "Error: backend directory not found!"
    exit 1
fi
cd backend

echo "Installing packages..."
npm install

echo "Stopping docker containers..."
docker compose down

echo "Removing docker volumes..."
docker volume rm backend_pgdata || echo "Volume not found or in use"

echo "Starting docker containers..."
docker compose up --build -d  # Run in detached mode

echo "Waiting for backend to start..."
while true; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" localhost:3000)
    if [[ "$STATUS" == "200" || "$STATUS" == "302" ]]; then
        break
    fi
    sleep 0.1
done

echo "Backend started"

echo "Changing dir to frontend"
cd ../e-hotel
echo "Installing packages..."
npm install
echo "Starting frontend..."
npm run dev
echo "Frontend started"
