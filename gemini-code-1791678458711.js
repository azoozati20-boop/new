const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/download', (req, res) => {
    const videoUrl = req.body.url;
    if (!videoUrl) {
        return res.status(400).json({ error: 'الرابط مطلوب' });
    }

    // أمر yt-dlp لجلب رابط الفيديو المباشر بالجودة المناسبة
    const command = `npx yt-dlp-exec "${videoUrl}" -g -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).json({ error: 'فشل استخراج الفيديو' });
        }
        
        const directUrls = stdout.trim().split('\n');
        // إرجاع الرابط المباشر
        res.json({ downloadUrl: directUrls[0] });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));