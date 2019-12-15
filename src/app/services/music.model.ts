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
    formula: string[];
}

export interface Music {
    tonalities: Tonality[];
    chords: Chord[];
}

export interface ChordComponent {
    selected: string;
    intervals: Interval[];
}