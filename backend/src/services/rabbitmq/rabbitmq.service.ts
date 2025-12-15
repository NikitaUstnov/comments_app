import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, Connection, Channel } from 'amqplib';

@Injectable()
export class RabbitService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('RabbitService');

  private connection: Connection;
  private channels: Map<string, Channel> = new Map();

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const uri = this.configService.get('RABBITMQ_URL', 'amqp://localhost:5672');
    try {
      this.connection = await connect(uri);
      this.logger.log('RabbitMQ connected');
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ', error);
      throw error;
    }
  }

  async createChannel(queueName: string): Promise<Channel> {
    if (!this.connection) {
      throw new Error('RabbitMQ connection not initialized');
    }

    if (this.channels.has(queueName)) {
      return this.channels.get(queueName);
    }

    const channel = await this.connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });
    this.channels.set(queueName, channel);

    this.logger.log(`Queue "${queueName}" is ready`);
    return channel;
  }

  async sendToQueue(queueName: string, data: any) {
    const channel = await this.createChannel(queueName);
    const success = channel.sendToQueue(
      queueName,
      Buffer.from(JSON.stringify(data)),
      { persistent: true },
    );

    if (success) {
      this.logger.log(`Sent message to "${queueName}"`);
    } else {
      this.logger.warn(`Failed to send message to "${queueName}"`);
    }
  }

  async consume(
    queueName: string,
    callback: (data: any) => Promise<void>,
    prefetchCount = 10, // 10 parallel messages to process
  ) {
    const channel = await this.createChannel(queueName);
    this.logger.log(`🧾 Listening on queue "${queueName}"`);

    await channel.prefetch(prefetchCount);

    await channel.consume(queueName, async (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString());
        this.logger.log(`📥 Received message from "${queueName}"`);

        try {
          await callback(data);
          channel.ack(msg);
          this.logger.log(`Message processed successfully`);
        } catch (err) {
          this.logger.error(`Failed to process message`, err);

          const retries = msg.properties.headers['x-retries'] || 0;

          if (retries < 3) {
            channel.sendToQueue(queueName, msg.content, {
              headers: { 'x-retries': retries + 1 },
              persistent: true,
            });
            this.logger.warn(`Retrying message, attempt ${retries + 1}`);
          } else {
            this.logger.error(`Dropping message after 3 attempts`);
          }

          channel.ack(msg);
        }
      }
    });
  }

  async onModuleDestroy() {
    for (const channel of this.channels.values()) {
      await channel.close();
    }
    await this.connection?.close();
    this.logger.log('RabbitMQ Connection closed');
  }
}
