import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GalleryComponent} from './gallery/gallery.component';
import {AuthenticationGaurdService} from '../services/authenticationGaurd.service';
import {UploadComponent} from './upload/upload.component';
import {ImageDetailComponent} from './image-detail/image-detail.component';
import {LoginComponent} from './login/login.component';

const routes: Routes = [
  {
    path: '',
    component: GalleryComponent,
    canActivate: [AuthenticationGaurdService],
    pathMatch: 'full'
  },
  {path: 'sign-in',
    component: LoginComponent},
  {path: 'gallery',
    component: GalleryComponent},
  {path: 'upload',
    component: UploadComponent},
  {path: 'image/:id',
    component: ImageDetailComponent,
    canActivate: [AuthenticationGaurdService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
