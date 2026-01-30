import { getBreedImage } from './breedImages';

export interface BreedInfo {
    id: string;
    name: string;
    type: 'Cattle' | 'Buffalo';
    origin: string;
    milkYield: string;
    traits: string[];
    desc: string;
    image: any; // Changed from string to any to support require()
}

export const BREED_DATA: Record<string, BreedInfo> = {
    'Amritmahal': {
        id: '0',
        name: 'Amritmahal',
        type: 'Cattle',
        origin: 'Karnataka',
        milkYield: 'Low (Draft Breed)',
        traits: ['Grey to dark grey', 'Long tapering horns', 'Compact muscular body'],
        desc: 'Amritmahal is a famous draft breed known for its endurance and speed. It was historically used for transporting army equipment.',
        image: getBreedImage('Amritmahal')
    },
    'Ayrshire': {
        id: '1',
        name: 'Ayrshire',
        type: 'Cattle',
        origin: 'Scotland',
        milkYield: '4000 - 5000 kg',
        traits: ['Red and white markings', 'Medium size', 'Curved horns'],
        desc: 'Ayrshire cattle are a breed of dairy cattle from Ayrshire in southwest Scotland. They are known for their hardiness and high milk quality.',
        image: getBreedImage('Ayrshire')
    },
    'Bargur': {
        id: '2',
        name: 'Bargur',
        type: 'Cattle',
        origin: 'Tamil Nadu',
        milkYield: 'Low',
        traits: ['Red and white speckled', 'Compact body', 'Known for speed'],
        desc: 'Bargur cattle are found in the Bargur hills of Erode district. They are known for their endurance and speed in trotting operations.',
        image: getBreedImage('Bargur')
    },
    'Dangi': {
        id: '3',
        name: 'Dangi',
        type: 'Cattle',
        origin: 'Maharashtra (Nasik, Ahmednagar)',
        milkYield: 'Low (Draft)',
        traits: ['Red and white spots', 'Thick skin', 'Heavy rainfall tolerance'],
        desc: 'The Dangi breed is a draft breed known for its ability to work in heavy rainfall areas and rice fields. The skin excretes an oily secretion that protects it from rain.',
        image: getBreedImage('Dangi')
    },
    'Deoni': {
        id: '4',
        name: 'Deoni',
        type: 'Cattle',
        origin: 'Maharashtra (Latur, Parbhani)',
        milkYield: '800 - 1000 kg',
        traits: ['Black and white spots', 'Drooping ears', 'Similiar to Gir'],
        desc: 'Deoni is a dual-purpose breed, used for both milk and draft. It is hardy and well-adapted to tropical conditions.',
        image: getBreedImage('Deoni')
    },
    'Gir': {
        id: '5',
        name: 'Gir',
        type: 'Cattle',
        origin: 'Gujarat (Saurashtra)',
        milkYield: '1200 - 1800 kg',
        traits: ['Domed forehead', 'Long pendulous ears', 'Red to speckled red'],
        desc: 'Gir is one of the most famous dairy breeds of India. Native to the Gir forests, they are highly tolerant to stress and tropical diseases.',
        image: getBreedImage('Gir')
    },
    'Hallikar': {
        id: '6',
        name: 'Hallikar',
        type: 'Cattle',
        origin: 'Karnataka',
        milkYield: 'Low (Draft)',
        traits: ['Grey color', 'Long vertical horns', 'Compact body'],
        desc: 'Hallikar is a draft breed from the Hallikar belt of Mysore. They are the progenitors of the Amritmahal breed and are known for their strength.',
        image: getBreedImage('Hallikar')
    },
    'Hariana': {
        id: '7',
        name: 'Hariana',
        type: 'Cattle',
        origin: 'Haryana, Punjab',
        milkYield: '1000 - 1500 kg',
        traits: ['White/Light Grey', 'Compact body', 'High forehead'],
        desc: 'Hariana is a prominent dual-purpose breed of North India. The bullocks are excellent workers and the cows are good milkers.',
        image: getBreedImage('Hariana')
    },
    'Himachali Pahari': {
        id: '8',
        name: 'Himachali Pahari',
        type: 'Cattle',
        origin: 'Himachal Pradesh',
        milkYield: '300 - 500 kg',
        traits: ['Small size', 'Various colors', 'Adaptable to hills'],
        desc: 'Small sized cattle adapted to the hilly terrain of the Himalayas. They are hardy and can survive on poor quality fodder.',
        image: getBreedImage('Himachali Pahari')
    },
    'Kangayam': {
        id: '9',
        name: 'Kangayam',
        type: 'Cattle',
        origin: 'Tamil Nadu (Erode)',
        milkYield: 'Low',
        traits: ['Grey/White', 'Stout erect horns', 'Compact body'],
        desc: 'Kangayam cattle are a draft breed known for their strength. The bulls are grey with dark hump and forequarters, while cows are white.',
        image: getBreedImage('Kangayam')
    },
    'Kankrej': {
        id: '10',
        name: 'Kankrej',
        type: 'Cattle',
        origin: 'Gujarat (Rann of Kutch)',
        milkYield: '1000 - 1500 kg',
        traits: ['Silver-grey', 'Large lyre-shaped horns', 'Heavy hump'],
        desc: 'Kankrej is one of the heaviest and most powerful Indian breeds. They are dual-purpose and famous for their unique "Sawai" gait.',
        image: getBreedImage('Kankrej')
    },
    'Kenkatha': {
        id: '11',
        name: 'Kenkatha',
        type: 'Cattle',
        origin: 'Uttar Pradesh / MP (Bundelkhand)',
        milkYield: 'Low',
        traits: ['Small sturdy', 'Grey/Reddish', 'Short horns'],
        desc: 'Kenkatha cattle are small but sturdy draft animals, well adapted to the rocky Vindhya hills region along the Ken river.',
        image: getBreedImage('Kenkatha')
    },
    'Khariar': {
        id: '12',
        name: 'Khariar',
        type: 'Cattle',
        origin: 'Odisha',
        milkYield: 'Low',
        traits: ['Small size', 'Various colors', 'Hardy'],
        desc: 'Khariar is a draft purpose breed found in the Nuapada district of Odisha.',
        image: getBreedImage('Khariar')
    },
    'Khillari': {
        id: '13',
        name: 'Khillari',
        type: 'Cattle',
        origin: 'Maharashtra (Satara, Sangli)',
        milkYield: 'Low',
        traits: ['Greyish white', 'Long horns', 'Fast gait'],
        desc: 'Khillari is a famous draft breed known for its speed and strength. It is often referred to as the "Race Car" of cattle breeds in Maharashtra.',
        image: getBreedImage('Khillari')
    },
    'Konkan Kapila': {
        id: '14',
        name: 'Konkan Kapila',
        type: 'Cattle',
        origin: 'Maharashtra / Goa (Konkan)',
        milkYield: 'Low',
        traits: ['Small size', 'Reddish/Brown', 'High disease resistance'],
        desc: 'Konkan Kapila is a small sized cattle breed from the coastal Konkan region. They are highly resistant to diseases and heat.',
        image: getBreedImage('Konkan Kapila')
    },
    'Kosali': {
        id: '15',
        name: 'Kosali',
        type: 'Cattle',
        origin: 'Chhattisgarh',
        milkYield: 'Low',
        traits: ['Small size', 'Red/Grey', 'Draft ability'],
        desc: 'Kosali is a draft breed from the plains of Chhattisgarh. They are very efficient for paddy cultivation.',
        image: getBreedImage('Kosali')
    },
    'Krishna_Valley': {
        id: '16',
        name: 'Krishna Valley',
        type: 'Cattle',
        origin: 'Karnataka',
        milkYield: '900 kg',
        traits: ['Large size', 'Grey/White', 'Heavy hump'],
        desc: 'Krishna Valley is a heavy draft breed used for agriculture in the black cotton soil along the Krishna river.',
        image: getBreedImage('Krishna Valley')
    },
    'Ladakhi': {
        id: '17',
        name: 'Ladakhi',
        type: 'Cattle',
        origin: 'Ladakh',
        milkYield: '200 - 300 kg',
        traits: ['Small compact', 'Black/Red', 'Cold tolerance'],
        desc: 'Native to the high altitude Ladakh region, these small cattle produce milk with very high fat content (up to 5%).',
        image: getBreedImage('Ladakhi')
    },
    'Lakhimi': {
        id: '18',
        name: 'Lakhimi',
        type: 'Cattle',
        origin: 'Assam',
        milkYield: 'Low',
        traits: ['Small size', 'Various colors', 'Humped'],
        desc: 'Lakhimi is a dual purpose breed from Assam, used for milk and draft. They are well adapted to the humid climate.',
        image: getBreedImage('Lakhimi')
    },
    'Malnad_gidda': {
        id: '19',
        name: 'Malnad Gidda',
        type: 'Cattle',
        origin: 'Karnataka (Western Ghats)',
        milkYield: '200 - 500 kg',
        traits: ['Dwarf size', 'Black/Brown', 'Agile'],
        desc: 'Malnad Gidda is a dwarf breed native to the rainforests of the Western Ghats. They are extremely agile and graze freely in forests.',
        image: getBreedImage('Malnad Gidda')
    },
    'Mewati': {
        id: '20',
        name: 'Mewati',
        type: 'Cattle',
        origin: 'Rajasthan / Haryana (Mewat)',
        milkYield: '800 - 1000 kg',
        traits: ['White', 'Medium size', 'Docile'],
        desc: 'Mewati (or Kosi) is a dual purpose breed. They are docile and hard workers.',
        image: getBreedImage('Mewati')
    },
    'Nari': {
        id: '21',
        name: 'Nari',
        type: 'Cattle',
        origin: 'Rajasthan / Gujarat',
        milkYield: 'Low',
        traits: ['White/Grey', 'Long horns', 'Hardy'],
        desc: 'Nari cattle are migratory cattle kept by nomadic tribes in the Rajasthan-Gujarat border areas.',
        image: getBreedImage('Nari')
    },
    'Nimari': {
        id: '22',
        name: 'Nimari',
        type: 'Cattle',
        origin: 'Madhya Pradesh (Nimar)',
        milkYield: 'Low',
        traits: ['Red with white splashes', 'Aggressive', 'Draft breed'],
        desc: 'Nimari cattle are red with large white splashes. They are known for their fiery temperament and use as draft animals.',
        image: getBreedImage('Nimari')
    },
    'Ongole': {
        id: '23',
        name: 'Ongole',
        type: 'Cattle',
        origin: 'Andhra Pradesh (Prakasam)',
        milkYield: '1000 - 1500 kg',
        traits: ['Large muscular', 'User white/grey', 'Short horns'],
        desc: 'Ongole is a world-famous dual-purpose breed. It has contributed to the creation of the American Brahman breed. Bulls are extremely powerful.',
        image: getBreedImage('Ongole')
    },
    'Poda Thirupu': {
        id: '24',
        name: 'Poda Thirupu',
        type: 'Cattle',
        origin: 'Telangana',
        milkYield: 'Low',
        traits: ['Draft breed', 'Hardy', 'Yellow/Brown'],
        desc: 'A distinct draft breed from Telangana, known for its ability to work in difficult terrains.',
        image: getBreedImage('Poda Thirupu')
    },
    'Pulikulam': {
        id: '25',
        name: 'Pulikulam',
        type: 'Cattle',
        origin: 'Tamil Nadu (Madurai)',
        milkYield: 'Low',
        traits: ['Aggressive', 'Used for Jallikattu', 'Compact'],
        desc: 'Famous for its use in the Jallikattu bull-taming sport. Known as "Jallikattu maadu". They are agile and spirited.',
        image: getBreedImage('Pulikulam')
    },
    'Punganur': {
        id: '26',
        name: 'Punganur',
        type: 'Cattle',
        origin: 'Andhra Pradesh (Chittoor)',
        milkYield: '500 kg',
        traits: ['Dwarf size', 'White/Grey', 'Crescent horns'],
        desc: 'The world\'s shortest humped cattle breed. Punganur is considered highly auspicious and is threatened by extinction.',
        image: getBreedImage('Punganur')
    },
    'Purnea': {
        id: '27',
        name: 'Purnea',
        type: 'Cattle',
        origin: 'Bihar',
        milkYield: 'Low',
        traits: ['Small', 'Red/Grey', 'Draft'],
        desc: 'Indigenous cattle of Purnea district in Bihar. Small but useful for light agricultural work.',
        image: getBreedImage('Purnea')
    },
    'Rathi': {
        id: '28',
        name: 'Rathi',
        type: 'Cattle',
        origin: 'Rajasthan (Bikaner)',
        milkYield: '1500 - 2000 kg',
        traits: ['Brown and white', 'Dual purpose', 'Hardy'],
        desc: 'Rathi is an important milch breed of the dry regions of Rajasthan. It is considered a cousin of Sahiwal and Red Sindhi.',
        image: getBreedImage('Rathi')
    },
    'Red kandhari': {
        id: '29',
        name: 'Red Kandhari',
        type: 'Cattle',
        origin: 'Maharashtra (Nanded)',
        milkYield: 'Low',
        traits: ['Unified Red color', 'Draft breed', 'Moderate size'],
        desc: 'Known for their almost uniform deep red color. They are excellent draft animals.',
        image: getBreedImage('Red Kandhari')
    },
    'Red_Sindhi': {
        id: '30',
        name: 'Red Sindhi',
        type: 'Cattle',
        origin: 'Sindh (Pakistan) / India',
        milkYield: '1800 - 2500 kg',
        traits: ['Deep red', 'Compact', 'High milk fat'],
        desc: 'Red Sindhi is a renowned milch breed. Though originally from Sindh, organized herds are found in India. It has high heat tolerance.',
        image: getBreedImage('Red Sindhi')
    },
    'Sahiwal': {
        id: '31',
        name: 'Sahiwal',
        type: 'Cattle',
        origin: 'Punjab (India/Pakistan)',
        milkYield: '2000 - 3000 kg',
        traits: ['Reddish dun', 'Loose skin (Lola)', 'High milk'],
        desc: 'Considered the best milch breed of indigenous cattle. Known as "Lola" due to loose skin. High resistance to tick parasites.',
        image: getBreedImage('Sahiwal')
    },
    'Shweta Kapila': {
        id: '32',
        name: 'Shweta Kapila',
        type: 'Cattle',
        origin: 'Goa',
        milkYield: 'Low',
        traits: ['Completely white', 'Draft', 'Short horns'],
        desc: 'An indigenous breed from Goa, known for its complete white color and adaptability to coastal climates.',
        image: getBreedImage('Shweta Kapila')
    },
    'Tharparkar': {
        id: '33',
        name: 'Tharparkar',
        type: 'Cattle',
        origin: 'Rajasthan (Thar Desert)',
        milkYield: '1800 - 2200 kg',
        traits: ['White/Grey', 'Heat tolerant', 'Medium size'],
        desc: 'Also known as "White Sindhi". Extremely heat tolerant and disease resistant. Can thrive on desert vegetation.',
        image: getBreedImage('Tharparkar')
    },
    'Umblachery': {
        id: '34',
        name: 'Umblachery',
        type: 'Cattle',
        origin: 'Tamil Nadu (Thanjavur)',
        milkYield: 'Low',
        traits: ['Red/Black', 'White socks', 'Dehorned usually'],
        desc: 'Umblachery cattle are distinct with white markings on feet (stockings) and tail switch. Calves are red, turning grey/black at maturity.',
        image: getBreedImage('Umblachery')
    },
    'Vechur': {
        id: '35',
        name: 'Vechur',
        type: 'Cattle',
        origin: 'Kerala',
        milkYield: '500 kg',
        traits: ['World\'s smallest', 'High disease resistance', 'Medicinal milk'],
        desc: 'Vechur was listed in the Guinness Book of Records as the smallest cattle breed. Its milk is believed to have medicinal properties.',
        image: getBreedImage('Vechur')
    },
    'bachaur': {
        id: '36',
        name: 'Bachaur',
        type: 'Cattle',
        origin: 'Bihar (Sitamarhi)',
        milkYield: 'Low',
        traits: ['Grey', 'Resembles Hariana', 'Draft'],
        desc: 'A draft breed from North Bihar, known for its working ability in the gangetic plains.',
        image: getBreedImage('Bachaur')
    },
    'badri': {
        id: '37',
        name: 'Badri',
        type: 'Cattle',
        origin: 'Uttarakhand',
        milkYield: 'Low',
        traits: ['Small', 'Black/Red', 'Hill adapted'],
        desc: 'Small cattle found in the hilly regions of Uttarakhand. Adapted to steep terrain.',
        image: getBreedImage('Badri')
    },
    'bhelai': {
        id: '38',
        name: 'Belahi',
        type: 'Cattle',
        origin: 'Haryana / Chandigarh',
        milkYield: 'Low',
        traits: ['Migratory', 'Hardy', 'Mixed colors'],
        desc: 'Indigenous cattle kept by Gujjar pastoralists in the foothills of Himalayas.',
        image: getBreedImage('Belahi')
    },
    'dagri': {
        id: '39',
        name: 'Dagri',
        type: 'Cattle',
        origin: 'Gujarat',
        milkYield: 'Low',
        traits: ['Draft', 'White/Grey', 'Medium'],
        desc: 'Draft breed mostly found in the Dahod and Panchmahal districts of Gujarat.',
        image: getBreedImage('Dagri')
    },
    'gangatari': {
        id: '40',
        name: 'Gangatiri',
        type: 'Cattle',
        origin: 'Uttar Pradesh / Bihar',
        milkYield: '1000 kg',
        traits: ['White', 'Medium horns', 'Dual purpose'],
        desc: 'Native to the region along the banks of the Ganga river. Good milkers.',
        image: getBreedImage('Gangatiri')
    },
    'gaolao': {
        id: '41',
        name: 'Gaolao',
        type: 'Cattle',
        origin: 'Maharashtra (Wardha)',
        milkYield: '600 kg',
        traits: ['White', 'Long ears', 'Draft'],
        desc: 'Closely related to the Ongole breed. Used mainly for transport and agriculture in the Wardha region.',
        image: getBreedImage('Gaolao')
    },
    'ghumsari': {
        id: '42',
        name: 'Ghumsari',
        type: 'Cattle',
        origin: 'Odisha',
        milkYield: 'Low',
        traits: ['Small', 'Draft', 'Hardy'],
        desc: 'Draft breed from Ganjam district of Odisha.',
        image: getBreedImage('Ghumsari')
    },
    'kherigarh': {
        id: '43',
        name: 'Kherigarh',
        type: 'Cattle',
        origin: 'Uttar Pradesh (Lakhimpur)',
        milkYield: 'Low',
        traits: ['White', 'Upstanding horns', 'Draft'],
        desc: 'Draft breed found in the Kheri district. The bullocks are active and good workers.',
        image: getBreedImage('Kherigarh')
    },
    'malvi': {
        id: '44',
        name: 'Malvi',
        type: 'Cattle',
        origin: 'Madhya Pradesh (Malwa)',
        milkYield: 'Low',
        traits: ['White/Grey', 'Short horns', 'Compact'],
        desc: 'Draft breed from the Malwa plateau. Known for strong bullocks.',
        image: getBreedImage('Malvi')
    },
    'motu': {
        id: '45',
        name: 'Motu',
        type: 'Cattle',
        origin: 'Odisha / Chhattisgarh',
        milkYield: 'Low',
        traits: ['Dwarf', 'Brown/Red', 'Polled (often)'],
        desc: 'Dwarf breed found in the Motu area of Malkangiri district. They are extremely hardy.',
        image: getBreedImage('Motu')
    },
    'nagori': {
        id: '46',
        name: 'Nagori',
        type: 'Cattle',
        origin: 'Rajasthan (Nagaur)',
        milkYield: 'Low',
        traits: ['White', 'Long horns', 'Fast draft'],
        desc: 'Famous for being active and fast trotters. Used for light draft work.',
        image: getBreedImage('Nagori')
    },
    'ponwar': {
        id: '47',
        name: 'Ponwar',
        type: 'Cattle',
        origin: 'Uttar Pradesh (Pilibhit)',
        milkYield: 'Low',
        traits: ['Black and White', 'Small', 'Active'],
        desc: 'Small, active cattle with black and white patches. Found in the Pilibhit district.',
        image: getBreedImage('Ponwar')
    },
    'siri': {
        id: '48',
        name: 'Siri',
        type: 'Cattle',
        origin: 'Sikkim / Bhutan',
        milkYield: 'Low',
        traits: ['Black/White', 'Long hair', 'Hill draft'],
        desc: 'Draft breed of the high altitude regions of Sikkim and Bhutan. Similar to the Yak in some traits.',
        image: getBreedImage('Siri')
    },
    'thutho': {
        id: '49',
        name: 'Thutho',
        type: 'Cattle',
        origin: 'Nagaland',
        milkYield: 'Low',
        traits: ['Small', 'Black', 'Meat/Draft'],
        desc: 'Indigenous cattle of Nagaland. Used for draft and meat.',
        image: getBreedImage('Thutho')
    }
};

// Default fallback
export const DEFAULT_BREED: BreedInfo = {
    id: 'unknown',
    name: 'Unknown Breed',
    type: 'Cattle',
    origin: 'Unknown',
    milkYield: 'N/A',
    traits: ['N/A'],
    desc: 'Information for this breed is currently unavailable.',
    image: getBreedImage('Unknown') // Map to placeholder fallback
};
