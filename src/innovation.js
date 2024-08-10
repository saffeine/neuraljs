class Innovation {
    constructor(){
        this.neurons = [];
        this.synapses = [];
    };

    getNeuron(innovationId = -1){
        if(innovationId < 0 || innovationId >= this.neurons.length){
            innovationId = -1;
        }

        if(innovationId == -1){
            innovationId = this.neurons.length;
            this.neurons.push(new Neuron(neuronId));
        } return this.neurons(innovationId);
    };

    getSynapse(from, to, ){

    };
}