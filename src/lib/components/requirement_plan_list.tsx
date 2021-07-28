import React, {Component, ReactNode} from 'react';
import {ReqPriority, Requirement, RequirementGroup, RequirementPlan} from './requirement_def';
import {FileOutlined, MinusSquareOutlined, PlusSquareOutlined, RightOutlined, UpOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';
import * as _ from 'lodash';
import {Util} from '../util/util';

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
  plans: RequirementPlan[];
  renderPlanTools?: (plan: RequirementPlan) => ReactNode;
}

interface RequirementPlanListState {
  plans: PlanExt[];
}

export const linkOfReq = (req: Requirement) => (
  '/__plan/' + req.group.plan.key + '/' + req.group.key + '/' + req.key
)

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
    const {renderPlanTools} = this.props;
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
                                  return (
                                    <div key={p.link}
                                         className='left-margin-lg req-item'>
                                      <Link to={p.link}>
                                        <FileOutlined className='text-grey'/>
                                        {' '}{p.name}
                                      </Link>
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

