import Joi from "joi";

/**
 * @swagger
 * components:
 *   schemas:
 *     PostInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           default: This is a post
 *         content:
 *           type: string
 *           format: email
 *           default: Test content
 *       required:
 *         - title
 *         - content
 */
class CreatePostInput {
  title: string;
  content: string;

  constructor(title: string, content: string) {
    this.title = title;
    this.content = content;
  }

  validate(): Joi.ValidationResult {
    const schema = Joi.object({
      title: Joi.string().required().messages({
        required: "Title is required.",
      }),
      content: Joi.string().required().messages({
        required: "Content is required.",
      }),
    });

    return schema.validate(this, { abortEarly: false });
  }
}

export default CreatePostInput;
