import ReactDOM from 'react-dom';
import {Component} from 'react';
import ProtoFrameworks from './proto-frameworks';
import './proto-frameworks.scss';
import DemoModuleIndex from './demo/module_index';
import DemoSubModule from './demo/sub_module';

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
                                     ver: 'v202106',
                                     pages: {
                                         demoModule: {
                                             name: 'Demo Module',
                                             ver: 'v202106',
                                             element: DemoModuleIndex,
                                             pages: {
                                                 sub: {
                                                     name: 'Sub Module: Multi Stages',
                                                     ver: 'v202106',
                                                     element: DemoSubModule,
                                                     nav: {
                                                         defaultTitle: 'Default Stage',
                                                         items: [{
                                                             name: 'Stage 1',
                                                             element: DemoSubModule,
                                                             props: {stage: 1},
                                                         }, {
                                                             name: 'Stage 2',
                                                             element: DemoSubModule,
                                                             props: {stage: 2},
                                                             ver: 'v202106',
                                                         }]
                                                     }
                                                 }
                                             }
                                         }
                                     }
                                 }
                             }}
                             currentVersion='v202106'/>
        );
    }
}

ReactDOM.render((<DemoIndex/>), document.getElementById('root'));