import {Component} from 'react';
import {ComponentComment} from '../lib/components/comment_def';
import {createRequirement} from '../lib/components/requirement_def';

export const expiredRequirementDemo = createRequirement('expiredRequirementDemo', 'Expired Requirement Demo', 2, () => 'Hello, this is an expired requirement.');

interface ExpiredPageDemoProps {
}

interface ExpiredPageDemoState {
}

export class ExpiredPageDemo extends Component<ExpiredPageDemoProps, ExpiredPageDemoState> {
  constructor(props: ExpiredPageDemoProps) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>This is an expired page.</h1>
        <p>
          This page should be invisible in the sidebar by default.
        </p>
        <p>
          If user unchecks 「页面」 option above, this page should be listed.
        </p>
        <ComponentComment requirementComments={[
          {requirement: expiredRequirementDemo, content: 'Demo for an expired requirement.'}
        ]}>
          <p>
            This is an expired comment demo. Uncheck the 「注释」 option above and you should see the comment.
          </p>
        </ComponentComment>
      </div>
    );
  }
}
