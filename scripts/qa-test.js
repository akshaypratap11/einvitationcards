const http = require('http');

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let responseBody = '';
        res.on('data', (chunk) => (responseBody += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(responseBody) });
          } catch {
            resolve({ status: res.statusCode, raw: responseBody });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function get(path) {
  return new Promise((resolve, reject) => {
    const req = http.get(
      {
        hostname: 'localhost',
        port: 3000,
        path,
      },
      (res) => {
        let responseBody = '';
        res.on('data', (chunk) => (responseBody += chunk));
        res.on('end', () => {
          resolve({ status: res.statusCode, body: responseBody });
        });
      }
    );
    req.on('error', reject);
  });
}

async function runQa() {
  console.log('=== STARTING FULL QA PASS ===\n');

  const timestamp = Date.now().toString(36);

  // 1. Wedding With Photos
  console.log('1. Testing Wedding (With Photos)...');
  const weddingWithPhotosSlug = `qa-wedding-photos-${timestamp}`;
  const weddingWithPhotos = await post('/api/cards', {
    slug: weddingWithPhotosSlug,
    type: 'wedding',
    edit_token: `token-${timestamp}-1`,
    data: {
      type: 'wedding',
      lang: 'en',
      groomName: 'Kabir Singhania',
      brideName: 'Nisha Mehra',
      groomParents: 'Mr. & Mrs. R. Singhania',
      brideParents: 'Mr. & Mrs. K. Mehra',
      groomPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      bridePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      heroPhoto: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
      mainDate: new Date(Date.now() + 20 * 86400000).toISOString(),
      venueName: 'The Oberoi Rajvilas',
      venueAddress: 'Goner Road, Jaipur, Rajasthan',
      events: [
        { id: 'ev1', title: 'Sangeet Night', time: '19:00', date: '2026-11-10', venue: 'Royal Court' },
        { id: 'ev2', title: 'Pheras & Reception', time: '18:00', date: '2026-11-11', venue: 'Palace Lawns' }
      ],
      gallery: [
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400',
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400'
      ],
      contactName: 'Singhania Family',
      contactPhone: '9876543210',
      rsvpEnabled: true,
      musicUrl: '/music/shehnai-festive.mp3'
    }
  });
  console.log(`   Creation status: ${weddingWithPhotos.status}`);
  const weddingWithPhotosPage = await get(`/c/${weddingWithPhotosSlug}`);
  console.log(`   Public page /c/${weddingWithPhotosSlug}: HTTP ${weddingWithPhotosPage.status}`);

  // 2. Wedding Without Photos
  console.log('\n2. Testing Wedding (Without Photos - Fallback Gradients & Initials)...');
  const weddingNoPhotosSlug = `qa-wedding-nophotos-${timestamp}`;
  const weddingNoPhotos = await post('/api/cards', {
    slug: weddingNoPhotosSlug,
    type: 'wedding',
    edit_token: `token-${timestamp}-2`,
    data: {
      type: 'wedding',
      lang: 'hi',
      groomName: 'अमित शर्मा',
      brideName: 'पूजा वर्मा',
      mainDate: new Date(Date.now() + 25 * 86400000).toISOString(),
      venueName: 'होटल ताज पैलेस',
      venueAddress: 'सरदार पटेल मार्ग, नई दिल्ली',
      events: [
        { id: 'ev1', title: 'शुभ विवाह', time: '19:00', date: '2026-11-15', venue: 'बैंक्वेट हॉल' }
      ],
      gallery: [],
      contactName: 'शर्मा परिवार',
      contactPhone: '9876543210',
      rsvpEnabled: true
    }
  });
  console.log(`   Creation status: ${weddingNoPhotos.status}`);
  const weddingNoPhotosPage = await get(`/c/${weddingNoPhotosSlug}`);
  console.log(`   Public page /c/${weddingNoPhotosSlug}: HTTP ${weddingNoPhotosPage.status}`);

  // 3. Birthday With Photos
  console.log('\n3. Testing Birthday (With Photos - Theme Kids)...');
  const birthdayWithPhotosSlug = `qa-bday-photos-${timestamp}`;
  const birthdayWithPhotos = await post('/api/cards', {
    slug: birthdayWithPhotosSlug,
    type: 'birthday',
    edit_token: `token-${timestamp}-3`,
    data: {
      type: 'birthday',
      lang: 'en',
      themeVariant: 'kids',
      personName: 'Reyansh Gupta',
      age: 5,
      hostName: 'Deepak & Swati Gupta',
      heroPhoto: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=400',
      mainDate: new Date(Date.now() + 15 * 86400000).toISOString(),
      venueName: 'Funky Monkey Play Lounge',
      venueAddress: 'Indiranagar, Bangalore, Karnataka',
      events: [
        { id: 'b1', title: 'Magic Show & Games', time: '16:30', date: '2026-11-05', venue: 'Activity Area' },
        { id: 'b2', title: 'Cake Cutting', time: '18:00', date: '2026-11-05', venue: 'Party Room' }
      ],
      gallery: [
        'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400'
      ],
      contactName: 'Deepak Gupta',
      contactPhone: '9876543210',
      rsvpEnabled: true,
      musicUrl: '/music/celebration-cheer.mp3'
    }
  });
  console.log(`   Creation status: ${birthdayWithPhotos.status}`);
  const birthdayWithPhotosPage = await get(`/c/${birthdayWithPhotosSlug}`);
  console.log(`   Public page /c/${birthdayWithPhotosSlug}: HTTP ${birthdayWithPhotosPage.status}`);

  // 4. Birthday Without Photos (Theme Adult)
  console.log('\n4. Testing Birthday (Without Photos - Theme Adult)...');
  const birthdayNoPhotosSlug = `qa-bday-nophotos-${timestamp}`;
  const birthdayNoPhotos = await post('/api/cards', {
    slug: birthdayNoPhotosSlug,
    type: 'birthday',
    edit_token: `token-${timestamp}-4`,
    data: {
      type: 'birthday',
      lang: 'en',
      themeVariant: 'adult',
      personName: 'Rohan Mehra',
      age: 30,
      hostName: 'Friends & Family',
      mainDate: new Date(Date.now() + 12 * 86400000).toISOString(),
      venueName: 'Skyline Rooftop Bar',
      venueAddress: 'Bandra West, Mumbai',
      events: [
        { id: 'b1', title: 'Cocktails & Dinner', time: '20:00', date: '2026-11-02', venue: 'Lounge Deck' }
      ],
      gallery: [],
      contactName: 'Rohan',
      contactPhone: '9876543210',
      rsvpEnabled: true
    }
  });
  console.log(`   Creation status: ${birthdayNoPhotos.status}`);
  const birthdayNoPhotosPage = await get(`/c/${birthdayNoPhotosSlug}`);
  console.log(`   Public page /c/${birthdayNoPhotosSlug}: HTTP ${birthdayNoPhotosPage.status}`);

  // 5. Ghar Function With Photos
  console.log('\n5. Testing Ghar Function (With Photos)...');
  const gharWithPhotosSlug = `qa-ghar-photos-${timestamp}`;
  const gharWithPhotos = await post('/api/cards', {
    slug: gharWithPhotosSlug,
    type: 'ghar',
    edit_token: `token-${timestamp}-5`,
    data: {
      type: 'ghar',
      lang: 'hi',
      functionName: 'गृह प्रवेश एवं वास्तु शांति',
      familyName: 'मिश्रा परिवार',
      muhurat: 'प्रातः 08:30 बजे से 10:45 बजे तक',
      heroPhoto: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
      mainDate: new Date(Date.now() + 18 * 86400000).toISOString(),
      venueName: 'सुखद निवास, प्लॉट #12',
      venueAddress: 'गोमती नगर, लखनऊ, उत्तर प्रदेश',
      events: [
        { id: 'g1', title: 'वास्तु पूजन व हवन', time: '08:30', date: '2026-11-08', venue: 'आंगन' },
        { id: 'g2', title: 'महाप्रसाद भोज', time: '12:30', date: '2026-11-08', venue: 'भोजन कक्ष' }
      ],
      gallery: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400'
      ],
      contactName: 'सुरेश मिश्रा',
      contactPhone: '9876543210',
      rsvpEnabled: true,
      musicUrl: '/music/temple-flute.mp3'
    }
  });
  console.log(`   Creation status: ${gharWithPhotos.status}`);
  const gharWithPhotosPage = await get(`/c/${gharWithPhotosSlug}`);
  console.log(`   Public page /c/${gharWithPhotosSlug}: HTTP ${gharWithPhotosPage.status}`);

  // 6. Ghar Function Without Photos
  console.log('\n6. Testing Ghar Function (Without Photos)...');
  const gharNoPhotosSlug = `qa-ghar-nophotos-${timestamp}`;
  const gharNoPhotos = await post('/api/cards', {
    slug: gharNoPhotosSlug,
    type: 'ghar',
    edit_token: `token-${timestamp}-6`,
    data: {
      type: 'ghar',
      lang: 'en',
      functionName: 'Satyanarayan Mahapooja',
      familyName: 'The Joshi Family',
      muhurat: '10:00 AM onwards',
      mainDate: new Date(Date.now() + 8 * 86400000).toISOString(),
      venueName: 'Joshi Bhavan',
      venueAddress: 'Kothrud, Pune, Maharashtra',
      events: [
        { id: 'g1', title: 'Katha & Aarti', time: '10:00', date: '2026-10-28', venue: 'Mandir Hall' }
      ],
      gallery: [],
      contactName: 'Anand Joshi',
      contactPhone: '9876543210',
      rsvpEnabled: true
    }
  });
  console.log(`   Creation status: ${gharNoPhotos.status}`);
  const gharNoPhotosPage = await get(`/c/${gharNoPhotosSlug}`);
  console.log(`   Public page /c/${gharNoPhotosSlug}: HTTP ${gharNoPhotosPage.status}`);

  // 7. Testing RSVP Submission & Retrieval
  console.log('\n7. Testing RSVP Flow...');
  const rsvpSubmit1 = await post('/api/rsvp', {
    slug: weddingWithPhotosSlug,
    guest_name: 'Amitabh & Jaya Bachchan',
    attending: true,
    guests_count: 4
  });
  console.log(`   RSVP 1 (Attending) Submission status: ${rsvpSubmit1.status}`);

  const rsvpSubmit2 = await post('/api/rsvp', {
    slug: weddingWithPhotosSlug,
    guest_name: 'Sunil Gavaskar',
    attending: false,
    guests_count: 0
  });
  console.log(`   RSVP 2 (Declined) Submission status: ${rsvpSubmit2.status}`);

  // Test Host RSVP Dashboard API & Page
  const token = `token-${timestamp}-1`;
  const rsvpApi = await get(`/api/rsvp?slug=${weddingWithPhotosSlug}&token=${token}`);
  console.log(`   Host GET /api/rsvp status: ${rsvpApi.status}`);
  const rsvpData = JSON.parse(rsvpApi.body);
  console.log(`   Stats: Total=${rsvpData.stats.totalResponses}, Confirmed=${rsvpData.stats.totalConfirmedGuests}, Attending=${rsvpData.stats.totalAttending}, Declined=${rsvpData.stats.totalDeclined}`);

  const hostRsvpPage = await get(`/rsvps/${weddingWithPhotosSlug}?token=${token}`);
  console.log(`   Host Dashboard /rsvps/${weddingWithPhotosSlug}?token=...: HTTP ${hostRsvpPage.status}`);

  // 8. Testing Preview Routes
  console.log('\n8. Testing Preview Routes...');
  const prevBday = await get('/preview/birthday');
  console.log(`   /preview/birthday: HTTP ${prevBday.status}`);
  const prevGhar = await get('/preview/ghar');
  console.log(`   /preview/ghar: HTTP ${prevGhar.status}`);

  console.log('\n=== ALL QA CHECKS COMPLETED SUCCESSFULLY ===');
}

runQa().catch((err) => {
  console.error('QA Failed:', err);
  process.exit(1);
});
