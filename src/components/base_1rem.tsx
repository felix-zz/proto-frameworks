import * as React from 'react';
import {Component} from 'react';

interface Base1RemProps {
}

interface Base1RemState {
}

class Base1Rem extends Component<Base1RemProps, Base1RemState> {
    constructor(props: Base1RemProps) {
        super(props);
    }

    render() {
        return (
            <div style={{display: 'none', fontSize: '1rem'}} id='mb-base-1rem'>_</div>
        );
    }
}

export default Base1Rem;