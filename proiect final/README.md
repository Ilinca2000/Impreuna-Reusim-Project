    SERVER

- npm install (install all dependencies)
- npm run dev (start the server)

- http://localhost:3000/create -> sync the database
- post a new student (or any instance) -> daca id lipseste din body, se va genera un id unic UUID
- feedback-ul este anonim, asadar nu exista decat ruta de postat feedback fara parametru studentId
- nu avem functie de PUT (update) pentru feedback. nici de DELETE. se pot lasa oricate feedback-uri vrea studentul pentru o activitate anume
- profesorul poate adauga activitati si sa le seteze cheia de acces (unica, maxim 5 cifre).
- studentul va accesa activitatea din frontend prin cheia unica setata de profesor/prin UUID -> se va adauga la enrollment

- testarea aplicatiei se poate face folosind colectia de requesturi din Postman: postman.json si se inlocuiesc id-urile existente din URL cu altele generate dupa caz.
- sistemul de feedback va mai avea imbunatatiri
