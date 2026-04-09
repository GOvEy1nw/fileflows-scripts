/**
 * @description Custom FileFlows script to encode video files using NVEncC with configurable parameters.
 * @author Rais
 * @revision 1
 * @minimumVersion 1.0.0.0
 * @param {('av1'|'hevc'|'h264')} Codec Codec to use for encoding
 * @param {('p1'|'p2'|'p3'|'p4'|'p5'|'p6'|'p7')} Preset Encoding preset (p1 fastest, p7 slowest/best)
 * @param {int} Quality QVBR quality value — lower is higher quality (eg. 20, 30, 40)
 * @param {('8'|'10')} OutputDepth Output bit depth
 * @param {int} Lookahead Number of lookahead frames (eg. 16, 32)
 * @param {int} BFrames Number of B-frames (eg. 3, 5, 7)
 * @param {int} AqStrength Adaptive quantization strength (eg. 0 to 15)
 * @param {bool} EnableUnsharp Enable the unsharp filter (radius=3, weight=0.5, threshold=16)
 * @param {bool} EnablePmd Enable the PMD denoise filter (apply_count=3, strength=100, threshold=120)
 * @output Encoding Successful
 * @output Encoding Failed
 */
function Script(
  Codec,
  Preset,
  Quality,
  OutputDepth,
  Lookahead,
  BFrames,
  AqStrength,
  EnableUnsharp,
  EnablePmd,
) {
  let nvencc = Flow.GetToolPath("NVEncC");
  if (!nvencc) {
    Logger.ELog("NVEncC tool path not configured.");
    return -1;
  }

  let input_file = Variables.file.FullName;
  let output_file = Flow.TempPath + "/" + Flow.NewGuid() + ".mkv";

  let argument_list = [
    "-i",
    input_file,
    "--avhw",
    "--codec",
    Codec,
    "--preset",
    Preset,
    "--tune",
    "uhq",
    "--output-depth",
    String(OutputDepth),
    "--qvbr",
    String(Quality),
    "--multipass",
    "2pass-full",
    "--aq",
    "--aq-temporal",
    "--aq-strength",
    String(AqStrength),
    "--lookahead",
    String(Lookahead),
    "--bframes",
    String(BFrames),
    "--lookahead-level",
    "3",
    "--tf-level",
    "4",
    "--mv-precision",
    "Q-pel",
  ];

  if (EnableUnsharp) {
    argument_list.push("--vpp-unsharp", "radius=3,weight=0.5,threshold=16");
  }

  if (EnablePmd) {
    argument_list.push("--vpp-pmd", "apply_count=3,strength=100,threshold=120");
  }

  let passthrough_args = [
    "--colormatrix",
    "auto",
    "--transfer",
    "auto",
    "--colorprim",
    "auto",
    "--chromaloc",
    "auto",
    "--max-cll",
    "copy",
    "--master-display",
    "copy",
    "--dhdr10-info",
    "copy",
    "--dolby-vision-rpu",
    "copy",
    "--video-metadata",
    "copy",
    "--audio-copy",
    "--audio-metadata",
    "copy",
    "--sub-copy",
    "--sub-metadata",
    "copy",
    "--data-copy",
    "--attachment-copy",
    "--chapter-copy",
    "-o",
    output_file,
  ];

  argument_list = argument_list.concat(passthrough_args);

  Logger.ILog(
    "Executing NVEncC with codec: " +
      Codec +
      ", preset: " +
      Preset +
      ", QVBR: " +
      Quality +
      ", depth: " +
      OutputDepth +
      "bit",
  );
  Logger.ILog("Input:  " + input_file);
  Logger.ILog("Output: " + output_file);

  let process = Flow.Execute({
    command: nvencc,
    argumentList: argument_list,
  });

  if (process.standardOutput) {
    Logger.ILog("Standard output: " + process.standardOutput);
  }
  if (process.starndardError) {
    Logger.ILog("Standard error: " + process.starndardError);
  }

  if (process.exitCode !== 0) {
    Logger.ELog("NVEncC failed with exit code: " + process.exitCode);
    return 2;
  }

  if (!Flow.FileExists(output_file)) {
    Logger.ELog("NVEncC did not produce an output file: " + output_file);
    return 2;
  }

  Flow.SetWorkingFile(output_file);
  Logger.ILog("NVEncC encoding completed successfully: " + output_file);
  return 1;
}
