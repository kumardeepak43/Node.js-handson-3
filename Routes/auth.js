const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const { users } = require("../db");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

// Signup

router.post(
  "/signup",
  [
    check("email", "Please Enter Valid Email").isEmail(),
    check(
      "password",
      "Please provide a password that is greater than 6"
    ).isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const { email, password } = req.body;

    //validate the input
    console.log(email, password);

    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json({
        error: error.array(),
      });
    }

    //validate if user doesn't already exist in db

    let user = users.find((user) => {
      return user.email === email;
    });

    if (user) {
      return res.status(400).json({
        error: [
          {
            msg: "This user already exist",
          },
        ],
      });
    }

    //Hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);


    //saving the password in db
    users.push({
      email,
      password: hashedPassword,
    });


    //generating JWT
    const token = await JWT.sign(
      {
        email,
      },
      "hkhfhiehihfieerfef",
      {
        expiresIn: 3600000,
      }
    );

    res.json({
      token,
    });
  }
);


//Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;


  //checking if user already exist or not
  let user = users.find((user) => {
    return user.email === email;
  });

  if (!user) {
    return res.status(422).json({
      errors: [
        {
          msg: "Invalid Credentials",
        },
      ],
    });
  }

  //checking password in the db matching with the user provided
  let isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(404).json({
      errors: [
        {
          msg: "Invalid Credentials",
        },
      ],
    });
  }

  //sending JWT to user
  const token = await JWT.sign(
    {
      email,
    },
    "hkhfhiehihfieerfef",
    {
      expiresIn: 3600000,
    }
  );

  res.json({
    token,
  });
});


//all users
router.get("/all", (req, res) => {
  res.json(users);
});

module.exports = router;