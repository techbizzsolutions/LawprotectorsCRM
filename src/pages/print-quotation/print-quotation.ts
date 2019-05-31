import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Printer, PrintOptions } from '@ionic-native/printer';
import { File } from '@ionic-native/file';
import { AndroidPermissions } from '@ionic-native/android-permissions';
declare var cordova: any;    //global;

@IonicPage()
@Component({
  selector: 'page-print-quotation',
  templateUrl: 'print-quotation.html',
})
export class PrintQuotationPage {
  quotationData:any;
  relativepath:any;
  constructor(private printer: Printer,
    public toastCtrl: ToastController, private androidPermissions: AndroidPermissions, private file: File, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log(this.navParams.data);
    this.quotationData = this.navParams.data;
    this.relativepath = this.file.applicationDirectory + 'www/assets/imgs/stamp.jpg';
  }

  print() {
    var page = '';
    page += `<style type="text/css"> 
    .borderdivP {
      margin: 2px !important;
  }
  .tablealign{
      text-align: left!important;
  }
  .removeMrgin {
      color: black !important;
      margin: 2px !important;
      font-size: 10px !important;
      padding: 0px !important;
      text-align: center !important;
  }
  .removeMrginpadding {
      color: black !important;
      font-size: 10px !important;
      margin: 5px !important;
      padding: 0px !important;
  }
  table,
  th,
  td {
      border: 1px solid black;
      border-collapse: collapse;
      padding: 2px;
      font-size: 10px !important;
      text-align: center;
  }
  .bckcolor {
      background-color: grey !important;
  }
  p {
      padding: 5px !important;
      color: color($colors, header) !important;
  }
    </style>`;

    page += document.getElementById('print').innerHTML;
    this.printer.isAvailable().then(() => {
     // this.retrieveFile(page);
      let options: PrintOptions = {
        landscape: false,
        grayscale: true
      };
      this.printer.print(page, options).then((success) => {
        console.log("printer Succesfully" + JSON.stringify(success));
      })
        .catch((error) => {
          console.log("Cannot Open printer " + JSON.stringify(error))
          this.retrieveFile(page);
        });
    })
      .catch((error) => {
        console.log("Cannot isAvailable " + JSON.stringify(error));
        this.retrieveFile(page);

      });
  }

  retrieveFile(code) {
    //generate the pdf.
    var options = {
      documentSize: 'A4',
      type: 'base64'
    };
    cordova.plugins.pdf.fromData(code, options)
      .then((res) => {
        console.log(res);
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
          result => {
            console.log('Has permission?', result.hasPermission);
            if (result.hasPermission) {
              // To define the type of the Blob
              var contentType = "application/pdf";
              var fileName = "bill.pdf";
              var folderpath = (this.file.externalRootDirectory || this.file.dataDirectory) + 'LawprotectorsCRM/';
              this.savebase64AsPDF(folderpath, fileName, res, contentType);
            }
            else {
              this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE);
            }
          },
          err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
        );
      })
      .catch((err) => {
        console.log(err);
      })

  }

  b64toBlob(b64Data, contentType, sliceSize?) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  savebase64AsPDF(folderpath, filename, content, contentType) {
    // Convert the base64 string in a Blob
    var DataBlob = this.b64toBlob(content, contentType);
    console.log("DataBlob", DataBlob);
    let self = this;
    self.file.writeFile(folderpath, filename, DataBlob, { replace: true }).then((success) => {
      console.log("File created Succesfully" + JSON.stringify(success));
      let toast = this.toastCtrl.create({
        message: 'Quotation downloaded successfully, file location is inside filemanager/LawprotectorsCRM',
        position: 'top',
        duration: 3000
      });
      toast.present();
    })
      .catch((error) => console.log("Cannot Create File " + JSON.stringify(error)));
  }

}


