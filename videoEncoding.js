const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

ffmpeg('videos/video.mp4').addOptions([
    '-y',
    '-hide_banner',
    '-profile:v baseline',
    '-level 3.0',
    '-start_number 0',
    '-hls_time 5',
    '-hls_list_size 0',
    '-f hls',
    '-preset ultrafast'
]).output('videos/output.m3u8')
    .on('progress', function(progress) {
        console.log(progress);
    })
    .on('end', () =>
    {
        console.log('done')
    })
    .on('error', (e) =>
    {
        console.log(e)
    })
    .run()