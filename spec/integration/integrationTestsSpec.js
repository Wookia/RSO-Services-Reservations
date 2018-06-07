"use strict";

let request = require("request");
let port = process.env.PORT || 3000;
const fs = require('fs');

let myService;
let id_table = 1;
let id_reservation = 1;
let token ="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6MywiaWQiOiJiNTBiZTQxOS02MWZlLTQ0MDMtOGYzNC0xZTE1NjMxMjYyYTQiLCJpYXQiOjE1MjgzNzIyMzIsImV4cCI6MTUyODQwODIzMn0.NKFjreodQZvimMIezmrlQkFGiPXuzflz8KgPkuUB-NkR3hgRZTSxChQdr38xSRKKgfB5WNImCZTbVcBStYkgfv6HMwQTJPlls62tugoI8Wr36ORaSU5Qwd94X5nsq_i3P__3tGs5kcY2IvE5O2U-HDvcBv_35effVOgxDxhL6k0";
describe("Reservation Service - Integration Tests / ", function () {

    process.env.TESTS = true;
    process.env.DB_NAME = "postgres";
    process.env.DB_USER = "postgres";
    process.env.DB_PASSWORD = "password";

    let baseUrl = "http://localhost:" + port + "/api/";

    beforeAll(function (done) {
        fs.unlink('spec/database.sqlite');
        myService = require("../../src/index.js");
        myService.startServer().then(() => {
            done();
        });

    }, 60000);

    afterAll(function (done) {
        myService.stopServer().then(() => {
            fs.unlink('spec/database.sqlite');
            done();
        });
    }, 60000);

    describe("Table", function () {

        describe("/GET", function () {

            it("should return all tables", function (done) {
                request.get(baseUrl + "table/", {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    json: true
                }, function (err, response, body) {
                    console.log('info ' + JSON.stringify(response)) ;
                    expect(response.statusCode).toEqual(200);
                    expect(response.body[0].waiter).toBeDefined();
                    expect(response.body[0].seats).toBeDefined();
                    expect(response.body[0].is_taken).toBeDefined();
                    id_table = response.body[0].id_table;
                    done();
                });
            });

            // it("should return free tables", function (done) {
            //     request.get(baseUrl + "table/free", {
            //         headers: {
            //             'Content-Type': 'application/json',
            //             'Authorization': 'Bearer ' + token
            //         },
            //         json: true
            //     }, function (err, response, body) {//pytanie o fora
            //         expect(response.statusCode).toEqual(200);
            //         expect(response.body[0].waiter).toBeDefined();
            //         expect(response.body[0].seats).toBeDefined();
            //         expect(response.body[0].is_taken).toBeDefined();
            //         done();
            //     });
            // });
            //
            // it("should return table", function (done) {
            //     request.get(baseUrl + "table/" + id_table, {
            //         headers: {
            //             'Content-Type': 'application/json',
            //             'Authorization': 'Bearer ' + token
            //         },
            //         json: true
            //     }, function (err, response, body) {
            //         expect(response.statusCode).toEqual(200);
            //         expect(response.body[0].waiter).toBeDefined();
            //         expect(response.body[0].seats).toBeDefined();
            //         expect(response.body[0].is_taken).toBeDefined();
            //         done();
            //     });
            // });
        });
        // describe("/POST", function () {
        //
        //     it("should add a table", function (done) {
        //         request.post(baseUrl + "table", {
        //             body: {
        //                 "waiter": "John",
        //                 "seats": 6,
        //                 "is_taken": false
        //             },
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 'Authorization': 'Bearer ' + token
        //             },
        //             json: true
        //         }, function (err, response, body) {
        //             expect(response.statusCode).toEqual(200);
        //             expect(response.body).toBeDefined();
        //
        //             done();
        //         });
        //     });
        // });
        //
        // describe("PUT", function () {
        //
        //     it("should take table", function (done) {
        //         request.put(baseUrl + "table/" + id_table + "/take", {
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 'Authorization': 'Bearer ' + token
        //             },
        //             json: true
        //         }, function (err, response, body) {
        //             expect(response.statusCode).toEqual(200);
        //             expect(response.body.result).toBe(true);
        //
        //             done();
        //         });
        //     });
        //
        //     it("should free table", function (done) {
        //         request.put(baseUrl + "table/" + id_table + "/free", {
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 'Authorization': 'Bearer ' + token
        //             },
        //             json: true
        //         }, function (err, response, body) {
        //             expect(response.statusCode).toEqual(200);
        //             expect(response.body.result).toBe(true);
        //             done();
        //         });
        //     });
        //
        //     it("should update table", function (done) {
        //         request.put(baseUrl + "table/" + id_table + "/take", {
        //             body: {
        //                 "id_table": id_table,
        //                 "waiter": "Peter",
        //                 "seats": 3,
        //                 "is_taken": false
        //             },
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 'Authorization': 'Bearer ' + token
        //             },
        //             json: true
        //         }, function (err, response, body) {
        //             expect(response.statusCode).toEqual(200);
        //             expect(response.body.result).toBe(true);
        //
        //             done();
        //         });
        //     });
        //     it("should reject", function (done) {
        //         request.put(baseUrl + "table/" + id_table + "/take", {
        //             body: {
        //                 "id_table": 1000,
        //                 "waiter": "Peter",
        //                 "seats": 3,
        //                 "is_taken": false
        //             },
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 'Authorization': 'Bearer ' + token
        //             },
        //             json: true
        //         }, function (err, response, body) {
        //             expect(response.statusCode).toEqual(400);
        //             expect(response.body).toBe("param's is not equal bodies id");
        //
        //             done();
        //         });
        //     });
        // });
        //
        // describe("/DELETE", function () {
        //     it("should delete table", function (done) {
        //         request.delete(baseUrl + "table/" + id_table, {
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 'Authorization': 'Bearer ' + token
        //             },
        //             json: true
        //         }, function (err, response, body) {
        //             expect(response.statusCode).toEqual(200);
        //             expect(response.body.result).toBe(true);
        //             done();
        //         });
        //     });
        //
        // });

    });
});