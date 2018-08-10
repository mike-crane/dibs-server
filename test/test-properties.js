'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../server');
const { Property } = require('../dibs');
const { User } = require('../users');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('/api/dibs/property', () => {
  const name = 'exampleName';
  const street = 'exampleStreet';
  const city = 'exampleCity';
  const state = 'exampleState';
  const zipcode = 27587;
  const type = 'exampleType';
  const owner = 'exampleOwner';
  const thumbUrl = 'exampleUrl';
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

  describe('/api/dibs/properties', () => {
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
        .get('/api/dibs/properties')
        .set('authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(0);
        });
      });
    });
    describe('POST', () => {
      // it('Should return a newly created property', () => {
      //   return chai
      //     .request(app)
      //     .post('/api/dibs/properties')
      //     .set('authorization', `Bearer ${token}`)
      //     .send({ name, street, city, state, zipcode, type, owner, thumbUrl })
      //     .then(res => {
      //       expect(res).to.have.status(201);
      //       expect(res.body).to.be.an('object');
      //       const name = res.body.name;
      //       const street = res.body.street;
      //       const city = res.body.city;
      //       const state = res.body.state;
      //       const zipcode = res.body.zipcode;
      //       const type = res.body.type;
      //       const owner = res.body.owner;
      //       const thumbUrl = res.body.thumbUrl;
      //       expect(name).to.be.a("string");
      //       expect(street).to.be.a("string");
      //       expect(city).to.be.a("string");
      //       expect(state).to.be.a("string");
      //       expect(zipcode).to.be.a("number");
      //       expect(type).to.be.a('string');
      //       expect(owner).to.be.a("string");
      //       expect(thumbUrl).to.be.a("string");
      //       expect(name).to.equal('exampleName');
      //       expect(street).to.equal('exampleStreet');
      //       expect(state).to.equal('exampleState');
      //       expect(city).to.equal('exampleCity');
      //       expect(zipcode).to.equal(27587);
      //       expect(type).to.equal('exampleType');
      //       expect(owner).to.equal('exampleOwner');
      //       expect(thumbUrl).to.equal("exampleUrl");
      //     });
      // });
      it('Should reject properties with missing name', () => {
        return chai
          .request(app)
          .post('/api/dibs/properties')
          .set('authorization', `Bearer ${token}`)
          .send({
            street,
            city,
            state, 
            zipcode,
            type,
            owner,
            thumbUrl
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
            expect(res.body.location).to.equal('name');
          });
      });
      // it('Should reject properties with missing address', () => {
      //   return chai
      //     .request(app)
      //     .post('/api/dibs/properties')
      //     .set('authorization', `Bearer ${token}`)
      //     .send({
      //       name, 
      //       type,
      //       owner, 
      //       thumbUrl
      //     })
      //     .then(() =>
      //       expect.fail(null, null, 'Request should not succeed')
      //     )
      //     .catch(err => {
      //       if (err instanceof chai.AssertionError) {
      //         throw err;
      //       }

      //       const res = err.response;
      //       expect(res).to.have.status(422);
      //       expect(res.body.reason).to.equal('ValidationError');
      //       expect(res.body.message).to.equal('Missing field');
      //       expect(res.body.location).to.equal('address');
      //     });
      // });
      it('Should reject properties with missing type', () => {
        return chai
          .request(app)
          .post('/api/dibs/properties')
          .set('authorization', `Bearer ${token}`)
          .send({
            name,
            street,
            city,
            state,
            zipcode,
            owner,
            thumbUrl
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
            expect(res.body.location).to.equal('type');
          });
      });
      // it('Should reject properties with empty name', () => {
      //   return chai
      //     .request(app)
      //     .post('/api/dibs/properties')
      //     .set('authorization', `Bearer ${token}`)
      //     .send({
      //       name: '',
      //       street,
      //       city,
      //       state,
      //       zipcode,
      //       type,
      //       owner,
      //       thumbUrl
      //     })
      //     .then(() =>
      //       expect.fail(null, null, 'Request should not succeed')
      //     )
      //     .catch(err => {
      //       if (err instanceof chai.AssertionError) {
      //         throw err;
      //       }

      //       const res = err.response;
      //       expect(res).to.have.status(422);
      //       expect(res.body.reason).to.equal('ValidationError');
      //       expect(res.body.message).to.equal(
      //         'Must be at least 1 characters long'
      //       );
      //       expect(res.body.location).to.equal('name');
      //     });
      // });
      // it('Should reject properties with empty type', () => {
      //   return chai
      //     .request(app)
      //     .post('/api/dibs/properties')
      //     .set('authorization', `Bearer ${token}`)
      //     .send({
      //       name,
      //       street,
      //       city,
      //       state,
      //       zipcode,
      //       type: '',
      //       owner,
      //       thumbUrl
      //     })
      //     .then(() =>
      //       expect.fail(null, null, 'Request should not succeed')
      //     )
      //     .catch(err => {
      //       if (err instanceof chai.AssertionError) {
      //         throw err;
      //       }

      //       const res = err.response;
      //       expect(res).to.have.status(422);
      //       expect(res.body.reason).to.equal('ValidationError');
      //       expect(res.body.message).to.equal(
      //         'Must be at least 1 characters long'
      //       );
      //       expect(res.body.location).to.equal('type');
      //     });
      // });
    });

    describe('PUT', () => {
      // it("it should UPDATE a property given the id", () => {
      //   const updateData = { 
      //     name: "Florida Beach House", 
      //     street: "100 Palm St", 
      //     city: "Jacksonville", 
      //     state: "FL", 
      //     zipcode: 32024, 
      //     type: "house", 
      //     owner: "John Doe", 
      //     thumbUrl: "https://www.exampleUrl.com/" 
      //   };

      //   return Property
      //     .findOne()
      //     .then((property) => {
      //       updateData.id = property.id;

      //       // make request then inspect it to make sure it reflects
      //       // data we sent
      //       return chai
      //         .request(app)
      //         .put(`/api/dibs/properties/${property.id}`)
      //         .set("authorization", `Bearer ${token}`)
      //         .send(updateData);
      //     })
      //     .then(res => {
      //       expect(res).to.have.status(204);

      //       return Property.findById(updateData.id);
      //     })
      //     .then(function(property) {
      //       expect(property.name).to.equal(updateData.name);
      //       expect(property.street).to.equal(updateData.street);
      //     });
      // });
    });

    describe('DELETE', () => {
      // it('it should DELETE a property given the id', () => {
      //   let property;

      //   return Property
      //     .findOne()
      //     .then(function (_property) {
      //       property = _property;
      //       return chai
      //       .request(app)
      //       .delete(`/api/dibs/properties/${property.id}`)
      //       .set('authorization', `Bearer ${token}`);
      //     })
      //     .then(function (res) {
      //       expect(res).to.have.status(204);
      //       return Property
      //       .findById(property.id);
      //     })
      //     .then(function (_property) {
      //       expect(_property).to.be.null;
      //     });
      // });
    });

  });
});