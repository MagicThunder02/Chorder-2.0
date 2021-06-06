import { ApplicationRef } from '@angular/core';
import * as Tone from "tone";
import { Drawings } from './drawings.model';

export interface MetroTapTimer {
    buffer: number;
    resetTime: number;
    tapFirst: number;
    tapDeltas: number[];
    tapAverage: number;
    tapTimer: any;
    active: boolean;
}

export interface MetroTrack {
    toggle: boolean;
    beats: number;
    idx?: number;
    drawings?: Drawings;
    changeFirstBeat: boolean;
    color: string;
    sound: string;
    synth: any;
}

export class MetroData {
    bpm: number;
    increase: boolean;
    finalBpm: number;
    stepBpm: number;
    measures: number;
    measureCount: number;
    showBpm: number;
    timer: MetroTapTimer;
    tracks: MetroTrack[];
    colors: string[];
    sounds: string[];
}

export class Metronome {
    public data: MetroData;

    public appRef: ApplicationRef;
    private events: any[] = [];
    private doc: any;
    // private longpress: any = 'press';

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
            timer: {
                buffer: 8,
                resetTime: 4000,
                tapFirst: 0,
                tapAverage: 0,
                tapDeltas: [],
                tapTimer: 0,
                active: false,
            },
            tracks: [
                {
                    toggle: false,
                    beats: 4,
                    idx: 0,
                    changeFirstBeat: true,
                    sound: "Tick",
                    color: "#3dc2ff",
                    synth: '',
                },
            ],
            //secondary, success, warning, danger
            colors: ["#3dc2ff", "#2dd36f", "#ffc409", "#eb445a"],
            sounds: ["Tick", "Tock", "Bell", "Tube"],
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
                    sound = "Tick";
                    break;
                case 1:
                    sound = "Tock";
                    break;
                case 2:
                    sound = "Bell";
                    break;
                case 3:
                    sound = "Tube";
                    break;
            }

            this.data.tracks.push({
                toggle: false,
                beats: 4,
                idx: 0,
                changeFirstBeat: true,
                sound: sound,
                color: "#3dc2ff",
                synth: '',
            })
        }
        console.log('tracks', this.data.tracks)
    }

    public removeTrack() {
        if (this.data.tracks.length > 1) {
            this.data.tracks.pop();
        }
    }

    public changeTrackOptions(parameter, operation, track: MetroTrack) {

        let idx: number = 0;

        // if (operation) {

        switch (parameter) {

            case "color":
                idx = this.data.colors.indexOf(track.color) || 0;

                //if the argument is a color 
                // if (operation.includes("#")) {
                //     track.color = operation;
                // }

                if (operation == "add") {
                    idx = (idx + 1) % this.data.colors.length;
                    track.color = this.data.colors[idx];
                }
                if (operation == "remove") {
                    if (idx == 0) {
                        idx = this.data.colors.length;
                    }
                    idx = (idx - 1) % this.data.colors.length;
                    track.color = this.data.colors[idx];
                }

                break;

            case "sound":
                idx = this.data.sounds.indexOf(track.sound);
                if (operation == "add") {
                    idx = (idx + 1) % this.data.sounds.length;
                }
                else {
                    if (idx == 0) {
                        idx = this.data.sounds.length;
                    }
                    idx = (idx - 1) % this.data.sounds.length;
                }
                track.sound = this.data.sounds[idx]
                break;
        }
        // }
    }

    public toggleTrackOptions(event, track: MetroTrack) {
        if (track) {
            if (track.toggle) {
                track.toggle = false;
            }
            else {
                track.toggle = true;
            }
            event.stopPropagation();
        }
    }


    public modSettings(parameter: string, operation: string, track?: MetroTrack) {
        console.log(parameter, operation, track)

        switch (parameter) {

            case "beat":
                switch (operation) {
                    case "add": track.beats++; break;
                    case "remove": track.beats--; break;
                    default: break;
                }

                if (track.beats == 1) {
                    track.changeFirstBeat = false;
                } else {
                    track.changeFirstBeat = true;
                }
                // console.log(track.changeFirstBeat)
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
            if (track.beats < 1) {
                track.beats = 1;
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
                if (track.changeFirstBeat) {
                    measure.push({ time: repeatTime * beat, note: "C3" });
                }
                else {
                    measure.push({ time: repeatTime * beat, note: "F2" });
                }
            }
            else {
                measure.push({ time: repeatTime * beat, note: "F2" });
            }
        }
        // console.log(measure);
        return measure;
    }

    createSamples() {
        this.data.tracks.forEach(track => {
            let sampler = new Tone.Sampler({
                urls: {
                    C3: `${track.sound}.wav`,
                },
                baseUrl: "assets/instruments/"

            }).toDestination();
            track.synth = sampler;
        })
    }

    private createPart() {

        const repeatMaster = 60 / this.data.bpm * this.data.tracks[0].beats;
        Tone.Transport.bpm.value = this.data.bpm;

        this.data.tracks.forEach((track, i) => {

            let repeatTime = repeatMaster / track.beats;

            let part = new Tone.Part(((time, value) => {
                // the value is an object which contains both the note and the velocity
                track.synth.triggerAttackRelease(value.note, "4n", time);

            }), this.createMeasure(track)).start(0);

            let loop = new Tone.Loop((time) => {

                track.drawings.lightBall(track, this.appRef, this);
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

    public tapBpm() {
        this.data.timer.active = true;

        clearTimeout(this.data.timer.tapTimer);
        this.data.timer.tapTimer = setTimeout(() => {
            this.data.timer.tapFirst = 0;
            this.data.timer.tapDeltas = [];
            this.data.timer.tapAverage = 0;
            this.data.timer.active = false;
            console.log('Reset timer!')
        }, this.data.timer.resetTime);


        if (this.data.timer.tapFirst != 0) {
            if (this.data.timer.tapDeltas.length > this.data.timer.buffer) {
                this.data.timer.tapDeltas.shift();
            }
            this.data.timer.tapDeltas.push(60 / ((Date.now() - this.data.timer.tapFirst) / 1000));
            this.data.timer.tapFirst = Date.now();
        }

        if (this.data.timer.tapFirst == 0) {
            this.data.timer.tapFirst = Date.now();
        }
        this.data.timer.tapAverage = 0;
        this.data.timer.tapDeltas.forEach(delta => {
            this.data.timer.tapAverage += delta;
        })

        this.data.timer.tapAverage = this.data.timer.tapAverage / this.data.timer.tapDeltas.length;

        if (this.data.timer.tapAverage) {
            this.data.bpm = Math.round(this.data.timer.tapAverage);
        }
        // console.log('deltas: ' + this.data.timer.tapDeltas, 'timer: ' + this.data.timer.tapTimer)
    }

    public cancelEvents() {
        this.events.forEach(event => {
            event.cancel(0);
        })
        this.events = [];
        console.log('events cancelled')
    }

    public play() {
        Tone.Transport.bpm.value = this.data.bpm;
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

