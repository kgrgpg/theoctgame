import { KafkaClient, Producer, Consumer, Message } from 'kafka-node';
import { Subject } from 'rxjs';

const kafkaHost = process.env.KAFKA_HOST || 'localhost:9092';
const client = new KafkaClient({ kafkaHost });
const producer = new Producer(client);
const consumer = new Consumer(
  client,
  [{ topic: 'player-updates', partition: 0 }],
  { autoCommit: true }
);

export const kafkaProducerStream = new Subject<Message>();
export const kafkaConsumerStream = new Subject<Message>();

producer.on('ready', () => {
  console.log('Kafka Producer is connected and ready.');
});

producer.on('error', (error) => {
  console.error('Kafka Producer error:', error);
});

consumer.on('message', (message) => {
  kafkaConsumerStream.next(message);
});

consumer.on('error', (error) => {
  console.error('Kafka Consumer error:', error);
});

export const sendKafkaMessage = (message: Message) => {
  producer.send([{ topic: 'player-updates', messages: [JSON.stringify(message)] }], (err, data) => {
    if (err) {
      console.error('Error sending Kafka message:', err);
    }
  });
};
