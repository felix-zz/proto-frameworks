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

export const checkPageIsCurrent = (page: PageNavItem, current: string, linkPageToReq?: boolean, ignoreNav?: boolean) => {
  let isCurrent = false;
  if (current === page.ver) {
    if (!linkPageToReq) {
      return true;
    }
    isCurrent = true;
  }
  const getReqPages = (req: Requirement) => {
    let pages: PageNavItem[] = req.pages;
    if (!pages) {
      pages = [];
      req.pages = pages;
    }
    return pages;
  }
  _.each(page.requirements, req => {
    if (req.plan.version === current) {
      isCurrent = true;
      if (!linkPageToReq) {
        return false;
      }
      getReqPages(req).push(page);
    }
  });
  if (!isCurrent) {
    const {nav} = page as PageNode;
    if (nav && !ignoreNav) {
      _.each(nav.items, navItem => {
        _.each(navItem.requirements, navReq => {
          if (navReq.plan?.version === current) {
            isCurrent = true;
            if (!linkPageToReq) {
              return false;
            }
            getReqPages(navReq).push(page);
          }
        })
        if (isCurrent && !linkPageToReq) {
          return false;
        }
      });
    }
  }
  return isCurrent;
}