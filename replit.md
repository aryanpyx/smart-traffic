# Traffic Control System

## Overview

This is a real-time traffic management system that helps traffic authorities monitor and control urban traffic flow using AI-powered recommendations. The application provides a comprehensive dashboard for managing traffic junctions, viewing live traffic data, and applying AI-optimized signal timing adjustments.

The system consists of a React frontend built with modern UI components (shadcn/ui) and an Express.js backend that handles authentication, junction management, signal timing, AI recommendations, and traffic analytics. Real-time updates are delivered through WebSocket connections to keep the dashboard synchronized with live traffic conditions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for the main application framework
- **Vite** as the build tool and development server for fast hot reloading
- **shadcn/ui** component library built on Radix UI primitives for consistent, accessible UI components
- **TailwindCSS** for utility-first styling with custom CSS variables for theming
- **TanStack Query** for server state management, caching, and data synchronization
- **Wouter** as a lightweight routing solution for client-side navigation
- **Recharts** for data visualization and analytics charts

### Backend Architecture
- **Express.js** server with TypeScript for API endpoints and middleware
- **RESTful API** design with dedicated routes for authentication, junction management, AI recommendations, and analytics
- **WebSocket Server** using the `ws` library for real-time traffic updates and live dashboard synchronization
- **Middleware-based architecture** with request logging, error handling, and JSON parsing

### Data Storage Solutions
- **PostgreSQL** database with Neon serverless hosting for scalable cloud storage
- **Drizzle ORM** for type-safe database operations and schema management
- **Database schema** includes tables for users, traffic junctions, signal timings, AI recommendations, and traffic analytics
- **Session management** using PostgreSQL sessions with `connect-pg-simple`

### Authentication and Authorization
- **Username/password** authentication system with role-based access control
- **Session-based authentication** stored in PostgreSQL for persistence across server restarts
- **Local storage** for client-side user state management
- **Route protection** ensuring only authenticated users can access the dashboard

### External Dependencies
- **Neon Database** - Serverless PostgreSQL hosting platform for cloud database storage
- **WebSocket Protocol** - For real-time bidirectional communication between client and server
- **Google Fonts** - Typography resources (Inter, Architects Daughter, DM Sans, Fira Code, Geist Mono)
- **Radix UI Primitives** - Low-level accessible UI components for complex interactions
- **Lucide React** - Icon library for consistent visual elements throughout the application

The architecture supports real-time traffic monitoring with WebSocket connections broadcasting updates to all connected clients, AI-powered recommendations for signal timing optimization, and comprehensive analytics tracking for traffic flow analysis and system performance metrics.