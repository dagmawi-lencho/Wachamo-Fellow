// Wachamo University Fellowship Teams

export const fellowshipTeams = [
  "BSC",
  "Discipleship",
  "Counseling",
  "Kadosh",
  "Tushia",
  "Evange mobilizers",
  "Pray mobilizers",
  "Love sharing",
  "Media",
  "Medicine team",
  "Health team",
  "Sisters ministry",
  "Natanims",
  "Fundraising team",
] as const;

export type FellowshipTeam = typeof fellowshipTeams[number];

