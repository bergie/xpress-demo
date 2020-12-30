const noflo = require('noflo');
const bodyParser = require('body-parser');

// @runtime noflo-nodejs

exports.getComponent = function () {
  const c = new noflo.Component();
  c.description = 'Express body parser middleware';
  c.inPorts.add('app', {
    datatype: 'object',
    type: 'http://expressjs.com/4x/api.html#app',
    description: 'Express Application or Router',
    required: true,
  });
  c.inPorts.add('limit', {
    datatype: 'string',
    description: 'Size limit for parsed body',
    required: false,
    default: '1mb',
  });
  c.outPorts.add('app', {
    datatype: 'object',
    type: 'http://expressjs.com/4x/api.html#app',
    description: 'Express Application or Router',
    required: true,
  });

  c.forwardBrackets = { app: ['app'] };

  return c.process((input, output) => {
    if (!input.hasData('app')) { return; }
    const limit = input.hasData('limit') ? input.getData('limit') : '1mb';

    const app = input.getData('app');
    app.use(bodyParser.json({ limit }));

    output.sendDone({ app });
  });
};
