import * as React from 'react';
import {Component} from 'react';
import {ComponentComment} from 'proto-frameworks';

interface DemoButtonProps {
}

interface DemoButtonState {
}

export class DemoButton extends Component<DemoButtonProps, DemoButtonState> {
    constructor(props: DemoButtonProps) {
        super(props);
    }

    render() {
        return (
            <ComponentComment comments={{v202106: 'This is a normal comment.'}}
                              scopedComments={{
                                  scope: 'private-scope',
                                  comments: {v202106: 'This is a scoped comment.'}
                              }}>
                <button>A Demo Button</button>
            </ComponentComment>
        );
    }
}
