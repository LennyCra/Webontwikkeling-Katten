// import data from './catsInfo.json';
import * as readline from 'readline';
import { Cat } from './interfaces';
// import { Owner } from './interfaces';


function loadData(): Cat[] {
  return data as Cat[];
}


function viewAllData(cats: Cat[]){
  cats.forEach(cat => {
    console.log(`- ${cat.name} (${cat.id})`);
  });
}


function filterById(cats: Cat[], id: number) {
  const foundCat = cats.find(cat => cat.id === id);

  if (foundCat) {
    console.log(`- ${foundCat.name} (${foundCat.id})`);
    console.log(`  - Beschrijving: ${foundCat.description}`);
    console.log(`  - Leeftijd: ${foundCat.age}`);
    console.log(`  - Active: ${foundCat.activeStatus}`);
    console.log(`  - Verjaardag: ${foundCat.birthDate}`);
    console.log(`  - Foto: ${foundCat.profileImageUrl}`);
    console.log(`  - Soort: ${foundCat.breed}`);
    console.log(`  - Hobbies: ${foundCat.hobbies.join(', ')}`);
    console.log(`  - Eigenaar:`);
    console.log(`    - Naam: ${foundCat.owner.name}`);
    console.log(`    - Email: ${foundCat.owner.email}`);
    console.log(`    - Telefoon: ${foundCat.owner.phone}`);
    console.log(`    - Adres: ${foundCat.owner.address}`);
  } else {
    console.log(`Geen kat gevonden met ID: ${id}`);
  }
}


function showMenu(): void {
  console.log('Wekom bij de katten lijst');
  console.log('1. Bekijk alle katten en hun Id.');
  console.log('2. Filter op Id');
  console.log('3. Exit');
}


async function main() {
  const cats = loadData();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const askQuestion = (question: string) => new Promise<string>(resolve => rl.question(question, resolve));

  while (true) {
    showMenu();
    const choice = await askQuestion('Geef uw keuze in: ');

    if (choice === '1') {
      viewAllData(cats);
    } else if (choice === '2') {
      const id = parseInt(await askQuestion('Geef hier de Id waarop u wilt filteren: '), 10);
      filterById(cats, id);
    } else if (choice === '3') {
      rl.close();
      break;
    } else {
      console.log('Foute keuze, probeer opnieuw.');
    }
  }
}

main();
