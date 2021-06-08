import * as React from 'react';
import {Component, ReactElement, ReactNode} from 'react';
import $ from 'jquery';
import {StringMap} from '../util/string_map';
import {Util} from '../util/util';
import {CloseOutlined} from '@ant-design/icons';

const validHtmlTagList: string[] = [
    'div', 'span', 'i', 'td', 'th', 'img', 'svg', 'p', 'button', 'a', 'li', 'select', 'option', 'aside',
    'nav', 'ul', 'ol', 'input', 'textarea', 'checkbox', 'radio', 'video', 'canvas', 'section', 'strong',
    'strike', 'del', 'label', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'pre', 'table', 'tr', 'textarea',
];

const tagMap: StringMap<boolean> = {};

validHtmlTagList.forEach(tag => tagMap[tag] = true);

export const validHtmlTags: StringMap<boolean> = tagMap;

interface StyleInfoPanelProps {
    activeElement?: EventTarget;
    lockedElement?: EventTarget;
    removeActive: () => void;
    removeLocked: () => void;
    switchElement: (element: EventTarget) => void;
    getContentContainer: () => HTMLElement;
}

interface StyleInfoPanelState {
}

type IgnoreFunc = ((value: string, key?: string) => boolean) | null;

interface CssChecker {
    key: string;
    ignore?: IgnoreFunc;
    missing?: (string | CssChecker)[];
}

const ignoreOf = (
    key: string,
    ignore?: string | RegExp | IgnoreFunc,
    missing?: (string | CssChecker)[]): CssChecker => {
    let ignoreFunc: IgnoreFunc = null;
    if (typeof ignore === 'string') {
        ignoreFunc = v => !!v && v.indexOf(ignore as string) >= 0;
    } else if (ignore instanceof RegExp) {
        ignoreFunc = v => !!v && ignore.test(v);
    } else if (ignore) {
        ignoreFunc = ignore;
    }
    return {
        key, ignore: ignoreFunc, missing,
    };
};

const propsWithDirection = (key: string, ignore?: string | RegExp | IgnoreFunc) => {
    return ignoreOf(key, ignore, [
        ignoreOf(key + '-top', ignore),
        ignoreOf(key + '-right', ignore),
        ignoreOf(key + '-bottom', ignore),
        ignoreOf(key + '-left', ignore),
    ]);
};

const rgbaIgnoreRegexp: RegExp = /^rgba\(.*,\s*0\)$/;
const rgbRegexp: RegExp = /rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)/;
const rgbaRegexp: RegExp = /rgba\(\d{1,3},\s*\d{1,3},\s*\d{1,3},\s*[0-9.]+\)/;
const pxSizeRegexp: RegExp = /^-?\d+(\.\d+)?px$/;

const hex = (str: string) => {
    let v = parseInt(str).toString(16);
    return v.length > 1 ? v : '0' + v;
};

const cssProps: (string | CssChecker)[] = [
    'font-size', 'color', ignoreOf('font-style', 'normal'), ignoreOf('font-weight', '400'),
    'line-height', 'width', 'height',
    ignoreOf('background', 'none', [ignoreOf('background-color', rgbaIgnoreRegexp)]),
    ignoreOf('left', 'auto'), ignoreOf('top', 'auto'),
    ignoreOf('display', 'block'),
    ignoreOf('text-align', /^(start|left|auto)$/),
    propsWithDirection('margin', 'auto'),
    propsWithDirection('padding', 'auto'),
    propsWithDirection('border', 'none'),
];

type PxToRemFunc = (val: string) => string;

const currentPxToRem = (): PxToRemFunc => {
    const mb1RemSize = $('#mb-base-1rem').css('font-size');
    if (!mb1RemSize || !pxSizeRegexp.test(mb1RemSize)) {
        return null;
    }
    const _1remPxVal = parseFloat(mb1RemSize.substring(0, mb1RemSize.length - 2));
    return (val: string) => {
        if (!val || !pxSizeRegexp.test(val)) {
            return val;
        }
        return (parseFloat(val.substring(0, val.length - 2)) / _1remPxVal).toFixed(4) + 'rem';
    };
};

const pxToRemProps: StringMap<boolean> = {'font-size': true, 'line-height': true, 'width': true, 'height': true};

const colorDemoOf = (color: string) => (
    <span style={{width: '14px', lineHeight: '14px', backgroundColor: color, display: 'inline-block'}}
          className='left-margin-xs'>
        {'　'}
    </span>
);

export class StyleInfoPanel extends Component<StyleInfoPanelProps, StyleInfoPanelState> {
    constructor(props: StyleInfoPanelProps) {
        super(props);
    }

    postProcessCssValue(key: string, value: string, pxToRem: PxToRemFunc): string | ReactElement {
        if (pxToRemProps[key] && pxToRem) {
            return pxToRem(value);
        }
        let rgbPart = rgbRegexp.exec(value);
        let color: string;
        let colorDemo: ReactElement;
        if (rgbPart && rgbPart[0]) {
            const colorRegexp: RegExp = /\d{1,3}/g;
            let rgb = rgbPart[0];
            let r = colorRegexp.exec(rgb)[0];
            let g = colorRegexp.exec(rgb)[0];
            let b = colorRegexp.exec(rgb)[0];
            color = '#' + hex(r) + hex(g) + hex(b);
            colorDemo = colorDemoOf(color);
        } else {
            let rgbaPart = rgbaRegexp.exec(value);
            if (rgbaPart && rgbaPart[0]) {
                colorDemo = colorDemoOf(rgbaPart[0]);
            }
        }
        return (
            <span>
                {value}
                {colorDemo}
                {!!color && <span className='left-margin-xs'>{color}</span>}
            </span>
        );
    }

    prepareElementProps(element: EventTarget): ReactElement[] {
        const $e = $(element);
        const pxToRem = currentPxToRem();
        const results: ReactElement[] = [];
        const putCssProps = (cps: (string | CssChecker)[]) => {
            cps.forEach((p: string | CssChecker) => {
                let key: string;
                let value: string;
                let pcc: CssChecker;
                if (typeof p === 'string') {
                    key = p as string;
                    value = $e.css(key);
                } else {
                    pcc = p as CssChecker;
                    key = pcc.key;
                    value = $e.css(key);
                    if (value && pcc.ignore(value, key)) {
                        value = null;
                    }
                }
                if (value) {
                    results.push((
                        <div key={key}>
                            <strong>{key}：</strong>
                            {this.postProcessCssValue(key, value, pxToRem)}
                        </div>
                    ));
                } else if (pcc && pcc.missing) {
                    putCssProps(pcc.missing);
                }
            });
        };
        putCssProps(cssProps);
        return results;
    }

    renderElementStyleInfo(element: EventTarget, removal: () => void, borderClass?: string): ReactElement {
        if (!element) {
            return null;
        }
        let propElements = this.prepareElementProps(element);
        let outerElement: ReactNode = null;
        if (borderClass) {
            let parent = $(element).parent();
            if (parent[0] && parent[0] !== this.props.getContentContainer()) {
                outerElement = (
                    <Util.A className='left-margin-sm' icon='fullscreen' onClick={() => {
                        this.props.switchElement(parent[0]);
                    }}>
                        向外一层
                    </Util.A>
                )
            }
        }
        return (
            <React.Fragment>
                <div className={'bottom-margin comment-border' + (borderClass || '')}
                     style={{padding: '10px', background: 'rgba(255, 255, 255, 0.8)'}}>
                    <div>
                        <strong className='text-primary'>{'<' + $(element).prop('tagName') + '>'}</strong>
                        {outerElement}
                        {!!borderClass && (
                            <Util.A onClick={removal} className='left-margin' style={{float: 'right'}}>
                                <CloseOutlined className='text-dark'/>
                            </Util.A>
                        )}
                    </div>
                    {propElements}
                </div>
            </React.Fragment>
        );
    }

    renderElementBorder(element: EventTarget, borderClass?: string): ReactElement {
        if (!element) {
            return null;
        }
        let $e = $(element);
        let offset = $e.offset();
        if (!offset) {
            return null;
        }
        let height = $e.outerHeight();
        let width = $e.outerWidth();
        const {top, left} = offset;
        let w = width;
        let h = height;
        let x = left;
        let y = top;
        let pxToRem = currentPxToRem();
        return (
            <React.Fragment>
                <div className={'style-line-hor' + (borderClass || '')}
                     style={{
                         width: w + 'px', top: (top) + 'px', left: x + 'px',
                     }}/>
                <div className={'style-line-hor' + (borderClass || '')}
                     style={{
                         width: w + 'px', top: (top + height - 1) + 'px', left: x + 'px',
                     }}/>
                <div className={'style-line-ver' + (borderClass || '')}
                     style={{
                         height: h + 'px', top: y + 'px', left: (left) + 'px',
                     }}/>
                <div className={'style-line-ver' + (borderClass || '')}
                     style={{
                         height: h + 'px', top: y + 'px', left: (left + width - 1) + 'px',
                     }}/>
                <div className='style-tag' style={{left: (left + 1) + 'px', top: (top - 19) + 'px'}}>
                    {'w=' + (pxToRem ? pxToRem(width + 'px') : width + 'px')}
                    {', h=' + (pxToRem ? pxToRem(height + 'px') : height + 'px')}
                </div>
            </React.Fragment>
        )
    }

    renderDeltaDist(): ReactNode {
        const {activeElement, lockedElement} = this.props;
        if (!activeElement || !lockedElement || activeElement === lockedElement) {
            return null;
        }
        const $a = $(activeElement);
        const $l = $(lockedElement);
        const aw = $a.outerWidth();
        const ah = $a.outerHeight();
        const {left: al, top: at} = $a.offset();
        const ar = al + aw - 1;
        const ab = at + ah - 1;
        let lw = $l.outerWidth();
        let lh = $l.outerHeight();
        const {left: ll, top: lt} = $l.offset();
        const lr = ll + lw - 1;
        const lb = lt + lh - 1;
        let left: number, right: number, top: number, bot: number, horY: number, leftT: number, rightT: number,
            verX: number, topL: number, botL: number;
        const bet = (val: number, l: number, r: number): boolean => val >= l && val <= r;
        if (bet(al, ll, lr) || bet(ar, ll, lr) || bet(ll, al, ar) || bet(lr, al, ar)) {
            // x direction joined.
            left = al < ll ? al : ll;
            right = al > ll ? al - 1 : ll - 1;
        } else {
            left = al > ll ? lr + 1 : ar + 1;
            right = al > ll ? al - 1 : ll - 1;
        }
        leftT = al < ll ? ab : lb;
        rightT = al < ll ? lb : ab;
        if (bet(at, lt, lb) || bet(ab, lt, lb) || bet(lt, at, ab) || bet(lb, at, ab)) {
            // y direction joined.
            top = at < lt ? at : lt;
            bot = at > lt ? at - 1 : lt - 1;
        } else {
            top = at > lt ? lb + 1 : ab + 1;
            bot = at > lt ? at - 1 : lt - 1;
        }
        topL = at < lt ? ar : lr;
        botL = at < lt ? lr : ar;
        const LABEL_DIST = 32;
        horY = (ab > lb ? ab : lb) + LABEL_DIST;
        verX = (ar > lr ? ar : lr) + LABEL_DIST;
        const deltaX = (right - left + 1) + 'px';
        const deltaY = (bot - top + 1) + 'px';
        let pxToRem = currentPxToRem();
        return (
            <React.Fragment>
                <div className='style-line-hor' style={{
                    top: horY + 'px', left: left + 'px', width: deltaX,
                }}/>
                <div className='style-line-ver' style={{
                    left: left + 'px', top: leftT + 'px', height: (horY - leftT + 21) + 'px',
                }}/>
                <div className='style-line-ver' style={{
                    left: (right + 1) + 'px', top: rightT + 'px', height: (horY - rightT + 21) + 'px',
                }}/>
                <div className='style-tag' style={{
                    left: (left + 1) + 'px', top: (horY + 1) + 'px',
                }}>
                    Δx={pxToRem ? pxToRem(deltaX) : deltaX}
                </div>
                <div className='style-line-ver' style={{
                    left: verX + 'px', top: top + 'px', height: deltaY,
                }}/>
                <div className='style-line-hor' style={{
                    top: top + 'px', left: topL + 'px', width: (verX - topL + 21) + 'px',
                }}/>
                <div className='style-line-hor' style={{
                    top: (bot + 1) + 'px', left: botL + 'px', width: (verX - botL + 21) + 'px',
                }}/>
                <div className='style-tag' style={{
                    top: (top + 1) + 'px', left: (verX + 1) + 'px',
                }}>
                    Δy={pxToRem ? pxToRem(deltaY) : deltaY}
                </div>
            </React.Fragment>
        );
    }

    render() {
        const {activeElement, lockedElement, removeActive, removeLocked} = this.props;
        return (
            <React.Fragment>
                <div style={{
                    top: '40px', right: '10px', width: '200px', position: 'fixed',
                    maxHeight: ($(window).height() - 50) + 'px', overflowY: 'auto',
                }}>
                    {this.renderElementStyleInfo(lockedElement, removeLocked, ' active')}
                    {activeElement !== lockedElement && (
                        this.renderElementStyleInfo(activeElement, removeActive)
                    )}
                </div>
                {this.renderElementBorder(lockedElement, ' active')}
                {activeElement !== lockedElement && (
                    this.renderElementBorder(activeElement)
                )}
                {this.renderDeltaDist()}
            </React.Fragment>
        );
    }
}

