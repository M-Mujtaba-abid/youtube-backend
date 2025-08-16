// import multer from "multer"

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/tmp')
//   },
//   filename: function (req, file, cb) {
//      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//  cb(null, file.originalname + '-' + uniqueSuffix);
//     // cb(null, file.originalname + '-' + uniqueSuffix)
//   }
// })

// export const upload = multer({ storage, })



import multer from "multer";
import fs from "fs";
import path from "path";

const TMP_DIR = path.join(process.cwd(), "public", "tmp");

// make sure tmp dir exists at startup
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TMP_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname + "-" + uniqueSuffix);
  },
});

export const upload = multer({ storage });
