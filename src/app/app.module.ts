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
import { HomePage } from '../pages/home/home';
import { RevisionPage } from '../pages/revision/revision';
import { FinCuestPage } from '../pages/finCuest/finCuest';


//import { UsersDBService } from '../providers/db-services/users-service';
//import { SurveysDBService } from '../providers/db-services/surveys-service';

import { SyncHttpService } from '../providers/http-services/sync-service';
import { ElasticDirective } from '../directives/elastic/elastic';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    SurveyPage,
    ElasticDirective,
    RevisionPage,
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
    RevisionPage,
    FinCuestPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    Camera,
//    UsersDBService,
//    SurveysDBService,
    SyncHttpService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
