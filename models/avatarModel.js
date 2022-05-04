const mongoose = require('mongoose');

const avatarSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: [true, "filename can't be empty"],
      unique: true,
    },
    createdAt: { type: Date, default: Date.now },
    img: {
      type: Buffer,
      required: [true, "img can't be empty"],
    },
    contentType: String,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  { toJSON: { virtuals: true }, toObjects: { virtuals: true } }
);

const Avatar = mongoose.model('Avatar', avatarSchema);

module.exports = Avatar;
