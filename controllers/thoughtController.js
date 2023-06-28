const { Thought, User } = require("../models");

const thoughtController = {
  // get all thoughts

  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find().populate({
        path: "reactions",
        select: "-__v",
      });
      if (!thoughts) {
        res.json({ error: "There was an error in fetching thoughts" });
        return;
      }
      res.json(thoughts);
    } catch (err) {

      res.status(500).json(err);

    }
  },

  // get one thought by id

  async getThoughtById(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.id }).populate({
        path: "reactions",
        select: "-__v",
      });
      if (!thought) {
        return res
          .status(404)
          .json({ message: "No thought with this id found" });
      }
      res.json(thought);
    } catch (err) {

      res.status(500).json(err);

    }
  },

  // Add a thought

  async addThought(req, res) {
    try {
      const { _id } = await Thought.create(req.body);
      const dbUserData = await User.findOneAndUpdate(
        { username: req.body.username },
        { $push: { thoughts: _id } },
        { new: true }
      );

      if (!dbUserData) {
        return res
          .status(404)
          .json({ message: "Thought created but no user with this id found" });
      }

      res.json({ message: "Thought successfully created!" });
    } catch (err) {

      res.status(500).json(err);
    }
  },

  // update a thought by id

  async updateThought(req, res) {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!updatedThought) {
        return res
          .status(404)
          .json({ message: "No thought with this id found" });
      }
      res.json(updatedThought);
    } catch (err) {

      res.status(500).json(err);

    }
  },

  // delete a thought

  async deleteThought(req, res) {
    try {
      const deletedThought = await Thought.findOneAndDelete({
        _id: req.params.id,
      });

      if (!deletedThought) {
        return res
          .status(404)
          .json({ message: "No Thought with this id found" });
      }
      
        {const user = await User.findOneAndUpdate(
          { thoughts: req.params.id },
          { $pull: { thoughts: req.params.id } },
          { new: true }
        );
        if (!user) {
          return res.json({
            message: "Thought removed but no User with that id found",
          });
        }
        {

        return res.json({ message: "Thought deleted successfully" });
        
        }
      }
   }
    catch(err) {

      res.status(500).json(err);

    }
 },

  // add reaction

  async addReaction(req, res) {
    try {
      const newReaction = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { new: true, runValidators: true }
      );
      if (!newReaction) {
        return res.json({ message: "No Thought with that id found" });
      }

      res.json(newReaction);
    } catch (err) {

      res.status(500).json(err);
    }
  },

  // delete a reaction

  async deleteReaction(req, res) {
    try {
      const deletedReaction = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { new: true }
      );
      if (!deletedReaction) {
        return res.json({ message: "No thought found" });
      }
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = thoughtController;
