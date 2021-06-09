import * as React from 'react';
import {Component} from 'react';
import {ComponentComment} from '../components/versioned_comment';

interface DemoModuleIndexProps {
}

interface DemoModuleIndexState {
}

class DemoModuleIndex extends Component<DemoModuleIndexProps, DemoModuleIndexState> {
    constructor(props: DemoModuleIndexProps) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>Hello, World!</h1>
                <ComponentComment comments={{v202106: 'This is a demo comment for your product'}}>
                    <p>This the demo index for Proto Frameworks.</p>
                </ComponentComment>
            </div>
        );
    }
}

export default DemoModuleIndex;