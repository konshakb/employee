const express = require("express");
const router = express.Router();
const bodyParser = require(`body-parser`);
const bcrypt = require(`bcryptjs`);
//body parser added
router.use(bodyParser.json());
// {get model
function getModel() {
  return require(`./model-${require("../../config").get("DATA_BACKEND")}`);
}

//@route     GET api/users/test
//@ desc    Test users route
//@access   Public
router.get(`/test`, (req, res) => res.json({ msg: "Users works" }));

/**
 * GET /api/books
 *
 * Retrieve a page of books (up to ten at a time).
 */
router.get("/", (req, res, next) => {
  getModel().list(100, req.query.pageToken, (err, entities, cursor) => {
    if (err) {
      next(err);
      return;
    }
    res.json({
      items: entities,
      nextPageToken: cursor
    });
  });
});

/**
 * POST /api/books
 *
 * Create a new book.
 */
router.post("/", (req, res, next) => {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }

  today = mm + "/" + dd + "/" + yyyy;
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    region: req.body.region,
    created_on: today,
    signature: req.body.signature,
    created_by: req.body.created_by
  };

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      getModel().create(newUser, (err, entity) => {
        if (err) {
          next(err);
          return;
        }
        res.json(entity);
      });
    });
  });
});
router.post("/admin", (req, res, next) => {
  const newUsers = {
    email: req.body.email,
    password: req.body.password,
    admin: true
  };

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUsers.password, salt, (err, hash) => {
      if (err) throw err;
      newUsers.password = hash;
      getModel().create(newUsers, (err, entity2) => {
        if (err) {
          next(err);
          return;
        }
        console.log(entity2);
        res.json(entity2);
      });
    });
  });
});
module.exports = router;
