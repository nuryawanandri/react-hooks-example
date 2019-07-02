import React from 'react';

const List = props => (
  <ul>
    {props.items.map(todo => (
      <li key={todo.id} onClick={() => props.onClick(todo.id)}>
        {todo.name}
      </li>
    ))}
  </ul>
);

export default List;
