import { MetroTrack } from "./metronome.model";


export interface Ball {
    color: string;
    diameter: number;
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

export class Drawings {
    canvas: MetroCanvas;
    balls: Ball[];
    circle: Circle;
    circDiameter: number;

    constructor(
        track: MetroTrack,
        doc: any,
        numTracks: number,
        maxBeats: number,
        index: number
    ) {
        this.getCanvas(doc);
        this.createBalls(track);
        this.calcBallDiameter(track, maxBeats);
        this.calcCircRadius(numTracks, index);
        this.drawCircles(track);
    }

    private getCanvas(doc) {
        //passes height of header and content
        let content = doc.getElementById('content');
        let header = doc.getElementById('header');

        this.canvas = {
            headerWidth: header.clientWidth,
            headerHeight: header.clientHeight,
            contentWidth: content.clientWidth,
            contentHeight: content.clientHeight,
        }
    }

    private createBalls(track: MetroTrack) {
        //generate the balls, 
        this.balls = [];
        for (let i = 0; i < track.beats; i++) {
            this.balls.push(({ color: '#9d9fa6', diameter: 0, cX: 0, cY: 0 }))
        }
        this.circle = { color: 'black', radius: 0, thickness: 0, cX: 0, cY: 0 }
    }

    private calcBallDiameter(track: MetroTrack, maxBeats: number) {
        //set diameteres of the balls depending on the beats of the greatest circle
        // console.log(this.canvas)
        this.balls.forEach(ball => {
            if (this.canvas.contentHeight >= this.canvas.contentWidth) {

                ball.diameter = this.canvas.contentWidth / (maxBeats * 2);
                if (ball.diameter > 40) {
                    ball.diameter = 40;
                }

                if (track.beats == 1) {
                    ball.diameter = 70
                }

            } else {
                ball.diameter = this.canvas.contentHeight / (maxBeats * 2);
            }
        });
        this.circle.thickness = 2;
        this.circle.color = 'black';
    }

    private calcCircRadius(numTracks: number, index: number) {
        //set diameteres of each outern circumference
        let ballDiameter = this.balls[0].diameter;
        if (this.canvas.contentHeight >= this.canvas.contentWidth) {
            this.circDiameter = ((this.canvas.contentWidth / 2) / numTracks) * (index + 1) - ballDiameter;
        } else {
            this.circDiameter = ((this.canvas.contentHeight / 2) / numTracks) * (index + 1) - ballDiameter;
        }
        this.circle.radius = this.circDiameter * 2;
    }

    private drawCircles(track: MetroTrack) {

        if (this.canvas.headerHeight) {
            this.balls.forEach((ball, i) => {

                //set x e y
                let x0 = this.canvas.contentWidth / 2 - ball.diameter / 2;
                let y0 = this.canvas.contentHeight / 2 - ball.diameter / 2;
                let angle = 2 * Math.PI / track.beats * i

                ball.cX = x0 + this.circDiameter * Math.cos(angle - Math.PI / 2);
                ball.cY = y0 + this.circDiameter * Math.sin(angle - Math.PI / 2);


                this.circle.cX = x0 + this.circDiameter * Math.cos(Math.PI) + ball.diameter / 2 + this.circle.thickness / 2;
                this.circle.cY = y0 + this.circDiameter * Math.sin(- Math.PI / 2) + ball.diameter / 2 + this.circle.thickness / 2;

                if (track.beats == 1) {
                    ball.cX = x0;
                    ball.cY = y0;
                }
                // console.log('balls drawed', x0, y0, ball.diameter)
            })
        }
    }

    public lightBall(track, appRef, time) {

        //if 1 beats the ball pulse slower
        if (track.beats == 1) {
            time = time * 500;
        } else {
            time = time * 750;
        }

        // switch off the ball
        setTimeout(() => {
            this.balls.forEach(ball => {
                ball.color = '#9d9fa6'; //grey
            })
        }, time)


        // switch on the ball
        if (track.idx == 0) {
            if (track.changeFirstBeat) {
                this.balls[track.idx].color = this.shadeColor(track.color, -80);
            } else {
                this.balls[track.idx].color = track.color;
            }
        }
        else {
            this.balls[track.idx].color = track.color;
        }
        appRef.tick();
    }

    private shadeColor(color: string, amount: number) {

        return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
    }
}

