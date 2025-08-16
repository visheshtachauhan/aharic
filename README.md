# Restaurant Menu Management System

A modern, full-stack restaurant management system built with Next.js, MongoDB, and NextAuth.js.

## Features

- 🔐 Secure authentication with NextAuth.js
- 📱 Responsive design for all devices
- 🍽️ Menu management with categories and items
- 📊 Real-time analytics dashboard
- 💳 Loyalty program management
- 🎯 QR code-based table ordering
- 📈 Sales and performance tracking
- 🔔 Real-time notifications
- 📱 Mobile-friendly interface

## Tech Stack

- **Frontend**: Next.js 14, React 18, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **Real-time**: Socket.IO
- **Styling**: TailwindCSS, Radix UI
- **Charts**: Recharts
- **Forms**: React Hook Form
- **Validation**: Zod
- **Notifications**: React Hot Toast
- **Animations**: Framer Motion

## Prerequisites

- Node.js 18+ and npm
- MongoDB instance
- Environment variables (see `.env.example`)

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd restaurant-menu-management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# MongoDB
MONGODB_URI=your_mongodb_uri

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Email (for password reset)
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your_email
EMAIL_SERVER_PASSWORD=your_password
EMAIL_FROM=noreply@example.com


# Twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

## Demo vs Production Modes

The system supports two operational modes controlled by the `NEXT_PUBLIC_DEMO_LOCKDOWN` environment variable:

### Demo Mode ON (`NEXT_PUBLIC_DEMO_LOCKDOWN=true`)
- **Owner Routes**: All `/owner/*` routes are accessible without authentication
- **Auth Pages**: Login/signup pages show demo messages and redirect to owner dashboard
- **Middleware**: Authentication checks are bypassed, all routes allowed
- **Use Case**: Perfect for demos, testing, and development

### Production Mode ON (`NEXT_PUBLIC_DEMO_LOCKDOWN=false`)
- **Owner Routes**: Protected by authentication, require valid user session
- **Auth Pages**: Full authentication system active
- **Middleware**: Full authentication and role-based access control
- **Use Case**: Production deployment with security

### Switching Modes
```bash
# Demo Mode
NEXT_PUBLIC_DEMO_LOCKDOWN=true

# Production Mode  
NEXT_PUBLIC_DEMO_LOCKDOWN=false
```

**Current Production Setting**: `NEXT_PUBLIC_DEMO_LOCKDOWN=true` (Demo mode active)

## Available Scripts

- `npm run dev`