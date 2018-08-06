'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiDatetime = require('chai-datetime');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../server');
const { Reservation } = require('../dibs');
const { User } = require('../users');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);
chai.use(chaiDatetime);

describe('/api/dibs/reservation', () => {
  const user = 'exampleUser';
  const propertyName = 'exampleProperty';
  const start = new Date('2018-05-01');
  const end = new Date('2018-05-11');
  const username = 'exampleUser';
  const password = 'examplePass';
  const firstName = 'Example';
  const lastName = 'User';

  before(() => {
    return runServer(TEST_DATABASE_URL);
  });

  after(() => {
    return closeServer();
  });

  beforeEach(() => {
    return User.hashPassword(password).then(password =>
      User.create({
        username,
        password,
        firstName,
        lastName
      })
    );
  });

  afterEach(() => {
    return User.remove({});
  });

  describe('/api/dibs/reservations', () => {
    const token = jwt.sign(
      {
        user: {
          username,
          firstName,
          lastName
        }
      },
      JWT_SECRET,
      {
        algorithm: 'HS256',
        subject: username,
        expiresIn: '7d'
      }
    );
    describe('GET', () => {
      it('Should return an empty array initially', () => {

        return chai.request(app)
          .get('/api/dibs/reservations')
          .set('authorization', `Bearer ${token}`)
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.length(0);
          });
      });
    });
    describe('POST', () => {
      it('Should return a newly created reservation', () => {
        return chai
          .request(app)
          .post('/api/dibs/reservations')
          .set('authorization', `Bearer ${token}`)
          .send({ user, propertyName, start, end })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            const user = res.body.user;
            const propertyName = res.body.propertyName;
            expect(propertyName).to.be.a('string');
            expect(user).to.be.a('string');
            expect(propertyName).to.equal('exampleProperty');
            expect(user).to.equal('exampleUser');
          });
      });
      it('Should reject reservations with missing propertyName', () => {
        return chai
          .request(app)
          .post('/api/dibs/reservations')
          .set('authorization', `Bearer ${token}`)
          .send({
            user,
            start,
            end
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('propertyName');
          });
      });
      it('Should reject reservations with missing start', () => {
        return chai
          .request(app)
          .post('/api/dibs/reservations')
          .set('authorization', `Bearer ${token}`)
          .send({
            user,
            propertyName,
            end
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('start');
          });
      });
      it('Should reject reservations with missing end', () => {
        return chai
          .request(app)
          .post('/api/dibs/reservations')
          .set('authorization', `Bearer ${token}`)
          .send({
            user,
            propertyName,
            start
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('end');
          });
      });
      it('Should reject reservations with empty property name', () => {
        return chai
          .request(app)
          .post('/api/dibs/reservations')
          .set('authorization', `Bearer ${token}`)
          .send({
            user,
            propertyName: '',
            start,
            end
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Must be at least 1 characters long'
            );
            expect(res.body.location).to.equal('propertyName');
          });
      });
      it('Should reject reservations with empty start', () => {
        return chai
          .request(app)
          .post('/api/dibs/reservations')
          .set('authorization', `Bearer ${token}`)
          .send({
            user,
            propertyName,
            start: '',
            end
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Must be at least 1 characters long'
            );
            expect(res.body.location).to.equal('start');
          });
      });
      it('Should reject reservations with empty end', () => {
        return chai
          .request(app)
          .post('/api/dibs/reservations')
          .set('authorization', `Bearer ${token}`)
          .send({
            user,
            propertyName,
            start,
            end: ''
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Must be at least 1 characters long'
            );
            expect(res.body.location).to.equal('end');
          });
      });
    });

    describe('PUT', () => {
      it('it should UPDATE a reservation given the id', () => {
        const updateData = {
          user: 'newUser',
          propertyName: 'newProperty',
          start: new Date('2011-10-01'),
          end: new Date('2011-10-11')
        };

        return Reservation
          .findOne()
          .then((reservation) => {
            updateData.id = reservation.id;

            // make request then inspect it to make sure it reflects
            // data we sent
            return chai.request(app)
              .put(`/api/dibs/reservations/${reservation.id}`)
              .set('authorization', `Bearer ${token}`)
              .send(updateData);
          })
          .then((res) => {
            expect(res).to.have.status(204);

            return Reservation.findById(updateData.id);
          })
          .then(function (reservation) {
            expect(reservation.propertyName).to.equal(updateData.propertyName);
            expect(reservation.start).to.equalDate(updateData.start);
          });
      });
    });

    describe('DELETE', () => {
      it('it should DELETE a reservation given the id', () => {
        let reservation;

        return Reservation
          .findOne()
          .then(function (_reservation) {
            reservation = _reservation;
            return chai
              .request(app)
              .delete(`/api/dibs/reservations/${reservation.id}`)
              .set('authorization', `Bearer ${token}`);
          })
          .then(function (res) {
            expect(res).to.have.status(204);
            return Reservation
              .findById(reservation.id);
          })
          .then(function (_reservation) {
            expect(_reservation).to.be.null;
          });
      });
    });

  });
});