const express = require('express')
const app = express()
const cors = require('cors')
const fileUpload = require('express-fileupload')
const path = require('path')
const fs = require('fs')
const rateLimit = require('express-rate-limit')

const PORT = 3001
const UPLOADS_PATH = path.join(__dirname, '/uploads')
const MEGA_BYTE = 1024 * 1024

if (!fs.existsSync(UPLOADS_PATH)){
  fs.mkdirSync(UPLOADS_PATH)
}

app.use(fileUpload({
  limits: {
    fileSize: 10 * MEGA_BYTE
  },
  safeFileNames: true,
  abortOnLimit: true,
  preserveExtension: true
}))
app.use(cors())
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}))
app.use('/uploads', express.static(UPLOADS_PATH))

app.get('/', (req, res) => {
  res.send('Working...')
})

app.get('/uploads', (req, res) => {
  const searchTerm = req.query.searchTerm

  fs.readdir(UPLOADS_PATH, (err, files) => {
    const filesData = files
      .filter((file) => {
        if (!searchTerm) {
          return true
        }

        return file.toLowerCase().includes(searchTerm.toLowerCase())
      })
      .map((file) => {
        const fileStats = fs.statSync(path.join(UPLOADS_PATH, file))

        return {
          name: file,
          size: fileStats.size
        }
      })

    // FAKE slow down server so that loaders can be seen
    setTimeout(() => {
      res.send(filesData)
    }, 1000)
  });
})

const ALLOWED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg'
]
const MAX_FILE_NAME_LENGTH = 20
const getSanitizedName = (name) => {
  return name
    .replace(/\..*/, '')
    .substring(0, MAX_FILE_NAME_LENGTH)
}

app.post('/upload', function(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let file = req.files.file;
  let fileName = getSanitizedName(file.name)

  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return res.status(400).send('No files were uploaded.');
  }

  if (fileName) {
    fileName = fileName.replace(FORBIDDEN_TRAVERSAL_PATHS, '')
  }

  const uploadPath = path.join(UPLOADS_PATH, fileName)
  // Use the mv() method to place the file somewhere on your server
  file.mv(uploadPath, function(error) {
    if (error) {
      return res.status(500).send(error);
    }

    res.send('File uploaded!');
  });
});

const FORBIDDEN_TRAVERSAL_PATHS = /\.+\//gi

app.delete('/uploads/:name', function(req, res) {
  let fileName = req.params.name

  if (fileName) {
    fileName = fileName.replace(FORBIDDEN_TRAVERSAL_PATHS, '')
  }
  const filePath = path.join(UPLOADS_PATH, fileName)

  const fileStat = fs.statSync(filePath)

  if (!fileName || !fileStat) {
    return res.status(400).send('No file found');
  }

  fs.unlinkSync(filePath)

  setTimeout(() => {
    res.send('File deleted!');
  }, 2000)
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})