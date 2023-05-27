import Joi from "joi";

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
