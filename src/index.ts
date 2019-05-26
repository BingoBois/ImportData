import {getCities, getZipFileNames, unzipFile, readRdf, deleteFilesFromUnpacked, getMentionedCities, getMentionedCitiesInclude} from './readFiles'
import { getAuthors, getTitle } from './rdf'
import { createAuthorAndBook, createCityRelationToBook, close } from './neo4j'
import { getAuthorIds, getBookId, setMentionedCountries, setBookWrittenBy, closeCon } from './mysql'

// Indlæs Lande fra en fil
// Lav et array ud fra de givne lande
const citiesArr = getCities();
// 
// Få en liste over alle zip filer i mappen
const zipFileArr = getZipFileNames();
console.log(zipFileArr);
(async () => {
    for (let index = 0; index < zipFileArr.length; index++) {
        const zipFileName = zipFileArr[index];
        const regexResult = zipFileName.replace(".zip", "").match(/^[0-9]*$/)
        let rdfContent = "";
        // @ts-ignore
        if(!regexResult){
            continue;
        }
        console.log("Valid", zipFileName)
        // udpak dem en af gangen
        try{
            if(zipFileArr[index] === "5.zip"){throw Error("Test")}
            unzipFile(zipFileName)
            rdfContent = readRdf(zipFileName);
            const authors = getAuthors(rdfContent);
            console.log("Resolving Authors")
            const title = getTitle(rdfContent);
            if(title.length > 100)
            {
                continue;
            }
            console.log("Resolving Title")
            // Led bogen igennem efter nævnte lande, ved at regex hvert element i lande arrayet
            // Hver titel har en samling, af lande den nævner
            console.log("Getting all cities mentioned")
            const mentionedCities = getMentionedCitiesInclude(zipFileName, citiesArr);
            if(mentionedCities.length > 0){
                await createAuthorAndBook(authors[0], title);
                console.log("Inserting into Neo4j Author and Book")
                for (let index = 0; index < mentionedCities.length; index++) {
                    const element = mentionedCities[index];
                    await createCityRelationToBook(title, element)
                }
                const bookId = await getBookId(title)
                await setMentionedCountries(bookId, mentionedCities)
                await setBookWrittenBy(await getAuthorIds(authors), bookId);
                console.log("Creating relation to")
            }
            // 
            // Brug filnavnet til at anvende grep script for at finde tilsvarende rdf fil
            // Ud fra meta data, find titel på bogen, og dens forfattere
            // Led bogen igennem efter nævnte lande, ved at regex hvert element i lande arrayet
            // Hver titel har en samling, af lande den nævner
            //
            // Indsæt bøger og forfatter i Neo4J og Mysql
            // Indsæt relation mellem forfatter og bøger
            
            //createBookAuthor(authors, title, mentionedCities, 1);
            // Indsæt alle byer i neo4j
            // Skab en relation mellem by og bog som den bliver nævnt i
            deleteFilesFromUnpacked();
        }catch(err){
            console.log(err);
            deleteFilesFromUnpacked();
            continue;
        }
        // Ud fra den udpakkede fil, finde meta data
        // Anvend filnavnet hvis det kan parses, til at finde meta data
        // De filer som ikke kan parses, gem dem til senere brug
        // Ud fra meta data, find titel på bogen, og dens forfattere
        
    }
    closeCon();
})();








