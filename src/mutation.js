/*
    [ MUTATION ]
    - handles the alteration of a genome.
*/

class Mutation {
    constructor(){
    }
}

class MutationConfig {
    constructor(config = {}){
        this.neuronAddChance = config['neuronAddChance'] ?? 0;
        this.neuronRemoveChance = config['neuronRemoveChance'] ?? 0;
        this.synapseAddChance = config['synapseAddChance'] ?? 0;
        this.synapseRemoveChance = config['synapseRemoveChance'] ?? 0;
        this.synapseChangeWeightChance = config['synapseChangeWeightChance'] ?? 0;
    };
}