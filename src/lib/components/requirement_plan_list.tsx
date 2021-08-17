import React, {Component, ReactNode} from 'react';
import {linkOfReq, ReqPriority, Requirement, RequirementGroup, RequirementPlan} from './requirement_def';
import {FileOutlined, MinusSquareOutlined, PlusSquareOutlined, RightOutlined, UpOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';
import * as _ from 'lodash';
import {Util} from '../util/util';
import {checkPageIsCurrent, PageNavItem, PageNode} from "./page_def";

interface PlanExt extends RequirementPlan {
  expanded?: boolean;
  groups: GroupExt[];
}

interface GroupExt extends RequirementGroup {
  expanded?: boolean;
  requirements: ReqExt[];
}

interface ReqExt extends Requirement {
  expanded?: boolean;
}

interface RequirementPlanListProps {
  currentVersion: string;
  plans: RequirementPlan[];
  renderPlanTools?: (plan: RequirementPlan) => ReactNode;
}

interface RequirementPlanListState {
  plans: PlanExt[];
}

export class RequirementPlanList extends Component<RequirementPlanListProps, RequirementPlanListState> {
  constructor(props: RequirementPlanListProps) {
    super(props);
    this.state = {plans: this.initPlans()};
  }

  initPlans(): PlanExt[] {
    const {plans} = this.props;
    if (!plans) {
      return [];
    }
    return plans.map((p, i) => {
      const expanded = i === 0;
      const {groups: gs} = p;
      const groups: GroupExt[] = !gs ? [] :
        gs.map(g => {
          let req: ReqExt[];
          if (g.requirements) {
            req = g.requirements.map(r => _.assign({}, r, {expanded: false}));
          }
          return _.assign({}, g, {expanded, requirements: req} as GroupExt);
        });
      return _.assign({}, p, {expanded, groups} as PlanExt);
    });
  }

  render() {
    const {plans} = this.state;
    const {renderPlanTools, currentVersion} = this.props;
    return (
      <div className='proto-frameworks' style={{width: '900px'}}>
        <h2>需求计划列表</h2>
        {!!plans && plans.map(plan => {
          const {expanded, title, key, groups, version} = plan;
          return (
            <div key={key} className='bottom-margin-sm'>
              <div className='req-item'>
                <Util.A className='plain-text'
                        onClick={() => {
                          plan.expanded = !expanded;
                          this.setState({});
                        }}>
                  <span className='text-grey right-margin-sm'>
                    {expanded ? (
                      <MinusSquareOutlined/>
                    ) : (
                      <PlusSquareOutlined/>
                    )}
                  </span>
                  <span className='req-tag right-margin-sm'>{version}</span>
                  <span className='right-margin'>{title}</span>
                </Util.A>
                {!!renderPlanTools && renderPlanTools(plan)}
              </div>
              {!!expanded && !!groups && (
                <div className='left-margin-lg'>
                  {groups.map(group => {
                    const {key: gk, title: gt, expanded: ge, requirements} = group;
                    return (
                      <React.Fragment key={gk}>
                        <div className='req-item'>
                          <Util.A className='plain-text'
                                  onClick={() => {
                                    group.expanded = !ge;
                                    this.setState({});
                                  }}>
                            <span className='text-grey right-margin-sm'>
                              {ge ? (
                                <MinusSquareOutlined/>
                              ) : (
                                <PlusSquareOutlined/>
                              )}
                            </span>
                            {gt}
                          </Util.A>
                        </div>
                        <div className='left-margin-lg'>
                          {!!ge && !!requirements && !!requirements.length && requirements.map(req => {
                            const {expanded: re, pages} = req;
                            return (
                              <React.Fragment key={req.key}>
                                <div className='req-item'>
                                  <Link to={linkOfReq(req)}>
                                    <ReqPriority className='req-priority' priority={req.priority}/>
                                    {' '}{req.title}
                                  </Link>
                                  {!!pages && !!pages.length && (
                                    <Util.A className='left-margin' onClick={() => {
                                      req.expanded = !re;
                                      this.setState({});
                                    }}>
                                      {re ? '收起页面 ' : '展开页面 '}
                                      {re ? <UpOutlined/> : <RightOutlined/>}
                                    </Util.A>
                                  )}
                                </div>
                                {!!re && !!pages && pages.map(p => {
                                  const node = p as PageNode;
                                  const {link, name, nav} = node;
                                  if (!nav || !nav.items || !nav.items.length) {
                                    return (
                                      <div key={link}
                                           className='left-margin-lg req-item'>
                                        <Link to={link}>
                                          <FileOutlined className='text-grey'/>
                                          {' '}{name}
                                        </Link>
                                      </div>
                                    )
                                  }
                                  const temp: PageNavItem[] = [];
                                  if (checkPageIsCurrent(p, currentVersion, false, true)) {
                                    temp.push({link: link, name: nav.defaultTitle});
                                  }
                                  nav.items.forEach((item, i) => {
                                    if (checkPageIsCurrent(item, currentVersion)) {
                                      temp.push({link: link + '/' + i, name: item.name});
                                    }
                                  });
                                  if (!temp.length) {
                                    return null;
                                  }
                                  return (
                                    <div key={link}
                                         className='left-margin-lg req-item'>
                                      <Link to={temp[0].link}>
                                        <FileOutlined className='text-grey'/>
                                        {' '}{name}{': ' + temp[0].name}
                                      </Link>
                                      {temp.map((t, i) => {
                                        if (i === 0) {
                                          return null;
                                        }
                                        return (
                                          <React.Fragment key={i}>
                                            {' | '}
                                            <Link to={t.link}>{t.name}</Link>
                                          </React.Fragment>
                                        )
                                      })}
                                    </div>
                                  )
                                })}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </React.Fragment>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    );
  }
}

interface RequirementContentProps {
  requirement: Requirement;
}

interface RequirementContentState {
}

export class RequirementContent extends Component<RequirementContentProps, RequirementContentState> {
  constructor(props: RequirementContentProps) {
    super(props);
  }

  render() {
    const {requirement} = this.props;
    return (
      <div>
        <div className='proto-frameworks proto-requirement'>
          <div className='requirement-head'>
            <div className='requirement-priority'>
              <ReqPriority priority={requirement.priority}/>
            </div>
            <div className='requirement-title'>
              <div className='req-main-title'>
                {requirement.title}
              </div>
              <div className='req-sub-title'>
                <Link to='/__plan'>所有计划</Link>
                {' / '}
                {requirement.group.plan.title}
                {' / '}
                {requirement.group.title}
              </div>
            </div>
          </div>
        </div>
        {requirement.renderContent()}
      </div>
    );
  }
}

