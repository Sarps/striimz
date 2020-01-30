'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CacheSchema extends Schema {
    up() {
        this.create('caches', (table) => {
            table.increments();
            table.string("key", 100);
            table.json("value");
            table.timestamp("expiry");
            table.timestamps();
        })
    }

    down() {
        this.drop('caches')
    }
}

module.exports = CacheSchema
