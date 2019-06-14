# RoyLite[Under Development] ![buildStatus](https://travis-ci.org/windyGex/royjs.svg?branch=master)

A lite state manager based on react hooks.

## Install

```shell
npm install @royjs/lite --save
```

## Usage

### Basic Usage

```js
import {Store, useStore, useDispatch} from '@royjs/lite';

const store = new Store({
    state: {
        count: 0
    },
    actions: {
        add(state, payload) {
            state.count++;
        },
        reduce(state, payload) {
            state.count--;
        }
    }
});

function App() {
    const count = useStore(state => state.count);
    const dispatch = useDispatch();
    return <div onClick={() => dispatch('add')}>{count}</div>
}

```

### Centralized Store

```js
import {Store, useStore, useDispatch} from '@royjs/lite';

const store = new Store({}, {
    plugins: [devtools]
});

store.create('module1', {
    state: {
        name: 'module1'
    },
    actions: {
        change(state, payload){
            state.name = payload;
        }
    }
});

store.create('module2', {
    state: {
        name: 'module2'
    },
    actions: {
        change(state, payload){
            state.name = payload;
        }
    }
});

function App() {
    const {name} = useStore(state => state.module1);
    const dispatch = useDispatch();
    const onClick = () => {
        dispatch('module2.change', 'changed name from module1');
    }
    return <div onClick={onClick}>{name}</div>
}

function App2() {
    const {name} = useStore(state => state.module2);
    return <div>{name}</div>
}
```

