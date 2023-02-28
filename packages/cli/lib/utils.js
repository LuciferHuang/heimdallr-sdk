const { white, green, red } = require('chalk');
const boxen = require('boxen');

export function successBox(message, title) {
  return box(message, green(title), green('✔ Success'), {
    borderColor: 'green'
  });
}

export function errorBox(message, title) {
  return box(message, red(title), red('✖ Error'), {
    borderColor: 'red'
  });
}

export function box(message, title, boxTitle, options) {
  return (
    boxen(
      [boxTitle, title, '', white(message)].join('\n'),
      Object.assign(
        {
          borderColor: 'white',
          borderStyle: 'round',
          padding: 1,
          margin: 1
        },
        options
      )
    ) + '\n'
  );
}
