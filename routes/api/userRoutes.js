const router = require("express").Router();
const {
  getAllUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  //removeFriend,
  deleteFriend,
} = require("../../controllers/userController");

// /api/users

router.route("/").get(getAllUser).post(createUser);

// /api/users/:id

router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

// /api/users/:userId/friends/:friendId

router.route("/:userId/friends/:friendId").post(addFriend).delete(deleteFriend);

module.exports = router;