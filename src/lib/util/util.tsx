import * as React from 'react';
import {HTMLAttributes, ReactNode} from 'react';
import * as _ from 'lodash';

const openPage = (href: string): void => window.location.assign(href);

interface AProps extends HTMLAttributes<HTMLAnchorElement> {
    icon?: ReactNode;
    href?: string;
    target?: string;
}

class A extends React.Component<AProps, {}> {
    constructor(props: AProps) {
        super(props);
    }

    render() {
        const props: AProps = _.assign({}, this.props);
        const {href, onClick, icon} = this.props;
        if ((href && !props.target) || !href) {
            props.href = '#';
            props.onClick = e => {
                e && e.preventDefault();
                onClick ? onClick(e) : (href && openPage(href));
            }
        }
        delete props.icon;
        return (<a {...props}>{icon}{this.props.children}</a>);
    }
}

interface _Util {
    A: typeof A;
}

export const Util: _Util = {
    A: A,
};