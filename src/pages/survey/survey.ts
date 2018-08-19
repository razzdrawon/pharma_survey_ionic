import { Survey } from './../../models/survey';
import { LoginPage } from './../login/login';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { SyncHttpService } from '../../providers/http-services/sync-service';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Answer } from '../../models/answer';
import { FinCuestPage } from '../finCuest/finCuest';
import { DBService } from '../../providers/db-services/storage-service';
import { Geolocation } from '@ionic-native/geolocation';
import { RevisionPage } from '../revision/revision';
import { THROW_IF_NOT_FOUND } from '@angular/core/src/di/injector';

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

  public hasChilds: boolean = false;
  public hasSecondChilds: boolean = false;

  public isAnswered: boolean = false;


  public answers: any[] = [];
  public answer: Answer = new Answer();
  public image: string = null;

  public survey: Survey;

  public establishmentId: number;
  public type: number;
  public isPharma: any;
  public version: any;

  private loggedUser: any;


  private latitude: any;
  private longitude: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public syncHttpService: SyncHttpService,
    private storage: Storage,
    private camera: Camera,
    public alertCtrl: AlertController,
    private dbService: DBService,
    private geolocation: Geolocation
  ) {


   

  }

  ionViewDidLoad() {

    this.validateLoggedUser();
    this.initializeVars();
    this.loadSurvey();

  }


  ionViewDidEnter(){

    var options = {
      timeout: 10000 //sorry I use this much milliseconds
    }
          //use the geolocation 
    this.geolocation.getCurrentPosition(options).then(data=>{
      console.log('++++++++++++++++++GEO LOCALIZACIón');
      this.latitude = data.coords.longitude;
      this.longitude = data.coords.latitude;
    }).catch((err)=>{
      this.lanzaAlerta("No se puede obtener la geolocalicación por favor revise que los servicios de ubicación están activados");
      console.log("('++++++++++++++++++Error:", err);
    });

  }

  initializeVars() {

    console.log('---------------------------------This is what we receive in the navParams: ');
    console.log(JSON.stringify(this.navParams['data']));
    let tipoEstablishmentId = this.navParams['data'].tipo_establecimiento_id;
    this.establishmentId = this.navParams['data'].establecimiento_id;
    let sub_tipo = this.navParams['data'].subtipo_id;
    this.isPharma = false;

    if (tipoEstablishmentId == 3 || tipoEstablishmentId == 4 || tipoEstablishmentId == 5) {
      this.isPharma = true;
      this.type = 2; //survey property type
    } else if (tipoEstablishmentId == 1 && sub_tipo == 3) {
      this.isPharma = true;
      this.type = 2; //survey property type
    } else {
      this.isPharma = false;
      this.type = 1; //survey property type
    }

  }

  loadSurvey() {
    console.log('loading survey to display');
    if (this.isPharma) {
      this.storage.get('pharmaSurvey').then(
        (data) => {
          //console.log(data);
          this.questions = JSON.parse(data).cuestionario;
          this.version = JSON.parse(data).version; //survey property version
          this.loadPreviousAnwsers();
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
          this.questions = JSON.parse(data).cuestionario;
          this.version = JSON.parse(data).version; //survey property version
          this.loadPreviousAnwsers();
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  loadPreviousAnwsers() {
    console.log('loading previuos answers');
    this.dbService.getSurveyByTypeAndEstablishment(this.establishmentId, this.type)
      .then((response) => {
        console.log('**************** This is the sql response  *****************');
        console.log(JSON.stringify(response.rows.item(0)));
        if (!response.rows.item(0)) {    // New Survey to save. Never saved before.
          this.survey = new Survey();
          this.survey.establishment_id = this.establishmentId;
          this.survey.type = this.type;
          this.survey.user = this.loggedUser.usuario;
          //this.survey.save_date   This shouldnt be assigned yet                                 **
          this.survey.start_date = new Date().toISOString(); //survey property startDate
          // this.survey.end_date   This shouldnt be assigned yet                                 **
          // this.survey.survey    This should be populated whe we want to save a new section     **
          // this.survey.version    This should be populated whe we want to save a new section    
          // this.survey.latitude    This should be populated whe we want to save a new section
          // this.survey.longitude    This should be populated whe we want to save a new section
          // this.survey.evidence    This should be populated whe we want to save a new section
          // this.survey.sync    This should be populated whe we want to save a new section
          this.survey.next_section = 1;
          this.survey.completed = 0;
          this.survey.response_code = null;
        }
        else {
          this.survey = response.rows.item(0);

          if (this.survey.completed == 1) {
            this.alertCtrl.create({
              title: 'Cuestionario ya capturado',
              subTitle: 'No se puede continuar contestando este cuestionario ya que ha sido contestado y guardado anteriormente',
              buttons: [{
                text: 'Aceptar',
                handler: () => {
                  this.navCtrl.pop();
                }
              }]
            }).present();
          }

          this.answers = JSON.parse(this.survey.survey);
        }

        console.log('**************** This is the survey  *****************');
        console.log(JSON.stringify(this.survey));

        console.log('**************** This are the answers  *****************');
        console.log(JSON.stringify(this.answers));
        if (this.answers.length < 1) {
          console.log('**************** From section 1.1  *****************');
          console.log(JSON.stringify(this.questions[0]));
          this.question = this.questions[0];
        }
        else {
          console.log('**************** From section ' + this.survey.next_section + '  *****************');
          console.log(JSON.stringify(this.questions));
          this.question = this.questions.find(question => (question.seccion == this.survey.next_section && question.seccion_pregunta_id == 1));
        }

        console.log('**************** This is the initial question  *****************');
        console.log(JSON.stringify(this.question));
      });
  }


  radioOptionChanged() {

    console.log(this.answer.option.enunciado);

    if (this.answer.option.tipo_pregunta != null) {
      // Display first level of childs
      this.hasChilds = true;
      this.isAnswered = false;
    }
    else if ((JSON.stringify(this.answer.option)) == '{}') {
      this.hasChilds = false;
      this.isAnswered = false;
    }
    else {

      // Main question does not have childs... It is ready to be marked as answered
      this.hasChilds = false;
      this.isAnswered = true;

      this.hasSecondChilds = false;
      this.answer.childText = null;
      this.answer.childNumber = null;
      this.answer.childOption = {};
      this.answer.childOptions = [];
      this.answer.childMap = {};
    }

  }

  childNumberChanged() {
    if (this.answer.childNumber != null) {
      this.isAnswered = true;
    }
  }

  radioChildOptionChanged() {

    console.log(this.answer.childOption);

    if (this.answer.childOption.tipo_pregunta != null) {
      // Display first level of childs
      this.hasSecondChilds = true;
      this.isAnswered = false;
    }
    else if ((JSON.stringify(this.answer.option)) == '{}') {
      this.hasSecondChilds = false;
      this.isAnswered = false;
    }
    else {
      // Main question does not have childs... It is ready to be marked as answered
      this.hasSecondChilds = false;
      this.isAnswered = true;

      this.answer.secondChildText = null;
      this.answer.image = null;
      this.answer.imageText = null;
    }
  }

  secondChildTextChanged() {
    if (this.answer.secondChildText != null && this.answer.secondChildText != '') {
      this.isAnswered = true;
    }
  }

  childOptionsChanged() {
    if (this.answer.childOptions.length > 0) {
      this.isAnswered = true;
    }
  }

  optionChecked(childOptionChecked) {
    // console.log("checked changed");
    // console.log(childOptionChecked.enunciado);

    if (childOptionChecked.checked) {
      this.answer.childOptions.push(childOptionChecked);
      console.log("Element added");
      console.log(childOptionChecked.enunciado);
    }
    else {
      let index = this.answer.childOptions.indexOf(childOptionChecked);
      console.log("Element to remove: " + this.answer.childOptions[index].enunciado);
      // console.log(this.answer.childOptions[index].enunciado);
      if (index !== -1) {
        this.answer.childOptions.splice(index, 1);
        console.log("Element removed");
      }
    }
    console.log(this.answer.childOptions);

    if (this.answer.childOptions.length > 0) {
      this.isAnswered = true;
    }
  }

  childTextChanged() {
    if (this.answer.childText != null) {
      this.isAnswered = true;
    }
  }

  childMapChanged() {
    if (JSON.stringify(this.answer.childMap) != '{}') {
      this.isAnswered = true;
    }
  }

  imageTextChanged() {
    if (this.answer.imageText != null && this.answer.imageText != '') {
      this.isAnswered = true;
    }
  }

  getPicture() {
    let options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000,
      quality: 100
    }
    this.camera.getPicture(options)
      .then(imageData => {
        this.image = `data:image/jpeg;base64,${imageData}`;
        console.log(this.image);
        this.answer.image = this.image;
      })
      .catch(error => {
        console.error(error);
      });
  }


  nextQuestion() {

    if (this.validateSumAnswer()) {
      this.fillAnswerAndPush();
      this.defineNextSectionAndQuestion();
    }

  }

  validateSumAnswer(): any {

    if (this.question.tipo_pregunta == 5 && this.question.valida_respuestas_con_pregunta != null) {

      let sum: number = 0;
      Object.keys(this.answer.map).forEach(key => {
        sum = (parseInt(this.answer.map[key]) || 0) + sum;
      });
      console.log('*************************************');
      console.log(sum);

      console.log(this.answers);
      let total = 0;
      let answerAux = this.answers.find(answer => answer.question.id == parseInt(this.question.valida_respuestas_con_pregunta));
      if (answerAux.number != null) {
        total = answerAux.number;
      }
      else {
        Object.keys(answerAux.map).forEach(key => {
          total = (parseInt(answerAux.map[key]) || 0) + total;
        });
      }

      if ((sum || 0) == (total || 0)) {
        return true;
      }
      else {
        let alert = this.alertCtrl.create({
          title: 'Respuesta Inválida',
          subTitle: 'Aseguresé de que la suma de los números corresponde con el total de la pregunta: ' + answerAux.question.index + ' el cual fue de: ' + (total || 0),
          buttons: ['Ok']
        });
        alert.present();
        return false;
      }

    }
    else {
      return true;
    }

  }

  fillAnswerAndPush() {

    this.answer.question = { id: this.question.id, sentense: this.question.enunciado, section: this.question.seccion, section_question: this.question.seccion_pregunta_id, type: this.question.tipo_pregunta, index: this.question.indice, level: this.question.level };

    // fill with useful question info in the answer

    console.log(this.answer);

    // push answer to answers array (saving answer temporary and not in storage yet)
    this.answers.push(this.answer);
  }

  defineNextSectionAndQuestion() {
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
        nextSection = this.answer.option.siguiente_seccion;
        nextQuestion = this.answer.option.siguiente_pregunta;

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


    // check if a revision of section is needed
    if (nextSection > this.question.seccion) {
      let params = { 'answers': this.answers, 'questions': this.questions, 'section': this.answer.question.section };
      this.navCtrl.push(RevisionPage, params);
      if ((this.question.seccion == 1 && !this.isPharma) || (this.question.seccion == 0 && this.isPharma)) {
        this.saveAnswersForTheFirstTime(nextSection, this.question.seccion);
      }
      else  {
        this.updateAnswersbySection(nextSection, this.question.seccion);
      }
    }

    console.log('next section: ' + nextSection + ' next question: ' + nextQuestion);
    this.question = this.questions.find(question => (question.seccion == nextSection) && (question.seccion_pregunta_id == nextQuestion));

    if (this.question == undefined) {
      console.log('entra a final ');
      this.question = { tipo_pregunta: 0, tipo_cuestionario_id: 0, seccion: 0 };

      this.markSurveyAsCompleted();

      this.navCtrl.setRoot(FinCuestPage);
      this.navCtrl.popToRoot();
    } else {

      if (this.question.tipo_pregunta == 2) {
        this.answer = new Answer();
      } else {
        this.answer = new Answer();
        this.answer.number = null;
        this.answer.text = null;
      }

    }

  }

  validateLoggedUser() {
    this.storage.get('LoggedUser').then(
      (user) => {
        if (user) {
          this.loggedUser = user;
        }
      }
    );
  }


  saveAnswersForTheFirstTime(nextSection, currentSection): any {
    this.survey.survey = JSON.stringify(this.answers);
    this.survey.version = this.version;
    this.survey.save_date = new Date().toISOString();
    this.survey.end_date = new Date().toISOString();
    this.survey.sync = 0;
    this.survey.next_section = nextSection;

    this.survey.latitude = this.latitude;
    this.survey.longitude = this.longitude;

    console.log('Termina de setear valores');

    this.dbService.insertSurvey(this.survey).then(resp =>
     console.log('survey saved for the first time section  ' + currentSection)
    ).catch(error => {
      this.lanzaAlerta('No fue posible guardar el cuestionario : ' + JSON.stringify(error));
    });
  }


  updateAnswersbySection(nextSection, currentSection): any {
    this.survey.version = this.version;
    this.survey.save_date = new Date().toISOString();
    this.survey.survey = JSON.stringify(this.answers);
    this.survey.next_section = nextSection;
    this.dbService.updateAnswersSurvey(this.survey).then(resp =>
      console.log('survey saved for the section  ' + currentSection)
    ).catch(error => {
      this.lanzaAlerta('No fue posible guardar el cuestionario : ' + JSON.stringify(error));
    });
  }

  markSurveyAsCompleted(): any {
    this.dbService.markSurveyCopmleted(this.survey).then(resp =>
      console.log('survey saved as completed for establishment ' + this.survey.establishment_id + ' type ' + this.survey.type)
    ).catch(error => {
      this.lanzaAlerta('No fue posible marcar el cuestionario como completo : ' + JSON.stringify(error));
    });
  }

  public lanzaAlerta(mensaje: string) {
    let alert = this.alertCtrl.create({
      title: '',
      subTitle: mensaje,
      buttons: ['OK']
    });
    alert.present();

  }

}
