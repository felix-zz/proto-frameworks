import {ReactNode} from 'react';

export interface RequirementGroup {
    key: string;
    title: string;
    requirements: Requirement[];
    moduleName?: string;
    plan?: RequirementPlan;
}

export type PriorityLevel = 1 | 2 | 3 | 4;

export interface Requirement {
    key: string;
    title: string;
    priority: PriorityLevel;
    renderContent: () => ReactNode;
    group?: RequirementGroup;
    plan?: RequirementPlan;
}

export interface RequirementPlan {
    key: string;
    title: string;
    prototypeAddress: string;
    version: string;
    groups: RequirementGroup[];
}
