import * as React from 'react';
import {Component, CSSProperties, ReactNode} from 'react';
import * as _ from 'lodash';
import $ from 'jquery';
import {StyleInfoPanel, validHtmlTags} from './sizing';
import {Util} from '../util/util';
import {BulbOutlined, CloseOutlined} from '@ant-design/icons';
import {StringMap} from '../util/export';
import {CommentContentProps, CommentContext, ComponentComment} from './comment_def';
import moment from 'moment';
import {linkOfReq, ReqPriority, Requirement} from "./requirement_def";
import {Link} from "react-router-dom";

let pageComments: CommentContent[] = [];
setInterval(() => {
  if (!pageComments.length) {
    return;
  }
  pageComments.forEach((pc: CommentContent) => pc.refreshLine());
}, 3000);

const clearAllStickers = () => {
  _.each(pageComments, (pc: CommentContent) => pc.removeAllStickers());
};

interface CommentInfo {
  x?: number;
  y?: number;
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  width?: number;
  height?: number;
  elementId?: string;
}

interface CommentContentState {
  stickers: StringMap<boolean>;
  source?: CommentInfo;
  targets?: CommentInfo[];
  active?: boolean;
}

class CommentContent extends React.Component<CommentContentProps, CommentContentState> {
  container: any;

  constructor(props: CommentContentProps) {
    super(props);
    this.state = {stickers: {}};
    pageComments.push(this);
  }

  componentDidMount() {
    this.refreshLine();
  }

  refreshLine() {
    const {position, elements} = this.props;
    const source: CommentInfo = {};
    const container = $(this.container);
    let offset = container.offset();
    if (!offset) {
      return;
    }
    source.y = container.outerHeight() / 2 + offset.top;
    source.x = position === 'left' ? offset.left + container.outerWidth() : offset.left;
    const targets: CommentInfo[] = [];
    elements.forEach((element, i) => {
      let $element = $(element);
      let targetOffset = $element.offset();
      if (!targetOffset || (!targetOffset.left && !targetOffset.top)) {
        this.setState({source: null, targets: null});
        return;
      }
      const {left, top} = targetOffset;
      let width = $element.outerWidth();
      let height = $element.outerHeight();
      const right = left + width;
      const target: CommentInfo = {y: top + height / 2};
      if (position === 'left') {
        target.x = left;
      } else {
        target.x = right;
      }
      _.assign(target, {left, top, width, height, elementId: i});
      targets.push(target);
    });
    this.setState({source, targets});
  }

  removeAllStickers() {
    this.setState({stickers: {}});
  }

  render() {
    const {content, width, title, maxHeight, position, plainContent, requirement} = this.props;
    const {source, targets, active, stickers} = this.state;
    let lineStyles: CSSProperties[] = null;
    if (source) {
      lineStyles = [];
      const {x: sx, y: sy} = source;
      targets.forEach(target => {
        const {x: tx, y: ty} = target;
        let len = Math.round(Math.sqrt(Math.pow(sx - tx, 2) + Math.pow(sy - ty, 2)));
        lineStyles.push({
          width: len + 'px',
          height: 0,
          position: 'absolute',
          zIndex: 800,
          left: Math.round(sx + (tx - sx) / 2) - len / 2 + 'px',
          top: Math.round(sy + (ty - sy) / 2) + 'px',
          transform: 'rotate(' + Math.atan((ty - sy) / (tx - sx)) / Math.PI * 180 + 'deg)',
        });
      });
    }
    let className;
    if (plainContent !== false) {
      className = 'comment-border comment-bg comment-color line-wrap';
    } else {
      className = position === 'left' ? 'comment-border-right' : 'comment-border-left';
    }
    const activeSuffix = active ? ' active' : '';
    const hoverOptions = {
      onMouseOver: () => this.setState({active: true}),
      onMouseOut: () => this.setState({active: false}),
    };
    return (
      <React.Fragment>
        <div style={{
          margin: '10px 0', padding: '5px', width: width || '200px',
          overflow: 'visible', clear: 'both', float: position === 'left' ? 'right' : 'left',
        }}
             className={'comment ' + className + activeSuffix}
             ref={ref => this.container = ref}>
          {!!title && (<h2 className='comment-color'>{title}</h2>)}
          <div style={maxHeight ? {maxHeight: maxHeight + 'px', overflowY: 'scroll'} : null}
               {...hoverOptions}>
            {content}
            {!!requirement && (
              <div className='top-margin-sm'>
                <Link to={linkOfReq(requirement)}>
                  <BulbOutlined className='right-margin-xs'/>
                  需求：<ReqPriority priority={requirement.priority} className='right-margin-xs'/>{requirement.title}
                </Link>
              </div>
            )}
          </div>
          {!!lineStyles && lineStyles.map((lineStyle, i) => (
            <Util.A key={i} className={'comment-border-bottom' + activeSuffix}
                    style={lineStyle} {...hoverOptions}/>
          ))}
          {!!targets && targets.map((target, i) => {
            return (
              <React.Fragment key={i}>
                <Util.A
                  style={{
                    position: 'absolute', width: target.width, height: target.height,
                    left: target.left, top: target.top, zIndex: 700
                  }}
                  title='点击锁定注释' {...hoverOptions}
                  onClick={() => {
                    const elementId = target.elementId.toString();
                    if (stickers[elementId]) {
                      setTimeout(() => {
                        delete stickers[elementId];
                        this.setState({stickers});
                      }, 150);
                      return;
                    }
                    stickers[elementId] = true;
                    this.setState({stickers});
                  }}
                  onDoubleClick={clearAllStickers}/>
              </React.Fragment>
            )
          })}
        </div>
        {!!targets && targets.map((target, i) => {
          const elementId = target.elementId.toString();
          if (!stickers[elementId]) {
            return null;
          }
          return (
            <div className={'comment-sticker' + (plainContent === false ? '' : ' line-wrap')} style={{
              left: target.left + 'px', top: target.top + target.height + 5 + 'px',
              width: width || '200px',
            }} key={i}>
              <Util.A onClick={() => {
                setTimeout(() => {
                  delete stickers[elementId];
                  this.setState({stickers});
                }, 150);
              }}
                      className='sticker-close'
                      onDoubleClick={clearAllStickers}>
                <CloseOutlined className='text-dark' title='双击清理所有贴纸'/>
              </Util.A>
              {content}
            </div>
          )
        })}
      </React.Fragment>
    );
  }
}

interface VersionContextState {
  leftComments?: CommentContentProps[];
  rightComments?: CommentContentProps[];
  activeSizingElement?: EventTarget;
  lockedSizingElement?: EventTarget;
}

interface VersionContextProps {
  currentVersion: string;
  sizeMode?: boolean;
}

class VersionContext extends Component<VersionContextProps, VersionContextState> {
  ukMap: StringMap<boolean>;
  comments: CommentContentProps[];
  contentContainer: HTMLElement;
  updatingSizeInfo: boolean;
  sizeInfoEnteredTime: number;
  debouncedUpdateHoverActions: () => void;

  constructor(props: VersionContextProps) {
    super(props);
    this.ukMap = {};
    this.comments = [];
    this.state = {};
    pageComments = [];
    this.onElementMouseEnter = this.onElementMouseEnter.bind(this);
    this.onElementMouseLeave = this.onElementMouseLeave.bind(this);
    this.debouncedUpdateHoverActions = _.debounce(this.updateAllElementsSizeHoverAction.bind(this), 100);
  }

  getCommentContent(comment: ComponentComment): { content: ReactNode, requirement: Requirement } {
    const {currentVersion} = this.props;
    const {comments, requirementComments} = comment.props;
    if (requirementComments) {
      let content: ReactNode = null;
      let requirement: Requirement = null;
      _.each(requirementComments, comment => {
        if (comment.global || comment.requirement?.plan?.version === currentVersion) {
          content = comment.content;
          requirement = comment.requirement;
          return false;
        }
      });
      if (content) {
        return {content, requirement};
      }
    }
    if (comments) {
      let content = comments[currentVersion] || comments.global;
      if (content) {
        return {content, requirement: null};
      }
    }
    return null;
  }

  addComment(comment: ComponentComment) {
    let {content, requirement} = this.getCommentContent(comment);
    if (!content) {
      return;
    }
    const {elements} = comment;
    if (!elements || !elements.length) {
      return;
    }
    const {uk} = comment.props;
    if (uk) {
      let ukMap = this.ukMap;
      if (ukMap[uk]) {
        return;
      }
      ukMap[uk] = true;
    }
    this.comments.push(_.assign({}, comment.props, {
      elements, content, requirement,
    }));
  }

  componentDidMount() {
    this.updateAllElementsSizeHoverAction();
    const leftComments: CommentContentProps[] = [];
    const rightComments: CommentContentProps[] = [];
    _.each(this.comments, c => {
      const {elements, position} = c;
      let $element = $(elements[0]);
      const {left} = $element.offset();
      const right = left + $element.width();
      let pos = position ? position : (left < $(window).width() - right ? 'left' : 'right');
      if (pos === 'left') {
        leftComments.push(_.assign(c, {position: 'left'}));
      } else {
        rightComments.push(_.assign(c, {position: 'right'}));
      }
    });
    this.setState({leftComments, rightComments});
  }

  componentDidUpdate(): void {
    if (!this.updatingSizeInfo) {
      this.debouncedUpdateHoverActions();
    }
  }

  updateAllElementsSizeHoverAction() {
    $(this.contentContainer).children().each((i, root) => {
      this.updateElementSizeHoverAction(root);
    });
  }

  updateElementSizeHoverAction(element: HTMLElement) {
    let $e = $(element);
    let tag = _.toLower($e.prop('tagName'));
    if (tag && validHtmlTags[tag]) {
      $e.off('mouseenter.styleInfo');
      $e.off('mouseleave.styleInfo');
      $e.on('mouseenter.styleInfo', this.onElementMouseEnter);
      $e.on('mouseleave.styleInfo', this.onElementMouseLeave);
    }
    $e.children().each((index, child) => {
      this.updateElementSizeHoverAction(child);
    });
  }

  dismissHoveredElement(target: EventTarget) {
    const leftTime = moment().valueOf();
    window.setTimeout(() => {
      this.updatingSizeInfo = true;
      const {activeSizingElement} = this.state;
      if (target !== activeSizingElement) {
        return;
      }
      const lastEnter = this.sizeInfoEnteredTime;
      if (leftTime - lastEnter < 10) {
        return;
      }
      this.setState({activeSizingElement: null}, () => {
        this.updatingSizeInfo = false;
      });
    }, 30);
  }

  onElementMouseLeave(e: Event) {
    const {sizeMode} = this.props;
    if (!sizeMode) {
      return;
    }
    if (e.currentTarget !== e.target) {
      return;
    }
    this.dismissHoveredElement(e.target);
  }

  onElementMouseEnter(e: Event) {
    const {sizeMode} = this.props;
    if (!sizeMode) {
      return;
    }
    if (e.currentTarget !== e.target) {
      return;
    }
    this.updatingSizeInfo = true;
    this.setState({activeSizingElement: e.target}, () => {
      this.updatingSizeInfo = false;
      this.sizeInfoEnteredTime = moment().valueOf();
    });
  }

  render() {
    const {sizeMode} = this.props;
    const {leftComments, rightComments, lockedSizingElement, activeSizingElement} = this.state;
    return (
      <div style={{display: 'table'}} onClick={() => {
        if (activeSizingElement) {
          this.setState({lockedSizingElement: activeSizingElement});
        }
      }}>
        {!sizeMode && (!!leftComments && !!leftComments.length) && (
          <div className='proto-frameworks'
               style={{display: 'table-cell', padding: '10px', verticalAlign: 'top'}}>
            {leftComments.map((c, i) => (
              <React.Fragment key={i}>
                <CommentContent {...c}/>
                <div className='clearfix'/>
              </React.Fragment>
            ))}
          </div>
        )}
        <div ref={ref => this.contentContainer = ref}
             style={{display: 'table-cell', padding: '30px', verticalAlign: 'top'}}>
          <CommentContext.Provider value={this}>
            {this.props.children}
          </CommentContext.Provider>
        </div>
        {!sizeMode && (!!rightComments && !!rightComments.length) && (
          <div className='proto-frameworks' style={{display: 'table-cell', padding: '10px', verticalAlign: 'top'}}>
            {rightComments.map((c, i) => (
              <React.Fragment key={i}>
                <CommentContent {...c}/>
                <div className='clearfix'/>
              </React.Fragment>
            ))}
          </div>
        )}
        {!!sizeMode && (
          <div style={{display: 'table-cell'}}>
            <div style={{width: '250px', height: '10px'}}/>
          </div>)}
        {!!sizeMode && (
          <StyleInfoPanel activeElement={activeSizingElement}
                          lockedElement={lockedSizingElement}
                          removeActive={() => this.setState({activeSizingElement: null})}
                          removeLocked={() => this.setState({lockedSizingElement: null})}
                          getContentContainer={() => this.contentContainer}
                          switchElement={e => {
                            this.setState({lockedSizingElement: e});
                          }}/>
        )}
      </div>
    );
  }
}

export default VersionContext;