import * as ReactDOM from 'react-dom';
import {Component} from 'react';
import '../lib/proto-frameworks.scss';
import DemoModuleIndex from './module_index';
import DemoSubModule from './sub_module';
import {Link} from 'react-router-dom';
import {NodeIndexOutlined} from '@ant-design/icons';
import DemoMobileRem from './mobile_rem_style';
import {ProtoFrameworks} from '../lib/proto-frameworks';

interface DemoFrameworkIndexProps {
}

interface DemoFrameworkIndexState {
}

export class DemoFrameworkIndex extends Component<DemoFrameworkIndexProps, DemoFrameworkIndexState> {
    constructor(props: DemoFrameworkIndexProps) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>This is the User Defined Index for the Root Page "/"</h1>
            </div>
        );
    }
}

const pageTree = {
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
                    },
                    mobile: {
                        name: 'Mobile REM-based Demo',
                        ver: 'v202106',
                        element: DemoMobileRem,
                    }
                }
            }
        }
    }
};

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
                             indexPage={DemoFrameworkIndex}
                             currentVersion='v202106'
                             historyVersions={[{
                                 version: 'v202105',
                                 description: 'Description for version 202105.',
                             }]}
                             titleToolbar={(
                                 <Link to='/' className='left-margin'>
                                     <NodeIndexOutlined/>
                                     Demo Toolbar (To Index)
                                 </Link>
                             )}
                             pageTree={pageTree}/>
        );
    }
}

ReactDOM.render((<DemoIndex/>), document.getElementById('root'));