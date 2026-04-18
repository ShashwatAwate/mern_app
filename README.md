# Simple MERN App – EC2 Deployment Guide

## Project Overview

This is a minimal MERN stack application:

* **MongoDB Atlas** – Database
* **Express.js + Node.js** – Backend API
* **React.js** – Frontend
* **Nginx** – Serves frontend and proxies API
* **PM2** – Keeps backend running

---

# 1. Launch EC2 Instance

Use:

* Ubuntu 22.04
* t2.micro / free tier eligible

### Security Group Rules

Allow:

* SSH (22) → My IP
* HTTP (80) → Anywhere

---

# 2. Connect to EC2

```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

---

# 3. Install Required Software

```bash
sudo apt update
sudo apt install git nginx -y

curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install nodejs -y

sudo npm install -g pm2
```

---

# 4. Clone Repository

## Public Repo

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

## Private Repo (SSH)

```bash
git clone git@github.com:YOUR_USERNAME/YOUR_REPO.git
```

---

# 5. Setup Backend

```bash
cd YOUR_REPO/backend
npm install
```

Create `.env`

```bash
nano .env
```

Add:

```env
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
```

Start backend:

```bash
pm2 start server.js --name backend
pm2 save
```

Check:

```bash
pm2 status
```

---

# 6. Setup Frontend

```bash
cd ../frontend
npm install
npm run build
```

Copy build files:

```bash
sudo cp -r build/* /var/www/html/
```

---

# 7. Configure Nginx Reverse Proxy

Open config:

```bash
sudo nano /etc/nginx/sites-available/default
```

Replace contents with:

```nginx
server {
    listen 80;
    server_name _;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:5000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Save and restart:

```bash
sudo systemctl restart nginx
```

---

# 8. Open in Browser

Visit:

```text
http://YOUR_EC2_PUBLIC_IP
```

You should see the frontend and message fetched from backend.

---

# Useful Commands

## Restart backend

```bash
pm2 restart backend
```

## View logs

```bash
pm2 logs backend
```

## Restart Nginx

```bash
sudo systemctl restart nginx
```

---

# Common Issues

## Frontend shows Error Fetching Data

* Check backend is running:

```bash
pm2 status
```

* Check API directly:

```bash
curl http://localhost:5000/api/message
```

## Nginx not serving page

```bash
sudo systemctl status nginx
```

---

# Final Result

A React frontend hosted on EC2 that fetches data from an Express API connected to MongoDB Atlas.
