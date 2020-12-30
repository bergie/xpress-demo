const noflo = require('noflo');

// @runtime noflo-nodejs

exports.getComponent = function () {
  const c = new noflo.Component();
  c.description = 'Send RSS fetching result to client';
  c.icon = 'forward';
  c.inPorts.add('req', {
    datatype: 'object',
  });
  c.inPorts.add('item', {
    datatype: 'object',
  });
  c.inPorts.add('error', {
    datatype: 'object',
  });

  return c.process((input, output) => {
    if (!input.hasData('req')) {
      return;
    }

    let req;

    if (input.hasData('error')) {
      req = input.getData('req');
      const error = input.getData('error');
      req.res.send(500, error.message);
      output.done();
      return;
    }

    if (input.hasStream('item')) {
      req = input.getData('req');
      const items = input.getStream('item').filter((ip) => {
        if (ip.type === 'data') {
          return true;
        }
        return false;
      }).map((ip) => ip.data);

      req.res.json(items);

      output.done();
    }
  });
};
