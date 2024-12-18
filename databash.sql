use sys;
CREATE TABLE synonyms (
    synonym CHAR(20) NOT NULL,
    altsynonyms CHAR(20) NOT NULL,
    techword CHAR(20) NOT NULL,
    PRIMARY KEY (synonym, altsynonyms, techword)
);
select * from synonyms; 