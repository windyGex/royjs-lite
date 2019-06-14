import React from 'react';

export const StoreContext = React.createContext(null);

export default function Provider(props) {
    return (
        <StoreContext.Provider
            value={props.store}>
            {props.children}
        </StoreContext.Provider>
    );
}
