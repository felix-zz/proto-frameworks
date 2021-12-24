import * as React from 'react';
import {Component} from 'react';
import {ComponentComment} from '../lib/components/comment_def';
import {createRequirement} from "../lib/components/requirement_def";

interface DemoModuleIndexProps {
}

interface DemoModuleIndexState {
}

export const usingRequirementComments = createRequirement('reqComment', 'Using requirementComments.', 1, () => 'Hi.');
export const multipleReqDemo = createRequirement('multipleReqDemo', 'Multiple requirements for one element demo.', 3, () => 'Hi.');

class DemoModuleIndex extends Component<DemoModuleIndexProps, DemoModuleIndexState> {
  constructor(props: DemoModuleIndexProps) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Hello, World!</h1>
        <ComponentComment comments={{
          v202106: 'This is a demo comment for your product',
          v202105: 'This is an expired comment.',
        }} position='left'>
          <p>This the demo index for Proto Frameworks.</p>
        </ComponentComment>
        <p>
          After Version 0.1.25, comments with requirement feature was released.
          There is no need to use the deprecated <code>comments</code> property of ComponentComment and
          specify a version for each comment content.
          Instead, assign a comment to a requirement in <code>requirementComments</code> will be much more
          pleasant, which allows you to migrate a requirement to another plan with a new version without
          modify every single comment in the page!
        </p>
        <p>
          <ComponentComment requirementComments={[{
            requirement: usingRequirementComments,
            content: 'This is a demo comment using requirementComments.',
          }, {
            requirement: multipleReqDemo,
            content: 'Another requirement for this element.',
          }]}>
            <strong>This is a demo comment using <code>requirementComments</code>.</strong>
          </ComponentComment>
        </p>
        <p>
          <ComponentComment plainContent={false} width={350} requirementComments={[{
            requirement: usingRequirementComments,
            content: (
              <span>A comment without default <strong style={{color: '#900'}}>style</strong>.</span>
            )
          }]}>
            <span>This is a comment without style. Set <code>plainContent</code> to false and <code>width</code> to
              a preferred value.</span>
          </ComponentComment>
        </p>
        <ComponentComment position='left' disableCover={true} comments={{
          v202106: 'A comment without a hotspot cover.'
        }}>
          <p>
            This is a comment without a hotspot cover. Set <code>disableCover</code> to <code>true</code>.
          </p>
        </ComponentComment>
      </div>
    );
  }
}

export default DemoModuleIndex;