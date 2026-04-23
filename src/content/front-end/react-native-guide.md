# React Native & Mobile Apps — Complete Guide

## Table of Contents

- [1. What is React Native?](#1-what-is-react-native)
- [2. Project Setup — Expo vs Bare CLI](#2-project-setup--expo-vs-bare-cli)
- [3. Core Components](#3-core-components)
- [4. Styling in React Native](#4-styling-in-react-native)
- [5. Layout with Flexbox](#5-layout-with-flexbox)
- [6. Lists — FlatList, SectionList & Virtualization](#6-lists--flatlist-sectionlist--virtualization)
- [7. Navigation](#7-navigation)
- [8. State Management in Mobile Apps](#8-state-management-in-mobile-apps)
- [9. Platform APIs](#9-platform-apis)
- [10. Handling Keyboard & Safe Areas](#10-handling-keyboard--safe-areas)
- [11. Networking & Data Fetching](#11-networking--data-fetching)
- [12. Persistent Storage](#12-persistent-storage)
- [13. Forms & TextInput](#13-forms--textinput)
- [14. Images & Media](#14-images--media)
- [15. Animations](#15-animations)
- [16. Gestures](#16-gestures)
- [17. Permissions & Device APIs](#17-permissions--device-apis)
- [18. Push Notifications](#18-push-notifications)
- [19. Deep Linking](#19-deep-linking)
- [20. Native Modules & Bridging](#20-native-modules--bridging)
- [21. New Architecture — JSI, Fabric, TurboModules, Hermes](#21-new-architecture--jsi-fabric-turbomodules-hermes)
- [22. Performance Optimization](#22-performance-optimization)
- [23. Debugging & Dev Tools](#23-debugging--dev-tools)
- [24. Testing React Native Apps](#24-testing-react-native-apps)
- [25. Build, Release & App Stores](#25-build-release--app-stores)
- [26. Over-the-Air Updates](#26-over-the-air-updates)
- [27. Accessibility](#27-accessibility)
- [28. Internationalization (i18n)](#28-internationalization-i18n)
- [29. Common Pitfalls & Best Practices](#29-common-pitfalls--best-practices)
- [30. Interview Questions & Answers](#30-interview-questions--answers)
- [31. Tricky Questions](#31-tricky-questions)
- [References](#references)

---

## 1. What is React Native?

React Native is a **framework for building native mobile apps using JavaScript and React**. Created by Meta in 2015, it lets you write components once and render them as real native UI on both iOS and Android — not a web view, not a hybrid shell.

The headline idea is "**learn once, write anywhere**" (not "write once, run everywhere"). You reuse React knowledge — components, hooks, JSX, unidirectional data flow — but output maps to platform-native widgets: a `<View>` becomes `UIView` on iOS and `android.view.ViewGroup` on Android; `<Text>` becomes `UILabel` / `TextView`; `<TextInput>` becomes `UITextField` / `EditText`.

### How it works

Your JavaScript runs in a JS engine (Hermes by default since RN 0.70) on a background thread. The UI runs on the main thread rendered by the platform's native view system. The two worlds communicate through one of two mechanisms:

- **Old (Bridge) architecture** — JS and native exchange serialized JSON messages asynchronously over a bridge. Every call is async. Lots of traffic + serialization overhead caused jank.
- **New architecture (JSI + Fabric + TurboModules)** — JS holds direct references to C++ host objects, calls can be synchronous, rendering is concurrent, and serialization is eliminated. Covered in §21.

### What React Native is NOT

- **Not a web view** — unlike Cordova / Ionic, there is no WKWebView wrapping HTML. The views are truly native.
- **Not cross-platform UI** — each platform looks and feels native because the underlying primitives are. You still have to design for iOS and Android separately in places (tab bars vs. bottom nav, back gestures, modals).
- **Not React DOM** — you cannot use `<div>`, `<span>`, `<img>`. There is no DOM, no `document`, no `window.location`, no CSS cascade. You work with a fixed set of primitives and style objects.

### Why choose React Native over alternatives?

| Option | Tradeoff |
|---|---|
| **React Native** | Native UI, shared JS, large ecosystem, mature. Some native knowledge needed for edge cases. |
| **Flutter** | Own rendering engine (Skia) for pixel-perfect consistency; Dart language; heavier bundle. |
| **Native (Swift/Kotlin)** | Best performance & platform fit; 2× the teams and codebases. |
| **Ionic / Capacitor** | Web tech in a WebView; great for content apps, weaker for interactions. |
| **Expo** | React Native with a managed toolchain, OTA updates, and build service. Most RN projects start here today. |

---

## 2. Project Setup — Expo vs Bare CLI

### Expo (recommended starting point)

Expo is a framework + cloud services built on top of React Native. It provides a managed workflow so you don't have to touch Xcode or Android Studio until you need to.

```bash
# Create a new app with the TypeScript template
npx create-expo-app@latest MyApp --template

# Run
cd MyApp
npx expo start            # opens the dev menu; scan QR with Expo Go app
npx expo start --ios      # iOS simulator
npx expo start --android  # Android emulator

# When you need native code, generate ios/ and android/ directories
npx expo prebuild
```

Expo's sweet spot is **most apps**: it handles splash screens, icons, push notifications, over-the-air updates, builds via EAS, config via `app.json`, and hundreds of first-party modules. You only "eject" (now called `prebuild`) when you need a native module Expo doesn't ship.

### Bare React Native CLI

For maximum flexibility — e.g., integrating into an existing native app, or using a native SDK not supported by Expo:

```bash
npx @react-native-community/cli@latest init MyApp
cd MyApp

# iOS
npx pod-install
npm run ios

# Android
npm run android
```

You now own the `ios/` and `android/` folders end-to-end. That includes Xcode schemes, Gradle configs, Podfile, signing, etc.

### Project structure (Expo)

```
MyApp/
├─ app/                  # expo-router file-based routes (optional)
├─ assets/               # images, fonts, splash
├─ components/           # reusable RN components
├─ hooks/
├─ App.tsx               # root component (for classic apps)
├─ app.json              # Expo config (name, icons, plugins, schemes)
├─ babel.config.js
├─ metro.config.js       # bundler config
├─ tsconfig.json
└─ package.json
```

### Metro — the bundler

React Native does not use Webpack or Vite. It ships its own bundler, **Metro**, optimized for RN's needs: tree-shaking across platforms, resolving `.ios.tsx` / `.android.tsx` variants, fast refresh, source maps over the network. Most config lives in `metro.config.js`.

---

## 3. Core Components

React Native has no HTML. Instead it provides a small set of cross-platform primitives. Understand these and ~80% of UI work is muscle memory.

### View

The fundamental building block — a container that maps to `UIView` / `android.view.ViewGroup`. Like a `<div>` but with a default `display: flex` and `flexDirection: column`.

```tsx
import { View } from 'react-native';

<View style={{ padding: 16, backgroundColor: 'white' }}>
  {/* children */}
</View>
```

### Text

All on-screen text must be inside `<Text>`. You cannot put a string directly in a `<View>` — it will throw `Text strings must be rendered within a <Text> component`.

```tsx
import { Text } from 'react-native';

<Text style={{ fontSize: 18, fontWeight: '600' }}>
  Hello mobile world
</Text>

// Nested Text inherits styles (unlike View)
<Text style={{ color: 'black' }}>
  Hello <Text style={{ fontWeight: 'bold' }}>bold</Text> world
</Text>
```

Why the rule? Native text rendering on iOS (`UILabel` / `NSAttributedString`) is fundamentally different from layout containers. RN enforces the distinction.

### Image

```tsx
import { Image } from 'react-native';

// Bundled asset — require() resolves at build time
<Image source={require('./assets/logo.png')} style={{ width: 80, height: 80 }} />

// Remote image — you MUST specify width/height, RN won't infer
<Image source={{ uri: 'https://example.com/pic.jpg' }} style={{ width: 200, height: 200 }} />

// resizeMode: cover, contain, stretch, repeat, center
<Image source={{ uri }} style={{ width: 200, height: 200 }} resizeMode="cover" />
```

### ScrollView

Scrollable container. Renders **all children up front** — use only for small, bounded content. For long lists, use `FlatList` (§6).

```tsx
import { ScrollView } from 'react-native';

<ScrollView contentContainerStyle={{ padding: 16 }}>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
  {/* ...up to ~20 items. Beyond that, switch to FlatList */}
</ScrollView>
```

Key prop: `contentContainerStyle` styles the inner content wrapper; `style` styles the outer scroll view. Padding usually goes on `contentContainerStyle`.

### TextInput

```tsx
import { TextInput } from 'react-native';

const [value, setValue] = useState('');

<TextInput
  value={value}
  onChangeText={setValue}
  placeholder="Email"
  keyboardType="email-address"
  autoCapitalize="none"
  autoCorrect={false}
  returnKeyType="done"
  onSubmitEditing={handleSubmit}
  style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
/>
```

Common keyboard types: `default`, `numeric`, `email-address`, `phone-pad`, `decimal-pad`, `url`. Platform may differ slightly — e.g., `number-pad` on iOS hides the decimal.

### Pressable / Touchables

Pressable is the modern, recommended API (RN 0.63+). The older `Touchable*` components still exist but Pressable is more flexible.

```tsx
import { Pressable, Text } from 'react-native';

<Pressable
  onPress={() => console.log('tap')}
  onLongPress={() => console.log('long')}
  style={({ pressed }) => [
    { padding: 12, borderRadius: 8 },
    { backgroundColor: pressed ? '#ddd' : '#eee' },
  ]}
  hitSlop={10}                   // enlarge tap area
  android_ripple={{ color: '#ccc' }}
>
  <Text>Tap me</Text>
</Pressable>
```

The older `TouchableOpacity`, `TouchableHighlight`, `TouchableWithoutFeedback`, and `TouchableNativeFeedback` still work but have fixed feedback models and are harder to customize.

### Button

A minimal, platform-styled button. Intentionally inflexible — use `Pressable` for custom UI.

```tsx
import { Button } from 'react-native';

<Button title="Submit" onPress={handleSubmit} color="#007AFF" />
```

### Modal

Full-screen overlay using the native modal presenter.

```tsx
import { Modal, View, Text, Pressable } from 'react-native';

<Modal
  visible={open}
  animationType="slide"         // 'none' | 'slide' | 'fade'
  transparent={false}
  onRequestClose={() => setOpen(false)}  // Android back button
>
  <View style={{ flex: 1, padding: 20 }}>
    <Text>Modal content</Text>
    <Pressable onPress={() => setOpen(false)}><Text>Close</Text></Pressable>
  </View>
</Modal>
```

### ActivityIndicator

```tsx
import { ActivityIndicator } from 'react-native';

<ActivityIndicator size="large" color="#007AFF" />
```

### Switch

Cross-platform toggle. Looks like a UISwitch on iOS and Material switch on Android.

```tsx
<Switch value={enabled} onValueChange={setEnabled} />
```

---

## 4. Styling in React Native

Styles in RN are **JavaScript objects**, not CSS. They look similar (camelCase keys, same properties), but with crucial differences:

- No cascade, no inheritance (except Text-inside-Text).
- No selectors, pseudo-classes, media queries.
- No units — all numbers are **density-independent pixels (dp)**. One `dp` is ~1 pt on iOS and `dp` on Android.
- No `display: block` — layout is Flexbox by default.
- Not all CSS works. For example, no `float`, `grid`, `position: sticky`.

### Inline vs StyleSheet.create

```tsx
import { StyleSheet, View, Text } from 'react-native';

// Inline — fine for small one-offs. Creates a new object every render
<Text style={{ fontSize: 16, color: 'red' }}>Hello</Text>

// StyleSheet.create — preferred
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '600' },
});

<View style={styles.container}>
  <Text style={styles.title}>Hello</Text>
</View>
```

`StyleSheet.create` historically returned frozen integer IDs on the native side, reducing bridge traffic. On the new architecture this optimization is less impactful, but the convention stuck because it also improves readability and enables validation warnings.

### Combining styles

```tsx
// Array — later overrides earlier
<View style={[styles.card, styles.shadow, isActive && styles.cardActive]} />

// Falsy entries are ignored (great for conditional classes)
<Text style={[styles.text, error && { color: 'red' }]} />
```

### Platform-specific styles

```tsx
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.1 },
      android: { elevation: 4 },
    }),
  },
});
```

### Shadows

- **iOS**: `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`.
- **Android**: `elevation`. Elevation also clips by the view's background — set `backgroundColor` or shadows won't render.

### Font family

- Fonts must be bundled via `react-native-asset` / Expo plugin. You can't just reference a web font URL.
- iOS uses PostScript names; Android uses filename. Expo handles both.

```tsx
import { useFonts } from 'expo-font';

const [loaded] = useFonts({
  Inter: require('./assets/Inter.ttf'),
});

<Text style={{ fontFamily: 'Inter' }}>Hi</Text>
```

---

## 5. Layout with Flexbox

RN uses Yoga, a C++ Flexbox engine, for layout. The API mirrors CSS Flexbox but with **different defaults**:

| Property | Web default | RN default |
|---|---|---|
| `flexDirection` | `row` | `column` |
| `alignContent` | `stretch` | `flex-start` |
| `flexShrink` | `1` | `0` |

So on RN, `<View>` lays children **top-to-bottom** by default.

### Common patterns

```tsx
// Full-height container
<View style={{ flex: 1 }} />

// Center content
<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  <Text>Centered</Text>
</View>

// Horizontal row with space between
<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
  <Text>Left</Text>
  <Text>Right</Text>
</View>

// 3-column grid
<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
  {items.map(i => <View key={i.id} style={{ width: '33.33%' }} />)}
</View>
```

### `flex: 1` vs `height: '100%'`

`flex: 1` means "take up remaining space in the parent". `height: '100%'` means "be exactly the parent's height", which only works if the parent has a known height. Most of the time, you want `flex: 1` — it cascades naturally through nested containers. If your screen is blank, the usual fix is adding `flex: 1` to an ancestor.

### Absolute positioning

```tsx
<View style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}>
  <Badge />
</View>
```

`position: absolute` takes the element out of flow and positions relative to the nearest ancestor (not the window). `position: fixed` does not exist.

### Responsive sizes

```tsx
import { Dimensions, useWindowDimensions } from 'react-native';

// Static — does NOT update on rotation / fold
const { width } = Dimensions.get('window');

// Reactive — use this in components
function Card() {
  const { width, height } = useWindowDimensions();
  return <View style={{ width: width / 2 }} />;
}
```

`window` is the app's drawable area; `screen` is the full device including system bars. `useWindowDimensions` is almost always what you want.

---

## 6. Lists — FlatList, SectionList & Virtualization

For anything longer than a screenful, `ScrollView` is wrong. It renders every child up front, eating memory and blocking the JS thread. Use a **virtualized list**, which only mounts items currently on (or near) the screen.

### FlatList

```tsx
import { FlatList } from 'react-native';

<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item, index }) => <Row item={item} />}
  ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#eee' }} />}
  ListHeaderComponent={<Header />}
  ListFooterComponent={loading ? <Spinner /> : null}
  ListEmptyComponent={<Text>No items</Text>}
  onEndReached={loadMore}
  onEndReachedThreshold={0.5}  // fraction of viewport from end
  refreshing={refreshing}
  onRefresh={onRefresh}         // pull-to-refresh
/>
```

### Performance knobs

These props materially affect FlatList performance — misuse is a leading cause of janky lists:

- `keyExtractor` — **always** provide one. Falls back to index if missing, which breaks recycling on reorder.
- `getItemLayout={(data, i) => ({ length, offset: length * i, index: i })}` — when all items are the same height, this skips measurement and enables instant scroll-to-index.
- `initialNumToRender` — how many rows to render first (default 10). Lower = faster first paint.
- `maxToRenderPerBatch` — rows per render batch (default 10). Raise for scroll-ahead, lower if each row is expensive.
- `windowSize` — number of viewport-heights kept mounted (default 21 → 10 above + 10 below + current). Lower = less memory; higher = smoother scrolling.
- `removeClippedSubviews={true}` — unmounts views scrolled far off-screen (Android: useful; iOS: can cause flicker).

### renderItem — memoize

The #1 perf mistake is passing an inline arrow that recreates every render, forcing every row to re-render.

```tsx
// Bad
<FlatList renderItem={({ item }) => <Row item={item} onPress={() => handle(item.id)} />} />

// Good — row is memoized, callback is stable
const Row = React.memo(({ item, onPress }: RowProps) => (
  <Pressable onPress={() => onPress(item.id)}><Text>{item.name}</Text></Pressable>
));
const handlePress = useCallback((id: string) => { ... }, []);
const renderItem = useCallback(({ item }) => (
  <Row item={item} onPress={handlePress} />
), [handlePress]);
```

### SectionList

Like FlatList but with grouped sections and sticky section headers.

```tsx
<SectionList
  sections={[
    { title: 'A', data: ['Alice', 'Aaron'] },
    { title: 'B', data: ['Bob'] },
  ]}
  keyExtractor={(item, index) => item + index}
  renderItem={({ item }) => <Text>{item}</Text>}
  renderSectionHeader={({ section }) => <Text>{section.title}</Text>}
  stickySectionHeadersEnabled
/>
```

### Alternatives for huge / complex lists

- **FlashList** (from Shopify) — drop-in replacement with better recycling; often 2–5× smoother on complex rows. Requires `estimatedItemSize`.
- **@shopify/recyclerlistview** — lower-level, highest performance, more setup.

---

## 7. Navigation

React Native has **no built-in navigation**. The de facto standard is **React Navigation** (`@react-navigation/native`). Expo ships with it out of the box.

### Install

```bash
npm install @react-navigation/native
npx expo install react-native-screens react-native-safe-area-context
npm install @react-navigation/native-stack
```

### Stack Navigator

Push / pop screens, with gestures and platform-native transitions.

```tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Navigate
function HomeScreen({ navigation }) {
  return <Button title="Go" onPress={() => navigation.navigate('Details', { id: 42 })} />;
}

// Read params
function DetailsScreen({ route }) {
  const { id } = route.params;
  return <Text>ID: {id}</Text>;
}
```

### Typed navigation (TypeScript)

```tsx
type RootStackParamList = {
  Home: undefined;
  Details: { id: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Per-screen typing
type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;
function DetailsScreen({ route, navigation }: Props) {
  const { id } = route.params; // typed as number
}
```

### Tab & Drawer

```tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
```

Nest navigators to mix patterns — a common shape is a **root Stack** containing a **Tab navigator** as one screen, with modal screens pushed on top.

### Navigating without the prop

```tsx
import { useNavigation, useRoute } from '@react-navigation/native';

function DeeplyNested() {
  const navigation = useNavigation();
  return <Button title="Back" onPress={() => navigation.goBack()} />;
}
```

### Expo Router (file-based)

Expo now ships a file-system router inspired by Next.js. Each file under `app/` becomes a route.

```
app/
  index.tsx                 → /
  (tabs)/
    _layout.tsx             → tab navigator
    home.tsx                → /home
    profile.tsx             → /profile
  user/[id].tsx             → /user/123
```

```tsx
// app/index.tsx
import { Link } from 'expo-router';
export default function Home() {
  return <Link href="/user/42">View user 42</Link>;
}
```

File-based routing gives you typed links, automatic deep linking, and simpler mental model — strongly recommended for new Expo apps.

---

## 8. State Management in Mobile Apps

The same options as React on web, with mobile-specific considerations for offline, cold-start, and cross-app sync.

| Option | When to use |
|---|---|
| `useState` / `useReducer` | Component-local state |
| Context | Shallow app-wide state (theme, user, locale) |
| **Zustand** | Small global stores without boilerplate — increasingly popular for RN |
| **Redux Toolkit** | Large apps with complex state; works identically to web |
| **TanStack Query** | Server state, caching, background refetch |
| **Jotai / Valtio** | Atomic / proxy-based state for fine-grained reactivity |
| **MobX** | Observable state, minimal boilerplate |

### Mobile-specific considerations

- **Cold start**: restoring state from storage (AsyncStorage) before first paint may flash an empty screen. Use `SplashScreen.preventAutoHideAsync()` while rehydrating.
- **Background/foreground transitions**: listen to `AppState` and decide whether to refetch. TanStack Query has `focusManager.setEventListener` for this.
- **Offline**: persist mutations and replay. `@tanstack/query-persist-client` + MMKV/AsyncStorage storage adapter is a clean pattern.

```tsx
import { AppState } from 'react-native';
import { focusManager } from '@tanstack/react-query';

AppState.addEventListener('change', (status) => {
  focusManager.setFocused(status === 'active');
});
```

---

## 9. Platform APIs

### Platform module

```tsx
import { Platform } from 'react-native';

Platform.OS            // 'ios' | 'android' | 'web' | 'windows' | 'macos'
Platform.Version       // iOS: string '16.4', Android: number 33
Platform.isTV
Platform.isPad         // iOS only
Platform.constants     // native constants
```

### Platform-specific files

Metro automatically picks the right variant:

```
Button.tsx           // shared fallback
Button.ios.tsx       // iOS-only
Button.android.tsx   // Android-only
```

### StatusBar

```tsx
import { StatusBar } from 'react-native';

<StatusBar barStyle="dark-content" backgroundColor="white" translucent />
```

With Expo, prefer `expo-status-bar` which handles platform quirks.

### Appearance (dark mode)

```tsx
import { useColorScheme } from 'react-native';

function App() {
  const scheme = useColorScheme();  // 'light' | 'dark' | null
  const theme = scheme === 'dark' ? darkTheme : lightTheme;
}
```

### BackHandler (Android)

Android has a hardware back button / gesture. Intercept it when you need to confirm navigation, close a modal, etc.

```tsx
import { BackHandler } from 'react-native';

useEffect(() => {
  const sub = BackHandler.addEventListener('hardwareBackPress', () => {
    if (canGoBack) { navigate(); return true; } // true = handled
    return false;
  });
  return () => sub.remove();
}, []);
```

React Navigation already integrates this; only override when outside the navigation flow.

### Linking

```tsx
import { Linking } from 'react-native';

await Linking.openURL('https://example.com');
await Linking.openURL('tel:+15551234567');
await Linking.openURL('mailto:hi@example.com');
```

### Clipboard, Share, Vibration

```tsx
import * as Clipboard from 'expo-clipboard';
import { Share, Vibration } from 'react-native';

await Clipboard.setStringAsync('hi');
await Share.share({ message: 'Check this out' });
Vibration.vibrate(400);
```

---

## 10. Handling Keyboard & Safe Areas

### Safe Area

Modern phones have notches, dynamic islands, rounded corners, and gesture bars. You must pad content into the **safe area** so nothing gets clipped.

```tsx
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// Wrap once at the top
<SafeAreaProvider>
  <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
    <App />
  </SafeAreaView>
</SafeAreaProvider>

// Or compute insets manually
function Screen() {
  const insets = useSafeAreaInsets();
  return <View style={{ paddingTop: insets.top }} />;
}
```

**Don't use the built-in `SafeAreaView` from `react-native`** — it's iOS-only and brittle. Always prefer `react-native-safe-area-context`.

### KeyboardAvoidingView

When a text field is at the bottom of the screen, the keyboard covers it. Wrap the screen:

```tsx
import { KeyboardAvoidingView, Platform } from 'react-native';

<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
  keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}  // header height
>
  {/* form */}
</KeyboardAvoidingView>
```

### Dismiss keyboard on tap

```tsx
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
  <View style={{ flex: 1 }}>
    {/* screen */}
  </View>
</TouchableWithoutFeedback>
```

---

## 11. Networking & Data Fetching

### fetch

`fetch` is built in (a polyfill over XHR on older RN versions, native on new arch).

```tsx
const res = await fetch('https://api.example.com/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Alice' }),
});
const data = await res.json();
```

### Axios

Gives interceptors, timeouts, and cancellation with less ceremony.

```tsx
import axios from 'axios';

const api = axios.create({ baseURL: 'https://api.example.com', timeout: 10000 });

api.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### TanStack Query — strongly recommended for mobile

Server state is the hardest part of a mobile app: caching, deduping, revalidation on foreground, offline, retries. TanStack Query solves all of this.

```tsx
import { useQuery } from '@tanstack/react-query';

function Feed() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['feed'],
    queryFn: () => fetch('/api/feed').then(r => r.json()),
    staleTime: 60_000,
  });
}
```

### WebSockets

```tsx
const ws = new WebSocket('wss://example.com/stream');
ws.onopen = () => ws.send('hi');
ws.onmessage = (e) => console.log(e.data);
ws.onerror = (e) => console.error(e);
ws.onclose = () => console.log('closed');
```

### Certificate pinning

For high-security apps, use `react-native-ssl-pinning` or platform-specific pinning to prevent MITM even on compromised CAs.

### HTTP gotchas

- **Android cleartext HTTP** is blocked by default since Android 9. You must allow your domain in `network_security_config.xml` or use HTTPS.
- **iOS ATS** requires HTTPS by default; exceptions go in `Info.plist` (`NSAppTransportSecurity`).
- **Timeout**: `fetch` has no default timeout. Wrap with `AbortController` or use `axios`.

---

## 12. Persistent Storage

| Tool | Use case |
|---|---|
| **AsyncStorage** | Small key/value, async — settings, flags |
| **MMKV** (`react-native-mmkv`) | Same use case, **synchronous**, ~30× faster, encryption support |
| **SecureStore** (`expo-secure-store`) | Keychain / Keystore — tokens, secrets |
| **SQLite** (`expo-sqlite`, `op-sqlite`) | Relational data, queries, migrations |
| **WatermelonDB** | Offline-first DB built for RN, reactive queries |
| **Realm** | Object DB with sync support |
| **File system** (`expo-file-system`) | Files, blobs, downloads |

### AsyncStorage

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

await AsyncStorage.setItem('@token', 'abc123');
const token = await AsyncStorage.getItem('@token');
await AsyncStorage.removeItem('@token');
```

### MMKV (preferred for modern apps)

```tsx
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();
storage.set('token', 'abc123');   // sync
const token = storage.getString('token');
```

Why MMKV: AsyncStorage is JSON-file-based, async, and painfully slow for many reads. MMKV is memory-mapped and synchronous — you can use it at startup without awaiting.

### Secure tokens

Auth tokens should **never** live in AsyncStorage (it's unencrypted). Use SecureStore / Keychain:

```tsx
import * as SecureStore from 'expo-secure-store';

await SecureStore.setItemAsync('accessToken', token);
const token = await SecureStore.getItemAsync('accessToken');
```

---

## 13. Forms & TextInput

RN does not ship a form library. Common choices: `react-hook-form` (lightest, most popular), `formik`.

```tsx
import { useForm, Controller } from 'react-hook-form';

function LoginForm() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '' },
  });

  return (
    <>
      <Controller
        control={control}
        name="email"
        rules={{ required: 'Email is required', pattern: /\S+@\S+\.\S+/ }}
        render={({ field: { onChange, value, onBlur } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
      />
      {errors.email && <Text>{errors.email.message}</Text>}
      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </>
  );
}
```

### TextInput refs — focusing next field

```tsx
const passwordRef = useRef<TextInput>(null);

<TextInput returnKeyType="next" onSubmitEditing={() => passwordRef.current?.focus()} />
<TextInput ref={passwordRef} secureTextEntry returnKeyType="done" onSubmitEditing={handleSubmit} />
```

---

## 14. Images & Media

### Remote image + placeholder + cache

Built-in `Image` has weak caching and no placeholder support. Use **`expo-image`** (or `react-native-fast-image` for bare apps):

```tsx
import { Image } from 'expo-image';

<Image
  source={{ uri: 'https://example.com/pic.jpg' }}
  placeholder={blurhash}
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk"
  style={{ width: 200, height: 200 }}
/>
```

### Local assets

```tsx
<Image source={require('./assets/logo.png')} />
```

`require` resolves asset hashes at build time — this is how the bundler ships images.

### Video

```tsx
import { Video, ResizeMode } from 'expo-av';

<Video
  source={{ uri: 'https://example.com/clip.mp4' }}
  useNativeControls
  resizeMode={ResizeMode.CONTAIN}
  shouldPlay
  isLooping
  style={{ width: 320, height: 180 }}
/>
```

### Picking images / camera

```tsx
import * as ImagePicker from 'expo-image-picker';

const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  quality: 0.8,
});
if (!result.canceled) setUri(result.assets[0].uri);
```

---

## 15. Animations

### Animated API (built-in)

The classic RN animation system. Uses JS values that can be driven natively with `useNativeDriver: true`.

```tsx
import { Animated } from 'react-native';

const opacity = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.timing(opacity, {
    toValue: 1,
    duration: 400,
    useNativeDriver: true,        // run on UI thread, bypasses JS
  }).start();
}, []);

<Animated.View style={{ opacity }}>
  <Text>Fading in</Text>
</Animated.View>
```

**`useNativeDriver: true` requirement**: only works for transform and opacity. Layout properties (width, height, padding, backgroundColor) **cannot** use the native driver — they'd need to trigger layout each frame, which requires the JS thread.

### Reanimated (recommended for serious animations)

`react-native-reanimated` v3+ runs animations on the UI thread using worklets — JS functions that execute natively at 60/120 fps.

```tsx
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const scale = useSharedValue(1);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));

<Animated.View style={animatedStyle}>
  <Pressable onPressIn={() => (scale.value = withSpring(0.95))} onPressOut={() => (scale.value = withSpring(1))}>
    <Text>Press</Text>
  </Pressable>
</Animated.View>
```

### LayoutAnimation

Simple animator for the next layout change.

```tsx
import { LayoutAnimation, UIManager, Platform } from 'react-native';

if (Platform.OS === 'android') UIManager.setLayoutAnimationEnabledExperimental?.(true);

LayoutAnimation.easeInEaseOut();
setItems(items.filter(i => i.id !== id));
```

---

## 16. Gestures

### PanResponder (legacy, built-in)

Low-level gesture recognizer. Works but is painful for complex gestures.

```tsx
const pan = useRef(new Animated.ValueXY()).current;
const responder = PanResponder.create({
  onStartShouldSetPanResponder: () => true,
  onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
  onPanResponderRelease: () => Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start(),
}).current;

<Animated.View style={pan.getLayout()} {...responder.panHandlers}>
  <Text>Drag me</Text>
</Animated.View>
```

### react-native-gesture-handler (recommended)

Runs on the UI thread, composable, much better performance.

```tsx
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

const tx = useSharedValue(0);
const pan = Gesture.Pan().onChange((e) => { tx.value += e.changeX; });
const style = useAnimatedStyle(() => ({ transform: [{ translateX: tx.value }] }));

<GestureDetector gesture={pan}>
  <Animated.View style={style}><Text>Drag</Text></Animated.View>
</GestureDetector>
```

You must wrap your app in `<GestureHandlerRootView style={{ flex: 1 }}>` once at the top.

---

## 17. Permissions & Device APIs

Mobile OSes require **runtime permissions** for sensitive APIs: camera, location, microphone, contacts, photos, notifications.

### Pattern

1. Declare intent in native config (`Info.plist` usage strings, `AndroidManifest.xml` permissions).
2. Request at **use time**, not app start — users grant more often.
3. Gracefully handle "denied" and "permanently denied" states.

```tsx
import * as Location from 'expo-location';

async function getLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Location permission required');
    return;
  }
  const loc = await Location.getCurrentPositionAsync({});
  setCoords(loc.coords);
}
```

### Common APIs

| API | Expo module | Bare RN package |
|---|---|---|
| Camera | `expo-camera` | `react-native-vision-camera` |
| Location | `expo-location` | `react-native-geolocation-service` |
| Contacts | `expo-contacts` | `react-native-contacts` |
| Notifications | `expo-notifications` | `@notifee/react-native` |
| Biometrics | `expo-local-authentication` | `react-native-biometrics` |
| Haptics | `expo-haptics` | `react-native-haptic-feedback` |

### iOS usage strings (Info.plist)

Required for App Store submission. Missing strings = rejection.

```xml
<key>NSCameraUsageDescription</key>
<string>We use the camera to scan receipts.</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>We show nearby stores.</string>
```

In Expo, add these via `app.json`:

```json
{ "expo": { "ios": { "infoPlist": { "NSCameraUsageDescription": "..." } } } }
```

---

## 18. Push Notifications

Mobile push requires integration with FCM (Android) and APNs (iOS). Expo abstracts this end-to-end via its push service; bare apps usually integrate Firebase Cloud Messaging directly.

### Expo push (happy path)

```tsx
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

async function registerForPush() {
  if (!Device.isDevice) return null;
  const { status: existing } = await Notifications.getPermissionsAsync();
  let status = existing;
  if (existing !== 'granted') {
    ({ status } = await Notifications.requestPermissionsAsync());
  }
  if (status !== 'granted') return null;

  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  return token;  // send to your backend
}

// Foreground handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: false,
  }),
});

// Tap handler
const sub = Notifications.addNotificationResponseReceivedListener(r => {
  navigate(r.notification.request.content.data.screen);
});
```

### Server-side (Expo)

```ts
await fetch('https://exp.host/--/api/v2/push/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ to: token, title: 'Hi', body: 'Hello', data: { screen: 'Inbox' } }),
});
```

### Bare RN

Use Firebase Cloud Messaging via `@react-native-firebase/messaging` for Android, and APNs directly or via a provider (OneSignal, Customer.io) for iOS.

---

## 19. Deep Linking

Deep links let URLs (`myapp://user/42`) and universal / app links (`https://myapp.com/user/42`) open your app to a specific screen.

### URL scheme — in app.json

```json
{ "expo": { "scheme": "myapp" } }
```

### Handling in React Navigation

```tsx
const linking = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: {
    screens: {
      Home: '',
      User: 'user/:id',
    },
  },
};

<NavigationContainer linking={linking}>...</NavigationContainer>
```

### Universal links / App links

- **iOS (Universal Links)**: host an `apple-app-site-association` JSON file at `https://yourdomain.com/.well-known/apple-app-site-association`.
- **Android (App Links)**: host `.well-known/assetlinks.json`, enable auto-verify in `AndroidManifest.xml`.

Universal links open the app when installed, the browser when not — no custom scheme prompt.

### Testing

```bash
# iOS simulator
xcrun simctl openurl booted "myapp://user/42"

# Android emulator
adb shell am start -W -a android.intent.action.VIEW -d "myapp://user/42"
```

---

## 20. Native Modules & Bridging

When JavaScript alone isn't enough (BLE, AR, specialized SDKs), you write a **native module** exposing Swift/Kotlin methods to JS.

### Old architecture (NativeModules)

```kotlin
// Android — MyModule.kt
class MyModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
  override fun getName() = "MyModule"

  @ReactMethod
  fun getDeviceId(promise: Promise) {
    promise.resolve(Build.ID)
  }
}
```

```swift
// iOS — MyModule.swift
@objc(MyModule)
class MyModule: NSObject {
  @objc(getDeviceId:rejecter:)
  func getDeviceId(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    resolve(UIDevice.current.identifierForVendor?.uuidString)
  }
}
```

```tsx
// JS
import { NativeModules } from 'react-native';
const id = await NativeModules.MyModule.getDeviceId();
```

### New architecture (TurboModules)

Same idea but with codegen'd types and **synchronous calls via JSI**. You write a TypeScript spec, run codegen, and implement the native side. Massively faster for hot paths.

### Expo modules

`expo-modules-core` gives you a modern, cross-platform native module API that works with both arches out of the box. If you're on Expo, write Expo Modules — not classic NativeModules.

---

## 21. New Architecture — JSI, Fabric, TurboModules, Hermes

RN has been transitioning from the **bridge** to the **new architecture** since 2021. As of RN 0.76 it is the default. All four pieces work together:

### JSI (JavaScript Interface)

A lightweight C++ API that lets the JS engine directly hold references to C++ host objects and call their methods synchronously. Replaces the async, JSON-serialized bridge.

**Consequence**: you can now call a native function from JS and get the return value inline, no `await` needed.

### TurboModules

The new native-module system built on JSI. Modules are loaded lazily on first use (old modules loaded eagerly at app start → slower startup). Types are generated from a TypeScript spec.

### Fabric

The new rendering system. It:
- Builds the shadow tree (layout) in C++ directly, not via the bridge.
- Renders synchronously when possible — gesture-driven transforms no longer wait on the JS thread.
- Enables **concurrent React** features (transitions, Suspense) to work correctly.

### Hermes

A JS engine purpose-built for mobile by Meta. Ships bytecode so apps start faster; lower memory; smaller binary. Default since RN 0.70.

**Comparison (classic Hermes vs JSC)**: Hermes TTI ~35% faster on Android, APK ~30% smaller, heap ~30% smaller. Trade-off: no `Function.prototype.toString` code inspection, stricter spec conformance.

### Bridgeless mode

Removes the legacy bridge entirely. Requires the new arch to be fully enabled and all modules migrated. Default in RN 0.76+ for Expo SDK 52+.

### Impact summary

| Aspect | Old arch | New arch |
|---|---|---|
| JS↔native calls | Async, serialized | Sync-capable, zero-copy |
| Module loading | Eager | Lazy |
| Layout & rendering | Bridge roundtrip | C++ direct |
| Concurrent React | Partial | Full support |

---

## 22. Performance Optimization

### Measure first

Don't optimize without data. Use:
- **React DevTools Profiler** — component renders, wasted renders.
- **Flipper / React Native DevTools** — JS thread, bridge traffic.
- **Xcode Instruments** / **Android Systrace** — UI thread frame drops.
- **Perf Monitor** — shake → Perf Monitor, shows JS FPS and UI FPS.

### Common wins

1. **Virtualize lists** — `FlatList` + proper `keyExtractor` + `getItemLayout`. Never `map` over 100+ items.
2. **Memoize row components** — `React.memo`, stable `renderItem` and callbacks with `useCallback`.
3. **Avoid inline arrow props on memoized children** — new reference each render defeats memoization.
4. **Native driver for animations** — `useNativeDriver: true` for transform / opacity; use Reanimated for layout.
5. **Images** — resize server-side, use `expo-image`, provide dimensions to avoid re-layout.
6. **Hermes** — enable it (it's default now).
7. **InteractionManager** — defer expensive work until after the transition / animation.
8. **Lazy screens** — `createNativeStackNavigator` already lazy-mounts by default. For tab navigator, use `lazy: true`.
9. **Profiling flag** — `Profiler` component to measure actual-duration of a subtree.

```tsx
import { InteractionManager } from 'react-native';

useEffect(() => {
  const handle = InteractionManager.runAfterInteractions(() => {
    // heavy work — e.g., parse large JSON — runs after transition completes
  });
  return () => handle.cancel();
}, []);
```

### Startup optimization

- Hermes bytecode → faster parse.
- Avoid `require('big-package')` at module top level if the screen is rarely used — lazy-require inside functions.
- Split your dependency graph — `import('./heavy-module').then(...)` works with Metro.
- Use `react-native-bootsplash` or `expo-splash-screen` to hide cold-start jank.

### Re-render discipline

- Keep state as local as possible. Global Context that changes often re-renders every consumer.
- Split Context into read-value and setter to avoid coupling.
- For large forms, `react-hook-form` is uncontrolled → far fewer re-renders than controlled Formik.

---

## 23. Debugging & Dev Tools

### React Native DevTools (new, RN 0.76+)

Opens in Chrome DevTools, connects directly to Hermes. Supports breakpoints, console, network, performance profile. Launch with `j` from the Metro terminal.

### React DevTools

```bash
npx react-devtools
```

Inspect component tree, props, state, hook values. Profiler tab shows renders.

### Flipper (legacy but still useful)

Desktop app with plugins: layout inspector, network, Redux, AsyncStorage, crash reporter.

### LogBox

Yellow / red boxes in dev. Suppress known warnings with:

```tsx
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Setting a timer']);
```

### Debugging native crashes

- **iOS**: Xcode → Window → Devices and Simulators → View Device Logs.
- **Android**: `adb logcat *:E` for errors, or Android Studio Logcat.
- Sentry (`@sentry/react-native`) and Crashlytics for production crash reports including both JS stack and native stack.

### Fast Refresh

Enabled by default. Saves a file → state-preserving reload. Class components lose state on Fast Refresh; function components with hooks preserve it.

---

## 24. Testing React Native Apps

### Jest + React Native Testing Library (component tests)

```tsx
import { render, fireEvent, screen } from '@testing-library/react-native';
import Counter from './Counter';

test('increments counter on press', () => {
  render(<Counter />);
  const button = screen.getByText('Increment');
  fireEvent.press(button);
  expect(screen.getByText('Count: 1')).toBeTruthy();
});
```

Key differences from web RTL: `fireEvent.press` (not `click`), queries match `accessibilityLabel` / `testID` (not `data-testid`), no DOM — snapshots are JSON trees.

### Mocking native modules

Most native-backed libs need mocks:

```js
// jest.setup.js
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
```

### E2E — Detox or Maestro

- **Detox** (Wix) — runs full app on simulator/emulator, syncs with RN internals to avoid flaky `sleep`s. iOS + Android.
- **Maestro** — YAML-based flows, extremely fast to write, works on real builds without instrumentation.

```yaml
# flow.yaml (Maestro)
appId: com.myapp
---
- launchApp
- tapOn: "Sign in"
- inputText: "alice@example.com"
- tapOn: "Continue"
- assertVisible: "Welcome, Alice"
```

See the Jest & React Testing Library guide for patterns that carry over directly.

---

## 25. Build, Release & App Stores

### Expo — EAS Build

Cloud build service for iOS and Android without Xcode/Studio locally.

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform all
eas submit --platform ios
```

Profiles live in `eas.json`:

```json
{
  "build": {
    "development": { "developmentClient": true, "distribution": "internal" },
    "preview":     { "distribution": "internal" },
    "production":  {}
  }
}
```

### Bare RN — local builds

- **iOS**: open `ios/MyApp.xcworkspace` → Archive → Distribute. Requires Apple Developer account + signing certificates.
- **Android**: `cd android && ./gradlew bundleRelease` → `.aab` in `android/app/build/outputs/bundle/release`.

### Signing

- **iOS**: Apple-issued distribution certificate + provisioning profile. Expo EAS manages this automatically.
- **Android**: a keystore you generate once. **Never lose it** — losing the upload key permanently locks you out of updating your Play listing (there's a key-reset flow but it's painful).

### App Store & Play Store

- **iOS** review: typically 24–48 hours. Common rejections: missing Info.plist usage strings, crash on reviewer's device, subscription disclosure, privacy manifest.
- **Android**: faster. Requires a privacy policy URL, content rating, data-safety form.

### Versioning

- `version` (semver) — user-visible.
- `buildNumber` (iOS) / `versionCode` (Android) — monotonically increasing integer each submission.

---

## 26. Over-the-Air Updates

A superpower of React Native: you can ship JS & asset changes without going through the app stores (as long as there are no native changes).

### EAS Update (Expo)

```bash
eas update --branch production --message "Fix crash on boot"
```

Users receive the update on next launch.

### CodePush (App Center)

Microsoft's alternative. Active but deprioritized — EAS Update is the modern choice on Expo.

### Rules (both iOS and Android)

You **cannot** change:
- Native code (adding a new native dependency)
- Permissions / entitlements
- App icon / splash (on iOS, part of the binary)

You **can** change:
- React components, JS logic, styles
- Bundled JS assets (images, fonts)
- API endpoints, config

### Staging / rollout

EAS Update has channels and percentage rollouts. Roll 5% → monitor → 25% → 100%. If something's wrong, republish the previous update or revert via dashboard.

---

## 27. Accessibility

Accessibility is not optional — both stores test for it, and millions of users rely on VoiceOver (iOS) and TalkBack (Android).

### Labels & roles

```tsx
<Pressable
  accessible
  accessibilityRole="button"
  accessibilityLabel="Submit form"
  accessibilityHint="Sends your answers to the server"
  accessibilityState={{ disabled: isSubmitting }}
  onPress={submit}
>
  <Text>Submit</Text>
</Pressable>

<Image
  source={{ uri }}
  accessible
  accessibilityLabel="Profile photo of Alice"
/>
```

### Dynamic type / font scaling

iOS and Android let users scale system font size. By default RN scales your `Text` — sometimes you don't want that (e.g., a logo).

```tsx
<Text allowFontScaling={false}>LOGO</Text>
<Text maxFontSizeMultiplier={1.5}>Capped growth</Text>
```

### Reduce motion

```tsx
import { AccessibilityInfo } from 'react-native';

const reduce = await AccessibilityInfo.isReduceMotionEnabled();
if (!reduce) playFancyAnimation();
```

### Screen reader events

```tsx
AccessibilityInfo.announceForAccessibility('Saved');
```

---

## 28. Internationalization (i18n)

### i18n-js or react-i18next

```bash
npm install i18next react-i18next expo-localization
```

```ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: { hello: 'Hello {{name}}' } },
    es: { translation: { hello: 'Hola {{name}}' } },
  },
  lng: getLocales()[0].languageCode,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});
```

```tsx
import { useTranslation } from 'react-i18next';

function Greeting({ name }) {
  const { t } = useTranslation();
  return <Text>{t('hello', { name })}</Text>;
}
```

### RTL support

Arabic, Hebrew, Urdu etc. read right-to-left. RN supports this via `I18nManager`:

```tsx
import { I18nManager } from 'react-native';

// At app start, for the user's locale
I18nManager.forceRTL(isRTL);  // requires restart
```

Use logical properties (`start`/`end` instead of `left`/`right`) so layouts flip automatically:

```tsx
<View style={{ paddingStart: 16 }} />  // paddingLeft in LTR, paddingRight in RTL
```

### Dates, numbers, currency

Use `Intl` (works in Hermes as of RN 0.70+):

```ts
new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(1234.5);
```

---

## 29. Common Pitfalls & Best Practices

1. **Forgetting `flex: 1` on ancestors** — screen renders blank. A `View` without a size collapses to 0.
2. **String outside `<Text>`** — `Text strings must be rendered within a <Text> component` error. Common when mixing literal strings into a `<View>`.
3. **Using `position: fixed`** — doesn't exist. Use `position: 'absolute'` on a root-level container.
4. **Using `SafeAreaView` from `react-native`** — broken on Android. Use `react-native-safe-area-context`.
5. **`onPress` firing twice on Android** — debounce rapid taps or disable the button during async work.
6. **Images without explicit size** — remote images won't render. Always pass `width` & `height` (or `flex: 1` with a sized parent).
7. **State updates in unmounted components** — use cleanup; TanStack Query / `AbortController` solves this.
8. **Inline styles in hot render paths** — every render creates a new object; defeats StyleSheet optimization and memo.
9. **Not handling keyboard on iOS** — `KeyboardAvoidingView` with `behavior="padding"` is required.
10. **Forgetting iOS usage strings** — App Store rejection when accessing camera, location, photos without `NSXxxUsageDescription`.
11. **Running heavy work on the JS thread** — use `InteractionManager`, `requestIdleCallback`, or offload to a worklet / native module.
12. **Lost Android keystore** — no path back to updating your Play Store listing. Back it up in a vault.
13. **Mutating state in FlatList data** — if `data` is a new reference every render, the list will re-render. Memoize the array.
14. **Not testing on real devices** — simulators don't show real performance, cellular conditions, push tokens, or biometrics.
15. **Blocking the UI thread with synchronous native work** — long JSI calls during scroll will drop frames. Prefer async on hot paths.

---

## 30. Interview Questions & Answers

### Beginner (Core concepts, components, basic styling)

**Q1: What is React Native and how does it differ from a web React app?**

React Native is a framework for building cross-platform mobile apps using React and JavaScript, where components render to **real native views** (`UIView` on iOS, `View` on Android) — not HTML in a web view. Key differences from web React: no DOM (no `<div>`, `<img>`, CSS selectors), a fixed set of primitives (`View`, `Text`, `Image`, etc.), styles are JS objects with no cascade, layout defaults to Flexbox column, and you ship to app stores instead of a URL. The same React mental model (components, hooks, props) carries over, but platform APIs, navigation, and deployment are all mobile-specific.

---

**Q2: How does React Native bridge JavaScript and native code?**

Historically via the **bridge**: JS and native ran on separate threads and exchanged asynchronous, serialized JSON messages. Every call crossed a queue and paid serialization cost, which caused jank on complex UIs. The **new architecture** replaces this with JSI (JavaScript Interface), a C++ layer letting JS hold direct references to native host objects. Calls can now be synchronous, there's no serialization, and rendering is handled by Fabric (a C++ renderer) with TurboModules providing lazy-loaded native modules. Hermes (default JS engine) completes the stack.

---

**Q3: What is the difference between `View` and `ScrollView`?**

`View` is the base container primitive — a non-scrolling box mapping to `UIView` / `ViewGroup`. `ScrollView` wraps children in a scrollable region but renders **all children immediately**, which is fine for short content but wastes memory on long lists. For lists, use `FlatList` / `SectionList`, which are virtualized and mount only the items currently on screen.

---

**Q4: Why must text be wrapped in a `<Text>` component?**

Because native text rendering (`UILabel` on iOS, `TextView` on Android) is not the same primitive as a layout container. React Native enforces the distinction: you cannot put a raw string child inside a `<View>`. If you do, RN throws `Text strings must be rendered within a <Text> component`. Styling also differs — `Text` styles like `fontSize`, `fontWeight`, `lineHeight` don't apply to `View`, and `Text` is the only component where styles inherit to nested `Text` children.

---

**Q5: What is `StyleSheet.create`, and why use it instead of inline styles?**

`StyleSheet.create` is a helper that validates style objects and historically returned opaque IDs the native side could look up without re-sending the full object across the bridge. On the new architecture this specific optimization matters less, but the convention persists because: styles live once per module (not re-created every render), properties are type-checked, and some tooling warnings rely on it. Inline styles are fine for small one-offs but allocate a new object every render — for large trees or memoized children that relies on referential equality, this matters.

---

**Q6: How does Flexbox in React Native differ from the web?**

Two key defaults flip: `flexDirection` defaults to `column` (vs `row` on web), and `alignContent` defaults to `flex-start` (vs `stretch`). `flexShrink` defaults to `0`. Otherwise it's the same Yoga-based Flexbox. There's no CSS Grid; no `display: block` / `inline`; no floats. For absolute positioning, `position: 'absolute'` works as expected but there is no `fixed` — the closest equivalent is absolute positioning from an app-root container.

---

**Q7: What's the difference between Expo and the bare React Native CLI?**

**Expo** is a framework + managed toolchain on top of RN. It pre-bundles a big set of native modules, lets you develop without Xcode/Android Studio (via Expo Go), builds in the cloud with EAS, and supports OTA updates out of the box. **Bare RN** (`@react-native-community/cli`) gives you the raw `ios/` and `android/` folders, maximum flexibility, but you own every native dependency. For most projects today, Expo is the right default; drop to bare when you need a native library Expo doesn't support or need to embed RN inside an existing native app.

---

**Q8: What is Hermes and why use it?**

Hermes is a JavaScript engine built by Meta specifically for React Native on mobile. It ships **pre-compiled bytecode** (no runtime parse), uses significantly less memory, and has smaller binary size. Benchmarks show ~30–40% faster time-to-interactive on Android vs JavaScriptCore. It's the default engine since RN 0.70. Trade-offs: `Function.prototype.toString` doesn't return source, some spec edge cases are stricter.

---

**Q9: How do you handle different platforms (iOS vs Android) in code?**

Three main patterns:

1. **`Platform.OS` checks**: `Platform.OS === 'ios' ? iosValue : androidValue`.
2. **`Platform.select({ ios: ..., android: ... })`**: cleaner for style objects.
3. **Platform-specific files**: `Button.ios.tsx` and `Button.android.tsx` — Metro picks automatically at import.

For larger divergences (e.g., different navigation flows), platform files keep the branching out of component code.

---

**Q10: What is the safe area and how do you handle it?**

The safe area is the region of the screen not obscured by the notch, dynamic island, status bar, home indicator, or navigation bar. You **must** pad content into the safe area or UI clips. Use `react-native-safe-area-context` — wrap your app in `<SafeAreaProvider>` and either use `<SafeAreaView>` or call `useSafeAreaInsets()` to get exact top/bottom/left/right insets. Do **not** use the built-in `SafeAreaView` from `react-native`; it's iOS-only and doesn't handle Android's navigation gesture bars.

---

### Intermediate (Lists, navigation, state, networking)

**Q11: How do you optimize a `FlatList` rendering 10,000 items?**

Several levers, ordered by impact:

1. **`keyExtractor`** — stable, unique keys prevent needless re-renders on reorder.
2. **`getItemLayout`** — when item height is known, lets RN skip measurement and enables instant scroll-to-index.
3. **Memoize `renderItem`** with `useCallback` and wrap row components in `React.memo`.
4. **`initialNumToRender`** low (e.g., 6) for faster first paint; tune `maxToRenderPerBatch` and `windowSize` based on device and row complexity.
5. **`removeClippedSubviews`** on Android to drop off-screen views from the view hierarchy.
6. **Consider FlashList** (`@shopify/flash-list`) — it has better recycling and typically 2–5× smoother scroll on complex rows. Drop-in API with a mandatory `estimatedItemSize`.

The two most common mistakes are inline callbacks (new reference every render) and recreating the `data` array unnecessarily.

---

**Q12: How does React Navigation work, and what's the difference between `navigate` and `push`?**

React Navigation is a library of navigators (stack, tabs, drawer) that integrate native transitions and gestures via `react-native-screens`. You declare screens in a navigator config and imperatively move between them using the `navigation` object.

`navigation.navigate('Details', params)` — if the screen is already in the stack, it **updates** its params and brings it forward. `navigation.push('Details', params)` — always pushes a new instance, even if `Details` is already on the stack (useful when you want stackable duplicates, like drilling into a user → user → user feed).

Other useful methods: `goBack`, `popToTop`, `replace`, `reset`.

---

**Q13: What is `useNativeDriver: true` in Animated, and when can you use it?**

By default, `Animated` runs the animation on the **JS thread** — each frame computes new values in JS, serializes to native, and triggers a render. A heavy JS thread (large lists, complex renders) drops animation frames. `useNativeDriver: true` moves the animation to the **UI thread**: JS declares the interpolation once, and the native side ticks 60/120 fps independently. Limitation: only **transform and opacity** are supported — layout properties (width, height, padding, backgroundColor) require a layout pass and must stay on the JS side. For those, use **Reanimated**, which runs animations as worklets on the UI thread even for layout.

---

**Q14: How do you persist state across app launches?**

For non-sensitive key/value: **AsyncStorage** (simple, async) or **MMKV** (fast, synchronous). For secrets like auth tokens: **SecureStore** (iOS Keychain / Android Keystore) — AsyncStorage stores tokens in plaintext. For structured data: **SQLite** (`expo-sqlite`) or an ORM like **WatermelonDB** (offline-first, reactive queries). For hybrid online/offline with sync: **Realm** or a custom queued-mutation pattern with TanStack Query persisters. Cold-start rehydration should happen while the splash screen is visible (`SplashScreen.preventAutoHideAsync()`), else the user sees a flash of empty state.

---

**Q15: What is a native module and when would you write one?**

A native module is a Swift/Kotlin/Objective-C/Java class exposed to JavaScript. You write one when:

1. You need an OS API RN doesn't wrap (e.g., a specific Bluetooth protocol, payment SDK, AR framework).
2. A third-party SDK only ships a native library.
3. You need performance-critical work (image processing, crypto) too slow in JS.

On the **old arch**, you extend `ReactContextBaseJavaModule` / inherit `NSObject`, register methods with `@ReactMethod` / `RCT_EXPORT_METHOD`, and JS calls them through `NativeModules.YourModule.method()`. On the **new arch**, you write a **TurboModule**: declare a TypeScript spec, run codegen, and implement the generated protocol. TurboModules are lazy-loaded and support synchronous JSI calls. In Expo, use Expo Modules for a simpler cross-platform API.

---

**Q16: How do deep links work in React Native?**

A deep link is a URL that opens your app on a specific screen. Two flavors:

1. **Custom schemes** (`myapp://user/42`) — simplest, always opens the app if installed, but the URL isn't usable in a browser.
2. **Universal Links (iOS) / App Links (Android)** — real HTTPS URLs (`https://myapp.com/user/42`) that open the app if installed, fall back to the website otherwise. Requires hosting a verification file (`apple-app-site-association` or `assetlinks.json`) at a well-known URL.

With React Navigation, set a `linking` prop on `NavigationContainer` mapping URL patterns to screens. When the OS delivers a URL (fresh launch or wake-from-background), RN parses it and navigates.

---

**Q17: How do you handle keyboard avoidance on iOS and Android?**

iOS overlays the keyboard on top of content — a bottom-aligned text input gets covered. The standard fix is `<KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={headerHeight}>`. Android usually resizes the window automatically (via `android:windowSoftInputMode="adjustResize"`), but some screens still need `behavior="height"` or manual handling. Libraries like `react-native-keyboard-controller` handle both platforms consistently and with smoother animation than the built-in. Also pattern: wrap content in `TouchableWithoutFeedback` + `Keyboard.dismiss` so tapping outside closes the keyboard.

---

**Q18: How do you handle offline behavior in a React Native app?**

Several layers working together:

1. **Detect connectivity** with `@react-native-community/netinfo`.
2. **Cache reads** — TanStack Query with a persister to MMKV/AsyncStorage. Data shows instantly offline, refetches on reconnection.
3. **Queue writes** — store pending mutations locally and replay on reconnect. TanStack Query's mutation persister or a hand-rolled queue.
4. **UI affordance** — banner / toast saying "You're offline".
5. **Optimistic updates** — apply changes locally immediately, roll back on failure.

For fully offline-first apps (Notion, Figma), use a sync engine like **WatermelonDB** or **Realm Sync** — these model conflicts and eventual consistency for you.

---

**Q19: What's the difference between Expo Managed, Expo Prebuild, and Bare workflow?**

- **Managed** (legacy name): you never touch `ios/`/`android/`. All configuration is in `app.json`. Builds happen via EAS. Simplest, fastest to ship.
- **Expo Prebuild** (the modern default): you develop as if managed, but `npx expo prebuild` generates `ios/`/`android/` from config when needed. You can check these in (opt-out of the managed model) or keep regenerating from config (CI-friendly).
- **Bare**: no Expo; you own the native projects from day one via `@react-native-community/cli`. You can still selectively use Expo Modules.

Today the recommended path for almost everyone is **Expo with Prebuild** — you get the ecosystem and EAS, and can drop into native code whenever needed.

---

**Q20: How do push notifications work in React Native?**

Push requires integration with platform services: **APNs** (Apple) and **FCM** (Android). On device, you:

1. Request user permission.
2. Register with the OS and get a device push token.
3. Send the token to your backend.

Your backend sends push payloads to APNs/FCM, which deliver them to the device. In Expo, the **Expo push service** wraps both providers with a single REST API — you just send `POST https://exp.host/--/api/v2/push/send` with an Expo push token. In bare RN, `@react-native-firebase/messaging` handles FCM on Android and wraps APNs on iOS. Foreground notifications require your own UI (OSes silence them by default); background/quit-state notifications are handled by the OS. Tapping a notification can wake the app with the notification's data — use it to deep-link to the relevant screen.

---

### Advanced (Architecture, performance, native integration)

**Q21: Explain the old bridge vs. the new architecture.**

**Old bridge**: JS runs on one thread, native on another. Every call passes through a bridge as an asynchronous JSON-serialized message in a queue. You call `NativeModules.X.method(arg)` → serialize `arg` → queue → deserialize → native runs → serialize result → queue → back to JS. Every frame of gesture-driven animation roundtripped through this.

**New architecture (JSI + Fabric + TurboModules + Hermes)**:

- **JSI** exposes C++ host objects directly to JS. Calls are synchronous, zero-copy.
- **Fabric** renders the shadow tree in C++ directly; layout commits happen synchronously where possible; unlocks correct concurrent React rendering.
- **TurboModules** are JSI-based native modules, lazy-loaded on first use (old modules loaded eagerly → slow startup).
- **Hermes** is the default JS engine with bytecode for fast cold start.

Net result: faster startup, smoother animations under load, less memory, unlocked React 18 concurrent features. It's the default since RN 0.76.

---

**Q22: How do you debug a slow-scrolling list?**

1. **Enable the Perf Monitor** (shake → Perf Monitor). Watch JS FPS vs UI FPS. If JS is low, JS thread is bottlenecking; if UI is low, native rendering is.
2. **React DevTools Profiler** — are rows re-rendering when they shouldn't? Look for "why did this render" reasons.
3. **Check `renderItem` referential stability** — a new function each render breaks `React.memo` on rows.
4. **Provide `getItemLayout`** when rows are same-height; drops measurement cost.
5. **Profile native**: Xcode Instruments → Core Animation, or Android's Systrace / Perfetto. Look for long-running main-thread work (image decoding, layout storms).
6. **Image pipeline** — large remote images decoded on the main thread tank scroll. Resize server-side, use `expo-image` or `FastImage`.
7. **Consider FlashList** if recycling is the bottleneck.

The typical order: fix JS-side re-renders first (cheapest), then image pipeline, then switch list implementation if still not enough.

---

**Q23: What are worklets in Reanimated?**

A worklet is a JavaScript function Reanimated copies onto the **UI thread** and runs there via a separate JS runtime (via JSI). You mark a function as a worklet with `'worklet'` directive (or most Reanimated APIs automatically worklet-ify your callbacks). The UI-thread runtime has no access to React components or most of the JS app — it exists solely to run animation and gesture logic at 60/120 fps independent of the JS thread. You communicate between the two with `runOnJS` (worklet → JS) and `runOnUI`. This is why Reanimated animations don't jank when JS is busy — they literally don't run on the JS thread.

---

**Q24: How does Metro differ from Webpack, and what does it do?**

Metro is RN's bundler. Compared to Webpack:

- **Platform-aware resolution**: `./Button.ios.tsx` resolves only on iOS.
- **Single output per platform**: produces one big JS bundle per platform, not multiple chunks (though code-splitting via async imports is supported).
- **Fast HMR** tailored for RN's `__metro_hmr__` hot-reload protocol.
- **Asset handling**: `require('./logo.png')` produces an asset reference that RN's native layer resolves to a packaged resource.
- **No browser polyfills** — it doesn't bundle `path`, `fs`, `http`.
- **Tree-shaking** is limited compared to modern web bundlers.

Config lives in `metro.config.js`. You rarely touch it except for monorepo setup, SVG transformers, or custom asset types.

---

**Q25: What strategies do you use to reduce app startup time?**

1. **Hermes** — bytecode eliminates JS parse cost at startup.
2. **Lazy-require heavy modules** — `const Heavy = require('./Heavy')` at call site, not module top. Metro bundles eagerly but the require chain isn't evaluated until reached.
3. **Defer work behind `InteractionManager.runAfterInteractions`** so navigation transitions aren't blocked.
4. **Minimize the first-screen render tree** — splash + one simple screen. Fetch and populate lazily.
5. **Preload assets** before the splash dismisses (`expo-asset`).
6. **Disable old-arch modules** — switch to TurboModules so modules load lazily on first use.
7. **Profile with Flashlight / Instruments** — measure TTI on a mid-range Android device, not just iPhone 15.
8. **Reduce bundle size** — tree-shaking, remove unused deps, enable Hermes, inline requires.

Expect a mid-range Android to be ~2× slower than high-end iPhone; optimize for the lowest device you support.

---

**Q26: How do you ship OTA updates safely?**

Using EAS Update (or CodePush), treat each JS-bundle ship like a native release:

1. **Channels**: maintain `staging` and `production` channels; require at least one day of staging use before promoting.
2. **Rollouts**: push to 5% → monitor crash rate and error rate → 25% → 100%. EAS supports this natively.
3. **Pair with your app binary version** — never push a JS bundle that requires a native capability the installed binary lacks. Use `runtimeVersion` to gate compatibility.
4. **Monitoring**: wire Sentry / Crashlytics with release tags per update. If error rate spikes, revert to the prior update via dashboard.
5. **Never** try to push native changes via OTA — you'll ship a JS bundle referring to a method that doesn't exist and the app will crash on launch.

---

**Q27: How would you architect a React Native app for a large team?**

Several orthogonal decisions:

- **Expo + Prebuild** for velocity and OTA updates; bare only if you have specific native needs.
- **Monorepo** (pnpm / Yarn workspaces + Nx or Turborepo) sharing UI, hooks, and API clients with a web app if you have one.
- **Navigation**: `expo-router` for file-based routes, typed links, automatic deep linking.
- **State**: local → Context → Zustand for global client state; TanStack Query for server state.
- **Networking**: Axios + TanStack Query; codegen API types from OpenAPI.
- **Forms**: react-hook-form (uncontrolled, fewer re-renders).
- **Lists**: FlashList by default for anything >50 items.
- **Styling**: StyleSheet + a themed token system (colors/spacing/type scales). Tailwind-like solutions (`nativewind`) if the team prefers utility classes.
- **Tests**: Jest + RNTL for units, Maestro for E2E.
- **CI**: GitHub Actions → EAS Build on merge; lint + type + tests on PR; automatic preview builds for QA.
- **Observability**: Sentry for errors, a product analytics tool, RN performance monitor in dev.
- **Release**: staged rollout via App Store Connect / Play Console + EAS Update channels.

---

**Q28: Explain the difference between controlled and uncontrolled TextInput.**

**Controlled**: `<TextInput value={value} onChangeText={setValue} />` — state lives in React, every keystroke re-renders. Easy to manipulate (mask, truncate) but can stutter on slow devices with heavy parents.

**Uncontrolled**: use a `ref` and read `ref.current?.value` on submit, or wire with `react-hook-form`'s `Controller`. No per-keystroke React renders; smoother on large forms.

For typical forms, controlled is simplest. For performance-critical forms (many fields, keyboard-heavy flows), prefer uncontrolled with `react-hook-form`.

---

**Q29: What's JSI in concrete terms?**

JSI (JavaScript Interface) is a **C++ abstraction over a JS engine**. It defines `jsi::Runtime`, `jsi::Value`, `jsi::Object`, `jsi::Function`, etc., with implementations for Hermes, JSC, V8. You can:

1. **Install host objects**: C++ classes that appear as JS objects. When JS reads a property or calls a method, your C++ code runs synchronously.
2. **Call into JS from C++**: create values, call functions, get return values.

This replaces the legacy bridge's "serialize → enqueue → deserialize" roundtrip. A TurboModule method call becomes a direct C++ vtable call.

Practically: you almost never write raw JSI — you use TurboModule codegen (Expo Modules even more so). But understanding JSI explains **why** the new arch enables sync calls and why it's so much faster.

---

**Q30: How do you prevent a memory leak in a React Native screen?**

Common leaks and fixes:

1. **Forgotten event subscriptions** — `addEventListener` returns a subscription; call `.remove()` or `removeEventListener` in the cleanup. Covers `Keyboard`, `AppState`, `Linking`, `Dimensions`, navigation listeners.
2. **Timers** — `clearTimeout` / `clearInterval` in cleanup.
3. **Fetch requests after unmount** — use `AbortController` or TanStack Query (which handles cancellation).
4. **Animated values bound to unmounted components** — stop animations in cleanup.
5. **Subscribers to global stores** — if you register with a global store (e.g., event bus), unsubscribe.
6. **Native module callbacks** — pass weak refs where possible; be careful with long-lived JNI handles on Android.
7. **Images held in memory** — `expo-image`'s `cachePolicy="memory-disk"` caches aggressively; call `Image.clearMemoryCache()` in low-memory warnings.

Use the Xcode memory graph or Android Studio profiler to confirm — a retained screen after pop usually points to one of the above.

---

## 31. Tricky Questions

### Styling & Layout

---

**Q1: Missing `flex: 1` — what renders?**

```tsx
function App() {
  return (
    <View>
      <View style={{ backgroundColor: 'red' }} />
      <View style={{ flex: 1, backgroundColor: 'blue' }} />
    </View>
  );
}
```

**Output:** A blank screen. Nothing is visible.

The outer `View` has no size and no `flex`, so it collapses to 0×0. The blue child's `flex: 1` resolves against a 0-pixel parent → still 0. The red child has no dimensions at all → 0.

Fix: give the root `<View>` `flex: 1` so it fills the screen. This is the most common "why is my screen blank" bug in RN.

---

**Q2: `flexDirection` default**

```tsx
function App() {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ width: 50, height: 50, backgroundColor: 'red' }} />
      <View style={{ width: 50, height: 50, backgroundColor: 'blue' }} />
    </View>
  );
}
```

**Question:** Are the boxes side-by-side or stacked vertically?

**Output:** **Stacked vertically**.

Unlike the web (where `<div>` defaults to `flex-direction: row` inside a flex container), RN's `View` defaults to `flexDirection: 'column'`. Add `flexDirection: 'row'` to the parent to get the web-like behavior.

---

**Q3: String inside `<View>`**

```tsx
function App() {
  return (
    <View>
      Hello
    </View>
  );
}
```

**Output:** Runtime error: `Text strings must be rendered within a <Text> component.`

React Native enforces native text rendering through the `Text` primitive only. Raw strings are valid JSX children only inside `Text`. Wrap in `<Text>Hello</Text>`.

---

**Q4: Style array order**

```tsx
const styles = StyleSheet.create({
  a: { color: 'red', fontSize: 20 },
  b: { color: 'blue' },
});

<Text style={[styles.a, styles.b]}>Hello</Text>
```

**Question:** What color is the text?

**Output:** **Blue**, fontSize: 20.

Arrays merge left to right — later entries override earlier ones for overlapping keys, and non-overlapping keys are kept. `styles.b` overrides `color` but not `fontSize`.

---

**Q5: `percentage` height without parent height**

```tsx
<View>
  <View style={{ height: '50%', backgroundColor: 'green' }} />
</View>
```

**Output:** Green box is **0 tall** (invisible).

Percentage heights resolve against the parent's measured height. The parent `<View>` has no height set (no `flex`, no explicit `height`), so it collapses to 0 → 50% of 0 is 0. `flex: 1` on a child does not have this problem because it grabs remaining space rather than computing against a parent dimension.

---

### Lists & Re-rendering

---

**Q6: Inline `renderItem` and `React.memo`**

```tsx
const Row = React.memo(({ item }) => {
  console.log('render', item.id);
  return <Text>{item.name}</Text>;
});

function List({ data }) {
  const [count, setCount] = useState(0);
  return (
    <>
      <Button title="+" onPress={() => setCount(c => c + 1)} />
      <FlatList
        data={data}
        renderItem={({ item }) => <Row item={item} />}
        keyExtractor={i => i.id}
      />
    </>
  );
}
```

**Question:** When you tap `+`, do the rows re-render?

**Output:** **Yes, every row re-renders.**

`renderItem` is an inline arrow, a new function each render. FlatList internally passes it down; even though `Row` is memoized, FlatList re-invokes `renderItem`, producing a new JSX element. But more importantly, each `Row` still receives the same `item` reference, so — here's the subtlety — `React.memo` **would** actually skip. The re-render you see is because `FlatList` itself re-renders and re-invokes `renderItem` for the visible rows.

The practical fix is: `useCallback` the `renderItem`, and avoid passing new props into `Row` (e.g., inline `onPress={() => handle(item.id)}` creates a new callback each render, which defeats `React.memo`).

---

**Q7: FlatList `keyExtractor` missing**

```tsx
<FlatList data={[{ name: 'a' }, { name: 'b' }]} renderItem={({ item }) => <Text>{item.name}</Text>} />
```

**Output:** A warning: `Warning: Each child in a list should have a unique "key" prop.` RN falls back to using the index as the key, which is fine for static data but breaks recycling when the list reorders (items at old indices keep stale state). Always provide `keyExtractor`.

---

**Q8: Object reference in `data`**

```tsx
function App() {
  const [n, setN] = useState(0);
  return (
    <>
      <Button title="+" onPress={() => setN(x => x + 1)} />
      <FlatList data={[{ id: 1 }, { id: 2 }]} keyExtractor={i => String(i.id)} renderItem={({ item }) => <Text>{item.id}</Text>} />
    </>
  );
}
```

**Question:** On each tap, does `FlatList` re-render?

**Output:** **Yes.** The inline array literal `[{ id: 1 }, { id: 2 }]` is a new array every render, so the `data` prop's reference changes → FlatList re-renders and re-evaluates its children. To stabilize, move the array outside the component or `useMemo` it.

---

### Animation & Async

---

**Q9: `useNativeDriver` with layout animation**

```tsx
const width = useRef(new Animated.Value(100)).current;

useEffect(() => {
  Animated.timing(width, { toValue: 300, duration: 500, useNativeDriver: true }).start();
}, []);

<Animated.View style={{ width, height: 50, backgroundColor: 'red' }} />
```

**Output:** Runtime error or warning: `Style property 'width' is not supported by native animated module`.

The native driver only supports **transform** (translate/scale/rotate) and **opacity** — not layout properties like width/height/padding/margin/color. For animating `width`, set `useNativeDriver: false` (runs on JS thread) or use Reanimated (runs layout on UI thread via worklets).

---

**Q10: Promise inside `useEffect` without cleanup**

```tsx
function Screen() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData);
  }, []);

  return <Text>{data?.title ?? 'loading...'}</Text>;
}
```

**Question:** What's wrong?

**Problem:** If the component unmounts before `fetch` resolves, `setData` runs on an unmounted component. React 18 no longer warns about this loudly, but the `fetch` itself isn't cancelled — you're doing work and holding a closure reference for nothing. Fix with `AbortController`:

```tsx
useEffect(() => {
  const c = new AbortController();
  fetch('/api/data', { signal: c.signal }).then(r => r.json()).then(setData).catch(() => {});
  return () => c.abort();
}, []);
```

Or use TanStack Query, which handles cancellation automatically.

---

**Q11: `setState` in stale closure**

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <Text>{count}</Text>;
}
```

**Output:** Text displays `0`, then `1`, and **stays at 1**.

The effect captures `count` = 0 at mount time. The interval's callback always reads this stale value. `setCount(0 + 1)` → sets to 1 each tick → React short-circuits re-renders because the value doesn't change.

Fix with functional updater: `setCount(c => c + 1)`. This works because the setter always receives the latest state.

---

### Platform Differences

---

**Q12: Shadows don't appear on Android**

```tsx
<View style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 }}>
  <Text>Card</Text>
</View>
```

**On iOS:** Shadow renders. **On Android:** No shadow.

Android uses `elevation` (Material Design) for shadows, not the iOS shadow properties. Also, elevation requires the view to have a solid `backgroundColor` to cast. Cross-platform:

```tsx
const card = {
  backgroundColor: 'white',
  // iOS
  shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
  // Android
  elevation: 4,
};
```

---

**Q13: `SafeAreaView` from `react-native` on Android**

```tsx
import { SafeAreaView } from 'react-native';

<SafeAreaView style={{ flex: 1 }}>
  <Text>Hi</Text>
</SafeAreaView>
```

**On iOS:** Pads correctly around notch. **On Android:** No padding at all.

The built-in `SafeAreaView` is iOS-only. On Android it's a plain `View`. Always use `react-native-safe-area-context`'s `SafeAreaView` or `useSafeAreaInsets` — both work cross-platform.

---

**Q14: Android hardware back button**

```tsx
function Modal() {
  const [open, setOpen] = useState(true);
  return open ? (
    <View><Text>Modal</Text></View>
  ) : null;
}
```

**Question:** What happens on Android when the user presses the hardware back button?

**Output:** The app **exits**.

RN's default Android back behavior is "pop the navigator, and if none, exit the app". Your modal is a plain view, not a navigator screen — so back exits. Fix: listen to `BackHandler.addEventListener('hardwareBackPress', ...)`, return `true` to consume the event, or use `<Modal onRequestClose={close}>` which wires this automatically.

---

### Native & Storage

---

**Q15: `AsyncStorage` at startup**

```tsx
function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('token').then(setToken);
  }, []);

  if (!token) return <LoginScreen />;
  return <HomeScreen />;
}
```

**Question:** What does the user see on cold start?

**Output:** They see `LoginScreen` **for a brief flash**, even if they're already logged in. `AsyncStorage.getItem` is async and takes ~tens of ms. During that gap, `token` is `null` → LoginScreen renders → promise resolves → HomeScreen.

Fix options:
1. **MMKV** is synchronous — read at top-level, no flash.
2. Keep splash screen visible (`SplashScreen.preventAutoHideAsync`) until rehydration completes.
3. Render a neutral loading state (not LoginScreen) while `token` is `null` and you haven't finished hydration.

---

**Q16: Image source from a string URI**

```tsx
<Image source="https://example.com/pic.jpg" style={{ width: 100, height: 100 }} />
```

**Output:** Nothing renders; warning: `source.uri should not be an empty string`.

RN's `Image` expects either `require(...)` or `{ uri: 'https://...' }`. A raw string is not valid. Use `source={{ uri: 'https://example.com/pic.jpg' }}`.

---

### Cheat Sheet

```
React Native Output Cheat Sheet:
1. Views without flex: 1 collapse to 0 → blank screens.
2. flexDirection defaults to 'column' (not 'row' like web).
3. Strings must live inside <Text>, not <View>.
4. useNativeDriver only supports transform + opacity.
5. setState inside intervals uses captured stale state — use functional updater.
6. Android shadows need elevation, not shadowColor/shadowOpacity.
7. SafeAreaView from 'react-native' is iOS-only; use react-native-safe-area-context.
8. AsyncStorage is async — state flashes unless you gate with splash/MMKV.
9. Image remote source needs { uri }, not a raw string.
10. FlatList needs keyExtractor + memoized renderItem to avoid row re-renders.
11. Inline array/object props break React.memo — memoize or hoist.
12. Percentage heights resolve against the parent's measured size; if parent has no size, child is 0.
```

---

## References

- [React Native Documentation](https://reactnative.dev) — Official RN docs
- [Expo Documentation](https://docs.expo.dev) — Expo SDK, EAS Build, Expo Router
- [React Navigation](https://reactnavigation.org) — Navigation library
- [Reanimated](https://docs.swmansion.com/react-native-reanimated) — High-performance animations
- [Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler) — Gesture system
- [FlashList](https://shopify.github.io/flash-list) — Performant list component
- [React Native Directory](https://reactnative.directory) — Ecosystem package discovery
