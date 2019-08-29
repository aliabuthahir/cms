import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GalleryComponent} from './gallery/gallery.component';
import {AuthenticationGaurdService} from '../services/authenticationGaurd.service';
import {UploadComponent} from './upload/upload.component';
import {ImageDetailComponent} from './image-detail/image-detail.component';
import {LoginComponent} from './login/login.component';
import {Pagenotfound404Component} from "./pagenotfound404/pagenotfound404.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'gallery',
    pathMatch: 'full'
  },
  {path: 'signin',
    component: LoginComponent},
  {path: 'gallery',
    component: GalleryComponent,
    canActivate: [AuthenticationGaurdService]},
  {path: 'upload',
    component: UploadComponent,
    canActivate: [AuthenticationGaurdService]},
  {path: 'image/:id',
    component: ImageDetailComponent,
    canActivate: [AuthenticationGaurdService]},
  {path: '**',
    component: Pagenotfound404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
