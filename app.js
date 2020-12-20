const app = require('express')();
const morgan = require('morgan');
app.use(morgan('dev'))
const whois = require('node-whois')

const fs = require('fs');
const hls = require('hls-server');

app.get('/', (req, res) =>
{
    return res.status(200).sendFile(`${__dirname}/client.html`);
})

app.all('*', (req, res) =>
{
    console.log(req._remoteAddress);
    whois.lookup('82.18.131.62', (e, d) =>
    {
        console.log(e, d)
    })
})


const server = app.listen(process.env.PORT || 3000, () =>
{
    console.log(`Listening on port ${process.env.PORT || 3000}`);
});

new hls(server, {
    provider: {
        exists: (req, cb) => {
            const ext = req.url.split('.').pop();

            if(ext !== 'm3u8' && ext !== 'ts') {
                return cb(null, true);
            }

            fs.access(__dirname + req.url, fs.constants.F_OK, function (err) {
                if(err) {
                    console.log('Not exist');
                    return cb(null, false);
                }
                cb(null, true);
            })
        },
        getManifestStream: (req, cb) => {
            const stream  = fs.createReadStream(__dirname + req.url);
            cb(null, stream);
        },
        getSegmentStream: (req, cb) => {
            const stream  = fs.createReadStream(__dirname + req.url);
            cb(null, stream);
        }
    }
})

module.exports = { server }