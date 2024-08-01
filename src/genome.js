/*
    [ GENOME ]
    - based on an innovation, create a network of neurons and synapses.
    - can be mutated, adds new features to the innovation's history.
    - can be bred with another genome to produce a potentially fitter result.
    - this is the 'raw' data of a network, to be processed by the brain.
*/

class Genome {
    constructor(innovation){
        this.inputNeurons = [];         // contains all of the ids of input neurons.
        this.outputNeurons = [];        // contains all of the ids of output neurons.
        this.hiddenNeurons = [];        // contains all of the ids of hidden neurons.
        this.synapses = [];             // contains all of the ids of synapses.
        this.innovation = innovation;   // determines which innovation history the previous ids correspond to.
    };

    /*
        [ FUNCTIONALITY ]
    */

    instantiate(innovation = undefined){
        let inputNeurons, outputNeurons;
        this.innovation = innovation ?? this.innovation;
        this.inputNeurons = [];
        this.outputNeurons = [];
        this.hiddenNeurons = [];
        this.synapses = [];

        for(let i in this.innovation.neuronHistory){
            let neuron = this.innovation.getNeuron(i);
            let innovationId = neuron.innovationId;
            let isHidden = (neuron.type == Neuron.TYPES.HIDDEN);
            
            if(isHidden){ continue; }
            this.addNeuron(neuron.innovationId);
        }

        for(let i in this.inputNeurons){
        for(let j in this.outputNeurons){
            let from = this.inputNeurons[i];
            let to = this.outputNeurons[j];
            this.addSynapse(from, to);
        }
        }

        return;
    };

    /*
        [ NEURONS ]
    */

    addNeuron(innovationId = -1){
        let neuron = this.innovation.getNeuron(innovationId);
        if(this.hasNeuron(innovationId)){ return false; }
        if(neuron.type == Neuron.TYPES.INPUT){ return this.inputNeurons.push(neuron.innovationId) - 1; }
        if(neuron.type == Neuron.TYPES.OUTPUT){ return this.outputNeurons.push(neuron.innovationId) - 1; }
        return this.hiddenNeurons.push(neuron.innovationId) - 1;
    };

    hasNeuron(innovationId){
        let totalNeurons = this.getTotalNeurons();
        for(let i in totalNeurons){ 
            if(totalNeurons[i] == innovationId){ return true; }
        }
        return false;
    };

    getTotalNeurons(){
        let neurons = [];
        for(let i in this.inputNeurons){ neurons.push(this.inputNeurons[i]); }
        for(let i in this.outputNeurons){ neurons.push(this.outputNeurons[i]); }
        for(let i in this.hiddenNeurons){ neurons.push(this.hiddenNeurons[i]); }
        return neurons;
    };

    removeNeuron(innovationId){
        let oldNeurons = this.hiddenNeurons;

        this.hiddenNeurons = [];
        for(let i in oldNeurons){
            if(oldNeurons[i] == innovationId){
                this.removeNeuronConnections(innovationId);
                continue;
            } this.hiddenNeurons.push(oldNeurons[i]);
        } return;
    };

    removeNeuronConnections(innovationId){
        let synapses = [];
        let oldSynapses = this.synapses;

        for(let i in oldSynapses){
            let synapse = this.innovation.getSynapse(oldSynapses[i]);
            if(!synapse){ continue; }
            if(synapse.to == innovationId || synapse.from == innovationId){
                this.removeSynapse(synapse.innovationId);
                synapses.push(synapse.innovationId);
            }
        } return synapses;
    };

    /*
        [ SYNAPSES ]
    */

    addSynapse(from, to){
        let synapse = this.innovation.getSynapseId(from, to);
        if(synapse == undefined){ return false; }
        if(this.hasSynapse(synapse)){ return false; }
        return this.synapses.push(synapse) - 1;
    };

    hasSynapse(innovationId){
        for(let i in this.synapses){
            if(this.synapses[i] == innovationId){ return true; }
        } return false;
    };

    removeSynapse(innovationId){
        let oldSynapses = this.synapses;

        this.synapses = [];
        for(let i in oldSynapses){
            if(oldSynapses[i] == innovationId){ continue; }
            this.synapses.push(oldSynapses[i]);
        }; return;
    };

    /*
        [ MUTATIONS ]
    */

    mutate(mutationConfig = {}){
        if(Math.random() <= mutationConfig.neuronAddChance){ this.mutateAddNeuron(); }
        if(Math.random() <= mutationConfig.neuronRemoveChance){ this.mutateDisableNeuron(); }
        if(Math.random() <= mutationConfig.synapseAddChance){ this.mutateAddSynapse(); }
        if(Math.random() <= mutationConfig.synapseRemoveChance){ this.mutateDisableSynapse(); }
        if(Math.random() <= mutationConfig.synapseChangeWeightChance){ this.mutateChangeSynapseWeight(); }
    };

    mutateAddNeuron(){
        let synapse = this.synapses[Math.floor((Math.random() * this.synapses.length) % this.synapses.length)];
        let from = this.innovation.getSynapse(synapse).from;
        let to = this.innovation.getSynapse(synapse).to;
        let x = (this.innovation.getNeuron(from).x + this.innovation.getNeuron(to).x) / 2;
        let y = (this.innovation.getNeuron(from).y + this.innovation.getNeuron(to).y) / 2;
        let neuron = this.innovation.addNeuron(new Neuron(x, y, Neuron.TYPES.HIDDEN));
        
        this.addNeuron(neuron);
        this.removeSynapse(this.innovation.getSynapse(synapse).innovationId);
        this.addSynapse(from, neuron);
        this.addSynapse(neuron, to);
        return;
    };

    mutateRemoveNeuron(){
        let neuron = this.hiddenNeurons[Math.floor((Math.random() * this.hiddenNeurons.length) % this.hiddenNeurons.length)];
        this.removeNeuron(neuron); return;
    };

    mutateAddSynapse(){
        let attempts = 3;
        
        for(var i=0; i<attempts; i++){
            let from;
            let to;
            let foundPair = false;
            let totalNeurons = this.getTotalNeurons();

            while(!foundPair){
                let valid = true;
                let count = totalNeurons.length;
                let fromNeuron = this.innovation.getNeuron(totalNeurons[Math.floor(Math.random() * count) % count]);
                let toNeuron = this.innovation.getNeuron(totalNeurons[Math.floor(Math.random() * count) % count]);

                if(fromNeuron.type == Neuron.TYPES.INPUT && toNeuron.type == Neuron.TYPES.INPUT){ valid = false; }
                if(fromNeuron.type == Neuron.TYPES.OUTPUT && toNeuron.type == Neuron.TYPES.OUTPUT){ valid = false; }
                if(valid){ from = fromNeuron.innovationId; to = toNeuron.innovationId; foundPair = true; }
            }

            if(this.addSynapse(from, to)){ break; };
        } return;
    }

    /*
        [ ENCODING ]
    */

    encode(){
        let encodedGenome = JSON.stringify({
            inputNeurons: this.inputNeurons,
            outputNeurons: this.outputNeurons,
            hiddenNeurons: this.hiddenNeurons,
            synapses: this.synapses
        });

        return encodedGenome;
    };

    decode(encodedGenome){
        let decodedGenome = JSON.parse(encodedGenome);

        this.inputNeurons = decodedGenome['inputNeurons'] ?? [];
        this.outputNeurons = decodedGenome['outputNeurons'] ?? [];
        this.hiddenNeurons = decodedGenome['hiddenNeurons'] ?? [];
        this.synapses = decodedGenome['synapses'] ?? [];

        return decodedGenome;
    }
}