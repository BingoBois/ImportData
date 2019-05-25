import mysql from 'mysql'

const MYSQL_HOST = process.env.MYSQL_HOST ? process.env.MYSQL_HOST : "78.141.213.31";
const MYSQL_USER = process.env.MYSQL_USER ? process.env.MYSQL_USER : "root";
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD ? process.env.MYSQL_PASSWORD : "mingade85";
const MYSQL_DATABASE = process.env.MYSQL_DATABASE ? process.env.MYSQL_DATABASE : "dbbook";

const connection = mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    multipleStatements: true,
    connectTimeout: 200000
});
connection.connect();

export function setBookWrittenBy(authors: number[], bookId: number){
    return new Promise((resolve, reject) => {
    let str = "";
    for (let index = 0; index < authors.length; index++) {
        const author = authors[index];
        str += `INSERT INTO BookWrittenBy (fk_Book, fk_Author) VALUES((SELECT id FROM Book WHERE id=${bookId}), (SELECT id FROM Author WHERE id=${author}));\n`
    }
        connection.query(str, (error, rows) => {
            if (error) {
                reject(error)
            }
            resolve(true);
        });
    })
}

export function setMentionedCountries(bookId: number, countries: string[]){
    return new Promise((resolve, reject) => {
    let str = "";
    for (let index = 0; index < countries.length; index++) {
        const country = countries[index];
        str += `INSERT INTO LocationInBook (fk_Book, fk_Location, amount) VALUES((SELECT id FROM Book WHERE id=${bookId}), (SELECT name FROM Location WHERE name="${country}"), 1);\n`
    }
        connection.query(str, (error, rows) => {
            if (error) {
                reject(error)
            }
            resolve(true);
        });
    })
}

export function getAuthorIds(authors: string[]): Promise<number[]> {
    return new Promise((resolve, reject) => {
        let str = "";
        for (let index = 0; index < authors.length; index++) {
            const author = authors[index];
            str += `INSERT INTO Author (name) VALUES ("${author}");\n`
            str += `SET @last_id${index} = LAST_INSERT_ID();\n`
            console.log("MySQL - getBookId", `${author}`)
        }
        str += "SELECT"
        for (let index = 0; index < authors.length; index++) {
            if (index === authors.length - 1) {
                str += ` @last_id${index};`
            } else {
                str += ` @last_id${index},`
            }
        }
        connection.query(str, (error, rows) => {
            if (error) {
                reject(error)
            }
            if(!rows){
                resolve([0])
            }else{
                resolve(Object.values(rows[rows.length-1][0]))
            }
        });
    })
}

export function getBookId(title: string): Promise<number> {
    console.log("MySQL - getBookId", `${title}`)
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO Book (title) VALUES(?); SELECT LAST_INSERT_ID();`, [title], (error, results) => {
            if (error) {
                console.log(error);
            }
            resolve(results[0].insertId)
        });
    })
}

export function closeCon(){
}
