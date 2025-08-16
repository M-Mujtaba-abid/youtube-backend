import { Router } from "express";
import { registerUser ,loginUser, logoutUser, refreshTokenAccess} from "../controllers/userController.js";
import { upload } from "../middleware/multer.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();
// router.route("/register").post(registerUser);

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

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(verifyJWT,refreshTokenAccess)

export default router;
