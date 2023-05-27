import Joi from "joi";

/**
 * @swagger
 * components:
 *   schemas:
 *     CommentInput:
 *       type: object
 *       properties:
 *         comment:
 *           type: string
 *           default: This is a comment
 *         parent_id:
 *           type: string
 *           format: email
 *           default: 647172d3ccee3046f8f12975
 *       required:
 *         - content
 */
class CreateCommentInput {
  content: string;
  parent_id: string;

  constructor(content: string, parent_id: string) {
    this.content = content;
    this.parent_id = parent_id;
  }

  validate(): Joi.ValidationResult {
    const schema = Joi.object({
      content: Joi.string().required().messages({
        required: "Content is required.",
      }),
      parent_id: Joi.string(),
    });

    return schema.validate(this, { abortEarly: false });
  }
}

export default CreateCommentInput;
