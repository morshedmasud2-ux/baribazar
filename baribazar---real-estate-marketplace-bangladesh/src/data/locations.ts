export interface DistrictOption {
  id: string;
  name: string;
  nameBn: string;
  popularAreas: { id: string; name: string; nameBn: string }[];
}

export interface DivisionOption {
  id: string;
  name: string;
  nameBn: string;
  districts: DistrictOption[];
}

export const BANGLADESH_DIVISIONS: DivisionOption[] = [
  {
    id: 'dhaka',
    name: 'Dhaka',
    nameBn: 'ঢাকা',
    districts: [
      {
        id: 'dhaka-city',
        name: 'Dhaka City',
        nameBn: 'ঢাকা মহানগর',
        popularAreas: [
          { id: 'gulshan', name: 'Gulshan', nameBn: 'গুলশান' },
          { id: 'banani', name: 'Banani', nameBn: 'বনানী' },
          { id: 'dhanmondi', name: 'Dhanmondi', nameBn: 'ধানমন্ডি' },
          { id: 'uttara', name: 'Uttara', nameBn: 'উত্তরা' },
          { id: 'bashundhara', name: 'Bashundhara R/A', nameBn: 'বসুন্ধরা আ/এ' },
          { id: 'mirpur', name: 'Mirpur', nameBn: 'মিরপুর' },
          { id: 'mohammadpur', name: 'Mohammadpur', nameBn: 'মোহাম্মদপুর' },
          { id: 'baridhara', name: 'Baridhara', nameBn: 'বারিধারা' },
          { id: 'badda', name: 'Badda', nameBn: 'বাড্ডা' },
          { id: 'motijheel', name: 'Motijheel Commercial', nameBn: 'মতিঝিল বাণিজ্যিক এলাকা' },
          { id: 'purbachal', name: 'Purbachal New Town', nameBn: 'পূর্বাচল নতুন শহর' },
          { id: 'keraniganj', name: 'Keraniganj', nameBn: 'কেরানীগঞ্জ' },
        ],
      },
      {
        id: 'gazipur',
        name: 'Gazipur',
        nameBn: 'গাজীপুর',
        popularAreas: [
          { id: 'tongi', name: 'Tongi', nameBn: 'টঙ্গী' },
          { id: 'joydebpur', name: 'Joydebpur', nameBn: 'জয়দেবপুর' },
          { id: 'konabari', name: 'Konabari', nameBn: 'কোনাবাড়ী' },
        ],
      },
      {
        id: 'narayanganj',
        name: 'Narayanganj',
        nameBn: 'নারায়ণগঞ্জ',
        popularAreas: [
          { id: 'fatullah', name: 'Fatullah', nameBn: 'ফতুল্লা' },
          { id: 'chashara', name: 'Chashara', nameBn: 'চাষাঢ়া' },
          { id: 'siddhirganj', name: 'Siddhirganj', nameBn: 'সিদ্ধিরগঞ্জ' },
        ],
      },
    ],
  },
  {
    id: 'chittagong',
    name: 'Chittagong',
    nameBn: 'চট্টগ্রাম',
    districts: [
      {
        id: 'chittagong-city',
        name: 'Chittagong City',
        nameBn: 'চট্টগ্রাম মহানগর',
        popularAreas: [
          { id: 'nasirabad', name: 'Nasirabad', nameBn: 'নাসিরাবাদ' },
          { id: 'khulshi', name: 'Khulshi', nameBn: 'খুলশী' },
          { id: 'agrabad', name: 'Agrabad Commercial Area', nameBn: 'আগ্রাবাদ বাণিজ্যিক এলাকা' },
          { id: 'panchlaish', name: 'Panchlaish', nameBn: 'পাঁচলাইশ' },
          { id: 'halishahar', name: 'Halishahar', nameBn: 'হালিশহর' },
          { id: 'gEC', name: 'GEC Circle', nameBn: 'জিইসি মোড়' },
        ],
      },
      {
        id: 'coxs-bazar',
        name: "Cox's Bazar",
        nameBn: 'কক্সবাজার',
        popularAreas: [
          { id: 'marine-drive', name: 'Marine Drive Road', nameBn: 'মেরিন ড্রাইভ রোড' },
          { id: 'kolatoli', name: 'Kolatoli', nameBn: 'কলাতলী' },
        ],
      },
    ],
  },
  {
    id: 'sylhet',
    name: 'Sylhet',
    nameBn: 'সিলেট',
    districts: [
      {
        id: 'sylhet-city',
        name: 'Sylhet City',
        nameBn: 'সিলেট মহানগর',
        popularAreas: [
          { id: 'upashahar', name: 'Shahjalal Upashahar', nameBn: 'শাহজালাল উপশহর' },
          { id: 'zindabazar', name: 'Zindabazar', nameBn: 'জিন্দাবাজার' },
          { id: 'amberkhana', name: 'Amberkhana', nameBn: 'আম্বরখানা' },
          { id: 'shibganj', name: 'Shibganj', nameBn: 'শিবগঞ্জ' },
        ],
      },
    ],
  },
  {
    id: 'rajshahi',
    name: 'Rajshahi',
    nameBn: 'রাজশাহী',
    districts: [
      {
        id: 'rajshahi-city',
        name: 'Rajshahi City',
        nameBn: 'রাজশাহী মহানগর',
        popularAreas: [
          { id: 'motihar', name: 'Motihar', nameBn: 'মতিহার' },
          { id: 'shaheb-bazar', name: 'Shaheb Bazar', nameBn: 'সাহেব বাজার' },
          { id: 'kazihata', name: 'Kazihata', nameBn: 'কাজীহাটা' },
        ],
      },
    ],
  },
  {
    id: 'khulna',
    name: 'Khulna',
    nameBn: 'খুলনা',
    districts: [
      {
        id: 'khulna-city',
        name: 'Khulna City',
        nameBn: 'খুলনা মহানগর',
        popularAreas: [
          { id: 'sonadanga', name: 'Sonadanga', nameBn: 'সোনাডাঙ্গা' },
          { id: 'khalishpur', name: 'Khalishpur', nameBn: 'খালিশপুর' },
          { id: 'boyra', name: 'Boyra', nameBn: 'বয়রা' },
        ],
      },
    ],
  },
  {
    id: 'barishal',
    name: 'Barishal',
    nameBn: 'বরিশাল',
    districts: [
      {
        id: 'barishal-city',
        name: 'Barishal City',
        nameBn: 'বরিশাল মহানগর',
        popularAreas: [
          { id: 'sadar-road', name: 'Sadar Road', nameBn: 'সদর রোড' },
          { id: 'rupatali', name: 'Rupatali', nameBn: 'রূপাতলী' },
        ],
      },
    ],
  },
  {
    id: 'rangpur',
    name: 'Rangpur',
    nameBn: 'রংপুর',
    districts: [
      {
        id: 'rangpur-city',
        name: 'Rangpur City',
        nameBn: 'রংপুর মহানগর',
        popularAreas: [
          { id: 'dhap', name: 'Dhap', nameBn: 'ধাপ' },
          { id: 'modern-mor', name: 'Modern Mor', nameBn: 'মডার্ন মোড়' },
        ],
      },
    ],
  },
  {
    id: 'mymensingh',
    name: 'Mymensingh',
    nameBn: 'ময়মনসিংহ',
    districts: [
      {
        id: 'mymensingh-city',
        name: 'Mymensingh City',
        nameBn: 'ময়মনসিংহ মহানগর',
        popularAreas: [
          { id: 'charpara', name: 'Charpara', nameBn: 'চরপাড়া' },
          { id: 'town-hall', name: 'Town Hall Area', nameBn: 'টাউন হল এলাকা' },
        ],
      },
    ],
  },
];
