# Nginx_Demo
Mistakes Made
Service name typo

You wrote user-serivce instead of user-service in both docker-compose.yml and nginx.conf.

Result: NGINX couldn’t resolve the upstream host → container crash.

Wrong path in requests

You tested with /user but your Express app only defines /users.

Result: Express responds with Cannot GET / or 404.

Proxy path mismatch

In NGINX, you had:

nginx
location /users {
    proxy_pass http://user-service:8081/;
}
This strips /users when forwarding, so the service receives / instead of /users.

Result: Express sees / → “Cannot GET /”.

Config not mounted correctly at first

NGINX was serving static files from /etc/nginx/html because your custom config wasn’t loaded.

Result: 404 from NGINX itself.

No root route in services

Your Express apps didn’t define app.get('/').

Result: hitting http://localhost:8080/ gave “Cannot GET /”.

✅ Correct Setup
docker-compose.yml

yaml
services:
  nginx:
    image: nginx:latest
    ports:
      - "8080:80"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
    depends_on:
      - user-service
      - order-service

  user-service:
    build: ./user-service

  order-service:
    build: ./order-service
nginx/conf.d/api-gateway.conf

nginx
server {
    listen 80;

    location /users {
        proxy_pass http://user-service:8081/users;
    }

    location /orders {
        proxy_pass http://order-service:8082/orders;
    }
}
user-service/index.js

js
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send("User Service alive"));
app.get('/users', (req, res) => res.json({ message: "User service response" }));

app.listen(8081, () => console.log("User Service running on port 8081"));
order-service/index.js

js
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send("Order Service alive"));
app.get('/orders', (req, res) => res.json({ message: "Order service response" }));

app.listen(8082, () => console.log("Order Service running on port 8082"));
🔹 Next Steps
Fix typos (user-service everywhere).

Update NGINX proxy_pass to include /users and /orders.

Add root routes in both services for health checks.

Rebuild and run:

bash
docker-compose down
docker-compose up --build
Test:

bash
curl http://localhost:8080/users
curl http://localhost:8080/orders
curl http://localhost:8080/
