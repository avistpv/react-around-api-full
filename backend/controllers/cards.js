const Card = require('../models/card');
const NotFoundError = require('../utils/notfounderror');
const AuthorizationError = require('../utils/autherror');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .orFail(() => {
      throw new NotFoundError('Card list is empty.');
    })
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findOne({ _id: req.params.cardId })
    .then((card) => {
      if (!card) throw new NotFoundError('Card not found.');
      if (String(card.owner) !== req.user._id) throw new AuthorizationError('Card is not belong to current user', 403);
      return Card.findByIdAndRemove(req.params.cardId).then((deletedCard) => {
        res.send(deletedCard);
      });
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Card id not found.');
    })
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Card id not found.');
    })
    .then((card) => res.send(card))
    .catch(next);
};
