import Joi from "joi";

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterUserInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           default: John Doe
 *         email:
 *           type: string
 *           format: email
 *           default: johndoe@example.com
 *         password:
 *           type: string
 *           format: password
 *           default: hello1234
 *       required:
 *         - name
 *         - email
 *         - password
 */
class RegisterUserInput {
  name: string;
  email: string;
  password: string;

  constructor(name: string, email: string, password: string) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  validate(): Joi.ValidationResult {
    const schema = Joi.object({
      name: Joi.string().required().messages({
        required: "Name is required.",
      }),
      email: Joi.string().email().required().messages({
        email: "Invalid email format.",
        required: "Email is required.",
      }),
      password: Joi.string().required().min(6).messages({
        min: "Password must be at least 6 characters long.",
        required: "Password is required.",
      }),
    });

    return schema.validate(this, { abortEarly: false });
  }
}

export default RegisterUserInput;
