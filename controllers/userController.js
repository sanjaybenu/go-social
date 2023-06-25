const { User, Thought } = require("../models");

const userController = {
  // get all users

  async getAllUser(req, res) {
    try {
      const users = await User.find().populate({
        path: "friends",
        select: "-__v",
      });
      if (!users) {
        res.json({ error: "There was an error in fetching users" });
        return;
      }
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // get one user by id

  async getUserById(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.id })
        .populate({
          path: "thoughts",
          select: "-__v",
        })
        .populate({
          path: "friends",
          select: "-__v",
        })
        .select("-__v");
      if (!user) {
        res.status(400).json({ Message: "No user with this id found" });
        return;
      }

      res.json(user);
    } catch (err) {
      res.status(500).send("Something went wrong");
    }
  },

  // create a new user

  async createUser(req, res) {
    try {
      const newUser = await User.create(req.body);
      res.json(newUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // update a user by id

  async updateUser(req, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // delete a user

  async deleteUser(req, res) {
    try {
      const deletedUser = await User.findOneAndDelete({ _id: req.params.id });

      if (!deletedUser) {
        return res.status(404).json({ message: "No user with this id found" });
      }
      {
        const user = await User.find();

        Thought.deleteMany({ _id: { $in: user.thoughts } });

        return res.json({ message: "User and associated thoughts deleted!" });
      }
    } catch (err) {
      res.json(err);
    }
  },

  // add a friend

  async addFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true, runValidators: true }
      );
      if (!user) {
        res.status(404).json({ message: "No user with this id found " });
        return;
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //delete  a friend

  async deleteFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );
      if (!user) {
        res.status(404).json({ message: "No user with this id found " });
        return;
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = userController;