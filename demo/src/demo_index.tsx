import * as React from 'react';
import {Component} from 'react';
import {DemoButton} from './demo_component';
import {EnableComment} from 'proto-frameworks';

interface DemoIndexProps {
}

interface DemoIndexState {
}

class DemoIndex extends Component<DemoIndexProps, DemoIndexState> {
    constructor(props: DemoIndexProps) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>Welcome to Proto Frameworks</h1>
                <DemoButton/>
                <br/>
                <EnableComment scope='private-scope'>
                    <DemoButton/>
                </EnableComment>
            </div>
        );
    }
}

export default DemoIndex;