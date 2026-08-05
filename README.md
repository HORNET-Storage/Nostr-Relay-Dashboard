![nostr Badge](https://img.shields.io/badge/nostr-8e30eb?style=flat) ![Go Badge](https://img.shields.io/badge/Go-00ADD8?logo=go&logoColor=white) ![React Badge](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black) ![TypeScript Badge](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) <img src="https://static.wixstatic.com/media/e9326a_3823e7e6a7e14488954bb312d11636da~mv2.png" height="20">

# Dashboard Panel for H.O.R.N.E.T Storage Nostr Relay

This repository is home to the hornet storage panel which is a typescript / react web application designed for managing a hornet storage nostr multimedia relay which can be found here: https://github.com/HORNET-Storage/HORNETS-Nostr-Relay

## ⚡ What You Need Before Starting

**Before installing, ensure you have:**
1. **A Nostr browser extension** ([Alby](https://getalby.com/), [nos2x](https://github.com/fiatjaf/nos2x), etc.) - **REQUIRED**
2. **Node.js 16+** and **yarn** installed
3. **The HORNETS relay service** running (see [here](https://github.com/HORNET-Storage/HORNETS-Nostr-Relay))

**Without these, the panel will not function.**

### Live Demo
We have a live demo that can be found at http://hornetstorage.net for anyone that wants to see what the panel looks like.

## Key Features
- Manage your hornet-storage relay config directly from the panel
- Switch between our new whitelist and blacklist model for accepting nostr notes
- Decide from which of the supported nostr kinds to enable
- Choose which supported transport protocols to enable such as libp2p and websockets
- Enable / disable which media extensions are accepted by the relay such as png and mp4
- View statistics about stored notes and media
- Upload relay icons with integrated Blossom server support

## 🔑 Important Prerequisites

### NIP-07 Browser Extension Required
**The HORNETS Relay Panel requires a NIP-07 compatible Nostr browser extension to function.**

You must install one of these browser extensions before using the panel:
- **[Alby](https://getalby.com/)** - Bitcoin Lightning & Nostr browser extension
- **[nos2x](https://github.com/fiatjaf/nos2x)** - Simple Nostr browser extension
- **[Flamingo](https://flamingo.me/)** - Nostr browser extension
- **[Horse](https://github.com/freakonometrics/horse)** - Nostr browser extension

The panel uses **NIP-07** ([window.nostr capability](https://nostr-nips.com/nip-07)) for:
- User authentication and login
- Event signing for relay configuration
- File uploads with cryptographic verification

**📖 Learn more about NIP-07**: [https://nostr-nips.com/nip-07](https://nostr-nips.com/nip-07)

## 🚀 Quick Start

**Essential steps to get running:**

1. **Install a NIP-07 browser extension** (required - see above)
2. **Install dependencies**: `npm install -g serve` and `yarn install` 
3. **Start frontend-only development**: `yarn start`
4. **For relay integration**: `yarn build`, copy `build/*` into the relay's `web/` directory, then start the relay

**For full deployment with reverse proxy, see the detailed setup guide below.**

## Previews
*All preview images are taken from the live demo*
<img width="1920" height="1080" alt="chrome_p5XlOEKb00" src="https://github.com/user-attachments/assets/3d542e0a-eeaf-4a8c-b0d8-db08d3db2a19" />
<img width="1920" height="1080" alt="chrome_z3VAUA75bj" src="https://github.com/user-attachments/assets/de9359ad-1cd7-4b6d-9293-febb1d68e9cf" />
<img width="1920" height="1080" alt="chrome_fTbkriaS8U" src="https://github.com/user-attachments/assets/fa84359a-c9fc-4dd4-9929-d937c3f3729f" />
<img width="1920" height="1080" alt="chrome_ZE5YBqXe7F" src="https://github.com/user-attachments/assets/c9199cf4-d4fe-4aaa-bc9d-732cfd59be85" />
<img width="1920" height="1080" alt="chrome_z3k8itABHU" src="https://github.com/user-attachments/assets/fad62f6f-8b40-4c60-938c-88f4a7342ae1" />
<img width="1920" height="1080" alt="chrome_YTqQuleVha" src="https://github.com/user-attachments/assets/f527d44d-fdb0-49b8-9b04-b219a11a5693" />



---

# 🏗️ Advanced Setup Guide

## Project Architecture

The HORNETS Relay Panel is built with a microservices architecture comprising:

### Integrated Architecture
The panel is now **integrated directly into the relay server** for simplified deployment:

- **Relay + Panel Server**: Port 9002 - Serves both the React app (static files) and panel API
- **[Relay WebSocket](https://github.com/HORNET-Storage/HORNETS-Nostr-Relay)**: Port 9001 - WebSocket service for Nostr relay functionality  
- **[Wallet Service](https://github.com/HORNET-Storage/Super-Neutrino-Wallet)**: Port 9003 - Backend service for wallet operations
- **[Media Moderation](https://github.com/HORNET-Storage/NestShield)**: Port 8000 - Content moderation and filtering service

### Hybrid Architecture
```
Client Request (http://localhost or your-domain.com)
     ↓
Nginx Proxy (Port 80/443) - Optional but recommended for production
     ↓
┌─────────────────────────────────────────────────────────┐
│  Route Distribution:                                    │
│  ┌─────────────────────────┐ ┌─────────────────────────┐ │
│  │ / → Relay + Panel       │ │ /wallet/ → Wallet API   │ │
│  │ (Port 9002)             │ │ (Port 9003)             │ │
│  │ ├── /api/* → Panel API  │ │                         │ │
│  │ └── /* → React App      │ │                         │ │
│  └─────────────────────────┘ └─────────────────────────┘ │
│                                                         │
│  WebSocket Connection:                                  │
│  ┌─────────────────────────┐                           │
│  │ ws:// → Relay WebSocket │                           │
│  │ (Port 9001)             │                           │
│  └─────────────────────────┘                           │
└─────────────────────────────────────────────────────────┘
```

## 🔧 Deployment Options

### Direct Access
For integrated testing, serve the panel build from the relay so browser requests and the panel API share one origin:
- **Relay + Panel**: `http://localhost:9002` (no proxy needed)
- **Standalone React dev server**: frontend-only unless a development proxy forwards API routes to the relay

### Nginx Proxy (Production Recommended)
For production deployment, nginx handles:
1. **Relay WebSocket Proxying**: `/relay` and `/relay/` → `localhost:9001` (strips prefix)
2. **Wallet Service Proxying**: `/wallet/*` → `localhost:9003`
3. **SSL Termination**: Single certificate for entire application
4. **WebSocket Proxying**: Proper upgrade headers for relay WebSocket
5. **Static Asset Caching**: Optimal performance for React app
6. **Security Headers**: CORS, CSP, and other protections

#### Complete Working Nginx Configuration
Here's a complete working nginx configuration for the HORNETS Relay Panel (tested on macOS and Linux):

```nginx
# Define upstream servers for each service (using explicit IPv4 addresses)
upstream transcribe_api {
    server 127.0.0.1:8000;
}

upstream relay_service {
    server 127.0.0.1:9001;
}

upstream panel_service {
    server 127.0.0.1:9002;
}

upstream wallet_service {
    server 127.0.0.1:9003;
}

# WebSocket connection upgrade mapping
map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}

# Main server block listening on HTTP
server {
    listen 80; # Nginx listens on port 80 locally
    server_name _; # Accept all hostnames (localhost, ngrok, custom domains, etc.)

    # Basic Security Headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    server_tokens off;

    # Increase buffer sizes for large files
    client_max_body_size 100M;

    # Forward client IP and protocol
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Host $host;

    # Health check endpoint - exact match first
    location = /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # Relay WebSocket service - handle both /relay and /relay/
    location ~ ^/relay/?$ {
        # Strip the /relay prefix (with or without trailing slash) when forwarding to the service
        rewrite ^/relay/?$ / break;
        
        proxy_pass http://relay_service;
        
        # WebSocket-specific headers
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Extended timeouts for WebSocket connections
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
        proxy_connect_timeout 60s;
        
        # Additional headers for tunnel compatibility
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Transcribe service
    location /transcribe/ {
        rewrite ^/transcribe/(.*)$ /$1 break;
        proxy_pass http://transcribe_api;
    }

    # Wallet service
    location /wallet/ {
        rewrite ^/wallet/(.*)$ /$1 break;
        proxy_pass http://wallet_service;
    }

    # Blossom file storage routes
    location /blossom/ {
        proxy_pass http://panel_service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Disable buffering for file uploads/downloads
        proxy_buffering off;
        proxy_request_buffering off;
        
        # Set appropriate headers
        proxy_set_header Accept-Encoding "";
        
        # Larger timeouts for file operations
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
        proxy_connect_timeout 60s;
    }

    # Default location - Panel service (frontend + API) - MUST BE LAST
    location / {
        # Add CORS headers for the panel service
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Origin, Content-Type, Accept, Authorization' always;

        # Handle preflight OPTIONS requests
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'Origin, Content-Type, Accept, Authorization';
            add_header 'Content-Length' 0;
            return 204;
        }

        proxy_pass http://panel_service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Handle WebSocket if needed
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
    }
}
```

**Key Configuration Details:**
- **Relay WebSocket**: Uses regex matching `^/relay/?$` to handle both `/relay` and `/relay/` paths
- **Rewrite Rule**: Strips the `/relay` prefix before forwarding to the relay service at port 9001
- **WebSocket Support**: Proper upgrade headers and extended timeouts for WebSocket connections
- **Service Routing**: Panel (root), wallet (`/wallet/`), transcribe (`/transcribe/`), and relay (`/relay`)
- **Security**: Basic security headers and proper client IP forwarding

**Deployment Steps:**
1. Save this configuration to `/etc/nginx/sites-available/hornets` (or `/opt/homebrew/etc/nginx/conf.d/hornets.conf` on macOS)
2. Enable the site: `sudo ln -s /etc/nginx/sites-available/hornets /etc/nginx/sites-enabled/`
3. Test configuration: `sudo nginx -t`
4. Reload nginx: `sudo nginx -s reload`

## 📋 Prerequisites

### Required Software
- [Node.js](https://nodejs.org/en/) version **>=16.0.0**
- [Yarn](https://yarnpkg.com/) package manager
- [Git](https://git-scm.com/) for version control
- **[serve](https://www.npmjs.com/package/serve)** for production builds: `npm install -g serve`

### Optional (For Production)
- [Nginx](https://nginx.org/) for reverse proxy *(Linux server configuration)*
- SSL certificate (Let's Encrypt recommended)
- Domain name

### Browser Requirements
- **NIP-07 compatible browser extension** (see Important Prerequisites section above)

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/HORNET-Storage/HORNETS-Relay-Panel.git
cd HORNETS-Relay-Panel
```

### 2. Install Dependencies
```bash
yarn install
```

### 3. Environment Configuration

The panel and relay API are same-origin. API and wallet origins are not configurable in the browser bundle; every request uses the origin that served the panel.

The environment files contain only non-origin build options:

```env
REACT_APP_ASSETS_BUCKET=http://localhost
REACT_APP_DEMO_MODE=false
REACT_APP_BASENAME=
PUBLIC_URL=/
ESLINT_NO_DEV_ERRORS=true
TSC_COMPILE_ON_ERROR=true
```


**🎯 Key Requirements**:
- ✅ **Wallet Always Available** - Wallet operations routed through panel API, no configuration needed
- ✅ **Panel Routing Auto-Detection** - Panel paths (REACT_APP_BASENAME/PUBLIC_URL) can be auto-detected
- ✅ **Simplified Configuration** - Uses default Nostr relay URLs, no custom configuration needed
- ✅ **Simple Deployment** - No reverse proxy needed for basic functionality

### 4. Start Development Server

#### Using provided script (recommended - handles Node.js compatibility)
```bash
./start-app.sh        # Linux/macOS
start.bat             # Windows
```

#### Using yarn directly
```bash
yarn start
```

The development server starts on `http://localhost:3000`. It is frontend-only unless a development proxy forwards API routes; use a relay-served production build for same-origin integration testing.

## 🚀 Deployment

### Production Deployment

#### Step 1: Build the Application
```bash
# Production build
yarn build

# Using provided script (handles Node.js compatibility)
./build.bat           # Windows
yarn build            # Linux/macOS
```

#### Step 2: Deploy to Relay Server
Copy the built files to your relay server's web directory and start the services:

```bash
# Copy build files to relay server web directory
cp -r build/* /path/to/relay/web/

# Start services (adjust ports as needed)
./relay-websocket-service &     # Port 9001
./relay-server-with-panel &     # Port 9002 (serves both API and panel)
./wallet-service &              # Port 9003
```

#### Step 3: Access the Panel
- **Panel**: `http://localhost:9002/` (or your configured domain)
- **Wallet Service**: `http://localhost:9003/` (direct access)
- **Relay WebSocket**: `ws://localhost:9001/` (WebSocket connection)

**✅ This setup works without any reverse proxy configuration!**

> **Note**: Reverse proxy setup with nginx is possible but currently requires additional configuration. The direct access method above is the recommended approach for most users.


## 🔧 Configuration Options

> **🚀 Major Improvement**: The panel now uses **dynamic URL detection** instead of hardcoded environment variables. This means **one build works everywhere** - no more environment-specific builds or complex URL configuration!

### REACT_APP_BASENAME
Controls the React app's routing base path:
- `` (empty) - App accessible at `https://domain.com/` (recommended for direct access)
- `/panel` - App accessible at `https://domain.com/panel/` (for reverse proxy setups)

**Note**: For the current working setup, leave this empty (`REACT_APP_BASENAME=`) since the panel is served from the root path.

### Service URLs

The panel API and wallet proxy are always contacted through the page origin. Deploy the static build in the relay's `web` directory and expose that relay origin directly or through a reverse proxy. No browser API endpoint configuration is required or supported.

### Demo Mode
Set `REACT_APP_DEMO_MODE=true` to enable demo functionality with mock data.

## 🐛 Troubleshooting

### Common Issues

#### 1. Node.js Compatibility
**Error**: `digital envelope routines::unsupported`
**Solution**: Scripts include `NODE_OPTIONS=--openssl-legacy-provider`

#### 2. Build Memory Issues
**Error**: `JavaScript heap out of memory`
**Solution**: Increase memory allocation:
```bash
export NODE_OPTIONS="--openssl-legacy-provider --max-old-space-size=4096"
```

#### 3. API Connection Issues

**Error**: Network errors, connection refusals, or unexpected API hosts

**Solution**: Verify that the relay web service is reachable at the same origin shown in the browser address bar. The deployed panel must be served by the relay (or a reverse proxy that forwards both the panel and API routes to it).

When replacing an older deployment, remove the destination `web` directory before copying the new build, then unregister the site's service worker and clear site data so an obsolete cached bundle cannot remain active.

#### 4. Routing Issues with Reverse Proxy
**Error**: 404 on refresh or direct URL access
**Solution**: Configure nginx to handle React Router:
```nginx
location /front/ {
    try_files $uri $uri/ /front/index.html;
}
```

#### 5. WebSocket Connection Failures
**Error**: WebSocket connection refused
**Solution**: Ensure proper WebSocket configuration in nginx:
```nginx
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection $connection_upgrade;
```

### Service Dependencies
Start services in this order:
1. Relay Service (Port 9001) - Core WebSocket functionality
2. Panel API (Port 9002) - Main backend
3. Wallet Service (Port 9003) - Payment processing
4. Media Moderation (Port 8000) - Content filtering (optional)
5. Frontend (Port 3000) - User interface

### Health Checks
- Nginx health: `curl http://localhost/health`
- Individual services: `curl http://localhost:PORT/health`

## 📚 Development vs Production

### Development
- Hot reloading enabled
- Source maps included
- Verbose error messages
- API requests remain same-origin; a standalone dev server needs an API proxy for integration testing

### Production
- Optimized builds with minification
- Source maps excluded
- Error boundaries for user-friendly errors
- Same-origin API calls served directly by the relay or forwarded with the panel through one reverse-proxy origin

## 🔒 Security Considerations

### Production Security
- Use HTTPS in production
- Configure proper CORS policies
- Implement rate limiting
- Regular security headers via nginx
- Keep dependencies updated

### Environment Variables
- Never commit `.env.production` to version control
- Use secure random values for secrets
- Regularly rotate API keys and tokens

---

## Developer Information

### Basic Development Commands

Development mode
```
yarn install && yarn start
```

Production mode
```
yarn install && yarn build
```

*.bat and .sh files are included for starting the panel in dev mode and for creating a production build if needed*

#### Requirements
- [Node.js](https://nodejs.org/en/) version _>=16.0.0_
- [yarn](https://yarnpkg.com/)
- [git](https://git-scm.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- 🐜 This panel relies heavily on the [Ant Design](https://ant.design/) component library with some modifications
- Based on the [Lightence](https://github.com/altence/lightence-ant-design-react-template) template
- Part of the HORNETS Storage ecosystem

### Credit
This panel was created using the lightence template which can be found [here](https://github.com/altence/lightence-ant-design-react-template)

## 📞 Support

For issues and support:
- GitHub Issues: Report bugs and request features
- Community: Join our discussions
- Documentation: Check the wiki for detailed guides

---

**Note**: This panel is designed to work with the HORNETS Storage ecosystem:
- **[HORNETS Nostr Relay](https://github.com/HORNET-Storage/HORNETS-Nostr-Relay)** - Core relay service (required)
- **[Super Neutrino Wallet](https://github.com/HORNET-Storage/Super-Neutrino-Wallet)** - Payment processing (required for paid features)
- **[NestShield](https://github.com/HORNET-Storage/NestShield)** - Media moderation service (optional)

Ensure you have at minimum the relay service running for basic functionality.
