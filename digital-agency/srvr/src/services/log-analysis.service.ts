import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LogEntry } from '../models/log-entry.model';
import * as tf from '@tensorflow/tfjs-node';

@Injectable()
export class LogAnalysisService {
  private anomalyModel: tf.LayersModel;

  constructor(
    @InjectModel('LogEntry') private logEntryModel: Model<LogEntry>,
  ) {
    this.initializeModel();
  }

  private async initializeModel() {
    // Инициализация модели для обнаружения аномалий
    this.anomalyModel = tf.sequential({
      layers: [
        tf.layers.dense({ units: 64, activation: 'relu', inputShape: [10] }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    this.anomalyModel.compile({
      optimizer: 'adam',
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });
  }

  async detectAnomalies(logs: LogEntry[]): Promise<{ isAnomaly: boolean; score: number }[]> {
    const features = this.extractFeatures(logs);
    const predictions = await this.anomalyModel.predict(features) as tf.Tensor;
    const results = await predictions.array() as number[][];

    return results.map(([score]) => ({
      isAnomaly: score > 0.5,
      score
    }));
  }

  private extractFeatures(logs: LogEntry[]): tf.Tensor {
    // Извлечение признаков из логов
    const features = logs.map(log => [
      log.timestamp.getTime(),
      log.level === 'ERROR' ? 1 : 0,
      log.level === 'WARN' ? 1 : 0,
      log.message.length,
      // Добавьте другие признаки по необходимости
    ]);

    return tf.tensor2d(features);
  }

  async trainModel(trainingData: LogEntry[]): Promise<void> {
    const features = this.extractFeatures(trainingData);
    const labels = tf.ones([trainingData.length, 1]); // Нормальные логи

    await this.anomalyModel.fit(features, labels, {
      epochs: 10,
      batchSize: 32,
      validationSplit: 0.2
    });
  }
} 