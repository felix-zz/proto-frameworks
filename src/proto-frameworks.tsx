import React, {Component, ComponentType, ReactNode} from 'react';
import {HashRouter, Link, Route} from 'react-router-dom';
import Modal from 'react-modal';
import * as _ from 'lodash';
import {
    FontSizeOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    MinusSquareOutlined,
    PlusSquareOutlined,
    UnorderedListOutlined
} from '@ant-design/icons';
import {StringMap} from './util/string_map';
import {VersionInfo} from './components/versions';
import {PageNode} from './components/page_def';
import {Util} from './util/util';
import VersionContext from './components/versioned_comment';
import {RouteComponentProps} from 'react-router';
import InnerModal from './components/inner_modal';

let toggleSizingMode: (on?: boolean) => void = null;

Modal.setAppElement('body');

window.onkeydown = (e: KeyboardEvent) => {
    if (e.shiftKey && _.toLower(e.key) === 'e' && toggleSizingMode) {
        toggleSizingMode();
    }
};

interface FrameworkProps extends RouteComponentProps {
    defaultProduct?: string;
    pageTree: StringMap<PageNode>;
    historyVersions: VersionInfo[];
    currentVersion: string;
    navBar?: ReactNode;
}

interface FrameworkState {
    versionRelated: boolean;
    sidebarHidden: boolean;
    sizeMode: boolean;
    filteredVersions?: VersionInfo[];
    historyVisible?: boolean;
}

class Framework extends Component<FrameworkProps, FrameworkState> {

    constructor(props: FrameworkProps) {
        super(props);
        this.state = {
            versionRelated: sessionStorage.getItem('versionRelated') !== 'false',
            sidebarHidden: sessionStorage.getItem('sidebarHidden') === 'true',
            sizeMode: sessionStorage.getItem('sizeMode') === 'true',
        };
        this.searchVersion = _.debounce(this.searchVersion.bind(this), 300);
    }

    componentDidMount() {
        toggleSizingMode = this.toggleSizingMode.bind(this);
    }

    getCurrentProduct = (): string => {
        let location: string = this.props.location.pathname;
        const {defaultProduct, pageTree} = this.props;
        if (!location || location.length <= 2) {
            return defaultProduct;
        }
        let product;
        if (location.startsWith('/index/')) {
            product = location.substring('/index/'.length);
        } else {
            let secondSlash = location.indexOf('/', 1);
            product = location.substring(1, secondSlash < 0 ? location.length : secondSlash);
        }
        return pageTree[product] ? product : defaultProduct;
    };

    toggleSizingMode(on?: boolean) {
        if (typeof on !== 'boolean') {
            on = !this.state.sizeMode;
        }
        sessionStorage.setItem('sizeMode', on.toString());
        this.setState({sizeMode: on});
    }

    searchVersion(query: string) {
        const {historyVersions} = this.props;
        const versions = historyVersions;
        const matches = (str: string) => !str ? false : _.toLower(str).indexOf(query) >= 0;
        let filtered = versions ? versions.filter(version => (
            !query ? true : matches(version.version) ||
                (typeof version.description === 'string' && matches(version.description))
        )) : [];
        this.setState({filteredVersions: filtered});
    }

    renderVersionHistory() {
        const showHistories = () => this.setState({
            historyVisible: true,
        });
        const closeHistories = () => this.setState({
            historyVisible: false,
        });
        const {filteredVersions, historyVisible} = this.state;
        const versions = filteredVersions ? filteredVersions : this.props.historyVersions;
        return (
            <React.Fragment>
                <Util.A icon={<UnorderedListOutlined/>} className='left-margin' onClick={showHistories}
                        style={{fontSize: '12px'}}>
                    历史版本
                </Util.A>
                <InnerModal display={!!historyVisible} onClose={closeHistories}
                            style={{top: '15px', width: '650px'}} title='历史版本'>
                    <div>
                        <input style={{width: '300px'}}
                               onChange={e => this.searchVersion(e.target.value)}
                               placeholder='搜索版本和描述'/>
                    </div>
                    {(!versions || !versions.length) ? (
                        <div className='text-dark' style={{padding: '15px'}}>没有版本信息</div>
                    ) : versions.map(ver => {
                        const {version, url, description} = ver;
                        return (
                            <div key={version} style={{
                                padding: '15px 0',
                                borderBottom: '1px solid #f0f0f0'
                            }}>
                                <div style={{lineHeight: '30px'}}>
                                    <strong style={{fontSize: '14px'}} className='right-margin'>{version}</strong>
                                    {url ? (
                                        <Util.A target='_blank' href={url}>查看原型</Util.A>
                                    ) : (<span className='text-grey'>已无环境可看</span>)}
                                </div>
                                <div className='text-dark'>{description}</div>
                            </div>
                        )
                    })}
                </InnerModal>
            </React.Fragment>
        );
    }

    renderSubMenu(pages: StringMap<PageNode>, prefix?: string, depth?: number, currentHash?: string): ReactNode[] {
        if (!pages) {
            return [];
        }
        const {currentVersion} = this.props;
        const items: ReactNode[] = [];
        prefix = prefix ? prefix : '';
        depth = depth ? depth : 0;
        const {versionRelated} = this.state;
        _.each(pages, (page, key) => {
            const {name, element, ver, collapsed, pages: childPages} = page;
            const childPrefix = prefix + '/' + key;
            const currentRegexp = new RegExp('^' + childPrefix + '(/\\d+)?$');
            let childItems = this.renderSubMenu(childPages, childPrefix, depth + 1, currentHash);
            const isCurrentVer = ver === currentVersion;
            if (isCurrentVer || !versionRelated || childItems.length > 0) {
                const isCurrent = currentRegexp.test(currentHash);
                const toggleCollapsed = () => {
                    page.collapsed = !collapsed;
                    this.setState({});
                };
                items.push((
                    <React.Fragment key={key}>
                        <div className={'framework-menu-item' + (isCurrent ? ' active' : '')}
                             style={{paddingLeft: depth * 12 + 'px'}}>
                            <span className='icon-op text-dark'>
                                {(!!childPages && !!_.keys(childPages).length) ? (
                                    collapsed ? (
                                        <PlusSquareOutlined onClick={toggleCollapsed}/>
                                    ) : (
                                        <MinusSquareOutlined onClick={toggleCollapsed}/>
                                    )
                                ) : ' '}
                            </span>
                            {(!!element && (isCurrentVer || !versionRelated)) ? (
                                isCurrent ? (
                                    <span>{name}</span>
                                ) : (
                                    <Link to={childPrefix}>{name}</Link>
                                )
                            ) : (
                                <span className='text-dark'>{name}</span>
                            )}
                        </div>
                        {collapsed ? null : childItems}
                    </React.Fragment>
                ));
            }
        });
        return items;
    }

    render() {
        const {versionRelated, sidebarHidden, sizeMode} = this.state;
        const {pageTree, currentVersion} = this.props;
        let currentProduct = this.getCurrentProduct();
        const products: ReactNode[] = [];
        let currentHash = window.location.hash;
        currentHash = currentHash ? currentHash.substring(1) : currentHash;
        _.each(pageTree, (product, key) => {
            if (versionRelated && product.ver !== currentVersion) {
                return;
            }
            let anchor;
            let isCurrent = key === currentProduct;
            if (!isCurrent) {
                anchor = (
                    <Link className='text-dark' to={'/index/' + key}>
                        {product.name}
                    </Link>
                );
            } else {
                anchor = (
                    <Util.A>{product.name}</Util.A>
                );
            }
            products.push((
                <span key={key}>
                    {anchor}
                </span>
            ));
        });
        const curProduct = pageTree[currentProduct];
        return (
            <React.Fragment>
                <div className='proto-frameworks framework-head'>
                    <Util.A className='icon text-dark'
                            onClick={() => {
                                sessionStorage.setItem('sidebarHidden', (!sidebarHidden).toString());
                                this.setState({sidebarHidden: !sidebarHidden});
                            }}>
                        {sidebarHidden ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                    </Util.A>
                    {!!products && !!products.length && (
                        <span style={{fontSize: '14px'}} className='left-margin'>
                            {products}
                        </span>
                    )}
                    <label className='left-margin'>
                        <input type='checkbox' checked={versionRelated}
                               onChange={e => {
                                   sessionStorage.setItem('versionRelated', e.target.checked.toString());
                                   this.setState({versionRelated: e.target.checked});
                               }}/>
                        只显示{' ' + currentVersion + ' '}相关页面
                    </label>
                    <label className='left-margin'>
                        <input type='checkbox' checked={sizeMode}
                               onChange={e => this.toggleSizingMode(!!e.target.checked)}/>
                        度量模式{' ⇧E'}
                    </label>
                    <Link className='left-margin' to='/' style={{fontSize: '12px'}}>
                        <FontSizeOutlined className='right-margin-xs'/>
                        设计规范
                    </Link>
                    {this.renderVersionHistory()}
                </div>
                {!sidebarHidden && (
                    <div className='proto-frameworks framework-sidebar'>
                        {this.renderSubMenu(curProduct.pages, '/' + currentProduct, 0, currentHash)}
                    </div>
                )}
                <div className={'proto-frameworks-body ' + (sidebarHidden ? 'sidebar-hidden' : '')}>
                    {this.props.navBar || null}
                    <VersionContext sizeMode={sizeMode} currentVersion={currentVersion}>
                        {this.props.children}
                    </VersionContext>
                </div>
            </React.Fragment>
        );
    }
}


interface BlankIndexProps {
}

interface BlankIndexState {
}

export class BlankIndex extends Component<BlankIndexProps, BlankIndexState> {
    constructor(props: BlankIndexProps) {
        super(props);
    }

    render() {
        return (
            <div/>
        );
    }
}


interface ProtoFrameworksProps {
    currentVersion: string;
    pageTree: StringMap<PageNode>;
    defaultProduct: string;
    historyVersions?: VersionInfo[];
    indexPage?: ComponentType;
}

interface ProtoFrameworksState {
}

export default class ProtoFrameworks extends Component<ProtoFrameworksProps, ProtoFrameworksState> {
    constructor(props: ProtoFrameworksProps) {
        super(props);
    }

    renderPage(Element: ComponentType, navBar: ReactNode, elementProps: StringMap<any>) {
        const {currentVersion, pageTree, defaultProduct, historyVersions} = this.props;
        return (props: RouteComponentProps<StringMap<any>>) => {
            const pageKey = _.get(window, 'location.search') || '#' + _.get(window, 'location.hash');
            let finalProps: StringMap<any> = _.assign({}, elementProps, props);
            return (
                <Framework key={pageKey} navBar={navBar} currentVersion={currentVersion} pageTree={pageTree}
                           defaultProduct={defaultProduct} historyVersions={historyVersions}
                           {...props}>
                    <Element {...finalProps}/>
                </Framework>
            );
        };
    }

    renderRoutes(routes: ReactNode[], key: string, page: PageNode, prefix?: string) {
        const {element, pages, nav, props} = page;
        const {currentVersion} = this.props;
        prefix = prefix || '';
        const path = prefix + '/' + key;
        if (element) {
            let navBar: ((index: number) => ReactNode) = null;
            if (nav && nav.items && nav.items.length) {
                const {defaultTitle, items} = nav;
                navBar = (index: number): ReactNode => (
                    <div className='proto-frameworks'>
                        <span className='comment-border top-margin-sm bottom-margin-sm' style={{
                            padding: '4px 8px', fontSize: '14px', display: 'inline-block',
                        }}>
                            <strong>该页面有多个状态，请查看：</strong>
                            {!index ? defaultTitle : <Link to={path}>{defaultTitle}</Link>}
                            {items.map((item, i) => {
                                const title = item.ver === currentVersion ? item.name : item.name + ' (本期无变化)';
                                return (
                                    <span key={i.toString()}>
                                        <span style={{color: 'rgba(0, 0, 0, 0.1)'}}
                                              className='left-margin-sm right-margin-sm'>
                                            |
                                        </span>
                                        {index === i + 1 ? title : <Link to={path + '/' + i}>{title}</Link>}
                                    </span>
                                );
                            })}
                        </span>
                    </div>
                );
                nav.items.forEach((item, i) => {
                    routes.push(<Route exact path={path + '/' + i}
                                       render={this.renderPage(item.element, navBar(i + 1), item.props)}
                                       key={path + '/' + i}/>);
                })
            }
            routes.push(<Route exact path={path} render={this.renderPage(element, !!navBar && navBar(0), props)}
                               key={path}/>);
        }
        _.each(pages, (p, k) => this.renderRoutes(routes, k, p, path));
    }

    render() {
        const indexPaths: string[] = [];
        const routes: ReactNode[] = [];
        const {pageTree, indexPage} = this.props;
        _.each(pageTree, (page, key) => {
            indexPaths.push('/index/' + key);
            this.renderRoutes(routes, key, page);
        });
        return (
            <HashRouter>
                <Route exact path={['/']} render={this.renderPage(indexPage || BlankIndex, null, {})}/>
                <Route exact path={indexPaths} render={this.renderPage(BlankIndex, null, {})}/>
                {routes}
            </HashRouter>
        );
    }
}
