import React, {Component, CSSProperties, ReactNode} from 'react';
import {PageNavItem} from './page_def';
import * as _ from "lodash";

export interface RequirementGroup {
  key: string;
  title: string;
  requirements: Requirement[];
  moduleName?: string;
  plan?: RequirementPlan;
}

export type PriorityLevel = 1 | 2 | 3 | 4;
export type RequirementContentLink = string;

export interface Requirement {
  key: string;
  title: string;
  priority: PriorityLevel;
  renderContent: (() => ReactNode) | RequirementContentLink;
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
  (key: string, title: string, priority: PriorityLevel, renderContent: (() => ReactNode) | RequirementContentLink): Requirement => ({
    key, title, priority, renderContent,
  });

export const createRequirementGroup = (key: string, title: string, requirements: Requirement[]): RequirementGroup => ({
  key, title, requirements,
});

export const createRequirementPlan =
  (key: string, title: string, version: string, groups: RequirementGroup[], protoAddress?: string): RequirementPlan => ({
    key, title, version, groups, prototypeAddress: protoAddress,
  });

interface ReqPriorityProps {
  priority: PriorityLevel;
  style?: CSSProperties;
  className?: string;
}

interface ReqPriorityState {
}

export class ReqPriority extends Component<ReqPriorityProps, ReqPriorityState> {
  constructor(props: ReqPriorityProps) {
    super(props);
  }

  render() {
    const {priority, className, style} = this.props;
    let color: string;
    let text: string;
    switch (priority) {
      case 1:
        color = '#bb0000';
        text = '①';
        break;
      case 2:
        color = '#ecb000';
        text = '②';
        break;
      case 3:
        color = '#3399dd';
        text = '③';
        break;
      default:
        color = '#009f00';
        text = '④';
        break;
    }
    return (
      <span style={_.assign({color: color}, style)} className={className}>{text}</span>
    );
  }
}

export const linkOfReq = (req: Requirement) => (
  '/__plan/' + req.group.plan.key + '/' + req.group.key + '/' + req.key
)