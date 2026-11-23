#!/bin/bash

# =============================================================================
# Pure Structure Scaffolder: bet9jatips (No NPM, just files/folders)
# =============================================================================

set -e

PROJECT_NAME="bet9jatips"
BASE_DIR="$(pwd)/$PROJECT_NAME"

echo "🚀 Creating pure structure for $PROJECT_NAME..."

mkdir -p "$BASE_DIR"
cd "$BASE_DIR"

# -----------------------------------------------------------------------------
# 1. Create Root Config Files
# -----------------------------------------------------------------------------
cat > package.json << 'EOF'
{
  "name": "bet9jatips",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "next": "16.4.6",
    "react": "19.3.1",
    "react-dom": "19.3.1",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0.0",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.4.6",
    "tailwindcss": "^4.0.0",
    "typescript": "^5"
  }
}
EOF

cat > next.config.ts << 'EOF'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
EOF

cat > postcss.config.mjs << 'EOF'
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
EOF

cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

cat > .gitignore << 'EOF'
node_modules
.next
out
build
.DS_Store
*.pem
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.env*
!.env.example
.vercel
*.tsbuildinfo
next-env.d.ts
EOF

# -----------------------------------------------------------------------------
# 2. Create All Directories (App, Components, Features, Lib, Types)
# -----------------------------------------------------------------------------
echo "📂 Building directories..."

# App Router Directories
mkdir -p src/app/\(public\)/tips/\[id\]
mkdir -p src/app/\(auth\)/login src/app/\(auth\)/register
mkdir -p src/app/\(dashboard\)/dashboard src/app/\(dashboard\)/my-tips src/app/\(dashboard\)/profile
mkdir -p src/app/\(admin\)/admin/tips/new src/app/\(admin\)/admin/tips/\[id\]/edit src/app/\(admin\)/admin/users
mkdir -p src/app/api/tips src/app/api/auth/\[...nextauth\]

# Components Directories
mkdir -p src/components/ui
mkdir -p src/components/layout
mkdir -p src/components/shared

# Features Directories
mkdir -p src/features/tips/components
mkdir -p src/features/tips/hooks
mkdir -p src/features/tips/types
mkdir -p src/features/tips/api

mkdir -p src/features/auth/components
mkdir -p src/features/auth/hooks
mkdir -p src/features/auth/types

mkdir -p src/features/users/components
mkdir -p src/features/users/hooks
mkdir -p src/features/users/types

# Lib, Hooks, Types
mkdir -p src/lib src/hooks src/types src/styles

# -----------------------------------------------------------------------------
# 3. Helper Functions to Generate Files
# -----------------------------------------------------------------------------
echo "📝 Generating files..."

# Generate standard RAFCE for pages
create_page() {
  local filepath="$1"
  local component_name="$2"
  
  cat > "$filepath" << EOF
"use client";

import React from 'react';

const $component_name = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-bet9ja-card p-8 rounded-lg border border-gray-600 shadow-xl max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-4">Site Construction Ongoing</h1>
        <p className="text-gray-400">This section is currently under development.</p>
      </div>
    </div>
  );
};

export default $component_name;
EOF
}

# Generate standard RAFCE for features/components
create_component() {
  local filepath="$1"
  local component_name="$2"
  
  cat > "$filepath" << EOF
"use client";

import React from 'react';

const $component_name = () => {
  return (
    <div className="p-4 border border-gray-700 rounded bg-bet9ja-card">
      <p className="text-gray-300">$component_name Component</p>
    </div>
  );
};

export default $component_name;
EOF
}

# Generate Layouts
create_layout() {
  local filepath="$1"
  local layout_name="$2"
  
  cat > "$filepath" << EOF
import React from 'react';

export default function $layout_name({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
EOF
}

# Generate API Route Handlers
create_api_route() {
  local filepath="$1"
  local method_name="$2"
  
  cat > "$filepath" << EOF
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: "$method_name API Route" });
}

export async function POST() {
  return NextResponse.json({ message: "$method_name POST Route" });
}
EOF
}

# Generate Types
create_type() {
  local filepath="$1"
  local type_name="$2"
  
  cat > "$filepath" << EOF
export interface $type_name {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
EOF
}

# -----------------------------------------------------------------------------
# 4. Populate App Router Routes
# -----------------------------------------------------------------------------
echo "📄 Populating App Router..."

# Public
create_page "src/app/(public)/page.tsx" "HomePage"
create_page "src/app/(public)/tips/page.tsx" "TipsPage"
create_page "src/app/(public)/tips/[id]/page.tsx" "TipDetailsPage"
create_layout "src/app/(public)/layout.tsx" "PublicLayout"

# Auth
create_page "src/app/(auth)/login/page.tsx" "LoginPage"
create_page "src/app/(auth)/register/page.tsx" "RegisterPage"
create_layout "src/app/(auth)/layout.tsx" "AuthLayout"

# Dashboard
create_page "src/app/(dashboard)/dashboard/page.tsx" "UserDashboardPage"
create_page "src/app/(dashboard)/my-tips/page.tsx" "MyTipsPage"
create_page "src/app/(dashboard)/profile/page.tsx" "ProfilePage"
create_layout "src/app/(dashboard)/layout.tsx" "DashboardLayout"

# Admin
create_page "src/app/(admin)/admin/page.tsx" "AdminDashboardPage"
create_page "src/app/(admin)/admin/tips/page.tsx" "AdminManageTipsPage"
create_page "src/app/(admin)/admin/tips/new/page.tsx" "AdminNewTipPage"
create_page "src/app/(admin)/admin/tips/[id]/edit/page.tsx" "AdminEditTipPage"
create_page "src/app/(admin)/admin/users/page.tsx" "AdminUsersPage"
create_layout "src/app/(admin)/layout.tsx" "AdminLayout"

# Root
create_page "src/app/page.tsx" "RootRedirect"
create_layout "src/app/layout.tsx" "RootLayout"

# APIs
create_api_route "src/app/api/tips/route.ts" "Tips"
create_api_route "src/app/api/auth/[...nextauth]/route.ts" "Auth"

# Global CSS
cat > src/app/globals.css << 'EOF'
@import "tailwindcss";

@theme {
  --color-bet9ja-green: #008d44;
  --color-bet9ja-dark: #1e2226;
  --color-bet9ja-card: #2c333a;
  --color-bet9ja-gray: #9ca3af;
}

body {
  background-color: var(--color-bet9ja-dark);
  color: white;
}
EOF

# -----------------------------------------------------------------------------
# 5. Populate Components & Features (The missing part)
# -----------------------------------------------------------------------------
echo "📄 Populating UI Components & Features..."

# Components / UI
create_component "src/components/ui/Button.tsx" "Button"
create_component "src/components/ui/Card.tsx" "Card"
create_component "src/components/ui/Input.tsx" "Input"
create_component "src/components/ui/Badge.tsx" "Badge"
create_component "src/components/ui/Modal.tsx" "Modal"

# Components / Layout
create_component "src/components/layout/Navbar.tsx" "Navbar"
create_component "src/components/layout/Footer.tsx" "Footer"
create_component "src/components/layout/AdminSidebar.tsx" "AdminSidebar"
create_component "src/components/layout/UserSidebar.tsx" "UserSidebar"

# Components / Shared
create_component "src/components/shared/CopyButton.tsx" "CopyButton"
create_component "src/components/shared/ThemeToggle.tsx" "ThemeToggle"

# Features / Tips
create_component "src/features/tips/components/HeroSection.tsx" "HeroSection"
create_component "src/features/tips/components/RecentTips.tsx" "RecentTips"
create_component "src/features/tips/components/TipCard.tsx" "TipCard"
create_component "src/features/tips/components/TipForm.tsx" "TipForm"
create_component "src/features/tips/hooks/useTips.ts" "useTips"
create_type "src/features/tips/types/index.ts" "Tip"
create_component "src/features/tips/api/actions.ts" "tipActions"

# Features / Auth
create_component "src/features/auth/components/LoginForm.tsx" "LoginForm"
create_component "src/features/auth/components/RegisterForm.tsx" "RegisterForm"
create_component "src/features/auth/hooks/useAuth.ts" "useAuth"
create_type "src/features/auth/types/index.ts" "AuthUser"

# Features / Users
create_component "src/features/users/components/UserProfileCard.tsx" "UserProfileCard"
create_component "src/features/users/hooks/useUser.ts" "useUser"
create_type "src/features/users/types/index.ts" "UserProfile"

# -----------------------------------------------------------------------------
# 6. Populate Lib, Hooks, Types
# -----------------------------------------------------------------------------
echo "📄 Populating Lib, Hooks, and Types..."

# Lib
cat > src/lib/utils.ts << 'EOF'
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
EOF

cat > src/lib/prisma.ts << 'EOF'
// Prisma Client setup goes here
export const prisma = {};
EOF

cat > src/lib/auth.ts << 'EOF'
// NextAuth configuration goes here
export const authOptions = {};
EOF

cat > src/lib/constants.ts << 'EOF'
export const SITE_NAME = "Bet9ja Tips";
export const SITE_URL = "https://bet9ja-odds.vercel.app";
EOF

# Hooks
cat > src/hooks/useLocalStorage.ts << 'EOF'
import { useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  return [storedValue, setStoredValue] as const;
}
EOF

# Types
create_type "src/types/index.ts" "GlobalType"
create_type "src/types/next-auth.d.ts" "NextAuthType"

# Styles
cat > src/styles/animations.css << 'EOF'
/* Custom animations go here */
EOF

echo ""
echo "✨ COMPLETE Project Structure Created Successfully!"
echo "----------------------------------------"
echo "Folder: $PROJECT_NAME"
echo "----------------------------------------"
echo "All folders AND files have been populated."
echo "You can now push this folder directly to GitHub."
echo "To run it later: cd $PROJECT_NAME && npm install && npm run dev"