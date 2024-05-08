import { Component, viewChild } from '@angular/core';
import { MatButtonToggle, MatButtonToggleChange, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatListOption, MatSelectionList, } from '@angular/material/list';
import { TodosFilter, TodosStore } from '../store/todo.store';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { NgStyle } from '@angular/common';
import { effect } from '@angular/core';
import { inject } from '@angular/core';

// import { ReactiveFormsModule } from '@angular/forms';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';

@Component({
  selector: 'todos-list',
  standalone: true,
  imports: [
    MatFormField, 
    MatLabel, 
    MatInput, 
    MatIcon, 
    MatSuffix, 
    MatButtonToggle,
    MatButtonToggleModule,
    MatSelectionList,
    MatListOption,
    // CommonModule,
    // ReactiveFormsModule,
    // FormsModule,
    NgStyle
    
  ],
  templateUrl: './todos-list.component.html',
  styleUrl: './todos-list.component.scss'
})
export class TodosListComponent {
store = inject(TodosStore);

// Set the value of the toggle button using
// Signal Based View Child Template Query
// to grab a refence to this toggle button and set its value
// with the value of the store
// Name our button: filter and give it the value of a
// viewChild() signal base query - the equivalent of the @viewchild decorator
// this signal based query will take in :
// - the type of the toggle button which is a MathButtonToggleGroup
// So, we create here a signal that emits his values to this button
// MatButtonToggleGroup
// we use .required so the type of the button will be only MatButtonToggleGroup
// and not Undefined also
filter = viewChild.required(MatButtonToggleGroup);

// Now, in the constructor we will create a Signal Side Effect
// effect() so we be notified whenever this filter signal emits a value
// and the emitted value will be the Button itself and we use this button
// to set the value of the Toggle Button as a constantant named 
// 'filter'
// We will access the filter signal and invoke it: this.filter();
// const filter = this.filter

constructor() {
  
  effect(() => {
    // define the filter button
    const filter = this.filter();
    // set the value of the filter using filter.value
    // where we access the store 'this.store' and then we call /invoke
    // the filter signal to get it's value. 'filter()'
    filter.value = this.store.filter();
  })
}


// Implement the 'enter' event handler function that will help the user
// to write the title of a new todo into the input field and then 
// hit enter and save the todo in the backend and also display it 
// on our frontend store.
// the method will take a title value of type string and will return
// a new Promise with our new todo
async onAddTodo(title: string) {
  // we await for the resolution of this promise and
  // then call the store addTodo() method and pass the title in
  // so we can add the todo
  await this.store.addTodo(title);
  
}

// Implement the click event for the deletion of a todo
// the method will take in the id of type string of an todo and 
// the mouse click event of type MouseEvent
// we added the event also because we don't want to click on the 
// todo line and accidently mark the todo as completed also
// by checking the check box for the state of the todo: completed, pending
async onDeleteTodo(id: string, event: MouseEvent) {
  // we call event.stopPropagation() so our click event for the deletion
  // of one todo , do not propagate also on the checklist we have for 
  // the state of the todo: completed, pending
  event.stopPropagation();
  // we call the store with the deleteTodo() method to delete
  // our todo
  await this.store.deleteTodo(id);
  
}

  // Implement the update event for the update of a todo
  // the function will take the id of the todo to update and the event
  // that will be the completed flag
  // we will call again the store with the updateTodo() function
  // to update the completed flag of the todo id we want.

  async onTodoToggled(id: string, completed: boolean) {
    await this.store.updateTodo(id, completed);
    
  }

  // Implement the 'change' event for the All, Pending, Completed buttons
  // using the (change) event and the event handler we will define here
  // onFilterTodos($event) that will take in the change that will happen - 
  // the 'event' option
  // There are no asynchronous operation here so we use a standard function
  onFilterTodos(event: MatButtonToggleChange) {
    // extract the filter value from the event using the 'as' alias
    // to tell Typescript that we know this is a 
    // TodosFilter Type
    const filter = event.value as TodosFilter;

    // call the store and then the updateFilter() and pass in our 'filter' parameter
    this.store.updateFilter(filter);

  }
}


