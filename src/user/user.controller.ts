import { Request, Response } from "express";
import LoginUserInput from "./dto/loginUser.input";
import { loginUser, registerUser } from "./user.service";
import RegisterUserInput from "./dto/registerUser.input";

export const register = async (req: Request, res: Response) => {
  try {
    const registerUserInput = new RegisterUserInput(
      req.body.name,
      req.body.email,
      req.body.password,
    );
    const { error } = registerUserInput.validate();
    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((detail) => detail.message) });
    }

    const accessToken = await registerUser(registerUserInput);

    return res.status(200).send({ accessToken });
  } catch (error) {
    return res.status(400).send({ error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const loginUserInput = new LoginUserInput(
      req.body.email,
      req.body.password,
    );

    const { error } = loginUserInput.validate();
    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((detail) => detail.message) });
    }

    const accessToken = await loginUser(loginUserInput);

    return res.status(200).send({ accessToken });
  } catch (error) {
    return res.status(400).send({ error });
  }
};
