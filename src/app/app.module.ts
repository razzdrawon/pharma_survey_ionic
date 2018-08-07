import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera } from '@ionic-native/camera';
import { SQLite } from '@ionic-native/sqlite';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { SurveyPage } from '../pages/survey/survey';
import { FinCuestPage } from '../pages/finCuest/finCuest';
import { SyncHttpService } from '../providers/http-services/sync-service';
import { DBService } from '../providers/db-services/storage-service';
//


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    SurveyPage,
  

    FinCuestPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    SurveyPage,

    FinCuestPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    Camera,
    DBService,
//    SurveysDBService,
    SyncHttpService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
