import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SyncHttpService } from '../../providers/http-services/sync-service';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the SurveyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-survey',
  templateUrl: 'survey.html',
})
export class SurveyPage {

  public questions: any[] = [];
  public question: any = {}; // current question (displayed in screen)

  public answers: any[] = [];
  public answer: any = {};

  public hasChilds: boolean = false;

  public isAnswered: boolean = false;

  public image: string = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, public syncHttpService: SyncHttpService, private storage: Storage, private camera: Camera) {
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad SurveyPage');
    console.log(this.navParams);
    this.loadSurvey(this.navParams.data);

  }

  loadSurvey(navParams) {

    this.answer = {};
    this.answer.opt = {};

    console.log(navParams['tipo_establecimiento_id']);
    if(navParams["tipo_establecimiento_id"]==3 || navParams["descripcion"]=='Farmacia Intrahospitalaria'){
      console.log('pharma');
      this.storage.get('pharmaSurvey').then(
      (data) => {
        //console.log(data);
        this.questions = JSON.parse(data);
        this.question = this.questions[0];
        console.log(this.question);
      },
      err => {
        console.log(err);
      }
    );
  } else {
    console.log('hospital');
    this.storage.get('hospitalSurvey').then(
      (data) => {
        //console.log(data);
        this.questions = JSON.parse(data);
        this.question = this.questions[0];
        console.log(this.question);
      },
      err => {
        console.log(err);
      }
    );    
  }
  }

  

  radioOptionChanged() {

    console.log(this.answer);

    if (this.answer.opt.respuestas != null || this.answer.opt.tipo_pregunta != null) {
      this.hasChilds = true;
    }
    else {
      this.hasChilds = false;
      this.answer.optChild = null;
    }

  }

  radioChildOptionChanged() {

    console.log(this.answer);
    // this.answer.opt = {};
    // this.answer.opt.respuestas = item;
    // console.log(this.answer);
  }

  getPicture(){
    let options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000,
      quality: 100
    }
    this.camera.getPicture( options )
    .then(imageData => {
      this.image = `data:image/jpeg;base64,${imageData}`;
      console.log(this.image);
      this.answer.image = this.image;
    })
    .catch(error =>{
      console.error( error );
    });
  }


  nextQuestion() {

    this.fillAnswerAndPush();
    
    this.defineNextSectionAndQuestion();

  }

  fillAnswerAndPush() {
    
    // fill with useful question info in the answer
    this.answer.id = this.question.id;
    this.answer.tipo_pregunta = this.question.tipo_pregunta;
    this.answer.indice = this.question.indice;
    this.answer.nivel = this.question.nivel;
    console.log(this.answer);

    // push answer to answers array (saving answer temporary and not in storage yet)
    this.answers.push(this.answer);
  }

  defineNextSectionAndQuestion(){
    let nextSection = this.question.siguiente_seccion;
    let nextQuestion = this.question.siguiente_prgunta;
    let isFinal = this.question.final_seccion;

    switch (this.question.tipo_pregunta) {

      case 1: { // question type 1 (Open answer)
        if (isFinal == 1) {
          nextSection = this.question.seccion + 1;
          nextQuestion = 1;
        }
        else {
          nextSection = this.question.seccion;
          nextQuestion = this.question.seccion_pregunta_id + 1;
        }
        break;
      }
      case 2: { // question type 2 (Radio Button)
        nextSection = this.answer.opt.siguiente_seccion;
        nextQuestion = this.answer.opt.siguiente_pregunta;

        if (nextSection == null && nextQuestion == null) {
          nextSection = this.question.seccion;
          nextQuestion = this.question.seccion_pregunta_id + 1;
        }
        break;
      }

      case 3: { // question type 3 (Combo Box)
        if (isFinal == 1) {
          nextSection = this.question.seccion + 1;
          nextQuestion = 1;
        }
        else {
          nextSection = this.question.seccion;
          nextQuestion = this.question.seccion_pregunta_id + 1;
        }
        break;
      }

      case 4: { // question type 4 (Text Area)
        if (isFinal == 1) {
          nextSection = this.question.seccion + 1;
          nextQuestion = 1;
        }
        else {
          nextSection = this.question.seccion;
          nextQuestion = this.question.seccion_pregunta_id + 1;
        }
        break;
      }

      case 5: { // question type 5 (Text Area)
        if (isFinal == 1) {
          nextSection = this.question.seccion + 1;
          nextQuestion = 1;
        }
        else {
          nextSection = this.question.seccion;
          nextQuestion = this.question.seccion_pregunta_id + 1;
        }
        break;
      }
    }

    console.log('next section: ' + nextSection + ' next question: ' + nextQuestion);
    this.question = this.questions.find(question => (question.seccion == nextSection) && (question.seccion_pregunta_id == nextQuestion));
    if (this.question.tipo_pregunta == 2) {
      this.answer = {};
      this.answer.opt = {};
    }
    else {
      this.answer = {};
    }
  }

}