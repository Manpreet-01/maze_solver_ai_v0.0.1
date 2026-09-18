class Neuron {

    constructor(inputCount) {

        this.weights = [];

        for (let i = 0; i < inputCount; i++) {
            this.weights.push(random() * 2 - 1);
        }

        this.bias = random() * 2 - 1;

        this.output = 0;
    }

    mutate(amount) {
        for (let i = 0; i < this.weights.length; i++) {
            this.weights[i] += (random() * 2 - 1) * amount;
        }

        this.bias += (random() * 2 - 1) * amount;
        this.output += (random() * 2 - 1) * amount;
    }

    clone() {
        const copy = new Neuron(this.weights.length);

        copy.weights = [...this.weights];
        copy.bias = this.bias;
        copy.output = this.output;

        return copy;
    }

    activate(inputs) {

        let sum = this.bias;

        for (let i = 0; i < inputs.length; i++) {
            sum += inputs[i] * this.weights[i];
        }

        this.output = sigmoid(sum);

        return this.output;
    }

    train(inputs, gradient, learningRate) {

        for (let i = 0; i < this.weights.length; i++) {
            this.weights[i] += learningRate * gradient * inputs[i];
        }

        this.bias += learningRate * gradient;
    }
}