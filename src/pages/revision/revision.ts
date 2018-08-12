import { Answer } from './../../models/answer';
import { Question } from './../../models/question';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the RevisionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
 //import { FinCuestPage} from '../index.paginas';

@Component({
  selector: 'page-revision',
  templateUrl: 'revision.html',
})
export class RevisionPage {

  public answersRevision: any[];
  public questionsRevision: any[];
  public sectionRevision: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RevisionPage');
    this.answersRevision = this.navParams.get('answers');
    this.questionsRevision = this.navParams.get('questions');
    this.sectionRevision = this.navParams.get('section');
    console.log(JSON.stringify(this.answersRevision));
    // console.log(JSON.stringify(this.questionsRevision));
    console.log(JSON.stringify(this.sectionRevision));
    console.log(JSON.stringify(this.answersRevision[0].question.sentense));
  }

  cambiar_pagina() {
    //this.navCtrl.setRoot(FinCuestPage);
  }

  getOptions(answer: Answer){
    let question = this.questionsRevision.find(question => question.id === answer.question.id);
    return question.respuestas;

  }

}
