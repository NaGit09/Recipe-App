# Recipe-App

A beautiful and dynamic recipe discovery mobile application built with React Native and Expo.

## ✨ Features

- **Delicious Red Design System**: A premium, vibrant UI with smooth animations.
- **Recipe Discovery**:
  - Browse recipes by categories (horizontal scrolling).
  - "Popular Recipes" section.
  - Search functionality with filters.
- **Recipe Details**:
  - Detailed view with high-quality images, description, cooking time, and nutrition info.
  - Ingredients list and step-by-step instructions.
  - Favorite system to save loved recipes.
- **News & Articles**: Stay updated with culinary news/articles (RSS feed integration).
- **Interactive Elements**:
  - Comment system with reply functionality.
  - Smooth staggered animations for lists and page transitions.
- **State Management**: Powered by Zustand for global state (Recipes, Ingredients, User).

## 🛠 Tech Stack

- **Framework**: [Expo](https://expo.dev) (React Native)
- **Language**: TypeScript
- **Navigation**: Expo Router
- **State Management**: Zustand
- **Styling**: Custom CSS / Styles

## 🚀 Get Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the app**

   ```bash
   npx expo start
   ```

   In the output, you'll find options to open the app in a:

   - Development build
   - Android emulator
   - iOS simulator
   - Expo Go

## 📂 Project Structure

- **app/**: Main application screens and routing.
- **src/stores/**: Zustand state stores (e.g., `useRecipeStore`, `useIngredientStore`).
- **src/components/**: Reusable UI components.
- **src/constants/**: App constants and configuration.

## 🤝 Contributing

Contributions are welcome!
