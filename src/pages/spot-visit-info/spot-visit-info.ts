import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FileEntry } from '@ionic-native/file';
import { File } from '@ionic-native/file';

@IonicPage()
@Component({
  selector: 'page-spot-visit-info',
  templateUrl: 'spot-visit-info.html',
})
export class SpotVisitInfoPage {
  private register: FormGroup;
  rc = [];
  selectrc:any;
  services= [];
  service:any;
  isdisable:boolean = false;
  appdate: any = 'Appointment Date';
  apptime: any = 'Appointment Time';
  profilePic:any;
  browseImage:any;
    fileTransfer: FileTransferObject;
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    private file: File,
    private transfer: FileTransfer,
     public navParams: NavParams) {
      this.fileTransfer = this.transfer.create();
    this.register = this.formBuilder.group({
      party_name: ["", Validators.required],
      mobile : ['',Validators.compose([Validators.required, Validators.pattern('^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$'), Validators.maxLength(10)])],
      email: ["", Validators.required],
      cityname:["", Validators.required],
      note: [""]
    });
  }

  changePic() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.api.selectPhoto().then(image=>{
              console.log('selectPhoto res',image);
              if(image)
              {
                   this.checkPicSize(image);
              }
          }).catch (err=>{
            console.log(err);
          });
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.api.takePhoto().then(image=>{
              console.log('takePhoto res',image);
              if(image)
             {
              this.checkPicSize(image);
            }
          }).catch (err=>{
            console.log(err);
          });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  checkPicSize(imageURI: any) {
    this.file.resolveLocalFilesystemUrl(imageURI)
      .then(entry => (<FileEntry>entry).file(file => {
        console.log('file', file);
        this.profilePic = file.name;
        let bytes = file.size;
        if (bytes < 10485760) {
          console.log("Size = " + bytes);
          this.browseImage = imageURI;
          //this.uploadOnServer(imageURI);
        }
        else {
          let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
          let i = Math.floor(Math.log(bytes) / Math.log(1000));
          let val = parseFloat((bytes / Math.pow(1000, i)).toFixed(1)) + ' ' + sizes[i];
          this.toastCtrl.create({
            message: "Sorry, Image size should be less than 10MB,Image size is" + val,
            duration: 3000,
            position: 'top'
          })
        }
      }
      ))
      .catch(err => console.log(err));
  }

  date() {
    this.api.opencalQR().then(res => {
      let mnth = res.getMonth() + 1;
        this.appdate = res.getDate() + "-" + mnth + "-" + res.getFullYear();
    })
    .catch(err => {
        var res = new Date();
        let mnth = res.getMonth() + 1;
          this.appdate = res.getDate() + "-" + mnth + "-" + res.getFullYear();
      });
  }

  time() {
    this.api.time().then(res => {
      this.apptime =res.getHours() + ":" + res.getMinutes();
    })
    .catch(err => {
          var res = new Date();
          this.apptime =res.getHours() + ":" + res.getMinutes();
      });
  }

  getservice()
  {
    this.loader.Show("Loading...");
    this.api.get('viewServices').subscribe(res => {
      console.log('viewServices', res);
      this.loader.Hide();
      if (res.status) {
        this.services = res.list;
      }
      else {
        let toast = this.toastCtrl.create({
          message: res.message,
          position: 'top',
          duration: 3000
        });
        toast.present();
      }

    }, err => {
      this.loader.Hide();
      console.log('login err', err);
      let toast = this.toastCtrl.create({
        message: 'Something went wrong, please try again',
        position: 'top',
        duration: 3000
      });
      toast.present();
    })
  }

  getBranch()
  {
    this.loader.Show("Loading...");
    this.api.get('viewRC').subscribe(res => {
      console.log('viewRC', res);
      this.loader.Hide();
      if (res.status) {
        this.rc = res.list;
        this.getservice();
      }
      else {
        let toast = this.toastCtrl.create({
          message: res.message,
          position: 'top',
          duration: 3000
        });
        toast.present();
      }

    }, err => {
      this.loader.Hide();
      console.log('login err', err);
      let toast = this.toastCtrl.create({
        message: 'Something went wrong, please try again',
        position: 'top',
        duration: 3000
      });
      toast.present();
    })
  }

  logForm()
  { 

    if(!this.selectrc)
    {
      let toast = this.toastCtrl.create({
        message: "Please select Call status",
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
    console.log("imageFileUri", this.browseImage);
    var make;
    if(this.navParams.data.id && !this.navParams.data.action)
    {
      make = {
        url:'updatespotvisitinfo',
        data:{
          "spot_infoid":this.navParams.data.id,
          "party_name": this.register.value.party_name,
          "city": this.register.value.cityname,
          "email_id": this.register.value.email,
          "interested": (this.service)?this.service:"",
          "visit_status":this.selectrc,
          "appointment_date": (this.appdate =="Appointment Date")?"":this.appdate,
          "appointment_time": (this.apptime == "Appointment Time")?"":this.apptime,
          "phone": this.register.value.mobile,
          "note": this.register.value.note
        }
      }
    }
    else{
      make = {
        url:'addspotvisitinfo',
        data:{
            "party_name": this.register.value.party_name,
            "city": this.register.value.cityname,
            "email_id": this.register.value.email,
            "interested": (this.service)?this.service:"",
            "visit_status":this.selectrc,
            "appointment_date": (this.appdate =="Appointment Date")?"":this.appdate,
            "appointment_time": (this.apptime == "Appointment Time")?"":this.apptime,
            "phone": this.register.value.mobile,
            "note": this.register.value.note
          }
      }
    }
    if(this.browseImage)
    {
      let user = JSON.parse(localStorage.getItem('user'));
      make.data.userid = user.result[0].id;
      this.loader.Show("uploading..");
      let options: FileUploadOptions = {
        fileKey: 'image',
        headers: {},
        chunkedMode: false,
        params: make.data
      }
      console.log("imageFileUri", options.params);
      this.fileTransfer.upload(this.browseImage, 'http://technotwitsolutions.com/Mobileappprojects/Lawprotectors/index.php/services/'+ make.url, options)
        .then((res) => {
          // success
          console.log("data", res);
          var newres = JSON.parse(res.response);
          console.log(newres,"data", res);
          this.loader.Hide();
          if (newres.status) {
            let toast = this.toastCtrl.create({
              message: newres.message,
              position: 'top',
              duration: 3000
            });
            toast.present();
            this.navCtrl.setRoot('DashboardPage');
          }
          else {
            let toast = this.toastCtrl.create({
              message: newres.message,
              position: 'top',
              duration: 3000
            });
            toast.present();
          }
        }, (err) => {
          // error
          this.loader.Hide();
          console.log("data err", err);
        }).catch((err) => {
          this.loader.Hide();
          console.log("data catch", err);
          this.toastCtrl.create({
            message: err,
            duration: 3000,
            position: 'top'
          }).present();
        });
    }
    else{
      this.loader.Show("Loading...");
    this.api.post(make.url, make.data).subscribe(res => {
      console.log('addspotvisitinfo', res);
      this.loader.Hide();
      if (res.status) {
        let toast = this.toastCtrl.create({
          message: res.message,
          position: 'top',
          duration: 3000
        });
        toast.present();
        this.navCtrl.setRoot('DashboardPage');
      }
      else {
        let toast = this.toastCtrl.create({
          message: res.message,
          position: 'top',
          duration: 3000
        });
        toast.present();
      }

    }, err => {
      this.loader.Hide();
      console.log('login err', err);
      let toast = this.toastCtrl.create({
        message: 'Something went wrong, please try again',
        position: 'top',
        duration: 3000
      });
      toast.present();
    })
    }
   
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage',this.navParams.data);
    this.getBranch();
    if(this.navParams.data.id)
    {
      if(this.navParams.data.action)
      {
        this.register = this.formBuilder.group({
          party_name: [this.navParams.data.party_name, Validators.required],
          mobile: [this.navParams.data.phone, Validators.required],
          email: [this.navParams.data.email_id, Validators.required],
          cityname:[this.navParams.data.city, Validators.required],
          note: [""]
        });
      }
      else{
        this.register = this.formBuilder.group({
          party_name: [this.navParams.data.party_name, Validators.required],
          mobile: [this.navParams.data.phone, Validators.required],
          email: [this.navParams.data.email_id, Validators.required],
          cityname:[this.navParams.data.city, Validators.required],
          note: [this.navParams.data.note]
        });
        this.isdisable = true;
        this.appdate = this.navParams.data.appointment_date;
        this.apptime = this.navParams.data.appointment_time;
        this.selectrc = this.navParams.data.visit_status;
        this.service = this.navParams.data.interested;
      }
     
    }
    else{
      this.register = this.formBuilder.group({
        party_name: ["", Validators.required],
        mobile: [this.navParams.data.phone, Validators.required],
        email: ["", Validators.required],
        cityname:["", Validators.required],
        note: [""]
      });
    }
  }

}
