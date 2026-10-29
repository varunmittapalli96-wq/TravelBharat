const fs = require('fs');
const path = require('path');

const placesDir = path.join(__dirname, '..', 'apps', 'web', 'public', 'images', 'places');
const statesDir = path.join(__dirname, '..', 'apps', 'web', 'public', 'images', 'states');
fs.mkdirSync(placesDir, { recursive: true });
fs.mkdirSync(statesDir, { recursive: true });

const placeWikiMap = {
  'sri-venkateswara-swamy-temple': 'Venkateswara_Temple,_Tirumala',
  'borra-caves': 'Borra_Caves',
  'tawang-monastery': 'Tawang_Monastery',
  'kaziranga-national-park': 'Kaziranga_National_Park',
  'kamakhya-temple': 'Kamakhya_Temple',
  'mahabodhi-temple-complex': 'Mahabodhi_Temple',
  'nalanda-mahavihara-ruins': 'Nalanda_mahavihara',
  'chitrakote-waterfalls': 'Chitrakote_Falls',
  'basilica-of-bom-jesus': 'Basilica_of_Bom_Jesus',
  'palolem-beach': 'Palolem_Beach',
  'white-rann-of-kutch': 'Rann_of_Kutch',
  'gir-national-park': 'Gir_National_Park',
  'brahma-sarovar': 'Brahma_Sarovar',
  'hadimba-temple': 'Hidimba_Devi_Temple',
  'rohtang-pass': 'Rohtang_Pass',
  'hundru-falls': 'Hundru_Falls',
  'monuments-at-hampi': 'Hampi',
  'mysore-palace': 'Mysore_Palace',
  'alleppey-backwaters': 'Alappuzha',
  'eravikulam-national-park': 'Eravikulam_National_Park',
  'khajuraho-monuments': 'Khajuraho_Group_of_Monuments',
  'gwalior-fort': 'Gwalior_Fort',
  'ajanta-caves': 'Ajanta_Caves',
  'gateway-of-india': 'Gateway_of_India',
  'loktak-lake-keibul-lamjao': 'Loktak_Lake',
  'cherrapunji-living-root-bridges': 'Living_root_bridge',
  'dampa-tiger-reserve': 'Dampa_Tiger_Reserve',
  'dzukou-valley': 'Dz%C3%BCko_Valley',
  'konark-sun-temple': 'Konark_Sun_Temple',
  'jagannath-temple-puri': 'Jagannath_Temple,_Puri',
  'golden-temple-amritsar': 'Golden_Temple',
  'amber-palace-jaipur': 'Amer_Fort',
  'jaisalmer-fort': 'Jaisalmer_Fort',
  'tsomgo-lake-sikkim': 'Lake_Tsomgo',
  'monuments-at-mahabalipuram': 'Shore_Temple',
  'meenakshi-amman-temple': 'Meenakshi_Temple',
  'golconda-fort-hyderabad': 'Golconda_Fort',
  'neermahal-palace-tripura': 'Neermahal',
  'taj-mahal-agra': 'Taj_Mahal',
  'varanasi-ghats-kashi-vishwanath': 'Ghats_in_Varanasi',
  'valley-of-flowers-national-park': 'Valley_of_Flowers_National_Park',
  'rishikesh-yoga-adventure-hub': 'Rishikesh',
  'sundarbans-national-park': 'Sundarbans_National_Park',
  'darjeeling-himalayan-railway': 'Darjeeling_Himalayan_Railway',
  'qutub-minar-delhi': 'Qutb_Minar',
  'red-fort-delhi': 'Red_Fort',
  'dal-lake-srinagar': 'Dal_Lake',
  'gulmarg-gondola': 'Gulmarg',
  'pangong-tso-lake': 'Pangong_Tso',
  'nubra-valley-hunder': 'Nubra_Valley',
  'cellular-jail-port-blair': 'Cellular_Jail',
  'radhanagar-beach-havelock': 'Havelock_Island',
  'rock-garden-chandigarh': 'Rock_Garden_of_Chandigarh',
  'diu-fort-and-naida-caves': 'Diu_Fort',
  'agatti-island-coral-atoll': 'Agatti_Island',
  'french-quarter-auroville-puducherry': 'Matrimandir'
};

const stateLandmarkMap = {
  'andhra-pradesh': 'sri-venkateswara-swamy-temple',
  'arunachal-pradesh': 'tawang-monastery',
  'assam': 'kaziranga-national-park',
  'bihar': 'mahabodhi-temple-complex',
  'chhattisgarh': 'chitrakote-waterfalls',
  'goa': 'palolem-beach',
  'gujarat': 'white-rann-of-kutch',
  'haryana': 'brahma-sarovar',
  'himachal-pradesh': 'rohtang-pass',
  'jharkhand': 'hundru-falls',
  'karnataka': 'monuments-at-hampi',
  'kerala': 'alleppey-backwaters',
  'madhya-pradesh': 'khajuraho-monuments',
  'maharashtra': 'gateway-of-india',
  'manipur': 'loktak-lake-keibul-lamjao',
  'meghalaya': 'cherrapunji-living-root-bridges',
  'mizoram': 'dampa-tiger-reserve',
  'nagaland': 'dzukou-valley',
  'odisha': 'konark-sun-temple',
  'punjab': 'golden-temple-amritsar',
  'rajasthan': 'amber-palace-jaipur',
  'sikkim': 'tsomgo-lake-sikkim',
  'tamil-nadu': 'meenakshi-amman-temple',
  'telangana': 'golconda-fort-hyderabad',
  'tripura': 'neermahal-palace-tripura',
  'uttar-pradesh': 'taj-mahal-agra',
  'uttarakhand': 'valley-of-flowers-national-park',
  'west-bengal': 'darjeeling-himalayan-railway',
  'andaman-and-nicobar-islands': 'cellular-jail-port-blair',
  'chandigarh': 'rock-garden-chandigarh',
  'dadra-nagar-haveli-daman-diu': 'diu-fort-and-naida-caves',
  'delhi': 'qutub-minar-delhi',
  'jammu-and-kashmir': 'dal-lake-srinagar',
  'ladakh': 'pangong-tso-lake',
  'lakshadweep': 'agatti-island-coral-atoll',
  'puducherry': 'french-quarter-auroville-puducherry'
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchWikiImage(wikiTitle) {
  // First attempt: media-list for high-resolution 1280px image
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/media-list/${wikiTitle}`, {
      headers: { 'User-Agent': 'TravelBharat/1.0 (info@travelbharat.in)' }
    });
    if (res.ok) {
      const data = await res.json();
      const goodImages = data.items.filter(i => {
        if (i.type !== 'image' || !i.srcset || i.srcset.length === 0) return false;
        const low = i.title.toLowerCase();
        return !low.includes('icon') && !low.includes('map') && !low.includes('flag') &&
               !low.includes('symbol') && !low.includes('logo') && !low.includes('locator') &&
               !low.includes('diagram') && !low.includes('seal') && !low.includes('coat');
      });
      if (goodImages.length > 0) {
        const item = goodImages[0];
        const bestSrc = item.srcset[item.srcset.length - 1].src;
        return (bestSrc.startsWith('//') ? 'https:' : '') + bestSrc;
      }
    }
  } catch (err) {
    // fallback to summary
  }

  // Second attempt: page summary
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${wikiTitle}`, {
      headers: { 'User-Agent': 'TravelBharat/1.0 (info@travelbharat.in)' }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.thumbnail && data.thumbnail.source) {
        return data.thumbnail.source;
      }
      if (data.originalimage && data.originalimage.source) {
        return data.originalimage.source;
      }
    }
  } catch (err) {}

  return null;
}

async function main() {
  console.log('🚀 Downloading authentic images for all 56 places...');
  const places = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'places.json'), 'utf8'));
  
  for (let i = 0; i < places.length; i++) {
    const p = places[i];
    const targetFile = path.join(placesDir, `${p.slug}.jpg`);
    if (fs.existsSync(targetFile) && fs.statSync(targetFile).size > 10000) {
      console.log(`[${i + 1}/${places.length}] Exists: ${p.slug}`);
      continue;
    }
    const wikiTitle = placeWikiMap[p.slug] || p.name.replace(/ /g, '_');
    const imgUrl = await fetchWikiImage(wikiTitle);
    if (!imgUrl) {
      console.warn(`[${i + 1}/${places.length}] ⚠️ No image found for ${p.slug}`);
      continue;
    }

    try {
      const res = await fetch(imgUrl, {
        headers: { 'User-Agent': 'TravelBharat/1.0 (info@travelbharat.in)' }
      });
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(targetFile, buf);
        console.log(`[${i + 1}/${places.length}] ✅ Downloaded: ${p.slug} (${Math.round(buf.length / 1024)} KB)`);
      } else {
        console.warn(`[${i + 1}/${places.length}] ❌ HTTP ${res.status} for ${p.slug}`);
      }
    } catch (e) {
      console.error(`[${i + 1}/${places.length}] Error downloading ${p.slug}:`, e.message);
    }
    await sleep(250);
  }

  console.log('\n🏛️ Setting up state banner images...');
  for (const [stateSlug, placeSlug] of Object.entries(stateLandmarkMap)) {
    const srcPlaceImg = path.join(placesDir, `${placeSlug}.jpg`);
    const dstStateImg = path.join(statesDir, `${stateSlug}.jpg`);
    if (fs.existsSync(srcPlaceImg)) {
      fs.copyFileSync(srcPlaceImg, dstStateImg);
      console.log(`✅ State banner: ${stateSlug} -> ${placeSlug}`);
    } else {
      console.warn(`⚠️ Source place image not found: ${srcPlaceImg}`);
    }
  }

  console.log('\n✨ All authentic images downloaded and prepared!');
}

main().catch(console.error);

