import * as React from 'react';
import {Component} from 'react';

interface DemoSubModuleProps {
    stage?: number;
}

interface DemoSubModuleState {
}

class DemoSubModule extends Component<DemoSubModuleProps, DemoSubModuleState> {
    constructor(props: DemoSubModuleProps) {
        super(props);
    }

    render() {
        const {stage} = this.props;
        return (
            <div style={{width: '400px'}}>
                <h1>This a sub module</h1>
                {typeof stage !== 'number' ? (
                    <p>This is the default stage.</p>
                ) : (
                    <p>This is stage {stage}.</p>
                )}
            </div>
        );
    }
}

export default DemoSubModule;