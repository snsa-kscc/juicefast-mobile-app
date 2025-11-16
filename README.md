# Juicefast Nutrition App 🥤

A comprehensive React Native mobile application built with Expo, focusing on wellness tracking and nutrition management. The app features a modern UI with sophisticated animations and a robust architecture for tracking meals, steps, mindfulness, sleep, and hydration.

## 📱 Project Overview

The **Juicefast Nutrition App** is a wellness-focused mobile application that helps users track their daily health metrics through an intuitive interface. The app currently features a comprehensive WellnessTracker component as the main screen, with plans for expanded functionality including meal tracking, AI chat support, and nutritionist consultations.

### Key Features

- **Wellness Tracking**: Comprehensive tracking for 5 categories (meals, steps, mindfulness, sleep, water)
- **Circular Progress Display**: Visual weekly wellness score using custom SVG components
- **Rich Animations**: Sophisticated animations using React Native Reanimated
- **Interactive UI**: Responsive design with visual feedback and modern UX patterns
- **Secure Architecture**: Built with security best practices and performance optimizations

## 🛠 Tech Stack

### Core Framework

- **React Native** `0.81.4` - Cross-platform mobile development
- **Expo** `~54.0.8` - Development platform and toolchain
- **TypeScript** `~5.9.2` - Type-safe JavaScript development

### Navigation & Routing

- **Expo Router** `~6.0.6` - File-based routing system
- **React Navigation** `^7.1.6` - Navigation library for React Native

### Styling & UI

- **NativeWind** `^4.1.23` - Tailwind CSS for React Native
- **React Native Reanimated** `~4.1.0` - Advanced animations
- **React Native SVG** `15.12.1` - SVG support for custom icons
- **Lucide React Native** `^0.541.0` - Icon library

### State Management & Data

- **React Query (TanStack)** `^5.85.5` - Server state management
- **Convex** `^1.27.0` - Backend-as-a-Service
- **Zod** `^4.1.3` - Schema validation

### Authentication & Security

- **Clerk** `^2.14.28` - Authentication and user management
- **Expo Secure Store** `^15.0.7` - Secure local storage
- **Crypto-js** `^4.2.0` - Cryptographic operations
- **UUID** `^11.1.0` - Secure ID generation

### Additional Features

- **Expo Image Picker** `^17.0.8` - Image selection functionality
- **React Native Gesture Handler** `~2.28.0` - Advanced gesture recognition
- **Bottom Sheet** `^5.2.3` - Modal bottom sheet component
- **React Native WebView** `13.15.0` - Web content integration

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- pnpm (recommended) or npm
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio & Emulator (for Android development)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd jf-mobile
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development server**
   ```bash
   pnpm start
   # or
   expo start
   ```

### Development Commands

| Command              | Description                       |
| -------------------- | --------------------------------- |
| `pnpm start`         | Start the Expo development server |
| `pnpm android`       | Run on Android emulator/device    |
| `pnpm ios`           | Run on iOS simulator/device       |
| `pnpm web`           | Run on web browser                |
| `pnpm lint`          | Run ESLint for code quality       |
| `pnpm reset-project` | Reset to blank project structure  |

## 📁 Project Structure

```
app/
├── _layout.tsx              # Root layout (Stack navigation)
├── (tabs)/                  # Route group for tab screens
│   ├── _layout.tsx         # Tab navigation layout
│   ├── index.tsx           # Home tab
│   ├── tracker.tsx         # Wellness tracker tab
│   ├── store.tsx           # Store tab
│   ├── steps.tsx           # Steps tracking tab
│   └── sleep.tsx           # Sleep tracking tab
├── meals.tsx               # Meal tracking screen
├── hydration.tsx           # Hydration tracking screen
├── mindfulness.tsx         # Mindfulness tracking screen
├── profile.tsx             # User profile screen
├── chat/                   # Chat functionality
│   ├── ai.tsx             # AI chat interface
│   └── nutritionist.tsx   # Nutritionist chat
└── api/                    # API routes
    └── meals+api.ts       # Meals API endpoint

components/
├── tracker/                # Wellness tracking components
│   └── WellnessTracker.tsx # Main wellness tracking component
├── ui/                     # Reusable UI components
└── ...                     # Other component categories

constants/                  # App-wide constants
hooks/                     # Custom React hooks
providers/                 # Context providers
schemas/                   # Zod validation schemas
styles/                    # Global styles
utils/                     # Utility functions
```

## 🎨 Architecture & Design

### Route Groups Pattern

The app uses Expo Router's modern route groups pattern for better organization:

- `(tabs)/` - Contains all tab-based navigation screens
- Root level screens are accessible via stack navigation
- Clean separation between tabbed and non-tabbed screens

### Animation System

Sophisticated animations powered by React Native Reanimated:

- **Entrance Animations**: Staggered fade-ins, slides, and zoom effects
- **Continuous Animations**: Spinning and pulsing effects
- **Spring Physics**: Natural motion with spring animations
- **Interactive Feedback**: Visual responses to user interactions

### Styling System

- **NativeWind**: Tailwind CSS classes for consistent styling
- **Custom Color Palette**: Category-specific color schemes
- **Responsive Design**: Flexible layouts that adapt to different screen sizes
- **Typography**: SpaceMono font with various weights

## 🔒 Security & Performance

The app has been hardened with multiple security and performance improvements:

### Security Fixes Applied

- ✅ **Log Injection Prevention** (CWE-117)
- ✅ **HTTPS Enforcement** (CWE-319)
- ✅ **Authorization Middleware** (CWE-862)
- ✅ **XSS Protection** (CWE-79)
- ✅ **NoSQL Injection Prevention** (CWE-943)

### Performance Optimizations

- ✅ **UUID-based ID Generation** (prevents collisions)
- ✅ **Memory Leak Prevention** (proper cleanup)
- ✅ **Object Recreation Optimization** (useMemo, static objects)
- ✅ **Data Validation** (schema-based validation)

## 📚 Documentation

For detailed information about specific aspects of the project, see:

- **[CLAUDE.md](./CLAUDE.md)** - Development guidance and architecture details
- **[REFACTOR_SUMMARY.md](./REFACTOR_SUMMARY.md)** - Route groups refactor documentation
- **[SECURITY_FIXES.md](./SECURITY_FIXES.md)** - Security and performance improvements

## 🔧 Development Notes

### Current State

- Primary feature: Wellness tracking with circular progress display
- Tab navigation structure implemented but customizable
- Uses pnpm for package management
- TypeScript with strict mode enabled

### Path Mapping

The project uses `@/*` path mapping for cleaner imports:

```typescript
import { WellnessTracker } from "@/components/tracker/WellnessTracker";
```

### Environment Configuration

- Development and production environment support
- Secure storage for sensitive configuration
- EAS Build integration for deployment

## 🚢 Deployment

The app is configured for deployment with:

- **EAS Build** for native app compilation
- **Expo Updates** for over-the-air updates
- **Multi-platform support** (iOS, Android, Web)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the established patterns
4. Run linting and tests
5. Submit a pull request

## 📄 License

This project is private and proprietary to Juicefast App.

---

**Built with ❤️ using Expo and React Native**

## 2DO

- [ ] Facebook OAuth - ja
- [ ] Google OAuth after login screen route not found
- [ ] Setup Google app store - ja
- [ ] Drawer hydration from revenuecat
- [ ] Setup RevenueCat for Web - ??? otom potom
- [ ] Expo web bug and max width
- [ ] WooCommerce integration
- [ ] Styling
- [ ] Testing
- [ ] Code cleanup
- [ ] Upload html for referrals and set store urls - ja
- [ ] Notifications - nutritionist chat badge not showing, ordinary chat badge showing
