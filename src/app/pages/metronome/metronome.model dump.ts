import { Platform } from '@ionic/angular';
import * as Tone from "tone";

export class Metronome {
    private increase?: boolean = false;
    private bpm: number;
    private beats: number;
    private initialBpm?: number
    private finalBpm?: number
    private stepBpm?: number;
    private stepMeasure?: number;
    private countMeasure?: number;
    private counter: number = 0;
    public circles: circle[] = [];
    private circRadius: number;
    private smallRadius: number;
    private myTimer: any;
    public sound1: string;
    public sound2: string;
    private tik: any;
    private tok: any;
    private platform: Platform;

    /*-----------------------------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------------------------*/
    constructor(params: any) {
        this.sound1 = params.sound1
        // console.log('tick: ', params.tik, this.sound1)
        this.platform = params.platform;
        this.bpm = params.bpm;
        this.beats = params.beats;
        this.circRadius = params.circRadius;
        this.smallRadius = params.smallRadius;
        // this.tik = new Tone.Player(`assets/${params.tik}.wav`).toMaster();
        this.tik = new Tone.Player(`assets/tick.wav`).toMaster();
        this.tok = new Tone.Player(`assets/${params.sound1}.wav`).toMaster();
        Tone.loaded();
        Tone.context.resume();
        this.beatChange();
        this.drawCircles();

    }

    public beatChange() {
        this.circles = [];
        for (let i = 0; i < this.beats; i++) {
            this.circles.push({ color: 'gray', radius: '', cX: '5px', cY: '5px', index: i })
        }
    }

    public controlValues() {
        if (this.bpm < 30) {
            this.bpm = 30;
        }
        if (this.bpm > 300) {
            this.bpm = 300;
        }
        if (this.beats < 1) {
            this.beats = 1;
        } if (this.beats > 12) {
            this.beats = 12;
        }
        if (this.initialBpm < 30) {
            this.initialBpm = 30;
        }
        if (this.initialBpm > 300) {
            this.initialBpm = 300;
        }
        if (this.finalBpm < 30) {
            this.finalBpm = 30;
        }
        if (this.finalBpm > 300) {
            this.finalBpm = 300;
        }
        if (this.stepBpm < 1) {
            this.stepBpm = 1;
        }
        if (this.stepBpm > 30) {
            this.stepBpm = 30;
        } if (this.stepMeasure < 1) {
            this.stepMeasure = 1;
        }
        if (this.stepMeasure > 10) {
            this.stepMeasure = 10;
        }
    }

    public addBeat() {
        this.beats++;
        this.controlValues();
    }
    public removeBeat() {
        this.beats--;
        this.controlValues();
    }

    public tick() {

        //se è acceso lo spegne
        if (this.myTimer) {
            clearInterval(this.myTimer);
        }

        //accende 
        this.myTimer = setInterval(() => {

            if (this.counter > this.beats - 1) {
                this.counter = 0;
            }
            //inizializiamo i pallini grigi
            this.circles.forEach(circle => {
                circle.color = 'grey'
            })

            if (this.counter == 0) {
                if (this.increase) {
                    //se è l'ultima battuta e iniziale e finale sono diversi
                    if (this.countMeasure == this.stepMeasure - 1) {
                        this.countMeasure = 0;

                        if (this.finalBpm > this.initialBpm) {
                            this.bpm = this.bpm + this.stepBpm;
                            if (this.bpm > this.finalBpm) {
                                this.bpm = this.finalBpm;
                            }
                        } else {
                            this.bpm = this.bpm - this.stepBpm;
                            if (this.bpm < this.finalBpm) {
                                this.bpm = this.finalBpm;
                            }
                        }

                    } else {
                        this.countMeasure++;
                    }
                }
                this.tik.start()
                this.circles[this.counter].color = 'red';
                // console.log('counter:', this.counter, 'countmeasure:', this.countMeasure)
            }
            else {
                this.tok.start()
                this.circles[this.counter].color = 'yellow';
            }

            // console.log('increased bpm:', this.bpm, 'countmeasure:', this.countMeasure)
            this.counter++;

        }, (60 / this.bpm) * 1000);
    }

    public drawCircles() {
        let container = document.getElementById('content')
        let header = document.getElementById('header')
        console.log('s', this.smallRadius, 'R', this.circRadius)

        if (header) {
            this.circles.forEach((circle, i) => {
                circle.color = 'grey';

                circle.radius = this.smallRadius;

                //set x e y
                circle.cX = container.clientWidth / 2 - circle.radius / 2;
                circle.cY = (container.clientHeight / this.beats - circle.radius / 2) * i + header.scrollHeight / 2;

                if (this.beats > 2) {

                    let x0 = container.clientWidth / 2 - circle.radius / 2;
                    let y0 = container.clientHeight / 2 - circle.radius + header.scrollHeight;
                    let angle = 2 * Math.PI / this.beats * i

                    circle.cX = x0 + this.circRadius * Math.cos(angle - Math.PI / 2);
                    circle.cY = y0 + this.circRadius * Math.sin(angle - Math.PI / 2);

                }

            })
        }
        console.log(this.circles)
    }


    public runMetronome(command: string) {
        console.log('run', this.bpm, command)

        switch (command) {
            case "start":
                this.counter = 0;
                this.countMeasure = 0;
                this.tick();
                break;
            case "pause":

                //se è acceso lo spegne
                clearInterval(this.myTimer);
                this.tick();
                Tone.Transport.bpm.value = this.bpm;
                Tone.Transport.stop();
                Tone.Transport.start();

                break;

            case "stop":
                clearInterval(this.myTimer);
                Tone.Transport.stop();
                break;
            case 'addBpm':
                this.bpm++;
                break;
            case 'removeBpm':
                this.bpm--;
                break;
        }
    }
}


export interface circle {
    color: string;
    radius: any;
    cX: any;
    cY: any;
    index: number;
}
