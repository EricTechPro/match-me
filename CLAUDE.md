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

### Error Handling

**Standard Pattern**: All complex data-display components must be wrapped in ErrorBoundary to prevent crashes from breaking the entire page.

```typescript
import ErrorBoundary from "@/components/ErrorBoundary";
import ErrorFallback from "@/components/ErrorFallback";

// Standard usage
<ErrorBoundary>
  <MemberList />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary fallback={<ErrorFallback variant="minimal" />}>
  <ComplexComponent />
</ErrorBoundary>

// With error logging
<ErrorBoundary onError={(error, errorInfo) => logError(error)}>
  <CriticalComponent />
</ErrorBoundary>
```

**ErrorBoundary Features**:

- Automatic fallback UI with retry/refresh options
- Development mode error details
- Custom error handling callbacks
- Integration with NextUI design system

**ErrorFallback Variants**:

- `default` - Full error display with actions
- `minimal` - Compact inline error message
- `detailed` - Includes error stack trace in development

## Visual Development & Testing

### Design System

The project follows S-Tier SaaS design standards inspired by Stripe, Airbnb, and Linear. All UI development must adhere to:

- **Design Principles**: `/context/design-principles.md` - Comprehensive checklist for world-class UI
- **Component Library**: NextUI with custom Tailwind configuration

### Quick Visual Check

**IMMEDIATELY after implementing any front-end change:**

1. **Identify what changed** - Review the modified components/pages
2. **Navigate to affected pages** - Use `mcp__playwright__browser_navigate` to visit each changed view
3. **Verify design compliance** - Compare against `/context/design-principles.md`
4. **Validate feature implementation** - Ensure the change fulfills the user's specific request
5. **Check acceptance criteria** - Review any provided context files or requirements
6. **Capture evidence** - Take full page screenshot at desktop viewport (1440px) of each changed view
7. **Check for errors** - Run `mcp__playwright__browser_console_messages` ⚠️

This verification ensures changes meet design standards and user requirements.

### Comprehensive Design Review

For significant UI changes or before merging PRs, use the design review agent:

```bash
# Option 1: Use the slash command
/design-review

# Option 2: Invoke the agent directly
@agent-design-review
```

The design review agent will:

- Test all interactive states and user flows
- Verify responsiveness (desktop/tablet/mobile)
- Check accessibility (WCAG 2.1 AA compliance)
- Validate visual polish and consistency
- Test edge cases and error states
- Provide categorized feedback (Blockers/High/Medium/Nitpicks)

### Playwright MCP Integration

#### Essential Commands for UI Testing

```javascript
// Navigation & Screenshots
mcp__playwright__browser_navigate(url); // Navigate to page
mcp__playwright__browser_take_screenshot(); // Capture visual evidence
mcp__playwright__browser_resize(
  width,
  height
); // Test responsiveness

// Interaction Testing
mcp__playwright__browser_click(element); // Test clicks
mcp__playwright__browser_type(
  element,
  text
); // Test input
mcp__playwright__browser_hover(element); // Test hover states

// Validation
mcp__playwright__browser_console_messages(); // Check for errors
mcp__playwright__browser_snapshot(); // Accessibility check
mcp__playwright__browser_wait_for(
  text / element
); // Ensure loading
```

### Design Compliance Checklist

When implementing UI features, verify:

- [ ] **Visual Hierarchy**: Clear focus flow, appropriate spacing
- [ ] **Consistency**: Uses design tokens, follows patterns
- [ ] **Responsiveness**: Works on mobile (375px), tablet (768px), desktop (1440px)
- [ ] **Accessibility**: Keyboard navigable, proper contrast, semantic HTML
- [ ] **Performance**: Fast load times, smooth animations (150-300ms)
- [ ] **Error Handling**: Clear error states, helpful messages
- [ ] **Polish**: Micro-interactions, loading states, empty states

## When to Use Automated Visual Testing

### Use Quick Visual Check for:

- Every front-end change, no matter how small
- After implementing new components or features
- When modifying existing UI elements
- After fixing visual bugs
- Before committing UI changes

### Use Comprehensive Design Review for:

- Major feature implementations
- Before creating pull requests with UI changes
- When refactoring component architecture
- After significant design system updates
- When accessibility compliance is critical

### Skip Visual Testing for:

- Backend-only changes (API, database)
- Configuration file updates
- Documentation changes
- Test file modifications
- Non-visual utility functions

## Environment Setup

Requires these environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- NextAuth configuration variables
- Pusher API credentials
- Cloudinary configuration
- Email service credentials (Resend)

## Additional Context

- Design review agent configuration: `/.claude/agents/design-review-agent.md`
- Design principles checklist: `/context/design-principles.md`
- Custom slash commands: `/context/design-review-slash-command.md`
