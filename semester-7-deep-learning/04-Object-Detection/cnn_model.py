import tensorflow as tf
from tensorflow.keras import layers, models
import os

def create_model():
    model = models.Sequential([
        layers.Conv2D(32, (3, 3), activation='relu', input_shape=(28, 28, 1)),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Flatten(),
        layers.Dense(64, activation='relu'),
        layers.Dense(10, activation='softmax')
    ])
    model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
    return model

def train_and_save_model(save_path='model_mnist.h5'):
    (x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()
    x_train = x_train.reshape((60000, 28, 28, 1)).astype('float32') / 255
    x_test = x_test.reshape((10000, 28, 28, 1)).astype('float32') / 255
    model = create_model()
    print("Mulai training model CNN...")
    history = model.fit(x_train, y_train, epochs=5, batch_size=64, validation_split=0.1)
    model.save(save_path)
    print(f"Model berhasil disimpan di {save_path}")
    return history

def load_trained_model(model_path='model_mnist.h5'):
    if os.path.exists(model_path):
        return tf.keras.models.load_model(model_path)
    else:
        return None