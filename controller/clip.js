import util from "util";
import ffmpeg from "fluent-ffmpeg";

// Function to create a video clip
export async function createVideoClip(
  sourcePath,
  outputPath,
  startTime,
  clipDuration
) {
  ffmpeg.setFfmpegPath("D:/HP/Downloads/ffmpeg/ffmpeg.exe");
  ffmpeg.setFfprobePath("D:/HP/Downloads/ffmpeg/ffprobe.exe");
  ffmpeg.setFfprobePath("D:/HP/Downloads/ffmpeg/ffplay.exe");
  ffmpeg(sourcePath)
    .setStartTime(startTime) // Start time for the clip
    .setDuration(clipDuration) // Duration of the clip
    .output(outputPath) // Output file path
    .on("end", function (err) {
      if (!err) {
        console.log("Conversion Done");
      }
    })
    .on("error", function (err) {
      console.log("error: ", err);
    })
    .run();
}

export async function getVideoDuration(videoPath) {
  const ffprobeAsync = util.promisify(ffmpeg.ffprobe);
  try {
    const metadata = await ffprobeAsync(videoPath);
    const durationInSeconds = metadata.format.duration;
    return durationInSeconds;
  } catch (err) {
    throw err; // Rethrow the error to be handled by the caller
  }
}
// const uploadPath = path.join(__dirname, '../video', 'clip.js - truAD_backend - Visual Studio Code 2024-02-02 12-44-58.mp4');
// console.log(uploadPath);

// getVideoDuration(uploadPath)
// .then(duration => {
//   console.log(`Video duration: ${duration} seconds`);
// })
// .catch(error => {
//   console.error(`Error: ${error.message}`);
// });
