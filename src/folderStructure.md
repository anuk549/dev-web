# Project Directory Structure

This document describes the professional directory structure for the Dev+ Quote Builder project.

## Overview

The project follows a modular architecture with clear separation of concerns:

```
wed-dev/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Main page (uses components from src/components)
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── favicon.ico               # Site favicon
│   └── api/                      # API routes
│       ├── data/
│       ├── quotes/
│       └── quotes/[id]/
│
├── src/                          # Source code (main application logic)
│   ├── types/                    # TypeScript type definitions
│   │   └── quote.ts              # Quote builder types
│   │
│   ├── constants/                # Constants and configuration
│   │   ├── index.ts              # App constants (phone, steps, options)
│   │   └── translations.ts       # i18n translations (en/si)
│   │
│   ├── hooks/                    # Custom React hooks
│   │   └── useQuoteBuilder.ts    # Main quote builder state management
│   │
│   ├── components/               # React components
│   │   ├── index.ts              # Barrel export
│   │   │
│   │   ├── ui/                   # Reusable UI components
│   │   │   ├── index.ts
│   │   │   ├── ChoiceGrid.tsx    # Grid of selectable options
│   │   │   ├── ToggleCard.tsx    # Toggle switch card
│   │   │   ├── TextInput.tsx     # Styled text input
│   │   │   └── SelectBox.tsx     # Styled select dropdown
│   │   │
│   │   ├── CompilationOverlay.tsx # Compilation animation overlay
│   │   ├── WelcomeScreen.tsx     # Landing/welcome page
│   │   ├── SchemaEditor.tsx      # Database schema editor
│   │   ├── RelationsEditor.tsx   # Table relationships editor
│   │   ├── ContactStep.tsx       # Contact form & summary
│   │   ├── SummaryPanel.tsx      # Project summary sidebar
│   │   └── Sidebar.tsx           # Step navigation sidebar
│   │
│   ├── utils/                    # Utility functions
│   │   ├── quote-calculator.ts   # Quote calculation logic
│   │   └── pdf-generator.ts      # PDF generation utility
│   │
│   └── api/                      # API client functions (if needed)
│
├── lib/                          # Library configurations
│   └── firebase.ts               # Firebase configuration
│
├── public/                       # Static assets
│   ├── logo.jpg                  # Dev+ logo
│   ├── file.svg                  # Decorative SVGs
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── utils/                        # Legacy utilities (being migrated to src/utils)
│   └── supabase/
│
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── postcss.config.mjs            # PostCSS configuration
├── eslint.config.mjs             # ESLint configuration
├── middleware.ts                 # Next.js middleware
└── README.md                     # Project documentation
```

## Key Directories

### `src/types/`
Contains all TypeScript type definitions and interfaces used across the application.

### `src/constants/`
Centralized constants including:
- App configuration (phone numbers, step counts)
- Option lists (frontend, backend, database options)
- Translations for internationalization (English/Sinhala)

### `src/hooks/`
Custom React hooks that encapsulate reusable state logic:
- `useQuoteBuilder`: Main hook managing all quote builder state and actions

### `src/components/`
React components organized by purpose:
- `ui/`: Reusable UI components (buttons, inputs, cards)
- Page-specific components (WelcomeScreen, SchemaEditor, etc.)

### `src/utils/`
Pure utility functions:
- `quote-calculator.ts`: Pricing and quote calculation
- `pdf-generator.ts`: PDF document generation

## Benefits of This Structure

1. **Separation of Concerns**: Types, constants, components, and utilities are clearly separated
2. **Reusability**: Components and utilities can be easily reused
3. **Maintainability**: Changes are localized to specific directories
4. **Scalability**: Easy to add new features without cluttering existing files
5. **Testability**: Pure functions and isolated components are easier to test
6. **Type Safety**: Centralized types ensure consistency across the codebase