# Regular Expression Worker

Execute Regular Expression Matches on a Node [Worker Thread](https://nodejs.org/api/worker_threads.html).

Regular Expressions can suffer from [Catastrophic Backtracking](https://www.regular-expressions.info/catastrophic.html). A very simple expression like `/(x+x+)+y/` can cause your JavaScript application to freeze. This library allows you to run these expressions on another thread. If they take to long to complete, they are terminated, protecting your application from locking up.

## Installation
```
npm install regexp-worker
```

## Basic Usage

In the example below:
1. a new Worker thread is created
1. the regular expression is executed on the thread
1. the result is returned
1. the thread is stopped

For the occasional request, this is the easiest way, but the Worker startup and shutdown is expensive.

### Find the words in some text

```typescript
import { execRegExpOnWorker } from 'regexp-worker'
//...
const response = await execRegExpOnWorker(/\b\w+/g, 'Good Morning')
console.log(response.matches.map(m => m[0]))
```

Result:
```
  console.log
    [ 'Good', 'Morning' ]

```

### Find the word breaks in some text
```typescript
import { execRegExpOnWorker } from 'regexp-worker'
//...
const response = await execRegExpOnWorker(/\b/g, 'Good Morning');
console.log(response.matches.map(m => m.index))
```
Result:
```
  console.log
    [ 0, 4, 5, 12 ]
```

### Format of the response

```typescript
interface ExecRegExpResult {
    elapsedTimeMs: number;
    matches: RegExpExecArray[];
}
```
Where `RegExpExecArray` is [RegExp.prototype.exec() result](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec#Description).


## Creating a `RegExpWorker` Instance

To reduce the cost of starting and stopping the Worker, it is possible to create a `RegExpWorker` instance.
This instance allows you to make multiple requests using the same worker. The request are queued and handled
one at a time. If a request takes too long, it is terminated and the promise is rejected with an `ErrorCanceledRequest`.

```js
import { RegExpWorker } from 'regexp-worker'

// ...
const defaultTimeOutMs = 10
const worker = new RegExpWorker(defaultTimeOutMs);

// Find all words in some text
let words = await worker.execRegExp(/\b\w+/g, 'Lots of text ...')

// Find all numbers in some text
let numbers = await worker.execRegExp(/\b\d+/g, 'Lots of text ...')

// Find 3 letter word pairs
let moreTimeMs = 100
let numbers = await worker.execRegExp(/\b\w{3}\s+\w{3}/g, 'Lots of text ...', moreTimeMs)

// ...

// It is a good idea to dispose of the worker before shutdown.
// The worker thread will stop on its own if left idle for more than 200ms.
worker.dispose();
```

## Handling Timeouts

If the request times out, the promise will be rejected with:

```js
interface TimeoutError {
    message: string;
    elapsedTimeMs: number;
}
```
