import fs from 'fs';
import path from 'path';
import Zip from 'adm-zip';
const rimraf = require("rimraf");
const fse = require('fs-extra')

export function getCities(): string[] {
    console.log("Reading cities")
    const cities = fs.readFileSync('./citiesnames.csv').toString("utf8");
    return cities.split("\n");
}

export function getMentionedCities(fileName: string, cities: string[]): string[] {
    console.log("Getting mentioned Cities")
    const files = fs.readdirSync(path.resolve(__dirname, '../unpacked'));
    let cityArr: string[] = [];
    if (files[0].includes(".txt")) {
        const book = fs.readFileSync(path.resolve(__dirname, `../unpacked/${fileName.replace(".zip", "")}.txt`)).toString("utf8")

        for (let index = 0; index < cities.length; index++) {
            const city = cities[index];
            const cityResult = new RegExp(`(?<=\\s|^)${city}(?=\\s|$|\\!|\\?|\\.|\\,)`, 'gi').exec(book);
            if (cityResult && city !== "") {
                cityArr.push(city);
            }
        }
    } else {
        const book = fs.readFileSync(path.resolve(__dirname, `../unpacked/${fileName.replace(".zip", "")}/${fileName.replace(".zip", "")}.txt`)).toString("utf8")
        for (let index = 0; index < cities.length; index++) {
            const city = cities[index];
            const cityResult = new RegExp(`(?<=\\s|^)${city}(?=\\s|$|\\!|\\?|\\.|\\,)`, 'gi').exec(book);
            if (cityResult && city !== "") {
                cityArr.push(city);
            }
        }
    }
    return cityArr;
}

export function getMentionedCitiesInclude(fileName: string, cities: string[]): string[] {
    console.log("Getting mentioned Cities")
    const book = fs.readFileSync(path.resolve(__dirname, `../unpacked/${fileName.replace(".zip", "")}.txt`)).toString("utf8")
    let cityArr: string[] = [];
    for (let index = 0; index < cities.length; index++) {
        const city = cities[index];
        if (book.includes(city) && city !== "") {
            cityArr.push(city);
        }
    }
    return cityArr;
}

export function getZipFileNames(): string[] {
    console.log("Getting zip names")
    return fs.readdirSync(path.resolve(__dirname, '../zipfiles'));
}

export function unzipFile(fileName: string): void {
    console.log("Unzipping")
    try {
        const zip = new Zip(path.resolve(__dirname, `../zipfiles/${fileName}`));
        zip.extractAllTo(path.resolve(__dirname, `../unpacked/`))
    } catch (err) {
        console.log(err)
    }

}

export function readRdf(name: string): string {
    console.log("Reading rdf")
    return fs.readFileSync(path.resolve(__dirname, `../rdf-files/cache/epub/${name.replace(".zip", "")}/pg${name.replace(".zip", "")}.rdf`)).toString("utf8");
}

export function deleteFilesFromUnpacked(): void {
    console.log("Deleting unpacked folder")
    rimraf.sync(path.resolve(__dirname, "../unpacked"));
}
