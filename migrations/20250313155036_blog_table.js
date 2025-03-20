/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('blogs', (table) => {
        table.increments('id').primary();
        table.string('selectedTopic').notNullable();
        table.string('content').nullable();
        table.enu('status', ['draft', 'published']).defaultTo('draft');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable('blogs');
}
