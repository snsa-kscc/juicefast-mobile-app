# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Juicefast Nutrition App**, a React Native mobile application built with Expo. The app focuses on wellness tracking functionality, currently featuring a comprehensive WellnessTracker component as the main screen. The app uses TypeScript, NativeWind (Tailwind CSS for React Native), and React Native Reanimated for animations.

## Development Commands

### Basic Development
- **Start development server**: `expo start` (or `npm start`)
- **Android**: `expo start --android` (or `npm run android`) 
- **iOS**: `expo start --ios` (or `npm run ios`)
- **Web**: `expo start --web` (or `npm run web`)

### Code Quality
- **Lint code**: `expo lint` (or `npm run lint`)

### Project Management
- **Reset to blank project**: `npm run reset-project` - moves starter code to app-example/ and creates blank app/

## Architecture & Structure

### Core Technologies
- **Framework**: React Native with Expo (~53.0.20)
- **Navigation**: Expo Router with file-based routing
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Animations**: React Native Reanimated (~3.17.5)
- **Typography**: SpaceMono font loaded via expo-font
- **Icons**: Lucide React Native, custom SVG icons
- **State Management**: React hooks (useState, useEffect)

### Project Structure
- **app/**: File-based routing with Expo Router
  - `_layout.tsx`: Root layout, currently renders WellnessTracker as main screen
  - `(tabs)/`: Tab-based navigation structure (currently unused)
- **components/**: Reusable React components
  - `tracker/WellnessTracker.tsx`: Main wellness tracking component
  - `ui/`: Platform-specific UI components
- **constants/**: App-wide constants (Colors.ts)
- **hooks/**: Custom React hooks for theming and color schemes
- **styles/global.css**: Global NativeWind/Tailwind styles

### Key Component: WellnessTracker

Located at `components/tracker/WellnessTracker.tsx`, this is the main feature component that includes:

- **Circular progress display** showing weekly wellness score using SVG
- **5 tracking categories**: meals, steps, mindfulness, sleep, water
- **Rich animations** using React Native Reanimated (fade-ins, slides, springs, zoom effects)
- **Interactive selection** of tracking options with visual feedback
- **Custom SVG icons** for each tracking category with unique color schemes
- **Responsive design** using NativeWind classes

### Styling System

Uses NativeWind for Tailwind CSS classes in React Native:
- **Colors**: Custom color palette with category-specific backgrounds
- **Typography**: SpaceMono font with various weights
- **Layout**: Flexbox with responsive spacing
- **Animations**: Integrated with React Native Reanimated

### TypeScript Configuration

- **Path mapping**: `@/*` maps to root directory for imports
- **Strict mode**: Enabled for better type safety
- **Expo types**: Includes Expo-specific type definitions

## Development Notes

### Current State
- App is in development with wellness tracking as the primary feature
- Main screen displays WellnessTracker component directly from root layout
- Tab navigation structure exists but is not currently active
- Uses pnpm for package management

### Animation System
The app heavily uses React Native Reanimated for sophisticated animations:
- Entrance animations with staggered delays
- Continuous animations (spinning, pulsing)
- Spring physics for natural motion
- Various animation types: FadeIn, SlideIn, ZoomIn, BounceIn

### Styling Patterns
- NativeWind classes for consistent styling
- Custom background colors for different tracking categories
- Conditional styling based on component state
- SVG icons with stroke-based designs and category-specific colors