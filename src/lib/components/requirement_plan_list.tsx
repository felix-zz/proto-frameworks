import React, {Component, CSSProperties} from 'react';
import {PriorityLevel, Requirement, RequirementGroup, RequirementPlan} from './requirement_def';
import {MinusSquareOutlined, PlusSquareOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';
import * as _ from 'lodash';

interface PlanExt extends RequirementPlan {
    expanded?: boolean;
    groups: GroupExt[];
}

interface GroupExt extends RequirementGroup {
    expanded?: boolean;
}

interface RequirementPlanListProps {
    plans: RequirementPlan[];
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
                gs.map(g => _.assign({}, g, {expanded} as GroupExt));
            return _.assign({}, p, {expanded, groups} as PlanExt);
        });
    }

    render() {
        const {plans} = this.state;
        return (
            <div className='proto-frameworks' style={{width: '900px'}}>
                <h2>需求计划列表</h2>
                {!!plans && plans.map(plan => {
                    const {expanded, title, key, groups} = plan;
                    return (
                        <div key={key} className='bottom-margin-sm'>
                            <div style={{fontSize: '16px', lineHeight: '30px', cursor: 'pointer'}}
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
                                {title}
                            </div>
                            {!!expanded && !!groups && (
                                <div className='left-margin'>
                                    {groups.map(group => {
                                        const {key: gk, title: gt, expanded: ge, requirements} = group;
                                        return (
                                            <React.Fragment key={gk}>
                                                <div style={{fontSize: '16px', lineHeight: '30px', cursor: 'pointer'}}
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
                                                </div>
                                                {!!ge && !!requirements && !!requirements.length && requirements.map(req => {
                                                    return (
                                                        <div key={req.key}
                                                             style={{fontSize: '14px', lineHeight: '24px'}}
                                                             className='left-margin'>
                                                            <Link to={linkOfReq(req)}>
                                                                <ReqPriority priority={req.priority}/>{' '}{req.title}
                                                            </Link>
                                                        </div>
                                                    );
                                                })}
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
        switch (this.props.priority) {
            case 1:
                color = '#990000';
                text = '①';
                break;
            case 2:
                color = '#cc9900';
                text = '②';
                break;
            case 3:
                color = '#3388cc';
                text = '③';
                break;
            default:
                color = '#008800';
                text = '④';
                break;
        }
        return (
            <span style={_.assign({color: color}, style)} className={className}>{text}</span>
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
                <div>
                    <Link to='/__plan'>计划</Link>
                    {' / '}
                    {requirement.group.plan.title}
                    {' / '}
                    {requirement.group.title}
                </div>
                <h1><ReqPriority priority={requirement.priority}/>{' '}{requirement.title}</h1>
                {requirement.renderContent()}
            </div>
        );
    }
}

