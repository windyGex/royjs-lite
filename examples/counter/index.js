import React from 'react';
import ReactDOM from 'react-dom';
import { Store } from '../../../src/';
import devtools from '../../../src/plugins/devtools';
import { useStore, useDispatch } from '../../../src/hooks/use';
import Provider from '../../../src/hooks/provider';

const logger = function (store) {
    store.subscribe(obj => {
        console.log(obj.type, obj.payload, obj.state.toJSON());
    });
};

const store = new Store(
    {
        state: {
            count: 0,
            list: []
        },
        actions: {
            add(state, payload) {
                state.count++;
            },
            reduce(state, payload) {
                state.count--;
            },
            async asyncAdd(state, payload) {
                await new Promise(resolve => {
                    setTimeout(() => {
                        resolve();
                    }, 400);
                });
                this.dispatch('add');
            }
        }
    },
    {
        plugins: [logger, devtools]
    }
);

function App(props) {
    const count = useStore(state => state.count);
    const dispatch = useDispatch();
    return (
        <div>
            {count}
            <button onClick={() => dispatch('add')}>add</button>
            <button onClick={() => dispatch('reduce')}>reduce</button>
            <button onClick={() => dispatch('asyncAdd')}>async</button>
        </div>
    );
}

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
