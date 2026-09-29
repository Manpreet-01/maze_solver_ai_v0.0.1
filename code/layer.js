class Layer {

    constructor(inputCount, neuronCount) {

        this.neurons = [];

        for (let i = 0; i < neuronCount; i++) {
            this.neurons.push(
                new Neuron(inputCount)
            );
        }
    }

    // forward means activate and give output
    forward(inputs) {

        const outputs = [];

        for (const neuron of this.neurons) {
            outputs.push(
                neuron.activate(inputs)
            );
        }

        return outputs;
    }
}