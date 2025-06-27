# Political Quiz Application

## Overview

This is a full-stack web application that provides a political orientation quiz for Korean users. The app presents users with balance questions (either/or choices) across different political categories, analyzes their responses using AI, and provides detailed political analysis results. The application is built with modern web technologies and focuses on user privacy by not collecting personal information.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ESM modules)
- **Database**: PostgreSQL with Drizzle ORM
- **Session Storage**: PostgreSQL database storage
- **AI Integration**: Google Gemini API for political analysis

### Database Schema
The application uses two main tables:
- `users`: Basic user authentication (currently unused)
- `quiz_results`: Stores quiz responses, demographics, scores, and AI analysis

## Key Components

### Quiz System
- **Questions**: 12 balance questions across categories (Economy/Welfare, Security/Foreign Policy, Social/Gender)
- **Scoring**: Left/right scoring system with normalized 0-100 scale
- **Categories**: Each question belongs to a political category with weighted scoring

### AI Analysis Service
- **Provider**: Google Gemini API
- **Analysis**: Generates personalized political orientation analysis in Korean
- **Context**: Incorporates user demographics, answer patterns, and category scores

### Results System
- **Political Labels**: Progressive, Center-Progressive, Center, Center-Conservative, Conservative
- **Category Breakdown**: Detailed scoring by political category
- **Sharing**: Session-based result sharing with unique URLs

### UI/UX Design
- **Mobile-First**: Responsive design optimized for mobile devices
- **Korean Language**: Full Korean localization
- **Progressive Disclosure**: Multi-step process (Landing → Demographics → Quiz → Loading → Results)

## Data Flow

1. **User Journey**: Landing page → Optional demographics → Quiz questions → AI analysis → Results display
2. **Data Storage**: Answers stored in sessionStorage during quiz, then sent to backend for analysis
3. **AI Processing**: Backend calls Gemini API with structured prompts for political analysis
4. **Result Persistence**: Analysis results stored with session ID for sharing capabilities

## External Dependencies

### Production Dependencies
- **Database**: Neon Database (PostgreSQL)
- **AI Service**: Google Gemini API
- **UI Components**: Radix UI primitives via shadcn/ui
- **Form Handling**: React Hook Form with Zod validation

### Development Tools
- **Build**: Vite with React plugin
- **Database Migration**: Drizzle Kit
- **Type Safety**: TypeScript with strict configuration
- **Code Quality**: ESLint integration via Vite

## Deployment Strategy

### Environment Configuration
- **Development**: Local development with hot reload via Vite
- **Production**: ESBuild bundling for server, Vite bundling for client
- **Database**: Environment-based DATABASE_URL configuration
- **API Keys**: Environment variables for Gemini API access

### Hosting Setup
- **Platform**: Configured for Replit deployment
- **Port Configuration**: Server runs on port 5000, external port 80
- **Static Assets**: Client build served from `/dist/public`
- **Database**: PostgreSQL 16 module in Replit environment

### Build Process
- **Client**: Vite builds React app to `dist/public`
- **Server**: ESBuild bundles Express server to `dist/index.js`
- **Deployment**: Automated build and start scripts for production

## Changelog

```
Changelog:
- June 27, 2025. Added PostgreSQL database integration
- June 26, 2025. Initial setup with Gemini AI integration
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```