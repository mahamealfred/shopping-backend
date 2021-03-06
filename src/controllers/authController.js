import Models from "../database/models";
import bcrypt from "bcryptjs";
import { encode} from "../helpers/jwtTokenizer";



class authController {
  static async signup(req, res) {
    try {
      if (req.user) {
        return res.status(400).json({
          status: 400,
          message: "User with email already exists",
        });
      }
      const { users } = Models;
      const { fullName, email, password } = req.body;
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt);
      await users.create({
        fullName,
        email,
        password: hashPassword,
      });
      return res.status(201).json({
        status: 201,
        message: "User have been created",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }
  static async singin(req, res) {
    const { email, password } = req.body;
    if (!req.user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }
    const databaseEmail = req.user.email;
    const hashPassword = req.user.password;
    const decrePassword = await bcrypt.compare(password, hashPassword);

    console.log(decrePassword);
    if (databaseEmail == email) {
      if (decrePassword) {
		  const token= await encode({email})
        return res.status(200).json({
          status: 200,
          message: "Message",
          data: {
			user: req.user,
			token
          },
        });
      }
    }
    return res.status(401).json({
      status: 401,
      message: "Something went wrong! Try again later",
    });
  }
}

export default authController;
