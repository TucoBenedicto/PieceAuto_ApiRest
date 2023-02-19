/*Cette syntaxe moderne de JavaScript permet d’importer des variables et des fonctions dans nos fichiers sans rajouter d’autres balises script dans notre HTML.*/

import {
  ajoutListenersAvis,
  ajoutListenerEnvoyerAvis,
  afficherAvis,
  afficherGraphiqueAvis,
} from "./avis.js"; //Ajout de la fonction "ajoutListenersAvis" dans le fichier avis.js

// ** Utilisation du local storage (cas d'une coupure de reseau) */
// Récupération des pièces éventuellement stockées dans le localStorage , Elle ne prend qu’un argument : la clé (une chaîne de caractères).
let pieces = window.localStorage.getItem("pieces");

if (pieces === null) {
  //Si le localStorage est vide , on recupere les infos depuis l'API HTTP
  // Récupération des pièces depuis l'API
  const reponse = await fetch("http://localhost:8081/pieces/");
  pieces = await reponse.json();
  // Transformation des pièces en JSON
  const valeurPieces = JSON.stringify(pieces);
  // Stockage des informations dans le localStorage. Elle prend deux arguments :la clé : une chaîne de caractères ;la valeur à enregistrer : une chaîne de caractères.
  window.localStorage.setItem("pieces", valeurPieces);
} else {
  // Sinon si il y a des données dans le localStorage on deserialise les données
  pieces = JSON.parse(pieces);
}

// **Récupération des pièces depuis le fichier JSON*/
//const reponse = await fetch("pieces-autos.json"); //En local
//const pieces = await fetch("http://localhost:8081/pieces").then(pieces => pieces.jon());//Ancienne notation "Promise" qui regroupe les 2 lignes ci-dessous
const reponse = await fetch("http://localhost:8081/pieces"); //avec un serveur
pieces = await reponse.json();

// ** Utilisation du local storage*/
// Transformation des pièces en JSON
//const valeurPieces = JSON.stringify(pieces);
// Stockage des informations dans le localStorage
//window.localStorage.setItem("pieces", valeurPieces);

// on appelle la fonction pour ajouter le listener au formulaire
ajoutListenerEnvoyerAvis();

function genererPieces(pieces) {
  for (let i = 0; i < pieces.length; i++) {
    const article = pieces[i]; //on passe en revu tous les tableaux json avec l'index i

    // Récupération de l'élément du DOM qui accueillera les fiches
    const sectionFiches = document.querySelector(".fiches"); //on recuper la class ".fiches" du DOM avec "document.querySelector"

    //**Creation des balises html avec "document.createElement"*/

    // Création d’une balise dédiée à une pièce automobile , qui contiendra les elements de chaque piece
    const pieceElement = document.createElement("article");
    pieceElement.dataset.id = pieces[i].id;

    const imageElement = document.createElement("img");
    imageElement.src = article.image; //on ajoute le lien (article.image) à la propriété "src" de l'objet "imageElement" (balise img)
    console.log(imageElement.src);

    const nomElement = document.createElement("h2");
    nomElement.innerText = article.nom; //on ajoute le texte (article.nom) à la propriété "innerText" de l'objet "nomElement" (balise h2)
    console.log(nomElement);

    const prixElement = document.createElement("p");
    //littéraux de gabarit (ou template strings, en anglais). Ces derniers permettent de concaténer plus facilement des chaînes de caractères et des variables. Ils commencent et se terminent toujours par des backticks ` et sont composés de variables ou expressions JavaScript sous la forme ${monExpressionJS}.
    prixElement.innerText = `Prix: ${article.prix} € (${
      article.prix < 35 ? "€" : "€€€"
    })`; //Ternaire(si le prix est < à 35€ on ajoute €, si > on ajoute €€€)

    const categorieElement = document.createElement("p");
    //"??" operateur nullish, Ça peut arriver quand, concrètement ?Eh bien, quand une valeur est null, et donc qu’elle n’a pas de valeur, ou bien lorsqu’elle est undefined, et donc qu’elle n’est pas définie. Dans notre cas, la pièce automobile “Balai d’essuie-glace” n’appartient à aucune catégorie. On aimerait le préciser entre parenthèses lorsque c’est le cas.
    categorieElement.innerText = article.categorie ?? "(aucune categorie)"; // il s’utilise lorsque vous pensez avoir une information dans une variable mais que finalement, il n’y en a pas.

    const descriptionElement = document.createElement("p");
    //"??" operateur nullish, Ça peut arriver quand, concrètement ?Eh bien, quand une valeur est null, et donc qu’elle n’a pas de valeur, ou bien lorsqu’elle est undefined, et donc qu’elle n’est pas définie. Dans notre cas, la pièce automobile “Balai d’essuie-glace” n’appartient à aucune catégorie. On aimerait le préciser entre parenthèses lorsque c’est le cas.
    descriptionElement.innerText =
      article.description ?? "Pas de description pour le moment."; // il s’utilise lorsque vous pensez avoir une information dans une variable mais que finalement, il n’y en a pas.

    const stockElement = document.createElement("p");
    //"??" operateur nullish, Ça peut arriver quand, concrètement ?Eh bien, quand une valeur est null, et donc qu’elle n’a pas de valeur, ou bien lorsqu’elle est undefined, et donc qu’elle n’est pas définie. Dans notre cas, la pièce automobile “Balai d’essuie-glace” n’appartient à aucune catégorie. On aimerait le préciser entre parenthèses lorsque c’est le cas.
    stockElement.innerText = article.disponibilite
      ? "En stock"
      : "Rupture de stock"; // il s’utilise lorsque vous pensez avoir une information dans une variable mais que finalement, il n’y en a pas.

    //Bouton pour chaque fiche
    const avisBouton = document.createElement("button");
    avisBouton.dataset.id = article.id;
    avisBouton.textContent = "Afficher les avis";

    //**Rattachement de nos balises au DOM (avec appendChild) à la class parent ".fiches"*/

    // On rattache la balise article à la section Fiches
    sectionFiches.appendChild(pieceElement);
    // On rattache l’image à pieceElement (la balise article)
    pieceElement.appendChild(imageElement);
    pieceElement.appendChild(nomElement);
    pieceElement.appendChild(prixElement);
    pieceElement.appendChild(categorieElement);
    //Ajout des elements au DOM pour l'exercice
    pieceElement.appendChild(descriptionElement);
    pieceElement.appendChild(stockElement);

    pieceElement.appendChild(avisBouton);
  }
  ajoutListenersAvis();
}

genererPieces(pieces); //On affiche les pieces

for (let i = 0; i < pieces.length; i++) {
  const id = pieces[i].id;
  const avisJSON = window.localStorage.getItem(`avis-piece-${id}`);
  const avis = JSON.parse(avisJSON);

  if (avis !== null) {
    const pieceElement = document.querySelector(`article[data-id="${id}"]`);
    afficherAvis(pieceElement, avis);
  }
}

//** Gestion des boutons + Filtre & Trie */

//Trie par prix croissant ,grace à la methode "sort" , Explication plus bas
const boutonTrier = document.querySelector(".btn-trier");
boutonTrier.addEventListener("click", function () {
  const piecesOrdonnees = Array.from(pieces);
  piecesOrdonnees.sort(function (a, b) {
    return a.prix - b.prix;
  });
  document.querySelector(".fiches").innerHTML = ""; //on efface le body
  genererPieces(piecesOrdonnees);
  console.log(piecesOrdonnees);
});

//Filtrer les pièces non abordables” pour n’afficher que les pièces dont le prix est inférieur ou égal à 35 €.
const boutonFiltrer = document.querySelector(".btn-filtrer");
boutonFiltrer.addEventListener("click", function () {
  const piecesFiltrees = pieces.filter(function (piece) {
    return piece.prix <= 35;
  });
  document.querySelector(".fiches").innerHTML = ""; //on efface le body
  genererPieces(piecesFiltrees); //on appel la fonction qui va afficher les pieces < à 35€
  console.log(piecesFiltrees);
});

//Correction Exercice
const boutonDecroissant = document.querySelector(".btn-decroissant");

boutonDecroissant.addEventListener("click", function () {
  const piecesOrdonnees = Array.from(pieces);
  piecesOrdonnees.sort(function (a, b) {
    return b.prix - a.prix;
  });
  document.querySelector(".fiches").innerHTML = ""; //on efface le body
  genererPieces(piecesOrdonnees); //on appel la fonction qui va afficher et ordonnée l'ordre des pieces.
});

const boutonNoDescription = document.querySelector(".btn-nodesc");

boutonNoDescription.addEventListener("click", function () {
  const piecesFiltrees = pieces.filter(function (piece) {
    return piece.description;
  });
  document.querySelector(".fiches").innerHTML = ""; //on efface le body
  genererPieces(piecesFiltrees); //on appel la fonction qui va afficher la description des pieces
});

//** Affichez la liste des pièces abordables */

//on recupere la liste (d'objet) des pieces avec la methode map et on retourne le nom de toutes les pièces.
//fonction lambda dans les parametre de la methode "map", qui retourne la valeur de la proprieté nom de l'objet pieces
const noms = pieces.map((piece) => piece.nom); //!!!la methode map n'a rien avoir avec l'objet Map!!!
//on retire le prix des pieces pas abordable
//on commence cette boucle sur le dernier index du tableau (pieces.length-1) et on decremente
for (let i = pieces.length - 1; i >= 0; i--) {
  //Si le prix de la piece est > a 35€ on le supprime le la liste avec "splice"
  if (pieces[i].prix > 35) {
    noms.splice(i, 1); //on suprime l'element avec l'index "i" 1 fois;
  }
}

console.log(noms);
//Création de l'en-tête

const pElement = document.createElement("p");
pElement.innerText = "Pièces abordables";

//Creation de la balise html liste (ul)
const abordablesElements = document.createElement("ul");
//Ajout de chaque nom à la liste
for (let i = 0; i < noms.length; i++) {
  const nomElement = document.createElement("li"); //on creer la puce
  nomElement.innerText = noms[i]; //on recuper les noms de piece , que l'on ajouite à la balise li
  abordablesElements.appendChild(nomElement); //on ajoute l'ensble a la balise parent (ul)
}

//Ajout de l'en-tete puis de la list au bloc resultats filtres
//document.querySelector(".abordables").appendChild(abordablesElements);
document
  .querySelector(".abordables")
  .appendChild(pElement)
  .appendChild(abordablesElements);

//** Affichez la liste des pièces disponibles */

//on recuper la liste des nom de pieces et des prix, grace à map.
const nomsDisponibles = pieces.map((piece) => piece.nom);
const prixDisponibles = pieces.map((piece) => piece.prix);

for (let i = pieces.length - 1; i >= 0; i--) {
  if (pieces[i].disponibilite === false) {
    nomsDisponibles.splice(i, 1);
    prixDisponibles.splice(i, 1);
  }
}

const disponiblesElement = document.createElement("ul");
for (let i = 0; i < nomsDisponibles.length; i++) {
  const nomElement = document.createElement("li");
  nomElement.innerText = `${nomsDisponibles[i]} - ${prixDisponibles[i]} €`;
  disponiblesElement.appendChild(nomElement);
}

const pElementDisponible = document.createElement("p");
pElementDisponible.innerText = "Pièces disponibles:";
document
  .querySelector(".disponibles")
  .appendChild(pElementDisponible)
  .appendChild(disponiblesElement);

const inputPrixMax = document.querySelector("#prix-max"); //on recupere l'id de la balise input
inputPrixMax.addEventListener("input", function () {
  const piecesFiltrees = pieces.filter(function (piece) {
    return piece.prix <= inputPrixMax.value;
  });
  document.querySelector(".fiches").innerHTML = ""; //on efface le body
  genererPieces(piecesFiltrees); //on appel la fonction qui va afficher les pices filtrer par prix grace à la balise Input
});

//**Local Stroage */
// Ajout du listener pour mettre à jour des données du localStorage
const boutonMettreAJour = document.querySelector(".btn-maj");
boutonMettreAJour.addEventListener("click", function () {
  window.localStorage.removeItem("pieces"); //La fonction removeItem permet de retirer une valeur depuis le localStorage. Elle ne prend, qu’un argument : la clé (une chaîne de caractères).
});

await afficherGraphiqueAvis();

//**Explication */

//Methode sort

/*
La fonction sort s’attend à recevoir un nombre de la part de la fonction anonyme. Le signe de ce nombre (positif, négatif ou nul) sert à indiquer dans quel ordre ranger les deux éléments :
si le nombre est négatif, alors A sera rangé avant B ; 
si le nombre est positif, alors B sera rangé avant A ;
si le nombre est zéro (0), alors l’ordre sera inchangé.

Heuu… Tu n’aurais pas un exemple à nous donner ? 😅
Bien sûr ! Prenons l’exemple de l’ampoule LED qui vaut 60 € (élément A), 
et du liquide de frein qui vaut 9,60 € (élément B). 
Nous souhaitons ranger le liquide de frein (B) avant l’ampoule LED (A) 
car c’est le moins cher des deux. La fonction anonyme devra donc retourner 
une valeur négative. En soustrayant les prix des deux pièces avec le 
calcul B - A, on obtient 9,60 - 60 = -50,40. La fonction sort comprendra 
donc qu’il faut ranger le liquide de frein avant l’ampoule LED.
*/

//Methode filter

/*
Pour filtrer les éléments d’une liste, nous allons utiliser la fonction 
filter. Elle prend en argument une fonction anonyme qui sera appelée une 
fois par élément de la liste. La fonction anonyme prend un paramètre : 
l’élément à tester, qui se trouvera ou non dans la liste filtrée.

fonction anonyme doit retourner une valeur booléenne :
true si l’élément doit se trouver dans la liste filtrée ;
false si l’élément ne doit pas se trouver dans la liste filtrée.

Lorsque ce code s’exécute, la constante piecesFiltrees contient une 
nouvelle liste avec uniquement les pièces disponibles, à savoir : 
l’ampoule LED, les plaquettes de frein et le liquide de frein.
*/

//Interet du local storage

/*
Pour l’instant, tout cela fonctionne tant que votre navigateur est connecté à internet. 
Mais dans certaines situations, vous pouvez perdre cet accès à internet. Notamment, 
lorsque vous ne disposez pas d’une connexion stable.
Dans ce chapitre, nous allons découvrir comment garder notre page web interactive même 
lorsque vous n’êtes pas connecté à internet. Tout cela, grâce au localStorage. C’est parti 

Utilisez le localStorage pour optimiser les performances de votre application :
pour avoir toujours des données disponibles à afficher en cas de connexion intermittente ou instable ;
pour sauvegarder les réponses des requêtes à l’API, et ainsi éviter de les demander en boucle.
*/
