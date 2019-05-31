import { HttpClient } from '@angular/common/http';
import { Injectable, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular/platform/platform';
import { ToastController, Nav } from 'ionic-angular';
import 'rxjs/add/observable/of';
import { LoginPage } from '../../pages/login/login';
import { DatePicker } from '@ionic-native/date-picker';
import { Camera } from '@ionic-native/camera';

@Injectable()
export class ApiProvider {
  @ViewChild(Nav) nav: Nav;
  onDevice: boolean;
  user:any;
  private host: String = 'http://technotwitsolutions.com/Mobileappprojects/Lawprotectors/index.php/services/';
  constructor(private http: HttpClient,
    private camera: Camera,
    private datePicker: DatePicker, private network: Network, public plt: Platform, public toastProvider: ToastController) {
    this.plt.ready().then(() => {
      this.onDevice = this.plt.is('cordova');
    });
  }

  opencalQR():Promise<any>
  {
     return this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
    }).then(
      date => {
        console.log('Got date: ', date)
        return date;
      },
      err => 
      {
        console.log('Error occurred while getting date: ', err);
        var date = new Date();
        return date;
      })
      .catch(err=>{
        var date = new Date();
        return date;
      });
  }

  time():Promise<any>
  {
     return this.datePicker.show({
      date: new Date(),
      mode: 'time',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
    }).then(
      date => {
        console.log('Got date: ', date)
        return date;
      },
      err => 
      {
        console.log('Error occurred while getting date: ', err);
        var date = new Date();
        return date;
      })
      .catch(err=>{
        var date = new Date();
        return date;
      });
  }
  
  post(url, data): Observable<any> {
    this.user = JSON.parse(localStorage.getItem('user'));
    if(!this.user)
    {
       this.nav.setRoot(LoginPage);
       return
    }

    let rowdata = data;
    rowdata.userid = this.user.result[0].id;
    console.log(this.user, rowdata);
    if (this.isOnline()) {
      return this.http.post<any>(this.host + url, rowdata);
    }
    else {
      console.log("not connected");
      let toast = this.toastProvider.create({
        message: "You are not connected to the internet",
        position: 'top',
        duration: 3000
      });
      toast.present();
      return Observable.of({ authorization: false, message: "You are not connected to the internet", data: [] });
    }

  }

  postWithoutEmp(url, data): Observable<any> {
    console.log(url, data);
    if (this.isOnline()) {
      return this.http.post<any>(this.host + url, data);
    }
    else {
      console.log('not connected');
      let toast = this.toastProvider.create({
        message: "You are not connected to the internet",
        position: 'top',
        duration: 3000
      });
      toast.present();
      return Observable.of({ error: '2', message: "You are not connected to the internet", data: [] });

    }

  }

  get(url): Observable<any> {
    console.log(url);
    if (this.isOnline()) {
      return this.http.get<any>(this.host + url);
    }
    else {
      console.log('not connected');
      let toast = this.toastProvider.create({
        message: "You are not connected to the internet",
        position: 'top',
        duration: 3000
      });
      toast.present();
      return Observable.of({ error: '2', message: "You are not connected to the internet", data: [] });

    }

  }

  takePhoto():Promise<any> {
    return this.camera.getPicture({
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true,
      quality: 30,
      allowEdit: true,
      saveToPhotoAlbum: true
    }).then(imageData => {
      return imageData;
    }, error => {
      return "";
    }).catch(err =>{
      return "";
    })
  }

  selectPhoto():Promise<any> {
     return this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      allowEdit: true,
      correctOrientation: true,
      quality: 30,
      encodingType: this.camera.EncodingType.JPEG,
    }).then(imageData => {
      return imageData;
    }, error => {
      return "";
    }).catch(err =>{
      return "";
    })
  }

  isOnline(): Boolean {
    console.log('this.network.type', this.network.type);
    if (this.onDevice) {
      if (this.network.type == 'none') {
        return false;
      } else {
        return true;
      }
    } else {
      return true; // true since its not a device
     }
    }
}
