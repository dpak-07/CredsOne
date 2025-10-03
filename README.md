This guide explains how to **set up, organize, and run** your React JS website (Vite) and React Native mobile app (Expo). It is written for beginners who are just starting with React.

---

## 1️⃣ Project Overview

You will have two separate projects in the same root folder:

project-root/
├─ web/ ← React JS (Vite) project (Website)
├─ mobile/ ← React Native (Expo) project (Mobile App)

yaml
Copy code

- `web/` → contains your website code using React JS with Vite.
- `mobile/` → contains your mobile app code using React Native with Expo.

---

## 2️⃣ Folder Structure & Flow Diagram

Here’s a **visual ASCII diagram** showing folders, pages/screens, components, and routing/navigation:

project-root/
│
├─ web/ ← React JS Website
│ ├─ public/ ← Static files (images, fonts, favicon)
│ ├─ src/
│ │ ├─ assets/ ← Images, icons, CSS
│ │ ├─ components/ ← Reusable UI components (Buttons, Cards, Header)
│ │ ├─ pages/ ← Website pages (Home.jsx, About.jsx)
│ │ ├─ App.jsx ← Main app file (imports pages & routes)
│ │ └─ main.jsx ← Vite entry point
│ ├─ package.json
│ └─ vite.config.js
│
├─ mobile/ ← React Native Mobile App
│ ├─ assets/ ← Images, fonts, icons
│ ├─ components/ ← Reusable UI components (Buttons, Cards)
│ ├─ screens/ ← App screens (HomeScreen.js, ProfileScreen.js)
│ ├─ App.js ← Main app file (imports screens & navigation)
│ ├─ package.json
│ └─ metro.config.js
│

css
Copy code

**Navigation/Flow Concept:**

React JS (web):
App.jsx
├─ BrowserRouter
│ ├─ Routes
│ │ ├─ Route path="/" element={<HomePage />}
│ │ ├─ Route path="/about" element={<AboutPage />}
│ │ └─ ...
│ └─ Components inside Pages
└─ Pages call Components

React Native (mobile):
App.js
├─ NavigationContainer
│ ├─ StackNavigator / TabNavigator
│ │ ├─ HomeScreen
│ │ ├─ ProfileScreen
│ │ └─ ...
│ └─ Components inside Screens
└─ Screens call Components

markdown
Copy code

---

## 3️⃣ Creating Pages/Screens and Components

### **3.1 React JS (Vite)**

1. **Create a page:** `src/pages/` (e.g., Home.jsx, About.jsx)  
2. **Create a component:** `src/components/` (e.g., Button.jsx, Card.jsx)  
3. **Use pages/components in App.jsx:**  
   - Import pages and components  
   - Use **react-router-dom** to define routes  
   - Components are used inside pages

---

### **3.2 React Native (Expo)**

1. **Create a screen:** `mobile/screens/` (e.g., HomeScreen.js)  
2. **Create a component:** `mobile/components/` (e.g., Button.js, Card.js)  
3. **Use screens/components in App.js:**  
   - Import screens and components  
   - Use **@react-navigation/native** for navigation  
   - Components are used inside screens

---

## 4️⃣ Routing Instructions

### **React JS (Vite)**
```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
React Native (Expo)
javascript
Copy code
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
5️⃣ Running the Projects
React JS (Vite)
bash
Copy code
cd web
npm install       # Install dependencies
npm run dev       # Start development server
Open browser at: http://localhost:5173

React Native (Expo)
Option 1: Using Expo CLI
bash
Copy code
cd mobile
npm install
expo start
Option 2: Using npx (no global install needed)
bash
Copy code
cd mobile
npm install
npx expo start
Running on Android Phone
Install Expo Go app from Google Play Store.

Connect your phone and computer to the same Wi-Fi network.

Start Expo (expo start or npx expo start) on your computer.

Scan the QR code in Expo Dev Tools using Expo Go.

The app loads instantly on your Android device.

Running on Android Emulator
Install Android Studio and create an emulator.

Start the emulator.

Run:

bash
Copy code
npx expo start
Press a in the terminal to open the app on the emulator.

6️⃣ Best Practices for Beginners
Keep components small and reusable.

Maintain clear folder structure: components/ and pages/screens/.

Use descriptive names for pages/screens and components.

Separate routing/navigation from UI components.

React JS uses HTML/CSS; React Native uses View/Text/Image + StyleSheet.

Start with one page and one screen before adding more.

7️⃣ Helpful Commands
Command	Description
npm install	Install dependencies
npm run dev	Start React JS Vite server
expo start	Start React Native Expo app
npx expo start	Start Expo app without global install
npm run build	Build React JS project for production