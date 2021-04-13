import { MetroTrack } from "./metronome.model";


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

export class Drawings {
    canvas: MetroCanvas;
    balls: Ball[];
    circle: Circle;
    circRadius: number;

    constructor(
        track: MetroTrack,
        doc: any,
        numTracks: number,
        maxBeats: number,
        index: number
    ) {
        this.getCanvas(doc);
        this.createBalls(track);
        this.calcSmallRadius(track, maxBeats);
        this.calcCircRadiuses(numTracks, index);
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
            this.balls.push(({ color: '#9d9fa6', radius: 0, cX: 0, cY: 0 }))
        }
        this.circle = { color: 'black', radius: 0, thickness: 0, cX: 0, cY: 0 }
    }

    private calcSmallRadius(track: MetroTrack, maxBeats: number) {
        //set radiuses of the balls depending on the beats of the greatest circle
        // console.log(this.canvas)
        this.balls.forEach(ball => {
            if (this.canvas.contentHeight >= this.canvas.contentWidth) {
                ball.radius = this.canvas.contentWidth / (maxBeats * 2);
            } else {
                ball.radius = this.canvas.contentHeight / (maxBeats * 2);
            }
        });
        this.circle.thickness = 2;
        this.circle.color = 'black';
    }

    private calcCircRadiuses(numTracks: number, index: number) {
        //set radiuses of each outern circumference
        let ballRadius = this.balls[0].radius;
        if (this.canvas.contentHeight >= this.canvas.contentWidth) {
            this.circRadius = ((this.canvas.contentWidth / 2) / numTracks) * (index + 1) - ballRadius;
        } else {
            this.circRadius = ((this.canvas.contentHeight / 2) / numTracks) * (index + 1) - ballRadius;
        }
        this.circle.radius = this.circRadius * 2;
    }

    private drawCircles(track: MetroTrack) {

        if (this.canvas.headerHeight) {
            this.balls.forEach((ball, i) => {

                //set x e y
                let x0 = this.canvas.contentWidth / 2 - ball.radius / 2;
                let y0 = this.canvas.contentHeight / 2 - ball.radius;
                let angle = 2 * Math.PI / track.beats * i

                ball.cX = x0 + this.circRadius * Math.cos(angle - Math.PI / 2);
                ball.cY = y0 + this.circRadius * Math.sin(angle - Math.PI / 2);

                this.circle.cX = x0 + this.circRadius * Math.cos(Math.PI) + ball.radius / 2 + this.circle.thickness / 2;
                this.circle.cY = y0 + this.circRadius * Math.sin(- Math.PI / 2) + ball.radius / 2 + this.circle.thickness / 2;

                // console.log('balls drawed', ball.cX, ball.cY)
            })
        }
    }
    public lightBall(idx, appRef) {
        this.balls.forEach(ball => {
            ball.color = '#9d9fa6';
        })
        if (idx == 0) {
            this.balls[idx].color = '#3880ff';
        }
        else {
            this.balls[idx].color = '#50c8ff';
        }
        appRef.tick();
    }
}

