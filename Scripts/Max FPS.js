/**
 * @description Max FPS
 * @author Saxon
 * @revision 3
 * @minimumVersion 1.0.0.0
 * @param {int} MaxFps Max FPS (eg, 30, 50, 60)
 * @output Fps Greater Than Max
 * @output Fps Lower Than Max
 */
function Script(MaxFps)
{
    // get the first video stream, likely the only one
    let video = Variables.vi?.VideoInfo?.VideoStreams[0];
    if (!video)
        return -1; // no video streams detected

    // check if the fps for a video is over a certain amount
    let MAX_FPS = MaxFps * 1.0;
    
    // get the fps
    let fps = video.FramesPerSecond;
    // Bugfix for way to high framerate detected by losing the decimal point
    if(fps > 200) {
        fps = fps / 100;
    }

    // Round the fps to 2 decimal places
    fps = parseFloat(fps.toFixed(2));

    // check if the fps is over the maximum bitrate
    if(fps > MAX_FPS) {
        let encodeFps = (fps / 2).toFixed(2); // Also round the halved fps
        Logger.ILog(`The video is ${fps}fps, encoding to ${encodeFps}fps`);
        Variables.EncFPS = `-r ${encodeFps}`;
        return 1;
    }
    else {
        Logger.ILog(`The video is ${fps}fps, encoding to ${fps}fps`);
        Variables.EncFPS = ``;
        return 2;
    }
}
