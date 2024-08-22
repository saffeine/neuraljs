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
        } return this.neurons[innovationId];
    };

    getSynapse(innovationId = -1){
        if(innovationId < 0 || innovationId >= this.synapses.length){
            innovationId = -1;
        }

        if(innovationId == -1){
            innovationId = this.neurons.length;
            this.synapses.push(new this.Synapses())
        } return this.synapses[innovationId];
    };

    getSynapseId(from, to){
        for(let i=0; i<this.synapses.length; i++){
            let synapse = this.synapses[i];
            if(synapse.from != from){ continue; }
            if(synapse.to != to){ continue; }
            return synapse.innovationId;
        } return -1;
    };
}