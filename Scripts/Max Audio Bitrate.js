/**
 * @description Max Audio Bitrate
 * @author Saxon
 * @revision 3
 * @minimumVersion 1.0.0.0
 * @param {int} MaxAudioBitrate Max Audio Bitrate (kbps)
 * @output Audio Bitrate Greater Than Max
 * @output Audio Bitrate Lower Than Max
 */
function Script(MaxAudioBitrate)
{

let audio = Variables.vi?.VideoInfo?.AudioStreams[0];
if (!audio)
    return -1; // no video streams detected

  let audBit = audio.Bitrate / 1000;
  if (audBit > MaxAudioBitrate) {
    Logger.ILog(`Source Audio: ${audio.channels}ch ${audBit}kbps - Transcoding`);
    return 1;
  }
  // Passthru the audio track
  Logger.ILog(`Source Audio: ${audio.channels}ch ${audBit}kbps - Passthru`);
  return 2;
}
