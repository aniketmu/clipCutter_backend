import Login from './controller/login.js';
import Register from './controller/register.js';
import mongodb from './database/mongo.js';
import VideoClip from './controller/videoclip.js';
import fileUpload from 'express-fileupload';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path, { dirname } from 'path';
import fs from 'fs';
import { fileURLToPath } from "url";
import Video from "./database/mongo_schema_video.js"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname)


const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: '/video/'
    })
)
mongodb();

app.post('/api/register', Register);

app.post('/api/login', Login);

app.post('/api/videoclip', VideoClip);

app.get('/video',(req,res)=>{
    const videoPath = path.join(__dirname, 'video', 'net.mp4');
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;

        const chunksize = (end-start)+1;
        const file = fs.createReadStream(videoPath, {start, end});
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(videoPath).pipe(res);
    }
})

app.get("/get-video", async(req, res) => {
    const data = await Video.find()
    res.status(200).json({data})
})

export default app;

