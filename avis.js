/* global Chart */ //on indique que "Chart" est une variable globale
//**AFFICHER LES AVIS */
//on ajoute le mot cle export , pour qu'elle soit dispoibible à l'exterieur du fichier
export function ajoutListenersAvis() {
  const piecesElements = document.querySelectorAll(".fiches article button");

  for (let i = 0; i < piecesElements.length; i++) {
    //on ajoute un bouton a chaque fiche article
    piecesElements[i].addEventListener("click", async function (event) {
      /*
        nous récupérons l’identifiant de la pièce automobile pour laquelle l’utilisateur a cliqué sur le bouton “Afficher les avis”. 
        Nous récupérons la valeur de l’attribut data-id grâce à la propriété “dataset.id”. Nous utilisons ensuite cet identifiant pour 
        construire le chemin de la ressource sur laquelle créer la requête HTTP avec la fonction fetch
      */
      const id = event.target.dataset.id;
      //const reponse = await fetch(`http://localhost:8081/pieces/${id}/avis`); //on recupere l'avis
      const reponse = await fetch(
        "http://localhost:8081/pieces/" + id + "/avis"
      );
      const avis = await reponse.json(); //Deserialisation (conversion string -> object)
      window.localStorage.setItem(`avis-piece-${id}`, JSON.stringify(avis));
      const pieceElement = event.target.parentElement;

      afficherAvis(pieceElement, avis);
      /*       const avisElement = document.createElement("p");
      for (let i = 0; i < avis.length; i++) {
        avisElement.innerHTML += `<b>${avis[i].utilisateur}:</b> ${avis[i].commentaire} <b>Etoile:</b> ${avis[i].nbEtoiles} <br>`;
      }
      pieceElement.appendChild(avisElement); */
    });
  }
}

export function afficherAvis(pieceElement, avis) {
  const avisElement = document.createElement("p");
  for (let i = 0; i < avis.length; i++) {
    avisElement.innerHTML += `<b>${avis[i].utilisateur}:</b> ${avis[i].commentaire} <b>Etoile:</b> ${avis[i].nbEtoiles} <br>  `;
  }
  pieceElement.appendChild(avisElement);
}

/**
 * L’attribut data-id que nous avons utilisé sur la balise button n’est pas spécifique aux identifiants. En réalité, nous pouvons créer n’importe quelle balise data-xxx et récupérer sa valeur en JavaScript avec dataset.xxx. Pour plus d’informations, n’hésitez pas à consulter cette page sur le site MDN.
 * https://developer.mozilla.org/fr/docs/Web/HTML/Global_attributes/data-*
 *
 * */

//**ENVOYER DES AVIS */
export function ajoutListenerEnvoyerAvis() {
  const formulaireAvis = document.querySelector(".formulaire-avis");

  formulaireAvis.addEventListener("submit", function (event) {
    //Lorsqu’un formulaire est validé, le comportement normal du navigateur est de changer l’URL de l’onglet et d’initier le chargement d’une nouvelle page. Dans notre cas, nous ne souhaitons pas conserver ce comportement, car nous allons gérer nous-mêmes la communication avec le serveur grâce à la fonction fetch
    // Désactivation du comportement par défaut du navigateur
    event.preventDefault();

    // Création de l’objet du nouvel avis, reprenant les valeurs des balises input du formulaire
    const avis = {
      pieceId: parseInt(event.target.querySelector("[name=piece-id]").value),
      utilisateur: event.target.querySelector("[name=utilisateur").value,
      commentaire: event.target.querySelector("[name=commentaire]").value,
      nbEtoiles: parseInt(event.target.querySelector("[name=nbEtoiles]").value),
    };

    // Création de la charge utile converti au format JSON, pour être transmis dans le body de la requête
    const chargeUtile = JSON.stringify(avis);

    // Appel de la fonction fetch avec toutes les informations nécessaires
    fetch("http://localhost:8081/avis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: chargeUtile,
    });
  });
}

//**Afficher le nombre d'etoile sous forme de grapph avec le package chart.js */
export async function afficherGraphiqueAvis() {
  //1er affichage on affiche les pieces dispo et nom dispo

  // Calcul du nombre total de commentaires par quantité d'étoiles attribuées
  const avis = await fetch("http://localhost:8081/avis").then((avis) =>
    avis.json()
  );
  const nb_commentaires = [0, 0, 0, 0, 0];
  for (let commentaire of avis) {
    nb_commentaires[commentaire.nbEtoiles - 1]++;
  }
  console.log(nb_commentaires); // renvoi [ 9, 7, 15, 2, 2 ] , soit 9 commentaires a 1 etoile , 7 à 2 etoiles,15 à 3 etoiles...

  // Légende(label) qui s'affichera sur la gauche à côté de la barre horizontale
  const labels = ["5", "4", "3", "2", "1"];

  // Rassemblement de toutes les Données et personnalisation du graphique
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Étoiles attribuées",
        data: nb_commentaires.reverse(), // la liste nb_commentaires présente le nombre de commentaires par ordre croissant d’étoiles (de 1 à 5 étoiles). Nous devons donc inverser l’ordre de la liste, de manière à afficher les données sur le site par ordre décroissant, de 5 à 1 étoiles
        backgroundColor: "rgba(255, 230, 0, 1)", // couleur jaune
      },
    ],
  };

  // Objet de configuration final
  const config = {
    type: "bar",
    data: data,
    options: {
      indexAxis: "y", //les barres sont au format horizontal
    },
  };

  // Rendu du graphique dans l'élément canvas
    new Chart(
    document.querySelector("#graphique-avis"),
    config
  );

  //2 eme affichage on affiche les pieces dispo et nom dispo

  // Récupération des pièces depuis le localStorage
  const piecesJSON = window.localStorage.getItem("pieces");
  //const pieces = piecesJSON ? JSON.parse(piecesJSON) : [];
  const pieces = JSON.parse(piecesJSON);
  // Calcul du nombre de commentaires
  let nbCommentairesDispo = 0;
  let nbCommentairesNonDispo = 0;
  //if(pieces.length > 0){
  for (let i = 0; i < avis.length; i++) {
    //on parcourt la liste des pieces
    const piece = pieces.find((p) => p.id === avis[i].pieceId); //Si on trouve un avis pour la piece

    if (piece) {
      if (piece.disponibilite) {
        nbCommentairesDispo++; //on incremente si 'il y a des avis dans le piece en stock
      } else {
        nbCommentairesNonDispo++; //on incremente si 'il y a des avis dans le piece pas en stock
      }
    }
  }

  // Légende qui s'affichera sur la gauche à côté de la barre horizontale
  const labelsDispo = ["Disponibles", "Non dispo."];

  // Données et personnalisation du graphique
  const dataDispo = {
    labels: labelsDispo,
    datasets: [
      {
        label: "Nombre de commentaires",
        data: [nbCommentairesDispo, nbCommentairesNonDispo],
        backgroundColor: "rgba(0, 230, 255, 1)", // turquoise
      },
    ],
  };

  // Objet de configuration final
  const configDispo = {
    type: "bar",
    data: dataDispo,
  };
  console.log(dataDispo);
  // Rendu du graphique dans l'élément canvas
  new Chart(document.querySelector("#graphique-dispo"), configDispo);
}
