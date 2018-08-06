import { Question } from "./question";

export class Answer {
    public question: Question;
    public number?: number;
    public text?: string = '';
    public option?: any = {};
    public map?: any = {};
    public options?: Array<any> = new Array<any>();

    // Childs (level 2)
    public childNumber?: number;
    public childText?: string = '';
    public childOption?: any = {};
    public childMap?: any = {};
    public childOptions?: Array<any> = new Array<any>();

    // Image
    public imageText?: string;
    public image?: string;
}
