import {Component, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';
import * as firebase from 'firebase';
import {ImageModel} from '../../models/image.model';
import {ToolbarService} from '../../services/toolbar.service';
import {Observable, of, Subscription} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map, share} from 'rxjs/operators';
import {YearModel} from '../../models/year.model';
import {MonthsModel} from '../../models/months.model';
import {DateModel} from '../../models/date.model';
import {DataModel} from '../../models/data.model';
import {TreeDataModel} from '../../models/tree-data.model';
import {NestedTreeControl} from '@angular/cdk/tree';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent
  implements OnInit, OnDestroy, OnChanges {
  private images = new Array();
  private totalColumns = 2;
  private fileDeleteSubscription: Subscription;
  private handsetObserver: Subscription;

  private yearDictionary = new TreeDataModel('Archives');
  private months = ['Jan', 'Feb', 'March', 'Apr'
    , 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  private monthToMonthNumber = {
    Jan: 0, Feb: 1, March: 2, Apr: 3
    , May: 4, June: 5, July: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
  };

  private totalFilesRecieved = 0;
  private totalFilesProcessed = 0;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      share()
    );


  private treeController;
  getChildren = (node: DataModel) => of(node.children);

  constructor(private storage: AngularFireStorage,
              private db: AngularFirestore,
              private toolBarSvc: ToolbarService,
              private breakpointObserver: BreakpointObserver) {
    this.treeController = new NestedTreeControl(this.getChildren);
  }

  ngOnInit(): void {
    this.totalFilesRecieved = 0;
    this.totalFilesProcessed = 0;
    this.handsetObserver = this.isHandset$.subscribe(isHandSet => {
      isHandSet ? this.totalColumns = 1 : this.totalColumns = 2;
    });
    this.fileDeleteSubscription = this.toolBarSvc
      .fileDeleteCommunicator
      .subscribe(imageModel => {
        this.images.splice(this.images.indexOf(imageModel), 1);
      });


    const result = this.db
      .collection('uploads')
      .snapshotChanges()
      .subscribe(data =>{
        console.log('colletion-------------------');
        console.log(data);

      });
    this.loadImages();
  }

  ngOnDestroy(): void {
    this.fileDeleteSubscription.unsubscribe();
  }

  ngOnChanges(): void {
     this.loadImages();
  }

  loadImages() {
    const storageRef = firebase.storage().ref(`new_uploads`);
    storageRef.listAll().then(result => {
      console.log('datae size-------');
      console.log(result.items.length);
      this.totalFilesRecieved = result.items.length;
      result.items.forEach(imageRef => {
        // And finally display them
        imageRef.getDownloadURL().then(url => {
          // TODO: Display the image on the UI
          const imageModel = new ImageModel();
          imageModel.name = imageRef.name;
          imageModel.url = url;
          imageModel.fullPath = imageRef.fullPath;
          this.totalFilesProcessed++;

          const fileName = imageRef.name;
          const fileDate = fileName.substr(0, fileName.indexOf('_'));
          this.images.push(imageModel);
          const currentDate = new Date(fileDate);

          const year = currentDate.getFullYear().toString();
          const month = currentDate.getMonth();
          const date = currentDate.getDate().toString();
          let yearFound: YearModel;
/*
          console.log('firstyear....' + year);
          console.log('firstmonth....' + month);
          console.log('firstdate....' + date);
*/
          let yearsRecieved = this.yearDictionary.children;
          if (yearsRecieved) {
            yearsRecieved.forEach(yearToCheck => {
              if (yearToCheck.name === year) {
                yearFound = yearToCheck;
                return;
              }
            });
            if (yearFound) {
              const monthsFound = yearFound.children;
              let doesMonthExist;

              monthsFound.forEach(currentMonth => {
                const monthRecieved = this.monthToMonthNumber[currentMonth.name];

                if (monthRecieved === month) {
                  doesMonthExist = currentMonth;
                  return;
                }
              });
              if (doesMonthExist) {
                const datesRecieved = doesMonthExist.children;

                let doesDateExist;
                datesRecieved.forEach(dateToCheck => {
                  if (dateToCheck.name === date) {
                    doesDateExist = dateToCheck;
                    return;
                  }
                });
                if (!doesDateExist) {
                  console.log('month noot found......');
                  console.log(doesDateExist);


                  const newDateForMoth = new DateModel(date);
                  (doesMonthExist as MonthsModel)
                    .children.push(newDateForMoth);
                }
              } else {
                console.log('month deosn.....' + this.months[month]);
                console.log(month);
                const newMonth = new MonthsModel(this.months[month]);
                const newDate = new DateModel(date);
                newMonth.children = new Array();
                newMonth.children.push(newDate);
                monthsFound.push(newMonth);
              }
            } else {
              console.log('year no------');
              const yearToAdd = new YearModel(year);
              const monthToAdd = new MonthsModel(this.months[month]);
              const dateToAdd = new DateModel(date);
              monthToAdd.children = new Array();
              monthToAdd.children.push(dateToAdd);
              yearToAdd.children = new Array();
              yearToAdd.children.push(monthToAdd);
              this.yearDictionary.children.push(yearToAdd);
            }
          } else {
            const yearToAdd = new YearModel(year);
            const monthToAdd = new MonthsModel(this.months[month]);
            const dateToAdd = new DateModel(date);
            monthToAdd.children = new Array();
            monthToAdd.children.push(dateToAdd);
            yearToAdd.children = new Array();
            yearToAdd.children.push(monthToAdd);
            yearsRecieved = new Array();
            yearsRecieved.push(yearToAdd);
            this.yearDictionary.children = new Array();
            this.yearDictionary.children.push(yearToAdd);
          }
        }).catch(error => {
          switch (error.code) {
            case 'storage/object-not-found':
              // File doesn't exist
              break;

            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;

            case 'storage/canceled':
              // User canceled the upload
              break;
            case 'storage/unknown':
              // Unknown error occurred, inspect the server response
              break;
          }
        });
        console.log('----------sdfdsfdsfds--------------');
        console.log(this.yearDictionary.children);
      });
    }).catch(error => {
      // Handle any errors
    });

  }

  scrollHandler(event) {
    console.log('--------------');
    console.log(event);
  }

  deleteAllChildren() {
    this.toolBarSvc
      .deleteChildCommunicator
      .next(true);
  }

  getFileMetaData(storageRef, file) {
    // const storageRef = firebase.storage().ref('new_uploads');

    // Create a reference to the file whose metadata we want to retrieve
    const forestRef = storageRef.child('images/forest.jpg');

// Get metadata properties
    forestRef.getMetadata().then(metadata => {
      // Metadata now contains the metadata for 'images/forest.jpg'
    }).catch(error => {
      // Uh-oh, an error occurred!
    });
  }

  hasChild(_: number, node: DataModel) {
    console.log(node);
    return node.children != null && node.children.length > 0;
  }
}



