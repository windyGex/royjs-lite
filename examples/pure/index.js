import { Store, useStore, useDispatch, Provider } from '../../src/';
import devtools from '../../src/plugins/devtools';
import React from 'react';
import ReactDOM from 'react-dom';

const logger = function(store) {
    store.subscribe(obj => {
        console.log(obj.type, obj.payload, obj.state.toJSON());
    });
};

const store = new Store(
    {
        state: {
            count: 0,
            list: [],
        },
        actions: {
            add(state, payload) {
                state.count++;
            },
            reduce(state, payload) {
                state.count--;
            },
            addList(state) {
                state.list.push('');
            },
            async asyncAdd(state, payload) {
                await new Promise(resolve => {
                    setTimeout(() => {
                        resolve();
                    }, 400);
                });
                this.dispatch('add');
            },
        },
    },
    {
        plugins: [logger, devtools],
    }
);

const Child = () => {
    const list = useStore(state => state.list);
    return <span>{list.length}</span>;
};

const App = () => {
    const count = useStore(state => state.count);
    const dispatch = useDispatch();
    return (
        <div>
            {count}
            <Child />
            <button onClick={() => dispatch('add')}>add</button>
            <button onClick={() => dispatch('addList')}>addList</button>
            <button onClick={() => dispatch('reduce')}>reduce</button>
            <button onClick={() => dispatch('asyncAdd')}>async</button>
        </div>
    );
};

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
