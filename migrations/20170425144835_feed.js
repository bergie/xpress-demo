exports.up = function(knex, Promise) {
  return knex.schema.createTable('feed', function (t) {
    t.increments('id').primary();
    t.string('url').notNullable().index();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('feed');
};
