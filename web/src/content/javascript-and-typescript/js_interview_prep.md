# 🚀 JavaScript Interview Prep – Questions & Solutions

---

# 🔥 SECTION 1: BASIC TRICKY OUTPUTS

## Q1
```js
console.log(3 > 2 > 1);
```
### ✅ Output
false

### 💡 Explanation
- 3 > 2 → true
- true → 1
- 1 > 1 → false

---

## Q2
```js
console.log([] == ![]);
```
### ✅ Output
true

---

## Q3
```js
console.log(null >= 0);
console.log(null > 0);
console.log(null == 0);
```
### ✅ Output
true
false
false

---

## Q4
```js
console.log(NaN == NaN);
```
### ✅ Output
false

---

## Q5
```js
console.log(0 == '0');
console.log(0 === '0');
```
### ✅ Output
true
false

---

## Q6
```js
console.log([] + []);
```
### ✅ Output
""

---

## Q7
```js
console.log([] + {});
```
### ✅ Output
"[object Object]"

---

## Q8
```js
console.log({} + []);
```
### ✅ Output
0

---

## Q9
```js
console.log(true + true);
```
### ✅ Output
2

---

## Q10
```js
console.log('5' - 3);
console.log('5' + 3);
```
### ✅ Output
2
"53"

---

## Q11
```js
console.log(typeof null);
console.log(typeof NaN);
```
### ✅ Output
"object"
"number"

---

# 🔥 SECTION 2: OBJECT & REFERENCE

## Q12
```js
console.log({} === {});
```
### ✅ Output
false

---

## Q13
```js
console.log([] === []);
```
### ✅ Output
false

---

## Q14
```js
let a = { x: 1 };
let b = a;
b.x = 2;
console.log(a.x);
```
### ✅ Output
2

---

## Q15
```js
let a = { x: 1 };
let b = { ...a };
b.x = 2;
console.log(a.x);
```
### ✅ Output
1

---

## Q16
```js
let a = { x: { y: 1 } };
let b = { ...a };
b.x.y = 2;
console.log(a.x.y);
```
### ✅ Output
2

---

# 🔥 SECTION 3: THIS & FUNCTIONS

## Q17
```js
const obj = {
  name: "JS",
  getName() {
    return this.name;
  }
};

const fn = obj.getName;
console.log(fn());
```
### ✅ Output
undefined

---

## Q18
```js
const obj = {
  name: "JS",
  getName() {
    return this.name;
  }
};

console.log(obj.getName());
```
### ✅ Output
JS

---

# 🔥 SECTION 4: HOISTING & CLOSURE

## Q19
```js
console.log(a);
var a = 10;
```
### ✅ Output
undefined

---

## Q20
```js
console.log(a);
let a = 10;
```
### ❌ Output
ReferenceError

---

## Q21
```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```
### ✅ Output
3
3
3

---

## Q22
```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```
### ✅ Output
0
1
2

---

# 🔥 SECTION 5: ASYNC / EVENT LOOP

## Q23
```js
console.log("A");
setTimeout(() => console.log("B"), 0);
console.log("C");
```
### ✅ Output
A
C
B

---

## Q24
```js
console.log("A");
Promise.resolve().then(() => console.log("B"));
console.log("C");
```
### ✅ Output
A
C
B

---

## Q25
```js
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
```
### ✅ Output
A
D
C
B

---

## Q26
```js
async function test() {
  console.log("A");
  await Promise.resolve();
  console.log("B");
}
test();
console.log("C");
```
### ✅ Output
A
C
B

---

## Q27
```js
async function test() {
  console.log(1);
  await Promise.resolve();
  console.log(2);
}

console.log(3);
test();
console.log(4);
```
### ✅ Output
3
1
4
2

---

## Q28
```js
console.log("start");

setTimeout(() => console.log("timeout"), 0);

Promise.resolve()
  .then(() => console.log("promise1"))
  .then(() => console.log("promise2"));

console.log("end");
```
### ✅ Output
start
end
promise1
promise2
timeout

---

## Q29
```js
console.log("A");

setTimeout(() => {
  console.log("B");
  Promise.resolve().then(() => console.log("C"));
}, 0);

Promise.resolve().then(() => console.log("D"));

console.log("E");
```
### ✅ Output
A
E
D
B
C

---

## Q30
```js
async function foo() {
  console.log("A");
  await Promise.resolve();
  console.log("B");
}

console.log("C");
foo();
Promise.resolve().then(() => console.log("D"));
console.log("E");
```
### ✅ Output
C
A
E
B
D

---

## Q31 (HARD)
```js
console.log("1");

setTimeout(() => console.log("2"), 0);

async function foo() {
  console.log("3");
  await Promise.resolve();
  console.log("4");
}

foo();

Promise.resolve().then(() => console.log("5"));

console.log("6");
```
### ✅ Output
1
3
6
4
5
2

---

# 🧠 FINAL RULES (IMPORTANT)

## Execution Order
```
1. Synchronous
2. Microtasks (Promise, await)
3. Macrotasks (setTimeout)
```

---

## Key Takeaways

- `==` → type coercion  
- `===` → strict  
- Objects compare by reference  
- `await` → microtask  
- `var` vs `let` → scope difference  
- `this` depends on call site  

---

# 🚀 INTERVIEW ONE-LINER

> JavaScript executes synchronous code first, then microtasks (Promises/await), then macrotasks (setTimeout), using a single-threaded event loop.
