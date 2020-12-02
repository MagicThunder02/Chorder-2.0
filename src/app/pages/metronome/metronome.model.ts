import { ApplicationRef, Optional } from '@angular/core';
import * as Tone from "tone";

export interface Ball {
    color: string;
    radius: number;
    cX: number;
    cY: number;
}

export interface Circle {
    color: string;
    radius: number;
    thickness: number;
    cX: number;
    cY: number;
}

export interface MetroCanvas {
    headerWidth: number;
    headerHeight: number;
    contentWidth: number;
    contentHeight: number;
}

export interface MetroTrack {
    beats: number;
    sounds: string[];
    synth: any;
    voice: any;
    drawings?: Drawings;
}

export interface MetroData {
    bpm: number;
    increase: boolean;
    finalBpm: number;
    stepBpm: number;
    tracks: MetroTrack[];
    canvas: MetroCanvas;
}

export class Metronome {
    private data: MetroData;
    private index: number = 0;
    private appRef: ApplicationRef;

    private synth;

    constructor(
        params: any,
        appRef: ApplicationRef
    ) {
        this.data = params;
        this.appRef = appRef;


        this.sortTracks();


        let index = 0;
        this.data.tracks.forEach(track => {
            track.drawings = new Drawings(
                track,
                this.data.canvas,
                this.data.tracks.length,
                this.data.tracks[this.data.tracks.length - 1].beats, //bigger number of beats
                index++
            );
            track.synth = this.createSynth();
            track.voice = this.createVoice(track.beats);
        });

        Tone.Transport.loop = true;
        Tone.Transport.loopStart = 0;


    }

    private sortTracks() {
        this.data.tracks.sort(function (a, b) {
            let keyA = a.beats, keyB = b.beats;
            // Compare the 2 dates
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        });
        console.log('sorted:', this.data.tracks)
    }


    public controlBpm() {
        if (this.data.bpm < 30) {
            this.data.bpm = 30;
        }
        if (this.data.bpm > 300) {
            this.data.bpm = 300;
        }
    }

    private createSynth() {
        const synth = new Tone.Synth({
            oscillator: {
                type: 'sine',
            },
            envelope: {
                //attack: 0,
                decay: 0.1,
                //sustain: 0,
                release: 0.1,
            }
        }).toDestination();
        return synth
    }

    private createVoice(beats: number) {
        const ratio = 1 / beats;
        const seq = new Tone.Part(this.trigger.bind(this), []);
        seq.start(0);
        seq.loop = true;
        seq.loopStart = 0;
        seq.loopEnd = 1;
        return seq;
    }

    private trigger(time: number, value: any) {
        this.synth.triggerAttackRelease(
            'C4',
            0.01,
            time,
            0.1);
    }
    // private assignPlayer() {
    //     this.data.tracks.forEach((track, i) => {
    //         if (this.data.tracks.length == 1) {
    //             this.synth = new Tone.Players({
    //                 "player1": `assets/${track.sounds[0]}.wav`,
    //                 "player2": `assets/${track.sounds[1]}.wav`
    //             });
    //         }
    //         else {
    //             this.synth = new Tone.Players({
    //                 "player1": `assets/${track.sounds[0]}.wav`,
    //                 "player2": `assets/${track.sounds[1]}.wav`
    //             });
    //         }
    //         this.synth.toMaster();
    //     })

    // }

    public play() {

        Tone.Transport.bpm.value = this.data.bpm;
        console.log(Tone.Transport.bpm.value)

        let player1 = this.synth.get('player1');
        let player2 = this.synth.get('player2');

        const loopA = new Tone.Loop(time => {
            player1.start()
        }, "4n").start(0);

        const loopB = new Tone.Loop(time => {
            player2.start();

        }, '4n').start(0);

        Tone.Transport.start()

    }

    public runMetronome(command: string) {
        console.log('run', this.data.bpm, command)

        switch (command) {
            case "start":
                // this.play();
                Tone.Transport.start()
                break;

            case "pause":
                Tone.Transport.stop();
                break;

            case "stop":
                Tone.Transport.stop();
                break;

            case 'addBpm':
                this.data.bpm++;
                this.controlBpm();
                Tone.Transport.bpm.value = this.data.bpm;
                break;

            case 'removeBpm':
                this.data.bpm--;
                this.controlBpm();
                Tone.Transport.bpm.value = this.data.bpm;
                break;
        }
    }
}


export class Drawings {
    balls: Ball[];
    circle: Circle;
    circRadius: number;

    constructor(
        track: MetroTrack,
        canvas: MetroCanvas,
        numTracks: number,
        maxBeats: number,
        index: number
    ) {
        this.createBalls(track);
        this.calcSmallRadius(track, canvas, maxBeats);
        this.calcCircRadiuses(track, canvas, numTracks, index);
        this.drawCircles(track, canvas);

    }

    private createBalls(track: MetroTrack) {
        //generate the balls, 
        this.balls = [];
        for (let i = 0; i < track.beats; i++) {
            this.balls.push(({ color: 'gray', radius: 0, cX: 0, cY: 0 }))
        }
        this.circle = { color: 'black', radius: 0, thickness: 0, cX: 0, cY: 0 }
    }

    private calcSmallRadius(track: MetroTrack, canvas: MetroCanvas, maxBeats: number) {
        //set radiuses of the balls depending on the beats of the greatest circle
        console.log(canvas)
        this.balls.forEach(ball => {
            if (canvas.contentHeight >= canvas.contentWidth) {
                ball.radius = canvas.contentWidth / (maxBeats * 2);
            } else {
                ball.radius = canvas.contentHeight / (maxBeats * 2);
            }
        });
        this.circle.thickness = this.balls[0].radius / 20;
        this.circle.color = 'black';
    }

    private calcCircRadiuses(track: MetroTrack, canvas: MetroCanvas, numTracks: number, index: number) {
        //set radiuses of each outern circumference
        let ballRadius = this.balls[0].radius;
        if (canvas.contentHeight >= canvas.contentWidth) {
            this.circRadius = ((canvas.contentWidth / 2) / numTracks) * (index + 1) - ballRadius;
        } else {
            this.circRadius = ((canvas.contentHeight / 2) / numTracks) * (index + 1) - ballRadius;
        }
        this.circle.radius = this.circRadius * 2;
        console.log(canvas.contentWidth / 2, numTracks, (index + 1), ballRadius)
    }

    private drawCircles(track: MetroTrack, canvas: MetroCanvas) {
        console.log('balls drawed')

        if (canvas.headerHeight) {
            this.balls.forEach((ball, i) => {

                //set x e y
                let x0 = canvas.contentWidth / 2 - ball.radius / 2;
                let y0 = canvas.contentHeight / 2 - ball.radius;
                let angle = 2 * Math.PI / track.beats * i

                ball.cX = x0 + this.circRadius * Math.cos(angle - Math.PI / 2);
                ball.cY = y0 + this.circRadius * Math.sin(angle - Math.PI / 2);

                this.circle.cX = x0 + this.circRadius * Math.cos(Math.PI) + ball.radius / 2 + this.circle.thickness / 2;
                this.circle.cY = y0 + this.circRadius * Math.sin(- Math.PI / 2) + ball.radius / 2 + this.circle.thickness / 2;
            })
        }
    }
}

