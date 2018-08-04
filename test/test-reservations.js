'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../server');
const { Reservations } = require('../dibs');
const { User } = require('../users');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('/api/reservation', () => {
  const room = 'exampleRoom';
  const description = 'exampleDesc';
  const contents = 'exampleCont';
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

  describe('/api/reservations', () => {
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
          .get('/api/reservations/:user')
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
          .post('/api/reservations')
          .set('authorization', `Bearer ${token}`)
          .send({ room, description, contents })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            const room = res.body.room;
            const description = res.body.description;
            const contents = res.body.contents;
            expect(room).to.be.a('string');
            expect(description).to.be.a('string');
            expect(contents).to.be.a('string');
            expect(room).to.equal('exampleRoom');
            expect(description).to.equal('exampleDesc');
            expect(contents).to.equal('exampleCont');
          });
      });
      it('Should reject reservations with missing room', () => {
        return chai
          .request(app)
          .post('/api/reservations')
          .set('authorization', `Bearer ${token}`)
          .send({
            description,
            contents
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
            expect(res.body.location).to.equal('room');
          });
      });
      it('Should reject reservations with missing description', () => {
        return chai
          .request(app)
          .post('/api/reservations')
          .set('authorization', `Bearer ${token}`)
          .send({
            room,
            contents
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
            expect(res.body.location).to.equal('description');
          });
      });
      it('Should reject reservations with missing contents', () => {
        return chai
          .request(app)
          .post('/api/reservations')
          .set('authorization', `Bearer ${token}`)
          .send({
            room,
            description
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
            expect(res.body.location).to.equal('contents');
          });
      });
      it('Should reject reservations with empty room', () => {
        return chai
          .request(app)
          .post('/api/reservations')
          .set('authorization', `Bearer ${token}`)
          .send({
            room: '',
            description,
            contents
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
            expect(res.body.location).to.equal('room');
          });
      });
      it('Should reject reservations with empty description', () => {
        return chai
          .request(app)
          .post('/api/reservations')
          .set('authorization', `Bearer ${token}`)
          .send({
            room,
            description: '',
            contents
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
            expect(res.body.location).to.equal('description');
          });
      });
      it('Should reject reservations with empty contents', () => {
        return chai
          .request(app)
          .post('/api/reservations')
          .set('authorization', `Bearer ${token}`)
          .send({
            room,
            description,
            contents: ''
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
            expect(res.body.location).to.equal('contents');
          });
      });
    });

    describe('PUT', () => {
      it('it should UPDATE a reservation given the id', () => {
        const updateData = {
          room: 'foyer',
          description: 'decorations',
          contents: 'vase, picture frames'
        };

        return Reservations
          .findOne()
          .then((reservations) => {
            updateData.id = reservations.id;

            // make request then inspect it to make sure it reflects
            // data we sent
            return chai.request(app)
              .put(`/api/reservations/${reservations.id}`)
              .set('authorization', `Bearer ${token}`)
              .send(updateData);
          })
          .then((res) => {
            expect(res).to.have.status(204);

            return Reservations.findById(updateData.id);
          })
          .then(function (reservations) {
            expect(reservations.room).to.equal(updateData.room);
            expect(reservations.contents).to.equal(updateData.contents);
          });
      });
    });

    describe('DELETE', () => {
      it('it should DELETE a reservation given the id', () => {
        let reservation;

        return Reservations
          .findOne()
          .then(function (_reservation) {
            reservation = _reservation;
            return chai
              .request(app)
              .delete(`/api/reservations/${reservation.id}`)
              .set('authorization', `Bearer ${token}`);
          })
          .then(function (res) {
            expect(res).to.have.status(204);
            return Reservations
              .findById(reservation.id);
          })
          .then(function (_reservation) {
            expect(_reservation).to.be.null;
          });
      });
    });

  });
});