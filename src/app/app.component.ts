import { Component, OnInit } from '@angular/core';

import { JsonPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterOutlet } from '@angular/router';
import { Todo } from './model/todo.model';
import { TodosListComponent } from './todos-list/todos-list.component';
import { TodosStore } from './store/todo.store';
import { inject } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe, TodosListComponent, MatProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    TodosStore, // Provide the SignalStore here
  ],
})

export class AppComponent implements OnInit {
  title = 'ToDoApp';
  store = inject(TodosStore);

  // Define the type of the 'todos' property
  todos: Todo[] = []; 
  ngOnInit(): void {
    // The load of data return a Promise so 
    // we add a .then() to see the promise has been resolved
    this.loadTodos().then(() => console.log('Todos Loaded'))
  }

  // async method to load our data into the store where 
  // we call our todos using the async method behaviour of our store
  async loadTodos(){
    await this.store['loadAll']();
  }
}

