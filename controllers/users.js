const bcrypt = require("bcryptjs");

const db = require("../models");
const { User } = db;
const { createToken } = require("../utils/auth");
const salt = bcrypt.genSaltSync(10);

const MINUTE = 60;
const HOUR = 60;
const THREE_DAYS = 72;
const FIVETEEN_MINUTES = 15;

const loh = async (req, res, next) => {
  try {
    res.render("loh.hbs");
  } catch (e) {
    console.log("LOH_ERROR:", e);
  }
};

const registerUser = async (res, email, password) => {
  try {
    const user = await User.create({
      email,
      password: bcrypt.hashSync(password, salt),
    });

    const refresh_token = createToken(user, MINUTE * HOUR * THREE_DAYS);
    const token = createToken(user, MINUTE * FIVETEEN_MINUTES);

    user.refresh_token = refresh_token;
    await user.save();

    res.status(201).json({
      token,
      refresh_token,
      email,
    });
  } catch (e) {
    console.log("REGISTER_USER_ERROR:", e);
  }
};

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        message: `User ${email} is undefind`,
      });
    }

    const passwordResult = bcrypt.compareSync(password, user.password);
    if (passwordResult) {
      const token = createToken(user, MINUTE * FIVETEEN_MINUTES);
      const refresh_token = createToken(user, MINUTE * HOUR * THREE_DAYS);

      user.refresh_token = refresh_token;
      await user.save();

      return res.status(200).json({
        email,
        token,
        refresh_token,
      });
    }

    return res.status(401).json({
      message: "Password is wrong",
    });
  } catch (e) {
    next(e);
  }
}

async function registration(req, res, next) {
  const { email, password } = req.body;
  try {
    const candidate = await User.findOne({
      where: { email },
      raw: true,
    });

    if (candidate) {
      return res.status(409).json({
        message: "This login is used",
      });
    }

    if (password.length < 8) {
      return res.status(409).json({
        message: "Password should be more than 8 symbols",
      });
    }

    await registerUser(res, email, password);
  } catch (e) {
    res.status(404).json({
      message: `REGISTRATION_ERROR: ${e}`,
    });
  }
}

module.exports = {
  login,
  registration,
  loh,
};
