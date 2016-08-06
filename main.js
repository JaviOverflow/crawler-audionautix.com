var Crawler = require("node-webcrawler");
var fs = require('fs');

const START_URL = 'http://audionautix.com/index.php';
const FORM_DATA = 'action=search&hptrack=&tags%5B%5D=%27Calming%27&tags%5B%5D=%27Relaxing%27&tags%5B%5D=%27Uplifting%27&tags%5B%5D=%27Bright%27&tags%5B%5D=%27Grooving%27&tags%5B%5D=%27Energy%27&tags%5B%5D=%27Sad%27&tags%5B%5D=%27Driving%27&tags%5B%5D=%27Bouncy%27&tags%5B%5D=%27Dark%27&tags%5B%5D=%27Pensive%27&tags%5B%5D=%27Somber%27&tags%5B%5D=%27Epic%27&tags%5B%5D=%27Cool%27&tags%5B%5D=%27Guest+Composer%27&tags%5B%5D=%27Mysterious%27&tags%5B%5D=%27Moody%27&tags%5B%5D=%27Meditative%27&tags%5B%5D=%27Intense%27&tags%5B%5D=%27Humorous%27&tags%5B%5D=%27Short+Bits%27&tags%5B%5D=%27Suspenseful%27&tags%5B%5D=%27Christmas%27&tags%5B%5D=%27Action%27&tags%5B%5D=%27Aggressive%27&tags%5B%5D=%27Meditation%27&tags%5B%5D=%27Melancholy%27&tags%5B%5D=%27Dramatic%27&tags%5B%5D=%27Vocal%27&tags%5B%5D=%27Soothing%27&tags%5B%5D=%27Light%27&tags%5B%5D=%27Happy%27&tags%5B%5D=%27Angry%27&tags%5B%5D=%27Inspiration%27&tags%5B%5D=%27Smooth%27&submit=+Find+Music+';

const SONGS_JSON_PATH = 'songs.json';
const DOMAIN = 'http://audionautix.com';

var songs = [];
var amount_songs_crawled = 0;
var total_songs_to_crawl;

var songsCrawler = new Crawler({
    maxConnections: 10,
    callback: function (error, result, $) {

        var songNodes = $('.download');
        total_songs_to_crawl = songNodes.length;

        songNodes.each(function (index, element) {

            amount_songs_crawled += 1;
            console.log((amount_songs_crawled/total_songs_to_crawl * 100).toFixed(2) + "%");

            var info = $(this).parent().text().split('\n');

            var name = info[1].trim();
            var genre = info[2].replace('Genre:', '').trim();
            var tempo = info[3].replace('Tempo:', '').trim();
            var feelings = info[5].replace('Mood:', '').trim();

            var downloadUrl = DOMAIN + $(this).attr('href');

            songs.push({
                name: name,
                genre: genre,
                tempo: tempo,
                feelings: feelings,
                url: downloadUrl
            });
        });
    },
    onDrain: function (pool) {
        fs.writeFile(
            SONGS_JSON_PATH,
            JSON.stringify(songs),
            function (err) {
                if (err)
                    console.error("Error: Could not save songs to json.");
                else
                    console.log("Songs saved to '" + SONGS_JSON_PATH + "' file");
            }
        )
    }
});

songsCrawler.queue({
    uri: START_URL,
    method: 'POST',
    headers: {
        // 'Host': 'audionautix.com',
        // 'Connection': 'keep-alive',
        // 'Cache-Control': 'max-age=0',
        // 'Upgrade-Insecure-Requests': 1,
        // 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
        'User-Agent': 'Let me crawl your website a bit =)',
        // 'Content-Length': 930,
        // 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        // 'Accept-Encoding': 'gzip, deflate, sdch',
        // 'Accept-Language': 'es-ES,es;q=0.8,ca;q=0.6,en;q=0.4'
    },
    // formData: {
    //     'action': 'search',
    //     'hptrack': '',
    //     'tags': ['Calming', 'Relaxing'],
    //     'submit': 'Find Music'
    // }
    form: FORM_DATA
});
