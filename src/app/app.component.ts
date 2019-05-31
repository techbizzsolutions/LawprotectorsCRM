import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, Events, IonicApp, AlertController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { ApiProvider } from '../providers/api/api';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  showedAlert: boolean = false;
  confirmAlert: any;
  user: any;
  pages: Array<{
    title: string,
    component?: any,
    icon: any
  }>;
  constructor(public platform: Platform,
    public menuCtrl: MenuController,
    public alertCtrl: AlertController,
    private ionicApp: IonicApp,
    public events: Events,
    public api: ApiProvider,
    private nativeGeocoder: NativeGeocoder,
    public toastCtrl: ToastController,
    private geolocation: Geolocation,
    public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
    events.subscribe('user:loggedIn', () => {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.menuCtrl.swipeEnable(true, 'menu1');
      this.initialisemenu();
      this.Location();
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString("#8B0000");
      this.splashScreen.hide();
      this.user = JSON.parse(localStorage.getItem('user'));
      // used for an example of ngFor and navigation
      if (this.user) {
        this.menuCtrl.swipeEnable(true, 'menu1');
        this.initialisemenu();
        this.Location();
        switch (this.user.role) {
          case '1':
            this.rootPage = 'DashboardPage';
            break;
          case '2':
            this.rootPage = 'DashboardBranchPage';
            break;
          case '3':
            this.rootPage = 'DashboardRcPage';
            break;
          case '4':
            this.rootPage = 'DashboardTcPage';
            break;
          default:
            break;
        }

      } else {
        this.menuCtrl.swipeEnable(false, 'menu1');
        this.rootPage = LoginPage;
      }
      this.platform.registerBackButtonAction(() => {
        const ionApp = <HTMLElement>document.getElementsByTagName("ion-app")[0];
        ionApp.style.display = "block";
        let activePortal = this.ionicApp._loadingPortal.getActive() || this.ionicApp._overlayPortal.getActive();
        this.menuCtrl.close();

        if (activePortal) {
          activePortal.dismiss();
          activePortal.onDidDismiss(() => {
          });
          //return;
        }

        if (this.ionicApp._modalPortal.getActive()) {
          this.ionicApp._modalPortal.getActive().dismiss();
          this.ionicApp._modalPortal.getActive().onDidDismiss(() => {
          });
          return;
        }
        if (this.nav.length() == 1) {
          if (!this.showedAlert) {
            this.confirmExitApp();
          } else {
            this.showedAlert = false;
            this.confirmAlert.dismiss();
          }
        }
        if (this.nav.canGoBack()) {
          this.nav.pop();
        }

      });
    });
  }

  initialisemenu()
  {
    switch (this.user.role) {
      case '1':
        this.pages = [
          {
            title: 'Dashboard',
            component: 'DashboardPage',
            icon: 'ios-home'
          },
          {
            title: 'Add Time Period',
            component: 'TimeperiodPage',
            icon: 'ios-add-circle'
          },
          {
            title: 'List Time Peroid',
            component: 'ListtimeperiodPage',
            icon: 'ios-list'
          },
          {
            title: 'Set Target',
            component: 'AddtargetPage',
            icon: 'ios-add-circle'
          },
          {
            title: 'View Branch Target',
            component: 'ListTargetPage',
            icon: 'ios-list'
          },
          {
            title: 'Add User',
            component: 'AddUserPage',
            icon: 'ios-add-circle'
          },
          {
            title: 'List User',
            component: 'ListUserPage',
            icon: 'ios-list'
          },
          {
            title: 'Add Daily Collection',
            component: 'AddCollectionPage',
            icon: 'ios-add-circle'
          },
          {
            title: 'List Daily Collection',
            component: 'ListCollectionPage',
            icon: 'ios-list'
          },
          {
            title: 'Add Quotation',
            component: 'AddQuotationPage',
            icon: 'ios-add-circle'
          },
          {
            title: 'List Quotation',
            component: 'ListQuotationPage',
            icon: 'ios-list'
          },
          {
            title: 'Add RC Visit',
            component: 'AddRcVisitPage',
            icon: 'ios-add-circle'
          },
          {
            title: 'List RC Visit',
            component: 'ListRCvisitPage',
            icon: 'ios-list'
          },
          {
            title: 'Add Service',
            component: 'AddservicePage',
            icon: 'ios-add-circle'
          },
          {
            title: 'List Service',
            component: 'ListProductPage',
            icon: 'ios-list'
          },
          {
            title: 'Add Call Visit',
            component: 'AddcallPage',
            icon: 'ios-add-circle'
          },
          {
            title: 'List Call Visit',
            component: 'ListCallPage',
            icon: 'ios-list'
          },
          {
            title: 'Add Branch',
            component: 'AddbranchPage',
            icon: 'ios-add-circle'
          },
          {
            title: 'List Branch',
            component: 'ListBranchPage',
            icon: 'ios-list'
          },
          {
            title: 'Branch Wise Report',
            component: 'BranchReportPage',
            icon: 'ios-list'
          },
          {
            title: 'Company Wise Report',
            component: 'CompanyReportPage',
            icon: 'ios-list'
          },
          {
            title: 'Role Wise Report',
            component: 'RroleReportPage',
            icon: 'ios-list'
          },
          {
            title: 'Track Me',
            component: 'TrackmePage',
            icon: 'ios-navigate'
          },
          {
            title: 'Log Out',
            icon: 'md-log-out'
          }];
        break;
      case '2':
      this.pages = [
        {
          title: 'Dashboard',
          component: 'DashboardPage',
          icon: 'ios-home'
        },
        {
          title: 'Add Quotation',
          component: 'AddQuotationPage',
          icon: 'ios-add-circle'
        },
        {
          title: 'List Quotation',
          component: 'ListQuotationPage',
          icon: 'ios-list'
        },
        {
          title: 'Add Daily Collection',
          component: 'AddCollectionPage',
          icon: 'ios-add-circle'
        },
        {
          title: 'List Daily Collection',
          component: 'ListCollectionPage',
          icon: 'ios-list'
        },
        {
          title: 'Track Me',
          component: 'TrackmePage',
          icon: 'ios-navigate'
        },
        {
          title: 'View Branch Target',
          component: 'ListTargetPage',
          icon: 'ios-list'
        },
        {
          title: 'Role Wise Report',
          component: 'RroleReportPage',
          icon: 'ios-list'
        },
        {
          title: 'Log Out',
          icon: 'md-log-out'
        }];
        break;
      case '3':
        this.pages = [
          {
            title: 'Dashboard',
            component: 'DashboardRcPage',
            icon: 'ios-home'
          },
          {
            title: 'Visit Information',
            component: 'CallInfoPage',
            icon: 'ios-add-circle'
          },
          {
            title: 'List Call Information',
            component: 'ListspotinfoPage',
            icon: 'ios-list'
          },
          {
            title: 'Add Quotation',
            component: 'AddQuotationPage',
            icon: 'ios-add-circle'
          },
          {
            title: 'List Quotation',
            component: 'ListQuotationPage',
            icon: 'ios-list'
          },
          {
            title: 'Add Daily Collection',
            component: 'AddCollectionPage',
            icon: 'ios-add-circle'
          },
          {
            title: 'List Daily Collection',
            component: 'ListCollectionPage',
            icon: 'ios-list'
          },
          {
            title: 'My Report',
            component: 'RroleReportPage',
            icon: 'ios-list'
          },
          {
            title: 'Appointment List',
            component: 'AppointmentRcPage',
            icon: 'ios-list'
          },
          {
            title: 'Log Out',
            icon: 'md-log-out'
          }];
        break;
      case '4':
        this.pages = [
          {
            title: 'Dashboard',
            component: 'DashboardTcPage',
            icon: 'ios-home'
          },
          {
            title: 'Call Information',
            component: 'CallInfoPage',
            icon: 'ios-add-circle'
          },
          {
            title: 'List Call Information',
            component: 'ListcallinfoPage',
            icon: 'ios-list'
          },
          {
            title: 'Add Quotation',
            component: 'AddQuotationPage',
            icon: 'ios-add-circle'
          },
          {
            title: 'List Quotation',
            component: 'ListQuotationPage',
            icon: 'ios-list'
          },
          {
            title: 'Add Daily Collection',
            component: 'AddCollectionPage',
            icon: 'ios-add-circle'
          },
          {
            title: 'List Daily Collection',
            component: 'ListCollectionPage',
            icon: 'ios-list'
          },
          {
            title: 'Appointment List',
            component: 'AppointmentlistPage',
            icon: 'ios-list'
          },
          {
            title: 'Role Wise Report',
            component: 'RroleReportPage',
            icon: 'ios-list'
          },
          {
            title: 'Log Out',
            icon: 'md-log-out'
          }];
        break;
      default:
        break;
    }
  }

  Location()
  {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.getCity(resp.coords.latitude,resp.coords.longitude);
     }).catch((error) => {
       console.log('Error getting location', error);
     });
     
  }

  sendLocation(latitude,longitude,city)
  {
    this.api.post('addlatlong', {
      'lat':latitude,
      'long':longitude,
      'currentcity':city.thoroughfare +" "+  city.locality +" "+ city.administrativeArea +" "+ city.countryName +"-"+ city.postalCode
    }).subscribe(res => {
      console.log('sendlocation', res);
    }, err => {
      console.log('login err', err);
    })
  }

  getCity(lati,long)
  {  
      this.nativeGeocoder.reverseGeocode(lati, long)
        .then((result) =>
        {
          console.log(JSON.stringify(result[0]));
          this.sendLocation(lati,long,result[0]);
        })
        .catch((error: any) => console.log(error));
  }

  // confirmation pop up to exit from app 
  confirmExitApp() {
    this.showedAlert = true;
    this.confirmAlert = this.alertCtrl.create({
      subTitle: "Do you want to exit from the app?",
      buttons: [
        {
          text: 'NO',
          handler: () => {
            this.showedAlert = false;
            return;
          }
        },
        {
          text: 'YES',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });
    this.confirmAlert.present();
  }

  openPage(page) {
    console.log("*****", page);
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    switch (page.title) {
      case 'Dashboard':
        this.nav.setRoot(page.component);
        break;
      case 'Log Out':
        localStorage.clear();
        this.menuCtrl.swipeEnable(false, 'menu1');
        this.nav.setRoot(LoginPage);
        break;
      default:
        {
          this.nav.push(page.component);
        }
    }
  }

}
