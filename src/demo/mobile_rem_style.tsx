import * as React from 'react';
import {Component} from 'react';
import Base1Rem from '../components/base_1rem';

interface DemoMobileRemProps {
}

interface DemoMobileRemState {
}

class DemoMobileRem extends Component<DemoMobileRemProps, DemoMobileRemState> {
    constructor(props: DemoMobileRemProps) {
        super(props);
    }

    render() {
        return (
            <div>
                <Base1Rem/>
                <h1 style={{fontSize: '2rem'}}>A Demo for Mobile UI</h1>
                <p style={{fontSize: '1.2rem'}}>
                    If you put a <code>Base1Rem</code> component (which is invisible) into your page,
                    sizing mode will show rem based info for some css properties, such as font-size, width, height,
                    line-height...
                </p>
                <pre style={{fontSize: '1rem'}}>{'<Base1Rem/>'}</pre>
            </div>
        );
    }
}

export default DemoMobileRem;