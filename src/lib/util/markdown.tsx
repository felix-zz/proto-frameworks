import * as React from 'react';
import {Component} from 'react';
import * as _ from 'lodash';
import marked from 'marked';

interface MarkdownProps extends React.HTMLProps<HTMLDivElement> {
    md: string;
}

interface MarkdownState {
}

class Markdown extends Component<MarkdownProps, MarkdownState> {
    constructor(props: MarkdownProps) {
        super(props);
    }

    render() {
        const props: MarkdownProps = _.assign({}, this.props);
        const {md, className} = this.props;
        delete props.md;
        delete props.className;
        return (
            <div className={'documentation ' + (className || '')} {...props}
                 style={{width: '850px'}}
                 dangerouslySetInnerHTML={{__html: marked(md)}}/>
        );
    }
}

export default Markdown;