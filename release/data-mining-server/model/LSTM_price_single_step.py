import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from numpy import fliplr
from numpy import flipud
from numpy import array
from pandas.io.json import json_normalize
from keras.models import Sequential
from keras.layers import Dense, LSTM, Dropout, Activation
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error
import json
import math
import pymongo
from pymongo import MongoClient
import time

def connect_database(db_url, db_name, collection_name):
    client = MongoClient(db_url, 27017)
    db = client[db_name]
    collection = db[collection_name]
    return db, collection

def data_extraction(collection, field, num_of_docs):
    '''
    extract a certain field('close') of data from the collecttion 
    '''
    return np.array([ x[field] for x in list(collection.find({}, {field:1}))[-num_of_docs:] ])

def take_by_window(dataset, window):
    x, y = [], []
    for i in range(len(dataset) - window ):
        x.append(dataset[i:(i + window)])
        y.append(dataset[i + window,])
    x = np.array(x)
    # print(x.shape)
    y = np.array(y)
    # print(x.shape[0],x.shape[1])
    x = np.reshape(x, (x.shape[0] ,1 , x.shape[1]))
    # print(x.shape)
    return x, y

def pred_model(test, x_train, y_train, step_size=1, num_features=3, epochs=100, batch_size=128, verbose=2, pred_num=1000):
    """
    ML model: LSTM
    Look_back: how many point
    :return:
    """

    model = Sequential()
    #model.add(LSTM(250, input_shape=(step_size, num_features), return_sequences=True))
    #model.add(Dropout(0.2))
    #model.add(LSTM(200))
    model.add(LSTM(4, input_shape=(step_size, num_features), return_sequences=True))
    model.add(Dropout(0))
    model.add(LSTM(4))
    model.add(Dropout(0))
    model.add(Dense(1))  # output file size
    model.add(Activation('tanh'))  # active function
    # model.add(Dropout(0.05))  # drop out regulation
    model.compile(loss='mse', optimizer='adam')
    model.fit(x_train, y_train, epochs=epochs, batch_size=batch_size, verbose=verbose)

    pred_test = model.predict(test)
    pred_train = model.predict(x_train)
    #pred_test = model.predict(x_test)
    #pred_dataset = array(pred_dataset)
    #print(array(x_test).shape, array(y_test).shape)

    #score = model.evaluate(array(x_test[0:-1]), y_test, batch_size=128)

    return pred_train , pred_test

if __name__ == "__main__":
    db_url = "localhost"
    db_name = "Bitcoin"
    product_collection_name = "Product"
    
    while (1):
        np.random.seed(123)
        db, collection = connect_database(db_url, db_name, product_collection_name)
        df = data_extraction(collection, 'close', 10000)
        t = data_extraction(collection, '_id', 10000)

        dataset = df.astype('float32').reshape(-1, 1)
        t = t.astype('int32')
        mms = MinMaxScaler(feature_range=(-1, 1))

        # '''construct a scale based on dataset'''
        dataset = mms.fit_transform(dataset)

        # '''define the size of lookback'''
        window = 10
        train_size = int(len(dataset)*0.9990)
        test_size = len(dataset)-train_size
        x, y = take_by_window(dataset, window)
        x_train, y_train = x[:train_size-window], y[:train_size-window]
        x_test, y_test = x[-window:], y[-window:]

        pred_train, pred_test = pred_model(x_test, x_train, y_train, step_size=1, num_features=window, epochs=50, batch_size=128, verbose=2, pred_num = test_size)

        '''inverse data'''
        pred_train = mms.inverse_transform(pred_train)
        y_train = mms.inverse_transform(y_train)
        pred_test = mms.inverse_transform(pred_test)
        y_test = mms.inverse_transform(y_test)

        testScore = math.sqrt(mean_squared_error(y_test, pred_test[:]))
        # print('Test Score: %.2f MSE' % (testScore))

        '''save the result to database'''
        p_time = int(t[-1]+60)
        print(p_time)
        if 0 == len(list(db.Forecast.find({"_id": p_time}))):
            db.Forecast.insert_one({'_id': p_time, 'forecast': round(float(pred_test[0][0]), 2), 'mse': round(testScore, 5)})

        time.sleep(60)

