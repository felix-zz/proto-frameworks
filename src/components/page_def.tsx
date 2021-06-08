import * as React from 'react';
import {ComponentType} from 'react';
import {StringMap} from '../util/string_map';

export interface PageNavItem {
    name: string;
    element?: ComponentType;
    props?: StringMap<any>;
    ver?: string;
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

const allProducts: StringMap<PageNode> = {};

export const addProduct = (key: string, root: PageNode): void => {
    allProducts[key] = root;
};

export const getAllProducts = (): StringMap<PageNode> => allProducts;
