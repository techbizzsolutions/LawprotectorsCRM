
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';


@Injectable()
export class LoaderServiceProvider {
  public Loader: any;
  constructor(public loading: LoadingController) { }

  Show(content: string): void {
    this.Loader = this.loading.create({
      content: content
    });
    this.Loader.present();
  }

  Hide(): void {
    if (this.Loader) {
      this.Loader.dismiss();
    }
  }

}