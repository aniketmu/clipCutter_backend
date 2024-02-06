import util from "util";
import ffmpeg from "fluent-ffmpeg";

console.log("test");

// Function to create a video clip
export async function createVideoClip(
  sourcePath,
  outputPath,
  startTime,
  clipDuration
) {
  ffmpeg.setFfmpegPath("C:/Users/qayyu/Downloads/ffmpeg-6.1.1-full_build/ffmpeg-6.1.1-full_build/bin/ffmpeg.exe");
  ffmpeg.setFfprobePath("C:/Users/qayyu/Downloads/ffmpeg-6.1.1-full_build/ffmpeg-6.1.1-full_build/bin/ffprobe.exe");
  ffmpeg.setFfprobePath("C:/Users/qayyu/Downloads/ffmpeg-6.1.1-full_build/ffmpeg-6.1.1-full_build/bin/ffplay.exe");
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
  ffmpeg.setFfmpegPath("C:/Users/qayyu/Downloads/ffmpeg-6.1.1-full_build/ffmpeg-6.1.1-full_build/bin/ffmpeg.exe");
  ffmpeg.setFfprobePath("C:/Users/qayyu/Downloads/ffmpeg-6.1.1-full_build/ffmpeg-6.1.1-full_build/bin/ffprobe.exe");
  const ffprobeAsync = util.promisify(ffmpeg.ffprobe);
  try {
    const metadata = await ffprobeAsync(videoPath);
    const durationInSeconds = metadata.format.duration;
    return durationInSeconds;
  } catch (err) {
    throw err; // Rethrow the error to be handled by the caller
  }
}




// getVideoDuration("C:/Users/qayyu/OneDrive/Desktop/TruAD/clipvideo/video/sample.mp4")
// .then(duration => {
//   console.log(`Video duration: ${duration} seconds`);
// })
// .catch(error => {
//   console.error(`Error: ${error.message}`);
// });

// const ans=getVideoDuration("C:/Users/qayyu/OneDrive/Desktop/TruAD/clipvideo/video/sample.mp4");
// console.log(ans);

// createVideoClip(
//   "C:/Users/qayyu/OneDrive/Desktop/TruAD/clipvideo/video/sample.mp4",
//   "C:/Users/qayyu/OneDrive/Desktop/TruAD/clipvideo/output/sample.mp4",
//   "00:00:00",
//   30
// )
