# 🏡 CivicNest – Modern Society Management App

## 📘 Project Overview

**CivicNest** is a powerful, full-featured society and residential community management system designed to streamline day-to-day operations for gated communities, housing societies, and apartment complexes.

Built using the latest technologies including **[Next.js 15](https://nextjs.org/)**, **[React 19](https://react.dev/)**, **[TypeScript](https://www.typescriptlang.org/)**, **[Tailwind CSS v4](https://tailwindcss.com/)**, and **[Shadcn UI](https://ui.shadcn.com/)**, CivicNest offers a scalable and customizable platform for community living.

🔗 **Live App**: [https://dash-lemon-psi.vercel.app/](https://dash-lemon-psi.vercel.app/)
📂 **GitHub Repo**: [github.com/Deepak-Varshney/dash](https://github.com/Deepak-Varshney/dash)

---

## ✨ Key Features

* **Resident Authentication**
  Secure sign-in/sign-up via [Clerk](https://clerk.com), with support for passwordless login, social providers, and SSO.

* **Dashboard & Analytics**
  Admin dashboard with real-time charts, stats, and summaries using [Recharts](https://recharts.org/).

* **Resident Management**
  Manage user profiles, contact details, unit assignments, and roles.

* **Event Management**
  Create, track, and display upcoming community events or meetings.

* **Maintenance & Payment Tracking**
  Submit and manage maintenance requests, track payments, and view dues.

* **Notes**
  Internal task board with drag-and-drop support powered by [dnd-kit](https://dndkit.com/) and [Zustand](https://zustand-demo.pmnd.rs).

* **File Uploads**
  Drag-and-drop document uploader with file previews and progress indicators.

* **Forms & Validation**
  Flexible form handling using [React Hook Form](https://react-hook-form.com/) with schema validation via [Zod](https://zod.dev).

* **Command Palette**
  Fast in-app navigation and actions via [kbar](https://kbar.vercel.app/).

* **Responsive UI**
  Fully responsive and accessible design using Tailwind CSS and Shadcn UI.

* **Developer Tooling**
  Pre-configured with ESLint, Prettier, and Husky for consistent code formatting and linting.

---

### 🔍 Upcoming Feature: Visitor Detection (Python Backend)

A backend module (in development) will:

* **Capture visitor logs** using camera input
* **Take automatic snapshots** of detected individuals
* **Integrate with the dashboard** for real-time monitoring and alerts

This will add an intelligent layer of security and visitor tracking to the CivicNest system.

---

## 📁 Directory Structure

```plaintext
src/
├── app/                # Next.js App Router
│   ├── (auth)/         # Auth routes (Clerk)
│   ├── (dashboard)/    # Dashboard routes and layouts
│   └── api/            # API endpoints
├── components/         # Reusable UI and layout components
│   ├── ui/             # Design primitives
│   └── layout/         # Headers, sidebars, etc.
├── features/           # Feature-based modules (auth, users, events)
│   └── <feature>/      # Components, logic, schemas per module
├── constants/          # Static data and navigation structure
├── hooks/              # Custom React hooks
├── lib/                # Core utilities (auth, db, helpers)
├── stores/             # Zustand state management
├── types/              # TypeScript interfaces/types
└── utils/              # General-purpose utilities
```

---

## 🛠 Technology Stack

* **Frontend**: Next.js 15, React 19, TypeScript
* **Styling**: Tailwind CSS v4, Shadcn UI
* **State Management**: Zustand
* **Forms**: React Hook Form + Zod
* **Authentication**: Clerk
* **Tables**: Tanstack Table, Nuqs
* **Charts**: Recharts
* **Command Palette**: kbar
* **Visitor Detection (WIP)**: Python backend (camera input + image logging)
* **Dev Tools**: ESLint, Prettier, Husky

---

## 🚀 Getting Started

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Deepak-Varshney/dash.git
   cd dash
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Configure environment variables**:
   Create `.env.local` and add required keys (Clerk, DB, etc.)

4. **Run the dev server**:

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👤 Author

**Deepak Varshney**
[GitHub](https://github.com/Deepak-Varshney) · [LinkedIn](https://www.linkedin.com/in/deepakvarshney-exe/)

