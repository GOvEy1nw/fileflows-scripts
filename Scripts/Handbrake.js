/**
 * @description Custom FileFlows script to convert video files using HandBrakeCLI with configurable parameters.
 * @revision 1
 * @minimumVersion 1.0.0.0
 * @param {string} PresetName Name of the preset to use (e.g., Passthru)
 * @param {string} MaxResolution Maximum resolution for the output video (e.g., 1080, 720)
 * @param {string} Quality Quality setting for encoding (e.g., 22, 28)
 * @param {string} ExtraEncodingOptions Additional encoding options to pass to HandBrakeCLI (e.g., "preset=p1:profile=main10:rc=vbr_hq")
 * @param {string} FrameRate Set encode FPS
 * @output Conversion Successful
 * @output Conversion Failed
 */
function Script() {
    // Retrieve the HandBrakeCLI tool path
    let handbrakecli = Flow.GetToolPath('HandBrakeCLI');
    if (!handbrakecli) {
        Logger.ELog('HandBrakeCLI tool path not configured.');
        return -1;
    }

    // Generate a unique filename for the output
    let output = Flow.TempPath + '/' + Flow.NewGuid() + '.mkv';

    // Build the argument list based on the provided parameters
    let argumentList = [
        '-i',
        Variables.file.FullName,
        '-o',
        output,
        '--preset-import-file',
        '/app/common/rais.json',
        '-Z',
        PresetName,
        '-q',
        Quality,
        '--unsharp',
        'medium',
        '--unsharp-tune',
        'medium',
        '-x',
        ExtraEncodingOptions
    ];

    // Handle Max Resolution if specified
    if (MaxResolution) {
        // HandBrakeCLI uses the --height or --width option to set resolution
        // Here, we'll set the height based on MaxResolution
        argumentList.push('--height', MaxResolution);
    }

    // Handle Max Resolution if specified
    if (FrameRate) {
        // HandBrakeCLI uses the --height or --width option to set resolution
        // Here, we'll set the height based on MaxResolution
        argumentList.push('--rate', FrameRate);
    }

    // Log the command for debugging purposes
    Logger.ILog('Executing HandBrakeCLI with arguments: ' + argumentList.join(' '));

    // Execute HandBrakeCLI
    let process = Flow.Execute({
        command: handbrakecli,
        argumentList: argumentList
    });

    // Check if HandBrakeCLI executed successfully
    if (process.exitCode !== 0) {
        Logger.ELog('HandBrakeCLI failed with exit code: ' + process.exitCode);
        Logger.ELog('Error Output: ' + process.standardError);
        return -1; // Indicate failure
    }

    // Verify that the output file was created
    if (!Flow.FileExists(output)) {
        Logger.ELog('HandBrakeCLI did not produce an output file: ' + output);
        return -1; // Indicate failure
    }

    // Optionally, you can perform additional checks on the output file here
    // For example, verifying file size or integrity

    // Update the working file in the flow to the newly created file
    Flow.SetWorkingFile(output);

    Logger.ILog('HandBrakeCLI conversion completed successfully: ' + output);
    return 1; // Indicate success
}
