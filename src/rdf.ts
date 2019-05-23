export function getAuthors(rdfContent: string): string[] {
    let authorArr: string[] = [];
    let index;
    while ((index = rdfContent.indexOf(":name>")) !== -1) {
        rdfContent = rdfContent.substring(index + ":name>".length);
        index = rdfContent.indexOf("</")
        authorArr.push(rdfContent.substring(0, index))
        rdfContent = rdfContent.substring(rdfContent.indexOf("\n") + 1)
    }
    return authorArr;
}

export function getTitle(rdfContent: string): string {
    let index = rdfContent.indexOf(":title>")
    rdfContent = rdfContent.substring(index + ":title>".length);
    index = rdfContent.indexOf("</")
    return rdfContent.substring(0, index).replace("\n", " ");
}
