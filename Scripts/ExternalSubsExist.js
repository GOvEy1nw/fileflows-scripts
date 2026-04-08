/**
 * @description Custom FileFlows script to check for external subtitles and process audio with Whisper if no subtitles are found.
 * @author rais
 * @revision 2
 * @minimumVersion 1.0.0.0
 * @param {string} SubtitleExtensions Subtitle file extensions to check for (comma-separated, eg. .srt,.en.srt,.eng.srt)
 * @output No External Subs Found
 * @output External Subs Found
 */
function Script() {
  // Parse the comma-separated subtitle extensions into an array
  let extensions = SubtitleExtensions.toString()
    .split(",")
    .map((ext) => ext.trim());
  let baseName = Variables.file.NameNoExtension;
  let directory = Variables.folder.FullName;
  let existingSubtitles = [];

  for (let ext of extensions) {
    let subtitlePath = directory + "/" + baseName + "." + ext;
    if (Flow.FileExists(subtitlePath)) {
      existingSubtitles.push(subtitlePath);
      Logger.ILog("Found subtitle file: " + subtitlePath);
    }
  }

  if (existingSubtitles.length > 0) {
    Variables.existingSubtitles = existingSubtitles;
    Logger.ILog("Subtitle files found: " + existingSubtitles.join(", "));
    return 2;
  } else {
    Logger.ILog("No subtitle files found for: " + baseName);
    return 1;
  }
}
