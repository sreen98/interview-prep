# What's New

## v1.0.7 (May 2026)

### DSA Guide — Three New Topic Sections

The DSA guide (2297 → 2722 lines, +18%) was audited for canonical interview topics that were absent. Three full sections were added between current §10 (Dynamic Programming) and §11 (Common Patterns Summary), then 11 / 12 renumbered to 14 / 15 with TOC updated:

- **§11 Heaps & Priority Queues** — when to reach for a heap (Top-K, streaming median, merge K sorted lists, scheduling, A\*); full MinHeap implementation with bubble-up/bubble-down; canonical problems: Top-K Frequent Elements, K-th Largest in Stream; 7-row comparison table covering Top K Frequent / K Closest Points / Median Stream / Merge K Sorted / Task Scheduler / Sliding Window Maximum.
- **§12 Tries (Prefix Trees)** — why a trie beats a hash set for prefix queries; TrieNode/Trie class implementation with `insert`, `search`, `startsWith`; autocomplete-via-DFS function; 6-row comparison table (Word Search II, Replace Words, Auto-Complete System, Longest Word in Dictionary, Maximum XOR with binary trie); space trade-off note (dense word lists vs random IDs).
- **§13 Backtracking** — the general template (state + choices + isSolution + isValid pruning); five fully worked problems: Permutations (used-set), Combinations (start-index with prune), Subsets (power set), N-Queens (cols + diag1 + diag2 attack-set tracking), Word Search (DFS with in-place `#` visited mark + restore); 9-row table of canonical problems including Combination Sum, Sudoku Solver, Generate Parentheses, Restore IP Addresses, Palindrome Partitioning; closing performance note that pruning is what makes backtracking practical.

### Playground — JS Polyfills Expansion (15 → 24)

The JS Polyfills category nearly doubled in size. Added the most-asked polyfill exercises that interviewers reach for after the basic map/filter/reduce trio:

- **Array.sort** — implements QuickSort and demonstrates the classic _string-compare default_ gotcha (`[1, 10, 2].sort()` → `[1, 10, 2]`), then walks through ascending/descending/by-key comparators. Includes a stability note for ES2019+ behavior.
- **Array.indexOf / lastIndexOf** — strict equality (`===`), so `[NaN].indexOf(NaN)` → `-1`. Negative `fromIndex`, lastIndexOf reverse search.
- **Array.reverse** — two-pointer in-place swap. Mutation note + ES2023 `toReversed` alternative.
- **Array.slice** — shallow copy with negative-index handling. The shallow-vs-deep clarification (nested object refs are shared).
- **Array.splice** — the three-jobs-in-one method: remove items, insert items, return removed items. All three modes demonstrated.
- **Array.concat** — one-level array flattening (not recursive). Mixed array / non-array args.
- **String.padStart / padEnd** — pad with fill string, truncated to fit. Common time-formatting use case.
- **JSON.stringify** — recursive serialization with the quirks that catch people: `undefined`/function/symbol values dropped from objects, replaced with `null` in arrays; `NaN` and `Infinity` become `null`; `toJSON` hook (Date) honored. Includes equivalence test against native.
- **Object.keys / values / entries** — enumerable-own-string-keyed contract (no prototype, no symbols by default).

Total templates now **96 across 7 categories** (JS Fundamentals 6, JS Interview Topics 7, React Basics 3, React Advanced 3, JS Polyfills **24**, Coding Challenges 33, React Machine Coding 20).

### Playground — 15 More Templates (72 → 87)

- **JS Fundamentals (+2):** Map & Set (modern collections, when to use which), Spread & Rest (the same syntax, opposite jobs)
- **JS Polyfills (+3):** `Array.includes` (with the `NaN` SameValueZero quirk), `Object.assign`, `Array.from` (iterable + array-like + mapFn)
- **Coding Challenges (+5, all with Show Solution):** Binary Search, Roman to Integer, Reverse Linked List, Container With Most Water (two-pointer area-maximization), Climbing Stairs (Fibonacci-pattern DP intro)
- **React Machine Coding (+5):** Stopwatch (start/pause/resume/reset with millisecond display), Calculator (4-function), Auto-suggest / Typeahead (filter + arrow-key nav + click-outside-to-close), Toast / Snackbar (queue with auto-dismiss + 4 severity levels), Carousel / Slider (auto-play + keyboard nav + dots indicator)

### Playground — "Show Solution" Toggle

The playground now has a **Show Solution** button (lightbulb icon) in the toolbar for every Coding Challenges template. Click it to swap the function-stub code for the canonical working solution; click again ("Hide Solution") to restore the original challenge.

- **Confirms before clobbering work** — if you've typed code that differs from the challenge stub, a confirm dialog prevents accidental loss.
- **Active state styling** — when viewing the solution, the button glows amber so you don't forget you're looking at the answer.
- **Solutions match each challenge** — all 28 Coding Challenges have a hand-written canonical solution: Two Sum (hash map), FizzBuzz (modulo 15 first), Bubble / Quick / Merge Sort (early-exit / middle-pivot / divide-and-conquer), Find Duplicates (single-pass two sets), Throttle (timestamp-based), EventEmitter (Map of Set listeners), LRU Cache (Map insertion-order trick), Deep Clone (recursive with WeakMap cycle guard), and so on. Each solution includes the same test cases as the challenge so you can see ✅ across the board.
- **No solution for non-challenge templates** — React Machine Coding and JS Polyfills don't show the button (those aren't single-answer "did I solve it" templates). The button only renders when a matching solution exists.

Solutions live in a separate `src/components/playgroundSolutions.ts` keyed by template name, so they don't bloat the main templates definition.

### Playground — 22 New Templates (49 → 72)

Audited the playground for the most-asked JavaScript and React coding interview templates. Added 22 new templates across two categories:

**Coding Challenges — 17 new (was 10, now 27):**

- **Array mutation classics:** Find Duplicates, Remove Duplicates (without Set), Find Missing Number, Move Zeros, Rotate Array
- **Sort without built-in:** Bubble Sort, Quick Sort, Merge Sort — covers the "sort without using `Array.prototype.sort`" interview ask in three classic styles
- **String puzzles:** Anagram Check, Longest Substring Without Repeating, First Non-Repeating Character
- **Functional patterns:** Sum Curry (`sum(1)(2)(3)()`), Memoize, Deep Clone (without `structuredClone` or JSON tricks), Throttle (companion to existing Debounce), Compose & Pipe
- **Data-structure builds:** EventEmitter (`on`/`off`/`emit`/`once`), LRU Cache (with `Map` insertion-order trick)

Each template follows the established pattern: clear challenge description, constraints, function stub with `// YOUR CODE HERE`, and 4–5 test cases that print ✅/❌ for instant feedback in the playground.

**React Machine Coding — 5 new (was 10, now 15):**

- **Star Rating** — 5-star input with hover preview
- **Tabs** — compound-component pattern (`<Tabs>` / `<Tabs.List>` / `<Tabs.Tab>` / `<Tabs.Panel>` sharing state via Context — the canonical Radix UI / Headless UI shape)
- **Accordion** — single-open and multi-open modes via `allowMultiple` prop
- **OTP Input** — 6-digit input with auto-advance, backspace-to-previous, paste distribution
- **Tic-Tac-Toe** — winner detection across rows/columns/diagonals, draw detection, reset

Total playground templates now **72 across 7 categories** (JS Fundamentals, JS Interview Topics, React Basics, React Advanced, JS Polyfills, Coding Challenges, React Machine Coding).

### Cross-Guide Audit — 2026 Modern-Feature Gaps Closed

A systematic audit ran across every substantive guide (JavaScript, TypeScript, Node.js, Express, MongoDB, API Design, Database Schema, AWS IAM/EC2/S3/Lambda/CloudWatch/Frontend Deployment, Git, DSA, System Design) checking for canonical 2026-relevant topics. Most guides were already strong; three real gaps were patched:

- **JavaScript §7.1 — Modern Array Helpers** — added `at()` (ES2022) for relative indexing including negative offsets, `findLast` / `findLastIndex` (ES2023) for searching from the end, and the ES2023 **immutable array methods** (`toSorted`, `toReversed`, `toSpliced`, `with`) which return new arrays instead of mutating. The immutable variants directly solve the most common accidental-mutation bug in React/Redux code.
- **Node.js §13.4 "Modern Node Built-Ins (No npm Install Required)"** (NEW subsection) — covers what the platform now ships natively that used to require dependencies: native `fetch` (Node 18+, replaces `node-fetch` / `axios` for most cases), the native test runner (`node:test` + `node:assert/strict`, replaces Jest/Mocha for backend code), `node --watch` (replaces nodemon), `node --env-file=.env` (replaces dotenv), and `--inspect-brk` with Chrome DevTools. Establishes the modern framing: start with what the platform gives you; add npm only when there's a specific reason.
- **TypeScript §10.6 — The `satisfies` Operator (TS 4.9+)** (NEW subsection) — promoted from a single interview-Q reference to a full reference subsection. Walks through the three options (annotation widens; `as` skips validation; `satisfies` does both) with concrete code showing why it matters — e.g., `palette.red.toUpperCase()` failing under annotation but working under `satisfies`. Includes the canonical use case: const config objects with shape constraints.

The audit also confirmed that Express (Fastify/Koa/NestJS comparison + Express 5 async errors), MongoDB, AWS IAM (Identity Center / SCP / permissions boundaries), Database Schema, API Design (19 sections), System Design, Git, and DSA were already comprehensive — no additions needed.

### React Guide — 2026 Priority-Map Gaps Closed

The React guide was audited against the "React.js Priority Map for Jobs in 2026" topic list to find what was missing. Five additions:

- **§7.4 "When NOT to Use useEffect"** — the senior-level signal that interviewers grade for. Five concrete patterns of misuse (derive instead of effect, real query libraries instead of effect-fetch, event handlers instead of "effect-as-listener", `key`-based reset instead of effect-reset, and the actual jobs `useEffect` is for: subscribing to external systems, browser APIs, third-party libraries, server sync). Frames `useEffect` as the _escape hatch_ from React's pure-render model rather than the default.
- **§11.3 "Server State vs Client State — The Most Important Distinction"** — explicit comparison table contrasting source-of-truth, lifetime, sync model, concerns, examples, and the right tool for each side. Closes with the modern-stack guidance: TanStack Query + Zustand for greenfield React projects in 2026; Redux only for genuinely complex client state or legacy codebases.
- **§16.3 useFormStatus** — added alongside existing `useActionState` (renamed from "Actions" with deeper explanation) and `useOptimistic`, framing them as the **form-state triad** (form-level state machine + descendant access + instant UI). Renumbered React 19 subsections to 16.1–16.5.
- **§13.2 useMemo / useCallback identity** — added the `useCallback(fn, deps) === useMemo(() => fn, deps)` equivalence interviewers love to test, plus a "when NOT to memoize" senior-signal block (cheap renders, unstable deps, no memoized consumer, React Compiler enabled). The point: profile first, don't sprinkle memoization preemptively.
- **§6.3 Custom Hooks expansion** — added `useFetch` (with `AbortController` cleanup, the canonical "build one live" interview ask) and `useToggle` alongside the existing `useDebounce` and `useLocalStorage`. The four together cover the most-asked custom-hook patterns, with a note that the cancellation pattern is the senior-level signal.

## v1.0.6 (April 2026)

### Removed: Read Aloud (Text-to-Speech)

The Read Aloud / Text-to-Speech feature has been removed. The button on guide pages, the playback controls, the paragraph-highlighting style, and the underlying Web Speech API hook are all gone. Existing `tts-prefs` localStorage keys are left in place but no longer read.

### Behavioral Guide — Major Expansion

The Behavioral guide grew from a STAR-method overview into a comprehensive interview prep resource. Four new sections, plus deeper foundational theory:

- **§3 Alternative Frameworks Beyond STAR** — when STAR doesn't fit, four alternatives with the questions they suit best: **CAR** (compressed, for senior+ candidates), **SOAR** (with an explicit _Obstacle_ beat for "tell me about a hard challenge" questions), **PARLA** (Problem / Action / Result / Learning / Application — the reflection-heavy framework, ideal for "tell me about a failure" and Microsoft growth-mindset interviews), and **BAR** (rubric-aligned for Amazon LP / Google GCA / explicit-trait questions). Plus a "when to use which" table.
- **§7 Company-Specific Behavioral Cultures** — per-company rubric breakdowns for **Amazon** (Leadership Principles, bar raiser, data obsession), **Google** (GCA / RRK / Leadership / Googleyness), **Meta** (Move Fast / Be Bold / Focus on Impact, with a bias-for-action lens), **Microsoft** (growth mindset, learning from failure, customer obsession), **Apple** (detail, craft, secrecy comfort), **Netflix** (high judgment, candor, "keeper test"), and **startups** (many hats, speed under chaos). Closes with a cross-company comparison table of top signals graded vs worst-fit story types.
- **§9 Handling Tough Questions** — frames and scripts for the questions where candidates typically lie, dodge, or sabotage themselves: "why are you leaving," "tell me about a weakness," "why is there a gap on your résumé," "tell me about a conflict," "tell me about a failure," "what are your salary expectations" (early-round), "what's your current salary," and "where do you see yourself in 5 years."
- **§10 Salary Negotiation** — the highest-leverage 30 minutes of an engineer's career. Market-data sources (Levels.fyi, Blind, network), the negotiation timeline (verbal offer → written offer → counter), the seven components of total comp (base, signing, equity, refresher, performance bonus, relocation, benefits), what counts as leverage and what doesn't, the negotiation script, seven mistakes to avoid, and when not to negotiate.
- **§1 Why Behavioral Interviews Matter** — added the empirical research foundation (Janz / Hellervik / Gilmore _Behavior Description Interviewing_ 1986, Google's Project Oxygen and Project Aristotle), the three theoretical assumptions structured behavioral interviewing rests on, and concrete framing for why "tell me about a time" works while "what would you do" doesn't.

Sections renumbered: previous 3→4, 4→5, 5→6, 6→8, 7→11, 8→12, 9→13, 10→14, 11→15, with TOC updated to match.

### CORS Guide Expansion

Section 1 (Same-Origin Policy) gained two theory blocks:

- **Why SOP Exists — The Threat Model** — the concrete attack SOP prevents (bank.com cookie-leak via attacker.com fetch), and the three things to internalize (cookies are domain-keyed not page-keyed; the server still ran the request; CORS is the deliberate exception to a default-deny model).
- **The History — How We Got Here** — timeline from 1995 (Netscape introduces SOP with JavaScript) through 2009 (CORS spec finalized) to 2020+ (COOP/COEP for SharedArrayBuffer + Spectre mitigation), framing SOP as a living security model rather than a fixed rule.

### Storybook Guide Expansion

Section 1 (What is Storybook?) added Component-Driven Development theory:

- **Why Isolation Matters — Component-Driven Development** — three structural problems CDD solves (the "running the whole app to see one button" problem; the "works in this context, breaks in that one" bug; the design/engineering handoff).
- **Storybook in the broader testing stack** — 4-layer comparison table (Unit / Component / Visual Regression / E2E) showing exactly where Storybook fits and what each layer catches.

### Design Patterns Guide

A new Front End guide: **Design Patterns** — all 23 Gang of Four patterns (Creational, Structural, Behavioral) with JavaScript/TypeScript examples and idiomatic-JS alternatives where the language already solves what the pattern was invented to address. Plus the React-specific canon: Higher-Order Components, Render Props, Custom Hooks, Compound Components, Container/Presentational, Provider, and the Reducer pattern. Closes with anti-patterns to flag in code review (Singleton-as-global-state, Factory of one, HOC pyramids, etc.), a "which pattern when" comparison table, 11 interview questions, and 4 tricky questions on subtle pattern selection trade-offs (Strategy vs Dependency Injection, Strategy vs Template Method, Builder vs Parameter Object, Observer subscribe-return-unsubscriber design).

### Refactoring & Code Review Guide

A new Front End guide: **Refactoring & Code Review** — covers the full refactoring.guru catalog plus modern code review practice:

- **What is refactoring** — the precise definition (behavior-preserving structural improvement), the "two hats" rule, when to refactor (rule of three, before features, fixing bugs, in code review), when not to.
- **How to refactor safely** — small steps, tests at every step, never mix refactoring with behavior changes in one commit.
- **Code smells** — full catalog grouped by family: Bloaters (Long Method, Large Class, Primitive Obsession, Long Parameter List, Data Clumps), OO Abusers (Switch Statements, Temporary Field, Refused Bequest, Alternative Classes), Change Preventers (Divergent Change, Shotgun Surgery, Parallel Inheritance), Dispensables (Comments, Duplicate Code, Lazy Class, Data Class, Dead Code, Speculative Generality), Couplers (Feature Envy, Inappropriate Intimacy, Message Chains, Middle Man).
- **Refactoring techniques** — Composing Methods (Extract Method, Inline, Replace Temp with Query), Moving Features Between Objects (Move Method, Extract Class, Hide Delegate), Simplifying Conditionals (Guard Clauses, Replace Conditional with Polymorphism, Introduce Null Object), Simplifying Method Calls (Introduce Parameter Object, Separate Query from Modifier), Dealing with Generalization (Pull Up, Push Down, Replace Inheritance with Delegation).
- **React-specific refactorings** — Extract Custom Hook, Extract Component, Move state down, Lift state up, Replace `useEffect`-as-derivation with derivation, Co-location.
- **Code review** — goals (correctness > design > maintainability > style), full checklist (correctness / design / performance / security / tests / naming / hygiene), comment-prefix conventions (`nit:` / `question:` / `suggestion:` / `issue:` / `blocking:`), how to give and receive feedback, PR hygiene (size, description, commits), 13 anti-patterns to flag without discussion.
- **12 interview questions** (Beginner/Intermediate/Advanced) on refactoring vs rewriting, rule of three, smells vs bugs, guard clauses, when to comment, refactoring a 200-line component, primitive obsession, Replace Conditional with Polymorphism, the strangler fig pattern, refactoring without tests, async vs pair vs sync code review, and how to decide whether to refactor or accept a smell.
- **7 tricky questions** on Message Chain diagnosis, Data Clump fixes, Long Parameter List vs Introduce Parameter Object, Extract Method when blocks update enclosing scope, "switch vs polymorphism" reviewer/author dispute, junior PR review judgement (block vs follow-up), and "build vs adopt" library decisions.

### React Guide — Reconciliation, Hydration, and Rendering Models

The React guide grew significantly:

- **New Section 14 "Reconciliation and Fiber"** — a deep dive into how React actually renders. The render → reconcile → commit pipeline, the three-rule diffing algorithm (different types remount, same types reuse, lists matched by `key`), why list keys are a correctness rule and not just a perf rule, the Fiber data structure (linked list, double-buffering via `alternate`, the lanes bitmap), the work loop with its 5ms time-slicing yields via `MessageChannel`, and practical implications (don't redeclare components inside other components; remounting is expensive but updating is cheap).
- **Section 13.4 (Virtualization)** got the windowing math, fixed-vs-dynamic-height handling, and a side-by-side comparison of react-window, @tanstack/react-virtual, react-virtualized, and react-virtuoso, plus a `content-visibility: auto` note.
- **Section 13.5 (Concurrent Features)** got the lane priority bitmap explanation, time-slicing 5ms yield mechanics, double-buffering with the `alternate` pointer, `useOptimistic` (React 19), and the tearing problem with `useSyncExternalStore` as the fix.
- **Section 13.12 (Server Components, SSR, Streaming)** expanded to cover Selective Hydration (priority-promoted hydration on user click), Progressive Hydration (hydrate-on-visible/idle/interaction), Islands Architecture (Astro / Marko / Fresh / Qwik with the SPA-vs-SSR-vs-RSC-vs-Islands comparison), and Incremental Static Regeneration (Next.js `getStaticProps` + `revalidate`, plus `revalidatePath`/`revalidateTag` for on-demand invalidation). Closes with a 7-row rendering-models comparison table (CSR / SSR / SSG / ISR / Streaming SSR / RSC / Islands) keyed by TTFB / FCP / TTI / SEO.

### Browser APIs Guide

A new Front End guide: **Browser APIs** — a comprehensive walkthrough of the platform APIs every web developer is expected to know, with comparison tables wherever the platform offers multiple options:

- **DOM and EventTarget** — `addEventListener` options (`once`, `passive`, `signal`, `capture`), custom events, event delegation.
- **Storage APIs** — Cookies (HttpOnly / Secure / SameSite), localStorage, sessionStorage, IndexedDB, Cache API, with a side-by-side comparison and a decision flow for picking the right one.
- **Network APIs** — fetch vs XMLHttpRequest, AbortController and signal composition, WebSockets, Server-Sent Events, plus a WS / SSE / long-polling comparison.
- **Workers** — Web Workers (with transferable objects), Shared Workers, Service Workers (lifecycle + cache strategies + the `skipWaiting`/`clients.claim` deploy pattern).
- **Observers** — IntersectionObserver, MutationObserver, ResizeObserver, PerformanceObserver — when each one replaces a scroll/resize listener.
- **History API and bfcache** — pushState / replaceState / popstate, plus `pageshow`/`pagehide` with `e.persisted`.
- **Performance API** — Navigation Timing, Resource Timing, User Timing (marks/measures), `performance.now()` vs `Date.now()`.
- **Scheduling APIs** — setTimeout vs queueMicrotask vs requestAnimationFrame vs requestIdleCallback, plus the event-loop mental model.
- **File, Blob, and Streams** — File/FileReader, modern Promise-based APIs (`.text()`, `.arrayBuffer()`, `.stream()`), `URL.createObjectURL`, drag-and-drop, ReadableStream piping.
- **Geolocation, Notifications, Clipboard** — permission-gated APIs.
- **Web Crypto** — `crypto.getRandomValues`, `crypto.randomUUID`, SubtleCrypto for hashing/encryption, non-extractable keys, and why `Math.random` is never appropriate for security.
- **Cross-document and cross-tab messaging** — `postMessage`, `BroadcastChannel`, `MessageChannel`, with the security pattern for validating `event.origin` and `event.source`.
- **Page Lifecycle and Visibility** — `visibilitychange`, `pageshow`/`pagehide`, `navigator.sendBeacon`, why `beforeunload` is unreliable.
- **Permissions API** — querying state without triggering prompts.
- **URL and URLSearchParams** — the boring API everyone gets wrong with manual string concatenation.

Closes with **16 interview questions** (Beginner / Intermediate / Advanced) and **12 tricky questions** organized by theme (Storage & Lifecycle, Network & Async, Workers & Threading, DOM & Events, Lifecycle & Performance) covering the storage event firing only in other tabs, why `fetch` doesn't reject on 5xx, the HTTP/1.1 6-connection limit and head-of-line blocking, structured-clone overhead and transferable objects, the Service Worker deploy stale-cache trap, `passive: true` ignoring `preventDefault`, why `beforeunload` analytics get lost, and rAF throttling in hidden tabs. Plus a 15-rule cheat sheet at the end.

### React Guide — Performance & Build-Tooling Expansion

The React guide's Performance section was expanded into a full deep dive on making React apps fast in production. New topics covered:

- **Concurrent Features** — `useTransition` and `useDeferredValue`, with guidance on when to reach for each.
- **Profiling and Measurement** — React DevTools Profiler workflow and Core Web Vitals (LCP, INP, CLS) with the `web-vitals` library.
- **Common Re-render Causes** — the usual offenders (inline objects, Context fan-out, anonymous callbacks) and how to fix them.
- **Image and Asset Optimization** — lazy loading, responsive `srcset`, LCP-image preload, font-display.
- **Webpack vs Vite** — feature comparison and when to pick which.
- **Bundle Analyzers** — `rollup-plugin-visualizer`, `webpack-bundle-analyzer`, `source-map-explorer`, with a checklist of what to chase down on every release.
- **Tree Shaking and Code Splitting** — what breaks tree shaking, waterfall lazy loading, route-based vs component-level splitting.
- **Server Components, SSR, Streaming** — Server Components vs Client Components, streaming SSR with `<Suspense>`.
- **Expanded performance cheat sheet** at the end of the section.

Added **8 new interview questions** on Core Web Vitals + INP, DevTools Profiler workflow, bundle analyzer red flags, Webpack vs Vite trade-offs, tree shaking, useTransition vs useDeferredValue, "reduce a 2 MB bundle" walkthrough, and debugging unnecessary re-renders.

Added **6 new tricky questions** on `React.memo` defeated by inline callbacks, Context fan-out from a non-memoized value, index-key bugs on prepend, `useTransition` priorities, `React.lazy` Suspense flash on above-the-fold chunks, and why named imports from CJS `lodash` don't tree-shake.

### Play Store Launch Guide

A new Front End guide: **Play Store Launch** — a practical, end-to-end playbook for shipping any Android app (React Native, native, Flutter — framework agnostic in workflow) to the Google Play Store. Examples use Expo / EAS where they're most concrete, but the Play Console workflow is identical for every framework. Covers the full path from code-side prep through Production Access:

- Code-side prerequisites (privacy-policy alignment, cascade delete, encryption-in-transit, secret rotation)
- `app.json` and EAS Build configuration (proguard, `usesCleartextTraffic`, `autoIncrement` strategy, Sentry sourcemaps)
- Privacy policy + public delete-account URL hosting requirements
- Backend Config collection pattern for runtime-configurable URLs (privacy policy, Play Store, force-update messages)
- Walkthrough of all 11 Play Console dashboard forms (App access, Ads, Content rating, Target audience, Data safety, Government/Financial/Health declarations, Advertising ID)
- Detailed Data Safety form mapping for a typical app: which data types to tick, required-vs-optional, purposes per type
- Store listing assets (icon 512×512, feature graphic 1024×500, screenshot specs) with `sips` resize tip
- Closed Testing setup, the 14-day soak rule for new personal accounts, tester-list management
- Production Access application + staged rollout strategy
- 14 common pitfalls (versionCode collisions, `expo-dev-client` in dependencies, missing crash-logs declaration when using Sentry, hardcoded `secure: false` cookies, etc.)
- A pre-launch checklist covering code, build, Play Console forms, store assets, and post-submission monitoring
- **Android Build Internals deep dive** — APK vs AAB internals, the build pipeline (AAPT2 → R8 → D8 → zipalign → sign), R8 shrinking/obfuscation with keep rules, signature schemes V1–V4, upload key vs app signing key, key reset/upgrade/rotation flows, manifest merger, Hermes + baseline profiles, Dynamic Delivery, OTA-allowed vs Play-required changes
- **React Native / Expo build concerns** — Bridge vs JSI/Fabric/TurboModules/Bridgeless, Managed vs Bare workflow, EAS Build vs local Gradle, sourcemap symbolication, `expo-doctor`
- **Bundletool, Firebase Pre-Launch Report, Internal App Sharing** — local AAB validation and pre-flight tooling
- **24 interview questions** across Beginner / Intermediate / Advanced — APK/AAB, Play App Signing, signature schemes, R8 keep rules, force-update architecture, manifest merger, target SDK floor, sourcemaps, Sentry + Data Safety, cascade delete, New Architecture, ANR debugging, key recovery vs upgrade vs rotation, OTA boundaries, staged rollout, baseline profiles, runtime config
- **10 tricky scenario questions** — versionCode high-water mark across tracks, `autoIncrement` drift, R8-broke-release-but-debug-works, 14-day soak resets when tester list rotates, Sentry tracesSampleRate misses App interactions, anonymize-not-delete cascade gotcha, tablet screenshots even with `supportsTablet: false`, upload-key reset (recoverable) vs app-signing-key loss (not), Managed Publishing app-level vs per-release scope, `blockedPermissions` doesn't disable SDK code
- **20-rule cheat sheet** at the end

---

## v1.0.5 (April 2026)

### Tricky Questions — Rewritten With Detailed Explanations

All 111 "Tricky Output Questions" across 9 guides were rewritten. The old answers were often 2-3 lines and skipped the "why" — now every question has:

- **A clear, self-contained question sentence** that works as a standalone flashcard in Quiz mode.
- **The original code**, unchanged — the buggy behavior is still the lesson.
- **The exact output or answer**, clearly labeled.
- **A detailed `Explanation` block** (typically 8-14 lines) that walks through the specific language / runtime / library mechanism at play — event-loop phases for Node, Immer's draft semantics for Redux Toolkit, generator `yield`/`next` exchange for Redux Saga, contravariance under `strictFunctionTypes` for TypeScript, reconciliation-keys and closure capture for React, Yoga layout and native-driver limits for React Native, router-stack arity dispatch for Express, aggregation-pipeline stage semantics for MongoDB, widening/boxing/coercion rules for JavaScript.
- **A one-sentence `Takeaway`** — the single rule to remember.

Counts per guide: JavaScript 11, TypeScript 16, React 16, React Native 16, Redux Saga 10, Redux Toolkit 10, Node.js 12, Express 10, MongoDB 10. Answer length per question grew roughly 5-6× on average.

The rewrite also preserved the Quiz-mode parser contract (`**Q{N}: ...**` marker + answer block + trailing `---`), so every new explanation is picked up in Quiz Mode, Daily Review, and the Interview Simulator.

### Documentation Cleanup

- README counts corrected (20+ guides → 32 guides across 8 categories; 84 tricky Qs → 111; 60+ templates → 49; AWS roster now lists Frontend Deployment; System Design lists Comparisons).
- CLAUDE.md now documents the parser's `---` terminator behavior so future edits don't accidentally cut off an explanation.

- **Console output now visible with React preview** — output pane is split evenly so console and preview share space instead of the console collapsing to a sliver. Console logs from React `useEffect` / intervals keep streaming in live (previously silent after the first tick).
- **"Try it" auto-inserts `render()`** — when you try a React snippet from a guide that defines a component but no `render()` call, the playground now detects the component and appends `render(<YourComponent />)` so it runs immediately.
- **Templates redesigned** — the side drawer is replaced with a centered 2-pane modal: category list on the left, snippets as cards on the right. Searching and switching categories is no longer a wall of names.
- **Sidebar toggle no longer overlaps the editor** — the floating expand button is hidden on the Playground route; an equivalent toggle is built into the Playground header instead.

---

## v1.0.4 (April 2026)

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

## v1.0.3 (April 2026)

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
