import * as React from 'react';
import {Component, HTMLAttributes} from 'react';

interface PlaceholderState {
    w?: number;
    h?: number;
}

export class Placeholder extends Component<HTMLAttributes<HTMLDivElement>, PlaceholderState> {
    container: HTMLElement;

    constructor(props: HTMLAttributes<HTMLDivElement>) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        setTimeout(() => {
            let container = $(this.container);
            let w = container.outerWidth() - 2;
            let h = container.outerHeight() - 2;
            this.setState({w, h});
        }, 200);
    }

    render() {
        const {children, className, style} = this.props;
        const {w, h} = this.state;
        let line1 = null, line2 = null;
        if (w && h) {
            const top = Math.round(h / 2);
            const len = Math.sqrt(w * w + h * h);
            line1 = (
                <div className='ph-line'
                     style={{
                         width: len + 'px',
                         left: (w - len) / 2 + 'px',
                         top: top + 'px',
                         transform: 'rotate(' + (Math.atan(h / w) / Math.PI * 180) + 'deg)',
                     }}/>
            );
            line2 = (
                <div className='ph-line'
                     style={{
                         width: len + 'px',
                         left: (w - len) / 2 + 'px',
                         top: top + 'px',
                         transform: 'rotate(' + (Math.atan(-h / w) / Math.PI * 180) + 'deg)',
                     }}/>
            );
        }
        return (
            <div className={'module-placeholder ' + (className || '')} style={style} ref={ref => this.container = ref}>
                <span className='ph-content'>
                    {children}
                </span>
                {line1}{line2}
            </div>
        );
    }
}
