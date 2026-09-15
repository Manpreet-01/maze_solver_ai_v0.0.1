class Network {
    constructor() {
        this.hidden = new Layer(4, 5);      // 4 sensors or weights and 5 neurons
        this.output = new Layer(5, 4);  // 5 weights and 4 neurons for 4 outputs
        this.fitness = 0;
    }
    setFitness(fitness){
        this.fitness = fitness;
    }

    predict(inputs) {
        const hidden = this.hidden.forward(inputs);
        const output = this.output.forward(hidden);
        return output;
    }

    clone() {
        const copy = new Network();

        for (let i = 0; i < this.hidden.neurons.length; i++) {
            copy.hidden.neurons[i] = this.hidden.neurons[i].clone();
        }

        for (let i = 0; i < this.output.neurons.length; i++) {
            copy.output.neurons[i] = this.output.neurons[i].clone();
        }

        copy.fitness = this.fitness;

        return copy;
    }

    mutate(amount) {
        for (const neuron of this.hidden.neurons) {
            neuron.mutate(amount);
        }

        for (const neuron of this.output.neurons) {
            neuron.mutate(amount);
        }
    }

    train(inputs, target, learningRate) {
        console.log("training Network")
        // Forward pass
        const hidden = this.hidden.forward(inputs);

        const prediction = this.output.forward(hidden)[0];

        // Output gradient
        const error = target - prediction;

        const outputGradient = error * sigmoidDerivative(prediction);
        
        // Update output neuron
        const outputNeuron = this.output.neurons[0];

        const oldOutputWeights = [...outputNeuron.weights]; // make copy


        outputNeuron.train(hidden, outputGradient, learningRate);

        // Hidden gradients
        for (let i = 0; i < this.hidden.neurons.length; i++) {
            const hiddenNeuron = this.hidden.neurons[i];

            const hiddenGradient =
                outputGradient *
                oldOutputWeights[i] *           // using copy here
                sigmoidDerivative(hiddenNeuron.output);

            hiddenNeuron.train(inputs, hiddenGradient, learningRate);
        }

        return error * error;
    }
}