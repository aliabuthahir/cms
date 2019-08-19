import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SideNavComponent} from './side-nav/side-nav.component';
import {LayoutModule} from '@angular/cdk/layout';
import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatSnackBarModule
} from '@angular/material';
import {GalleryComponent} from './gallery/gallery.component';
import {ImageDetailComponent} from './image-detail/image-detail.component';
import {LoginComponent} from './login/login.component';
import {UploadComponent} from './upload/upload.component';
import {AuthenticationGaurdService} from "../services/authenticationGaurd.service";
import {AuthenticationService} from "../services/authentication.service";
import {ImageService} from "../services/image.service";
import {UploadService} from "../services/upload.service";
import {AngularFireModule} from "@angular/fire";
import {AngularFireDatabaseModule} from "@angular/fire/database";
import {AngularFireAuthModule} from "@angular/fire/auth";
import {environment} from "../environments/environment";

@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    GalleryComponent,
    ImageDetailComponent,
    LoginComponent,
    UploadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatSnackBarModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [AuthenticationGaurdService,
    AuthenticationService,
    ImageService,
    UploadService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
