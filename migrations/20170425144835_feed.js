exports.up = function (knex) {
  return knex.schema.createTable('feed', (t) => {
    t.increments('id').primary();
    t.string('url').notNullable().index();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('feed');
};
