import * as React from 'react';
import {ComponentType} from 'react';
import * as _ from 'lodash';
import {StringMap} from '../util/export';
import {Requirement} from './requirement_def';

export interface PageNavItem {
    name: string;
    element?: ComponentType;
    props?: StringMap<any>;
    ver?: string;
    requirements?: Requirement[];
    link?: string;
}

export interface PageNav {
    defaultTitle: string;
    items: PageNavItem[];
}

export interface PageNode extends PageNavItem {
    pages?: StringMap<PageNode>;
    nav?: PageNav;
    collapsed?: boolean;
}

class PageNodeBuilder {
    private readonly node: PageNode;

    constructor(name: string) {
        this.node = {name};
    }

    withElement(element: ComponentType): PageNodeBuilder {
        this.node.element = element;
        return this;
    }

    withProps(props: StringMap<any>): PageNodeBuilder {
        this.node.props = props;
        return this;
    }

    withVersion(ver: string): PageNodeBuilder {
        this.node.ver = ver;
        return this;
    }

    withChildren(pages: StringMap<PageNode>): PageNodeBuilder {
        this.node.pages = pages;
        return this;
    }

    withNav(nav: PageNav): PageNodeBuilder {
        this.node.nav = nav;
        return this;
    }

    create(): PageNode {
        return _.assign({}, this.node);
    }
}

export const pageNodeBuilder = (pageName: string): PageNodeBuilder => {
    return new PageNodeBuilder(pageName);
};

class PageTreeBuilder {
    private readonly tree: StringMap<PageNode>;

    constructor() {
        this.tree = {};
    }

    addProduct(key: string, productTree: PageNode) {
        this.tree[key] = productTree;
        return this;
    }

    removeProduct(key: string) {
        delete this.tree[key];
        return this;
    }

    create(): StringMap<PageNode> {
        return _.assign({}, this.tree);
    }
}

export const pageTreeBuilder = (): PageTreeBuilder => {
    return new PageTreeBuilder();
}
