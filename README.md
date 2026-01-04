# OWN x BORDEL Mortgage UI

Frontend application for the OWN x BORDEL Mortgage platform, built with [Nuxt 4](https://nuxt.com).

## 🛠️ Tech Stack

- **Framework:** [Nuxt 4](https://nuxt.com)
- **UI Library:** [Shadcn Vue](https://www.shadcn-vue.com)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com)
- **State Management:** [Pinia](https://pinia.vuejs.org)
- **Web3:** [Wagmi](https://wagmi.sh) & [AppKit](https://reown.com/appkit)
- **Package Manager:** [Bun](https://bun.sh)

## 🚀 Setup

1) Copy `.env.example` to `.env` and fill in the required values.

2) Install dependencies with `bun install`.

## 💻 Development Server

Start the development server on `http://localhost:8000`:

```bash
bun run dev
```

## 🏗️ Preview Local Production Build

Generates the production build and opens the preview server on `http://localhost:3000`:

```bash
bun run preview
```

### Cloudflare Pages

This project is configured for deployment on Cloudflare Pages, where it's built via `bun run generate-cf-pages`.

## Linting

```bash
# Run ESLint
bun run lint

# Fix linting errors
bun run lint:fix
```

## 📁 Project Structure

- `app/components` - Vue components (auto-imported)
- `app/layouts` - Page layouts
- `app/pages` - Application routes
- `app/composables` - Auto-imported composables
- `app/utils` - Utility functions
- `server/` - Server-side API routes
