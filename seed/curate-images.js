const fs = require('fs');
const path = require('path');

// Curated pool of verified, high-resolution 200 OK Unsplash images of India
const curatedImagePool = {
  // Heritage / Palaces / Forts / Monuments
  tajMahal: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&auto=format&fit=crop&q=80',
  tajMahal2: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&auto=format&fit=crop&q=80',
  jaipurAmber: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&auto=format&fit=crop&q=80',
  hawaMahal: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&auto=format&fit=crop&q=80',
  redFort: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?w=1200&auto=format&fit=crop&q=80',
  delhiQutub: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&auto=format&fit=crop&q=80',
  mumbaiGateway: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=80',
  mumbaiCity: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1200&auto=format&fit=crop&q=80',
  hampiRuins: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&auto=format&fit=crop&q=80',
  rockCaves: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1200&auto=format&fit=crop&q=80',
  
  // Spiritual / Temples / Ghats
  goldenTemple: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80',
  varanasiGhats: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&auto=format&fit=crop&q=80',
  southTemple: 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?w=1200&auto=format&fit=crop&q=80',
  ancientTemple: 'https://images.unsplash.com/photo-1627916607164-7b20241db935?w=1200&auto=format&fit=crop&q=80',
  
  // Beaches / Coast / Islands
  tropicalBeach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
  goaCoast: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&auto=format&fit=crop&q=80',
  andamanLagoon: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200&auto=format&fit=crop&q=80',
  frenchColonial: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80',
  
  // Nature / Hills / Waterfalls / Backwaters
  munnarHills: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&auto=format&fit=crop&q=80',
  keralaBackwaters: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&auto=format&fit=crop&q=80',
  wildlifeTiger: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=1200&auto=format&fit=crop&q=80',
  greenValley: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=1200&auto=format&fit=crop&q=80',
  forestLandscape: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
  
  // Adventure / Himalayas / Desert
  ladakhMountains: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1200&auto=format&fit=crop&q=80',
  himalayasRishikesh: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80',
  dalLakeSrinagar: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=1200&auto=format&fit=crop&q=80',
  tharDesert: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&auto=format&fit=crop&q=80',
};

// Map each of the 56 places specifically to their most appropriate photo
const placeImageMap = {
  'sri-venkateswara-swamy-temple': [curatedImagePool.southTemple, curatedImagePool.ancientTemple],
  'borra-caves': [curatedImagePool.rockCaves, curatedImagePool.forestLandscape],
  'tawang-monastery': [curatedImagePool.ladakhMountains, curatedImagePool.himalayasRishikesh],
  'kaziranga-national-park': [curatedImagePool.wildlifeTiger, curatedImagePool.greenValley],
  'kamakhya-temple': [curatedImagePool.ancientTemple, curatedImagePool.varanasiGhats],
  'mahabodhi-temple-complex': [curatedImagePool.ancientTemple, curatedImagePool.southTemple],
  'nalanda-mahavihara-ruins': [curatedImagePool.rockCaves, curatedImagePool.hampiRuins],
  'chitrakote-waterfalls': [curatedImagePool.forestLandscape, curatedImagePool.keralaBackwaters],
  'basilica-of-bom-jesus': [curatedImagePool.goaCoast, curatedImagePool.tropicalBeach],
  'palolem-beach': [curatedImagePool.tropicalBeach, curatedImagePool.goaCoast],
  'white-rann-of-kutch': [curatedImagePool.tharDesert, curatedImagePool.ladakhMountains],
  'gir-national-park': [curatedImagePool.wildlifeTiger, curatedImagePool.forestLandscape],
  'brahma-sarovar': [curatedImagePool.goldenTemple, curatedImagePool.varanasiGhats],
  'hadimba-temple': [curatedImagePool.himalayasRishikesh, curatedImagePool.greenValley],
  'rohtang-pass': [curatedImagePool.ladakhMountains, curatedImagePool.himalayasRishikesh],
  'hundru-falls': [curatedImagePool.forestLandscape, curatedImagePool.greenValley],
  'monuments-at-hampi': [curatedImagePool.hampiRuins, curatedImagePool.rockCaves],
  'mysore-palace': [curatedImagePool.hawaMahal, curatedImagePool.jaipurAmber],
  'alleppey-backwaters': [curatedImagePool.keralaBackwaters, curatedImagePool.munnarHills],
  'eravikulam-national-park': [curatedImagePool.munnarHills, curatedImagePool.greenValley],
  'khajuraho-monuments': [curatedImagePool.rockCaves, curatedImagePool.ancientTemple],
  'gwalior-fort': [curatedImagePool.jaipurAmber, curatedImagePool.redFort],
  'ajanta-caves': [curatedImagePool.rockCaves, curatedImagePool.hampiRuins],
  'gateway-of-india': [curatedImagePool.mumbaiGateway, curatedImagePool.mumbaiCity],
  'loktak-lake-keibul-lamjao': [curatedImagePool.keralaBackwaters, curatedImagePool.dalLakeSrinagar],
  'cherrapunji-living-root-bridges': [curatedImagePool.greenValley, curatedImagePool.forestLandscape],
  'dampa-tiger-reserve': [curatedImagePool.wildlifeTiger, curatedImagePool.forestLandscape],
  'dzukou-valley': [curatedImagePool.greenValley, curatedImagePool.himalayasRishikesh],
  'konark-sun-temple': [curatedImagePool.ancientTemple, curatedImagePool.rockCaves],
  'jagannath-temple-puri': [curatedImagePool.southTemple, curatedImagePool.ancientTemple],
  'golden-temple-amritsar': [curatedImagePool.goldenTemple, curatedImagePool.varanasiGhats],
  'amber-palace-jaipur': [curatedImagePool.jaipurAmber, curatedImagePool.hawaMahal],
  'jaisalmer-fort': [curatedImagePool.tharDesert, curatedImagePool.jaipurAmber],
  'tsomgo-lake-sikkim': [curatedImagePool.ladakhMountains, curatedImagePool.dalLakeSrinagar],
  'monuments-at-mahabalipuram': [curatedImagePool.ancientTemple, curatedImagePool.tropicalBeach],
  'meenakshi-amman-temple': [curatedImagePool.southTemple, curatedImagePool.ancientTemple],
  'golconda-fort-hyderabad': [curatedImagePool.redFort, curatedImagePool.hampiRuins],
  'neermahal-palace-tripura': [curatedImagePool.keralaBackwaters, curatedImagePool.hawaMahal],
  'taj-mahal-agra': [curatedImagePool.tajMahal, curatedImagePool.tajMahal2],
  'varanasi-ghats-kashi-vishwanath': [curatedImagePool.varanasiGhats, curatedImagePool.goldenTemple],
  'valley-of-flowers-national-park': [curatedImagePool.greenValley, curatedImagePool.himalayasRishikesh],
  'rishikesh-yoga-adventure-hub': [curatedImagePool.himalayasRishikesh, curatedImagePool.varanasiGhats],
  'sundarbans-national-park': [curatedImagePool.wildlifeTiger, curatedImagePool.keralaBackwaters],
  'darjeeling-himalayan-railway': [curatedImagePool.munnarHills, curatedImagePool.himalayasRishikesh],
  'qutub-minar-delhi': [curatedImagePool.delhiQutub, curatedImagePool.redFort],
  'red-fort-delhi': [curatedImagePool.redFort, curatedImagePool.delhiQutub],
  'dal-lake-srinagar': [curatedImagePool.dalLakeSrinagar, curatedImagePool.ladakhMountains],
  'gulmarg-gondola': [curatedImagePool.ladakhMountains, curatedImagePool.himalayasRishikesh],
  'pangong-tso-lake': [curatedImagePool.ladakhMountains, curatedImagePool.dalLakeSrinagar],
  'nubra-valley-hunder': [curatedImagePool.tharDesert, curatedImagePool.ladakhMountains],
  'cellular-jail-port-blair': [curatedImagePool.andamanLagoon, curatedImagePool.tropicalBeach],
  'radhanagar-beach-havelock': [curatedImagePool.tropicalBeach, curatedImagePool.andamanLagoon],
  'rock-garden-chandigarh': [curatedImagePool.hampiRuins, curatedImagePool.rockCaves],
  'diu-fort-and-naida-caves': [curatedImagePool.goaCoast, curatedImagePool.rockCaves],
  'agatti-island-coral-atoll': [curatedImagePool.andamanLagoon, curatedImagePool.tropicalBeach],
  'french-quarter-auroville-puducherry': [curatedImagePool.tropicalBeach, curatedImagePool.goaCoast],
};

// Map each state to its banner image
const stateImageMap = {
  'andhra-pradesh': curatedImagePool.southTemple,
  'arunachal-pradesh': curatedImagePool.ladakhMountains,
  'assam': curatedImagePool.wildlifeTiger,
  'bihar': curatedImagePool.ancientTemple,
  'chhattisgarh': curatedImagePool.forestLandscape,
  'goa': curatedImagePool.goaCoast,
  'gujarat': curatedImagePool.tharDesert,
  'haryana': curatedImagePool.goldenTemple,
  'himachal-pradesh': curatedImagePool.himalayasRishikesh,
  'jharkhand': curatedImagePool.forestLandscape,
  'karnataka': curatedImagePool.hampiRuins,
  'kerala': curatedImagePool.munnarHills,
  'madhya-pradesh': curatedImagePool.rockCaves,
  'maharashtra': curatedImagePool.mumbaiGateway,
  'manipur': curatedImagePool.keralaBackwaters,
  'meghalaya': curatedImagePool.greenValley,
  'mizoram': curatedImagePool.greenValley,
  'nagaland': curatedImagePool.himalayasRishikesh,
  'odisha': curatedImagePool.ancientTemple,
  'punjab': curatedImagePool.goldenTemple,
  'rajasthan': curatedImagePool.jaipurAmber,
  'sikkim': curatedImagePool.ladakhMountains,
  'tamil-nadu': curatedImagePool.southTemple,
  'telangana': curatedImagePool.redFort,
  'tripura': curatedImagePool.keralaBackwaters,
  'uttar-pradesh': curatedImagePool.tajMahal,
  'uttarakhand': curatedImagePool.himalayasRishikesh,
  'west-bengal': curatedImagePool.munnarHills,
  'andaman-and-nicobar-islands': curatedImagePool.andamanLagoon,
  'chandigarh': curatedImagePool.hampiRuins,
  'dadra-and-nagar-haveli-and-daman-and-diu': curatedImagePool.goaCoast,
  'delhi': curatedImagePool.delhiQutub,
  'jammu-and-kashmir': curatedImagePool.dalLakeSrinagar,
  'ladakh': curatedImagePool.ladakhMountains,
  'lakshadweep': curatedImagePool.tropicalBeach,
  'puducherry': curatedImagePool.tropicalBeach,
};

async function main() {
  console.log('🔄 Updating Seed Data with Verified Unsplash Images...');

  // 1. Update place-images.json
  const placeImagesPath = path.join(__dirname, 'data', 'place-images.json');
  const placeImages = JSON.parse(fs.readFileSync(placeImagesPath, 'utf8'));

  for (const img of placeImages) {
    const pair = placeImageMap[img.placeSlug];
    if (pair) {
      img.url = img.isCover ? pair[0] : (pair[1] || pair[0]);
    } else {
      img.url = curatedImagePool.tajMahal;
    }
  }
  fs.writeFileSync(placeImagesPath, JSON.stringify(placeImages, null, 2), 'utf8');
  console.log(`✅ Updated ${placeImages.length} place image URLs.`);

  // 2. Update states.json
  const statesPath = path.join(__dirname, 'data', 'states.json');
  const states = JSON.parse(fs.readFileSync(statesPath, 'utf8'));
  for (const s of states) {
    if (stateImageMap[s.slug]) {
      s.bannerImage = stateImageMap[s.slug];
    } else {
      s.bannerImage = curatedImagePool.tajMahal;
    }
  }
  fs.writeFileSync(statesPath, JSON.stringify(states, null, 2), 'utf8');
  console.log(`✅ Updated ${states.length} state banner image URLs.`);

  console.log('\n🎉 Finished updating image files.');
}

main().catch(console.error);
