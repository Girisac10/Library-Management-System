import express from "express";
import { Book } from "../models/Book.js";
import { verifyAdmin } from "./auth.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: "./uploads", // Folder where files will be saved
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("image"); // 'image' is the name attribute of the input field

// Check file type function
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    //Here I validate the file type
    return cb(new Error("This file type is invalid!!!"));
  }
}

router.post("/add", verifyAdmin, async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      //Here I check the multer error
      if (err instanceof multer.MulterError){
        if (err.code === "LIMIT_FILE_SIZE"){
          return res.status(404).json({  message: "Your file size is more than 1 MB" });
        }
        return res.status(400).json({ message: err.message });
      } else if (err) {
        // Handle other errors
        return res.status(400).json({ message: err.message });
      }
    } else {
      const { name, author } = req.body;
      const imageUrl = req.file ? `uploads/${req.file.filename}` : null;

      try {
        const newbook = new Book({
          name,
          author,
          imageUrl,
        });
        await newbook.save();
        return res.json({ added: true });
      } catch (err) {
        return res.json({ message: "Error in adding book" });
      }
    }
  });
});

router.get('/books', async (req, res) => {
    try {
        const books = await Book.find()
        return res.json(books)
    }catch(err) {
        return res.json(err)
    }
})

router.get('/book/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const book = await Book.findById({_id: id})
        return res.json(book)
    }catch(err) {
        return res.json(err)
    }
})
router.put('/book/:id', verifyAdmin, async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      //Here I check the multer error
      if (err instanceof multer.MulterError){
        // Handle Multer errors (e.g., file too large)
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ message: "Your file size is more than 1 MB" });
        }
        return res.status(404).json({ message: err });
    } else if (err){
      // Handle other errors
      return res.status(400).json({ message: err.message });
    }
    } else {
      const { name, author } = req.body;
      const updateData = { name, author };
      if (req.file) {
        updateData.imageUrl = `uploads/${req.file.filename}`;
      }

      try {
        const id = req.params.id;
        const book = await Book.findByIdAndUpdate({ _id: id }, updateData, { new: true });
        return res.json({ updated: true, book });
      } catch (err) {
        return res.json({ message: 'Error in updating book' });
      }
    }
  });
});


router.delete('/book/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const book = await Book.findByIdAndDelete({_id: id})
        return res.json({deleted: true, book})
    }catch(err) {
        return res.json(err)
    }
})

export {router as bookRouter}
