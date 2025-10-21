const Offer = require('../models/Offer');
const Application = require('../models/Application');
const { createNotification } = require('../utils/notify');

exports.create = async (req, res) => {
  const application = await Application.findById(req.params.applicationId).populate('job');
  if (!application) return res.status(404).json({ message: 'Application not found' });
  const isOwner = application.job.company.toString() === req.user._id.toString();
  if (!isOwner && !['tpo','admin'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });

  const offer = await Offer.create({ ...req.body, application: application._id });
  await createNotification(application.student, 'offer_created', 'Offer received', 'You have received an offer', { applicationId: application._id, offerId: offer._id });
  res.status(201).json(offer);
};

exports.update = async (req, res) => {
  const offer = await Offer.findById(req.params.id).populate({ path: 'application', populate: 'job' });
  if (!offer) return res.status(404).json({ message: 'Offer not found' });
  const isOwner = offer.application.job.company.toString() === req.user._id.toString();
  if (!isOwner && !['tpo','admin'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });

  Object.assign(offer, req.body);
  await offer.save();
  await createNotification(offer.application.student, 'offer_updated', 'Offer updated', 'Your offer has been updated', { offerId: offer._id, status: offer.status });
  res.json(offer);
};

exports.listForApplication = async (req, res) => {
  const offers = await Offer.find({ application: req.params.applicationId });
  res.json(offers);
};
