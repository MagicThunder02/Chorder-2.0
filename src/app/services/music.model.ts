export interface Interval {
    name: string;
    dist: string;
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