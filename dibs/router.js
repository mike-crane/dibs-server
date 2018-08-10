'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const { Property, Reservation } = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();
const jwtAuth = passport.authenticate('jwt', { session: false });

router.use(jsonParser)

// Get all properties
router.get('/properties', jwtAuth, (req, res) => {
  return Property.find()
    .then(properties => res.status(200).json(properties.map(property => property.serialize())))
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

// Get all reservations
router.get('/reservations', jwtAuth, (req, res) => {
  return Reservation.find()
    .then(reservations => res.status(200).json(reservations.map(reservation => reservation.serialize())))
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

// Post new property
router.post("/properties", jwtAuth, (req, res) => {
  console.log(req.body);
  const requiredFields = ["name", "street", "city", "state", "zipcode", "type", "thumbUrl"];
  // const requiredFields = ["name", "type", "owner"];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Missing field",
      location: missingField
    });
  }

  return Property.create(req.body)
    .then(property => {
      return res.status(201).json(property.serialize());
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === "ValidationError") {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ code: 500, message: "Internal server error" });
    });
});

// Post new reservation
router.post("/reservations", jwtAuth, (req, res) => {
  const requiredFields = ["username", "propertyName", "start", "end"];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Missing field",
      location: missingField
    });
  }

  return Reservation.create(req.body)
    .then(reservation => {
      return res.status(201).json(reservation.serialize());
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === "ValidationError") {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ code: 500, message: "Internal server error" });
    });
});


// Update property with a given id
router.put('/properties/:id', jwtAuth, jsonParser, (req, res) => {
  const requiredFields = ["name", "street", "city", "state", "zipcode", "type", "id"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  Property.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
    .then(property => res.status(204).json(property));
});

// Update reservation with a given id
router.put("/reservations/:id", jwtAuth, jsonParser, (req, res) => {
  const requiredFields = ["username", "start", "end", "id"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id}) and request body id (${
      req.body.id
    }) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  Reservation.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  ).then(reservation => res.status(204).json(reservation));
});

// Delete a property with a given id
router.delete('/properties/:id', jwtAuth, (req, res) => {

  return Property
    .findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});


// Delete a reservation with a given id
router.delete('/reservations/:id', jwtAuth, (req, res) => {

  return Reservation
    .findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

router.use('*', (req, res) => {
  res.status(404).send('URL Not Found');
});

module.exports = { router };
