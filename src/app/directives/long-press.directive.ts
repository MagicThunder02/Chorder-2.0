import { EventEmitter, Directive, OnInit, Output, Input, ElementRef } from '@angular/core';
import { timer, Subscription } from 'rxjs';


@Directive({
    selector: '[appLongPress]'
})
export class LongPressDirective implements OnInit {

    timerSub: Subscription;

    @Input() delay: number;
    @Output() longPressed: EventEmitter<any> = new EventEmitter();

    constructor(
        private elementRef: ElementRef<HTMLElement>
    ) { }

    ngOnInit() {
        const isTouch = ('ontouchstart' in document.documentElement);
        const element = this.elementRef.nativeElement;
        element.onpointerdown = (ev) => {
            this.timerSub = timer(this.delay).subscribe(() => {
                this.longPressed.emit(ev);
            });
        };
        element.onpointerup = (ev) => { this.unsub(ev); };
        element.onpointercancel = (ev) => { this.unsub(ev); };
        if (isTouch) {
            element.onpointerleave = (ev) => { this.unsub(ev); };
        }
    }

    private unsub(ev) {
        if (this.timerSub && !this.timerSub.closed) {
            this.timerSub.unsubscribe();
            this.longPressed.emit(ev);
        }
    }

}