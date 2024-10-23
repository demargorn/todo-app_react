import React, { Component } from 'react';

import AppHeader from './app-header';
import SearchPanel from './search-panel';
import TodoList from './todo-list';
import ItemStatusFilter from './item-status-filter';
import ItemAddForm from './item-add-form';
import './app.css';

export default class App extends Component {
   maxId = 100;

   state = {
      todoData: [
         this.createTask('Drink coffee'),
         this.createTask('Learn React'),
         this.createTask('Build React App'),
      ],
      term: '',
      filter: 'active',
   };

   createTask(label) {
      return {
         label: label,
         important: false,
         done: false,
         id: this.maxId++,
      };
   }

   addTask = (text) => {
      const newTask = this.createTask(text);
      this.setState(({ todoData }) => {
         // создаем новый массив с новым task
         const newArr = [...todoData, newTask];
         // ! возвращаем новый state
         return {
            todoData: newArr,
         };
      });
   };

   deleteTask = (id) => {
      this.setState(({ todoData }) => {
         const idx = todoData.findIndex((item) => item.id === id);
         // создаем новый массив с вырезанным task
         const newArr = [...todoData.slice(0, idx), ...todoData.slice(idx + 1)];
         // ! возвращаем новый state
         return {
            todoData: newArr,
         };
      });
   };

   toggleProperty(arr, id, propName) {
      const idx = arr.findIndex((item) => item.id === id);
      // обновляем объект task
      const oldItem = arr[idx];
      const newItem = { ...oldItem, [propName]: !oldItem[propName] };
      // добавляем объект в массив не изменяя старый
      return [...arr.slice(0, idx), newItem, ...arr.slice(idx + 1)];
   }

   onToggleImportant = (id) => {
      this.setState(({ todoData }) => {
         // ! возвращаем новый state
         return {
            todoData: this.toggleProperty(todoData, id, 'important'),
         };
      });
   };

   onToggleDone = (id) => {
      this.setState(({ todoData }) => {
         // ! возвращаем новый state
         return {
            todoData: this.toggleProperty(todoData, id, 'done'),
         };
      });
   };

   search(items, term) {
      if (term.length === 0) {
         return items;
      }
      return items.filter(
         (item) => item.label.toLowerCase().indexOf(term.toLowerCase()) > -1
      );
   }

   onSearchChange = (term) => {
      this.setState({ term });
   };

   onFilterChange = (filter) => {
      this.setState({ filter });
   };

   filter(items, filter) {
      switch (filter) {
         case 'all':
            return items;
         case 'active':
            return items.filter((item) => !item.done);
         case 'done':
            return items.filter((item) => item.done);
         default:
            return items;
      }
   }

   render() {
      const { todoData, term, filter } = this.state;
      const visibleTasks = this.filter(this.search(todoData, term), filter);
      const doneCount = todoData.filter((task) => task.done).length;
      const todoCount = todoData.length - doneCount;

      return (
         <div className='todo-app'>
            <AppHeader toDo={todoCount} done={doneCount} />
            <div className='top-panel d-flex'>
               <SearchPanel onSearchChange={this.onSearchChange} />
               <ItemStatusFilter
                  filter={filter}
                  onFilterChange={this.onFilterChange}
               />
            </div>
            <TodoList
               todos={visibleTasks}
               onDeleted={this.deleteTask}
               onToggleImportant={this.onToggleImportant}
               onToggleDone={this.onToggleDone}
            />
            <ItemAddForm onAdded={this.addTask} />
         </div>
      );
   }
}
