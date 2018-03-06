'use strict';

const sqlite3 = require('sqlite3').verbose();
let db;

const open = (path) => {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database(path,
            (err) => {
                if (err) {
                    reject("Open error: " + err.message);
                } else {
                    resolve(path + " opened")
                }
            }
        )
    })
};

// any query: insert/delete/update
const run = (query) => {
    return new Promise((resolve, reject) => {
        db.run(query, (err) => {
            if (err) {
                reject(err.message);
            }
            else {
                resolve(true)
            }
        })
    })
};

// first row read
const get = (query, params) => {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) {
                reject("Read error: " + err.message);
            } else {
                resolve(row)
            }
        })
    })
};

// set of rows read
const all = (query, params) => {
    return new Promise((resolve, reject) => {
        if (params === undefined) params = [];

        db.all(query, params, (err, rows) => {
            if (err) {
                reject("Read error: " + err.message);
            } else {
                resolve(rows)
            }
        })
    })
};

// each row returned one by one
const each = (query, params, action) => {
    return new Promise((resolve, reject) => {
        let db = db;
        db.serialize(() => {
            db.each(query, params, (err, row) => {
                if (err) {
                    reject("Read error: " + err.message);
                } else {
                    if (row) {
                        action(row)
                    }
                }
            });
            db.get("", (err, row) => {
                resolve(true)
            })
        })
    })
};

const runWithPrepareStatement = (query, param) => {
    return new Promise((resolve, reject) => {
        db.run(query, param, (err) => {
            if (err) {
                reject(err.message);
            }
            else {
                resolve(true)
            }
        });
    });
};

const close = () => {
    return new Promise((resolve, reject) => {
        db.close();
        resolve(true)
    })
};

module.exports = {
    open: open,
    run: run,
    get: get,
    all: all,
    each: each,
    runWithPrepareStatement,
    close: close
};