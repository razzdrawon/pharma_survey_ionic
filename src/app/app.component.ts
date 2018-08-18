import { LoginPage } from './../pages/login/login';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DBService } from '../providers/db-services/storage-service';
import { Geolocation } from '@ionic-native/geolocation';




@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = null;

  constructor(public platform: Platform, public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
   public db:DBService,private geolocation: Geolocation
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      
      this.statusBar.styleDefault();
      
      //console.log('Antes de configurar')
      this.db.configureDatabase();
      //set options.. 
var options = {
  timeout: 20000 //sorry I use this much milliseconds
}
      //use the geolocation 
      this.geolocation.getCurrentPosition(options).then(data=>{
        console.log('++++++++++++++++++GEO LOCALIZACIón');
        console.log( data.coords.longitude);
        console.log( data.coords.latitude);
      }).catch((err)=>{
      console.log("('++++++++++++++++++Error:", JSON.stringify( err));
      });

  
      this.splashScreen.hide();
      this.rootPage = LoginPage;
    });
  }

   

  
}

