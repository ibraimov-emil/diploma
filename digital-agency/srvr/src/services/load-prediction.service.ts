import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SystemMetrics } from '../models/system-metrics.model';
import * as tf from '@tensorflow/tfjs-node';

@Injectable()
export class LoadPredictionService {
  private predictionModel: tf.LayersModel;

  constructor(
    @InjectModel('SystemMetrics') private systemMetricsModel: Model<SystemMetrics>,
  ) {
    this.initializeModel();
  }

  private async initializeModel() {
    // Инициализация модели для прогнозирования нагрузки
    this.predictionModel = tf.sequential({
      layers: [
        tf.layers.lstm({ units: 50, returnSequences: true, inputShape: [24, 5] }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.lstm({ units: 30, returnSequences: false }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 1 })
      ]
    });

    this.predictionModel.compile({
      optimizer: 'adam',
      loss: 'meanSquaredError',
      metrics: ['mae']
    });
  }

  async predictLoad(historicalData: SystemMetrics[]): Promise<number> {
    const features = this.prepareFeatures(historicalData);
    const prediction = await this.predictionModel.predict(features) as tf.Tensor;
    const result = await prediction.data();
    return result[0];
  }

  private prepareFeatures(data: SystemMetrics[]): tf.Tensor {
    // Подготовка данных для модели
    const features = data.map(metric => [
      metric.cpuUsage,
      metric.memoryUsage,
      metric.requestCount,
      metric.responseTime,
      metric.errorRate
    ]);

    return tf.tensor3d([features], [1, features.length, 5]);
  }

  async trainModel(trainingData: SystemMetrics[]): Promise<void> {
    const features = this.prepareFeatures(trainingData);
    const labels = tf.tensor2d(
      trainingData.map(metric => [metric.requestCount]),
      [trainingData.length, 1]
    );

    await this.predictionModel.fit(features, labels, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch}: loss = ${logs.loss}, val_loss = ${logs.val_loss}`);
        }
      }
    });
  }

  async getLoadForecast(hours: number): Promise<{ timestamp: Date; predictedLoad: number }[]> {
    const historicalData = await this.systemMetricsModel
      .find()
      .sort({ timestamp: -1 })
      .limit(24)
      .exec();

    const forecast = [];
    let currentData = [...historicalData];

    for (let i = 0; i < hours; i++) {
      const prediction = await this.predictLoad(currentData);
      const timestamp = new Date();
      timestamp.setHours(timestamp.getHours() + i + 1);

      forecast.push({
        timestamp,
        predictedLoad: prediction
      });

      // Обновляем данные для следующего прогноза
      currentData = currentData.slice(1);
      currentData.push({
        ...currentData[currentData.length - 1],
        requestCount: prediction,
        timestamp
      } as SystemMetrics);
    }

    return forecast;
  }
} 