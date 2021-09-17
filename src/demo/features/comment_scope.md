# New Feature: Comments with Scope

> Since Version 0.1.28

Comments now have a new optional property named `scope`.

## When `scope` is unset

Nothing is different.

## When `scope` is a certain value

This comment will show only if it is under
an `<EnableCommentScope>` component, with a corresponding
`scope` props value. For example:

```jsx
<div>
  <EnableCommentScope scope='foo-scope'>
    <ComponentComment scope='foo-scope'>
      <span>This comment will show.</span>
    </ComponentComment>
    <ComponentComment scope='bar-scope'>
      <span>This comment won't show.</span>
    </ComponentComment>
    <EnableCommentScope scope='bar-scope'>
      <ComponentComment scope='bar-scope'>
        <span>This comment will show.</span>
      </ComponentComment>
    </EnableCommentScope>
    <ComponentComment>
      <span>
        This comment will show because is doesn't have a
        scope limit.
      </span>
    </ComponentComment>
  </EnableCommentScope>
  <ComponentComment scope='foo-scope'>
    <span>This comment won't show.</span>
  </ComponentComment>
</div>
```