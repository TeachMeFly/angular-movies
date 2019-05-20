import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemsListComponent } from './items-list/items-list.component';
import { ItemPageComponent } from './item-page/item-page.component';

const routes: Routes = [
  {
    path: '',
    component: ItemsListComponent,
  },
  {
    path: 'movie/:id',
    component: ItemPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
