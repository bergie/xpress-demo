const noflo = require('noflo');
const knex = require('knex');
const path = require('path');

exports.getComponent = function () {
  const c = new noflo.Component();
  c.description = 'Register a new feed';
  c.icon = 'plus';
  c.inPorts.add('req', {
    datatype: 'object',
  });
  c.inPorts.add('db', {
    datatype: 'string',
    control: true,
  });
  c.outPorts.add('error', {
    datatype: 'object',
  });

  return c.process((input, output) => {
    if (!input.hasData('req', 'db')) {
      return;
    }

    const req = input.getData('req');
    // eslint-disable-next-line
    const db = knex(require(path.resolve(process.cwd(), input.getData('db'))));

    db('feed')
      .select('id')
      .where('url', req.body.url)
      .then((rows) => {
        if (rows.length) {
        // Already exists
          return rows[0].id;
        }
        return db('feed')
          .insert({
            url: req.body.url,
          })
          .returning('id')
          .then((result) => result[1]);
      })
      .then((id) => {
        req.res.header('location', `/${id}`);
        req.res.status(201).end();
        output.done();
      });
  });
};
