import {getCities, getZipFileNames, unzipFile, readRdf, deleteFilesFromUnpacked, getMentionedCities, getMentionedCitiesInclude} from './readFiles'
import { getAuthors, getTitle } from './rdf'
import { createAuthorAndBook, createCityRelationToBook, close } from './neo4j'
import { createBookAuthor } from './mysql'
// Indlæs Lande fra en fil
// Lav et array ud fra de givne lande
const citiesArr = getCities();
// 
// Få en liste over alle zip filer i mappen
const zipFileArr = getZipFileNames();
(async () => {
    for (let index = 0; index < zipFileArr.length; index++) {
        const zipFileName = zipFileArr[index];
        const regexResult = zipFileName.replace(".zip", "").match(/^[0-9]*$/)
        // @ts-ignore
        if(!regexResult){
            continue;
        }
        
        console.log("Valid", zipFileName)
        // udpak dem en af gangen
        unzipFile(zipFileName)
        // Ud fra den udpakkede fil, finde meta data
        const rdfContent = readRdf(zipFileName);
        // Anvend filnavnet hvis det kan parses, til at finde meta data
        // De filer som ikke kan parses, gem dem til senere brug
        // Ud fra meta data, find titel på bogen, og dens forfattere
        const authors = getAuthors(rdfContent);
        const title = getTitle(rdfContent);
        // Led bogen igennem efter nævnte lande, ved at regex hvert element i lande arrayet
        // Hver titel har en samling, af lande den nævner
        const mentionedCities = getMentionedCitiesInclude(zipFileName, citiesArr);
        // 
        // Brug filnavnet til at anvende grep script for at finde tilsvarende rdf fil
        // Ud fra meta data, find titel på bogen, og dens forfattere
        // Led bogen igennem efter nævnte lande, ved at regex hvert element i lande arrayet
        // Hver titel har en samling, af lande den nævner
        //
        // Indsæt bøger og forfatter i Neo4J og Mysql
        // Indsæt relation mellem forfatter og bøger
        await createAuthorAndBook(authors[0], title);
        await createCityRelationToBook(title, mentionedCities[1])
        await createBookAuthor(authors, title, mentionedCities, 1);
        // Indsæt alle byer i neo4j
        // Skab en relation mellem by og bog som den bliver nævnt i
        deleteFilesFromUnpacked();
    }
    close();
})();








