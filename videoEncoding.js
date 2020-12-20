const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const io = require('./rpc');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

ffmpeg('videos/video.mp4').addOptions([
    '-y',
    '-hide_banner',
    '-level 3.0',
    '-start_number 0',
    '-hls_time 5',
    '-hls_list_size 0',
    '-f hls',
    '-preset veryfast',
    '-tune film',
    '-vb 20M'
]).output('videos/output.m3u8')
    .on('codecData', (data) =>
    {
        io.emit('codec_data', data)
    })
    .on('progress', function(progress) {
        io.emit('stream_progress', {...progress})
    })
    .on('end', () =>
    {
        io.emit('stream_finished');
    })
    .on('error', (e) =>
    {
        console.log(e)
    })
    .run()