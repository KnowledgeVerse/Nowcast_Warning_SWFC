// ---------- District data ----------
const districtsData = [
  { id: 1, name: "ARARIA", hindi: "अररिया", email: "dm-araria.bih@nic.in" },
  { id: 2, name: "ARWAL", hindi: "अरवल", email: "dm-arwal.bih@nic.in" },
  {
    id: 3,
    name: "AURANGABAD",
    hindi: "औरंगाबाद",
    email: "dm-aurangabad.bih@nic.in",
  },
  { id: 4, name: "BANKA", hindi: "बांका", email: "dm-banka.bih@nic.in" },
  {
    id: 5,
    name: "BEGUSARAI",
    hindi: "बेगूसराय",
    email: "dm-begusarai.bih@nic.in",
  },
  { id: 6, name: "BHABUA", hindi: "भभुआ", email: "dm-kaimur.bih@nic.in" },
  {
    id: 7,
    name: "BHAGALPUR",
    hindi: "भागलपुर",
    email: "dm-bhagalpur.bih@nic.in",
  },
  { id: 8, name: "BHOJPUR", hindi: "भोजपुर", email: "dm-bhojpur.bih@nic.in" },
  { id: 9, name: "BUXAR", hindi: "बक्सर", email: "dm-buxar.bih@nic.in" },
  {
    id: 10,
    name: "DARBHANGA",
    hindi: "दरभंगा",
    email: "dm-darbhanga.bih@nic.in",
  },
  {
    id: 11,
    name: "EAST CHAMPARAN",
    hindi: "पूर्वी चंपारण",
    email: "dm-eastchamparan.bih@nic.in",
  },
  { id: 12, name: "GAYA", hindi: "गया", email: "dm-gaya.bih@nic.in" },
  {
    id: 13,
    name: "GOPALGANJ",
    hindi: "गोपालगंज",
    email: "dm-gopalganj.bih@nic.in",
  },
  {
    id: 14,
    name: "JAHANABAD",
    hindi: "जहानाबाद",
    email: "dm-jehanabad.bih@nic.in",
  },
  { id: 15, name: "JAMUI", hindi: "जमुई", email: "dm-jamui.bih@nic.in" },
  { id: 16, name: "KATIHAR", hindi: "कटिहार", email: "dm-katihar.bih@nic.in" },
  {
    id: 17,
    name: "KHAGARIA",
    hindi: "खगड़िया",
    email: "dm-khagaria.bih@nic.in",
  },
  {
    id: 18,
    name: "KISHANGANJ",
    hindi: "किशनगंज",
    email: "dm-kishanganj.bih@nic.in",
  },
  {
    id: 19,
    name: "LAKHISARAI",
    hindi: "लखीसराय",
    email: "dm-lakhisarai.bih@nic.in",
  },
  {
    id: 20,
    name: "MADHEPURA",
    hindi: "मधेपुरा",
    email: "dm-madhepura.bih@nic.in",
  },
  {
    id: 21,
    name: "MADHUBANI",
    hindi: "मधुबनी",
    email: "dm-madhubani.bih@nic.in",
  },
  { id: 22, name: "MONGHYR", hindi: "मुंगेर", email: "dm-munger.bih@nic.in" },
  {
    id: 23,
    name: "MUZAFFARPUR",
    hindi: "मुजफ्फरपुर",
    email: "dm-muzaffarpur.bih@nic.in",
  },
  { id: 24, name: "NALANDA", hindi: "नालंदा", email: "dm-nalanda.bih@nic.in" },
  { id: 25, name: "NAWADA", hindi: "नवादा", email: "dm-nawada.bih@nic.in" },
  {
    id: 26,
    name: "PATNA",
    hindi: "पटना",
    email: "dm-patna.bih@nic.in, dmpat-bih@nic.in",
  },
  { id: 27, name: "PURNEA", hindi: "पूर्णिया", email: "dm-purnia.bih@nic.in" },
  { id: 28, name: "ROHTAS", hindi: "रोहतास", email: "dm-rohtas.bih@nic.in" },
  { id: 29, name: "SAHARSA", hindi: "सहरसा", email: "dm-saharsa.bih@nic.in" },
  {
    id: 30,
    name: "SAMASTIPUR",
    hindi: "समस्तीपुर",
    email: "dm-samastipur.bih@nic.in",
  },
  { id: 31, name: "SARAN", hindi: "सारण", email: "dm-saran.bih@nic.in" },
  {
    id: 32,
    name: "SHEIKHPURA",
    hindi: "शेखपुरा",
    email: "dm-sheikhpura.bih@nic.in",
  },
  { id: 33, name: "SHEOHAR", hindi: "शिवहर", email: "dm-sheohar.bih@nic.in" },
  {
    id: 34,
    name: "SITAMARHI",
    hindi: "सीतामढ़ी",
    email: "dm-sitamarhi.bih@nic.in",
  },
  { id: 35, name: "SIWAN", hindi: "सिवान", email: "dm-siwan.bih@nic.in" },
  { id: 36, name: "SUPAUL", hindi: "सुपौल", email: "dm-supaul.bih@nic.in" },
  {
    id: 37,
    name: "VAISHALI",
    hindi: "वैशाली",
    email: "dm-vaishali.bih@nic.in",
  },
  {
    id: 38,
    name: "WEST CHAMPARAN",
    hindi: "पश्चिमी चंपारण",
    email: "dm-westchamparan.bih@nic.in",
  },
];

// ---------- Regional groups ----------
const subRegionDistricts = {
  nw: [38, 11, 13, 35, 31],
  nc: [23, 37, 34, 33, 10, 30, 21],
  ne: [36, 1, 18, 27, 16, 20, 29],
  sw: [28, 6, 8, 9, 2, 3],
  sc: [26, 24, 14, 25, 12, 19, 32, 5],
  se: [15, 22, 4, 17, 7],
  fh: [38, 11, 33, 34, 21, 36, 1, 18],
};

const regionalGroups = {
  foothill: {
    name: "उत्तर बिहार के तराई से सटे जिले",
    english: "North Bihar Foothill Districts",
    districts: subRegionDistricts.fh,
  },
  northern: {
    name: "उत्तरी बिहार",
    english: "Northern Region",
    districts: [
      ...subRegionDistricts.nw,
      ...subRegionDistricts.nc,
      ...subRegionDistricts.ne,
    ].sort((a, b) => a - b),
  },
  southern: {
    name: "दक्षिणी बिहार",
    english: "Southern Region",
    districts: [
      ...subRegionDistricts.sw,
      ...subRegionDistricts.sc,
      ...subRegionDistricts.se,
    ].sort((a, b) => a - b),
  },
  "north-west": {
    name: "उत्तर-पश्चिम क्षेत्र",
    english: "North-West Region",
    districts: subRegionDistricts.nw,
  },
  "north-central": {
    name: "उत्तर-मध्य क्षेत्र",
    english: "North-Central Region",
    districts: subRegionDistricts.nc,
  },
  "north-east": {
    name: "उत्तर-पूर्व क्षेत्र",
    english: "North-East Region",
    districts: subRegionDistricts.ne,
  },
  "south-west": {
    name: "दक्षिण-पश्चिम क्षेत्र",
    english: "South-West Region",
    districts: subRegionDistricts.sw,
  },
  "south-central": {
    name: "दक्षिण-मध्य क्षेत्र",
    english: "South-Central Region",
    districts: subRegionDistricts.sc,
  },
  "south-east": {
    name: "दक्षिण-पूर्व क्षेत्र",
    english: "South-East Region",
    districts: subRegionDistricts.se,
  },
};

// ---------- Utility ----------
function getDistrictNameById(id) {
  const d = districtsData.find((x) => x.id === parseInt(id));
  return d ? { name: d.name, hindi: d.hindi } : null;
}
