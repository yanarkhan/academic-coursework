from sklearn.preprocessing import MinMaxScaler, RobustScaler, MaxAbsScaler, StandardScaler, Normalizer
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

#__train_filepath = 'Tesla_Stocks_Train.csv'
#__test_filepath = 'Tesla_Stocks_Test.csv'
#__train_filepath = 'Data_Historis_AALI_Train.csv'
#__test_filepath = 'Data_Historis_AALI_Test.csv'
#__train_filepath = 'Data Historis CUAN_Train2.csv'
#__test_filepath = 'Data Historis CUAN_Test2.csv'
__train_filepath = 'Data Historis BBCA_Train2.csv'
__test_filepath = 'Data Historis BBCA_Test2.csv'

__scalers = {
    'MinMax':       MinMaxScaler(feature_range=(0, 1)),
    'RobustScaler': RobustScaler(quantile_range=(25.0, 75.0)),
    'MaxAbs':       MaxAbsScaler(),
    'Standard':     StandardScaler(),
    'Normalizer':   Normalizer()
}

# Preprocesses the data: Removes 'Adj Close' column AND Scales the data.
def preprocess(data, scaling_method):
    del data['Adj Close'], data['Date']

    if scaling_method is not None:
        scaler = __scalers[scaling_method]
        data = scaler.fit_transform(data)
    return data


# Reads the data from csv file.
scm = 'RobustScaler'
#scm = 'MinMax'

def read_data(preprocessing=True, scaling_method=scm):
    train_data = pd.read_csv(__train_filepath,delimiter=";")
    test_data = pd.read_csv(__test_filepath,delimiter=";")

    print("20 data train pertama: \n", train_data.head(20))
    print("20 data test pertama: \n", test_data.head(20))

    if preprocessing:
        train_data = preprocess(train_data, scaling_method)
        test_data = preprocess(test_data, scaling_method)
    
    #print(train_data)
    return train_data, test_data


# Constructs dataframes for both train and test data.
def construct_time_frames(data, frame_size=64):
    num_of_samples = data.shape[0]
    x_train = [data[i-frame_size: i] for i in range(frame_size, num_of_samples)]
    y_train = [data[i, 0: 1] for i in range(frame_size, num_of_samples)]

    print("*****Hasil conctruct Train data ***** \n",x_train)
    print("*****Hasil conctruct Test data ***** \n", y_train)

    return np.array(x_train), np.array(y_train)


# Visualising the prediction & actual stock open value.
def plot_prediction(y_test, y_predicted, test_label, prediction_label):
    plt.plot(y_test, color='red', label=test_label)
    plt.plot(y_predicted, color='blue', label=prediction_label)
    plt.title('Prediksi Harga Saham')
    plt.xlabel('Time')
    plt.ylabel('Harga Saham Pembukaan')
    plt.legend()
    plt.show()
