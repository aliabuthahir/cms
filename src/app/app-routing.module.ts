import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GalleryComponent} from './gallery/gallery.component';
import {AuthenticationGaurdService} from '../services/authenticationGaurd.service';
import {UploadComponent} from './upload/upload.component';
import {ImageDetailComponent} from './image-detail/image-detail.component';
import {LoginComponent} from './login/login.component';

const routes: Routes = [
  {path: 'sign', component: LoginComponent, outlet: 'side-nav' },
  {path: '', redirectTo: 'gallery', pathMatch: 'full'},
  {path: 'gallery', component: GalleryComponent, outlet: 'side-nav'},
  {path: 'upload', component: UploadComponent, outlet: 'side-nav'},
  {path: 'image/:id', component: ImageDetailComponent, canActivate: [AuthenticationGaurdService], outlet: 'side-nav'}
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
