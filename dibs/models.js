'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const statesArray = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

const PropertySchema = mongoose.Schema({
  name: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { 
    type: String, 
    required: true, 
    uppercase: true, 
    enum: statesArray 
  },
  zipcode: { type: Number, required: true },
  type: { type: String, required: true },
  owner: { type: String },
  thumbUrl: { type: String, required: true }
});

PropertySchema.methods.serialize = function () {
  return {
    name: this.name,
    street: this.street,
    city: this.city,
    state: this.state,
    zipcode: this.zipcode,
    type: this.type,
    owner: this.owner,
    thumbUrl: this.thumbUrl,
    id: this._id
  };
};

const Property = mongoose.model('Property', PropertySchema);

const ReservationSchema = mongoose.Schema({
  username: { type: String, required: true },
  propertyName: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true }
});

ReservationSchema.methods.serialize = function () {
  return {
    username: this.username,
    propertyName: this.propertyName,
    start: this.start,
    end: this.end,
    id: this._id
  };
};

const Reservation = mongoose.model('Reservation', ReservationSchema);

module.exports = { Property, Reservation };