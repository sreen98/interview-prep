# Frontend Engineer Interview Prep — Stack-by-Stack Q&A (Expanded)

Built from your resume. Detailed answers with diagrams where they help. The questions are what an interviewer would naturally ask after reading your resume — both general technical questions for the senior level you're targeting and specific drill-downs into resume claims.

> **How to use this:** Read each Q&A until you can rephrase the answer in your own words. Don't memorize — interviewers can spot recited answers. Practice out loud. Where I wrote "be ready with your specifics," replace with a real story from your work.

---

## Table of Contents

1. [React (incl. React 19 + React Compiler)](#1-react-incl-react-19--react-compiler)
2. [TypeScript](#2-typescript)
3. [State Management (Redux Toolkit, Saga, TanStack Query, Zustand)](#3-state-management-redux-toolkit-saga-tanstack-query-zustand)
4. [Forms & Validation (React Hook Form + Zod)](#4-forms--validation-react-hook-form--zod)
5. [Axios & HTTP Client](#5-axios--http-client)
6. [WebSockets & Realtime](#6-websockets--realtime)
7. [Styling & UI Libraries (Tailwind v4, shadcn/ui, Mantine)](#7-styling--ui-libraries-tailwind-v4-shadcnui-mantine)
8. [Testing (Jest, Vitest, RTL, Enzyme)](#8-testing-jest-vitest-rtl-enzyme)
9. [Storybook](#9-storybook)
10. [Build Tools & Performance](#10-build-tools--performance)
11. [AWS S3 Multipart Upload](#11-aws-s3-multipart-upload)
12. [Stripe Integration](#12-stripe-integration)
13. [RBAC & Multi-tenancy](#13-rbac--multi-tenancy)
14. [Google Tag Manager](#14-google-tag-manager)
15. [Observability & Tooling (Kibana, Postman)](#15-observability--tooling-kibana-postman)
16. [AI-Assisted Development (Copilot, Claude Code)](#16-ai-assisted-development-copilot-claude-code)
17. [Project-Specific Deep Dives](#17-project-specific-deep-dives)
18. [Architecture & Senior-Level Discussion](#18-architecture--senior-level-discussion)
19. [Behavioral Prompts](#19-behavioral-prompts)

---

## 1. React (incl. React 19 + React Compiler)

### Q1.1: How does React's reconciliation work, and what triggers a re-render?
React maintains a virtual DOM tree. When state or props change, React creates a new tree, diffs it against the old one (the reconciliation algorithm), and updates only what changed in the real DOM. A re-render is triggered by: (1) state changes in the component, (2) prop changes, (3) context value changes, or (4) a parent re-rendering (unless the child is memoized). React 19 with the Compiler memoizes automatically based on dependency analysis, reducing the need for manual `useMemo`/`useCallback`.

### Q1.2: Walk me through `useEffect` — when does it run, and what's a common mistake?
`useEffect` runs after the browser paints. It runs after every render where its dependencies change (or every render if the deps array is omitted). Common mistakes: (1) missing dependencies, causing stale closures; (2) infinite loops from setting state inside the effect with bad deps; (3) not cleaning up subscriptions or timers — return a cleanup function; (4) writing async code directly in the effect — define an async function inside and call it instead.

### Q1.3: What is the React Compiler and why is it interesting?
The React Compiler is a build-time optimizer (originally "React Forget") that analyzes component code and automatically applies memoization where it's safe — eliminating most need for manual `useMemo`/`useCallback`/`React.memo`. In React 19 it ships as a Babel plugin. The win: you write idiomatic React without thinking about memoization. Tradeoffs: build-time cost, and you must follow the Rules of React strictly for it to work safely (no mutations of props/state, hooks only at top level, etc.).

### Q1.4: `useMemo` vs `useCallback` — when do you actually need them?
`useMemo` memoizes a value, `useCallback` memoizes a function reference. You need them when (1) passing a reference-typed prop to a memoized child to keep its reference stable, or (2) the value is genuinely expensive to compute. Most other uses are premature optimization. With the React Compiler in React 19, you reach for them rarely.

### Q1.5: When have you used Suspense and error boundaries?
Suspense lets you declaratively show a fallback while children are loading — used heavily with `lazy()` for code splitting and with data fetchers like TanStack Query that integrate with it. Error boundaries are class components (or wrappers) that catch errors in their subtree and render a fallback. We use them at the app root and per-route to prevent one feature failure from crashing the whole app.

### Q1.6: How would you optimize a list rendering 10,000 items?
Don't render all 10K — virtualize. Libraries like `react-window` or `react-virtuoso` render only visible items plus a buffer. Beyond that: stable keys (avoid index keys for dynamic lists), memoize row components, paginate or use infinite scroll. If individual items have heavy rendering, breaking them into smaller memoized children also helps.

### Q1.7: Controlled vs uncontrolled components — what's the difference?
Controlled: form value lives in React state, you set it via `value` and update via `onChange`. Uncontrolled: value lives in the DOM, read via refs. Controlled is the React idiom but causes a re-render per keystroke. React Hook Form leverages uncontrolled forms with refs to avoid those re-renders, which is why it scales to large forms much better than fully controlled solutions.

### Q1.8: What are React Server Components and have you used them?
RSCs run on the server, render to a serialized format, and don't ship JS to the client. They can directly access backend resources (DB, filesystem) without exposing them. They're a Next.js 13+ feature primarily — not part of a Vite SPA. Honest answer if you haven't used them in production: "I've read up on them but my current Octagnt stack is a Vite SPA, so they don't apply. I'd be excited to use them in a Next.js context."

---

## 2. TypeScript

### Q2.1: `type` vs `interface` — when do you use which?
Both can describe object shapes. Differences: interfaces support declaration merging (the same name can be re-opened, useful for extending third-party types); `type` supports unions, intersections, mapped, and conditional types more cleanly. Default to `type` unless you need declaration merging or are designing an extensible public API.

### Q2.2: Which utility types do you use most?
`Partial<T>` for update payloads, `Pick<T, K>` and `Omit<T, K>` for derived types, `Record<K, V>` for maps, `Required<T>`, `ReturnType<T>` for typing things derived from a function, and `Awaited<T>` for unwrapping Promises. Less common but powerful: `Parameters<T>`, `Extract`, `Exclude`.

### Q2.3: Explain discriminated unions with an example.
A union of types sharing a literal "tag" field that lets TS narrow based on the tag. Classic example — a network state:
```typescript
type State<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
```
Inside `if (state.status === 'success')`, TS knows `state.data` exists. They make impossible states unrepresentable.

### Q2.4: What's `unknown` and why use it over `any`?
`unknown` is the type-safe top type — anything is assignable to it, but you can't do anything *with* it until you narrow (typeof checks, type guards, validation). `any` opts out of type checking entirely and is contagious. Use `unknown` for API responses before validation (then validate with Zod), and for thrown errors in `catch` blocks (in modern TS).

### Q2.5: Generics — give me a real example you've written.
A typed API hook: `function useApi<T>(url: string): { data: T | null; loading: boolean; error: Error | null }`. Or a generic table: `function Table<T>(props: { rows: T[]; columns: ColumnDef<T>[] })` where `ColumnDef` is itself generic. Generics let you write reusable code while preserving type information through it.

### Q2.6: What's a type guard and when do you write one?
A function whose return type is a type predicate (`x is Foo`). It tells TS "if this returns true, treat x as Foo." Useful when you have an `unknown` or union and need to narrow at runtime. Example: `function isUser(x: unknown): x is User { return typeof x === 'object' && x !== null && 'id' in x; }`. Zod's `.safeParse` returns a typed result that achieves the same thing more rigorously.

---

## 3. State Management (Redux Toolkit, Saga, TanStack Query, Zustand)

### Q3.1: Why Redux Saga and not Thunk?
Thunks are simple — async functions that get `dispatch` and `getState`. Sagas are generators describing side effects declaratively, run by middleware. Sagas win when you have complex async flows (race conditions, cancellation, debouncing), long-running processes (websockets, polling), or need testability — generators yield instructions, so you can test them synchronously without mocking. The cost is a steeper learning curve. We use sagas where the async logic justifies it; for simple "fire and forget," even sagas are overkill — TanStack Query is usually better.

### Q3.2: When would you use Redux vs TanStack Query vs Zustand?
Three different problems:
- **TanStack Query** — server state: cached data from APIs needing invalidation, refetching, optimistic updates. Use for ~80% of what people used to put in Redux.
- **Redux Toolkit** — shared client state with complex interactions: auth, multi-step wizard state across many components, things needing time-travel debugging.
- **Zustand** — lightweight client state without Redux's boilerplate: feature flags, UI prefs, modal state. No providers needed.

The mistake is treating these as competing — they layer.

### Q3.3: How do TanStack Query's `staleTime` and `gcTime` work?
`staleTime` is how long data is considered fresh — within that window, refetches are skipped. After it, data is stale and refetches on next mount, focus, or reconnect (configurable). `gcTime` (formerly `cacheTime`) is how long data stays in memory after the *last* component using it unmounts; after that it's garbage collected. Setting `staleTime > 0` dramatically reduces network traffic in apps with frequent component remounts.

### Q3.4: Implement an optimistic update with TanStack Query — what's the pattern?
In a mutation's `onMutate`: cancel any in-flight queries for that key, snapshot the current cache value, optimistically update the cache, return the snapshot in context. In `onError`: roll back to the snapshot. In `onSettled`: invalidate the query to refetch the truth. Instant UI feedback, eventual consistency with the server.

### Q3.5: Redux Toolkit's `createSlice` vs old Redux — what's the actual win?
`createSlice` gives you action creators, action types, and reducers in one declaration. It uses Immer under the hood, so you write "mutating" code that's actually immutable. ~70% less boilerplate. `createAsyncThunk` handles loading/success/error action types automatically. The concrete win is hours saved per feature.

### Q3.6: How do you avoid prop drilling without going to Redux?
Composition first — pass JSX as children/slot props instead of data. Then context for stable, infrequent-update values like theme, locale, current user. Then Zustand or Jotai for cross-cutting client state. Reach for Redux only when the state logic is complex enough to justify its conventions.

---

## 4. Forms & Validation (React Hook Form + Zod)

### Q4.1: Why React Hook Form over Formik or fully controlled forms?
RHF is uncontrolled by default — uses refs, not state, for inputs. Result: no re-render per keystroke. In a form with 50 fields, controlled solutions re-render the whole form on every change; RHF re-renders only the field. For complex forms (like the New Role wizard), this is the difference between snappy and laggy.

### Q4.2: How does Zod integrate with React Hook Form?
Through `@hookform/resolvers/zod`. Define a schema once with Zod, pass it to RHF's `resolver`, and RHF runs validation per your config (on submit/change/blur). Bonus: infer the form's TS type from the schema with `z.infer<typeof schema>` — single source of truth between runtime validation and compile-time types.

### Q4.3: How would you handle a form with conditional fields?
RHF's `watch()` reactively observes a field's value. Combine with conditional rendering: render the dependent field only when the trigger has a certain value. For validation, Zod's `discriminatedUnion` or `superRefine` validates one field based on another. Reset the conditional field's value when it disappears so stale data doesn't submit.

### Q4.4: A user reports the form loses scroll position when an error appears. Diagnose.
Likely the error message's height pushes the layout, or the field unmounts/remounts. Fixes: reserve space for error messages with `min-height`; avoid conditional re-mounting of field wrappers; render `errors[name]?.message` inside a stable container. Better UX: scroll to the first error explicitly with `setFocus()` instead of letting layout shift do it accidentally.

### Q4.5: How do you handle async validation (e.g., "is this email already taken")?
RHF supports async resolvers; Zod has `.refine` which can be async. For server checks, debounce the field with `watch()` + a small util, fire the check on blur (not every keystroke), and treat the result as an additional validation error. Show a loading indicator next to the field so the user knows it's checking.

---

## 5. Axios & HTTP Client

### Q5.1: Axios vs fetch — what does Axios actually give you?

`fetch` is the browser's built-in HTTP API — minimal, returns a Response object that you have to manually parse (`.json()`, `.text()`). Axios is a wrapper that adds:

- **Automatic JSON parsing** — `response.data` is the parsed body, no `.json()` step.
- **Request/response interceptors** — middleware-style hooks for auth, logging, error handling.
- **Request cancellation** — built-in via `CancelToken` (legacy) or `AbortController`.
- **Timeout support** — fetch needs `AbortController` + `setTimeout` to do this; Axios has a `timeout` config option.
- **Automatic JSON request body serialization** — fetch needs `JSON.stringify` and explicit Content-Type header; Axios handles it.
- **Better error semantics** — Axios rejects on 4xx/5xx; fetch only rejects on network errors. The latter trips up almost everyone using fetch for the first time.
- **Cross-environment support** — works in Node, the browser, and React Native with the same API.

For modern apps, fetch is fine if you wrap it in your own client; Axios is fine if you don't want to reinvent. The Octagnt UI uses Axios because of cookie-based auth (`withCredentials: true` is one config option) and the multi-tenant header injection that interceptors handle elegantly.

### Q5.2: What is an Axios instance and why use one?

`axios.create(config)` returns a configured instance — same API as the global `axios` but with defaults baked in. You'd typically have one per backend service:

```typescript
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,        // sends cookies on cross-origin requests
  timeout: 30000,
  headers: {
    'Accept-Language': 'en',
  },
});
```

Why an instance, not the global: instances are isolated. Adding an interceptor to `api` doesn't affect a separate `cdn = axios.create({ baseURL: 'cdn.com' })` instance. This matters when you have one auth-required API and one public CDN — you don't want auth headers leaking into CDN requests, and you don't want a 401 from the CDN logging your user out.

### Q5.3: Walk me through Axios interceptors.

```
   Component
      │
      │ api.get('/candidates')
      ▼
┌─────────────────────────────────────────────┐
│  Request Interceptors (LIFO order)          │
│  • inject auth header                       │
│  • inject tenant header                     │
│  • log outgoing request                     │
└────────────────┬────────────────────────────┘
                 │
                 ▼
        HTTP request goes out
                 │
                 │  HTTP response comes back
                 ▼
┌─────────────────────────────────────────────┐
│  Response Interceptors (FIFO order)         │
│  • unwrap envelope { results } → data       │
│  • handle 401 → refresh + retry             │
│  • toast on error unless { silent: true }   │
└────────────────┬────────────────────────────┘
                 │
                 ▼
       Component receives response (or error)
```

Real example with auth + tenant headers:

```typescript
// Request interceptor: inject tenant header
api.interceptors.request.use((config) => {
  const tenantId = getTenantId();
  if (tenantId) {
    config.headers['x-tenant-id'] = tenantId;
  }
  return config;
});

// Response interceptor: handle 401, surface toast on errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authStore.logout();
      window.location.href = '/login';
    } else if (!error.config?.silent) {
      toast.error(error.response?.data?.message ?? 'Request failed');
    }
    return Promise.reject(error);
  }
);
```

The `silent: true` config (a custom flag we add) lets specific calls opt out of the global error toast — useful when the caller wants to handle the error itself.

### Q5.4: How do you implement a refresh-token flow with Axios?

When a 401 hits, queue the failed request, refresh the token, then replay the queued requests. The tricky part is handling concurrent 401s — if 10 requests fail simultaneously, you don't want 10 parallel refresh calls.

```typescript
let isRefreshing = false;
let queue: Array<(error?: unknown) => void> = [];

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }
    original._retry = true;

    if (isRefreshing) {
      // wait for the in-flight refresh
      return new Promise((resolve, reject) => {
        queue.push((err) => (err ? reject(err) : resolve(api(original))));
      });
    }

    isRefreshing = true;
    try {
      await api.post('/auth/refresh');
      queue.forEach((fn) => fn());
      queue = [];
      return api(original);
    } catch (refreshError) {
      queue.forEach((fn) => fn(refreshError));
      queue = [];
      authStore.logout();
      throw refreshError;
    } finally {
      isRefreshing = false;
    }
  }
);
```

The `_retry` flag prevents infinite loops if the refresh itself returns 401. The queue ensures the thundering herd of concurrent 401s only triggers one refresh.

### Q5.5: How do you cancel a request when the component unmounts?

With `AbortController` (the modern API; `CancelToken` is deprecated):

```typescript
useEffect(() => {
  const controller = new AbortController();
  api
    .get('/candidates', { signal: controller.signal })
    .then((r) => setData(r.data))
    .catch((e) => {
      if (axios.isCancel(e)) return; // expected, ignore
      handleError(e);
    });
  return () => controller.abort();
}, []);
```

Why this matters: without cancellation, if the user navigates away mid-request, the response still arrives, your `setState` fires on an unmounted component (React warns), and you've wasted bandwidth. In practice you often don't need to do this manually — TanStack Query handles cancellation automatically when a query becomes inactive.

### Q5.6: How do you upload files with progress?

Axios supports `onUploadProgress` natively (it uses `XMLHttpRequest` under the hood, so the upload progress events work):

```typescript
const formData = new FormData();
formData.append('file', file);

await api.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
  onUploadProgress: (event) => {
    if (event.total) {
      const percent = Math.round((event.loaded / event.total) * 100);
      setProgress(percent);
    }
  },
});
```

Note: with native fetch, upload progress is *not* supported (the WHATWG spec doesn't define it; download progress is via `ReadableStream`). This alone keeps Axios in many codebases. For S3 multipart, you'd track per-part progress and aggregate.

### Q5.7: How do you handle parallel requests?

`axios.all` and `axios.spread` exist but are deprecated wrappers around `Promise.all`. Just use `Promise.all`:

```typescript
const [user, settings, perms] = await Promise.all([
  api.get('/users/me'),
  api.get('/settings'),
  api.get('/permissions'),
]);
```

If you want some to be allowed to fail, use `Promise.allSettled` and inspect each result's `status`:

```typescript
const results = await Promise.allSettled([api.get('/a'), api.get('/b')]);
results.forEach((r) => {
  if (r.status === 'fulfilled') console.log(r.value.data);
  else console.error(r.reason);
});
```

For sequential dependencies (B depends on A), use `await` in sequence; don't try to force `Promise.all` on it.

### Q5.8: Walk me through the Axios error object.

On error, Axios rejects with an `AxiosError` that has:

- `error.response` — the server response (only set if the server responded; absent for network errors).
- `error.request` — the request object (set if the request was made but no response received).
- `error.config` — the config used (useful for logging the URL, method).
- `error.code` — like `ERR_CANCELED`, `ECONNABORTED` (timeout), `ERR_NETWORK`.
- `error.isAxiosError` — true (so type guards work).

The pattern for distinguishing failure modes:

```typescript
function handleAxiosError(error: unknown) {
  if (!axios.isAxiosError(error)) {
    // not an axios error — programming bug
    throw error;
  }
  if (error.response) {
    // server responded with 4xx/5xx — domain error
    return showFieldErrors(error.response.data);
  } else if (error.request) {
    // request made, no response — network down, CORS, timeout
    return showRetryToast('Network error');
  } else {
    // setup error (bad config) — programming bug
    throw error;
  }
}
```

### Q5.9: How do interceptors compose — what's the order?

Request interceptors run in **reverse order of registration** (LIFO). Response interceptors run in **registration order** (FIFO). So if you register A then B:

- Outgoing: B runs first, then A, then the request goes out.
- Incoming: response comes back, A runs first, then B.

Most teams treat interceptors as global setup at app boot and don't rely on order, but if you have a logging interceptor that should see the final form of the request (after auth headers etc.), register it last so it runs first on the way out.

### Q5.10: How would you implement automatic retries on 5xx?

With `axios-retry` (a small library):

```typescript
import axiosRetry from 'axios-retry';
axiosRetry(api, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) =>
    axiosRetry.isNetworkOrIdempotentRequestError(error) ||
    error.response?.status === 503,
});
```

By default it only retries idempotent methods (GET, HEAD, OPTIONS, PUT, DELETE), which is correct — retrying a POST could double-charge a customer or create duplicate records. For non-idempotent retries, use idempotency keys (see Stripe section). The exponential backoff prevents you from hammering a degraded server.

### Q5.11: How do you mock Axios in tests?

Three options, ranked by realism:

1. **`msw` (Mock Service Worker)** — mocks at the network layer. Same setup works in browser and Node tests. Most realistic — your code is tested as if a real server existed. **Recommended.**
2. **`axios-mock-adapter`** — mocks at the Axios layer. Quick for isolated unit tests but doesn't catch issues with real network behavior (CORS, interceptors, etc.).
3. **`jest.mock('axios')`** — Jest module mocking. Brittle, easy to mistype the mock shape. Avoid.

For Octagnt's testing setup, msw is the standard. You write request handlers once, share them between unit tests and Storybook, and your tests behave like real users.

### Q5.12: Axios sets a default timeout of 0 (no timeout). What's the right value?

There's no universal answer; it depends on the request. Defaults I've used:

- **Reads (GET):** 10–15 seconds. Most reads are fast; if it's slower, something's wrong.
- **Writes (POST/PUT):** 30 seconds. Some writes legitimately take longer (file uploads, batch operations).
- **Long-poll/streaming endpoints:** override per-request to 60+ seconds, or no timeout if the server signals completion explicitly.

A timeout that's too long means users wait forever on a degraded network. Too short and you cancel work that would have succeeded. The right number is empirical — measure your p99 latency and set timeout to ~3x that.

---

## 6. WebSockets & Realtime

### Q6.1: WebSockets vs SSE vs polling — when which?

| Pattern | Direction | Connection | Use when |
|---|---|---|---|
| Polling | Client → Server (one-shot) | New per request | Updates are infrequent and latency tolerable; very simple to implement. |
| Long polling | Client → Server (held) | One per request | Polling but the server holds the request open until data is ready; better than naive polling, worse than streaming. |
| SSE | Server → Client (stream) | One persistent | Server pushes only; you don't need bidirectional traffic; HTTP-based, auto-reconnect built into the browser. |
| WebSocket | Bidirectional | One persistent | True duplex — server pushes AND client sends frequently (chat, collaborative editing, live cursors). |

For "show me notifications when something happens server-side," SSE is often enough and simpler — you avoid the WebSocket protocol complexity and your messages travel over plain HTTP/2. Use WebSockets for genuinely bidirectional traffic. Polling is fine for cases where you'd update every minute anyway.

### Q6.2: Walk me through the WebSocket lifecycle.

```
       new WebSocket(url)
             │
             ▼
        [CONNECTING]  ──── onerror ────> [CLOSED]
             │            (handshake failed)
             │ onopen
             ▼
          [OPEN]
             │
             ├── onmessage ──> handle frame
             │
             ├── send(data) ──> server
             │
             ├── close()  ───> [CLOSING]
             │                     │
             │                     ▼
             └── onclose ────> [CLOSED]
                  (server-initiated, error, or local close)
```

The four `readyState` values: `CONNECTING (0)`, `OPEN (1)`, `CLOSING (2)`, `CLOSED (3)`. Once `CLOSED`, the socket is dead — to reconnect you create a new one. The handshake is HTTP Upgrade — the browser sends an HTTP/1.1 request with `Upgrade: websocket`, the server responds 101 Switching Protocols, and from there it's the WebSocket binary protocol on the same TCP connection.

### Q6.3: How do you implement reconnection with exponential backoff?

```typescript
class ReconnectingSocket {
  private ws?: WebSocket;
  private attempt = 0;
  private url: string;
  private explicitlyClosed = false;

  constructor(url: string) { this.url = url; this.connect(); }

  private connect() {
    this.ws = new WebSocket(this.url);
    this.ws.onopen = () => { this.attempt = 0; };
    this.ws.onmessage = (e) => this.handleMessage(JSON.parse(e.data));
    this.ws.onclose = () => {
      if (!this.explicitlyClosed) this.scheduleReconnect();
    };
    this.ws.onerror = () => this.ws?.close(); // triggers onclose
  }

  private scheduleReconnect() {
    const delay = Math.min(1000 * 2 ** this.attempt, 30000); // cap 30s
    const jitter = Math.random() * 1000;                     // ±1s
    setTimeout(() => {
      this.attempt += 1;
      this.connect();
    }, delay + jitter);
  }

  close() { this.explicitlyClosed = true; this.ws?.close(); }
}
```

```
Reconnection attempts (with jitter omitted):
  attempt 1: wait 1s
  attempt 2: wait 2s
  attempt 3: wait 4s
  attempt 4: wait 8s
  attempt 5: wait 16s
  attempt 6+: wait 30s (cap)
```

The jitter is critical — without it, all clients reconnect at exactly the same time after a server restart and you DDoS yourself ("thundering herd"). Adding 0–1s of randomness spreads the reconnections out.

### Q6.4: How do you keep a WebSocket connection alive through proxies and NAT?

**Heartbeat / ping-pong.** Many corporate proxies, NAT routers, and load balancers kill idle TCP connections after 30–60 seconds. To prevent this, the client sends a small message every 25–30 seconds; the server responds; if the client misses ~3 expected responses in a row, it assumes the connection is dead and reconnects.

```typescript
let heartbeatTimer: ReturnType<typeof setInterval>;
let pongTimer: ReturnType<typeof setTimeout>;
let missedPongs = 0;

ws.onopen = () => {
  heartbeatTimer = setInterval(() => {
    ws.send(JSON.stringify({ type: 'ping' }));
    pongTimer = setTimeout(() => {
      missedPongs += 1;
      if (missedPongs >= 3) ws.close();
    }, 5000);
  }, 25000);
};

ws.onmessage = (e) => {
  const msg = JSON.parse(e.data);
  if (msg.type === 'pong') {
    clearTimeout(pongTimer);
    missedPongs = 0;
  }
  // ... handle other messages
};

ws.onclose = () => {
  clearInterval(heartbeatTimer);
  clearTimeout(pongTimer);
};
```

RFC 6455 defines protocol-level ping/pong frames, but browsers don't expose them to JS — you implement at the message level as above.

### Q6.5: How do you authenticate a WebSocket?

Three approaches, each with caveats:

1. **Cookie-based.** Browsers send cookies during the WebSocket handshake (which is HTTP). Easy if your domain matches and you use `credentials: 'include'` semantics. Most natural if your REST API is also cookie-authed. **This is what Octagnt uses** — the existing JWT cookie carries through.
2. **Token in query string.** `wss://api/ws?token=xxx`. Simple but tokens leak into proxy/access logs and browser history. Use only short-lived tokens fetched specifically for the socket.
3. **First-message auth.** Connect first, then send `{ type: 'auth', token }` as the first message; server closes the socket if invalid. Works well but the connection is briefly "open but unauthenticated," which complicates server logic.

The token-in-header approach you'd use for HTTP doesn't work for browser WebSockets — the browser doesn't let you set arbitrary headers on `new WebSocket(url)`. (Node.js WebSocket clients can.)

### Q6.6: socket.io vs raw WebSocket — when which?

**socket.io** is a higher-level abstraction over WebSocket (with HTTP long-polling fallback) that adds: automatic reconnection, heartbeats, namespaces, rooms, acknowledgments, broadcasting. The cost: protocol incompatibility — you need socket.io on both ends; you can't connect a raw `WebSocket` to a socket.io server.

**Raw WebSocket** is just the protocol; standard, no fallbacks, you build the niceties yourself.

Pick socket.io if you want batteries-included for chat/notifications and you control the backend. Pick raw WebSocket if you control both ends and want zero extra dependency surface, or if you need to interop with non-Node servers (Go, Rust, Erlang). Octagnt's polling-based approach for AI agent run status is a good example of when WebSockets aren't even needed — TanStack Query with a `refetchInterval` is simpler and just as effective.

### Q6.7: Integrate a WebSocket with React — what's the pattern?

A custom hook owns the connection per component for component-scoped sockets, or a singleton service for app-wide sockets:

```typescript
function useWebSocket<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING);
  const ws = useRef<WebSocket>();

  useEffect(() => {
    ws.current = new WebSocket(url);
    ws.current.onopen = () => setReadyState(WebSocket.OPEN);
    ws.current.onmessage = (e) => setData(JSON.parse(e.data));
    ws.current.onclose = () => setReadyState(WebSocket.CLOSED);
    return () => ws.current?.close();
  }, [url]);

  const send = useCallback((msg: unknown) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msg));
    }
  }, []);

  return { data, readyState, send };
}
```

For app-wide single-connection scenarios (one socket shared across many components), push the socket into a Redux middleware or a Zustand store so all components share one socket. Don't open a new socket per component — that's expensive and the server scales worse with N connections per user.

### Q6.8: How do you handle message ordering and delivery guarantees?

WebSocket itself guarantees in-order delivery on a single connection (it's TCP underneath). But:

- **Across reconnects**, messages sent during downtime are lost. If you need durability, the server should track per-client cursors and replay missed messages on reconnect, or use a message bus that persists.
- **Idempotency.** Every message has a unique ID; the receiver dedupes on retries. Important when the *sender* retries.
- **Ack pattern.** Sender retries until it sees an ack. socket.io has this built in via ack callbacks: `socket.emit('event', data, (ack) => { ... })`.

For low-stakes notifications, lossy is fine. For collaborative editing, you need full replay + cursor (this is essentially what CRDTs solve).

### Q6.9: How do you scale WebSockets across multiple servers?

A single Node process can handle ~10K concurrent connections comfortably; beyond that, you scale horizontally. The challenge: a message published on server A must reach a client connected to server B.

Solutions:
1. **Pub/sub backend (Redis, NATS, Kafka).** Servers subscribe to topics; messages go to the bus, fan out to all subscribers.
2. **Sticky sessions on the load balancer.** Same client always lands on the same server. Simpler but limits flexibility (rolling deploys, server failure).

For very large fan-out (broadcasting one event to a million connections), you typically run a dedicated WebSocket gateway (AWS API Gateway WebSocket API, Pusher, Ably, Centrifugo) and move the routing concern out of your app entirely.

### Q6.10: A user reports they're not getting realtime updates. How do you debug?

1. Is the socket actually `OPEN`? Log `ws.readyState` over time. Many "no updates" issues are silent reconnect failures.
2. **DevTools → Network → WS tab** — does the connection show as established? Are messages flowing? You can see every frame.
3. If the connection is open but no messages arrive: server-side filter problem — am I subscribed to the right topic / room? Was my user enrolled?
4. If the connection keeps closing: check close codes. `1006` = abnormal close (network or proxy timeout). `1011` = server error. `4001`/`4002` = custom auth failures.
5. Behind a corporate proxy? Some proxies don't support WebSocket and silently fail. Test with the long-polling fallback (or just WSS over 443 — usually fine because it looks like HTTPS).
6. Is the browser tab in the background? Some browsers throttle background tabs (Page Lifecycle API). Heartbeats may be paused; use `visibilitychange` to detect and reconnect on resume.

### Q6.11: How do you test components that use WebSockets?

Mock the WebSocket constructor in your test setup. The `mock-socket` library gives you a server-side mock you can control: `server.send(...)` simulates incoming messages, you assert on UI updates. For higher-level testing, `msw` v2 added WebSocket support.

```typescript
import { Server } from 'mock-socket';
const mockServer = new Server('wss://test.example/ws');
// in test: mockServer.send(JSON.stringify({ type: 'update', data: ... }))
// assert your UI reflects the update
```

### Q6.12: When have you used WebSockets at HASpaces/Wipro?

**Be ready with your specifics.** Common scenarios on the resume's stack: live status updates on long-running pipeline runs, real-time notifications, lead assignment events on the Verizon platform. If the actual usage was lighter, frame it honestly — "I integrated with our backend's notification stream and built reconnection logic" is fine and defensible. Senior interviewers respect specificity over volume.

---

## 7. Styling & UI Libraries (Tailwind v4, shadcn/ui, Mantine)

### Q7.1: What's new in Tailwind v4 vs v3?
New Oxide engine (Rust, ~10x faster builds); near-zero config (auto-detects content paths); CSS-first config via `@theme` directive in your CSS rather than `tailwind.config.js`; native CSS layers for cleaner cascade; first-class CSS variable support so design tokens are real CSS vars at runtime, not just compile-time. Migration mostly works automatically with the codemod.

### Q7.2: shadcn/ui isn't a library you `npm install` — how does it work?
It's a CLI that copies component source into your repo. You own the code — no version pinning, no upgrade pain, full customization. Built on Radix UI primitives (accessibility/behavior) styled with Tailwind. Tradeoff: when shadcn updates a component, you don't get it for free — you'd diff and re-copy. The win: total control and no dependency surface for your UI primitives.

### Q7.3: You led the Mantine v5 → v7 upgrade — what were the actual breaking changes?
**Be ready with your specifics.** Major v7 changes worth knowing: switched from Emotion to native CSS modules (CSS-in-JS removed), so any custom `sx` props or `createStyles` usage had to migrate to vanilla CSS or CSS Modules. Theme structure changed (`theme.colors` shape adjusted; new color scheme handling). Some component APIs renamed (e.g., `withinPortal` defaults). The migration value is in the *strategy*: vendor coordination, codemods where available, phased rollout, visual regression testing.

### Q7.4: How would you implement a theme toggle with persistence?
Define CSS variables under `:root` and `.dark` (or `[data-theme="dark"]`). Track current theme in Zustand or context. On mount, read from `localStorage` and apply the class to `<html>`. Listen for `prefers-color-scheme` for the initial value if no saved preference. The actual color application is pure CSS — JS just toggles the class. Avoid flashing wrong theme on load by inlining a tiny script in `<head>` that sets the class before render.

### Q7.5: How do you ensure accessibility in a custom component?
Start with a Radix or Headless UI primitive — they handle keyboard nav, ARIA roles, focus management. Add semantic HTML (`<button>` not `<div onClick>`). Test with keyboard only and a screen reader. Run axe-core in tests or via the browser extension. Don't ship custom dropdowns, dialogs, or comboboxes from scratch — the accessibility surface is too easy to get wrong.

---

## 8. Testing (Jest, Vitest, RTL, Enzyme)

### Q8.1: Jest vs Vitest — why would a team switch?
Vitest uses Vite's transform pipeline, so the test environment matches dev exactly (same plugins, same TS config, same module resolution). Significantly faster cold start because of native ESM. API is mostly Jest-compatible (`describe`, `it`, `expect`), so migration is straightforward. Pain points it removes: Jest's complex Babel/TS config, slow startup on big codebases.

### Q8.2: You claim 90% test coverage — is that always good?
90% means 90% of lines execute during tests, not that those lines are *correctly* tested. You can hit 90% with bad assertions. Coverage is a floor, not a ceiling — useful for catching dead code and untested branches, but a 60% suite of behavior-focused tests beats a 95% suite of `expect(component).toBeTruthy()`. The discipline that matters: testing user-visible behavior (per RTL's philosophy), not implementation details that change with refactors.

### Q8.3: Tell me about the Copilot prompt template you authored.
**Be ready to describe yours specifically.** General pattern: a structured prompt that takes a component file path, identifies the testable surface (props, user interactions, async behavior, accessibility), and asks Copilot to generate RTL tests following team conventions — `userEvent` not `fireEvent`, semantic queries (`getByRole`/`getByLabelText`) over `getByTestId`, no implementation-detail tests. The win: consistency across the team and time saved on boilerplate.

### Q8.4: How do you test a hook that uses TanStack Query?
Wrap the hook in `renderHook` with a custom wrapper providing a *fresh* `QueryClient` per test (so tests don't pollute each other). Mock the underlying API — `msw` is the standard. Assert on the hook's returned `data`, `isLoading`, `error`. For mutations, fire the mutation and assert the cache state with `queryClient.getQueryData`.

### Q8.5: Migrating from Enzyme to RTL — what's the mindset shift?
Enzyme tests components from the inside — reach into state, call methods, assert on instance internals. RTL tests from the outside — what does the user see and do? Find by role/label/text, interact via `userEvent`, assert on rendered output. The shift: stop testing "is `count` state equal to 1" and start testing "does '1' appear in the document after I click +". Tests survive refactors better because they're decoupled from implementation.

### Q8.6: How do you test a component that depends on Redux?
A custom render utility wraps the component in a real store with the slices it needs (preloaded state passed in for setup). Don't mock the store — that's testing your mocks. For sagas, use `redux-saga-test-plan` or step through generators manually; for thunks, use `configureStore` with a real reducer.

---

## 9. Storybook

### Q9.1: What is Storybook and why use it?

Storybook is a tool for developing UI components in isolation. You write "stories" — examples of a component in different states — and Storybook renders each one in a sandbox separate from your app. It runs on its own port (6006 by default in Octagnt) and gives you a sidebar of all components organized into a tree.

Wins:
1. **Isolated development.** Work on a `Button` without spinning up the whole app, logging in, navigating to the right page.
2. **Visual catalog.** Designers, PMs, and devs all browse the same component library — a single source of truth for what UI exists.
3. **Documentation.** Stories double as living docs; auto-generated from props/types.
4. **Visual regression testing.** Pair with Chromatic to catch unintended visual changes per PR.
5. **Accessibility checks.** Addons like `@storybook/addon-a11y` run axe-core on every story.
6. **Edge cases on demand.** Hard to reproduce states (long text, error state, loading, empty data) become a click — designers love this.

Tradeoff: maintenance overhead. If stories aren't kept in sync with components, they go stale fast.

### Q9.2: What's the Component Story Format (CSF)?

The current standard for writing stories. CSF 3.0 example:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'UI/Button',
  args: { children: 'Click me' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'destructive'] },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Disabled: Story = { args: { variant: 'primary', disabled: true } };
export const LongText: Story = {
  args: { children: 'A very long button label that wraps across two lines' },
};
```

Each named export is a story. `args` defines props for that story. The default export (`meta`) carries title, component, and shared args. The title field with slashes (`UI/Button`) creates a folder structure in Storybook's sidebar.

### Q9.3: Args, ArgTypes, Controls — what are they?

- **`args`** — the props passed to a story. Just data.
- **`argTypes`** — the *schema* of args, including: what control to use (text input, select, radio, color picker, etc.), descriptions, default values, mapping for non-primitive values.
- **Controls** — the addon UI that turns argTypes into interactive form fields, so anyone (including non-engineers) can tweak props live in the Storybook UI.

```typescript
argTypes: {
  variant: {
    control: 'select',
    options: ['primary', 'secondary', 'destructive'],
    description: 'Visual style of the button',
  },
  onClick: { action: 'clicked' },          // Actions addon: logs the call
  disabled: { control: 'boolean' },
  size: { control: 'radio', options: ['sm', 'md', 'lg'] },
}
```

Storybook auto-generates argTypes from TypeScript types where possible (via `react-docgen-typescript`), so you often don't write them manually unless customizing the control.

### Q9.4: What are decorators and when do you use them?

A decorator wraps every story (or stories at a level) with extra context — anything the component needs to render that isn't a prop. Common cases:

- Wrapping in a Redux `Provider` so stories can use `useSelector`.
- Wrapping in a TanStack Query `QueryClientProvider` with mock data.
- Wrapping in a `ThemeProvider`, with toolbar toggle for light/dark.
- Wrapping in a `MemoryRouter` so stories using `<Link>` don't crash.
- Adding a Tailwind container class so spacing looks right in isolation.

```typescript
const meta: Meta = {
  decorators: [
    (Story) => (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <Story />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    ),
  ],
};
```

Decorators can also be set globally in `.storybook/preview.ts` so every story gets them by default.

### Q9.5: How do you handle stories for components that fetch data?

Three approaches, ranked:

1. **Lift the fetch out of the component.** Make the component accept data as a prop. The container fetches, the presentational component renders. Stories pass mock data directly. **Best for testability and storybook-ability.**
2. **Mock the fetch layer with msw.** `msw-storybook-addon` lets stories declare mocked endpoints. The component fetches normally; msw intercepts. Good when you can't easily refactor the component.
3. **Mock the hook.** Replace `useGetCandidates` with a Jest-style mock in a decorator. Brittle — every internal change breaks stories.

Octagnt's pattern: container components do the fetching with TanStack Query; presentational components just render. Stories live for the presentational components. Container stories (if any) use msw.

### Q9.6: How do you do interaction tests in Storybook?

`@storybook/addon-interactions` + the `play` function. The `play` runs after the story renders, using Testing Library:

```typescript
export const Submitting: Story = {
  args: { onSubmit: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(canvas.getByLabelText('Password'), 'hunter2');
    await userEvent.click(canvas.getByRole('button', { name: 'Sign in' }));
    await expect(args.onSubmit).toHaveBeenCalled();
  },
};
```

This is essentially RTL inside Storybook. The win: tests are colocated with the visual examples, you can debug them step-by-step in the Storybook UI (rewind, replay), and test runners (`@storybook/test-runner`) execute them in CI. Plus, the story doubles as documentation — anyone reviewing the form sees it filled in correctly.

### Q9.7: How do you set up visual regression testing?

**Chromatic** is the standard pairing — built by the Storybook team. On each PR, Chromatic snapshots every story across configured browsers/viewports and diffs against the previous baseline. UI reviewers approve or reject visual changes; approved diffs become the new baseline. Catches: accidental margin changes, font shifts, color regressions, layout-breaking refactors that unit tests miss.

```
   PR opened ──> CI builds Storybook ──> Chromatic snapshots
                                               │
                                               ▼
                                    diff vs baseline images
                                               │
                                               ▼
                          changes? ──> reviewer approves/rejects
                                               │
                                               ▼
                                  approved diffs ──> new baseline
```

Alternatives: Playwright has a Storybook integration for self-hosted visual testing (no Chromatic license, more setup); Percy by BrowserStack does the same.

### Q9.8: How do you organize a large Storybook?

By design system layer. Octagnt-style structure:

```
UI/                       # Primitives — depend on nothing
  Button
  Input
  Card
  Dialog
  ...
Patterns/                 # Compositions of primitives
  FormField
  EmptyState
  ConfirmDialog
Features/                 # Feature-specific reusables
  CandidateCard
  ScoreBar
Pages/                    # Full-page snapshots, mostly for visual regression
```

The `title` field places stories in this tree (`title: 'UI/Button'`). Be consistent — designers will browse this; sloppy organization is friction for everyone. Larger orgs add ownership tags (CODEOWNERS-style) per folder.

### Q9.9: A story works locally but breaks in deployed Storybook — what's wrong?

Common causes:

1. **Environment variables.** Storybook builds at deploy time; `import.meta.env` values are baked in then. If a story relies on a runtime variable, stub it in `preview.ts`.
2. **Static asset paths.** Local dev resolves assets relative to `public/`; deployed Storybook may have a different base path. Set `viteFinal.base` in `.storybook/main.ts` correctly.
3. **`process.env` references** in browser code aren't polyfilled in production builds. Use `import.meta.env` consistently.
4. **Browser-only APIs at module top level** (e.g., `window.matchMedia(...)` at import time) crash at build time. Wrap in a `typeof window !== 'undefined'` check or initialize lazily.
5. **Missing decorator** for a piece of context the component needs — locally you may have logged in by hand.

### Q9.10: When does Storybook earn its place — and when is it overhead?

**Earns it:**
- Shared component library used across teams or products.
- Design-system-heavy work (Octagnt fits this).
- High-traffic UI where visual regression matters.
- Teams with non-engineer reviewers (designers, PMs) who benefit from a visual catalog.

**Overhead:**
- Small team, product-specific UI tightly coupled to feature context.
- Components that change shape weekly — the story maintenance cost outweighs the benefit.
- Internal admin tools where visual polish doesn't matter.

Octagnt uses Storybook for the shadcn/ui-based primitives and shared components (where stability matters); feature-specific one-off components live without stories. The team agreed on this rule explicitly to keep maintenance reasonable.

---

## 10. Build Tools & Performance

### Q10.1: Vite vs Webpack — why the industry shift?
Webpack bundles everything, even in dev — slow on big codebases. Vite uses native ESM in dev: serves source files directly to the browser, lets the browser request modules on demand. Cold start ~100x faster on large projects. For production, Vite uses Rollup (recently Rolldown) for optimized bundles. Tradeoff: Vite's plugin API is simpler but smaller; some Webpack-specific loaders don't have Vite equivalents.

### Q10.2: You reduced load time by 25% — walk me through how.
**Be specific about your actual experience.** Common levers: route-based code splitting with `React.lazy` + Suspense (each route a separate chunk); bundle analysis (`rollup-plugin-visualizer`, `source-map-explorer`) and replacing heavy deps; tree-shaking unused exports; deferring non-critical scripts; preloading critical fonts/CSS; image optimization (responsive `srcset`, lazy loading); moving heavy synchronous work to Web Workers if applicable.

### Q10.3: What are Core Web Vitals and how do you measure them?
Three Google metrics: **LCP** (Largest Contentful Paint — when main content renders, target <2.5s); **CLS** (Cumulative Layout Shift — visual stability, target <0.1); **INP** (Interaction to Next Paint — responsiveness, target <200ms; replaced FID in 2024). Measure: Lighthouse for synthetic, the `web-vitals` library for real-user monitoring (RUM), and field data via Chrome's CrUX dataset. PageSpeed Insights surfaces both.

### Q10.4: Explain code splitting and lazy loading concretely.
Code splitting breaks your bundle into chunks loaded on demand. In React: `const Profile = lazy(() => import('./Profile'))` creates a separate chunk. Wrap usage in `<Suspense fallback={...}>`. The router only loads Profile's chunk when the user hits `/profile`. Result: smaller initial bundle, faster Time to Interactive. Tradeoff: extra request when navigating, mitigated by prefetching with `<link rel="prefetch">` or React Router's preload patterns.

### Q10.5: A page is slow on first load. How do you diagnose?
1. Lighthouse audit — which metric fails?
2. Network tab — what's loaded, sizes, blocking?
3. Performance tab — flame graph for JS execution; identify long tasks
4. Coverage tab — unused JS/CSS
5. Bundle analyzer — what's in the JS, are heavy deps justified?

Common fixes: code split routes, defer third-party scripts, optimize images, reduce render-blocking CSS, `font-display: swap`.

---

## 11. AWS S3 Multipart Upload

### Q11.1: What's S3 multipart upload and why use it for video?
Standard S3 PUT supports up to 5 GB per object but is one shot — any byte fails, you re-upload everything. Multipart splits the file into parts (5 MB minimum, 5 GB maximum per part), uploads each independently, then completes by sending the list of part ETags. Benefits: parallelism (faster), resumability (failed parts retry without restarting), and support for files up to 5 TB. For videos that are often hundreds of MB to several GB, this dramatically reduces failure rates on flaky connections.

### Q11.2: Walk me through the frontend flow.

```
Phase 1: INITIATE
─────────────────
Frontend ────POST /uploads/initiate────> Backend
                                            │
                                            │ s3.createMultipartUpload()
                                            ▼
                                          S3
                                            │
                                            │ returns UploadId
                                            ▼
Frontend <───{ uploadId, presignedUrls[] }── Backend
            (one URL per part)


Phase 2: UPLOAD PARTS (parallel, bounded concurrency)
─────────────────────────────────────────────────────
For each part:
  Frontend slices file (Blob.slice)
  Frontend ────PUT presignedUrl[i]────> S3
  S3 returns ETag in response header
  Track progress per part, retry with backoff on failure


Phase 3: COMPLETE
─────────────────
Frontend ────POST /uploads/complete────> Backend
       { uploadId, parts: [{ PartNumber, ETag }] }
                                            │
                                            │ s3.completeMultipartUpload()
                                            ▼
                                          S3
                                            │
                                            │ assembles parts into final object
                                            ▼
Frontend <───{ location, key }────────── Backend
```

If the user cancels or hits an unrecoverable error, abort the upload server-side via `abortMultipartUpload` to avoid orphaned parts and the storage charges that accumulate for incomplete uploads.

### Q11.3: Why pre-signed URLs?
They let the frontend upload directly to S3 without proxying through our backend (saves bandwidth, latency, server CPU). The backend signs short-lived URLs scoped to a specific operation (PUT to this key, expires in N minutes). AWS credentials never touch the browser. Downside: backend can't inspect or modify the upload mid-stream — we trust the bucket policy and the size/MIME constraints we baked into the pre-signed URL.

### Q11.4: How did you reduce failure rate by 30%?
**Be ready with your specifics.** Likely contributors: implementing proper retry-per-part with exponential backoff (vs. one-shot PUT that failed on transient errors); concurrency tuning (too many parallel parts saturated the connection and caused timeouts; we settled on a small fixed pool, e.g., 4); a network-aware pause/resume; surfacing per-part progress so users didn't kill stuck uploads prematurely.

### Q11.5: How would you implement upload progress?
Listen to `XMLHttpRequest`'s `progress` event (the `fetch` API doesn't have great upload progress yet — see Axios Q5.6). Aggregate per-part progress into a total, update state via a throttled callback (don't re-render on every byte). For multipart, total = (completed parts × part size + current part progress) / total bytes.

---

## 12. Stripe Integration

### Q12.1: Walk me through the subscription signup flow you built.

```
1. User clicks "Subscribe to Growth Plan"
   └─ Frontend → Backend: POST /create-checkout-session  { planId, tenantId }
                          └─ Backend → Stripe: stripe.checkout.sessions.create(...)
                          └─ Stripe → Backend: { id, url }
   └─ Frontend redirects: window.location = session.url

2. User completes payment on Stripe-hosted page
   (PCI scope stays at Stripe; card details never touch our infrastructure)

3. Async, parallel:
   ├─ Stripe → Browser: redirect to ${success_url}
   │                    └─ Frontend lands on /billing/success
   │                    └─ Frontend polls /v1/subscription/me until "active"
   │
   └─ Stripe → Backend: webhook "checkout.session.completed"
                        └─ Backend verifies signature
                        └─ Backend activates subscription in DB
                        └─ Backend replies 200
```

The redirect is just a UX hint. The webhook is the source of truth for activation.

### Q12.2: Why is the webhook the source of truth, not the redirect?
The redirect happens in the user's browser and can be lost (closed tab, network blip, ad blocker). It's a UX hint, not a guarantee. The webhook is server-to-server, retried by Stripe with exponential backoff if our endpoint fails (up to 3 days), and is the only signal we can fully trust to activate billing state. Best practice: set the subscription to "pending" on redirect for instant UX, but only mark "active" when the webhook confirms it.

### Q12.3: Stripe Checkout vs Stripe Elements — when which?

**Checkout** — Stripe's hosted page. Pros: fastest to integrate, full PCI scope handled by Stripe (you handle SAQ A, the simplest level), built-in support for SCA/3D Secure, mobile-optimized, multiple payment methods (cards, Apple Pay, etc.) included automatically. Cons: limited UI customization; user briefly leaves your app.

**Elements** — pre-built React components (`<CardElement>`, `<PaymentElement>`) embedded in your own UI. Pros: full UX control, never leave your domain. Cons: more integration work, you handle the form layout, you need Stripe.js loaded and the iframe-based components are styled via prop overrides only.

Octagnt uses Checkout because the plan-comparison + payment combo is well-served by Stripe's hosted UI and we didn't need custom branding inside the payment step itself.

### Q12.4: How do you handle plan upgrades or downgrades mid-cycle?
Stripe Billing Portal handles it out of the box — link the user to a Customer Portal session and Stripe manages prorations, immediate vs end-of-cycle changes, and cancellation. For more control, our backend can call the Subscriptions Update API directly with `proration_behavior` set to `create_prorations` (charges/credits the diff immediately) or `none` (apply at next cycle). Frontend just initiates the request and listens for the webhook to refresh local state.

### Q12.5: How does feature gating work in your code?
Two layers — backend authoritative, frontend UX:
- **Backend:** middleware checks the tenant's current plan against the requested feature, returns 402 (Payment Required) or 403 if not allowed.
- **Frontend:** a `<FeatureGate feature="voice-screening">` component reads the tenant's plan from TanStack Query, renders the feature or an upgrade CTA.

Frontend gating is a UX nicety; the backend is what actually enforces. Never trust frontend-only gating.

### Q12.6: A user paid but their account didn't upgrade. How do you debug?
Check Stripe Dashboard → Events log: did the webhook fire? Did our endpoint return 200? If the webhook failed, retry from Stripe (it auto-retries on 5xx but we can manually replay). If it succeeded, the bug is in our handler — check application logs for that event ID. If the event isn't there at all, check that the customer's subscription is actually active in Stripe. Common cause: testing with a test-mode key but pointing at the live webhook endpoint, or vice versa.

### Q12.7: What's an idempotency key and why does Stripe use them?

A unique string the client sends with a request. Stripe stores the result against the key for 24 hours; if the same key arrives again, Stripe returns the cached result instead of re-executing. So retrying a payment doesn't double-charge.

```typescript
await stripe.paymentIntents.create(
  { amount: 1800_00, currency: 'usd', customer: customerId },
  { idempotencyKey: 'pi_signup_user123_attempt1' }
);
```

You generate the key at the *start* of the operation and reuse it on retries (the same logical retry, not just a randomized one). The key should be deterministic for the same logical operation (e.g., based on user ID + intent + timestamp window) so retries hit the same cache entry. This is how you safely retry a POST that creates a charge — without idempotency keys, retries on a flaky network can charge the customer twice.

This pattern isn't unique to Stripe. Any non-idempotent endpoint should accept idempotency keys.

### Q12.8: How do you verify a Stripe webhook signature?

Stripe signs every webhook with a secret you set up in their dashboard. Your endpoint must verify the signature before trusting the payload — otherwise an attacker who learns your endpoint URL could POST fake events.

```typescript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_KEY!);

app.post(
  '/webhook',
  express.raw({ type: 'application/json' }),  // CRITICAL: raw body
  (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body, sig, process.env.WEBHOOK_SECRET!
      );
    } catch (err) {
      return res.status(400).send(`Bad signature: ${(err as Error).message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      // ... other events
    }
    res.json({ received: true });
  }
);
```

Critical: the body must be the **raw bytes**, not parsed JSON. Express's default `express.json()` middleware breaks the signature verification because it produces a different byte sequence than what Stripe signed. Use `express.raw()` for this route only.

### Q12.9: What's the subscription lifecycle? What do the states mean?

Stripe subscriptions move through these states:

```
                ┌──────────────┐
                │  incomplete  │ (initial state, payment not confirmed)
                └──────┬───────┘
       payment        │      no payment within 23h
       succeeds       │
                      ▼               ▼
                ┌──────────────┐  ┌──────────────────────┐
                │   trialing   │  │ incomplete_expired   │
                └──────┬───────┘  │  (terminal — gone)   │
                  trial│          └──────────────────────┘
                   ends│
                       ▼
                ┌──────────────┐ payment ┌──────────────┐
                │    active    ├────────>│  past_due    │
                │              │  fails  │              │
                └──────┬───────┘<────────┴──────┬───────┘
                       │ payment succeeds       │ retries
                       │                        │ exhausted
                       │ user                   │
                       │ cancels                ▼
                       ▼                  ┌──────────────┐
                ┌──────────────┐          │   unpaid     │
                │   canceled   │          └──────┬───────┘
                │  (terminal)  │<────────────────┘
                └──────────────┘
```

- `incomplete` — checkout started, payment not confirmed yet.
- `incomplete_expired` — payment never confirmed; subscription dead.
- `trialing` — in the trial period; access granted.
- `active` — paid and good.
- `past_due` — invoice failed, retrying per Smart Retries.
- `unpaid` — retries exhausted; access depends on your config.
- `canceled` — done (could be user-canceled, payment-failed-too-long, or admin-canceled).

`past_due` is the tricky one — Stripe retries automatically over a configurable schedule. During `past_due`, you typically still grant access but show a "payment failed, please update" banner. The product/PM call: how long is the grace period, do you go read-only first?

### Q12.10: How do you handle SCA (Strong Customer Authentication) / 3D Secure?

SCA is a European regulation requiring extra auth (typically a bank-issued OTP, biometric, or 3D Secure flow) for many card payments. Stripe handles this for you if you use PaymentIntents and Stripe.js — when a card requires SCA, the `confirmCardPayment` call returns a status of `requires_action`, Stripe.js handles the redirect to the bank's challenge page, and resolves with the final state. You don't implement SCA flows manually; you respect Stripe's status and call the right confirm method.

If you're using Checkout Sessions (which Octagnt does), this is fully handled for you — Checkout's hosted page does SCA inline. The status flow on the backend remains the same regardless: the `payment_intent.succeeded` webhook fires only when SCA (if required) was completed.

### Q12.11: A subscription's invoice failed. What does Stripe do automatically and what do you handle?

**Stripe automatically:**
- Retries the payment per your dunning schedule (Smart Retries — typically 4 attempts over a week, smart-timed based on success likelihood).
- Sends emails to the customer if you've enabled them in Stripe settings.
- Updates subscription state to `past_due`, then `unpaid` or `canceled` based on your config.

**You handle:**
- Receiving `invoice.payment_failed` and `customer.subscription.updated` webhooks.
- Updating internal state to reflect the new subscription state.
- Showing a banner in the UI urging payment update; linking to the Billing Portal for the user to update their card.
- Optionally, blocking access to premium features after some grace period.

The grace period is product/PM-driven — losing access immediately on a failed payment is harsh; never blocking is risky. A common middle ground: 3-day grace, then read-only mode, then full block at day 14.

### Q12.12: How do you let users save a payment method for future use?

Use **SetupIntents** instead of (or in addition to) PaymentIntents. SetupIntents collect and validate payment method details without charging. Once confirmed, attach the payment method to the customer:

```typescript
// Backend
const setupIntent = await stripe.setupIntents.create({ customer: customerId });

// Frontend
const { error } = await stripe.confirmCardSetup(
  setupIntent.client_secret,
  { payment_method: { card: cardElement } }
);
```

For subscriptions, the customer's default payment method is used automatically on subsequent invoices. For "Pay later" / on-demand charging flows, retrieve the saved payment method ID and attach it to a new PaymentIntent. This is also how you do "save card for next time" UX in checkout flows that aren't subscription-based.

### Q12.13: What's Stripe metadata — and what's it for?

Every Stripe object (Customer, Subscription, PaymentIntent, Invoice, etc.) has a `metadata` field — an arbitrary key/value map (up to 50 keys, 500 chars each). It's the bridge between Stripe IDs and your domain IDs:

```typescript
await stripe.customers.create({
  email: user.email,
  metadata: {
    tenant_id: user.tenantId,
    internal_user_id: user.id,
    plan_at_signup: 'growth',
  },
});
```

In webhook handlers, you read `event.data.object.metadata.tenant_id` to know whose subscription changed. Without metadata, mapping a Stripe event to a tenant would require a DB lookup by Stripe customer ID — slower and more brittle. Best practice: stamp metadata at creation time on every Stripe object you create.

### Q12.14: Test mode vs live mode — common pitfalls.

- **API keys are different.** `sk_test_…` vs `sk_live_…`. Mixing them up triggers obvious 401s — but worse cases happen when both are configured in different env vars and you grab the wrong one.
- **Webhook secrets are different per mode.** The webhook URLs may also differ (test endpoint, live endpoint).
- **Test cards.** Test mode supports specific card numbers (4242…, 4000 0000 0000 0341 for `requires_action`, etc.) that simulate edge cases predictably. Don't use live cards in test mode — they'll be rejected.
- **Test data doesn't transfer to live.** Don't develop a long flow with real-looking customers in test mode and expect live customers to migrate over.
- **Dashboard mode toggle.** Stripe events can be filtered in the dashboard by mode. If you're hunting for a test event in live mode, you'll see nothing and waste an hour.
- **Live mode access.** Lock the live mode dashboard and API keys to senior engineers and on-call. Anyone with live mode access can refund or cancel real customer subscriptions.

### Q12.15: A user is in `incomplete` for 24 hours and never paid. Why might that be?

`incomplete` means the initial payment never confirmed. Causes:
- They left the Checkout page without completing payment.
- The card required SCA (3DS) and they didn't complete the bank challenge.
- They paid but the card was declined for fraud or insufficient funds.
- A network blip during payment confirmation lost the response.

Stripe expires `incomplete` subscriptions after 23 hours by default — moves them to `incomplete_expired`, which is terminal. The user has to start a new checkout. Webhook: `customer.subscription.updated` with status change to `incomplete_expired`. Surface this in the UI as "your signup didn't complete, would you like to try again?" — and link them back to the plan picker.

### Q12.16: Stripe Customer Portal — what does it give you for free?

A hosted page where customers can self-serve:
- Update payment method.
- Update billing address.
- View invoices and payment history.
- Upgrade/downgrade plans (configurable).
- Cancel subscription (configurable).
- Manage trial.

You configure what's available in Stripe Dashboard → Customer Portal settings. From your app: `stripe.billingPortal.sessions.create({ customer, return_url })`, redirect to the returned URL. Costs you about 30 minutes to integrate; saves dozens of UI flows you'd otherwise build.

### Q12.17: How do you handle refunds and disputes?

**Refunds** — initiated by you (full or partial) via `stripe.refunds.create({ charge: chargeId, amount })`. The customer's card is credited. Webhooks: `charge.refunded`. Update internal state and any earned credit/usage accordingly.

**Disputes** — initiated by the customer through their bank ("I didn't authorize this"). Stripe sends a `charge.dispute.created` webhook. You typically have 7–21 days (depending on card network) to submit evidence (delivery proof, terms of service, login records). If you lose, the funds are pulled from your account plus a $15 fee. Disputes are bad for your account health — track and respond promptly.

For both, the backend is authoritative. The frontend just shows status and history; refund and dispute initiation usually happen in the dashboard or admin tools, not the user-facing app.

---

## 13. RBAC & Multi-tenancy

### Q13.1: How is RBAC implemented on the frontend?
User logs in → JWT contains `roleId` and `tenantId` → after auth, we fetch the user's permission list (grants tied to their role) and store in Redux. Throughout the UI: a `usePermission('candidates.delete')` hook returns boolean; a `<Can permission="...">` component conditionally renders. Routes are protected by a `<RequirePermission>` wrapper that redirects unauthorized users. Mirroring Stripe gating: backend enforces, frontend reflects.

### Q13.2: How is tenant isolation enforced?
At the API boundary — every request includes a tenant ID (from JWT or `x-tenant-id` header), and every database query is scoped by that tenant ID. The frontend's job is to send the right tenant context; it cannot leak data across tenants because the backend filters. For URL design, we either embed tenant in the path (`/t/:tenantId/...`) or rely on the cookie/JWT and keep URLs tenant-agnostic.

### Q13.3: What happens when a user's permissions change while they're logged in?
A few approaches:
1. Re-fetch permissions on each navigation (extra requests, simple).
2. Listen on a websocket for permission-change events and update the store live.
3. Re-fetch when the JWT refreshes (simplest, slight delay).

The 401/403 from the backend is the ultimate authority — even if the UI says they can do something, the backend rejects. Surface that as a friendly "your access changed, please refresh" message.

### Q13.4: How do you prevent route flicker on protected pages?
The classic problem: page renders, then redirects on auth check. Fix: gate rendering on auth state being known. Show a loading skeleton while the auth/permission query is in flight; render the page only when permissions are confirmed; redirect when confirmed-not-allowed. TanStack Query's `isLoading` + `isError` + `data` give you the three states cleanly.

---

## 14. Google Tag Manager

### Q14.1: What's Google Tag Manager and how is it different from gtag.js?

`gtag.js` is the analytics SDK — you embed it directly and call `gtag('event', ...)` to send data to Google Analytics 4.

GTM is a **layer in front** of gtag.js (and dozens of other tags — Facebook Pixel, LinkedIn Insight, custom HTML). You install one GTM container script; from there, marketing/analytics teams can add and edit tags in a web UI without code changes. The GTM container fires the right tags at the right times based on rules ("triggers") you configure.

Why teams adopt GTM:
- **Decouples analytics from engineering.** Marketing can add a Facebook Pixel without a deploy.
- **One source of truth** for all tracking, with versioning and rollback.
- **Built-in debugging** via Preview Mode.
- **Server-side variant** for privacy and ad-blocker resilience.

Tradeoff: another script on the page (a few KB), and a layer of indirection that can hide bugs ("why did GA stop receiving events?" → 30 minutes in the GTM console).

### Q14.2: GTM concepts — container, tag, trigger, variable.

```
   ┌──────────────────────────────────────────────────┐
   │                  GTM Container                   │
   │  (one script tag, loads once)                    │
   │                                                  │
   │  ┌──────────┐    fires when   ┌──────────────┐   │
   │  │  Tag A   │ <─────────────  │  Trigger A   │   │
   │  │ (GA4 ev) │                 │ (Click Btn)  │   │
   │  └─────┬────┘                 └──────────────┘   │
   │        │ uses                                    │
   │        ▼                                         │
   │  ┌──────────────┐                                │
   │  │ Variable     │                                │
   │  │ {{Click URL}}│                                │
   │  └──────────────┘                                │
   └──────────────────────────────────────────────────┘
```

- **Container** — the script you embed. One per site (usually).
- **Tag** — a piece of code that fires (e.g., a GA4 event, a Facebook Pixel call, a custom HTML snippet, a conversion pixel).
- **Trigger** — the rule that fires a tag (page view, click, custom event, form submission, route change).
- **Variable** — a value used in tags or triggers (page URL, click element, dataLayer values, custom JS expressions).

A tag fires when its trigger matches; the tag uses variables for its data.

### Q14.3: What's the dataLayer and how do you use it from React?

The `dataLayer` is a global JavaScript array that GTM watches. You push events into it; GTM picks them up and routes them through tags.

```
React Component
   │
   │ dataLayer.push({ event: 'subscription_purchased', plan: 'growth', amount: 1800 })
   ▼
window.dataLayer (queue)
   │
   ▼
GTM Container (loaded once at page start)
   │
   │ Triggers fire on matching events
   ▼
Tags execute (GA4, FB Pixel, LinkedIn, etc.)
   │
   ▼
Data sent to analytics destinations
```

In a React app, wrap pushes in a typed helper:

```typescript
// tracking.ts
type TrackEvent =
  | { event: 'page_view'; page_path: string; page_title: string }
  | { event: 'subscription_purchased'; plan: string; amount: number; currency: string }
  | { event: 'role_created'; role_id: string };

export function track(event: TrackEvent) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
}

// usage in component
track({ event: 'subscription_purchased', plan, amount, currency: 'USD' });
```

The reason the dataLayer is a queue (and not a function): events pushed *before* GTM loads are buffered and still fire when GTM initializes. Don't bypass it by calling `gtag()` directly — you lose that buffering and break the abstraction.

### Q14.4: Why don't page-view triggers fire on route change in an SPA?

The default Page View trigger in GTM fires on actual full-page loads (the browser firing `DOMContentLoaded` / `window.load`). In an SPA, route changes don't reload the page — React Router updates the URL via `pushState` and re-renders, but no page load event fires.

Fix: emit a custom event yourself on route change, and configure GTM with a custom event trigger:

```typescript
// In your top-level layout or router
import { useLocation } from 'react-router-dom';

function RouteTracker() {
  const location = useLocation();
  useEffect(() => {
    track({
      event: 'page_view',
      page_path: location.pathname + location.search,
      page_title: document.title,
    });
  }, [location.pathname, location.search]);
  return null;
}
```

Then in GTM: trigger type "Custom Event," event name "page_view," and your GA4 tag fires. The GA4 tag should be configured *not* to send a page_view automatically (uncheck "Send a page view event when this configuration loads"), or you'll double-count.

### Q14.5: How do you debug GTM? It's not firing what you expect.

GTM Preview Mode is the answer:
1. Open the GTM workspace → click "Preview."
2. Enter your site URL; it opens with Tag Assistant attached.
3. Interact with the site; the Tag Assistant panel shows every event in order, the dataLayer state at each step, which tags fired (and which didn't, and why).

Common issues you'll catch this way:
- A trigger condition that doesn't match (variable name typo).
- A tag firing twice because two triggers overlap.
- A dataLayer push happening before GTM loads (event lost).
- Consent state blocking the tag (GTM honors Consent Mode v2).
- Variables resolving to `undefined` because the field wasn't in the dataLayer push.

GA4's DebugView (in the GA4 console under Admin → DebugView) is the next tool — it shows events arriving at GA4 in real time, so you can verify the GTM → GA4 hop succeeded.

### Q14.6: How do you handle GDPR / consent?

**Consent Mode v2** — GTM has built-in support. You signal consent state via:

```typescript
// Default state before user interacts
gtag('consent', 'default', {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
});

// Later, after user consents through your CMP banner:
gtag('consent', 'update', {
  analytics_storage: 'granted',
});
```

Tags configured with consent requirements check this state before firing. Until consent is granted, they either don't fire (strict mode) or fire with cookieless pings (basic mode — sends pings without cookies for aggregate counting). Pair with a proper CMP (Cookie Consent Management Platform — OneTrust, Cookiebot, etc.) — GTM doesn't show the banner; it just respects what the banner sets.

### Q14.7: A user reports double-counted events in GA4. How do you diagnose?

Likely culprits:
- **Two GA4 tags configured in GTM**, both firing on the same trigger.
- **Both `gtag.js` and a GA4 tag installed** (one direct in `<head>`, one via GTM).
- **A trigger that matches more than expected** (e.g., "click — all elements" when you meant "click — buttons").
- **React StrictMode** causing `useEffect` to run twice in dev — verify it reproduces in prod, not just dev.
- **The dataLayer being pushed in two code paths** for the same logical event.
- **GA4's automatic page views** + your manual page_view event both firing.

Always reproduce in Preview Mode and look at the timeline. Often the answer is obvious once you see two `page_view` events stacked back to back.

### Q14.8: Server-side GTM vs client-side — what's the point?

**Client-side GTM** — runs in the browser; tags ship third-party JS to your users.

**Server-side GTM** — proxies events through *your* server. Clients send events to your endpoint (a server-side container, typically hosted on GCP App Engine), the server-side container forwards them to GA, Facebook, LinkedIn, etc.

Wins of server-side:
- **Privacy/perf.** Fewer third-party scripts in the browser; less to block, less to fingerprint.
- **Data control.** You can enrich, filter, redact PII server-side before sending to vendors.
- **Ad blocker resilience.** Events to your domain (`analytics.yoursite.com`) aren't blocked the way `google-analytics.com` is.
- **First-party cookies.** Cookies set by your domain have better persistence than third-party.

Cost: you host the server-side container, and the architecture is more complex (two GTM containers — client and server — keeping their schemas in sync). Worth it for traffic-heavy sites with strict privacy posture or strong ad-blocker concerns.

### Q14.9: What's in the dataLayer when you push an ecommerce event?

GA4 has a recommended schema. Example for a subscription purchase:

```typescript
track({
  event: 'purchase',
  ecommerce: {
    transaction_id: 'sub_123',
    value: 1800,
    currency: 'USD',
    items: [
      {
        item_id: 'plan_growth',
        item_name: 'Growth Plan',
        item_category: 'subscription',
        price: 1800,
        quantity: 1,
      },
    ],
  },
});
```

The GA4 tag in GTM is configured to read `ecommerce.*` and map it to GA4's parameter names. Following the schema makes you compatible with GA4's built-in commerce reports out of the box.

For Octagnt's subscription flow: you'd push `purchase` on the success page (after the webhook confirms). Other useful events: `add_to_cart` (plan selected), `begin_checkout` (Stripe Checkout opened), `purchase` (subscription active), `refund`.

### Q14.10: Marketing wants a new tag added urgently. What's the right process?

Even though GTM lets non-engineers add tags, "anyone can change tracking in production" is a recipe for accidents. The healthy process:

1. Marketing files a request describing what to track and why.
2. Someone with GTM access (you, an analytics engineer, or marketing themselves with proper training) adds the tag in a workspace (NOT directly in the live container).
3. Test in Preview Mode against staging.
4. Submit a version (GTM has versioning built in).
5. Publish — ideally with a peer review.

Most orgs lock production publishing to a small group; everyone else proposes via workspaces. This is GTM's killer feature — it's IaC (Infrastructure as Code) for analytics, with built-in rollback.

Common gotchas to flag during review: PII in event params (don't send email addresses to GA), broad triggers that fire on every click, tags loaded from third-party domains you don't trust.

---

## 15. Observability & Tooling (Kibana, Postman)

### Q15.1: What's the ELK stack and where does Kibana fit?

ELK = **E**lasticsearch + **L**ogstash + **K**ibana. Modern stacks often add Beats (lightweight log shippers) and may replace Logstash with Vector or Fluentd:

```
   ┌──────────┐    ┌──────────┐    ┌──────────────┐    ┌──────────┐    ┌────────┐
   │  Apps    │ ─> │ Filebeat │ ─> │   Logstash   │ ─> │ Elastic- │ ─> │ Kibana │
   │ (logs,   │    │ (shipper)│    │ (parse,      │    │  search  │    │ (query,│
   │ metrics) │    │          │    │  enrich,     │    │ (index,  │    │  viz,  │
   │          │    │          │    │  transform)  │    │  store)  │    │ alert) │
   └──────────┘    └──────────┘    └──────────────┘    └──────────┘    └────────┘
```

- **Beats / Filebeat** — agents on app servers that ship logs.
- **Logstash** — parses (e.g., regex on stack traces), enriches (e.g., add geo from IP), transforms.
- **Elasticsearch** — full-text search engine; stores logs indexed by time + fields.
- **Kibana** — UI for querying ES, building visualizations and dashboards.

In SaaS observability, ES is often replaced by hosted alternatives (Datadog, New Relic, Honeycomb), but the ELK pattern is still extremely common in self-hosted setups and AWS OpenSearch.

### Q15.2: How do you actually use Kibana day to day as a frontend engineer?

- **Reading errors:** an error in production triggers a Sentry alert; Sentry has the stack trace, but to correlate with backend events I jump to Kibana with the request ID and find every log line for that request across services.
- **Debugging slow pages:** filter by `response_time:>2000` and the page URL; see which downstream calls are the bottleneck.
- **Validating a release:** after deploying, watch the error log dashboard for a few hours, filtered to the new version.
- **Investigating a user complaint:** filter by user ID or tenant ID; reconstruct what they did.
- **Capacity:** look at request counts and 95p latency over time to know if the system is stressed.

### Q15.3: KQL (Kibana Query Language) — give me some queries.

```
status: 500                                        # all 500s
service: api AND level: error AND NOT message: "noisy"
@timestamp > "2026-04-01T00:00:00Z" AND tenant_id: "abc-123"
url: "/v1/candidates/*"                            # wildcard
duration: >1000                                    # numeric range
user_id: ("u1" OR "u2" OR "u3")                    # OR list
NOT (status: 200 OR status: 201)                   # negation with grouping
exists: error.stack                                # field exists
```

Add a time picker filter for the last 15 min / 1 hour / etc. (the time range is separate from the KQL query — set in the top-right of Kibana). You'll live in this UI when debugging incidents.

### Q15.4: How do you set up a dashboard for frontend errors?

In Kibana:
1. Create an **Index Pattern** matching your frontend log index (e.g., `frontend-logs-*`).
2. Create **Visualizations**:
   - Line chart: error count over time, broken down by `error.type`.
   - Pie chart: errors by `browser`, `os`, `version`.
   - Data table: top 10 errors with count and last-seen time.
   - Metric: total errors in selected time range.
3. Assemble them on a **Dashboard**; add filters (time range, environment, version).

The discipline that matters more than the dashboard itself: log structured data on the frontend (use a logger that emits JSON, not strings). `console.error('something broke', error)` is useless in Kibana; `logger.error({ event: 'upload_failed', error: err.message, stack: err.stack, user_id, tenant_id })` is queryable.

### Q15.5: How do you set up an alert in Kibana?

Kibana's alerting framework lets you define a rule: "when this query returns >N hits in T window, do X." X can be: email, Slack webhook, PagerDuty page, ServiceNow ticket. Common alerts:
- Error rate spike (errors/min above baseline).
- p99 latency breach on a critical endpoint.
- Missing heartbeat from a service (no logs in 5 min from a service that should log every minute).
- Specific error patterns ("OutOfMemory" appearing).

The discipline: alert on **symptoms** (users see errors, latency spiked) **not causes** (CPU is high — maybe fine, maybe not). Symptoms-based alerts have far fewer false positives. Always include a runbook link in the alert payload — "you got paged, here's the dashboard, here's the rollback button."

### Q15.6: A production deploy went out an hour ago and the error rate looks higher in Kibana — but it's hard to tell. How do you confirm?

1. Compare windows of equal length: last 1 hour vs the 1 hour before that, or "last 1 hour" vs "same hour yesterday" (controls for daily traffic patterns).
2. Filter by `version` field — was the new version actually deployed everywhere, or is it a rolling deploy partway through?
3. Look at error categories — is the spike one specific error type or broad?
4. If one error: that's almost certainly a regression in the new release. Plot it as a histogram bucketed by version to see the cutover.
5. Compare error rate as a percentage of total requests, not absolute count — traffic naturally varies.
6. Sanity-check against frontend monitoring (Sentry, RUM): are users actually seeing more errors, or is just a logging-volume change?

### Q15.7: Have you set up logging for a frontend app?

**Be ready with your specifics.** Common setup: a small client logger that posts events to a backend `/log` endpoint, the backend writes to a log file Kibana ingests. What to capture:
- Unhandled errors (`window.onerror`, `unhandledrejection`).
- Context: user ID, tenant ID, route, build version, browser/OS.
- Breadcrumbs: last N user actions before the error (clicks, navigations, API calls).
- Performance metrics: Web Vitals via the `web-vitals` library.

What to avoid: PII (emails, names, full URLs with query params that contain tokens), high-cardinality data that explodes index size.

Sentry is the popular all-in-one for the frontend — captures errors with source maps applied automatically, breadcrumbs, performance, session replay — but the same ideas apply if you're rolling your own.

---

### Q15.8: Postman — collections and environments. How do you structure them?

A **collection** is a folder of related requests (e.g., "Octagnt API" with sub-folders per resource). An **environment** is a set of variables that swap between contexts (Dev, Staging, Prod).

```
Collection: Octagnt API
├── Auth/
│   ├── Login
│   ├── Refresh token
│   └── Logout
├── Candidates/
│   ├── List candidates
│   ├── Get candidate
│   ├── Bulk upload
│   └── Update candidate
├── Jobs/
│   ├── Create job
│   ├── List jobs
│   └── Process job
└── Subscription/
    ├── Get current plan
    ├── Create checkout session
    └── Cancel subscription

Environments:
├── Dev      (baseUrl=http://localhost:4000, tenantId=test-tenant, ...)
├── Staging  (baseUrl=https://staging.octagnt.com, ...)
└── Prod     (baseUrl=https://api.octagnt.com, ...) — read-only access
```

Requests reference `{{baseUrl}}/v1/candidates`. Switching environments swaps the variable. Collection-level variables hold things constant across all requests (e.g., default `Accept` header).

### Q15.9: What are pre-request scripts and tests?

- **Pre-request script** — runs before the request; useful for: refreshing a token, generating a timestamp, computing a request signature, randomizing test data.
- **Tests** — runs after the response; useful for: assertions and saving values to environment variables (chaining requests).

```javascript
// Pre-request: ensure auth token is fresh
const token = pm.environment.get('token');
const expiresAt = pm.environment.get('tokenExpiresAt');
if (!token || Date.now() > Number(expiresAt)) {
  pm.sendRequest({
    url: pm.environment.get('baseUrl') + '/auth/login',
    method: 'POST',
    header: { 'Content-Type': 'application/json' },
    body: { mode: 'raw', raw: JSON.stringify({
      email: pm.environment.get('email'),
      password: pm.environment.get('password'),
    }) },
  }, (err, res) => {
    if (!err) {
      const data = res.json();
      pm.environment.set('token', data.accessToken);
      pm.environment.set('tokenExpiresAt', Date.now() + 14 * 60 * 1000); // 14m
    }
  });
}

// Tests tab: assert and save the created ID for the next request
pm.test('status is 201', () => pm.response.to.have.status(201));
pm.test('response has id', () => pm.expect(pm.response.json()).to.have.property('id'));
pm.environment.set('candidateId', pm.response.json().id);
```

### Q15.10: How do you chain requests — login then create then verify?

The chain is automatic if each request's "Tests" tab saves what the next request needs:

1. **Login** — saves `token` to environment.
2. **Create candidate** — uses `{{token}}` in headers, saves `candidateId` to environment.
3. **Get candidate** — uses both `{{token}}` and `{{candidateId}}`.

Run the collection (Collection Runner) and Postman fires them in order. Useful for smoke tests, repeatable QA scenarios, and onboarding new engineers ("here's how the API flows").

### Q15.11: What's Newman and when do you use it?

**Newman** is Postman's CLI runner. You export a collection + environment as JSON and run it from CI:

```bash
newman run octagnt.collection.json \
  -e staging.env.json \
  --reporters cli,junit \
  --reporter-junit-export results.xml
```

Use it for:
- **Smoke tests in CD pipelines** — after deploy, hit critical endpoints, fail the build if any request fails.
- **API contract tests** — assert response schemas.
- **Scheduled health checks** — run every 5 minutes, alert on failure.

It catches "the deploy was technically successful but `POST /login` is returning 500" before your users do.

### Q15.12: Mock servers in Postman — when would you use them?

If frontend and backend are developed in parallel, the frontend can't wait for real endpoints. Postman mock servers serve the response examples you defined in the collection. The frontend points at the mock URL, builds the UI, and switches to the real endpoint when it's ready.

Cheaper than spinning up a real server stub; better than hardcoding fixtures (because it forces you to define your API shape upfront, which becomes documentation). Less flexible than `msw` for unit tests (Postman mocks are remote; msw runs in-browser/in-test).

### Q15.13: A teammate complains the API works in Postman but not in the browser. Diagnose.

Almost always one of:

- **CORS.** Browser enforces same-origin policy; Postman doesn't. Check the OPTIONS preflight response and CORS headers (`Access-Control-Allow-Origin`, `Access-Control-Allow-Credentials`, `Access-Control-Allow-Headers`). The browser's Network tab will show preflight failures explicitly.
- **Cookies.** Postman has its own cookie jar separate from browser cookies. Auth that "works in Postman" because Postman has the cookie may fail in the browser if the cookie isn't set right (`SameSite`, `Secure`, `Domain` attributes).
- **Headers.** The browser sends additional headers (`Origin`, `Referer`, varying `User-Agent`) that the server may use for CSRF or fingerprinting checks.
- **Content-Type.** Postman often defaults to one; the browser's fetch/Axios may default differently. A backend that requires `application/json` will reject a `text/plain` body.
- **Credentials mode.** Browser fetch defaults to `same-origin`; you may need `credentials: 'include'`. Postman doesn't have this concept.

Open DevTools → Network → click the failing request → compare Request Headers and the Response side by side with Postman. You'll find the diff in 2 minutes.

### Q15.14: Postman's mock data and auth helpers — what's worth knowing?

- **Random data variables** — `{{$randomEmail}}`, `{{$randomFirstName}}`, `{{$randomUUID}}`, etc. Useful for creating test data without colliding with previous runs.
- **Auth tab** — built-in helpers for Basic, Bearer, OAuth 1/2, AWS Signature, etc. For Bearer auth backed by `{{token}}`, set Type: Bearer Token, Token: `{{token}}` and Postman injects `Authorization: Bearer ...` automatically.
- **Save Response → Save as Example** — creates fixtures in the collection that mock servers can serve back. Also useful for documentation generation.
- **Postman Documentation** — auto-generated from collections. Public or team-internal. Free way to ship API docs.

---

## 16. AI-Assisted Development (Copilot, Claude Code)

### Q16.1: How do you actually use Copilot day to day?
Inline completions for boilerplate (interfaces, repetitive logic), Chat for refactoring questions, and the prompt template I authored for generating tests. Limits I've internalized: Copilot guesses; verify everything, especially business logic. It's strong on patterns it has many examples of (CRUD, RTL tests) and weaker on novel architecture decisions.

### Q16.2: What's Claude Code and how is it different from Copilot?
Claude Code is Anthropic's CLI agent — it can read files, edit files, run commands, and reason about a whole codebase, not just complete a line. The mental model: Copilot is autocomplete; Claude Code is a junior engineer you can delegate a small task to. I use it for things like "refactor this hook to use TanStack Query" or "write tests for this module" where it can iterate against the actual file system.

### Q16.3: How do you measure a 25% productivity gain?
Be honest in interviews — these numbers are hard to measure rigorously. Framing: tickets/sprint went up by ~25% over the period after Copilot adoption with the same team and roughly equivalent ticket complexity. The team also reported subjectively faster turnaround on test writing (the biggest pain). It's an estimate, not a controlled study. Senior interviewers respect the candor more than a falsely precise number.

### Q16.4: When does AI-assisted coding hurt rather than help?
When suggestions look plausible but are subtly wrong — a real risk on novel logic. When developers stop reading what they accept and accumulate small bugs or stale patterns. When the AI hallucinates an API that doesn't exist (less common with current models, still happens). Mitigations: keep PR review rigorous, treat AI output as "first draft," never accept generated tests without verifying they actually fail when they should.

### Q16.5: How do you keep the team's coding style consistent with AI in the loop?
Two levers: tooling (ESLint, Prettier, project-level Copilot/Claude instructions that point at our conventions) and review (PR descriptions calling out AI-generated sections, reviewers spot-checking those especially). The AI should match the codebase's style, not import its own.

---

## 17. Project-Specific Deep Dives

### Q17.1 (New Role Wizard): How do you manage state across 4 wizard steps?
**Our pattern:** a feature-level Redux slice for the wizard's draft state, persisted to backend on each step transition (so a refresh doesn't lose progress). React Hook Form per step for that step's local fields, with Zod validating step-by-step before allowing "Next." Final submit POSTs the assembled draft. Alternative for simpler wizards: a single RHF instance with multi-step UI on top — but that gets unwieldy with 4 fundamentally different steps.

### Q17.2 (New Role Wizard): One step uploads a JD as a file, another lets the user paste with a rich-text editor, another pulls from an ATS. How do you unify the model?
Each input source produces the same canonical "JD draft" object (text + parsed metadata). The file upload triggers a backend parse (PDF/DOC/DOCX → text). The rich-text editor (Tiptap) emits HTML/JSON, converted on submit. The ATS pull returns structured data. The wizard's state holds the canonical object; the input method is upstream. Downstream steps (constraints, review) don't care how the JD got there.

### Q17.3 (Decision Packet): How is the PDF generated?
Client-side using `html-to-image` to rasterize the rendered React component into a canvas, then `jsPDF` to wrap that into a PDF. Pros: WYSIWYG — what the recruiter sees in the app is what's in the PDF, no server-side templating drift. Cons: large reports are heavy in the browser; we paginate and rasterize per-page. For very large or compliance-critical reports, server-side PDF generation (PDFKit on the backend) would be preferable.

### Q17.4 (Decision Packet): The portal is password-protected and shareable. How does that work?
Backend generates a portal record with a UUID and a hash of a chosen password. The shareable link is `/portal/:portalId`. The portal page is unauthenticated but blocked behind a password prompt; on submit, frontend POSTs to a public endpoint that validates the password and returns a short-lived token. With that token in subsequent requests, the portal can fetch the report data. Expiry on the portal is enforced server-side.

### Q17.5 (Verizon Engage): What does "integrated across 4 channels with 6 RBAC controls" mean?
**Be ready with your specifics.** Likely framing: 4 channels = entry points/customer touchpoints (online, in-store, B2B, phone) feeding leads into the system; 6 RBAC roles = different rep/manager/admin personas with different views and permitted actions on those leads. Practically: the same SPA had to render different navigation, different list filters, and different action buttons per role × channel.

### Q17.6 (Verizon Engage): How did you migrate class to functional components?
Component by component, starting with leaves (no children depending on instance methods). Pattern translation: `state` → `useState` (or `useReducer` for complex), lifecycle → `useEffect` (`componentDidMount` → empty deps; `componentDidUpdate` → relevant deps; `componentWillUnmount` → cleanup function), instance methods → regular functions. Pitfalls: stale-closure bugs in callbacks (fixed with refs or correct deps) and over-eager memoization assumptions. I migrated alongside writing tests so behavior was preserved.

### Q17.7 (Octagnt): The platform uses 36 AI agents on the backend. How does the frontend deal with their async nature?
The frontend never calls agents directly — it calls our backend API, which orchestrates them. For long-running pipelines, the backend exposes a status-poll endpoint (`GET /pipeline/:runId`); the frontend polls with TanStack Query (interval-based, with `refetchInterval` driven by the run's status). For "waiting for voice" or "waiting for OSI" states, the UI shows the corresponding wait state and resumes polling on resume. The frontend treats the agent service as an implementation detail of the backend.

---

## 18. Architecture & Senior-Level Discussion

### Q18.1: How do you structure a large React codebase?
Feature-based, not type-based. `src/features/<feature>/{components,hooks,pages,types,utils}` per feature, plus `src/components` for cross-feature primitives, `src/store` for global state, `src/utils` for cross-cutting helpers. Octagnt follows this. The win: feature changes touch one folder, not five. Cleaner ownership boundaries and feature flags.

### Q18.2: When would you choose Next.js over a Vite SPA?
**Next.js for:** SEO-critical pages (SSR/SSG), e-commerce/marketing sites, when you want a backend layer (API routes, server actions) without a separate service. **Vite SPA for:** internal/B2B apps living behind a login (no SEO need), when the backend is a separate service anyway, when you want the simplest possible build/dev story. Octagnt is firmly in SPA territory — login-gated, no SEO requirement.

### Q18.3: A teammate wants to add a new state library. How do you respond?
First: what problem aren't we solving with what we have? "It's nicer" isn't a reason to add a dependency to a senior team. If there's a real gap (e.g., abusing Redux for server state, want to introduce TanStack Query), the case is concrete: here's what's painful, here's what the new tool solves, here's the migration plan, here's the cost. Get team buy-in, do a small pilot, decide.

### Q18.4: How do you onboard a new junior developer?
Week 1: get them productive locally — env setup, repo tour, walk through one full feature (component → hook → API → store). Pair on their first ticket. Code review with intent — explain the *why*, not just the *what*. Point them at the team's patterns docs (which we wrote partly to make onboarding faster). Set clear expectations on PR review depth and test coverage. Weekly check-ins for the first month.

### Q18.5: Tell me about a hard technical decision you made and what you'd do differently.
**This is a slot for your own answer.** Frame: situation → constraints → options considered → decision → outcome → what you learned. Be honest about the tradeoff you didn't see coming. Senior interviewers care more about the reasoning than the decision being objectively "right." A common, safe topic: the Mantine v5 → v7 migration choice (vs. switching to shadcn/ui at the same time).

### Q18.6: How do you handle disagreement with a designer or backend engineer?
Disagreement is data. Explain my position with the constraint I'm worried about (perf, accessibility, lock-in). Listen to theirs. If we can't converge, propose a smaller experiment or escalate to whoever owns the decision (PM, EM, tech lead). What I avoid: passive-aggressive PR comments, going around them, or capitulating without flagging the cost.

### Q18.7: How would you scale a frontend team from 3 to 15 engineers?
Codify what was tribal knowledge: contributing guide, PR review checklist, component library docs, architecture decision records (ADRs). Establish ownership boundaries (which team owns which feature folder). Invest in tooling that catches issues that humans were catching (linting, type strictness, visual regression). Create a "frontend platform" track for shared concerns — design system, build tooling, testing infrastructure — once individual feature teams start duplicating effort.

### Q18.8: What does "good code review" look like to you?
- **Author side:** small, focused PRs; clear description of what and why; self-review first.
- **Reviewer side:** read the description before the diff; ask questions before suggesting changes; distinguish blocking from nitpick (`nit:` prefix); approve when good-enough, not perfect.

What I avoid as a reviewer: rewriting the PR in comments, bikeshedding style (let the linter handle it), reviewing only when stressed.

---

## 19. Behavioral Prompts

These don't have textbook answers — they probe specific things on your resume. Have a real story ready.

### Q19.1: Tell me about the Mantine v5 → v7 upgrade. What was the riskiest moment?
Be ready with: scope (how many components used Mantine), strategy (codemods, manual passes, what couldn't be automated), how you tested the result (visual regression, QA pass, canary release), the moment something almost broke. The interviewer wants to see how you de-risk a migration.

### Q19.2: You resolved 100+ SonarQube issues. Which one taught you the most?
Have one specific example ready. Could be: a security smell (XSS through `dangerouslySetInnerHTML`), an anti-pattern (huge cyclomatic complexity in a switch you replaced with a strategy map), or a data flow issue (mutating Redux state directly because someone forgot Immer). The lesson is the takeaway you generalized to other code.

### Q19.3: Mentoring junior devs reduced ramp-up by 20%. How did you measure that?
Honest version: time-to-first-merged-PR for new hires before vs after the documentation existed; subjective feedback in 1:1s. It's an estimate, not a peer-reviewed study. The discipline behind the number: writing the doc once we noticed the same questions repeating in PR reviews and Slack — making the implicit explicit.

### Q19.4: Tell me about a time you pushed back on a product decision.
Be ready with a story. Frame: PM wanted X, I had a concern about Y (perf, scope, technical debt), I raised it with data, we either agreed on a smaller version or accepted the risk with eyes open. Avoid stories where you "won" by being right — show that you can hold a position and also yield when the other side has a fair point.

### Q19.5: Why are you leaving / looking?
Have a forward-looking, non-bitter answer. Common framings: "looking to grow into a senior role with broader scope," "want to work on (X kind of product/scale)," "want to be in a more (engineering-driven / product-driven / international) environment." Avoid trashing the current employer.

### Q19.6: What questions do you have for me?
Always have 3+. Strong ones:
- "What does the team's code review culture look like?"
- "What's the one thing you'd change about the engineering org if you could?"
- "How does this team measure impact for senior engineers?"
- "What's a recent technical disagreement and how was it resolved?"
- "What does growth from senior to staff look like here?"
- "What's the team's stance on AI-assisted development tools?"

Avoid: "what's a typical day like" (low-signal), questions answered on the website.

---

## Final tips

- **Time the basics.** ~30s on conceptual questions, ~2 min on deep dives, ~3-5 min on architecture/behavioral with structure (situation → action → outcome).
- **Ask back.** Senior interviews are conversations. After answering, "does that match what you're looking for, or want me to go deeper into X?" turns a quiz into a dialogue.
- **It's OK to say "I don't know."** Senior interviewers respect candor. "I haven't worked with that directly, but here's how I'd approach learning it" is a strong answer.
- **The resume is the agenda.** Re-read your resume the morning of each interview. Anything bolded or with a number on the resume is a likely deep-dive target.
- **Walk through diagrams on a whiteboard.** Don't just describe the Stripe webhook flow verbally — sketch it. Visual reasoning is a senior signal.

Good luck.

---

## 20. Round 2: Deeper Resume-Specific Questions

These probe the bullets in your resume directly. Have a 60-second answer for each — interviewers don't need a full architecture talk, they need to see that the words on the resume match real, specific work.

### Octagnt — AI-Powered Recruitment & ATS

#### Q20.1: The Role Wizard handles file uploads (PDF/DOC/DOCX). What's the upload pipeline end-to-end?
Frontend uses a controlled file input with strict accept types (`.pdf,.doc,.docx`). On selection, validate size client-side (we cap ~10 MB) and immediately upload to a backend endpoint (`POST /role-drafts/:id/jd`). The backend dispatches to a parsing service that extracts text (Apache Tika for DOC/DOCX, pdf-parse for PDF). The frontend shows a "parsing" state via TanStack Query polling on the draft. On success, the parsed text becomes editable in the wizard's review step. Critical gotchas to mention: virus scanning before parse, MIME type sniffing (don't trust the extension), graceful failure modes (corrupt PDF, password-protected DOCX).

#### Q20.2: Decision Packet has D1–D9 sub-scores. How are they organized and rendered?
**Have your specifics ready.** Each sub-score is a category of fit signal (e.g., D1 = skills match, D2 = experience depth, D3 = communication signals, etc. — confirm the exact mapping with your team before the interview). The packet renders them as a card grid with the score, a 1-line summary, and a "drill down" expander showing the underlying evidence (transcript snippets, JD-spec matches, gap notes). Forensic-level detail matters because recruiters defend hiring decisions to hiring managers — every score needs evidence, not a black-box number.

#### Q20.3: Decision Packet portals are password-protected and shareable with external stakeholders. Walk me through the auth model.
Each portal has a UUID id and a server-stored password hash (bcrypt). The shareable URL is `/portal/<uuid>` — *no* recruiter session, *no* application JWT. The portal page renders a password prompt; on submit, frontend POSTs `{ portalId, password }` to a public endpoint that verifies the hash and returns a short-lived (15 min) signed JWT scoped to that single portal. All subsequent data fetches use that token. Expiration is server-side (`expires_at` on the portal row). Rate-limit the password-submit endpoint aggressively (`5 attempts / 15 min` per IP) to prevent brute force. Audit-log every portal access.

#### Q20.4: Stripe Checkout + Billing Portal — how do those two pieces connect?
- **Checkout** is where customers buy or upgrade — you create a Checkout Session server-side with the chosen Price, customer email, success/cancel URLs, and the customer goes to Stripe's hosted page.
- **Billing Portal** is post-purchase self-serve — change plan, update card, download invoices, cancel. You create a Billing Portal Session server-side and redirect.

The bridge between them is the **Stripe Customer**. Both flows write to the same Customer (so subscription history and saved payment methods are unified). Webhook events (`customer.subscription.updated`, `invoice.paid`, etc.) keep your application DB in sync with whatever the customer did in either UI. The two are separate APIs but feed the same Customer object — that's the mental model.

#### Q20.5: Plan-tier feature gating — where is it enforced?
**Both** UI and backend, deliberately. The UI gates with a `useFeature(featureKey)` hook that returns `{ enabled, limit, used }` — components hide or disable the feature for non-entitled users. But the UI is advisory only; **the backend independently checks entitlements on every request that consumes a gated feature**. A hand-crafted curl request bypasses the UI entirely; backend enforcement is the safety net. The entitlement source is the customer's active Stripe Subscription mapped to a plan-features matrix (a config the product team owns).

#### Q20.6: Quota allocation — how do you avoid race conditions?
Two patterns: **decrement-and-check** (atomic SQL `UPDATE quota SET used = used + 1 WHERE customer_id = ? AND used < limit RETURNING *`; the row is updated only if the constraint holds, and an empty result means quota exceeded) or **reserve-then-commit** (insert into a `quota_reservations` table with a TTL, commit on the `payment_intent.succeeded` webhook). For Octagnt's "credits per role-create," I'd lean reserve-then-commit because the role-create involves a multi-step pipeline that can fail mid-way; the reservation expiry releases the credit if the role isn't completed. Don't reduce quota in a separate transaction from the action that consumes it — that's the race the interviewer is probing for.

#### Q20.7: AI-driven JD generation — what prompts are you feeding the model? How do you validate the output?
**Have a real example.** Likely shape: a system prompt that constrains tone and structure ("You are an expert recruiter writing a JD for [role]; output Markdown sections H2: Responsibilities, Requirements, Nice-to-haves; ..."), plus user-supplied seed details (role title, level, must-have skills, location, comp range). For validation: schema validation on the output (Zod against an expected shape — sections present, no PII, no obvious hallucinations like fake company names), human-in-the-loop edit step before publishing. For cost control: cache by seed inputs hashed (so a re-run with the same inputs doesn't re-bill), use a smaller model for first pass and larger only on user-requested "improve."

#### Q20.8: Constraint-based screening configuration — what's the data model?
Each constraint is an object: `{ field, operator, value, weight }` — e.g., `{ field: 'years_experience', operator: '>=', value: 5, weight: 0.3 }`. The full screening spec is an array of constraints with an aggregation rule (weighted sum, all-must-pass, threshold). The UI is a builder with autocomplete on `field` (driven by available candidate-data schema), operator dropdown filtered by field type, and a live preview of how many existing candidates would match. Stored as JSON in the database (with a versioned schema, so a 6-month-old role with old constraint-schema-v2 still loads correctly when current is v3).

#### Q20.9: Role-Based Access Control — how do you keep `if (user.role === 'admin')` from spreading across the codebase?
**Centralize the policy, expose a hook.** `useCan(action, resource)` returns boolean; it consults a permissions matrix loaded once at login (`{ admin: ['*'], hiring_manager: ['view:role', 'edit:own_role', 'comment:any'], recruiter: [...] }`). Components call `useCan('edit:role', role)` rather than checking roles. This means RBAC changes are one-file (the matrix), and the codebase isn't scattered with role strings. For the most sensitive operations (delete, billing changes), pair the UI gate with a backend check — never trust the frontend alone.

#### Q20.10: 36 AI agents on the backend — how does the frontend deal with their async, sometimes-multi-minute response times?
**Frontend never calls agents directly.** Backend exposes a status-poll endpoint (`GET /pipeline/:runId`); frontend uses TanStack Query with `refetchInterval` driven by run state (poll fast when running, stop when terminal). The UI shows a live status string ("Parsing JD…", "Generating screening criteria…", "Waiting for voice agent…") so the user has a sense of progress, not just a spinner. For "waiting for human input" states, the run pauses on the backend and the frontend renders the corresponding form. Resumable across page refreshes because the runId is in the URL and the state is server-side.

### Skillkeepr — HR Tech ATS

#### Q20.11: ATS integrations with Greenhouse and Lever — how does the integration actually work?
Both platforms expose REST APIs and OAuth for tenant authentication. Standard pattern: tenant-scoped OAuth flow (admin clicks "Connect Greenhouse," we redirect to their OAuth consent, store the access + refresh tokens encrypted in our DB, refresh on expiry). Data flows both ways:
- **Pull**: scheduled job (or webhook subscription if available) fetches new candidates / job postings / interview events.
- **Push**: when our platform produces a screening result or interview report, we POST it back to the ATS as a candidate note or attachment.

Failure modes to be ready to talk about: rate limiting (both have aggressive limits — implement bucket-based throttling and exponential backoff), partial failures (one tenant's tokens expire and silently fail — alerting on consecutive 401s), schema drift (their API adds a field, ours breaks — deserialize loosely with `unknown` plus targeted parsing). Test against real sandboxes; both have free dev tenants.

#### Q20.12: Video recording with AWS S3 multipart upload — walk me through the flow and the failure modes.
**Mandatory section to ace.** Resume highlights this directly with metrics (30% reduction in failures, improved reliability).

Flow:
1. Frontend records video to a `MediaRecorder` blob queue (~5 MB chunks).
2. On record start, request `POST /uploads/initiate` → backend calls `s3.createMultipartUpload()` → returns `uploadId` + array of `presignedUrls` for each part.
3. Frontend uploads each chunk via `PUT` to its presigned URL. On success, S3 returns an `ETag` per part — track `[partNumber, ETag]`.
4. When recording stops, frontend calls `POST /uploads/complete` with the parts array → backend calls `s3.completeMultipartUpload()`.

**Failure modes the 30% reduction was probably about:**
- **Network blips mid-chunk** — retry the failing part with the same partNumber and presigned URL (still valid for 7 days). Without retry, the whole upload was failing.
- **User closes the tab** — chunks already uploaded are wasted; backend lifecycle rule auto-aborts uploads older than 24h to reclaim cost (`AbortIncompleteMultipartUpload` rule).
- **CORS misconfiguration on the bucket** — silent failures; ensure bucket CORS allows PUT from your origin and exposes ETag.
- **Memory pressure on long recordings** — flush chunks to S3 as they're produced, don't buffer the whole video in memory.

The 30% improvement came from adding retry-with-backoff per chunk and serializing chunk uploads (parallel uploads were saturating the user's connection on weak links).

#### Q20.13: Mantine v5 → v7 upgrade — what was the strategy?
Mantine v7 was a breaking redesign — CSS-in-JS dropped in favor of CSS Modules, hundreds of API renames, deprecated component patterns. Strategy:
1. **Inventory** — every Mantine component used (~40+ across the app), every theme override.
2. **Codemods first** — Mantine published a few codemods for the renames; ran them and reviewed every diff.
3. **Theme rewrite** — the theme object structure changed; manually migrated.
4. **Per-component manual passes** — components without codemods (primarily the form components, which had restructured prop APIs).
5. **Visual regression QA** — Chromatic + manual pass on every page.
6. **Canary deploy** — 5% of traffic for 24h before 100%.

The riskiest moment was a date picker that silently rendered different (timezone-shifted) dates after the upgrade — caught in QA, would have caused interview scheduling chaos.

#### Q20.14: Node v16 → v18 upgrade — what broke?
Three things commonly break in that jump: native module rebuilds (some `node-gyp` packages need re-compiling — solved by `npm rebuild`), removed APIs (`url.parse` was deprecated; we had a few legacy callsites), and global `fetch` (now native — caused conflicts with our `node-fetch` shim, removed the dependency). Also: the default OpenSSL upgrade in 18 broke a legacy SOAP client that pinned to TLSv1.0 — we updated the client.

#### Q20.15: 90%+ test coverage across 3 repos — what's your test philosophy?
Coverage is a *necessary but not sufficient* metric. The 90% target meant: every component has at least one render test, every hook has unit tests for its branches, every Saga has tests for happy + error paths. What 90% coverage doesn't guarantee: that the tests test the right things. Counter-balance: code review explicitly checks "would this test catch the kind of bug this PR could introduce?" Also keep one or two integration tests per critical user flow (login, role-create, decision-packet-share) using RTL with a mocked API — coverage tools count those, but they catch a different class of bug than unit tests.

#### Q20.16: GitHub Copilot prompt template that auto-generates tests — what's in it?
**Have a real example.** Probably a Markdown comment block at the top of test files: "// Copilot: write Jest + RTL tests for the component below. Use `userEvent`, not `fireEvent`. Test happy path, loading state, error state, and accessibility (axe-core). Mock API with `jest.mock` and use the test fixtures from `__fixtures__/`." Plus an example of one well-formed test in the same file as a few-shot pattern. Output validation: still runs the generated tests, still reviews them — Copilot drafts, humans verify. The 25% delivery acceleration came from "I write the spec, Copilot writes the boilerplate, I keep the parts that make sense" — not from blind acceptance.

#### Q20.17: Google Tag Manager — what events are you tracking?
**Have a concrete list.** Likely: page views (route changes), funnel events (signup_started, signup_completed, role_created, candidate_added), monetization events (plan_upgraded, churn_event), feature usage (feature_X_used) — each with structured params. Implementation: a `track(eventName, params)` wrapper that pushes to `dataLayer` and is called from event handlers, not effects (events should reflect user intent, not render side effects). Bundle impact: GTM script loaded async after first paint; the marketing team manages individual pixels via the GTM dashboard so we don't redeploy code for every campaign tag.

#### Q20.18: Full-stack contributions in Node/Express/Mongo/Lambda — where did frontend stop and backend start for you?
Be honest about depth. Probable framing: primary identity is frontend, but jumped in on backend when sprint-blocked. Specific kinds of work: writing thin Express endpoints to back a frontend feature (no business-logic depth — the actual logic lived in services owned by backend engineers), wiring up a Lambda for an ATS webhook receiver, MongoDB query optimization (adding compound indexes when noticing a slow page). Not: designing the data model from scratch, owning a service end-to-end. The honest version of "contributed to full-stack" is "unblocked myself when I needed to."

### Verizon Engage — Internal Lead Management

#### Q20.19: 4 channels with 6 RBAC controls — what were the channels and roles specifically?
**Be ready with your specifics.** Common framing for telecom: channels = entry points where leads originated (online retail, store walk-in, B2B inside-sales, customer-service upsell). Roles = persona-based (rep, store-manager, regional-manager, B2B-account-rep, admin, audit-only). The cross-product is what made the SPA hard: a store-manager looking at a B2B lead sees a different UI than the same role looking at an online-retail lead, because the lead lifecycle and permissioned actions differ per channel.

#### Q20.20: SPA from scratch — what does the first 2 weeks of green-fielding look like?
Set up the build (Webpack/Vite, ESLint, Prettier, TypeScript config), pick the shape of routing (React Router or framework), pick the form library, the styling approach (CSS Modules / Emotion / styled-components / Tailwind), the testing stack, the API client convention. Stand up a CI pipeline (lint + type-check + unit tests + build). Prototype the highest-uncertainty page (the channel-pivoted lead list) to validate the architecture decisions. Defer everything that can be deferred — you'll know more in 6 weeks than you do now.

#### Q20.21: 25% page-load improvement via code splitting + lazy loading — what specifically did you split?
Route-level was the big win: each top-level route became a `React.lazy()` chunk so users on the lead list didn't pay for the analytics dashboard's bundle. Below that: heavy below-the-fold widgets (charts, the attachment viewer, the export-to-CSV dialog) became component-level `React.lazy`. Vendor splitting (React, Material UI, Lodash) into a long-lived chunk so deploys didn't invalidate everything. Measurement: Chrome DevTools' Performance tab + WebPageTest before/after, focusing on TTI (Time to Interactive), not just total bundle size.

#### Q20.22: Reusable component library that improved feature delivery 15% — what's in it and how do you version it?
**Have specifics.** Likely contents: form primitives (Input, Select, DatePicker — wrappers around the underlying lib that pre-apply our theme/error display), data display primitives (DataTable with sorting/filtering, EmptyState, LoadingState, ErrorBoundary), layout primitives (PageHeader, Sidebar, Card variants). Versioning: internal monorepo package with semver; breaking changes require ADR + migration guide. Documentation in Storybook so feature engineers see all variants without spelunking source. The 15% came from "I want a date range picker" being one import + 5 lines of props vs. an hour of research and custom build.

#### Q20.23: 100+ SonarQube issues — what categories?
Have specifics for at least 3 categories. Common buckets:
- **Cognitive complexity** — functions with 5+ nested conditionals; refactor with early returns or extract helpers.
- **Cyclomatic complexity** — switch statements with too many branches; replace with strategy maps.
- **Duplicated blocks** — same code in 3+ places; extract a utility.
- **Security smells** — `dangerouslySetInnerHTML` without sanitization, `eval`-like patterns, secrets in code (caught by their pattern matching).
- **Reliability** — `parseInt` without radix, comparing floats with `===`, missing null guards.

The valuable category was security smells — those drove a culture change ("if SonarQube flags a security finding, we don't merge").

#### Q20.24: Multi-environment triage (Build, QA, Pre-prod, Prod) — what does that look like in practice?
Each env mirrors a slice of prod data (or generated fixtures); CI deploys to Build on every merge, manual promotion to QA → Pre-prod → Prod. Triage: a bug appears in Pre-prod that doesn't appear in QA → narrow the diff (data? config? release?). Often it's data — a row shape Pre-prod has and QA doesn't. Tools: feature flags for fast rollback, per-env dashboards (Kibana / Datadog) for log correlation, a "release rehearsal" doc per major release that QA sign-offs before promotion.

### Cross-Cutting / Behavioral

#### Q20.25: AI-assisted development with Copilot and Claude Code — where do they help, where do they hurt?
**Help:** boilerplate (test scaffolding, type definitions from existing data), unfamiliar API exploration ("how do I integrate Greenhouse webhooks" — Copilot drafts a recognizable shape), refactor mechanics (rename, extract, convert class → hook), commit messages and PR descriptions, parsing error messages.

**Hurt:** subtle correctness bugs in security-sensitive code (validation, auth) — tools confidently produce code that compiles and looks right but skips a check; architecture decisions (you can't outsource "what's the right module boundary"); domain logic where the right answer requires knowing your business model. Always review with the same rigor as a junior PR — never merge AI output without reading.

The 25% delivery acceleration claim is honest only if you can describe *what specifically* got faster. "I write the spec; the tool writes the boilerplate; I keep what's right" is honest. "I'm 25% faster" without saying at what is hand-wavy — interviewers will probe.

#### Q20.26: Tell me about authoring the onboarding documentation that reduced ramp-up by 20%.
**Have a real artifact in mind.** What was in it: repo tour (file tree with one-line annotations), a "build your first PR" walkthrough (clone → setup → pick this seed ticket → walk through component-hook-API-store), the team's conventions doc (when to use which state library, naming, PR review etiquette), patterns (feature folder structure, error handling, testing). How you measured 20%: time-to-first-merged-PR for new hires before vs after; subjective feedback in 1:1s. Be honest that it's an estimate.

The skill being probed: your ability to identify *recurring questions* (the same things came up in Slack/PR reviews repeatedly) and convert them into a static artifact that scales without your time.

---
