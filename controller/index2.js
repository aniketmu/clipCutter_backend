import util from "util";
import ffmpeg from "fluent-ffmpeg";
import dotenv from "dotenv";
import aws from "aws-sdk"
import fs from "fs"

dotenv.config()

aws.config.update({
  accessKeyId: process.env.ACCESS_KEY,
secretAccessKey: process.env.ACCESS_SECRET,
region: process.env.REGION
})

const S3 = new aws.S3()

console.log("test");

// Function to create a video clip
export async function createVideoClip(
  sourcePath,
  outputPath,
  startTime,
  clipDuration
) {
  // const outputPath = "temp/output.mp4"; // Temporary local path for the clipped video

  ffmpeg.setFfmpegPath("c:/Users/Aniket/Downloads/ffmpeg/ffmpeg-2024-02-01-git-94422871fc-full_build/bin/ffmpeg.exe");
  ffmpeg.setFfprobePath("c:/Users/Aniket/Downloads/ffmpeg/ffmpeg-2024-02-01-git-94422871fc-full_build/bin/ffprobe.exe");

  await new Promise((resolve, reject) => {
    ffmpeg(sourcePath)
      .setStartTime(startTime) // Start time for the clip
      .setDuration(clipDuration) // Duration of the clip
      .output(outputPath) // Output file path
      .on("end", resolve)
      .on("error", reject)
      .run();
  });

  // Upload the clipped video to S3
  const params = {
    Bucket: process.env.BUCKET,
    Key: sourcePath,
    Body: fs.createReadStream(outputPath),
    ContentType: "video/mp4" // Adjust content type accordingly
  };

  try {
    await S3.upload(params).promise();
    console.log("Upload to S3 successful");
  } catch (err) {
    console.error("Error uploading to S3:", err);
    throw err; // Rethrow the error to be handled by the caller
  } finally {
    // Cleanup - delete temporary file
    fs.unlinkSync(outputPath);
  }
}

export async function getVideoDuration(videoPath) {
  ffmpeg.setFfmpegPath("c:/Users/Aniket/Downloads/ffmpeg/ffmpeg-2024-02-01-git-94422871fc-full_build/bin/ffmpeg.exe");
  ffmpeg.setFfprobePath("c:/Users/Aniket/Downloads/ffmpeg/ffmpeg-2024-02-01-git-94422871fc-full_build/bin/ffprobe.exe");
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
