const { Schema, model } = require("mongoose");

const { isEmail } = require("validator");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      required: "Username is Required",
    },

    email: {
      type: String,
      unique: true,
      required: "Email is Required",
      validate: [isEmail, "Not a valid Email"],
    },

    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "thought",
      },
    ],

    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// creating virtual friendsCount

userSchema.virtual("friendsCount").get(function () {
  return this.friends.length;
});

const User = model("user", userSchema);

module.exports = User;