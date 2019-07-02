import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';

import List from './List';

const Todo = () => {
  const [todoName, setTodoName] = useState('');
  const [submittedTodo, setSubmittedTodo] = useState(null);

  const todoListReducer = (state, action) => {
    switch (action.type) {
      case 'SET':
        return action.payload;
      case 'ADD':
        return state.concat(action.payload);
      case 'REMOVE':
        return state.filter(todo => todo.id !== action.payload);

      default:
        return state;
    }
  };

  const [todoList, dispatch] = useReducer(todoListReducer, []);

  useEffect(() => {
    axios
      .get('https://blog-agallio.firebaseio.com/todos.json')
      .then(res => {
        console.log(res);
        const todoData = res.data;
        const todos = [];
        for (const key in todoData) {
          todos.push({ id: key, name: todoData[key].name });
        }
        dispatch({ type: 'SET', payload: todos });
      })
      .catch(err => console.log(err));
    return () => {
      console.log('Cleanup');
    };
  }, []);

  useEffect(() => {
    if (submittedTodo) {
      dispatch({ type: 'ADD', payload: submittedTodo });
    }
  }, [submittedTodo]);

  const inputOnChange = event => {
    setTodoName(event.target.value);
  };

  const onAddTodo = () => {
    axios
      .post('https://blog-agallio.firebaseio.com/todos.json', {
        name: todoName
      })
      .then(res => {
        console.log(res);
        setTimeout(() => {
          const todoItem = { id: res.data.name, name: todoName };
          setSubmittedTodo(todoItem);
        }, 3000);
      })
      .catch(err => console.log(err));
  };

  const onRemoveTodo = todoId => {
    axios
      .delete(`https://blog-agallio.firebaseio.com/todos/${todoId}.json`)
      .then(res => {
        console.log(res);
        dispatch({ type: 'REMOVE', payload: todoId });
      })
      .catch(err => console.log(err));
  };

  return (
    <React.Fragment>
      <input
        type="text"
        placeholder="Todo"
        value={todoName}
        onChange={inputOnChange}
      />
      <button type="button" onClick={onAddTodo}>
        Add
      </button>
      <List items={todoList} onClick={onRemoveTodo} />
    </React.Fragment>
  );
};

export default Todo;
