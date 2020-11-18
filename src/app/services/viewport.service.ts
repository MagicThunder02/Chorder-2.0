import { Platform } from '@ionic/angular';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ViewPortInfo {
    orientation: string;
    width: number;
    height: number;
    ratio: number;
}

@Injectable({
    providedIn: 'root'
})
export class ViewPortService implements OnDestroy {
    private viewPortInfo: ViewPortInfo = {
        orientation: '',
        width: 0,
        height: 0,
        ratio: 0,
    };

    public viewPortObserver = new BehaviorSubject<ViewPortInfo>(this.viewPortInfo);

    /*--------------------------------------------------------------------------------------------------------------------
    --------------------------------------------------------------------------------------------------------------------*/
    adjustDimension() {
        this.viewPortInfo.width = this.platform.width();
        this.viewPortInfo.height = this.platform.height();
        this.viewPortInfo.ratio = this.viewPortInfo.width / this.viewPortInfo.height;

        // console.log(this.viewPortInfo.ratio);

        // Settiamo all'inizio in base alla rotazione dello schermo
        if (this.platform.isPortrait() && this.viewPortInfo.ratio < 1) {
            this.viewPortInfo.orientation = 'portrait';
        } else {
            this.viewPortInfo.orientation = 'landscape';
        }
        // Notifichiamo la nuova dimensione
        this.viewPortObserver.next(this.viewPortInfo);
    }


    // https://ionicframework.com/docs/angular/platform
    constructor(private platform: Platform) {
        // Impostiamo le dimensioni di partenza
        this.adjustDimension();

        // Riceviamo i cambi di dimensione
        this.platform.resize.subscribe(async () => {
            // Impostiamo le nuove dimensioni
            this.adjustDimension();
        });
    }

    /*--------------------------------------------------------------------------------------------------------------------
    --------------------------------------------------------------------------------------------------------------------*/
    ngOnDestroy() { }
}
