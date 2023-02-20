import amqp from 'amqplib';

export default class RabbitMQ {
  private hosts: string;
  private open;
  constructor() {
    this.hosts = 'amqp://localhost';
    this.open = amqp.connect(this.hosts);
  }
  // 消息生产者
  sendQueueMsg(queueName: string, msg: string, successCallback: (msg: string) => void, failedCallback: (errmsg: string) => void) {
    this.open
      .then(function (conn) {
        return conn.createChannel();
      })
      .then(function (channel) {
        return channel
          .assertQueue(queueName)
          .then(function () {
            return channel.sendToQueue(queueName, Buffer.from(msg), {
              persistent: true
            });
          })
          .then(function (isdone) {
            if (isdone) {
              successCallback && successCallback('success');
            } else {
              failedCallback && failedCallback('failed');
            }
            channel.close();
          })
          .catch(function (err) {
            failedCallback && failedCallback(err.message);
            setTimeout(() => {
              if (channel) {
                channel.close();
              }
            }, 500);
          });
      })
      .catch(function (err) {
        failedCallback && failedCallback(err.message);
      });
  }
  // 消息消费者
  receiveQueueMsg(queueName: string, receiveCallBack: (data: any) => void, errCallBack: (err: Error) => void) {
    this.open
      .then(function (conn) {
        return conn.createChannel();
      })
      .then(function (channel) {
        return channel.assertQueue(queueName).then(function (ok) {
          return channel
            .consume(queueName, function (msg) {
              if (msg !== null) {
                let data = msg.content.toString();
                channel.ack(msg);
                receiveCallBack && receiveCallBack(data);
              }
            })
            .finally(function () {
              channel.close();
            });
        });
      })
      .catch(function (e: Error) {
        errCallBack(e);
      });
  }
}
