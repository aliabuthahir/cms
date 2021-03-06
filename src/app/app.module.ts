import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

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
  MatSnackBarModule,
  MatCardModule,
  MatMenuModule,
  MatBottomSheetModule
} from '@angular/material';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatInputModule} from '@angular/material/input';
import {GalleryComponent} from './gallery/gallery.component';
import {ImageDetailComponent} from './image-detail/image-detail.component';
import {LoginComponent} from './login/login.component';
import {UploadComponent} from './upload/upload.component';
import {AuthenticationGaurdService} from '../services/authenticationGaurd.service';
import {AuthenticationService} from '../services/authentication.service';
import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {environment} from '../environments/environment';
import {AngularFireStorageModule} from '@angular/fire/storage';
import { Pagenotfound404Component } from './pagenotfound404/pagenotfound404.component';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import { DropDirective } from '../directives/drop.directive';
import { UploadTaskComponent } from './upload/upload-task/upload-task.component';
import { UploaderComponent } from './upload/uploader/uploader.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { InfoCardComponent } from './common/info-card/info-card.component';
import { InfoTitleComponent } from './common/info-title/info-title.component';
import {TextFirstpartPipe} from '../pipes/text-firstpart.pipe';
import {FileSizePipe} from '../pipes/file-size.pipe';
import {TextLastpartPipe} from '../pipes/text-lastpart.pipe';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FileTrimmerPipe } from '../pipes/file-trimmer.pipe';
import {MatChipsModule} from '@angular/material/chips';
import { ScrollListenerDirective } from '../directives/scroll-listener.directive';
import { LoadSpinnerComponent } from './common/load-spinner/load-spinner.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTreeModule} from '@angular/material/tree';
import {ScrollingModule} from "@angular/cdk/scrolling";

@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    GalleryComponent,
    ImageDetailComponent,
    LoginComponent,
    UploadComponent,
    Pagenotfound404Component,
    DropDirective,
    UploadTaskComponent,
    UploaderComponent,
    FileSizePipe,
    TextFirstpartPipe,
    TextLastpartPipe,
    InfoCardComponent,
    InfoTitleComponent,
    FileTrimmerPipe,
    ScrollListenerDirective,
    LoadSpinnerComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ScrollingModule,
    BrowserAnimationsModule,
/*
    NgbModule,
*/
    FormsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatSnackBarModule,
    MatCardModule,
    MatProgressBarModule,
    MatInputModule,
    MatMenuModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatBottomSheetModule,
    MatChipsModule,
    MatGridListModule,
    MatSlideToggleModule,
    MatTreeModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule
  ],
   providers: [AuthenticationGaurdService,
    AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
