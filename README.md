# React Website (Vite) + React Native (Expo)

---

## Project layout (one root, two projects)

```
project-root/
├─ web/      ← React (Vite) website
├─ mobile/   ← React Native (Expo) mobile app
└─ README.md ← (this file)
```

* `web/` contains the Vite React website.
* `mobile/` contains the Expo React Native app.

---

## Prerequisites

* Node.js (LTS recommended, e.g. 18+)
* npm (bundled with Node) or yarn
* Git (optional but recommended)
* For Android emulator: Android Studio (if you plan to run emulators)
* For iOS device/simulator: macOS + Xcode (only required for native builds)

---

## 1) Folder structure (recommended)

```
project-root/

web/
├─ public/             # static files (favicon, index.html template)
├─ src/
│  ├─ assets/          # images, fonts, icons
│  ├─ components/      # small, reusable UI components
│  ├─ pages/           # route-level pages (Home.jsx, About.jsx)
│  ├─ App.jsx          # route composition
│  └─ main.jsx         # Vite entry
├─ package.json
└─ vite.config.js

mobile/
├─ assets/             # images, fonts
├─ components/         # UI components reused across screens
├─ screens/            # screens (HomeScreen.js, ProfileScreen.js)
├─ App.js              # navigation root
├─ package.json
└─ metro.config.js
```

Tips:

* Keep components small and focused (single responsibility).
* Name pages/screens clearly: `Home`, `Profile`, `Settings`.

---

## 2) Quick setup — create projects (if not existing)

### Create the `web/` (Vite + React)

```bash
# from project-root/
cd ./web
# create with Vite (choose react + javascript or react + typescript)
npm create vite@latest .
# or using pnpm: pnpm create vite .

npm install
```

Make sure `package.json` has scripts such as:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

### Create the `mobile/` (Expo)

```bash
# from project-root/
cd ./mobile
npx create-expo-app .
# or if you prefer the classic: expo init .

npm install
```

Typical mobile `package.json` scripts:

```json
"scripts": {
  "start": "expo start",
  "android": "expo run:android",
  "ios": "expo run:ios",
  "web": "expo start --web"
}
```

---

## 3) Routing / Navigation — examples

### Web (React Router)

In `web/src/App.jsx`:

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
```

Install React Router in the web project:

```bash
cd web
npm install react-router-dom
```

### Mobile (React Navigation — Expo)

Install navigation dependencies in the mobile project:

```bash
cd mobile
npm install @react-navigation/native
npm install @react-navigation/native-stack
# Expo-managed apps also need:
expo install react-native-screens react-native-safe-area-context
```

In `mobile/App.js`:

```javascript
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
```

---

## 4) Component & Page/Screen patterns

* **Components** (`components/`) — small building blocks used by pages/screens. Example: `Button.jsx`, `Card.jsx`, `Avatar.jsx`.
* **Pages / Screens** (`pages/` or `screens/`) — route-level containers composed of components.

Example `web/src/components/Button.jsx`:

```jsx
export default function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="px-4 py-2 rounded">
      {children}
    </button>
  );
}
```

Example `mobile/components/Button.js`:

```js
import { TouchableOpacity, Text } from 'react-native';
export default function Button({ children, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ padding: 12, borderRadius: 8 }}>
      <Text>{children}</Text>
    </TouchableOpacity>
  );
}
```

---

## 5) Running the projects (development)

### Web (Vite)

```bash
cd web
npm install
npm run dev
```

Open your browser at `http://localhost:5173` (or the address printed by Vite).

### Mobile (Expo)

```bash
cd mobile
npm install
npx expo start
```

* Scan the QR code with **Expo Go** (Android/iOS) to run on a device.
* Or start an emulator and press `a` (Android) or `i` (iOS simulator) in the terminal where the dev server runs.

---

## 6) Building for production

### Web

```bash
cd web
npm run build
# Produces a `dist/` folder. Serve this with any static host (Netlify, Vercel, GitHub Pages, nginx).
```

### Mobile

For Expo-managed apps, you can use EAS or classic `expo build` (depending on whether you have an Expo account and which Expo SDK you're on):

```bash
# Example using EAS (recommended for managed apps):
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```

Or publish to the Expo service (not a native store build):

```bash
expo publish
```

---

## 7) Best practices & tips for beginners

* Keep components small and reusable.
* Prefer function components + hooks.
* Separate logic from UI (hooks for data + state; components for view).
* Use descriptive file & folder names.
* Use environment variables for API URLs (`.env` and `.env.production`) — Vite uses `VITE_` prefix.
* Version control: keep `node_modules/` in `.gitignore`.
* Use consistent formatting (Prettier + ESLint).
* Add TypeScript later to improve type-safety (optional).

---

## 8) Common troubleshooting

**`ERR_PORT_IN_USE`** (Vite): change port with `vite --port 5174` or set `PORT` env var.

**Expo app not loading on device:** ensure phone & dev machine are on the same network, or use Tunnel mode in Expo Dev Tools.

**React Native build fails on emulator:** ensure Android SDK, ANDROID_HOME, and emulator images are configured.

---

## 9) Helpful commands quick reference

```
# web
cd web
npm install
npm run dev
npm run build

# mobile
cd mobile
npm install
npx expo start   # or: npm run start
npx expo start --tunnel  # if local network issues
```

---

## 10) Example `.gitignore` additions

```
# node
node_modules/
.env

# expo
.expo/
.expo-shared/

# build
dist/
build/
```

---

## 11) Further learning resources

* React official docs: [https://reactjs.org/](https://reactjs.org/)
* Vite docs: [https://vitejs.dev/](https://vitejs.dev/)
* Expo docs: [https://docs.expo.dev/](https://docs.expo.dev/)
* React Router: [https://reactrouter.com/](https://reactrouter.com/)
* React Navigation: [https://reactnavigation.org/](https://reactnavigation.org/)

---

## License

MIT — feel free to adapt this README to your needs.

---
