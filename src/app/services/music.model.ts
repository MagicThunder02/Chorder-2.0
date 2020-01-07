export interface Interval {
    name: string;
    dist: string;
    hide?:boolean;
}

export interface Tonality {
    Name: string;
    intervals: Interval[];
}

export interface Chord {
    names: string[];
    category: string;
    formula: string[];
    showCard?: boolean;
}

export interface Music {
    tonalities: Tonality[];
    chords: Chord[];
}

export interface ChordComponent {
    selected: string;
    intervals: Interval[];
    octaveSelected: boolean;
    octaveEnable: boolean;
}