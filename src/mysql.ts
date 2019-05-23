import { MysqlError,  } from "mysql";

const mysql = require('mysql');

const MYSQL_HOST = process.env.MYSQL_HOST ? process.env.MYSQL_HOST : "viter.dk";
const MYSQL_USER = process.env.MYSQL_USER ? process.env.MYSQL_USER : "transformer";
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD ? process.env.MYSQL_PASSWORD : "mingade";
const MYSQL_DATABASE = process.env.MYSQL_DATABASE ? process.env.MYSQL_DATABASE : "dbbook";

const connection = mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    multipleStatements: true
});
connection.connect();

export async function createBookAuthor(authors: string[], title: string, cityNames: string[], amount: number) {
    console.log("MySQL - createBookAuthor", `${JSON.stringify(authors)} - ${title} - ${JSON.stringify(cityNames)}`)
    const bookId = await getBookId(title);
    let bookWrittenBy = "";
    let locations = "";
    for (let i = 0; i < authors.length; i++) {
        const authorId = await addOrGetAuthorId(authors[i]);
        bookWrittenBy += `INSERT INTO BookWrittenBy (fk_Book, fk_Author) VALUES (${bookId}, ${authorId});`
    }

    cityNames.forEach((cityName: string) => {
        locations += `INSERT INTO LocationInBook (fk_Book, fk_Location, amount) VALUES (${bookId}, "${cityName}", 1); `
    })
    return new Promise((resolve, reject) => {
        connection.query(`${bookWrittenBy}${locations}`, [], (error: MysqlError, ) => {
            if (error) {
                console.log(error);
            }
            resolve(true)
        });
    })
}

function getBookId(title: string) {
    console.log("MySQL - getBookId", `${title}`)
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO Book (title) VALUES(?); SELECT LAST_INSERT_ID();`, [title], function (error: MysqlError, results: any) {
            if (error) {
                console.log(error);
            }
            resolve(results[0].insertId)
        });
    })
}

async function addOrGetAuthorId(name: string) {
    console.log("MySQL - addOrGetAuthorId", `${name}`)
    return new Promise((resolve, reject) => {
        connection.query(`SELECT id from Author where name = ?`, [name], function (error: MysqlError, results: any) {
            if (error) {
                console.log(error);
            }
            if (results.length < 1) {
                connection.query(`INSERT INTO Author (name) VALUES(?); SELECT id from Author where name = ?`, [name, name], function (error: MysqlError, results: any) {
                    if (error) {
                        return console.log(error);;
                    }
                    return resolve(results[0].insertId);
                });
            } else {
                resolve(results[0].id);
            }
        });
    })
}
