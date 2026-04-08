/**
 * @description Custom FileFlows script to process subtitles with Subtitle Edit.
 * @author rais
 * @revision 1
 * @minimumVersion 1.0.0.0
 * @param {string} subProfile Profile to use for SubtitleEdit
 * @output Subtitle Edit processing completed successfully.
 */
function Script() {
  let SubtitleEdit = Flow.GetToolPath("SubtitleEdit");
  let subtitleFile = Variables.file.FullName;
  let subtitleFolderPath = Variables.folder.FullName;

  Logger.ILog("Processing subtitle file with Subtitle Edit: " + subtitleFile);

  let subtitleProcess = Flow.Execute({
    command: SubtitleEdit,
    argumentList: [
      "/convert",
      subtitleFile,
      "subrip",
      "/profile:" + subProfile,
      "/FixCommonErrors",
      "/MergeShortLines",
      "/BalanceLines",
      "/overwrite",
      "/outputfolder:" + subtitleFolderPath,
    ],
  });

  if (subtitleProcess.standardOutput)
    Logger.ILog("Standard output: " + subtitleProcess.standardOutput);
  if (subtitleProcess.starndardError)
    Logger.ILog("Standard error: " + subtitleProcess.starndardError);

  if (subtitleProcess.exitCode !== 0) {
    Logger.ELog("Failed processing: " + subtitleProcess.exitCode);
    return -1;
  }

  Logger.ILog("Subtitle Edit processing completed successfully.");

  // The output file is written to the original media folder, so we can just exit.
  return 1;
}
