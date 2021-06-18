import * as React from 'react';
import {Component, ReactNode} from 'react';
import * as _ from 'lodash';

interface StatusOp {
    name: string;
    info?: ReactNode;
    acl?: string;
}

interface StatusItem {
    name: string;
    info?: ReactNode;
    ops?: StatusOp[];
}

interface StatusTableProps {
    statusList: StatusItem[];
}

export class StatusTable extends Component<StatusTableProps, {}> {
    constructor(props: StatusTableProps) {
        super(props);
    }

    render() {
        const rows: ReactNode[] = [];
        _.each(this.props.statusList, (row => {
            const {name, ops, info} = row;
            _.each(ops, ((op, j) => {
                const cols = [];
                if (j === 0) {
                    cols.push(<td key='name' rowSpan={ops.length || 1}>
                        {name}
                        {!!info && (
                            <React.Fragment>
                                <br/>
                                <span className='text-grey'>{info}</span>
                            </React.Fragment>
                        )}
                    </td>)
                }
                cols.push(<td key='op'>
                    <div style={{width: '90px'}}>{op.name}</div>
                </td>);
                cols.push(<td key='info' className='line-wrap'>{op.info}</td>);
                cols.push(<td key='acl'>{op.acl}</td>);
                rows.push((<tr key={rows.length.toString()}>{cols}</tr>));
            }));
        }));
        const a = {border: '1'};
        return (
            <table className='status-table' {...a}>
                <thead>
                <tr>
                    <th><span style={{width: '50px'}}>状态</span></th>
                    <th><span style={{width: '100px'}}>操作</span></th>
                    <th><span style={{width: '120px'}}>操作说明</span></th>
                    <th><span style={{width: '80px'}}>权限</span></th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </table>
        );
    }
}