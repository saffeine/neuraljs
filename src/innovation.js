/*
    [ INNOVATION ]
    - keeps track of all evolution history (neuron/synapse).
    - provides newly added neurons/synapses with a unique id corresponding to history.
*/

class Innovation {
    constructor(inputs, outputs, hidden = 0){
        this.neuronHistory = [];
        this.synapseHistory = [];

        let inputSpaceY = (1 / (inputs > 0 ? inputs : 1));
        let outputSpaceY = (1 / (outputs > 0 ? outputs : 1));
        let hiddenSpaceY = (1 / (hidden > 0 ? hidden : 1));
        for(let i=0; i<inputs; i++){ this.addNeuron(new Neuron(0, (inputSpaceY / 2) + (inputSpaceY * i), Neuron.TYPES.INPUT)); }
        for(let i=0; i<outputs; i++){ this.addNeuron(new Neuron(1, (outputSpaceY / 2) + (outputSpaceY * i), Neuron.TYPES.OUTPUT)); }
        for(let i=0; i<hidden; i++){ this.addNeuron(new Neuron(0.5, (hiddenSpaceY / 2) + (hiddenSpaceY * i), Neuron.TYPES.HIDDEN)); }
    };

    addNeuron(neuron){
        let innovationId = this.neuronHistory.push(neuron) - 1;
        neuron.innovationId = innovationId;
        return innovationId;
    };

    getNeuron(innovationId = -1){
        if(innovationId < 0 || innovationId > this.neuronHistory.length){
            return undefined;
        } return this.neuronHistory[innovationId];
    };

    addSynapse(synapse){
        let innovationId = this.synapseHistory.push(synapse)-1;
        synapse.innovationId = innovationId;
        return innovationId;
    };

    getSynapse(innovationId = -1){
        if(innovationId < 0 || innovationId > this.synapseHistory.length){
            return undefined;
        } return this.synapseHistory[innovationId];
    };

    getSynapseId(from, to){
        var synapse;

        if(this.getNeuron(to).type == Neuron.TYPES.INPUT){ return; }
        if(this.getNeuron(from).type == Neuron.TYPES.OUTPUT){ return; }

        for(let i in this.synapseHistory){
            synapse = this.synapseHistory[i];
            if(synapse.from != from){ continue; }
            if(synapse.to != to){ continue; }
            return synapse.innovationId;
        } return this.addSynapse(new Synapse(from, to));
    };

    encode(){
        return JSON.stringify({
            neuronHistory: this.neuronHistory,
            synapseHistory: this.synapseHistory
        });
    };

    decode(encodedInnovation){
        let inno = JSON.parse(encodedInnovation);
        this.neuronHistory = inno.neuronHistory;
        this.synapseHistory = inno.synapseHistory;
        return true;
    };
}