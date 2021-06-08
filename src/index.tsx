import ReactDOM from 'react-dom';
import {Component} from 'react';
import ProtoFrameworks from './proto-frameworks';
import './proto-frameworks.less';

interface DemoIndexProps {
}

interface DemoIndexState {
}

export class DemoIndex extends Component<DemoIndexProps, DemoIndexState> {
    constructor(props: DemoIndexProps) {
        super(props);
    }

    render() {
        return (
            <ProtoFrameworks defaultProduct='demo'
                             pageTree={{
                                 demo: {
                                     name: 'Demo Product',
                                     pages: {
                                         demoModule: {
                                             name: 'Demo Module',
                                             ver: 'v202106',
                                         }
                                     }
                                 }
                             }}
                             currentVersion='v202106'/>
        );
    }
}

ReactDOM.render((<DemoIndex/>), document.getElementById('root'));