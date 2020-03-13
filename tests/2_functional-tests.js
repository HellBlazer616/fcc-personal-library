const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
	/*
	 * ----[EXAMPLE TEST]----
	 * Each test should completely test the response of the API end-point including response status code!
	 */
	test('#example Test GET /api/books', function(done) {
		chai.request(server)
			.get('/api/books')
			.end(function(err, res) {
				assert.equal(res.status, 200);
				assert.isArray(res.body, 'response should be an array');
				assert.property(
					res.body[0],
					'commentcount',
					'Books in array should contain commentcount'
				);
				assert.property(res.body[0], 'title', 'Books in array should contain title');
				assert.property(res.body[0], '_id', 'Books in array should contain _id');
			});
		done();
	});
	/*
	 * ----[END of EXAMPLE TEST]----
	 */

	suite('Routing tests', function() {
		suite('POST /api/books with title => create book object/expect book object', function() {
			test('Test POST /api/books with title', function(done) {
				chai.request(server)
					.post('/api/books')
					.send({})
					.end(function(err, res) {
						assert.equal(res.status, 200);

						assert.equal(
							res.body,
							'Book validation failed: title: Books must have a title which is 3 character or more'
						);
					});
				done();
			});

			test('Test POST /api/books with no title given', function(done) {
				chai.request(server)
					.post('/api/books')
					.send({
						title: 'test book',
					})
					.end(function(err, res) {
						assert.equal(res.status, 200);
						assert.isObject(res.body, 'response should be an object');
						assert.property(res.title, 'title', 'Books should have a title');
						assert.property(
							res.unique_id,
							'unique_id',
							'Books should have a unique_id'
						);
						assert.isString(res.title, 'Books title should be a String');
					});
				done();
			});
		});
	});
	suite('GET /api/books => array of books', function() {
		test('Test GET /api/books', function(done) {
			chai.request(server)
				.get('/api/books')
				.end(function(err, res) {
					assert.equal(res.status, 200);
					assert.isArray(res.body, 'response should be an array');
					assert.property(
						res.body[0],
						'commentcount',
						'Books in array should contain commentcount'
					);
					assert.property(res.body[0], 'title', 'Books in array should contain title');
					assert.property(res.body[0], '_id', 'Books in array should contain _id');
				});
			done();
		});
	});
	suite('GET /api/books/[id] => book object with [id]', function() {
		test('Test GET /api/books/[id] with id not in db', function(done) {
			chai.request(server)
				.get('/api/books/5e6b3e9d156cac2e3ce46788')
				.send({})
				.end(function(err, res) {
					assert.equal(res.status, 200);

					assert.equal(res.body, 'no book exists');
				});
			done();
		});

		test('Test GET /api/books/[id] with valid id in db', function(done) {
			chai.request(server)
				.get('/api/books/5e6b3e9d156cac2e3ce46799')
				.end(function(err, res) {
					assert.equal(res.status, 200);
					assert.isObject(res.body, 'response should be an object');
					assert.property(res.title, 'title', 'Books should have a title');
					assert.property(res.unique_id, 'unique_id', 'Books should have a unique_id');
					assert.isString(res.title, 'Books title should be a String');
				});
			done();
		});
	});

	suite('POST /api/books/[id] => add comment/expect book object with id', function() {
		test('Test POST /api/books/[id] with comment', function(done) {
			chai.request(server)
				.post('/api/books/5e6b3e9d156cac2e3ce46799')
				.send({
					comment: 'good book',
				})
				.end(function(err, res) {
					assert.equal(res.status, 200);
					assert.isObject(res.body, 'response should be an object');
					assert.property(res.title, 'title', 'Books should have a title');
					assert.property(res._id, '_id', 'Books should have a unique _id');
					assert.isArray(res.comments, 'Books comments should be an array');
				});
			done();
		});
	});
});
