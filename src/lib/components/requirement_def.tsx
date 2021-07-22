import {ReactNode} from 'react';
import {PageNavItem} from './page_def';

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
  pages?: PageNavItem[];
}

export interface RequirementPlan {
  key: string;
  title: string;
  prototypeAddress: string;
  version: string;
  groups: RequirementGroup[];
}

export const createRequirement =
  (key: string, title: string, priority: PriorityLevel, renderContent: () => ReactNode): Requirement => ({
    key, title, priority, renderContent,
  });

export const createRequirementGroup = (key: string, title: string, requirements: Requirement[]): RequirementGroup => ({
  key, title, requirements,
});

export const createRequirementPlan =
  (key: string, title: string, version: string, groups: RequirementGroup[], protoAddress?: string): RequirementPlan => ({
    key, title, version, groups, prototypeAddress: protoAddress,
  });
