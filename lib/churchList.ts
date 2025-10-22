// Ethiopian Evangelical Churches

export const churches = [
  "Ethiopian Evangelical Church Mekane Yesus",
  "Ethiopian Kale Heywet Church",
  "Mulu Wongel (Full Gospel Believers' Church)",
  "Meserete Kristos Church",
  "Addis Kidan Baptist Church",
  "Hiwot Berhan Church",
  "Beza International Church",
  "Emmanuel United Church",
  "Genet Evangelical Church",
  "Assembly of God Church",
  "Faith Bible International Church",
  "Other Evangelical churches",
] as const;

export type Church = typeof churches[number];

