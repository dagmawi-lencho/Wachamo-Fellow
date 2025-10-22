// Wachamo University Fellowship Teams

export const fellowshipTeams = [
  "Not joined to any team",
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

// Leadership Roles
export const leadershipRoles = [
  "Main Leader",
  "Team Leader",
  "Family Leader (Mother)",
  "Family Leader (Father)",
  "Not a Leader",
] as const;

export type LeadershipRole = typeof leadershipRoles[number];

// Spiritual Gifts
export const spiritualGifts = [
  "Teaching",
  "Giving",
  "Leadership (Administration)",
  "Evangelism",
  "Prayer Gift (Intercession)",
  "Singing",
  "Art",
  "Others",
] as const;

export type SpiritualGift = typeof spiritualGifts[number];

