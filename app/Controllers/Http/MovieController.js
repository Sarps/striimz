'use strict';

const Movies = use('App/Sources/Movies');
const Cache = use('App/Models/Cache');

class MovieController {

    async index({request, response, view}) {
        let index = {};
        try {
            index = await Cache.fetchExternal('index', Movies.index.bind(Movies), 60*60*24);
        } catch (e) {
            console.log(e);
            index = {filters: {}, carousel: [], latest: []}
        }
        index.latest = this._chunkLatest(index.latest);
        return view.render('welcome', index);
    }

    async single({request, response, view, params}) {
        let movie, filters;
        try {
            const cache = await Cache.findByOrFail('key', params.movie);
            movie = JSON.parse(cache.value);
            // movie = await Movies.dummySingle();
            filters = await Movies.dummyGetFilters();
        } catch (e) {
            console.log(e);
            movie = filters = {}
        }
        return view.render('single', {...movie, filters});
    }


    _chunkLatest(latest) {
        let rows = 4, chunk = [], width = Math.floor(latest.length / rows);
        for (let i = 1; i < rows; i++) {
            chunk.push(latest.splice(0, width));
        }
        chunk.push(latest);
        return chunk;
    }

}

module.exports = MovieController;
