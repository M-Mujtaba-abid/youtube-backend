import { Router } from "express";
import { registerUser } from "../controllers/userController.js";
import { upload } from "../middleware/multer.js";

const router = Router();

router.route("/register").post(
    //upload aik midleware he jo ke multer.js file se arha he 
    // immage or file leny ka liye---
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

export default router;
