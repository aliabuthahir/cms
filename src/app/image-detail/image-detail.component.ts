import {Component, OnInit} from '@angular/core';
import {ImageService} from '../../services/image.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-image-detail',
  templateUrl: './image-detail.component.html',
  styleUrls: ['./image-detail.component.scss']
})
export class ImageDetailComponent implements OnInit {
  private imageUrl = '';

  constructor(private imageSvc: ImageService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.getImageUrl(this.route.snapshot.params.id);
    // this.getImageUrl(this.route.snapshot.params['id']);
  }

  getImageUrl(key: string) {
    this.imageSvc
      .getImage(key)
      .then(imageUrl => {
        this.imageUrl = imageUrl.url;
      });
  }
}
