"use strict"
/*
Build all of your functions for displaying and gathering information below (GUI).
*/

// app is the function called to start the entire application
function app(people) {
  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  let searchResults;
  switch (searchType) {
    case 'yes':
      searchResults = searchByName(people);
      break;
    case 'no':
      searchResults = searchByTraits(people);
      break;
    default:
      app(people); // restart app
      break;
  }

  // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
  mainMenu(searchResults, people);
}

// Menu function to call once you find who you are looking for
function mainMenu(person, people) {
  console.log(person);

  /* Here we pass in the entire person object that we found in our search, as well as the 
  entire original dataset of people. We need people in order to find descendants and other 
  information that the user may want. */

  if (!person) {
    alert("Could not find that individual.");
    return app(people); // restart
  }

  let displayOption = prompt("Found " + person.firstName + " " + person.lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'");
  

  switch (displayOption) {
    case "info":
      // TODO: get person's info  
      alert(displayPerson(person));
      break;
    case "family":
      // TODO: get person's family
      alert("Spouse: " + person.currentSpouse + ". ")
      break;
    case "descendants":
      // TODO: get person's descendants
      var descendants = [];
      var allDescendants = new Array();
      descendants = getDescendants(person, people, allDescendants);
      printDescendants(descendants);
      break;
    case "restart":
      app(people); // restart
      break;
    case "quit":
      return; // stop execution
    default:
      return mainMenu(person, people); // ask again
  }
}

function getDescendants(person, people, allDescendants){
  let foundDescendants = people.filter(function (possibleChild) {
    if (possibleChild.parents.includes(person.id)) {
      return true;
    } else {
      return false;
    }
  });
  if(foundDescendants.length > 0){
    for(let i = 0; i < foundDescendants.length; i++){
      allDescendants.push(foundDescendants[i]);
      let temporaryArray = allDescendants;
      allDescendants = getDescendants(foundDescendants[i], people, temporaryArray);
    }
  }
  
  console.log(person.firstName + "completed");
  return allDescendants;
  
}

function printDescendants(descendants){
  let descendantsString = "";
  for (let i = 0; i < descendants.length; i++){
      descendantsString += descendants[i].firstName + descendants[i].lastName + "\n";
    }
    alert(descendantsString);
}


function searchByName(people) {
  let firstName = promptFor("What is the person's first name?", chars);
  let lastName = promptFor("What is the person's last name?", chars);

  let foundPerson = people.filter(function (person) {
    if (person.firstName === firstName && person.lastName === lastName) {
      return true;
    } else {
      return false;
    }
  })
  // TODO: find the person using the name they entered
  return foundPerson[0];
}

function searchByTraits(people, counter) {
  let foundPeople = searchSingleTrait(people);
  displayPeople(foundPeople);
  let continueSearch = promptFor("Do you want to enter another trait? Enter 'yes' or 'no'", yesNo).toLowerCase();
  switch (continueSearch) {
    case 'yes':
      return searchByTraits(foundPeople);
    case 'no':
      if (foundPeople.length == 1) {
        return foundPeople;
      }
      break;
    default:
      alert("Could not refine the search ot just one individual.");
      app(data); // restart app
      break;
  }
}



function searchSingleTrait(people) {
  let traitType = promptFor("Enter EXACTLY what trait to search by(gender, dob, height, weight, eyeColor, occupation): ", chars);
  let trait = promptFor("Enter person's " + traitType + ": ", chars);

  let foundPeople = people.filter(function (person) {
    if (person[traitType] === trait) {
      return true;
    } else {
      return false;
    }
  })

  return foundPeople;
}


// alerts a list of people
function displayPeople(people) {
  alert(people.map(function (person) {
    return person.firstName + " " + person.lastName;
  }).join("\n"));
}

function displayPerson(person) {
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  let personInfo = "First Name: " + person[0].firstName + "\n";
  personInfo += "Last Name: " + person[0].lastName + "\n";
  personInfo += "Gender: " + person[0].gender + "\n";
  personInfo += "DOB: " + person[0].dob + "\n"
  personInfo += "Height: " + person[0].height + "\n"; //convert into height and inches??
  personInfo += "Weight: " + person[0].weight + "\n";
  personInfo += "Eye color: " + person[0].eyeColor + "\n";
  personInfo += "Occupation: " + person[0].occupation + "\n";


  // TODO: finish getting the rest of the information to display

  alert(personInfo);
}

// function that prompts and validates user input
function promptFor(question, valid) {
  do {
    var response = prompt(question).trim();
  } while (!response || !valid(response));
  return response;
}

// helper function to pass into promptFor to validate yes/no answers
function yesNo(input) {
  return input.toLowerCase() == "yes" || input.toLowerCase() == "no";
}

// helper function to pass in as default promptFor validation
function chars(input) {
  return true; // default validation only
}