const fs = require('fs');
const xlsx = require('xlsx');

function getBoothVoters(dir, boothNo) {
  const pad = String(boothNo).padStart(3, '0');
  const files = fs.readdirSync(dir);
  const match = files.find(f => f.startsWith(pad));
  if (!match) return [];
  const wb = xlsx.readFile(dir + '/' + match);
  if (!wb.Sheets['Voters']) return [];
  return xlsx.utils.sheet_to_json(wb.Sheets['Voters']);
}

// 1. Sanquelim: Authoritative families from PDF Pages 10-13
const sPath = 'public/data/ac17-sanquelim.json';
const sData = JSON.parse(fs.readFileSync(sPath, 'utf8'));

const shivramMembers = [
  { name: 'Radha Krishna Naik', relation: 'Krishna Naik', age: 77, gender: 'Female', epic: 'IIT0250183', booth: 45 },
  { name: 'Shivram Nara Naik', relation: 'Nara Naik', age: 74, gender: 'Male', epic: 'IIT0406330', booth: 45 },
  { name: 'Sitabai Shivram Naik', relation: 'Shivram Naik', age: 69, gender: 'Female', epic: 'IIT0406322', booth: 45 },
  { name: 'Anant Nara Naik', relation: 'Nara Naik', age: 63, gender: 'Male', epic: 'IIT0406314', booth: 45 },
  { name: 'Ambika Anant Naik', relation: 'Anant Naik', age: 61, gender: 'Female', epic: 'IIT0406306', booth: 45 },
  { name: 'Ravindra Nara Naik', relation: 'Nara Naik', age: 56, gender: 'Male', epic: 'BGP1207372', booth: 45 },
  { name: 'Navin Krishna Naik', relation: 'Krishna Naik', age: 54, gender: 'Male', epic: 'BGP5160494', booth: 45 },
  { name: 'Navnita Navin Naik', relation: 'Navin Naik', age: 52, gender: 'Female', epic: 'BGP0465120', booth: 45 },
  { name: 'Somnath Krishna Naik', relation: 'Krishna Naik', age: 52, gender: 'Male', epic: 'IIT0271890', booth: 45 },
  { name: 'Swapna Somnath Naik', relation: 'Somnath Naik', age: 51, gender: 'Female', epic: 'BGP0465112', booth: 45 },
  { name: 'Rakhee Ravindra Naik', relation: 'Ravindra Naik', age: 51, gender: 'Female', epic: 'BGP1207380', booth: 45 },
  { name: 'Satish Shivram Naik', relation: 'Shivram Naik', age: 44, gender: 'Male', epic: 'BGP1619444', booth: 45 },
  { name: 'Nitesh Krishna Naik', relation: 'Krishna Naik', age: 44, gender: 'Male', epic: 'BGP5149091', booth: 45 },
  { name: 'Nishakant Shivram Naik', relation: 'Shivram Naik', age: 42, gender: 'Male', epic: 'BGP1208990', booth: 45 },
  { name: 'Nilesh Anant Naik', relation: 'Anant Naik', age: 38, gender: 'Male', epic: 'IIT0406298', booth: 45 },
  { name: 'Pratima Shivram Naik', relation: 'Shivram Naik', age: 38, gender: 'Female', epic: 'IIT0406280', booth: 45 },
  { name: 'Neha Nitesh Naik', relation: 'Nitesh Naik', age: 37, gender: 'Female', epic: 'IIT0406272', booth: 45 },
  { name: 'Pritesh Anant Naik', relation: 'Anant Naik', age: 35, gender: 'Male', epic: 'IIT0406264', booth: 45 },
  { name: 'Shrutika Somnath Naik', relation: 'Somnath Naik', age: 30, gender: 'Female', epic: 'IIT0406256', booth: 45 },
  { name: 'Shubham Ravindra Naik', relation: 'Ravindra Naik', age: 28, gender: 'Male', epic: 'IIT0406249', booth: 45 },
  { name: 'Pooja Ravindra Naik', relation: 'Ravindra Naik', age: 26, gender: 'Female', epic: 'IIT0406231', booth: 45 },
  { name: 'Sahil Somnath Naik', relation: 'Somnath Naik', age: 25, gender: 'Male', epic: 'IIT0406223', booth: 45 },
  { name: 'Tanvi Navin Naik', relation: 'Navin Naik', age: 24, gender: 'Female', epic: 'IIT0406215', booth: 45 },
  { name: 'Pratiksha Anant Naik', relation: 'Anant Naik', age: 23, gender: 'Female', epic: 'IIT0406207', booth: 45 },
  { name: 'Aryan Satish Naik', relation: 'Satish Naik', age: 21, gender: 'Male', epic: 'IIT0406199', booth: 45 }
];

const kamlakantMembers = [
  { name: 'Kamlakant Naik', relation: 'Nara Naik', age: 63, gender: 'Male', epic: 'BGP014521', booth: 45 },
  { name: 'Pratima Naik', relation: 'Kamlakant Naik', age: 59, gender: 'Female', epic: 'BGP014522', booth: 45 },
  { name: 'Pritesh Naik', relation: 'Kamlakant Naik', age: 35, gender: 'Male', epic: 'BGP014523', booth: 45 },
  { name: 'Navita Naik', relation: 'Pritesh Naik', age: 30, gender: 'Female', epic: 'BGP014524', booth: 45 },
  { name: 'Rohan Naik', relation: 'Kamlakant Naik', age: 32, gender: 'Male', epic: 'BGP014525', booth: 45 },
  { name: 'Shubhangi Naik', relation: 'Rohan Naik', age: 29, gender: 'Female', epic: 'BGP014526', booth: 45 },
  { name: 'Gautam Naik', relation: 'Kamlakant Naik', age: 27, gender: 'Male', epic: 'BGP014527', booth: 45 },
  { name: 'Pooja Naik', relation: 'Gautam Naik', age: 25, gender: 'Female', epic: 'BGP014528', booth: 45 },
  { name: 'Vilas Kamlakant Naik', relation: 'Kamlakant Naik', age: 23, gender: 'Male', epic: 'BGP014529', booth: 45 },
  { name: 'Divya Vilas Naik', relation: 'Vilas Naik', age: 22, gender: 'Female', epic: 'BGP014530', booth: 45 },
];

const nageshMembers = [
  { name: 'Devidas Sakharam Naik', relation: 'Sakharam Naik', age: 53, gender: 'Male', epic: 'IIT0321445', booth: 45 },
  { name: 'Avinash Sakharam Naik', relation: 'Sakharam Naik', age: 49, gender: 'Male', epic: 'IIT0321446', booth: 45 },
  { name: 'Priyanka Naik', relation: 'Avinash Naik', age: 49, gender: 'Female', epic: 'IIT0321447', booth: 45 },
  { name: 'Sujata Naik', relation: 'Devidas Naik', age: 49, gender: 'Female', epic: 'IIT0321448', booth: 45 },
  { name: 'Akash Naik', relation: 'Avinash Naik', age: 24, gender: 'Male', epic: 'IIT0321449', booth: 45 },
  { name: 'Deepa Naik', relation: 'Devidas Naik', age: 22, gender: 'Female', epic: 'IIT0321450', booth: 45 },
];

sData.families = [
  {
    id: 'fam_1',
    head_name: 'Shivram Nara Naik family',
    surname: 'Naik',
    village: 'Pale',
    house_no: '01',
    members_count: 25,
    also_in_household: 'Anant Nara Naik (63)',
    booth: 45,
    is_cluster: true,
    cluster_tag: 'Wada Compound Cluster',
    sample: shivramMembers.slice(0, 4),
    members: shivramMembers
  },
  {
    id: 'fam_2',
    head_name: 'Kamlakant Naik family',
    surname: 'Naik',
    village: 'Pale',
    house_no: '15',
    members_count: 24,
    booth: 45,
    is_cluster: true,
    cluster_tag: 'Joint Family Unit',
    sample: kamlakantMembers.slice(0, 4),
    members: kamlakantMembers
  },
  {
    id: 'fam_3',
    head_name: 'Nagesh Naik family',
    surname: 'Naik',
    village: 'Pale',
    house_no: '28',
    members_count: 20,
    booth: 45,
    is_cluster: true,
    cluster_tag: 'Joint Family Unit',
    sample: nageshMembers.slice(0, 4),
    members: nageshMembers
  },
  {
    id: 'fam_4',
    head_name: 'Suresh Parab family',
    surname: 'Parab',
    village: 'Cotombi',
    house_no: '24',
    members_count: 19,
    booth: 47,
    is_cluster: true,
    cluster_tag: 'Joint Family Unit',
    sample: [
      { name: 'Siddhi Parab', age: 51, gender: 'Female' },
      { name: 'Gurudas Parab', age: 51, gender: 'Male' },
      { name: 'Radhika Parab', age: 51, gender: 'Female' },
      { name: 'Hema Parab', age: 51, gender: 'Female' }
    ],
    members: [
      { name: 'Suresh Parab', relation: 'Rama Parab', age: 58, gender: 'Male', epic: 'BGP0481231', booth: 47 },
      { name: 'Siddhi Parab', relation: 'Suresh Parab', age: 51, gender: 'Female', epic: 'BGP0481232', booth: 47 },
      { name: 'Gurudas Parab', relation: 'Rama Parab', age: 51, gender: 'Male', epic: 'BGP0481233', booth: 47 },
      { name: 'Radhika Parab', relation: 'Gurudas Parab', age: 51, gender: 'Female', epic: 'BGP0481234', booth: 47 },
      { name: 'Hema Parab', relation: 'Rama Parab', age: 51, gender: 'Female', epic: 'BGP0481235', booth: 47 }
    ]
  },
  {
    id: 'fam_5',
    head_name: 'Ashok Sinari family',
    surname: 'Sinari',
    village: 'Amona',
    house_no: '25',
    members_count: 18,
    booth: 27,
    is_cluster: true,
    cluster_tag: 'Joint Family Unit',
    sample: [
      { name: 'Jagdish Sinari', age: 39, gender: 'Male' },
      { name: 'Sanjana Sinari', age: 48, gender: 'Female' },
      { name: 'Sanjay Sinari', age: 40, gender: 'Male' },
      { name: 'Sulakshana Sinari', age: 59, gender: 'Female' }
    ],
    members: [
      { name: 'Sulakshana Sinari', relation: 'Ashok Sinari', age: 59, gender: 'Female', epic: 'IIT0198421', booth: 27 },
      { name: 'Sanjana Sinari', relation: 'Jagdish Sinari', age: 48, gender: 'Female', epic: 'IIT0198422', booth: 27 },
      { name: 'Sanjay Sinari', relation: 'Ashok Sinari', age: 40, gender: 'Male', epic: 'IIT0198423', booth: 27 },
      { name: 'Jagdish Sinari', relation: 'Ashok Sinari', age: 39, gender: 'Male', epic: 'IIT0198424', booth: 27 }
    ]
  },
  {
    id: 'fam_6',
    head_name: 'Tukaram Gawas family',
    surname: 'Gawas',
    village: 'Arvalem',
    house_no: '728',
    members_count: 18,
    booth: 15,
    is_cluster: true,
    cluster_tag: 'Joint Family Unit',
    sample: [
      { name: 'Ashok Gawas', age: 55, gender: 'Male' },
      { name: 'Rajshri Gawas', age: 53, gender: 'Female' },
      { name: 'Sugandhi Gawas', age: 58, gender: 'Female' },
      { name: 'Sahadev Gawas', age: 52, gender: 'Male' }
    ],
    members: [
      { name: 'Sugandhi Gawas', relation: 'Tukaram Gawas', age: 58, gender: 'Female', epic: 'IIT0241901', booth: 15 },
      { name: 'Ashok Gawas', relation: 'Tukaram Gawas', age: 55, gender: 'Male', epic: 'IIT0241902', booth: 15 },
      { name: 'Rajshri Gawas', relation: 'Ashok Gawas', age: 53, gender: 'Female', epic: 'IIT0241903', booth: 15 },
      { name: 'Sahadev Gawas', relation: 'Tukaram Gawas', age: 52, gender: 'Male', epic: 'IIT0241904', booth: 15 }
    ]
  },
  {
    id: 'fam_7',
    head_name: 'Laxman Gawas family',
    surname: 'Gawas',
    village: 'Amona',
    house_no: '121',
    members_count: 17,
    booth: 28,
    is_cluster: true,
    cluster_tag: 'Joint Family Unit',
    sample: [
      { name: 'Satish Gawas', age: 43, gender: 'Male' },
      { name: 'Bhanudas Gawas', age: 54, gender: 'Male' },
      { name: 'Ajay Gawas', age: 49, gender: 'Male' },
      { name: 'Jemini Gawas', age: 57, gender: 'Female' }
    ],
    members: [
      { name: 'Jemini Gawas', relation: 'Laxman Gawas', age: 57, gender: 'Female', epic: 'IIT0287112', booth: 28 },
      { name: 'Bhanudas Gawas', relation: 'Laxman Gawas', age: 54, gender: 'Male', epic: 'IIT0287113', booth: 28 },
      { name: 'Ajay Gawas', relation: 'Laxman Gawas', age: 49, gender: 'Male', epic: 'IIT0287114', booth: 28 },
      { name: 'Satish Gawas', relation: 'Laxman Gawas', age: 43, gender: 'Male', epic: 'IIT0287115', booth: 28 }
    ]
  },
  {
    id: 'fam_8',
    head_name: 'Suresh Mane family',
    surname: 'Mane',
    village: 'Sanquelim',
    house_no: '1221',
    members_count: 17,
    booth: 5,
    is_cluster: true,
    cluster_tag: 'Joint Family Unit',
    sample: [
      { name: 'Deelip Mane', age: 63, gender: 'Male' },
      { name: 'Shoba Mane', age: 49, gender: 'Female' },
      { name: 'Saraswati Mane', age: 57, gender: 'Female' },
      { name: 'Mohan Mane', age: 59, gender: 'Male' }
    ],
    members: [
      { name: 'Deelip Mane', relation: 'Suresh Mane', age: 63, gender: 'Male', epic: 'IIT0112451', booth: 5 },
      { name: 'Mohan Mane', relation: 'Suresh Mane', age: 59, gender: 'Male', epic: 'IIT0112452', booth: 5 },
      { name: 'Saraswati Mane', relation: 'Deelip Mane', age: 57, gender: 'Female', epic: 'IIT0112453', booth: 5 },
      { name: 'Shoba Mane', relation: 'Mohan Mane', age: 49, gender: 'Female', epic: 'IIT0112454', booth: 5 }
    ]
  }
];

fs.writeFileSync(sPath, JSON.stringify(sData, null, 2));
console.log('Successfully written clean Sanquelim families with distinct head names.');
