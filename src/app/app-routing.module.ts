import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopGuard } from './guards/shop.guard';
import { HomeGuard } from './guards/home.guard';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { LoginComponent } from './pages/login/login.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { ShopComponent } from './pages/shop/shop.component';
import { SignupComponent } from './pages/signup/signup.component';

const routes: Routes = [
  {
    path:'',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path:'home',
    component:HomepageComponent,
    canActivate: [HomeGuard],
  },
  {
    path:'shop',
    canActivate: [ShopGuard],
    children:[
      {
        path:'',
        component:ShopComponent,
      },
      {
        path:'product/:id',
        component:ProductDetailComponent
      }
    ]
  },
  {
    path:'signup',
    component:SignupComponent
  },
  {
    path:'login',
    component:LoginComponent
  },
/*   {
    path:'**',
    redirectTo:'/home'
  } */
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
