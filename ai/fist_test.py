import numpy as np

# Define the sigmoid activation function
def sigmoid(x):
    return 1 / (1 + np.exp(-x))

# Define the neural network weights
weights = np.array([0.5, 0.5, 0.5, -0.5, -0.5, -0.5])

# Define the training data
X = np.array([[255, 255, 255, 255, 0, 0], [255, 255, 255, 0, 255, 0], [255, 255, 255, 0, 0, 255]])
y = np.array([[255, 0, 0], [0, 255, 0], [0, 0, 255]])

# Define the neural network architecture
input_size = 6
output_size = 3
hidden_size = 5

# Randomly initialize the weights for the input and hidden layer
W1 = np.random.randn(input_size, hidden_size)
W2 = np.random.randn(hidden_size, output_size)

# Define the learning rate and number of iterations
learning_rate = 0.1
iterations = 10000

# Train the neural network
for i in range(iterations):
    # Forward propagation
    layer1 = sigmoid(np.dot(X, W1))
    output = sigmoid(np.dot(layer1, W2))
    
    # Calculate the error
    error = y - output
    
    # Backpropagation
    delta_output = error * (output * (1 - output))
    delta_layer1 = delta_output.dot(W2.T) * (layer1 * (1 - layer1))
    
    # Update the weights
    W2 += layer1.T.dot(delta_output) * learning_rate
    W1 += X.T.dot(delta_layer1) * learning_rate

# Define the input data
input_data = np.array([[255, 255, 255, 255, 0, 0]])

# Make the prediction using the neural network
layer1 = sigmoid(np.dot(input_data, W1))
prediction = sigmoid(np.dot(layer1, W2))

# Print the prediction
print("Background color: {}".format(prediction))