import { ApplicationRef } from '@angular/core';
import * as Tone from "tone";
import { Drawings } from './drawings.model';


export interface MetroTrack {
    beats: number;
    idx?: number;

    drawings?: Drawings;
    sound: string;
}

export class MetroData {
    bpm: number;
    increase: boolean;
    finalBpm: number;
    stepBpm: number;
    measures: number;
    measureCount: number;
    showBpm: number;
    tracks: MetroTrack[];
}

export class Metronome {
    private data: MetroData;

    public appRef: ApplicationRef;
    private synth: any = [];
    private events: any[] = [];
    private doc: any;
    private longpress: any = 'press';

    constructor(
        appRef: ApplicationRef,
        doc: any
    ) {

        this.appRef = appRef;
        this.doc = doc;

        this.inizializeData();
    }

    public initializeMetronome() {
        this.sortTracks();
        this.clearTracksIndex();
        this.inizializeDrawings(this.doc);
        this.createSamples();
        this.createPart();
        this.refreshActualBpm();
    }

    public inizializeData() {
        this.data = {
            bpm: 120,
            increase: false,
            finalBpm: 160,
            stepBpm: 10,
            measures: 4,
            measureCount: 0,
            showBpm: 120,
            tracks: [
                {
                    beats: 8,
                    idx: 0,
                    sound: "tick.wav",
                },
            ]
        }

        console.table(this.data);
    }

    private inizializeDrawings(doc) {
        let index = 0;
        this.data.tracks.forEach(track => {
            track.drawings = new Drawings(
                track,
                doc,
                this.data.tracks.length,
                this.data.tracks[this.data.tracks.length - 1].beats, //bigger number of beats
                index++
            );
            // console.log(track.drawings)
        });
    }

    private clearTracksIndex() {
        this.data.tracks.forEach(track => {
            track.idx = 0;
            this.data.measureCount = 0;
        })
    }

    private sortTracks() {
        //sort the tracks by beats
        this.data.tracks.sort(function (a, b) {
            let keyA = a.beats, keyB = b.beats;
            // Compare the 2 dates
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        });
        // console.log('sorted:', this.data.tracks)
    }

    public addTrack() {
        let sound: string = "";

        if (this.data.tracks.length < 4) {

            switch (this.data.tracks.length) {
                case 0:
                    sound = "tick.wav";
                    break;
                case 1:
                    sound = "tock.wav";
                    break;
                case 2:
                    sound = "cowbell.wav";
                    break;
                case 3:
                    sound = "ding.wav";
                    break;
            }

            this.data.tracks.push({
                beats: 8,
                idx: 0,
                sound: sound,
            })
        }
        console.log('tracks', this.data.tracks)
    }

    public removeTrack() {
        if (this.data.tracks.length > 1) {
            this.data.tracks.pop();
        }
    }

    // public longPress(parameter: string, operation: string, track?: MetroTrack) {
    //     console.log(this.longpress);


    //     if (this.longpress == 'press') {

    //         this.longpress = setInterval(() => {
    //             this.modSettings(parameter, operation, track);
    //             this.appRef.tick();
    //             console.log(this.longpress)
    //         }, 100);


    //     } else {
    //         clearInterval(this.longpress)
    //         this.longpress = 'press';
    //     }
    // }

    public modSettings(parameter: string, operation: string, track?: MetroTrack) {
        console.log(parameter, operation, track)

        switch (parameter) {

            case "beat":
                switch (operation) {
                    case "add": track.beats++; break;
                    case "remove": track.beats--; break;
                    default: break;
                }
                break;
            case "bpm":
                switch (operation) {
                    case "add": this.data.bpm++; break;
                    case "remove": this.data.bpm--; break;
                    default: break;
                }
                break;
            case "step":
                switch (operation) {
                    case "add": this.data.stepBpm++; break;
                    case "remove": this.data.stepBpm--; break;
                    default: break;
                }
                break;
            case "final":
                switch (operation) {
                    case "add": this.data.finalBpm++; break;
                    case "remove": this.data.finalBpm--; break;
                    default: break;
                }
                break;
            case "measures":
                switch (operation) {
                    case "add": this.data.measures++; break;
                    case "remove": this.data.measures--; break;
                    default: break;
                }
                break;
            default:
                break;
        }
        this.controlValues();
    }

    public getSlider(value) {
        this.data.bpm = value;
        this.controlValues();
    }

    public toggleIncrease(value) {
        if (value) {
            this.data.increase = true;
        }
        else {
            this.data.increase = false;
        }
        console.log(this.data.increase)
    }

    public refreshActualBpm() {
        this.data.showBpm = this.data.bpm;
    }

    private controlValues() {

        if (this.data.bpm < 30) {
            this.data.bpm = 30;
        }
        if (this.data.bpm > 300) {
            this.data.bpm = 300;
        }

        if (this.data.finalBpm < 30) {
            this.data.finalBpm = 30;
        }
        if (this.data.finalBpm > 300) {
            this.data.finalBpm = 300;
        }
        if (this.data.finalBpm - 10 < this.data.bpm) {
            this.data.finalBpm = this.data.bpm + 10;
        }

        if (this.data.stepBpm < 1) {
            this.data.stepBpm = 1;
        }
        if (this.data.stepBpm > 10) {
            this.data.stepBpm = 10;
        }

        if (this.data.measures < 1) {
            this.data.measures = 1;
        }
        if (this.data.measures > 8) {
            this.data.measures = 8;
        }

        this.data.tracks.forEach(track => {
            if (track.beats < 2) {
                track.beats = 2;
            }
            if (track.beats > 12) {
                track.beats = 12;
            }
        });
    }


    private createMeasure(track) {
        console.log(track)
        let measure: any[] = [];

        const repeatMaster = 60 / this.data.bpm * this.data.tracks[0].beats;
        let repeatTime = repeatMaster / track.beats;

        for (let beat = 0; beat < track.beats; beat++) {

            if (beat == 0) {
                measure.push({ time: repeatTime * beat, note: "C3" })
            }
            else {
                measure.push({ time: repeatTime * beat, note: "F2" })
            }
        }
        // console.log(measure);
        return measure;
    }

    createSamples() {
        this.data.tracks.forEach(track => {
            let sampler = new Tone.Sampler({
                urls: {
                    C3: `${track.sound}`,
                },
                baseUrl: "assets/instruments/"

            }).toDestination();
            this.synth.push(sampler)
        })
    }

    private createPart() {
        const repeatMaster = 60 / this.data.bpm * this.data.tracks[0].beats;


        this.data.tracks.forEach((track, i) => {

            let repeatTime = repeatMaster / track.beats;

            let part = new Tone.Part(((time, value) => {
                // the value is an object which contains both the note and the velocity
                this.synth[i].triggerAttackRelease(value.note, "4n", time);

            }), this.createMeasure(track)).start(0);

            let loop = new Tone.Loop((time) => {

                track.drawings.lightBall(track.idx, this.appRef);
                this.increaseBpm();

                track.idx++;

                if (track.idx >= track.beats) {
                    track.idx = 0;
                    this.data.measureCount++;
                }
                // console.log(i, 'track.beats', track.beats, 'idx:', track.idx)
            }, repeatTime).start(0);

            part.loopStart = 0;
            part.loopEnd = repeatMaster;
            part.loop = true;

            this.events.push(part, loop);
        })
    }

    private increaseBpm() {
        if (this.data.increase) {

            if (this.data.showBpm < this.data.finalBpm) {


                if (this.data.measureCount >= this.data.measures) {

                    if (this.data.showBpm + this.data.stepBpm > this.data.finalBpm) {
                        this.data.showBpm == this.data.finalBpm;
                    }
                    else {
                        this.data.showBpm += this.data.stepBpm;
                    }

                    Tone.Transport.bpm.value = this.data.showBpm;

                    this.data.measureCount = 0;
                }
            }
        }
    }

    public cancelEvents() {
        this.events.forEach(event => {
            event.cancel(0);
        })
        this.events = [];
        console.log('events cancelled')
    }

    public play() {
        Tone.Transport.bpm.value = this.data.bpm
        Tone.Transport.position = 0;
        Tone.Transport.start();
    }

    public runMetronome(command: string) {
        console.log('run', this.data.bpm, command)

        switch (command) {
            case "start":

                this.play()

                break;

            case "pause":
                Tone.Transport.pause();
                this.clearTracksIndex()

                break;

            case "stop":
                Tone.Transport.pause();
                Tone.Transport.position = 0;
                this.cancelEvents();
                break;

            case 'addBpm':
                this.data.bpm++;
                this.controlValues();
                break;

            case 'removeBpm':
                this.data.bpm--;
                this.controlValues();
                break;
        }
    }
}

