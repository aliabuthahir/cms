import {Component, OnChanges, OnInit} from '@angular/core';
import {ImageService} from '../../services/image.service';
import {Observable} from 'rxjs';
import {GalleryImageModel} from '../../models/gallery-image.model';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, OnChanges {
  images: Observable<GalleryImageModel[]>;

  constructor(private imageSvc: ImageService) {
  }

  ngOnInit(): void {
    this.images = this.imageSvc.getImages();
  }

  ngOnChanges(): void {
     this.images = this.imageSvc.getImages();
  }
}
