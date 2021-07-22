import * as React from 'react';
import {Component, DOMElement, ReactNode, ReactNodeArray} from 'react';
import {StringMap} from '../util/export';
import $ from 'jquery';

export declare type CommentPosition = 'left' | 'right';

export declare type ComponentScope = StringMap<boolean>;

export declare interface CommentScopeController {
    disableAll: boolean;
    scopeMap: ComponentScope;
    addComment: (comment: ComponentComment) => void;
}

export const CommentContext = React.createContext<CommentScopeController>(null);

interface CommentSwitchProps {
    scope?: string | string[];
}

class CommentSwitch<TProps extends CommentSwitchProps, TState> extends Component<TProps, TState> {
    constructor(props: TProps) {
        super(props);
    }

    doSwitch(enable: boolean, controller: CommentScopeController) {
        const {scope} = this.props;
        if (scope) {
            if (typeof scope === 'string') {
                controller.scopeMap[scope] = enable;
            } else {
                scope.forEach(s => controller.scopeMap[s] = enable);
            }
        } else {
            controller.disableAll = enable;
        }
    }
}

interface DisableCommentProps extends CommentSwitchProps {
}

export class DisableComment extends CommentSwitch<DisableCommentProps, {}> {
    static contextType = CommentContext;

    constructor(props: DisableCommentProps) {
        super(props);
    }

    render() {
        this.doSwitch(false, this.context);
        return this.props.children;
    }
}

interface EnableCommentProps extends CommentSwitchProps {
}

export class EnableComment extends CommentSwitch<EnableCommentProps, {}> {
    static contextType = CommentContext;

    constructor(props: EnableCommentProps) {
        super(props);
    }

    render() {
        this.doSwitch(true, this.context);
        return this.props.children;
    }
}


export const AnchorContext = React.createContext(null);

export class CommentAnchor extends React.Component<{}, {}> {
    static contextType = CommentContext;

    constructor(props: any) {
        super(props);
    }

    render() {
        const context: CommentScopeController = this.context;
        if (context.disableAll === true) {
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

export type CommentMap = StringMap<string | ReactNode | ReactNodeArray>;

export interface ScopedCommentMap {
    comments: CommentMap;
    scope: string;
}

export interface CommentContentProps {
    position?: CommentPosition;
    elements?: DOMElement<any, any>[];
    content?: string | ReactNode;
    width?: number | string;
    title?: string | ReactNode;
    maxHeight?: number;
    plainContent?: boolean;
    refreshLine?: () => void;
}

interface ComponentCommentProps extends CommentContentProps {
    uk?: string; // Make sure component comment shows up only once.
    comments: CommentMap;
    scopedComments?: ScopedCommentMap;
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
            const context: CommentScopeController = this.context;
            this.elements = elements;
            context.addComment(this);
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