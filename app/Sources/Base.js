
const request = require('request-promise');
const cheerio = require('cheerio');

class Base {

    static domain = '';

    static async load (url, params) {
        let response = await request.get(new URL(url, this.domain), {
            qs: params
        });
        return cheerio.load(response);
    }
}

module.exports = Base;
