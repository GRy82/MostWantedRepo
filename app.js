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
      alert(getFamily(person, people));
      break;
    case "descendants":
      // TODO: get person's descendants
      var descendants = getDescendants(person, people);
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

function findSpouse(person, people = data) {
  let spouseArray = ["Spouse: "]
  for (let i = 0; i < people.length; i++) {
    if (person.currentSpouse === people[i].id) {
      spouseArray.push(people[i]);
      return spouseArray;
    } 
  }
  spouseArray.push("none");
  return spouseArray;
}

function findParents(person, people = data){
  let parentsArray = [];

  let foundParents = people.filter( function (possibleParent){
    if(person.parents.includes(possibleParent.id)){
      return true;
    } else
    {
      return false;
    }
  })
      
  foundParents.unshift("Parent: ");
  return foundParents;
}

function findSiblings(person, people = data){
  var parentsOfPerson = findParents(person, people);
  var parentsIdArray = [];
  var foundChildren;
  let wasteVar = parentsOfPerson.shift();

  if(parentsOfPerson){
    for (let j = 0; j < parentsOfPerson.length; j++){
      parentsIdArray.push(parentsOfPerson[j].id);
    }
      foundChildren = people.filter(function(possibleChild){
        for(let i = 0; i < possibleChild.parents.length; i++){
          if(parentsIdArray.includes(possibleChild.parents[i]) && person.id != possibleChild.id){
            return true;
          }    
        }
        return false;
    })
  }
  
  foundChildren.unshift("Sibling: ");
  return foundChildren;
}

function getFamily(person, people){
  let parents = findParents(person, people);
  let siblings = findSiblings(person, people);
  let spouse = findSpouse(person, people);
  
  let familyArray = [parents, siblings, spouse];
  let familyString = "";

  for(let i = 0; i < familyArray.length; i++){
    for(let j = 1; j < familyArray[i].length; j++){
      familyString += familyArray[i][0] + familyArray[i][j].firstName + " " + familyArray[i][j].lastName + "\n";
    }
    familyString += "\n";
  }

  return familyString;
}


function getDescendants(person, people, allDescendants = []) {
  let foundDescendants = people.filter(function (possibleChild) {
    if (possibleChild.parents.includes(person.id)) {
      return true;
    } else {
      return false;
    }
  });

  if (foundDescendants.length > 0) {
    for (let i = 0; i < foundDescendants.length; i++) {
      allDescendants.push(foundDescendants[i]);
      allDescendants = getDescendants(foundDescendants[i], people, allDescendants);
    }
  }

  console.log(person.firstName + "completed");
  return allDescendants;

}

function printDescendants(descendants) {
  let descendantsString = "";
  for (let i = 0; i < descendants.length; i++) {
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
        return foundPeople[0];
      }
      break;
    default:
      alert("Could not refine the search to just one individual.");
      app(data); // restart app
      break;
  }
  alert("Could not refine the search to just one individual.");
  app(data); // restart app
}





function searchSingleTrait(people) {
  var traitType = promptFor("Enter EXACTLY what trait to search by(gender, age, height, weight, eyeColor, occupation): ", traitTypeValidation);
  let trait = promptFor("Enter person's " + traitType + ": ", chars);

  if (traitType == "age") {
    var foundPeople = filterByAge(trait, people);
  // if (traitTye == "height") {
  //   var foundPeople = convertToAge(trait, people);
    } else {
      var foundPeople = people.filter(function (person) {
        if (person[traitType] === trait) {
          return true;
        } else {
          return false;
        }
      })
    }

    return foundPeople;
  }


  function filterByAge(age, people) {
    let foundPeople = people.filter(function (person) {
      if (convertToAge(person["dob"]) == age) {
        return true;
      } else {
        return false;
      }
    })

    return foundPeople;
  }

  function convertToAge(dob) {
    const currentDate = new Date();
    let dobDate = dob.split("/");
    let age = currentDate.getFullYear() - dobDate[2];
    let currentMonth = currentDate.getMonth();
    let currentDay = currentDate.getDay();
    if (dobDate[0] > currentMonth || (dobDate[0] == currentMonth && dobDate[1] < currentDay)) {
      age -= 1;
    }
    return age;
  }

  function convertToFeetAndInces(person) {
    let height = person.height;
    let feet = Math.floor(height / 12);
    let inches = (height - (feet * 12));
    return feet + " ft " + inches + " inches";
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
    let personInfo = "First Name: " + person.firstName + "\n";
    personInfo += "Last Name: " + person.lastName + "\n";
    personInfo += "Gender: " + person.gender + "\n";
    personInfo += "DOB: " + person.dob + "\n"
    personInfo += "Age: " + convertToAge(person.dob) + "\n"
    personInfo += "Height: " + convertToFeetAndInces(person)+ "\n"; //convert into height and inches??
    personInfo += "Weight: " + person.weight + "\n";
    personInfo += "Eye color: " + person.eyeColor + "\n";
    personInfo += "Occupation: " + person.occupation + "\n";


    // TODO: finish getting the rest of the information to display

    return(personInfo);
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

  function traitTypeValidation(input){
    let traitTypeArray = ["gender", "height", "weight", "eyeColor", "occupation", "age"];
    if (traitTypeArray.includes(input)){
      return true;
    }
  }