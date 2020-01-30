'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Cache extends Model {

    static get dates() {
        return super.dates.concat(['expiry'])
    }

    static async fetchExternal(key, fetcher, lifeSpan) {
        let cache = await Cache.findBy('key', key);
        if (cache && cache.expiry > new Date()) {
            console.log(cache.value);
            return JSON.parse(cache.value);
        }
        let expiry = new Date();
        cache = cache || new Cache();
        try {
            console.log("live");
            let value = await fetcher();
            expiry.setSeconds(expiry.getSeconds() + lifeSpan);
            cache.merge({key, value: JSON.stringify(value), expiry});
            cache.save();
            return value;
        } catch (e) {
            return {};
        }
    }
}

module.exports = Cache;
