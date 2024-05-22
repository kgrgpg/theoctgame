import { KafkaClient, Producer, Consumer, Message } from 'kafka-node';
import { Subject, from, Observable } from 'rxjs';
import { promisify } from 'util';
import { map } from 'rxjs/operators';

const kafkaHost = process.env.KAFKA_BROKER || 'localhost:9092';
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

const createTopic = (topic: string): Observable<void> => {
  const createTopicsAsync = promisify(client.createTopics).bind(client);
  return from(createTopicsAsync([{ topic, partitions: 1, replicationFactor: 1 }])).pipe(
    map(() => {})
  );
};

export const sendKafkaMessage = (message: Message): void => {
  producer.send([{ topic: 'player-updates', messages: [JSON.stringify(message)] }], (err, data) => {
    if (err) {
      console.error('Error sending Kafka message:', err);
    } else {
      console.log('Message sent to Kafka:', data);
    }
  });
};

// Ensure the topic is created before using it
createTopic('player-updates').subscribe({
  next: () => {
    console.log('Topic player-updates created successfully.');
  },
  error: (err) => {
    if (err && err[0] && err[0].code === 'TOPIC_ALREADY_EXISTS') {
      console.log('Topic player-updates already exists.');
    } else {
      console.error('Error creating topic player-updates:', err);
    }
  },
});
