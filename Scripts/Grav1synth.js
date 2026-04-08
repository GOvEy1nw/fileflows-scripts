/**
 * @description Add photon-noise-based film grain to AV1 video via grav1synth
 * @author Rais
 * @minimumVersion 1.0.0.0
 * @param {bool} Disable Disable the script (else enable)
 * @param {bool} UsePresetFilmStock Use preset film stock (else use ISO)
 * @param {bool} Chroma Use chroma noise (else only luma)
 * @param {('16'|'Classic35'|'Modern35'|'Rais'|'MaxMid')} PresetFilmStock Preset film stock to pick from
 * @param {('100'|'200'|'400'|'800'|'1600'|'3200'|'6400'|'12800'|'25600'|'51200'|'102400')} ISO ISO value of the film grain (eg. 100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600, 51200, 102400)
 * @output Done
 */
function Script(Disable, UsePresetFilmStock, Chroma, PresetFilmStock, ISO) {
  if (Disable) {
    Logger.ILog("Script disabled, no action taken");
    return 1;
  }

  const grav1synth = Flow.GetToolPath("grav1synth");
  const baseName = Variables.file.NameNoExtension;
  const output = Flow.TempPath + "/" + baseName + "_grain.mkv";
  const inputFile = Variables.file.FullName;

  if (!grav1synth) {
    return Flow.Fail("grav1synth tool path was not found");
  }

  let args = [];

  if (UsePresetFilmStock) {
    if (!PresetFilmStock) {
      return Flow.Fail(
        "Preset film stock is required when UsePresetFilmStock is enabled",
      );
    }

    const grainTypePrefix = Chroma ? "C_" : "M_";
    const toolDirectory = grav1synth.replace(/[\\\/]grav1synth\.exe$/i, "");
    const pathSeparator = grav1synth.indexOf("\\") !== -1 ? "\\" : "/";

    if (toolDirectory === grav1synth) {
      return Flow.Fail(
        "Unable to derive grav1synth tool directory from tool path: " +
          grav1synth,
      );
    }

    const grainFile =
      toolDirectory +
      pathSeparator +
      "grain-files" +
      pathSeparator +
      grainTypePrefix +
      PresetFilmStock +
      ".txt";

    args = ["apply", inputFile, "-o", output, "-g", grainFile];
  } else {
    if (ISO === null || ISO === undefined || ISO === "") {
      return Flow.Fail("ISO is required when UsePresetFilmStock is disabled");
    }

    args = ["generate", inputFile, "-o", output, "--iso", String(ISO)];

    if (Chroma) {
      args.push("--chroma");
    }
  }

  Logger.ILog("grav1synth: " + grav1synth);
  Logger.ILog("args: " + JSON.stringify(args));

  try {
    Flow.Execute({
      command: grav1synth,
      argumentList: args,
    });
  } catch (error) {
    return Flow.Fail("Failed executing grav1synth: " + error);
  }

  Flow.SetWorkingFile(output);
  return 1;
}
