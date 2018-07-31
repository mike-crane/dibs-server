'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const PropertiesSchema = mongoose.Schema({
  user: { type: String },
  room: { type: String, required: true },
  description: { type: String, required: true },
  contents: { type: String, required: true },
  unpacked: { type: Boolean, default: false }
});

PropertiesSchema.methods.serialize = function () {
  return {
    user: this.user,
    room: this.room,
    description: this.description,
    contents: this.contents,
    id: this._id,
    unpacked: this.unpacked
  };
};

const Properties = mongoose.model('Properties', PropertiesSchema);

const ReservationsSchema = mongoose.Schema({
  user: { type: String },
  room: { type: String, required: true },
  description: { type: String, required: true },
  contents: { type: String, required: true },
  unpacked: { type: Boolean, default: false }
});

ReservationsSchema.methods.serialize = function () {
  return {
    user: this.user,
    room: this.room,
    description: this.description,
    contents: this.contents,
    id: this._id,
    unpacked: this.unpacked
  };
};

const Reservations = mongoose.model('Reservations', ReservationsSchema);

module.exports = { Properties, Reservations };