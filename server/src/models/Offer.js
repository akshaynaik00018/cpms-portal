const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema(
  {
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    package: Number,
    joiningDate: Date,
    letterUrl: String,
    status: { type: String, enum: ['offered', 'accepted', 'declined'], default: 'offered' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Offer', OfferSchema);
