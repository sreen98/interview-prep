# What's New

## v1.0.3 (April 2026)

### New Content: React Native & Mobile Apps Guide

A full guide to building native mobile apps with React Native, added to the Front End section:

- **Core mobile concepts** — React Native vs hybrid/Flutter/native, JS thread vs UI thread, how the platform bridge works
- **Expo vs bare CLI** — when to use each, EAS Build, Expo Prebuild, `app.json` config
- **Core components** — `View`, `Text`, `Image`, `ScrollView`, `TextInput`, `Pressable`, `Modal`
- **Styling & Flexbox** — `StyleSheet`, platform differences from web (column default, no cascade, dp units, shadows)
- **Lists** — `FlatList`/`SectionList` performance (`getItemLayout`, `windowSize`, memoized `renderItem`), FlashList
- **Navigation** — React Navigation (Stack, Tab, Drawer), typed params, Expo Router file-based routing
- **Platform APIs** — `Platform`, `Dimensions`, `StatusBar`, `SafeAreaView`, `KeyboardAvoidingView`, `BackHandler`, `Linking`
- **Storage** — AsyncStorage, MMKV, SecureStore, SQLite, Realm, WatermelonDB — when to pick which
- **Animations & gestures** — `Animated` API + `useNativeDriver`, Reanimated worklets, `react-native-gesture-handler`
- **Native modules & New Architecture** — JSI, Fabric, TurboModules, Hermes, Bridgeless mode
- **Permissions, push notifications, deep linking** (URL schemes, Universal Links, App Links)
- **Build & release** — EAS Build, signing, App Store / Play Store, EAS Update / CodePush OTA
- **Accessibility, i18n & RTL, offline patterns**
- **30 interview questions** across beginner / intermediate / advanced
- **16 tricky questions** — `flex: 1` gotchas, `flexDirection` default, `useNativeDriver` limitations, stale `setState` in intervals, Android shadows, `SafeAreaView` platform differences, AsyncStorage startup flash, and more

---

## v1.0.2 (April 2026)

### Tricky Output Questions — 7 Guides

Added "Guess the Output" sections with code snippets and detailed explanations to 7 guides:

- **React** (16 questions) — State batching, stale closures, useEffect timing, refs, reconciliation, hooks rules
- **TypeScript** (16 questions) — Type inference & widening, narrowing, generics, conditional types, structural typing, `any` vs `unknown`
- **Node.js** (12 questions) — Event loop ordering (`nextTick` vs `Promise` vs `setTimeout` vs `setImmediate`), streams, modules, circular deps
- **Redux Saga** (10 questions) — Generator step-by-step, `call` vs `fork`, `takeLatest` cancellation, `race`, `all`, error propagation
- **Express.js** (10 questions) — Middleware execution chain, error handling flow, `next('route')`, async errors, double response
- **MongoDB** (10 questions) — Query behavior, dot notation vs exact match, `$push` vs `$addToSet`, aggregation pipeline order, `$unwind`, `$lookup`
- **Redux Toolkit** (10 questions) — Immer mutations, state references, selector memoization, `createAsyncThunk` lifecycle, middleware order, serializability

Each section includes a 10-rule cheat sheet summary.

---

## v1.0.0 (April 2026)

### Repo Renamed to PrepHub

- Repository renamed from `interview-prep` to `prephub`
- Live site URL is now **sreen98.github.io/prephub**
- Started semantic versioning at v1.0.0

### Production Polish

- Custom **Open Graph image** (1200x630) for better social media previews
- **DNS prefetch** for Google Analytics for faster page loads
- **PWA screenshots** and categories in manifest for richer install prompts
- Fixed `robots.txt` sitemap URL to point to new repo name

### New Content: CORS Guide

- Comprehensive guide covering **Same-Origin Policy, CORS headers, preflight requests, credentialed requests**, and security best practices
- **Express.js CORS configuration** — using the `cors` middleware and manual setup with dynamic origin allowlists
- **CORS in production environments** — AWS API Gateway, Nginx, Cloudflare Workers, and dev server proxies (Vite, CRA)
- **Debugging guide** — common error messages, curl commands for testing, and a debugging checklist
- **CORS vs JSONP, proxies, postMessage** — when to use each cross-origin mechanism
- **15 interview questions** across beginner, intermediate, and advanced levels

### New Content: Frontend Tooling Guide

- Comprehensive guide covering **Webpack, Vite, and bundler fundamentals** — why React needs a bundler, how webpack works (loaders, plugins, code splitting), how Vite leverages native ES modules
- **Webpack vs Vite comparison** — dev speed, config complexity, ecosystem, migration steps from CRA
- **Other bundlers overview** — Rollup, esbuild, Parcel, Turbopack, SWC
- **Package managers** — npm vs yarn vs pnpm deep dive with resolution strategies, speed, and monorepo support
- **package.json deep dive** — dependencies vs devDependencies vs peerDependencies, semver, scripts, entry points
- **20 interview questions** across beginner, intermediate, and advanced levels

---

## March 2026

### React Machine Coding Challenges in Playground

- **10 new interactive templates** — frequently asked React machine coding interview questions
- Pagination, Search Filter, Real-time Chat, Modal, Image Gallery with Lazy Loading, Drag-and-Drop, Product List with Sort & Filter, Responsive Navbar, Infinite Scroll, and Notifications
- All challenges are fully functional and runnable in the playground with live preview
- New "React Machine Coding" category in the template drawer

### New Content: Git Category

- **Git Guide** — Complete guide covering internals, branching, merging, rebasing, workflows, cherry-pick, stashing, tags, and advanced topics
- **Git Comparisons** — Merge vs rebase, reset vs revert, fetch vs pull, and more comparison tables
- New sidebar category with `GitCompare` icon

### New Content: Jest & React Testing Library Guide

- Comprehensive guide covering Jest fundamentals, matchers, mocking, and async testing
- React Testing Library patterns for components, hooks, Redux, React Query, forms, and routing
- Best practices and anti-patterns section

### New Cheat Sheet: Git Workflows & Advanced

- Interactive rebase, cherry-pick, bisect, reflog, worktrees
- Git Flow, GitHub Flow, and trunk-based development patterns

## March 2026

### Quiz Difficulty Filters

- Filter quiz questions by **Beginner**, **Intermediate**, or **Advanced**
- Color-coded difficulty badges on each flashcard
- Questions automatically tagged based on guide structure

### Reading Time Estimates

- See estimated reading time on each guide (~X min read)
- Displayed on home page category cards and at the top of each guide

### Reading Preferences

- Adjustable font size: **Small / Medium / Large**
- Toggle via the font size button in the sidebar
- Your preference is saved across sessions

### Offline Support (PWA)

- Install PrepHub as an app on your device
- All content cached for offline reading
- Auto-updates when new content is available

### Code Playground Enhancements

- "Try it" button on JavaScript code blocks sends code to the playground
- 6 built-in templates for common interview topics
- Console output with color-coded log levels

---

## Initial Release

### Core Features

- 16+ comprehensive interview preparation guides
- Covers Front End, Back End, JavaScript/TypeScript, AWS, and System Design
- Full-text search across all content (Cmd+K)
- Dark mode with system preference detection

### Interactive Tools

- **Quiz Mode** — Flashcard-style Q&A extracted from guides
- **Code Playground** — Run JavaScript directly in the browser
- **Table of Contents** — Auto-generated from headings with scroll tracking

### Reading Experience

- Syntax-highlighted code blocks with copy button
- Reading progress bar
- Back-to-top floating button
- Search result highlighting with auto-scroll
