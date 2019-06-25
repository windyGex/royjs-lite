import { useContext, useEffect, useState } from 'react';
import Store from './store';
import { StoreContext } from './provider';
import { isPlainObject } from './utils';

export function useStore(mapStateToProps) {
    const ctx = useContext(StoreContext);
    const store = ctx.store || Store.get();
    const [state, setState] = useState(() => mapStateToProps(store.state));
    const deps = {};
    const get = data => {
        deps[data.key] = true;
    };
    const set = newState => {
        if (Array.isArray(newState)) {
            newState = [...newState];
        } else if (isPlainObject(newState)) {
            newState = { ...newState };
        }
        setState(newState);
    };
    const change = obj => {
        obj = Array.isArray(obj) ? obj : [obj];
        let matched;
        for (let index = 0; index < obj.length; index++) {
            const item = obj[index];
            const match = Object.keys(deps).some(dep => item.key.indexOf(dep) === 0);
            if (match) {
                matched = true;
            }
        }
        if (matched) {
            let newState = mapStateToProps(store.state);
            set(newState);
        }
    };
    useEffect(() => {
        store.on('get', get);
        store.on('change', change);
        mapStateToProps(store.state);
        store.off('get', get);
        return () => {
            store.off('change', change);
        };
    }, [store]);

    return state;
}

export function useDispatch() {
    const ctx = useContext(StoreContext);
    const store = ctx.store || Store.get();
    return store.dispatch;
}
