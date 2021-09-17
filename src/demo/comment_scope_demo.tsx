import {Component} from "react";
import {ComponentComment, EnableCommentScope} from "../lib/components/comment_def";

interface ComponentWithScopedCommentProps {
}

interface ComponentWithScopedCommentState {
}

export class ComponentWithScopedComment extends Component<ComponentWithScopedCommentProps, ComponentWithScopedCommentState> {
  constructor(props: ComponentWithScopedCommentProps) {
    super(props);
  }

  render() {
    return (
      <>
        <ComponentComment comments={{v202106: 'This is a comment under a "foo-scope" limit'}}
                          scope='foo-scope'>
          <p>
            This is a paragraph with a inner comment with a scope <code>'foo-scope'</code>.
          </p>
        </ComponentComment>
        <ComponentComment comments={{v202106: 'This is a comment under a "bar-scope" limit'}}
                          scope='bar-scope'>
          <p>
            This is a paragraph with a inner comment with a scope <code>'bar-scope'</code>.
          </p>
        </ComponentComment>
      </>
    );
  }
}


interface CommentScopeDemoProps {
}

interface CommentScopeDemoState {
}

export class CommentScopeDemo extends Component<CommentScopeDemoProps, CommentScopeDemoState> {
  constructor(props: CommentScopeDemoProps) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Scoped Comment Demo</h1>
        <h2>Comments won't show:</h2>
        <ComponentWithScopedComment/>
        <h2>Comment under "foo-scope" will show:</h2>
        <EnableCommentScope scope='foo-scope'>
          <ComponentWithScopedComment/>
        </EnableCommentScope>
        <h2>Comment under "bar-scope" will show:</h2>
        <EnableCommentScope scope='bar-scope'>
          <ComponentWithScopedComment/>
        </EnableCommentScope>
        <h2>Both comments will show:</h2>
        <EnableCommentScope scope='foo-scope'>
          <EnableCommentScope scope='bar-scope'>
            <ComponentWithScopedComment/>
          </EnableCommentScope>
        </EnableCommentScope>
      </div>
    );
  }
}
