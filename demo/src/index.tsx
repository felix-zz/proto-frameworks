import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import {pageTreeBuilder, ProtoFrameworks} from 'proto-frameworks';
import DemoIndex from './demo_index';

import 'proto-frameworks/lib/proto-frameworks.css';

const pageTree = pageTreeBuilder().addProduct('demo', {
    name: 'Demo Product',
    ver: 'v202106',
    pages: {
        index: {
            name: 'Demo Index',
            ver: 'v202106',
            element: DemoIndex,
        },
    }
}).create();

ReactDOM.render(
    <React.StrictMode>
        <ProtoFrameworks pageTree={pageTree} currentVersion='v202106' defaultProduct='demo'/>
    </React.StrictMode>,
    document.getElementById('root')
);
