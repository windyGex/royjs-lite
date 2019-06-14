import { useContext, useEffect, useState, useRef } from 'react';
import Store from '../store';
import { StoreContext } from './provider';

export function useStore(mapStateToProps) {
    const ctx = useContext(StoreContext);
    const store = ctx.store || Store.get();
    const [state, setState] = useState(() => mapStateToProps(store.state));
    const deps = useRef({});
    const get = useRef(data => {
        deps.current[data.key] = true;
    });
    const change = useRef(obj => {
        obj = Array.isArray(obj) ? obj : [obj];
        let matched;
        for (let index = 0; index < obj.length; index++) {
            const item = obj[index];
            const match = Object.keys(deps.current).some(dep => item.key.indexOf(dep) === 0);
            if (match) {
                matched = true;
            }
        }
        if (matched) {
            const newState = mapStateToProps(store.state);
            setState(newState);
        }
    });
    useEffect(() => {
        store.on('get', get.current);
        store.on('change', change.current);
        const newState = mapStateToProps(store.state);
        setState(newState);
        return () => {
            store.off('get', get.current);
            store.off('change', change.current);
        };
    }, [store]);

    return state;
}

export function useDispatch() {
    const ctx = useContext(StoreContext);
    const store = ctx.store || Store.get();
    return store.dispatch;
}
