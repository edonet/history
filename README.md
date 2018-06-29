# history
history is a JavaScript library that lets you easily manage session history anywhere JavaScript runs.

## Installation
Using npm:

```shell
$ npm install --save history
```

Then with a module bundler like webpack, use as you would anything else:

```javascript
// using ES6 modules
import createHistory from '@arted/history';

// using CommonJS modules
var createHistory = require('@arted/history');
```


## Usage
Basic usage looks like this:

```javascript
import createHistory from '@arted/history';

const history = createHistory();

// Get the current state.
const state = history.state;

// Listen for changes to the current location.
const unsubscribe = history.subscribe((state) => {

    // state is an object as histories
    console.log(state)
});

// Use push, replace, and go to navigate around.
history.go('/home', { method: 'REPLACE' });

// To stop listening, call the function returned from listen().
unsubscribe();
```


## Navigation
history objects may be used programmatically change the current location using the following methods:

* history.go(path, [state])
* history.replace(path, [state])
* history.goBack(path | step, [state])
* history.block(callback)
* history.subscribe(callback)
* history.resolve(path)
* history.match(path)
* history.destroy()
