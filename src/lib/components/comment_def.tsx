import * as React from 'react';
import {Component, Context, DOMElement, ReactNode} from 'react';
import {StringMap} from '../util/export';
import $ from 'jquery';
import {Requirement} from "./requirement_def";

export declare type CommentPosition = 'left' | 'right';

export interface ICommentContext {
  addComment: (comment: ComponentComment) => void;
}

export const CommentContext: Context<ICommentContext> = React.createContext<ICommentContext>(null);
export const ContextDisableContext: Context<boolean> = React.createContext<boolean>(null);

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

interface IEnableContext {
  scopeEnabled: (scope: string) => boolean;
}

const CommentEnableContext = React.createContext<IEnableContext>(null);

interface EnableCommentScopeProps {
  scope: string;
}

export class EnableCommentScope extends Component<EnableCommentScopeProps, {}> implements IEnableContext {
  parent: IEnableContext;

  constructor(props: EnableCommentScopeProps) {
    super(props);
  }

  scopeEnabled = (scope: string): boolean => {
    if (!scope) {
      return true;
    }
    if (scope === this.props.scope) {
      return true;
    }
    const parent = this.parent;
    return parent ? parent.scopeEnabled(scope) : false;
  }

  render() {
    return (
      <CommentEnableContext.Consumer>
        {context => {
          if (context) {
            this.parent = context;
          }
          return (
            <CommentEnableContext.Provider value={this}>
              {this.props.children}
            </CommentEnableContext.Provider>
          )
        }}
      </CommentEnableContext.Consumer>
    );
  }
}


export const AnchorContext: Context<ComponentComment> = React.createContext<ComponentComment>(null);

export class CommentAnchor extends React.Component<{}, {}> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <ContextDisableContext.Consumer>
        {disabled => disabled ? null : (
          <CommentEnableContext.Consumer>
            {scopeContext => (
              <AnchorContext.Consumer>
                {comment => {
                  const scope = comment.getScope();
                  if (scope && (!scopeContext || !scopeContext.scopeEnabled(scope))) {
                    return null;
                  }
                  return (
                    <span style={{display: 'none'}} ref={ref => comment.addAnchor(ref)}/>
                  )
                }}
              </AnchorContext.Consumer>
            )}
          </CommentEnableContext.Consumer>
        )}
      </ContextDisableContext.Consumer>
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
  disableCover?: boolean;
}

export interface CommentForRequirement {
  requirement: Requirement;
  content: ReactNode;
  global?: boolean;
}

export const commentForReq = (requirement: Requirement, content: ReactNode, global?: boolean): CommentForRequirement => ({
  requirement, content, global,
});

export interface ComponentCommentProps extends CommentContentProps {
  uk?: string; // Make sure component comment shows up only once.
  /** @Deprecated Use requirementComments instead. */
  comments?: CommentMap;
  requirementComments?: CommentForRequirement[];
  selector?: string;
  scope?: string;
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
      const context: ICommentContext = this.context;
      context.addComment(this);
    }
  }

  addAnchor(anchor: any) {
    this.anchors.push(anchor);
  }

  getScope() {
    return this.props.scope;
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