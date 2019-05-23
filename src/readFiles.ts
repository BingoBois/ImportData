import fs from 'fs';
import path from 'path';
import Zip from 'adm-zip';

export function getCities(): string[]{
    const cities = fs.readFileSync('./citiesnames.csv').toString("utf8");
    return cities.split("\n");
}

export function getMentionedCities(fileName: string, cities: string[]) : string[] {
    const book = fs.readFileSync(path.resolve(__dirname, `../unpacked/${fileName.replace(".zip", "")}.txt`)).toString("utf8")
    let cityArr: string[] = [];
    for (let index = 0; index < cities.length; index++) {
        const city = cities[index];
        const cityResult = new RegExp(`(?<=\\s|^)${city}(?=\\s|$|\\!|\\?|\\.|\\,)`, 'gi').exec(book);
        if(cityResult && city !== ""){
            cityArr.push(city);
        }
    }
    return cityArr;
}

export function getMentionedCitiesInclude(fileName: string, cities: string[]) : string[] {
    const book = fs.readFileSync(path.resolve(__dirname, `../unpacked/${fileName.replace(".zip", "")}.txt`)).toString("utf8")
    let cityArr: string[] = [];
    for (let index = 0; index < cities.length; index++) {
        const city = cities[index];
        if(book.includes(city) && city !== ""){
            cityArr.push(city);
        }
    }
    return cityArr;
}

export function getZipFileNames(): string[]{
    return fs.readdirSync(path.resolve(__dirname, '../smallZip'));
}

export function unzipFile(fileName: string): void{
    const zip = new Zip(path.resolve(__dirname, `../smallZip/${fileName}`));
    zip.extractAllTo(path.resolve(__dirname, `../unpacked/`))
}

export function readRdf(name: string): string{
    return fs.readFileSync(path.resolve(__dirname, `../rdf-files/cache/epub/${name.replace(".zip", "")}/pg${name.replace(".zip", "")}.rdf`)).toString("utf8");
}

export function deleteFilesFromUnpacked(): void{
    const files = fs.readdirSync(path.resolve(__dirname, '../unpacked'));
    for(let i = 0; i < files.length; i++){
        fs.unlinkSync(path.resolve(__dirname, `../unpacked/${files[i]}`))
    }
}
