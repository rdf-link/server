export const x = `
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .

<http://example.org/john>
    a foaf:Person ;
    foaf:name "John Doe" ;
    foaf:age 30 ;
    rdfs:comment "This is John Doe's profile." .
`;
