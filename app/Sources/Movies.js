const Base = require('./Base');
const Cache = use('App/Models/Cache');

class Movies extends Base {

    static domain = 'https://lightdlmovies.blogspot.com';

    static async index() {
        let $ = await this.load('/', {});
        const carousel = $('#content-wrapper ul.slides li').map((_, v) => this._fetchCarousel($(v), $)).get();
        const latest = $('#main .post').map((_, v) => this._fetchPostDetails($(v), $, '.post-body span[id^="p"]')).get();
        const filters = {
            // movies: this._fetchFilterList($('#LinkList2'), $),
            genre: this._fetchFilterList($('#Label5'), $),
            year: this._fetchFilterList($('#LinkList1'), $),
            collections: this._fetchFilterList($('#Label2'), $)
        };
        await this._saveMovies(latest);
        return {filters, carousel, latest};
    }

    static async search(params) {
        try {
            let $ = await this.load('search', params);
            return $('#main .post').map((_, v) => this._fetchPostDetails($(v), $, '.post-body .content.clearfix div')).get();
        } catch (e) {
            return [];
        }
    }

    static _fetchPostDetails($v, $, descriptionSelector) {
        let $a = $v.find('h3 a');
        let u = new URL($a.attr('href'));
        return {
            title: $a.text(),
            cover: $v.find('img').attr('src'),
            description: $v.find(descriptionSelector).contents().toArray()
                .filter(c => c.type === 'text')
                .map(v => $(v).text().trim().replace(/\n/g, ','))
                .filter(t => t.replace(/\s+/, "").length),
            dl: $v.find('hr:last-of-type ~ span a').map((i, a) => this._fetchLinkText($(a))).get(),
            url: new URL($a.attr('href')).pathname
                .replace(".html", "").replace(/\//g, ".")
        };
    }

    static _fetchLinkText($a) {
        return {
            filename: $a.text(),
            url: $a.attr('href')
        }
    }

    static _fetchCarousel($v) {
        const $a = $v.find('h1 a');
        return {
            cover: $v.find('img').attr('src'),
            title: $a.text(),
            url: $a.attr('href').replace(this.domain, '').replace('.html', '')
        }
    }

    static _fetchFilterList($v, $) {
        return $v.find('ul > li > a')
            .map((_, v) => {
                let $a = $(v);
                return {
                    filename: $a.text(),
                    url: new URL($a.attr('href')).pathname
                        .replace(".html", "").replace("/search/label", "/filter")
                }
            }).get()
    }

    static async _saveMovies(movies) {
        let expiry = new Date();
        expiry.setSeconds(expiry.getSeconds() + 60*60*24*365);
        await Cache.query().where('key', 'in', movies.map(movie => movie.url)).delete();
        await Cache.createMany(movies.map(movie => ({key: movie.url, value: JSON.stringify(movie), expiry})));
    }

    static async dummyIndex() {
        return {
            "filters": {
                "genre": [
                    {
                        "filename": "Action",
                        "url": "/search/label/Action"
                    },
                    {
                        "filename": "Adventure",
                        "url": "/search/label/Adventure"
                    },
                    {
                        "filename": "Animation",
                        "url": "/search/label/Animation"
                    },
                    {
                        "filename": "Biography",
                        "url": "/search/label/Biography"
                    },
                    {
                        "filename": "Comedy",
                        "url": "/search/label/Comedy"
                    },
                    {
                        "filename": "Crime",
                        "url": "/search/label/Crime"
                    },
                    {
                        "filename": "Documentary",
                        "url": "/search/label/Documentary"
                    },
                    {
                        "filename": "Drama",
                        "url": "/search/label/Drama"
                    },
                    {
                        "filename": "Family",
                        "url": "/search/label/Family"
                    },
                    {
                        "filename": "Fantasy",
                        "url": "/search/label/Fantasy"
                    },
                    {
                        "filename": "History",
                        "url": "/search/label/History"
                    },
                    {
                        "filename": "Horror",
                        "url": "/search/label/Horror"
                    },
                    {
                        "filename": "Music",
                        "url": "/search/label/Music"
                    },
                    {
                        "filename": "Musical",
                        "url": "/search/label/Musical"
                    },
                    {
                        "filename": "Mystery",
                        "url": "/search/label/Mystery"
                    },
                    {
                        "filename": "Reality-TV",
                        "url": "/search/label/Reality-TV"
                    },
                    {
                        "filename": "Romance",
                        "url": "/search/label/Romance"
                    },
                    {
                        "filename": "Sci-Fi",
                        "url": "/search/label/Sci-Fi"
                    },
                    {
                        "filename": "Short",
                        "url": "/search/label/Short"
                    },
                    {
                        "filename": "Sport",
                        "url": "/search/label/Sport"
                    },
                    {
                        "filename": "Thriller",
                        "url": "/search/label/Thriller"
                    },
                    {
                        "filename": "War",
                        "url": "/search/label/War"
                    },
                    {
                        "filename": "Western",
                        "url": "/search/label/Western"
                    }
                ],
                "year": [
                    {
                        "filename": "2020",
                        "url": "/search/label/2020"
                    },
                    {
                        "filename": "2019",
                        "url": "/search/label/2019"
                    },
                    {
                        "filename": "2018",
                        "url": "/search/label/2018"
                    },
                    {
                        "filename": "2017",
                        "url": "/search/label/2017"
                    },
                    {
                        "filename": "2016",
                        "url": "/search/label/2016"
                    },
                    {
                        "filename": "2015",
                        "url": "/search/label/2015"
                    },
                    {
                        "filename": "2014",
                        "url": "/search/label/2014"
                    },
                    {
                        "filename": "2013",
                        "url": "/search/label/2013"
                    },
                    {
                        "filename": "2012",
                        "url": "/search/label/2012"
                    },
                    {
                        "filename": "2011",
                        "url": "/search/label/2011"
                    },
                    {
                        "filename": "2010",
                        "url": "/search/label/2010"
                    },
                    {
                        "filename": "2009",
                        "url": "/search/label/2009"
                    },
                    {
                        "filename": "2008",
                        "url": "/search/label/2017"
                    },
                    {
                        "filename": "2007",
                        "url": "/search/label/2007"
                    },
                    {
                        "filename": "2006",
                        "url": "/search/label/2006"
                    },
                    {
                        "filename": "2005",
                        "url": "/search/label/2005"
                    },
                    {
                        "filename": "2004",
                        "url": "/search/label/2004"
                    },
                    {
                        "filename": "2003",
                        "url": "/search/label/2003"
                    },
                    {
                        "filename": "2002",
                        "url": "/search/label/2002"
                    },
                    {
                        "filename": "2001",
                        "url": "/search/label/2001"
                    },
                    {
                        "filename": "1900-2000",
                        "url": "/search/label/1900-2000"
                    }
                ],
                "collections": [
                    {
                        "filename": "A Nightmare on Elm Street",
                        "url": "/search/label/A%20Nightmare%20on%20Elm%20Street"
                    },
                    {
                        "filename": "Alvin and the Chipmunks",
                        "url": "/search/label/Alvin%20and%20the%20Chipmunks"
                    },
                    {
                        "filename": "American Pie",
                        "url": "/search/label/American%20Pie"
                    },
                    {
                        "filename": "Avengers",
                        "url": "/search/label/Avengers"
                    },
                    {
                        "filename": "Back To The Future",
                        "url": "/search/label/Back%20To%20The%20Future"
                    },
                    {
                        "filename": "Beverly Hills Cop",
                        "url": "/search/label/Beverly%20Hills%20Cop"
                    },
                    {
                        "filename": "Biography",
                        "url": "/search/label/Biography"
                    },
                    {
                        "filename": "Blade",
                        "url": "/search/label/Blade"
                    },
                    {
                        "filename": "Captain America",
                        "url": "/search/label/Captain%20America"
                    },
                    {
                        "filename": "Charles Chaplin",
                        "url": "/search/label/Charles%20Chaplin"
                    },
                    {
                        "filename": "Childs Play",
                        "url": "/search/label/Childs%20Play"
                    },
                    {
                        "filename": "Chronicles of Narnia",
                        "url": "/search/label/Chronicles%20of%20Narnia"
                    },
                    {
                        "filename": "Death Race",
                        "url": "/search/label/Death%20Race"
                    },
                    {
                        "filename": "Die Hard",
                        "url": "/search/label/Die%20Hard"
                    },
                    {
                        "filename": "Final Destination",
                        "url": "/search/label/Final%20Destination"
                    },
                    {
                        "filename": "Friday the 13th",
                        "url": "/search/label/Friday%20the%2013th"
                    },
                    {
                        "filename": "Goal",
                        "url": "/search/label/Goal"
                    },
                    {
                        "filename": "Guardians Of The Galaxy",
                        "url": "/search/label/Guardians%20Of%20The%20Galaxy"
                    },
                    {
                        "filename": "Harry Potter",
                        "url": "/search/label/Harry%20Potter"
                    },
                    {
                        "filename": "Hatchet",
                        "url": "/search/label/Hatchet"
                    },
                    {
                        "filename": "Home Alone",
                        "url": "/search/label/Home%20Alone"
                    },
                    {
                        "filename": "Hostel",
                        "url": "/search/label/Hostel"
                    },
                    {
                        "filename": "Hulk",
                        "url": "/search/label/Hulk"
                    },
                    {
                        "filename": "Ice Age",
                        "url": "/search/label/Ice%20Age"
                    },
                    {
                        "filename": "Ice Age Collection",
                        "url": "/search/label/Ice%20Age%20Collection"
                    },
                    {
                        "filename": "Indiana Jones",
                        "url": "/search/label/Indiana%20Jones"
                    },
                    {
                        "filename": "IP MAN",
                        "url": "/search/label/IP%20MAN"
                    },
                    {
                        "filename": "Iron Man",
                        "url": "/search/label/Iron%20Man"
                    },
                    {
                        "filename": "James Bond",
                        "url": "/search/label/James%20Bond"
                    },
                    {
                        "filename": "Justice League",
                        "url": "/search/label/Justice%20League"
                    },
                    {
                        "filename": "Kung Fu Panda",
                        "url": "/search/label/Kung%20Fu%20Panda"
                    },
                    {
                        "filename": "Lethal Weapon (Movie)",
                        "url": "/search/label/Lethal%20Weapon%20%28Movie%29"
                    },
                    {
                        "filename": "Madagascar",
                        "url": "/search/label/Madagascar"
                    },
                    {
                        "filename": "Marvel One Shots",
                        "url": "/search/label/Marvel%20One%20Shots"
                    },
                    {
                        "filename": "Mission Impossible",
                        "url": "/search/label/Mission%20Impossible"
                    },
                    {
                        "filename": "Night at the Museum",
                        "url": "/search/label/Night%20at%20the%20Museum"
                    },
                    {
                        "filename": "Ong Bak",
                        "url": "/search/label/Ong%20Bak"
                    },
                    {
                        "filename": "Pirates of the caribbean",
                        "url": "/search/label/Pirates%20of%20the%20caribbean"
                    },
                    {
                        "filename": "Rambo",
                        "url": "/search/label/Rambo"
                    },
                    {
                        "filename": "Resident Evil",
                        "url": "/search/label/Resident%20Evil"
                    },
                    {
                        "filename": "Robocop",
                        "url": "/search/label/Robocop"
                    },
                    {
                        "filename": "Rush Hour",
                        "url": "/search/label/Rush%20Hour"
                    },
                    {
                        "filename": "Saw",
                        "url": "/search/label/Saw"
                    },
                    {
                        "filename": "Scary Movie",
                        "url": "/search/label/Scary%20Movie"
                    },
                    {
                        "filename": "Shrek",
                        "url": "/search/label/Shrek"
                    },
                    {
                        "filename": "Siccin",
                        "url": "/search/label/Siccin"
                    },
                    {
                        "filename": "Spider Man",
                        "url": "/search/label/Spider%20Man"
                    },
                    {
                        "filename": "Star Wars",
                        "url": "/search/label/Star%20Wars"
                    },
                    {
                        "filename": "Step Up",
                        "url": "/search/label/Step%20Up"
                    },
                    {
                        "filename": "Superman",
                        "url": "/search/label/Superman"
                    },
                    {
                        "filename": "Terminator",
                        "url": "/search/label/Terminator"
                    },
                    {
                        "filename": "The Bourne",
                        "url": "/search/label/The%20Bourne"
                    },
                    {
                        "filename": "The Expendables",
                        "url": "/search/label/The%20Expendables"
                    },
                    {
                        "filename": "The Fast and the Furious",
                        "url": "/search/label/The%20Fast%20and%20the%20Furious"
                    },
                    {
                        "filename": "The French Connection",
                        "url": "/search/label/The%20French%20Connection"
                    },
                    {
                        "filename": "The Godfather Collection",
                        "url": "/search/label/The%20Godfather%20Collection"
                    },
                    {
                        "filename": "The Hangover",
                        "url": "/search/label/The%20Hangover"
                    },
                    {
                        "filename": "The Hobbit",
                        "url": "/search/label/The%20Hobbit"
                    },
                    {
                        "filename": "The Hunger Games",
                        "url": "/search/label/The%20Hunger%20Games"
                    },
                    {
                        "filename": "The Lion King",
                        "url": "/search/label/The%20Lion%20King"
                    },
                    {
                        "filename": "The Lord of the Rings",
                        "url": "/search/label/The%20Lord%20of%20the%20Rings"
                    },
                    {
                        "filename": "The Mummy",
                        "url": "/search/label/The%20Mummy"
                    },
                    {
                        "filename": "The Ring",
                        "url": "/search/label/The%20Ring"
                    },
                    {
                        "filename": "The Transporter",
                        "url": "/search/label/The%20Transporter"
                    },
                    {
                        "filename": "Thor",
                        "url": "/search/label/Thor"
                    },
                    {
                        "filename": "Tomb Raider",
                        "url": "/search/label/Tomb%20Raider"
                    },
                    {
                        "filename": "Toy Story",
                        "url": "/search/label/Toy%20Story"
                    },
                    {
                        "filename": "Transformers",
                        "url": "/search/label/Transformers"
                    },
                    {
                        "filename": "Twilight",
                        "url": "/search/label/Twilight"
                    },
                    {
                        "filename": "Underworld",
                        "url": "/search/label/Underworld"
                    },
                    {
                        "filename": "Undisputed",
                        "url": "/search/label/Undisputed"
                    },
                    {
                        "filename": "Universal Soldier",
                        "url": "/search/label/Universal%20Soldier"
                    },
                    {
                        "filename": "Wrong Turn",
                        "url": "/search/label/Wrong%20Turn"
                    },
                    {
                        "filename": "X-Men",
                        "url": "/search/label/X-Men"
                    }
                ]
            },
            "carousel": [
                {
                    "cover": "https://1.bp.blogspot.com/-pRl_GZWPgSQ/XUU3X0pew1I/AAAAAAAAAEw/w1Adomo-wqsky5kwQnDfBh7U2YsvyP5QACLcBGAs/s1600/Avengers-Endgame.jpg",
                    "title": "AVENGERS ENDGAME 2019",
                    "url": "/2019/04/avengers-endgame-2019"
                },
                {
                    "cover": "https://1.bp.blogspot.com/-cndAI_nPdgM/XUU7yGruQKI/AAAAAAAAAFE/n_9eyzU2_Qc_c7EkVAiOgo6MdrK_6BjRACLcBGAs/s1600/alita%2Bbattle%2Bangel.jpg",
                    "title": "ALITA BATTLE ANGEL 2019",
                    "url": "/2019/02/aba"
                },
                {
                    "cover": "https://1.bp.blogspot.com/-HJga2xUh0_Q/XUU_Ovvm2nI/AAAAAAAAAFQ/sskz8uQsbQsTgNURrH-v8K8ZRA9utTqZACLcBGAs/s1600/shazam.jpg",
                    "title": "SHAZAM 2019",
                    "url": "/2019/05/shazam-2019"
                },
                {
                    "cover": "https://1.bp.blogspot.com/-kg6QHs10Lpo/W7UGr5Xf2ZI/AAAAAAAAAAY/WlrB0KbNuYwBC7017IgJpm6upURJPsJ8wCLcBGAs/s1600/Black-Panther-banner-poster-900x500.jpg",
                    "title": "BLACK PANTHER 2018",
                    "url": "/2018/02/blackpanther2018enghdcamx264mp4"
                },
                {
                    "cover": "https://4.bp.blogspot.com/-2kFUEA7GWpg/Woi1jOe_CeI/AAAAAAAAAA8/E2_nXALIsLATohnVXQmzIAxiC6XWcGNiACLcBGAs/s1600/Pirate-of-the-Carribean-Dead-Man-Tell-No-Tales-Banner.jpg",
                    "title": "PIRATES OF THE CARIBBEAN 5 2017",
                    "url": "http://lightdlmovies.blogspot.com/2017/09/pirates-of-caribbean-dead-men-tell-no"
                },
                {
                    "cover": "https://4.bp.blogspot.com/-NzCWBy827Ws/Woi23x1_TzI/AAAAAAAAABM/-3bWohDXU106CLTtPqn65HDdoZ8QLFDFgCLcBGAs/s1600/maxresdefault.jpg",
                    "title": "JUSTICE LEAGUE 2017",
                    "url": "http://lightdlmovies.blogspot.com/2018/02/justiceleague20171080p720p480pmkv"
                },
                {
                    "cover": "https://1.bp.blogspot.com/-Xrdv4iR8YnI/XUZ56Fra5tI/AAAAAAAAAFc/4m3pcropNYMy-V7BNz-djX-luu-2mq6OACLcBGAs/s1600/aquaman.jpg",
                    "title": "AQUAMAN 2018",
                    "url": "/2019/03/aquaman20181080p720pweb-dlmkv"
                },
                {
                    "cover": "https://4.bp.blogspot.com/-XJQkLuhR4SI/Wp9sYqO3QZI/AAAAAAAAAB4/2doJcQsAW1gQ7b3jfFZFmPw3bqIDQVNFgCLcBGAs/s1600/jumanji1.jpg",
                    "title": "JUMANJI WELCOME TO THE JUNGLE 2017",
                    "url": "/2018/03/jumanjiwelcometothejungle20171080p720pm"
                },
                {
                    "cover": "https://2.bp.blogspot.com/-5ZLkmz5Z688/WRu8zds0ycI/AAAAAAAAADM/IsInzeZdLtMVhs6Q7mV03RLqsLbecJJZwCLcB/s1600/beauty.jpg",
                    "title": "BEAUTY AND THE BEAST 2017",
                    "url": "http://lightdlmovies.blogspot.com/2017/05/beautyandthebeast20171080p720pbluraymkv"
                }
            ],
            "latest": [
                {
                    "title": "Grand Isle 2019",
                    "cover": "https://m.media-amazon.com/images/M/MV5BNDAyN2M2OTgtMjc5Ni00MDJiLTk0OWEtMWI3MDA0NzNjZmRkXkEyXkFqcGdeQXVyNDExMzMxNjE@._V1_SY1000_SX675_AL_.jpg",
                    "description": [
                        "Director: Stephen S. Campanelli",
                        "Writers: Iver William Jallah, Rich Ronat",
                        "Stars: Nicolas Cage, Zulay Henao, Kelsey Grammer",
                        "Genre:",
                        "Action, ,Thriller",
                        "Released Date: 6 December 2019",
                        "Runtime: 1hr 37mins",
                        "A young father is charged for murder and must prove his innocence through recalling a very twisted and dark night of events."
                    ],
                    "dl": [
                        {
                            "filename": "Grand.Isle.2019.1080p.BRRip.mkv",
                            "url": "http://dl7.cdn-france.info/f/Grand.Isle.2019.1080p.BRRip.MOVIE30T.CO.mkv"
                        },
                        {
                            "filename": "Grand.Isle.2019.720p.BRRip.mkv",
                            "url": "http://dl7.cdn-france.info/f/Grand.Isle.2019.720p.BRRip.MOVIE30T.CO.mkv"
                        }
                    ]
                },
                {
                    "title": "Ford v Ferrari 2019",
                    "cover": "https://m.media-amazon.com/images/M/MV5BYzcyZDNlNDktOWRhYy00ODQ5LTg1ODQtZmFmZTIyMjg2Yjk5XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SY1000_SX675_AL_.jpg",
                    "description": [
                        "Director: James Mangold",
                        "Writer: Jez Butterworth, John-Henry Butterworth, Jason Keller",
                        "Stars: Christian Bale, Matt Damon, Caitriona Balfe, Jon Bernthal",
                        "Genres: Action, Biography, Drama, Sport",
                        "Country: USA, France",
                        "Language: English",
                        "Released Date: 15 Nov 2019",
                        "Runtime: 152 min",
                        "American car designer Carroll Shelby and driver Ken Miles battle ,corporate interference, the laws of physics and their own personal ,demons to build a revolutionary race car for Ford and challenge Ferrari ,at the 24 Hours of Le Mans in 1966.",
                        "Visit",
                        "for latest"
                    ],
                    "dl": [
                        {
                            "filename": "Ford.v.Ferrari.2019.1080p.WEB-DL.EVO.mkv",
                            "url": "http://dl7.cdn-france.info/f/Ford.v.Ferrari.2019.1080p.WEB-DL.EVO.MOVIE30T.CO.mkv"
                        },
                        {
                            "filename": "Ford.v.Ferrari.2019.1080p.WEB-DL.RARBG.mkv",
                            "url": "http://dl7.cdn-france.info/f/Ford.v.Ferrari.2019.1080p.WEB-DL.RARBG.MOVIE30T.CO.mkv"
                        },
                        {
                            "filename": "Ford.v.Ferrari.2019.720p.WEB-DL.FGT.mkv",
                            "url": "http://dl7.cdn-france.info/f/Ford.v.Ferrari.2019.720p.WEB-DL.FGT.MOVIE30T.CO.mkv"
                        },
                        {
                            "filename": "Ford.V.Ferrari.2019.720p.WEB-DL.GalaxyRG.mkv",
                            "url": "http://dl7.cdn-france.info/f/Ford.V.Ferrari.2019.720p.WEB-DL.GalaxyRG.MOVIE30T.CO.mkv"
                        }
                    ]
                },
                {
                    "title": "White Snake 2019",
                    "cover": "https://m.media-amazon.com/images/M/MV5BMDJiMzRkOGEtYWFkYi00NjczLWFlYjQtN2E3OGFhYWY1ZDE2XkEyXkFqcGdeQXVyMjAyOTY3OTY@._V1_.jpg",
                    "description": [
                        "Directors: Amp Wong (as Jiakang Huang), Ji Zhao",
                        "Writer: Damao",
                        "Stars: Vincent Rodriguez III, Matthew Moy, Stephanie Sheh",
                        "Genre:Animation, ,Fantasy, ,Romance",
                        "Released Date: 2019",
                        "Runtime:  1h 39min",
                        "A love story between a snake spirit and a snake hunter."
                    ],
                    "dl": [
                        {
                            "filename": "White.Snake.2019.CHINESE.1080p.BRRip.mkv",
                            "url": "http://dl7.cdn-france.info/f/White.Snake.2019.CHINESE.1080p.BRRip.MOVIE30T.CO.mkv"
                        },
                        {
                            "filename": "White.Snake.2019.CHINESE.720p.BRRip.mkv",
                            "url": "http://dl7.cdn-france.info/f/White.Snake.2019.CHINESE.720p.BRRip.MOVIE30T.CO.mkv"
                        },
                        {
                            "filename": "White.Snake.2019.CHINESE.480p.BRRip.mkv",
                            "url": "http://dl7.cdn-france.info/f/White.Snake.2019.CHINESE.480p.BRRip.MOVIE30T.CO.mkv"
                        }
                    ]
                },
                {
                    "title": "Get Gone 2019",
                    "cover": "https://m.media-amazon.com/images/M/MV5BMzA3M2E5YTItZDg2Yy00ODhlLWI2ZjYtMTI4ZTBiNWU1ZWY4XkEyXkFqcGdeQXVyMjg3OTQ2NTI@._V1_SY1000_CR0,0,777,1000_AL_.jpg",
                    "description": [
                        "Director: Michael Thomas Daniel",
                        "Writer: Michael Thomas Daniel",
                        "Stars: Lin Shaye, Robert Miano, Rico E. Anderson",
                        "Genre:",
                        "Horror, ,Thriller",
                        "Released Date:2019",
                        "Runtime:                     ,                        1h 31min",
                        "A hoax busting group goes on a team-building retreat to Whiskey Flats, ,OR and runs into trouble as they cross paths with an invasive drilling ,company that is warring with a very private family."
                    ],
                    "dl": [
                        {
                            "filename": "Get.Gone.2019.1080p.WEB-DL.mkv",
                            "url": "http://dl7.cdn-france.info/f/Get.Gone.2019.1080p.WEB-DL.MOVIE30T.CO.mkv"
                        },
                        {
                            "filename": "Get.Gone.2019.720p.WEB-DL.mkv",
                            "url": "http://dl7.cdn-france.info/f/Get.Gone.2019.720p.WEB-DL.MOVIE30T.CO.mkv"
                        }
                    ]
                },
                {
                    "title": "The 62nd Annual Grammy Awards 2020",
                    "cover": "https://m.media-amazon.com/images/M/MV5BZmVjNWU2Y2QtMDFmNC00Y2FhLTliMjktYzk2YzU3YjU0MWE0XkEyXkFqcGdeQXVyODQ1NTk5OQ@@._V1_.jpg",
                    "description": [
                        "Director: Louis J. Horvitz",
                        "Writers: David Wild, Ken Ehrlich",
                        "Stars: Cynthia Erivo, Jim Gaffigan, Demi Lovato",
                        "Genre: Music, Reality-TV",
                        "Released Date: 26 January 2020",
                        "Runtime:  3hrs 30mins"
                    ],
                    "dl": [
                        {
                            "filename": "The.62nd.Annual.Grammy.Awards.2020.720p.WEB.mkv",
                            "url": "http://dl7.cdn-france.info/f/The.62nd.Annual.Grammy.Awards.2020.720p.WEB.MOVIE30T.CO.mkv"
                        }
                    ]
                },
                {
                    "title": "1917 2019",
                    "cover": "https://m.media-amazon.com/images/M/MV5BOTdmNTFjNDEtNzg0My00ZjkxLTg1ZDAtZTdkMDc2ZmFiNWQ1XkEyXkFqcGdeQXVyNTAzNzgwNTg@._V1_SY1000_CR0,0,631,1000_AL_.jpg",
                    "description": [
                        "Director: Sam Mendes",
                        "Writer: Sam Mendes, Krysty Wilson-Cairns",
                        "Stars: Andrew Scott, Benedict Cumberbatch, Mark Strong, Richard Madden",
                        "Genres: Drama, War",
                        "Country: UK, USA",
                        "Language: English, French, German",
                        "Released Date: 25 Dec 2019",
                        "Runtime: 118 min",
                        "Two young British privates during the First World War are given an ,impossible mission: deliver a message deep in enemy territory that will ,stop 1,600 men, and one of the soldier's brothers, from walking straight, into a deadly trap.",
                        "Visit",
                        "for latest"
                    ],
                    "dl": [
                        {
                            "filename": "1917.2019.DVDSCR.mkv",
                            "url": "http://dl7.cdn-france.info/f/1917.2019.DVDSCR.MOVIE30T.CO.mkv"
                        },
                        {
                            "filename": "1917.2019.DVDSCR.mkv",
                            "url": "http://dl7.cdn-france.info/f/1917.2019.DVDSCR.GalaxyRG.MOVIE30T.CO.mkv"
                        }
                    ]
                },
                {
                    "title": "The Last Tree 2019",
                    "cover": "https://m.media-amazon.com/images/M/MV5BOTY5NDI0ZmMtYzdlMC00ZWY5LTlkZDItMDgyZTNkMDg0NWY4XkEyXkFqcGdeQXVyMDA4NzMyOA@@._V1_SY1000_CR0,0,674,1000_AL_.jpg",
                    "description": [
                        "Director: Shola Amoo",
                        "Writer: Shola Amoo",
                        "Stars: Nicholas Pinnock, Samuel Adewunmi, Denise Black",
                        "Genre:Drama",
                        "Released Date: 27 September 2019",
                        "Runtime:  1hr 38mins",
                        "After a happy childhood in the countryside, a teenager moves to London, ,where he must navigate an unfamiliar environment on his road to ,adulthood."
                    ],
                    "dl": [
                        {
                            "filename": "The.Last.Tree.2019.720p.WEB-DL.mkv",
                            "url": "http://dl7.cdn-france.info/f/The.Last.Tree.2019.720p.WEB-DL.MOVIE30T.CO.mkv"
                        }
                    ]
                },
                {
                    "title": "Queen And Slim 2019",
                    "cover": "https://m.media-amazon.com/images/M/MV5BMjIzYmJkZmEtM2RkZS00MDA4LTg4NjAtOGRkN2EwZmFmMWE4XkEyXkFqcGdeQXVyNjg2NjQwMDQ@._V1_SY1000_SX675_AL_.jpg",
                    "description": [
                        "Director: Melina Matsoukas",
                        "Writer: Lena Waithe (screenplay by), James Frey (story by), Lena Waithe (story by)",
                        "Stars: Daniel Kaluuya, Jodie Turner-Smith, Bokeem Woodbine, Chloë Sevigny",
                        "Genres: Drama",
                        "Country: Canada, USA",
                        "Language: English",
                        "Released Date: 27 Nov 2019",
                        "Runtime: 132 min",
                        "A couple's first date takes an unexpected turn when a police officer pulls them over."
                    ],
                    "dl": []
                },
                {
                    "title": "John Henry 2020",
                    "cover": "https://m.media-amazon.com/images/M/MV5BYTY2NjhmNmMtOTA4ZC00ZTE4LWE4YmYtZWYwY2Y5NDc1NGY1XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SY1000_CR0,0,675,1000_AL_.jpg",
                    "description": [
                        "Director: Will Forbes",
                        "Writer: Will Forbes, Doug Skinner",
                        "Stars: Terry Crews, Ludacris, Maestro Harrell, Ken Foree",
                        "Genres: Drama, Thriller",
                        "Country: USA",
                        "Language: English",
                        "Date: 24 January 2020 (USA)",
                        "Runtime: 91 Min",
                        "Ex-gang member John Henry (Terry Crews) is a quiet man with a, violent past. When two immigrant kids on the run from his former South ,Los Angeles gang leader (Chris \"Ludacris\" Bridges) ...",
                        "Visit",
                        "for latest"
                    ],
                    "dl": [
                        {
                            "filename": "John.Henry.2020.1080p.WEB-DL.mkv",
                            "url": "http://dl7.cdn-france.info/f/John.Henry.2020.1080p.WEB-DL.MOVIE30T.CO.mkv"
                        },
                        {
                            "filename": "John.Henry.2020.720p.WEB-DL.mkv",
                            "url": "http://dl7.cdn-france.info/f/John.Henry.2020.720p.WEB-DL.MOVIE30T.CO.mkv"
                        }
                    ]
                },
                {
                    "title": "Last Christmas 2019",
                    "cover": "https://m.media-amazon.com/images/M/MV5BNTQ4ZmY0NjgtYzVhNy00NzhiLTk3YTYtNzM1MTdjM2VhZDA3XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SY1000_CR0,0,674,1000_AL_.jpg",
                    "description": [
                        "Director: Paul Feig",
                        "Writers: George Michael (inspired by: the song \"Last Christmas\", written and composed by), Emma Thompson (story by) |",
                        "Stars: Madison Ingoldsby, Emma Thompson, Boris Isakovic",
                        "Genre: Comedy, ,Drama, ,Romance",
                        "Released Date: 8 November 2019",
                        "Runtime:  1hr 43mins",
                        "Kate is a young woman subscribed to bad decisions. Working as an elf in a, year round Christmas store is not good for the wannabe singer. However,, she meets Tom there. Her life takes a new turn. For Kate, it seems too ,good to be true.",
                        "Visit",
                        "for latest"
                    ],
                    "dl": [
                        {
                            "filename": "Last Christmas.2019.1080p.WEB-DL.H264.AC3-EVO.mkv",
                            "url": "http://dl5.cdn-france.info/f/Last%20Christmas.2019.1080p.WEB-DL.H264.AC3-EVO.MOVIE30T.CO.mkv"
                        },
                        {
                            "filename": "Last.Christmas.2019.1080p.WEB-DL.RARBG.mkv",
                            "url": "http://dl5.cdn-france.info/f/Last.Christmas.2019.1080p.WEB-DL.RARBG.MOVIE30T.CO.mkv"
                        },
                        {
                            "filename": "Last.Christmas.2019.720p.WEB-DL.Pahe.mkv",
                            "url": "http://dl5.cdn-france.info/f/Last.Christmas.2019.720p.WEB-DL.Pahe.MOVIE30T.CO.mkv"
                        },
                        {
                            "filename": "Last.Christmas.2019.720p.WEB-DL.GalaxyRG.mkv",
                            "url": "http://dl5.cdn-france.info/f/Last.Christmas.2019.720p.WEB-DL.GalaxyRG.MOVIE30T.CO.mkv"
                        },
                        {
                            "filename": "Last.Christmas.2019.480p.WEB-DL.mkv",
                            "url": "http://dl5.cdn-france.info/f/Last.Christmas.2019.480p.WEB-DL.MOVIE30T.CO.mkv"
                        }
                    ]
                },
                {
                    "title": "Eye For An Eye 2019",
                    "cover": "https://m.media-amazon.com/images/M/MV5BY2M5YWE1ZGUtYTE1Zi00YTllLTg4OTktOTc1ZTkwZDIwYmE2XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
                    "description": [
                        "Director: Paco Plaza",
                        "Writers: Juan Galiñanes, Jorge Guerricaechevarría",
                        "Stars: Luis Tosar, Xan Cejudo, Ismael Martínez",
                        "Genre: Drama, Thriller",
                        "Country: Spain",
                        "Language: Spanish",
                        "Released Date: 30 August 2019",
                        "Runtime:  1hr 47mins"
                    ],
                    "dl": [
                        {
                            "filename": "Eye.For.An.Eye.2019.1080p.BRRip.mkv",
                            "url": "http://dl7.cdn-france.info/f/Eye.For.An.Eye.2019.1080p.BRRip.MOVIE30T.CO.mkv"
                        },
                        {
                            "filename": "Eye.For.An.Eye.2019.720p.BRRip.mkv",
                            "url": "http://dl7.cdn-france.info/f/Eye.For.An.Eye.2019.720p.BRRip.MOVIE30T.CO.mkv"
                        }
                    ]
                },
                {
                    "title": "Trauma Center 2019",
                    "cover": "https://m.media-amazon.com/images/M/MV5BMTRkNWM1MmEtZDYzOC00NWI2LTljYzctYWIwYTdjYWNjYTMxXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
                    "description": [
                        "Director: Matt Eskandari",
                        "Writer: Paul Da Silva",
                        "Stars: Bruce Willis, Nicky Whelan, Steve Guttenberg",
                        "Genre: Action, ,Thriller",
                        "Released Date: 6 December 2019",
                        "Runtime:  1hr 27mins",
                        "Alone and trapped in a locked-down hospital isolation ward overnight, an, injured young woman must escape a pair of vicious killers who are after, the only piece of evidence that can ...",
                        "Visit",
                        "for latest"
                    ],
                    "dl": [
                        {
                            "filename": "Trauma.Center.2019.1080p.BRRip.mkv",
                            "url": "http://dl7.cdn-france.info/f/Trauma.Center.2019.1080p.BRRip.MOVIE30T.CO.mkv"
                        },
                        {
                            "filename": "Trauma.Center.2019.720p.BRRip.mkv",
                            "url": "http://dl7.cdn-france.info/f/Trauma.Center.2019.720p.BRRip.MOVIE30T.CO.mkv"
                        }
                    ]
                },
                {
                    "title": "True History of the Kelly Gang 2019",
                    "cover": "https://m.media-amazon.com/images/M/MV5BNjU4MWYyNjYtM2Q3ZC00OWU4LTg2ZDgtZDMxY2UwNDJmMDJlXkEyXkFqcGdeQXVyODgwOTIxODg@._V1_SY1000_SX690_AL_.jpg",
                    "description": [
                        "Director: Justin Kurzel",
                        "Writers: Shaun Grant (screenplay by), Peter Carey (based on the novel by)",
                        "Stars: George MacKay, Essie Davis, Nicholas Hoult",
                        "Genre: ,Biography, ,Crime, ,Drama",
                        "Released Date: 2019",
                        "Runtime:  2hrs 4mins",
                        "Based on Peter Carey's novel. The story of Australian bushranger Ned ,Kelly and his gang as they flee from authorities during the 1870s."
                    ],
                    "dl": [
                        {
                            "filename": "True.History.of.the.Kelly.Gang.2019.720p.WEB-DL.mkv",
                            "url": "http://dl7.cdn-france.info/f/True.History.of.the.Kelly.Gang.2019.720p.WEB-DL.MOVIE30T.CO.mkv"
                        }
                    ]
                },
                {
                    "title": "The Last Full Measure 2019",
                    "cover": "https://m.media-amazon.com/images/M/MV5BOTQyMjBmNDAtNDA0YS00ODFiLTk2OTUtMWM5NzI4NjM1YzhhXkEyXkFqcGdeQXVyMTA2MDU0NjM5._V1_SY999_CR0,0,675,999_AL_.jpg",
                    "description": [
                        "Director: Todd Robinson",
                        "Writer: Todd Robinson",
                        "Stars: Christopher Plummer, Samuel L. Jackson, Sebastian Stan",
                        "Genre:",
                        "Drama, ,War",
                        "Released Date: 2020",
                        "Runtime:  1hr 50mins",
                        "Thirty-four years after his death, Airman William H. Pitsenbarger, Jr. ,(\"Pits\") is awarded the nation's highest military honor, for his actions, on the battlefield.",
                        "Visit",
                        "for latest"
                    ],
                    "dl": [
                        {
                            "filename": "The.Last.Full.Measure.2019.1080p.WEB-DL.mkv",
                            "url": "http://dl5.cdn-france.info/f/The.Last.Full.Measure.2019.1080p.WEB-DL.MOVIE30T.CO.mkv"
                        },
                        {
                            "filename": "The.Last.Full.Measure.2019.720p.YTS.WEB-DL.mkv",
                            "url": "http://dl5.cdn-france.info/f/The.Last.Full.Measure.2019.720p.YTS.WEB-DL.MOVIE30T.CO.mkv"
                        },
                        {
                            "filename": "The.Last.Full.Measure.2019.720p.WEB-DL.mkv",
                            "url": "http://dl5.cdn-france.info/f/The.Last.Full.Measure.2019.720p.WEB-DL.MOVIE30T.CO.mkv"
                        }
                    ]
                },
                {
                    "title": "Monos 2019",
                    "cover": "https://m.media-amazon.com/images/M/MV5BYTA0ZDllNTYtY2ExYS00NGJlLWEzNGEtMjhkMzdhYjViMjZiXkEyXkFqcGdeQXVyODAzODU1NDQ@._V1_SY1000_CR0,0,674,1000_AL_.jpg",
                    "description": [
                        "Director: Alejandro Landes",
                        "Writer: Alejandro Landes (screenplay), Alexis Dos Santos (screenplay), Alejandro Landes (story by)",
                        "Stars: Sofia Buenaventura, Julian Giraldo, Karen Quintero, Laura Castrillón",
                        "Genres: Drama, Thriller",
                        "Country: Colombia, Argentina, Netherlands, Germany, Sweden, Uruguay",
                        "Language: English, Spanish",
                        "Released Date: 13 Sep 2019",
                        "Runtime: 102 min",
                        "On a faraway mountaintop, eight kids with guns watch over a hostage...."
                    ],
                    "dl": [
                        {
                            "filename": "Monos.2019.SPANISH.ENSUBBED.1080p.BRRip.mkv",
                            "url": "http://dl7.cdn-france.info/f/Monos.2019.SPANISH.ENSUBBED.1080p.BRRip.MOVIE30T.CO.mkv"
                        },
                        {
                            "filename": "Monos.2019.SPANISH.ENSUBBED.720p.BRRip.mkv",
                            "url": "http://dl7.cdn-france.info/f/Monos.2019.SPANISH.ENSUBBED.720p.BRRip.MOVIE30T.CO.mkv"
                        }
                    ]
                },
                {
                    "title": "Adventure Force 5 2019",
                    "cover": "https://m.media-amazon.com/images/M/MV5BMDNhNTJjMDMtZWU4Ny00ZjRiLWI4NDgtZWEyMGY2Yzc4MTUyXkEyXkFqcGdeQXVyMTA4MTE0NzU4._V1_SY1000_SX675_AL_.jpg",
                    "description": [
                        "Director: Michael Younesi",
                        "Writer: Michael Younesi",
                        "Stars: Dylan Arnold, Tate Birchmore, Donald Bowen",
                        "Genres: Action, Adventure, Family",
                        "Country: USA",
                        "Language: English",
                        "Released Date: 19 December 2019",
                        "Runtime: 82 min",
                        "When their quiet beach town is invaded by a mysterious threat, five kids, - a gamer, comic book geek, inventor, skater and martial artist - must ,band together and use an arsenal of homemade gadgets to fight back.."
                    ],
                    "dl": [
                        {
                            "filename": "Adventure.Force.5.2019.1080p.WEB-DL.mkv",
                            "url": "http://dl7.cdn-france.info/f/Adventure.Force.5.2019.1080p.WEB-DL.MOVIE30T.CO.mkv"
                        },
                        {
                            "filename": "Adventure.Force.5.2019.720p.WEB-DL.mkv",
                            "url": "http://dl7.cdn-france.info/f/Adventure.Force.5.2019.720p.WEB-DL.MOVIE30T.CO.mkv"
                        }
                    ]
                },
                {
                    "title": "Playing with Fire 2019",
                    "cover": "https://m.media-amazon.com/images/M/MV5BNTg4YjQyMDAtZWFiYi00OTMzLWJiYTgtMzRiNWMzMTAzMDQ0XkEyXkFqcGdeQXVyNjg2NjQwMDQ@._V1_SY1000_CR0,0,675,1000_AL_.jpg",
                    "description": [
                        "Director: Andy Fickman",
                        "Writer: Dan Ewen, Matt Lieberman",
                        "Stars: Judy Greer, John Cena, Brianna Hildebrand, Keegan-Michael Key",
                        "Genres: Comedy, Family",
                        "Country: USA",
                        "Language: English",
                        "Released Date: 08 Nov 2019",
                        "Runtime: 1hr 36mins",
                        "A crew of rugged firefighters meet their match when attempting to rescue three rambunctious kids."
                    ],
                    "dl": [
                        {
                            "filename": "Playing.with.Fire.2019.1080pRARBG.BRRip.mp4",
                            "url": "http://dl7.cdn-france.info/f/Playing.with.Fire.2019.1080pRARBG.BRRip.MOVIE30T.CO.mp4"
                        },
                        {
                            "filename": "Playing.with.Fire.2019.720p.RARBG.BRRip.mp4",
                            "url": "http://dl7.cdn-france.info/f/Playing.with.Fire.2019.720p.RARBG.BRRip.MOVIE30T.CO.mp4"
                        },
                        {
                            "filename": "Playing.with.Fire.2019.480p.BRRip.mkv",
                            "url": "http://dl7.cdn-france.info/f/Playing.with.Fire.2019.480p.BRRip.MOVIE30T.CO.mkv"
                        }
                    ]
                },
                {
                    "title": "The Good Liar 2019",
                    "cover": "https://m.media-amazon.com/images/M/MV5BN2VhNTY5ZTUtYzc1NC00NjUyLWI1NDQtYWE3YmJlNjQ3OGVlXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SY1000_CR0,0,674,1000_AL_.jpg",
                    "description": [
                        "Director: Bill Condon",
                        "Writer: Jeffrey Hatcher, Nicholas Searle (novel)",
                        "Stars: Helen Mirren, Ian McKellen, Russell Tovey, Jóhannes Haukur Jóhannesson",
                        "Genres: Drama",
                        "Country: USA",
                        "Language: English",
                        "Released Date: 15 Nov 2019",
                        "Runtime: 109 min",
                        "Career con artist Roy Courtnay can hardly believe his luck when he meets, well-to-do widow Betty McLeish online. As Betty opens her home and life, to him, Roy is surprised to find himself .."
                    ],
                    "dl": [
                        {
                            "filename": "The.Good.Liar.2019.1080p.RARBG.BRRip.mp4",
                            "url": "http://dl7.cdn-france.info/f/The.Good.Liar.2019.1080p.RARBG.BRRip.MOVIE30T.CO.mp4"
                        },
                        {
                            "filename": "The.Good.Liar.2019.720p.RARBG.BRRip.mp4",
                            "url": "http://dl7.cdn-france.info/f/The.Good.Liar.2019.720p.RARBG.BRRip.MOVIE30T.CO.mp4"
                        },
                        {
                            "filename": "The.Good.Liar.2019.480p.BRRip.mkv",
                            "url": "http://dl7.cdn-france.info/f/The.Good.Liar.2019.480p.BRRip.MOVIE30T.CO.mkv"
                        }
                    ]
                },
                {
                    "title": "A Fall from Grace 2020",
                    "cover": "https://m.media-amazon.com/images/M/MV5BNDM2YjliZDUtZWUzYi00ZDY4LWJlMTEtZGZiZDViZjJiMTllXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SY1000_CR0,0,675,1000_AL_.jpg",
                    "description": [
                        "Director: Tyler Perry",
                        "Writer: Tyler Perry",
                        "Stars: Tyler Perry, Mehcad Brooks, Cicely Tyson",
                        "Genre: Thriller",
                        "Released Date: 2020",
                        "Runtime:  2hrs",
                        "Disheartened since her ex-husband's affair, Grace Waters feels restored ,by a new romance. But when secrets erode her short-lived joy, Grace's ,vulnerable side turns violent.",
                        "Visit",
                        "for latest"
                    ],
                    "dl": [
                        {
                            "filename": "A.Fall.from.Grace.2020.1080p.WEB-DL.mkv",
                            "url": "http://dl5.cdn-france.info/f/A.Fall.from.Grace.2020.1080p.WEB-DL.MOVIE30T.CO.mkv"
                        },
                        {
                            "filename": "A.Fall.from.Grace.2020.720p.WEB-DL.mkv",
                            "url": "http://dl5.cdn-france.info/f/A.Fall.from.Grace.2020.720p.WEB-DL.MOVIE30T.CO.mkv"
                        },
                        {
                            "filename": "A.Fall.from.Grace.2020.480p.WEB-DL.mkv",
                            "url": "http://dl5.cdn-france.info/f/A.Fall.from.Grace.2020.480p.WEB-DL.MOVIE30T.CO.mkv"
                        }
                    ]
                },
                {
                    "title": "Bad Boys for Life 2020",
                    "cover": "https://m.media-amazon.com/images/M/MV5BMWU0MGYwZWQtMzcwYS00NWVhLTlkZTAtYWVjOTYwZTBhZTBiXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SY1000_CR0,0,674,1000_AL_.jpg",
                    "description": [
                        "Director: Adil El Arbi, Bilall Fallah",
                        "Writer: Chris Bremner (screenplay), Peter Craig (screenplay), Joe Carnahan (screenplay), Peter Craig (story), Joe Carnahan (story), George Gallo (characters)",
                        "Stars: Will Smith, Vanessa Hudgens, Alexander Ludwig, Joe Pantoliano",
                        "Genres: Action, Comedy, Crime, Thriller",
                        "Country: USA",
                        "Language: English",
                        "Released Date: 17 Jan 2020",
                        "Runtime: 123 min",
                        "The Bad Boys Mike Lowrey and Marcus Burnett are back together for one last ride in the highly anticipated Bad Boys for Life."
                    ],
                    "dl": [
                        {
                            "filename": "Bad.Boys.for.Life.2020.720p.HDTS.mkv",
                            "url": "http://dl7.cdn-france.info/f/Bad.Boys.for.Life.2020.720p.HDTS.MOVIE30T.CO.mkv"
                        }
                    ]
                },
                {
                    "title": "Through Black Spruce 2018",
                    "cover": "https://m.media-amazon.com/images/M/MV5BMjQzODY0NTA5N15BMl5BanBnXkFtZTgwNDIzMDcyNzM@._V1_.jpg",
                    "description": [
                        "Director: Don McKellar",
                        "Writer: Barbara Samuels",
                        "Stars: Tanaya Beatty, Tantoo Cardinal, Graham Greene, Parveen Kaur",
                        "Genres: Drama",
                        "Country: Canada",
                        "Language: English",
                        "Released Date: 8 September 2018",
                        "Runtime: 111 Min",
                        "The disappearance of a young Cree woman in Toronto traumatizes her ,Northern Ontario family, and sends her twin sister on a journey south to, find her."
                    ],
                    "dl": [
                        {
                            "filename": "Through.Black.Spruce.2018.1080p.BRRip.mkv",
                            "url": "http://dl5.cdn-france.info/f/Through.Black.Spruce.2018.1080p.BRRip.MOVIE30T.CO.mkv"
                        },
                        {
                            "filename": "Through.Black.Spruce.2018.720p.BRRip.mkv",
                            "url": "http://dl5.cdn-france.info/f/Through.Black.Spruce.2018.720p.BRRip.MOVIE30T.CO.mkv"
                        }
                    ]
                },
                {
                    "title": "Cats 2019",
                    "cover": "https://m.media-amazon.com/images/M/MV5BNjRlNTY3MTAtOTViMS00ZjE5LTkwZGItMGYwNGQwMjg2NTEwXkEyXkFqcGdeQXVyNjg2NjQwMDQ@._V1_SY1000_CR0,0,631,1000_AL_.jpg",
                    "description": [
                        "Director: Tom Hooper",
                        "Writer: T.S. Eliot (poetry collection \"Old Possum's Books of Practical Cats\"), Lee Hall (screenplay), Tom Hooper (screenplay), Andrew Lloyd Webber (musical)",
                        "Stars: Idris Elba, Francesca Hayward, Taylor Swift, Ian McKellen",
                        "Genres: Comedy, Drama, Family, Fantasy, Musical",
                        "Country: UK, USA",
                        "Language: English",
                        "Released Date: 20 Dec 2019",
                        "Runtime: 1hr 50mins",
                        "A tribe of cats called the Jellicles must decide yearly which one will ,ascend to the Heaviside Layer and come back to a new Jellicle life.",
                        "Visit",
                        "for latest"
                    ],
                    "dl": [
                        {
                            "filename": "Cats.2019.1080p.KORSUB.HDRip.mp4",
                            "url": "http://dl7.cdn-france.info/f/Cats.2019.1080p.KORSUB.HDRip.MOVIE30T.CO.mp4"
                        },
                        {
                            "filename": "Cats.2019.HC.720p.HDRip.GalaxyRG.mkv",
                            "url": "http://dl7.cdn-france.info/f/Cats.2019.HC.720p.HDRip.GalaxyRG.MOVIE30T.CO.mkv"
                        }
                    ]
                },
                {
                    "title": "Terminator Dark Fate 2019",
                    "cover": "https://m.media-amazon.com/images/M/MV5BNzhlYjE5MjMtZDJmYy00MGZmLTgwN2MtZGM0NTk2ZTczNmU5XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX640_CR0,0,640,999_AL_.jpg",
                    "description": [
                        "Director: Tim Miller",
                        "Writer: James Cameron (story by), Charles H. Eglee (story by),",
                        "Stars: Linda Hamilton, Arnold Schwarzenegger, Mackenzie Davis, Edward Furlong",
                        "Genres: Action, Adventure, Sci-Fi",
                        "Country: China, USA",
                        "Language: English",
                        "Released Date:2019",
                        "Sarah Connor and a hybrid cyborg human must protect a young girl from a newly modified liquid Terminator from the future.",
                        "Visit",
                        "for latest"
                    ],
                    "dl": [
                        {
                            "filename": "Terminator.Dark.Fate.2019.BluRay.1080p.RARBG.mp4",
                            "url": "http://dl2.svdl.ir/Film/KH/2019/Terminator.Dark.Fate.2019.BluRay.1080p.RARBG.mp4"
                        },
                        {
                            "filename": "Terminator.Dark.Fate.2019.BluRay.720p.x265.rmt.mkv",
                            "url": "http://dl2.svdl.ir/Film/KH/2019/Terminator.Dark.Fate.2019.BluRay.720p.x265.rmt.mkv"
                        },
                        {
                            "filename": "Terminator.Dark.Fate.2019.BluRay.720p.RARBG.mp4",
                            "url": "http://dl2.svdl.ir/Film/KH/2019/Terminator.Dark.Fate.2019.BluRay.720p.RARBG.mp4"
                        },
                        {
                            "filename": "Terminator.Dark.Fate.2019.BluRay.480p.rmt.mkv",
                            "url": "http://dl2.svdl.ir/Film/KH/2019/Terminator.Dark.Fate.2019.BluRay.480p.rmt.mkv"
                        }
                    ]
                },
                {
                    "title": "Knives Out 2019",
                    "cover": "https://m.media-amazon.com/images/M/MV5BZTg1MjI3M2EtMjAxZC00ZmZlLWE2OGEtYjNhZTA5NmI5MDVkXkEyXkFqcGdeQXVyODQxMTI4MjM@._V1_SY1000_CR0,0,706,1000_AL_.jpg",
                    "description": [
                        "Director: Rian Johnson",
                        "Writer: Rian Johnson",
                        "Stars: Daniel Craig, Chris Evans, Ana de Armas, Jamie Lee Curtis",
                        "Genres: Comedy, Crime, Drama, Mystery, Thriller",
                        "Country: USA",
                        "Language: English",
                        "Released Date: 27 Nov 2019",
                        "Runtime: 130 min",
                        "A detective investigates the death of a patriarch of an eccentric, combative family."
                    ],
                    "dl": [
                        {
                            "filename": "Knives.Out.2019.DVDScr.mkv",
                            "url": "http://server4.7uploader.com/Movie/2019/Knives.Out.2019.DVDScr.XVID.AC3.HQ.Hive-CM8.KinGMedia.avi"
                        }
                    ]
                },
                {
                    "title": "Just Mercy 2019",
                    "cover": "https://m.media-amazon.com/images/M/MV5BYmM4YzA5NjUtZGEyOS00YzllLWJmM2UtZjhhNmJhM2E1NjUxXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SY1000_CR0,0,674,1000_AL_.jpg",
                    "description": [
                        "Director: Destin Daniel Cretton",
                        "Writer: Destin Daniel Cretton (screenplay), Andrew Lanham (screenplay), Bryan Stevenson (memoir)",
                        "Stars: Brie Larson, Tim Blake Nelson, Michael B. Jordan, Rafe Spall",
                        "Genres: Drama",
                        "Country: USA",
                        "Language: English",
                        "Released Date: 10 Jan 2020",
                        "Runtime: 136 min",
                        "Just Mercy shadows world-renowned civil rights defense attorney Bryan ,Stevenson as he recounts his experiences and details the case of a ,condemned death row prisoner whom he fought to free."
                    ],
                    "dl": [
                        {
                            "filename": "Just.Mercy.2019.720p.SCR.mkv",
                            "url": "http://dl5.cdn-france.info/f/Just.Mercy.2019.720p.SCREENER.MOVIE30T.CO.mkv"
                        }
                    ]
                },
                {
                    "title": "Overcomer 2019",
                    "cover": "https://m.media-amazon.com/images/M/MV5BMTQ1NTZmMzEtMThjOS00ZTAzLWEwM2UtOGQyNDk0Y2Q1ZTU3XkEyXkFqcGdeQXVyMzc1ODcyNDY@._V1_SY1000_CR0,0,681,1000_AL_.jpg",
                    "description": [
                        "Director: Alex Kendrick",
                        "Writer: Alex Kendrick, Stephen Kendrick",
                        "Stars: Alex Kendrick, Shari Rigby, Ben Davies, Priscilla C. Shirer",
                        "Genres: Drama, Sport",
                        "Country: USA",
                        "Language: English",
                        "Released Date: 23 Aug 2019",
                        "Runtime: 119 min",
                        "A high-school basketball coach volunteers to coach a troubled teen in long-distance running.",
                        "Visit",
                        "for latest"
                    ],
                    "dl": [
                        {
                            "filename": "Overcomer.2019.1080p.BluRay.mkv",
                            "url": "http://server4.7uploader.com/Movie/2019/Overcomer.2019.1080p.BluRay.GalaxyRG.KinGMedia.mkv"
                        },
                        {
                            "filename": "Overcomer.2019.720p.BluRay.mkv",
                            "url": "http://server4.7uploader.com/Movie/2019/Overcomer.2019.720p.BluRay.GalaxyRG.KinGMedia.mkv"
                        }
                    ]
                },
                {
                    "title": "Doctor Sleep 2019",
                    "cover": "https://m.media-amazon.com/images/M/MV5BYmY3NGJlYTItYmQ4OS00ZTEwLWIzODItMjMzNWU2MDE0NjZhXkEyXkFqcGdeQXVyMzQzMDA3MTI@._V1_SY1000_CR0,0,674,1000_AL_.jpg",
                    "description": [
                        "Director: Mike Flanagan",
                        "Writer: Stephen King (based on the novel by), Mike Flanagan",
                        "Stars: Rebecca Ferguson, Ewan McGregor, Jacob Tremblay, Cliff Curtis",
                        "Genres: Horror",
                        "Country: USA",
                        "Language: English",
                        "Released Date: 08 Nov 2019",
                        "Runtime: 151 Min",
                        "Years following the events of \"The Shining,\" a now-adult Dan Torrance ,meets a young girl with similar powers as his and tries to protect her ,from a cult known as The True Knot who prey on children with powers to ,remain immortal.",
                        "Visit",
                        "for latest"
                    ],
                    "dl": [
                        {
                            "filename": "Doctor.Sleep.2019.BluRay.1080p.MkvHub.mkv",
                            "url": "http://dl2.svdl.ir/Film/KH/2019/Doctor.Sleep.2019.BluRay.1080p.MkvHub.mkv"
                        },
                        {
                            "filename": "Doctor.Sleep.2019.BluRay.720p.x265.PSA.mkv",
                            "url": "http://dl2.svdl.ir/Film/KH/2019/Doctor.Sleep.2019.BluRay.720p.x265.PSA.mkv"
                        },
                        {
                            "filename": "Doctor.Sleep.2019.BluRay.720p.MkvHub.mkv",
                            "url": "http://dl2.svdl.ir/Film/KH/2019/Doctor.Sleep.2019.BluRay.720p.MkvHub.mkv"
                        },
                        {
                            "filename": "Doctor.Sleep.2019.BluRay.480p.RMT.mkv",
                            "url": "http://dl2.svdl.ir/Film/KH/2019/Doctor.Sleep.2019.BluRay.480p.RMT.mkv"
                        }
                    ]
                },
                {
                    "title": "The Sun Is Also a Star 2019",
                    "cover": "https://m.media-amazon.com/images/M/MV5BMDhiNzUzYTItMWFjYS00ZDUwLWIxNTItMTlmMzAxZjNmMTJkXkEyXkFqcGdeQXVyNjg3MDMxNzU@._V1_SY1000_CR0,0,648,1000_AL_.jpg",
                    "description": [
                        "Director:",
                        "Ry Russo-Young",
                        "Writer:Tracy Oliver (screenplay), Nicola Yoon (novel)",
                        "Stars:Charles Melton, Yara Shahidi, Keong Sim, Gbenga Akinnagbe",
                        "Genres: Drama, Romance",
                        "Country:",
                        "USA",
                        "Language:English",
                        "Released Date:17 May 2019",
                        "Runtime:",
                        "100 min",
                        "A teenager finds love at a difficult time in her family's life."
                    ],
                    "dl": []
                },
                {
                    "title": "Midway 2019",
                    "cover": "https://m.media-amazon.com/images/M/MV5BMGVkNGMyMGEtMDNmOC00ZGYyLWEzOTItODdjMzRlZTk4MzUwXkEyXkFqcGdeQXVyODM2Njg2OTg@._V1_SY1000_SX800_AL_.jpg",
                    "description": [
                        "Director: Roland Emmerich",
                        "Writer: Wes Tooke",
                        "Stars: Patrick Wilson, Luke Evans, Woody Harrelson, Dennis Quaid",
                        "Genres: Action, Drama, History, War",
                        "Country: China, USA",
                        "Language: English",
                        "Released Date: 08 Nov 2019",
                        "Runtime: 138 min",
                        "The story of the Battle of Midway, told by the leaders and the sailors who fought it."
                    ],
                    "dl": [
                        {
                            "filename": "Midway.2019.READNFO.1080p.HDRip.EVO.mkv",
                            "url": "http://dl5.cdn-france.info/f/Midway.2019.READNFO.1080p.HDRip.EVO.MOVIE30T.CO.mkv"
                        },
                        {
                            "filename": "Midway.2019.1080p.HDRip.mkv",
                            "url": "http://dl5.cdn-france.info/f/Midway.2019.LiNE.1080p.HDRip.MOVIE30T.CO.mkv"
                        },
                        {
                            "filename": "Midwayy.2019.LiNE.720p.HDRip.mkv",
                            "url": "http://dl5.cdn-france.info/f/Midwayy.2019.LiNE.720p.HDRip.MOVIE30T.CO.mkv"
                        },
                        {
                            "filename": "Midway.2019.720p.HDRip.mkv",
                            "url": "http://dl5.cdn-france.info/f/Midway.2019.LiNE.720p.HDRip.MOVIE30T.CO.mkv"
                        },
                        {
                            "filename": "Midway.2019.LiNE.480p.HDRip.mkv",
                            "url": "http://dl5.cdn-france.info/f/Midway.2019.LiNE.480p.HDRip.MOVIE30T.CO.mkv"
                        }
                    ]
                },
                {
                    "title": "K 12 2019",
                    "cover": "https://m.media-amazon.com/images/M/MV5BMDkwOTk0YjctNGJmMS00OWRhLWI3NmEtYWRlMzBhYzVlYjEwXkEyXkFqcGdeQXVyMTY3MjQ4NTA@._V1_SY1000_CR0,0,675,1000_AL_.jpg",
                    "description": [
                        "Director: Melanie Martinez",
                        "Writer: Melanie Martinez",
                        "Stars: Melanie Martinez, Emma Harvey, Zión Moreno, Megan Gage",
                        "Genres: Fantasy, Horror, Musical",
                        "Country: USA",
                        "Language: English",
                        "Released Date: 05 Sep 2019",
                        "Runtime: 96 min",
                        "A brave-hearted girl and her charming best friend make a bewitching pair, as they embark on a mission to take down the oppressive schooling ,system of K-12.",
                        "Visit",
                        "for latest"
                    ],
                    "dl": [
                        {
                            "filename": "K.12.2019.1080p.WEB.DL.mkv",
                            "url": "http://dl11.cdn-france.info/dl/f/K.12.2019.1080p.WEB.DL.MOVIE30T.CO.mkv"
                        },
                        {
                            "filename": "K.12.2019.720p.WEB.DL.mkv",
                            "url": "http://dl11.cdn-france.info/dl/f/K.12.2019.720p.WEB.DL.MOVIE30T.CO.mkv"
                        }
                    ]
                },
                {
                    "title": "Troop Zero 2020",
                    "cover": "https://m.media-amazon.com/images/M/MV5BMjEyMjgwMjMxNV5BMl5BanBnXkFtZTgwNTQ2NTAzNzM@._V1_SY1000_CR0,0,674,1000_AL_.jpg",
                    "description": [
                        "Director: Bert & Bertie",
                        "Writer: Lucy Alibar (screenplay), Lucy Alibar",
                        "Stars: Mckenna Grace, Viola Davis, Jim Gaffigan, Allison Janney",
                        "Genres: Comedy, Drama, Family",
                        "Country: USA",
                        "Language: English",
                        "Released Date: 17 Jan 2020",
                        "Runtime: 94 min",
                        "In rural 1977 Georgia, a misfit girl dreams of life in outer space. When, a competition offers her a chance to be recorded on NASA's Golden ,Record, she recruits a makeshift troop of Birdie Scouts, forging ,friendships that last a lifetime."
                    ],
                    "dl": [
                        {
                            "filename": "Troop.Zero.2020.PROPER.1080p.WEB-DL.mkv",
                            "url": "http://dl5.cdn-france.info/f/Troop.Zero.2020.PROPER.1080p.WEB-DL.MOVIE30T.CO.mkv"
                        },
                        {
                            "filename": "Troop.Zero.2020.REPACK.720p.WEB-DL.mkv",
                            "url": "http://dl5.cdn-france.info/f/Troop.Zero.2020.REPACK.720p.WEB-DL.MOVIE30T.CO.mkv"
                        }
                    ]
                },
                {
                    "title": "Mrs Lowry and Son 2019",
                    "cover": "https://m.media-amazon.com/images/M/MV5BMmRmNzMwOTYtZTJiYi00MzlhLTgyMDMtMmU2MDUzYTY2NDEzXkEyXkFqcGdeQXVyMjc5MjYyMA@@._V1_SY1000_SX675_AL_.jpg",
                    "description": [
                        "Director: Adrian Noble",
                        "Writer: Martyn Hesford",
                        "Stars: Vanessa Redgrave, Timothy Spall, Stephen Lord, David Schaal",
                        "Genres: Biography, Drama, History",
                        "Country: UK",
                        "Language: English",
                        "Released Date: 30 Aug 2019",
                        "Runtime: 91 min",
                        "A portrait of the artist L.S. Lowry and the relationship with his mother, who tries to dissuade him from pursuing his passion."
                    ],
                    "dl": [
                        {
                            "filename": "Mrs.Lowry.and.Son.2019.1080p.BRRip.mkv",
                            "url": "http://dl6.cdn-france.info/f/Mrs.Lowry.and.Son.2019.1080p.BRRip.MOVIE30T.CO.mkv"
                        },
                        {
                            "filename": "Mrs.Lowry.and.Son.2019.720p.BRRip.mkv",
                            "url": "http://dl6.cdn-france.info/f/Mrs.Lowry.and.Son.2019.720p.BRRip.MOVIE30T.CO.mkv"
                        }
                    ]
                },
                {
                    "title": "Dolittle 2020",
                    "cover": "https://m.media-amazon.com/images/M/MV5BMDNkODA5ZGQtODczOS00OTQxLThhMTItMjk0ZmNhMDM0YjNmXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SY1000_SX675_AL_.jpg",
                    "description": [
                        "Director: Stephen Gaghan",
                        "Writer: Stephen Gaghan (screenplay), Hugh Lofting (character created by), Thomas Shepherd (screen story)",
                        "Stars: Kumail Nanjiani, Robert Downey Jr., Tom Holland, Emma Thompson",
                        "Genres: Adventure, Comedy, Family, Fantasy",
                        "Country: USA",
                        "Language: English",
                        "Released Date: 17 Jan 2020",
                        "Runtime: 1hr 41mins",
                        "A physician discovers that he can talk to animals."
                    ],
                    "dl": [
                        {
                            "filename": "Dolittle.2020.720p.HDCAM.mkv",
                            "url": "http://server4.7uploader.com/Movie/2020/Dolittle.2020.720p.HDCAM.BONSAI.KinGMedia.mkv"
                        }
                    ]
                },
                {
                    "title": "Honey Boy 2019",
                    "cover": "https://m.media-amazon.com/images/M/MV5BZWQ5YThjZjAtNWM3ZC00MDJjLWIzNDktY2Y2Y2FmMTFiNWJmXkEyXkFqcGdeQXVyMTA2MDQ3MTQ3._V1_SY1000_SX675_AL_.jpg",
                    "description": [
                        "Director: Alma Har'el",
                        "Writer: Shia LaBeouf",
                        "Stars: Shia LaBeouf, Lucas Hedges, Noah Jupe",
                        "Genre:Drama",
                        "Released Date:27 November 2019",
                        "Runtime:  1hr 34mins",
                        "A young actor's stormy childhood and early adult years as he struggles ,to reconcile with his father and deal with his mental health."
                    ],
                    "dl": [
                        {
                            "filename": "Honey.Boy.2019.DVDSCR.mkv",
                            "url": "http://dl5.cdn-france.info/f/Honey.Boy.2019.DVDSCR.XviD.AC3-EVO.MOVIE30T.CO.mkv"
                        }
                    ]
                },
                {
                    "title": "Intrigo Death Of An Author 2018",
                    "cover": "https://m.media-amazon.com/images/M/MV5BYmM5YzhhNzMtOWI2YS00MDIzLThmNTUtN2Q2N2MwMGFlYWEwXkEyXkFqcGdeQXVyOTg4MDYyNw@@._V1_.jpg",
                    "description": [
                        "Director: Daniel Alfredson",
                        "Writer: Daniel Alfredson, Birgitta Bongenhielm, Håkan Nesser (novels)",
                        "Stars: Ben Kingsley, Tuva Novotny, Michael Byrne, Veronica Ferres",
                        "Genres: Crime, Drama, Mystery, Thriller",
                        "Country: Sweden, USA, Germany",
                        "Language: English",
                        "Released Date: 11 Oct 2018",
                        "Runtime: 106 min",
                        "A small open boat ploughs through a troubled sea off the Dutch coast. ,One solitary man at the rudder. A few days later, when the wind has ,settled, the smashed up remains of the boat will be..."
                    ],
                    "dl": [
                        {
                            "filename": "Intrigo.Death.Of.An.Author.2018.1080p.WEB-DL.mkv",
                            "url": "http://dl6.cdn-france.info/f/Intrigo.Death.Of.An.Author.2018.1080p.WEB-DL.YTS.MOVIE30T.CO.mkv"
                        },
                        {
                            "filename": "Intrigo.Death.Of.An.Author.2018.720p.WEB-DL.mkv",
                            "url": "http://dl6.cdn-france.info/f/Intrigo.Death.Of.An.Author.2018.720p.WEB-DL.YTS.MOVIE30T.CO.mkv"
                        }
                    ]
                },
                {
                    "title": "The Battle Of Jangsari 2019",
                    "cover": "https://m.media-amazon.com/images/M/MV5BY2I0YjM0NTItZjA0Zi00ZWUwLThjYzQtNmYxN2FiN2VkMzM0XkEyXkFqcGdeQXVyNTUxNTI3MzY@._V1_SY1000_CR0,0,657,1000_AL_.jpg",
                    "description": [
                        "Director: Kyung-taek Kwak",
                        "Writer: Brian Chung (English Scenes written by), Cory Gustke (English Scenes written by)",
                        "Stars: Myung-Min Kim, Megan Fox, Minho Choi, Sung-Cheol Kim",
                        "Genres: Action, Drama, War",
                        "Country: South Korea",
                        "Language: Korean",
                        "Released Date: 11 Oct 2019",
                        "Runtime: 104 min",
                        "A depiction of the Battle of Incheon during the Korean War in 1950."
                    ],
                    "dl": [
                        {
                            "filename": "The.Battle.Of.Jangsari.2019.1080p.BRRip.mkv",
                            "url": "http://dl6.cdn-france.info/f/The.Battle.Of.Jangsari.2019.1080p.BRRip.YTS.MOVIE30T.CO.mkv"
                        },
                        {
                            "filename": "The.Battle.Of.Jangsari.2019.720p.BRRip.mkv",
                            "url": "http://dl6.cdn-france.info/f/The.Battle.Of.Jangsari.2019.720p.BRRip.YTS.MOVIE30T.CO.mkv"
                        }
                    ]
                },
                {
                    "title": "Color Out of Space 2019",
                    "cover": "https://m.media-amazon.com/images/M/MV5BZjQ1YTM4M2UtMTQxNS00YjdjLTgwZGYtZTgzYmFiYjFkYzNlXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SY1000_SX675_AL_.jpg",
                    "description": [
                        "Director: Richard Stanley",
                        "Writer: Scarlett Amaris, H.P. Lovecraft (based on the short story by), Richard Stanley (screenplay)",
                        "Stars: Nicolas Cage, Joely Richardson, Q'orianka Kilcher, Tommy Chong",
                        "Genres: Horror, Sci-Fi",
                        "Country: Portugal, USA, Malaysia",
                        "Language: English",
                        "Released Date: 2020",
                        "Runtime: 111 min",
                        "A town is struck by a meteorite and the fallout is catastrophic."
                    ],
                    "dl": [
                        {
                            "filename": "Color.Out.of.Space.2019.720p.DVDSCR.mkv",
                            "url": "http://dl5.cdn-france.info/f/Color.Out.of.Space.2019.720p.DVDSCR.MOVIE30T.CO.mkv"
                        }
                    ]
                }
            ]
        };
    }

    static async dummySingle() {
        return {
            "title": "The Battle Of Jangsari 2019",
            "cover": "https://m.media-amazon.com/images/M/MV5BY2I0YjM0NTItZjA0Zi00ZWUwLThjYzQtNmYxN2FiN2VkMzM0XkEyXkFqcGdeQXVyNTUxNTI3MzY@._V1_SY1000_CR0,0,657,1000_AL_.jpg",
            "description": [
                "Director: Kyung-taek Kwak",
                "Writer: Brian Chung (English Scenes written by), Cory Gustke (English Scenes written by)",
                "Stars: Myung-Min Kim, Megan Fox, Minho Choi, Sung-Cheol Kim",
                "Genres: Action, Drama, War",
                "Country: South Korea",
                "Language: Korean",
                "Released Date: 11 Oct 2019",
                "Runtime: 104 min",
                "A depiction of the Battle of Incheon during the Korean War in 1950."
            ],
            "dl": [
                {
                    "filename": "The.Battle.Of.Jangsari.2019.1080p.BRRip.mkv",
                    "url": "http://dl6.cdn-france.info/f/The.Battle.Of.Jangsari.2019.1080p.BRRip.YTS.MOVIE30T.CO.mkv"
                },
                {
                    "filename": "The.Battle.Of.Jangsari.2019.720p.BRRip.mkv",
                    "url": "http://dl6.cdn-france.info/f/The.Battle.Of.Jangsari.2019.720p.BRRip.YTS.MOVIE30T.CO.mkv"
                }
            ]
        };
    }

    static dummyGetFilters() {
        return {
            "genre": [
                {
                    "filename": "Action",
                    "url": "/search/label/Action"
                },
                {
                    "filename": "Adventure",
                    "url": "/search/label/Adventure"
                },
                {
                    "filename": "Animation",
                    "url": "/search/label/Animation"
                },
                {
                    "filename": "Biography",
                    "url": "/search/label/Biography"
                },
                {
                    "filename": "Comedy",
                    "url": "/search/label/Comedy"
                },
                {
                    "filename": "Crime",
                    "url": "/search/label/Crime"
                },
                {
                    "filename": "Documentary",
                    "url": "/search/label/Documentary"
                },
                {
                    "filename": "Drama",
                    "url": "/search/label/Drama"
                },
                {
                    "filename": "Family",
                    "url": "/search/label/Family"
                },
                {
                    "filename": "Fantasy",
                    "url": "/search/label/Fantasy"
                },
                {
                    "filename": "History",
                    "url": "/search/label/History"
                },
                {
                    "filename": "Horror",
                    "url": "/search/label/Horror"
                },
                {
                    "filename": "Music",
                    "url": "/search/label/Music"
                },
                {
                    "filename": "Musical",
                    "url": "/search/label/Musical"
                },
                {
                    "filename": "Mystery",
                    "url": "/search/label/Mystery"
                },
                {
                    "filename": "Reality-TV",
                    "url": "/search/label/Reality-TV"
                },
                {
                    "filename": "Romance",
                    "url": "/search/label/Romance"
                },
                {
                    "filename": "Sci-Fi",
                    "url": "/search/label/Sci-Fi"
                },
                {
                    "filename": "Short",
                    "url": "/search/label/Short"
                },
                {
                    "filename": "Sport",
                    "url": "/search/label/Sport"
                },
                {
                    "filename": "Thriller",
                    "url": "/search/label/Thriller"
                },
                {
                    "filename": "War",
                    "url": "/search/label/War"
                },
                {
                    "filename": "Western",
                    "url": "/search/label/Western"
                }
            ],
            "year": [
                {
                    "filename": "2020",
                    "url": "/search/label/2020"
                },
                {
                    "filename": "2019",
                    "url": "/search/label/2019"
                },
                {
                    "filename": "2018",
                    "url": "/search/label/2018"
                },
                {
                    "filename": "2017",
                    "url": "/search/label/2017"
                },
                {
                    "filename": "2016",
                    "url": "/search/label/2016"
                },
                {
                    "filename": "2015",
                    "url": "/search/label/2015"
                },
                {
                    "filename": "2014",
                    "url": "/search/label/2014"
                },
                {
                    "filename": "2013",
                    "url": "/search/label/2013"
                },
                {
                    "filename": "2012",
                    "url": "/search/label/2012"
                },
                {
                    "filename": "2011",
                    "url": "/search/label/2011"
                },
                {
                    "filename": "2010",
                    "url": "/search/label/2010"
                },
                {
                    "filename": "2009",
                    "url": "/search/label/2009"
                },
                {
                    "filename": "2008",
                    "url": "/search/label/2017"
                },
                {
                    "filename": "2007",
                    "url": "/search/label/2007"
                },
                {
                    "filename": "2006",
                    "url": "/search/label/2006"
                },
                {
                    "filename": "2005",
                    "url": "/search/label/2005"
                },
                {
                    "filename": "2004",
                    "url": "/search/label/2004"
                },
                {
                    "filename": "2003",
                    "url": "/search/label/2003"
                },
                {
                    "filename": "2002",
                    "url": "/search/label/2002"
                },
                {
                    "filename": "2001",
                    "url": "/search/label/2001"
                },
                {
                    "filename": "1900-2000",
                    "url": "/search/label/1900-2000"
                }
            ],
            "collections": [
                {
                    "filename": "A Nightmare on Elm Street",
                    "url": "/search/label/A%20Nightmare%20on%20Elm%20Street"
                },
                {
                    "filename": "Alvin and the Chipmunks",
                    "url": "/search/label/Alvin%20and%20the%20Chipmunks"
                },
                {
                    "filename": "American Pie",
                    "url": "/search/label/American%20Pie"
                },
                {
                    "filename": "Avengers",
                    "url": "/search/label/Avengers"
                },
                {
                    "filename": "Back To The Future",
                    "url": "/search/label/Back%20To%20The%20Future"
                },
                {
                    "filename": "Beverly Hills Cop",
                    "url": "/search/label/Beverly%20Hills%20Cop"
                },
                {
                    "filename": "Biography",
                    "url": "/search/label/Biography"
                },
                {
                    "filename": "Blade",
                    "url": "/search/label/Blade"
                },
                {
                    "filename": "Captain America",
                    "url": "/search/label/Captain%20America"
                },
                {
                    "filename": "Charles Chaplin",
                    "url": "/search/label/Charles%20Chaplin"
                },
                {
                    "filename": "Childs Play",
                    "url": "/search/label/Childs%20Play"
                },
                {
                    "filename": "Chronicles of Narnia",
                    "url": "/search/label/Chronicles%20of%20Narnia"
                },
                {
                    "filename": "Death Race",
                    "url": "/search/label/Death%20Race"
                },
                {
                    "filename": "Die Hard",
                    "url": "/search/label/Die%20Hard"
                },
                {
                    "filename": "Final Destination",
                    "url": "/search/label/Final%20Destination"
                },
                {
                    "filename": "Friday the 13th",
                    "url": "/search/label/Friday%20the%2013th"
                },
                {
                    "filename": "Goal",
                    "url": "/search/label/Goal"
                },
                {
                    "filename": "Guardians Of The Galaxy",
                    "url": "/search/label/Guardians%20Of%20The%20Galaxy"
                },
                {
                    "filename": "Harry Potter",
                    "url": "/search/label/Harry%20Potter"
                },
                {
                    "filename": "Hatchet",
                    "url": "/search/label/Hatchet"
                },
                {
                    "filename": "Home Alone",
                    "url": "/search/label/Home%20Alone"
                },
                {
                    "filename": "Hostel",
                    "url": "/search/label/Hostel"
                },
                {
                    "filename": "Hulk",
                    "url": "/search/label/Hulk"
                },
                {
                    "filename": "Ice Age",
                    "url": "/search/label/Ice%20Age"
                },
                {
                    "filename": "Ice Age Collection",
                    "url": "/search/label/Ice%20Age%20Collection"
                },
                {
                    "filename": "Indiana Jones",
                    "url": "/search/label/Indiana%20Jones"
                },
                {
                    "filename": "IP MAN",
                    "url": "/search/label/IP%20MAN"
                },
                {
                    "filename": "Iron Man",
                    "url": "/search/label/Iron%20Man"
                },
                {
                    "filename": "James Bond",
                    "url": "/search/label/James%20Bond"
                },
                {
                    "filename": "Justice League",
                    "url": "/search/label/Justice%20League"
                },
                {
                    "filename": "Kung Fu Panda",
                    "url": "/search/label/Kung%20Fu%20Panda"
                },
                {
                    "filename": "Lethal Weapon (Movie)",
                    "url": "/search/label/Lethal%20Weapon%20%28Movie%29"
                },
                {
                    "filename": "Madagascar",
                    "url": "/search/label/Madagascar"
                },
                {
                    "filename": "Marvel One Shots",
                    "url": "/search/label/Marvel%20One%20Shots"
                },
                {
                    "filename": "Mission Impossible",
                    "url": "/search/label/Mission%20Impossible"
                },
                {
                    "filename": "Night at the Museum",
                    "url": "/search/label/Night%20at%20the%20Museum"
                },
                {
                    "filename": "Ong Bak",
                    "url": "/search/label/Ong%20Bak"
                },
                {
                    "filename": "Pirates of the caribbean",
                    "url": "/search/label/Pirates%20of%20the%20caribbean"
                },
                {
                    "filename": "Rambo",
                    "url": "/search/label/Rambo"
                },
                {
                    "filename": "Resident Evil",
                    "url": "/search/label/Resident%20Evil"
                },
                {
                    "filename": "Robocop",
                    "url": "/search/label/Robocop"
                },
                {
                    "filename": "Rush Hour",
                    "url": "/search/label/Rush%20Hour"
                },
                {
                    "filename": "Saw",
                    "url": "/search/label/Saw"
                },
                {
                    "filename": "Scary Movie",
                    "url": "/search/label/Scary%20Movie"
                },
                {
                    "filename": "Shrek",
                    "url": "/search/label/Shrek"
                },
                {
                    "filename": "Siccin",
                    "url": "/search/label/Siccin"
                },
                {
                    "filename": "Spider Man",
                    "url": "/search/label/Spider%20Man"
                },
                {
                    "filename": "Star Wars",
                    "url": "/search/label/Star%20Wars"
                },
                {
                    "filename": "Step Up",
                    "url": "/search/label/Step%20Up"
                },
                {
                    "filename": "Superman",
                    "url": "/search/label/Superman"
                },
                {
                    "filename": "Terminator",
                    "url": "/search/label/Terminator"
                },
                {
                    "filename": "The Bourne",
                    "url": "/search/label/The%20Bourne"
                },
                {
                    "filename": "The Expendables",
                    "url": "/search/label/The%20Expendables"
                },
                {
                    "filename": "The Fast and the Furious",
                    "url": "/search/label/The%20Fast%20and%20the%20Furious"
                },
                {
                    "filename": "The French Connection",
                    "url": "/search/label/The%20French%20Connection"
                },
                {
                    "filename": "The Godfather Collection",
                    "url": "/search/label/The%20Godfather%20Collection"
                },
                {
                    "filename": "The Hangover",
                    "url": "/search/label/The%20Hangover"
                },
                {
                    "filename": "The Hobbit",
                    "url": "/search/label/The%20Hobbit"
                },
                {
                    "filename": "The Hunger Games",
                    "url": "/search/label/The%20Hunger%20Games"
                },
                {
                    "filename": "The Lion King",
                    "url": "/search/label/The%20Lion%20King"
                },
                {
                    "filename": "The Lord of the Rings",
                    "url": "/search/label/The%20Lord%20of%20the%20Rings"
                },
                {
                    "filename": "The Mummy",
                    "url": "/search/label/The%20Mummy"
                },
                {
                    "filename": "The Ring",
                    "url": "/search/label/The%20Ring"
                },
                {
                    "filename": "The Transporter",
                    "url": "/search/label/The%20Transporter"
                },
                {
                    "filename": "Thor",
                    "url": "/search/label/Thor"
                },
                {
                    "filename": "Tomb Raider",
                    "url": "/search/label/Tomb%20Raider"
                },
                {
                    "filename": "Toy Story",
                    "url": "/search/label/Toy%20Story"
                },
                {
                    "filename": "Transformers",
                    "url": "/search/label/Transformers"
                },
                {
                    "filename": "Twilight",
                    "url": "/search/label/Twilight"
                },
                {
                    "filename": "Underworld",
                    "url": "/search/label/Underworld"
                },
                {
                    "filename": "Undisputed",
                    "url": "/search/label/Undisputed"
                },
                {
                    "filename": "Universal Soldier",
                    "url": "/search/label/Universal%20Soldier"
                },
                {
                    "filename": "Wrong Turn",
                    "url": "/search/label/Wrong%20Turn"
                },
                {
                    "filename": "X-Men",
                    "url": "/search/label/X-Men"
                }
            ]
        };
    }

}

module.exports = Movies;
