import { PrismaClient, StateType, Region, CategoryType, TagType, PlaceStatus, AdminRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Haversine formula to compute distance in km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

async function main() {
  console.log('🚀 Starting TravelBharat Database Seed...');

  const dataDir = path.join(__dirname, 'data');
  const statesData = JSON.parse(fs.readFileSync(path.join(dataDir, 'states.json'), 'utf-8'));
  const citiesData = JSON.parse(fs.readFileSync(path.join(dataDir, 'cities.json'), 'utf-8'));
  const placesData = JSON.parse(fs.readFileSync(path.join(dataDir, 'places.json'), 'utf-8'));
  const placeImagesData = JSON.parse(fs.readFileSync(path.join(dataDir, 'place-images.json'), 'utf-8'));
  const adminUsersData = JSON.parse(fs.readFileSync(path.join(dataDir, 'admin-users.json'), 'utf-8'));

  // 1. Seed Admin Users
  console.log('👤 Seeding Admin Users...');
  for (const user of adminUsersData) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    await prisma.adminUser.upsert({
      where: { email: user.email },
      update: {
        passwordHash,
        role: user.role as AdminRole,
      },
      create: {
        email: user.email,
        passwordHash,
        role: user.role as AdminRole,
      },
    });
  }
  console.log(`✅ Seeded ${adminUsersData.length} admin users.`);

  // 2. Seed States
  console.log('🏛️ Seeding States and Union Territories...');
  const stateMap = new Map<string, string>(); // slug -> id
  for (const state of statesData) {
    const record = await prisma.state.upsert({
      where: { slug: state.slug },
      update: {
        name: state.name,
        type: state.type as StateType,
        capital: state.capital,
        region: state.region as Region,
        description: state.description,
        bannerImage: state.bannerImage,
        svgMapId: state.svgMapId ?? null,
      },
      create: {
        name: state.name,
        slug: state.slug,
        type: state.type as StateType,
        capital: state.capital,
        region: state.region as Region,
        description: state.description,
        bannerImage: state.bannerImage,
        svgMapId: state.svgMapId ?? null,
      },
    });
    stateMap.set(state.slug, record.id);
  }
  console.log(`✅ Seeded ${statesData.length} states & union territories.`);

  // 3. Seed Cities
  console.log('🏙️ Seeding Cities...');
  const cityMap = new Map<string, string>(); // slug -> id
  for (const city of citiesData) {
    const stateId = stateMap.get(city.stateSlug);
    if (!stateId) {
      console.warn(`⚠️ Warning: State slug ${city.stateSlug} not found for city ${city.name}`);
      continue;
    }
    const record = await prisma.city.upsert({
      where: { slug: city.slug },
      update: {
        name: city.name,
        stateId,
        description: city.description,
        lat: city.lat,
        lng: city.lng,
      },
      create: {
        name: city.name,
        slug: city.slug,
        stateId,
        description: city.description,
        lat: city.lat,
        lng: city.lng,
      },
    });
    cityMap.set(city.slug, record.id);
  }
  console.log(`✅ Seeded ${cityMap.size} cities.`);

  // 4. Seed Places
  console.log('📍 Seeding Tourist Places...');
  const placeMap = new Map<string, { id: string; lat: number; lng: number }>();
  for (const place of placesData) {
    const stateId = stateMap.get(place.stateSlug);
    if (!stateId) {
      console.warn(`⚠️ Warning: State slug ${place.stateSlug} not found for place ${place.name}`);
      continue;
    }
    const cityId = place.citySlug ? cityMap.get(place.citySlug) ?? null : null;

    const record = await prisma.place.upsert({
      where: { slug: place.slug },
      update: {
        name: place.name,
        stateId,
        cityId,
        category: place.category as CategoryType,
        tags: place.tags as TagType[],
        shortDescription: place.shortDescription,
        description: place.description,
        historicalSignificance: place.historicalSignificance ?? null,
        bestTimeToVisit: place.bestTimeToVisit,
        bestMonths: place.bestMonths ?? [],
        entryFee: place.entryFee ?? null,
        timings: place.timings ?? null,
        mapLink: place.mapLink ?? null,
        lat: place.lat,
        lng: place.lng,
        howToReachAirport: place.howToReachAirport ?? null,
        howToReachRailway: place.howToReachRailway ?? null,
        howToReachRoad: place.howToReachRoad ?? null,
        localTips: place.localTips ?? [],
        isUnesco: Boolean(place.isUnesco),
        isFeatured: Boolean(place.isFeatured),
        status: (place.status as PlaceStatus) || PlaceStatus.VERIFIED,
        sources: place.sources ?? [],
        verifiedBy: place.verifiedBy ?? 'TravelBharat Editorial',
        verifiedAt: place.verifiedAt ? new Date(place.verifiedAt) : new Date(),
      },
      create: {
        name: place.name,
        slug: place.slug,
        stateId,
        cityId,
        category: place.category as CategoryType,
        tags: place.tags as TagType[],
        shortDescription: place.shortDescription,
        description: place.description,
        historicalSignificance: place.historicalSignificance ?? null,
        bestTimeToVisit: place.bestTimeToVisit,
        bestMonths: place.bestMonths ?? [],
        entryFee: place.entryFee ?? null,
        timings: place.timings ?? null,
        mapLink: place.mapLink ?? null,
        lat: place.lat,
        lng: place.lng,
        howToReachAirport: place.howToReachAirport ?? null,
        howToReachRailway: place.howToReachRailway ?? null,
        howToReachRoad: place.howToReachRoad ?? null,
        localTips: place.localTips ?? [],
        isUnesco: Boolean(place.isUnesco),
        isFeatured: Boolean(place.isFeatured),
        status: (place.status as PlaceStatus) || PlaceStatus.VERIFIED,
        sources: place.sources ?? [],
        verifiedBy: place.verifiedBy ?? 'TravelBharat Editorial',
        verifiedAt: place.verifiedAt ? new Date(place.verifiedAt) : new Date(),
      },
    });
    placeMap.set(place.slug, { id: record.id, lat: record.lat, lng: record.lng });
  }
  console.log(`✅ Seeded ${placeMap.size} places.`);

  // 5. Seed Place Images
  console.log('🖼️ Seeding Place Images...');
  await prisma.placeImage.deleteMany();
  let imageCount = 0;
  for (const img of placeImagesData) {
    const placeInfo = placeMap.get(img.placeSlug);
    if (!placeInfo) {
      continue;
    }
    // Delete existing images for clean idempotent re-seed
    const existing = await prisma.placeImage.findFirst({
      where: {
        placeId: placeInfo.id,
        url: img.url,
      },
    });
    if (existing) {
      await prisma.placeImage.update({
        where: { id: existing.id },
        data: {
          alt: img.alt,
          caption: img.caption ?? null,
          credit: img.credit,
          license: img.license,
          sourceUrl: img.sourceUrl ?? null,
          isCover: Boolean(img.isCover),
          order: img.order ?? 0,
        },
      });
    } else {
      await prisma.placeImage.create({
        data: {
          placeId: placeInfo.id,
          url: img.url,
          alt: img.alt,
          caption: img.caption ?? null,
          credit: img.credit,
          license: img.license,
          sourceUrl: img.sourceUrl ?? null,
          isCover: Boolean(img.isCover),
          order: img.order ?? 0,
        },
      });
    }
    imageCount++;
  }
  console.log(`✅ Seeded ${imageCount} place images.`);

  // 6. Compute and Seed Nearby Places
  console.log('🧭 Computing Nearby Places...');
  const placesList = Array.from(placeMap.values());
  let nearbyCount = 0;
  for (let i = 0; i < placesList.length; i++) {
    const p1 = placesList[i];
    // Find closest 4 places
    const distances: { targetId: string; distance: number }[] = [];
    for (let j = 0; j < placesList.length; j++) {
      if (i === j) continue;
      const p2 = placesList[j];
      const dist = calculateDistanceKm(p1.lat, p1.lng, p2.lat, p2.lng);
      distances.push({ targetId: p2.id, distance: dist });
    }
    distances.sort((a, b) => a.distance - b.distance);
    const closest = distances.slice(0, 4);

    for (const close of closest) {
      await prisma.nearbyPlace.upsert({
        where: {
          placeId_nearbyPlaceId: {
            placeId: p1.id,
            nearbyPlaceId: close.targetId,
          },
        },
        update: {
          distanceKm: close.distance,
        },
        create: {
          placeId: p1.id,
          nearbyPlaceId: close.targetId,
          distanceKm: close.distance,
        },
      });
      nearbyCount++;
    }
  }
  console.log(`✅ Computed and linked ${nearbyCount} nearby place relationships.`);

  // Summary
  const [totalStates, totalCities, totalPlaces, totalImages, totalAdmins] = await Promise.all([
    prisma.state.count(),
    prisma.city.count(),
    prisma.place.count(),
    prisma.placeImage.count(),
    prisma.adminUser.count(),
  ]);

  console.log('\n==============================');
  console.log('🎉 SEED COMPLETED SUCCESSFULLY!');
  console.log('==============================');
  console.log(`States/UTs:   ${totalStates}`);
  console.log(`Cities:       ${totalCities}`);
  console.log(`Places:       ${totalPlaces}`);
  console.log(`Place Images: ${totalImages}`);
  console.log(`Admin Users:  ${totalAdmins}`);
  console.log('==============================\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
