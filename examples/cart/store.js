import { Store } from '../../src/';
import devtools from '../../src/plugins/devtools';

const store = new Store(
    {},
    {
        plugins: [devtools]
    }
);

export default store;
