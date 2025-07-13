# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build production application  
- `npm run lint` - Run ESLint for code quality checks
- `npm test` - Run Jest test suite
- `npm test:watch` - Run tests in watch mode

### Database Operations
- `npx prisma generate` - Generate Prisma client after schema changes
- `npx prisma migrate dev` - Create and apply new database migration
- `npx prisma db seed` - Seed database with initial data using prisma/seed.ts
- `npx prisma studio` - Open Prisma Studio for database inspection

### Deployment
- `npm run vercel-build` - Production build command used by Vercel (includes Prisma setup)

## Architecture Overview

### Core Technology Stack
- **Framework**: Next.js 14 with App Router and TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth v5 (Auth.js) with JWT strategy and Prisma adapter
- **Real-time**: Pusher for live messaging and presence features
- **File Storage**: Cloudinary for image uploads and management
- **UI Components**: NextUI with Tailwind CSS
- **State Management**: Zustand for client-side state
- **Validation**: Zod schemas with React Hook Form

### Database Schema
Key models include:
- `User` - Authentication and basic user data with role-based access (ADMIN/MEMBER)
- `Member` - Extended profile information linked to User
- `Photo` - User photos with approval system (`isApproved` field)
- `Like` - Many-to-many relationship for user likes
- `Message` - Chat messages with read status and soft deletion
- `Token` - Email verification and password reset tokens

### Authentication Flow
- JWT-based sessions with NextAuth
- Email verification required before login
- Profile completion step after registration (`profileComplete` field)
- Role-based routing (admin routes protected in middleware)
- Middleware handles auth redirects and profile completion enforcement

### App Structure
- `/src/app/(auth)/` - Authentication pages (login, register, verify-email, etc.)
- `/src/app/members/` - Member browsing and profile management
- `/src/app/messages/` - Real-time messaging interface
- `/src/app/actions/` - Server actions for data mutations
- `/src/hooks/` - Custom React hooks for state management
- `/src/lib/` - Utilities, schemas, and service configurations

### State Management
- **Zustand stores**:
  - `usePresenceStore` - Track online members
  - `useMessageStore` - Message state management
  - `useFilterStore` - Member filtering
  - `usePaginationStore` - Pagination state

### Real-time Features
- Pusher integration for live messaging
- Presence channels to show online users
- Real-time message delivery and read receipts

### File Upload System
- Cloudinary integration for image storage
- Photo approval workflow for admin moderation
- Secure image signing via API routes

### Testing
- Jest with React Testing Library
- Unit tests in `/src/lib/__tests__/`
- Test configuration supports TypeScript

## Key Patterns

### Server Actions
All data mutations use Next.js server actions in `/src/app/actions/`:
- Return `ActionResult<T>` type for consistent error handling
- Use Zod validation before database operations
- Handle authentication within action functions

### Route Protection
- Middleware (`/src/middleware.ts`) handles all route protection
- Public routes defined in `/src/routes.ts`
- Profile completion enforcement for authenticated users
- Admin-only route protection

### Form Handling
- React Hook Form with Zod validation
- Centralized schemas in `/src/lib/schemas/`
- Consistent error display using `ResultMessage` component

### Image Management
- All user photos require admin approval
- Cloudinary URLs with transformation parameters
- Secure upload signatures generated server-side

## Environment Setup
Requires these environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- NextAuth configuration variables
- Pusher API credentials
- Cloudinary configuration
- Email service credentials (Resend)