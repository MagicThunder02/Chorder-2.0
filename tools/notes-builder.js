const fs = require('fs')

// List all files in a directory in Node.js recursively in a synchronous fashion
var scanSvg = function (dir) {

    // Leggiamo la cartella svg, cioè la root con le directory instruments
    instruments = fs.readdirSync(dir);
    let instrumentsObjs = {}

    // Iteriamo sui instruments
    instruments.forEach(function (instrument) {
        // Verifichiamo sia una directory
        if (fs.statSync(dir + instrument).isDirectory()) {
            // Leggiamo le notee di quel instrument
            notes = fs.readdirSync(dir + instrument);
            let notesObjs = []
            // Iteriamo sulle notee di quel instrument
            notes.forEach(function (note) {
                // Verifichiamo sia un file
                if (fs.statSync(dir + instrument + '/' + note).isFile()) {
                    // Aggiungiamo l'notea alla lista 
                    let tmp = note.split('.')
                    
                    if (tmp[1] == 'mp3') {
                        notesObjs.push({
                            'name': tmp[0]
                        })
                    }
                }
            })
            // Aggiungiamo l'array alla categoria
            instrumentsObjs[instrument] = {
                'name': instrument,
                'notes': notesObjs
            }
        }
    });

    return {
        'instruments': instrumentsObjs
    };
};

// Apriamo la cartella degli svg
let obj = scanSvg('../src/assets/instruments/');
// Salviamo su file la struttura
let data = JSON.stringify(obj, null, ' ');
fs.writeFileSync('../src/assets/instruments.json', data);
