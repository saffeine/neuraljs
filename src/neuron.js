/*
    [ NEURON ]
    - serves as a node inside a genome, holds a value in a network.
    - contains a type value to distinguish input, hidden, output.
    - contains an x and y value for precise manipulation (checking valid connections).
*/

class Neuron {
    static TYPES = {
        INPUT: 0,
        HIDDEN: 1,
        OUTPUT: 2
    };

    constructor(x, y, type = Neuron.TYPES.HIDDEN, innovationNumber = -1){
        this.x = x;
        this.y = y;
        this.type = type;
        this.innovationNumber = innovationNumber;
    };
}