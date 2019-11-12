import React from 'react';
import {render} from 'react-dom';
import store from './store';
import List from './list';
import Cart from './cart';
import './index.css';

class App extends React.Component {

    render() {
        return (<div className="g-panel">
            <List />
            <Cart />
        </div>);
    }
}

render(<App />, document.querySelector('#root'));
