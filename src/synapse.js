/*
    [ SYNAPSE ]
    - serves as a connection between neurons.
    - potentially holds a weight value, undecided.
    - contains a 'from' and 'to' value to link neurons.
*/

class Synapse {
    constructor(from, to, innovationId = -1){
        this.from = from;
        this.to = to;
        this.innovationId = innovationId;
    };
}