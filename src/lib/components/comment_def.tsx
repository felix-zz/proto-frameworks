import * as React from 'react';
import {Component, DOMElement, ReactNode, ReactNodeArray} from 'react';
import {StringMap} from '../util/export';
import $ from 'jquery';
import {Requirement} from "./requirement_def";

export declare type CommentPosition = 'left' | 'right';

export const CommentContext = React.createContext(null);
export const ContextDisableContext = React.createContext(null);

export class DisableComment extends React.Component<{}, {}> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <ContextDisableContext.Provider value={true}>
                {this.props.children}
            </ContextDisableContext.Provider>
        );
    }
}

export const AnchorContext = React.createContext(null);

export class CommentAnchor extends React.Component<{}, {}> {
    static contextType = ContextDisableContext;

    constructor(props: any) {
        super(props);
    }

    render() {
        if (this.context === true) {
            return null;
        }
        return (
            <AnchorContext.Consumer>
                {comment => (
                    <span style={{display: 'none'}} ref={ref => comment.addAnchor(ref)}/>
                )}
            </AnchorContext.Consumer>
        );
    }
}

export type CommentMap = StringMap<ReactNode>;

export interface CommentContentProps {
    position?: CommentPosition;
    elements?: DOMElement<any, any>[];
    content?: string | ReactNode;
    requirement?: Requirement;
    width?: number | string;
    title?: string | ReactNode;
    maxHeight?: number;
    plainContent?: boolean;
    refreshLine?: () => void;
}

export interface CommentForRequirement {
    requirement: Requirement;
    content: ReactNode;
    global?: boolean;
}

interface ComponentCommentProps extends CommentContentProps {
    uk?: string; // Make sure component comment shows up only once.
    /** @Deprecated Use requirementComments instead. */
    comments?: CommentMap;
    requirementComments?: CommentForRequirement[];
    selector?: string;
}

export class ComponentComment extends Component<ComponentCommentProps, {}> {

    static contextType = CommentContext;

    anchors: any[];
    elements: any[];

    constructor(props: ComponentCommentProps) {
        super(props);
        this.anchors = [];
    }

    componentDidMount() {
        let anchors = this.anchors;
        if (!anchors.length) {
            return;
        }
        const elements: any[] = [];
        const {selector} = this.props;
        anchors.forEach(a => {
            let $element = $(a).next();
            const element = selector ? $element.find(selector)[0] : $element[0];
            element && elements.push(element);
        });
        if (elements.length) {
            this.elements = elements;
            this.context.addComment(this);
        }
    }

    addAnchor(anchor: any) {
        this.anchors.push(anchor);
    }

    render() {
        return (
            <React.Fragment>
                <AnchorContext.Provider value={this}>
                    <CommentAnchor/>
                    {this.props.children}
                </AnchorContext.Provider>
            </React.Fragment>
        );
    }
}