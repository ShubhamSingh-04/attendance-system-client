# AI Attendance System - Frontend

## Overview
This is a React + TypeScript + Vite frontend application for an AI-powered attendance management system. The application provides different dashboards for administrators, teachers, and students to manage and track attendance records.

## Project Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **UI Library**: Ant Design (antd)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context API

## Structure
- `/src/pages/` - Page components organized by role (admin, teacher, student)
- `/src/components/` - Reusable UI components
- `/src/api/` - API client functions for backend communication
- `/src/auth/` - Authentication context and logic
- `/src/layouts/` - Layout components for different user roles
- `/src/router/` - Application routing configuration
- `/src/theme/` - Theme provider and customization
- `/public/` - Static assets including service worker

## User Roles
1. **Admin** - Manages teachers, students, rooms, subjects, and classes
2. **Teacher** - Marks attendance, views records, and generates summaries
3. **Student** - Views personal attendance records and summaries

## Backend Integration
The frontend expects a backend API to be available. The application makes API calls to endpoints like:
- `/api/admin/*` - Admin operations
- `/api/teacher/*` - Teacher operations
- `/api/student/*` - Student operations

Note: This is a frontend-only repository. The backend is expected to be running separately (typically on a different server/port).

## Recent Changes

### Modern Design Overhaul (November 2025)
Complete redesign of the application with modern, cool aesthetics:
- **Global Styling**: Comprehensive CSS animations (fade, slide, float, glow, pulse, scale)
- **Color System**: Modern gradient palette (primary, secondary, accent, success, warm, cool)
- **Design Components**: Created reusable GradientCard, GlassCard, AnimatedStatistic, FloatingIcon, PageHeader
- **Layouts**: Fixed sidebars with responsive drawer behavior using Ant Design Grid breakpoints
- **Animations**: Floating icons, smooth transitions, hover effects, and animated statistics
- **Dark Mode**: Full dark mode support with optimized color tokens
- **Responsiveness**: Mobile-first design ensuring compatibility across all devices (PC, tablets, mobile)
- **Pages Redesigned**: Landing, Login, Admin Dashboard, Teacher Dashboard, Student Dashboard
- **Navigation**: Modern NavBar with segmented theme toggle and responsive label hiding

All API endpoints and business logic remain unchanged - only visual design was updated.

### Setup for Replit
- Configured Vite to run on port 5000 with host 0.0.0.0
- Added HMR configuration for Replit's proxy environment
- Removed backend proxy configuration (backend runs separately)
- Updated .gitignore for proper exclusions
- Created TypeScript environment definitions for Vite

## Development
- **Dev Server**: Runs on `0.0.0.0:5000`
- **Build Command**: `npm run build`
- **Preview**: `npm run preview`

## Features
- JWT-based authentication with token storage
- Role-based routing and access control
- Service worker for offline functionality
- Responsive UI with Ant Design components
- Real-time room streaming for attendance monitoring
