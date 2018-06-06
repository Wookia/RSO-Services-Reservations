"use strict";

let request = require("request");
let port = process.env.PORT || 3000;
const fs = require('fs');

let myService;
let token;
describe("Reservation Service - Integration Tests / ", function () {

    process.env.TESTS = true;
    process.env.DB_NAME = "postgress";
    process.env.DB_USER = "user";
    process.env.DB_PASSWORD = "password";

    let baseUrl = "http://localhost:" + port + "/api/";

    beforeAll(function (done) {
        fs.unlink('spec/database.sqlite');
        myService = require("../../src/index.js");
        myService.app.then(() => {
            done();
        });

    }, 60000);

    afterAll(function (done) {
        fs.unlink('spec/database.sqlite');
        myService.app.stop().then(done);
    }, 60000);

    describe("Table", function () {
        describe("/POST", function () {
            it("should add a table", function () {
                request.post(baseUrl + "table", {
                    body: {
                        "waiter": "John",
                        "seats": 6,
                        "is_taken": false
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    json: true
                }, function (err, response, body) {
                    expect(response.statusCode).toEqual(200);
                    expect(response.body).toBeDefined();

                    done();
                });
            });

        });
    });
});