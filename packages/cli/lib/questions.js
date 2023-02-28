export const BASE_QS = [
  {
    type: 'input',
    name: 'version',
    message: 'Project version ?',
    default: '0.0.1'
  },
  {
    type: 'input',
    name: 'description',
    message: 'Project description ?',
    default: 'A @heimdallr-sdk monitor'
  },
  {
    type: 'input',
    name: 'author',
    message: 'Project author ?',
    default: ''
  }
];

export const CLIENT_QS = [
  {
    type: 'input',
    name: 'client_api',
    message: 'API base url ?',
    default: ''
  }
];

export const SERVER_QS = [
  {
    type: 'input',
    name: 'database',
    message: 'Database name ?',
    default: 'test_base'
  },
  {
    type: 'input',
    name: 'mysql_host',
    message: 'Mysql host ?',
    default: 'localhost'
  },
  {
    type: 'input',
    name: 'mysql_port',
    message: 'Mysql port ?',
    default: '3306'
  },
  {
    type: 'input',
    name: 'mysql_user',
    message: 'Mysql user ?',
    default: 'root'
  },
  {
    type: 'input',
    name: 'mysql_pwd',
    message: 'Mysql password ?',
    default: 'root'
  }
];

export const RABBIT_QS = [
  {
    type: 'input',
    name: 'rabbit_host',
    message: 'RabbitMQ host ?',
    default: 'localhost'
  },
];
