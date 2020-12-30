const noflo = require('noflo');
const tv4 = require('tv4');
const path = require('path');

// @runtime noflo-nodejs

exports.getComponent = function () {
  const c = new noflo.Component();
  c.description = 'Validates request body against JSON schema';
  c.icon = 'search';
  c.inPorts.add('schema', {
    datatype: 'string',
    required: true,
    control: true,
  });
  c.inPorts.add('req', {
    datatype: 'object',
    type: 'http://expressjs.com/4x/api.html#req',
    required: true,
  });
  c.outPorts.add('req', {
    datatype: 'object',
    type: 'http://expressjs.com/4x/api.html#req',
  });
  c.outPorts.add('error', {
    datatype: 'object',
  });

  return c.process((input, output) => {
    // Preconditions
    if (!input.hasData('schema', 'req')) {
      return;
    }

    // Read inputs
    // eslint-disable-next-line
    const schema = require(path.resolve(process.cwd(), input.getData('schema')));
    const req = input.getData('req');

    // Validate request body
    const valid = tv4.validate(req.body, schema);
    if (!valid) {
      req.res.send(422, tv4.error.message);
      output.done(tv4.error);
      return;
    }
    output.send({
      req,
    });
    output.done();
  });
};
