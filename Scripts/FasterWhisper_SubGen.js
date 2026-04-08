/**
 * @description Custom FileFlows script to process audio with Whisper.
 * @author Rais
 * @revision 4
 * @minimumVersion 1.0.0.0
 * @param {string} WhisperModel Whisper model to use (eg. tiny, base, small, medium, large)
 * @param {string} WhisperLanguage Language code for Whisper (eg. en, pt, jp)
 * @param {bool} VocalExtraction Enable vocal extraction
 * @param {bool} Realign Enable realignment
 * @output Done
 */
function Script() {
  let fwxxl = Flow.GetToolPath("fwxxl");
  let baseName = Variables.file.NameNoExtension;

  // Process audio with Whisper-Faster
  let output = Flow.TempPath + "/" + baseName + ".srt";
  let ffoutput = Flow.TempPath;

  let args = [
    Variables.file.FullName,
    "-l",
    WhisperLanguage,
    "-m",
    WhisperModel,
    "--temperature",
    "0.0",
    "--standard",
    "--word_timestamps",
    "true",
    "--beep_off",
  ];

  if (Realign) {
    args.push("--realign");
  }

  if (VocalExtraction) {
    args.push("--ff_vocal_extract");
    args.push("mb-roformer");
  }

  args.push("-o");
  args.push(ffoutput);

  let whisperProcess = Flow.Execute({
    command: fwxxl,
    argumentList: args,
  });

  if (!whisperProcess.output?.includes("Operation finished in")) {
    Logger.ELog(
      "Failed processing Whisper-Faster: Success message not found in output.",
    );
    return -1;
  }

  if (!Flow.FileExists(output)) {
    Logger.ELog(
      "Output file does not exist from Whisper Standalone: " + output,
    );
    return -1;
  }

  // Set the working file to the output file that needs to be moved
  Flow.SetWorkingFile(output);

  return 1;
}
