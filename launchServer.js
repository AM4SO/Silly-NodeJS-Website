const http = require('http');
const fs = require('fs');

const mimeTypes = {
  // Text files
  ".txt": "text/plain",
  ".html": "text/html",
  ".htm": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".xml": "application/xml",
  ".csv": "text/csv",

  // Image files
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".bmp": "image/bmp",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/vnd.microsoft.icon",

  // Audio files
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  ".m4a": "audio/mp4",

  // Video files
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".avi": "video/x-msvideo",
  ".mov": "video/quicktime",
  ".mkv": "video/x-matroska",

  // Font files
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",

  // Archives
  ".zip": "application/zip",
  ".tar": "application/x-tar",
  ".gz": "application/gzip",
  ".rar": "application/vnd.rar",
  ".7z": "application/x-7z-compressed",

  // PDFs and Documents
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

  // Binary files
  ".exe": "application/octet-stream",
  ".bin": "application/octet-stream",
  ".data": "application/octet-stream",

  // Miscellaneous
  ".wasm": "application/wasm",
  ".rtf": "application/rtf",
  ".md": "text/markdown"
};


http.createServer(function(req, res){
	var url = req.url;
	if (url == "/") url = "index.html"
	var file = ".\\" + url;
	fs.readFile(file, function(err, data){
		//console.log(data)
        ext = url.slice(url.lastIndexOf('.')).toLowerCase();
        contType = mimeTypes[ext];
		if (err) {throw err;}
        res.writeHead(200, { 'Content-Type': contType });
		res.write(data);
		res.end();
	})
}).listen(8080);
