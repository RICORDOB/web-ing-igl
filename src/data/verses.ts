export interface Verse {
  text: string;
  reference: string;
  type: "success" | "encouragement" | "streak" | "levelup" | "badge" | "error";
}

export const motivationalVerses: Verse[] = [
  {
    text: "I can do all things through Christ who strengthens me.",
    reference: "Philippians 4:13",
    type: "success",
  },
  {
    text: "Your word is a lamp to my feet and a light to my path.",
    reference: "Psalm 119:105",
    type: "success",
  },
  {
    text: "Well done, good and faithful servant!",
    reference: "Matthew 25:23",
    type: "levelup",
  },
  {
    text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
    reference: "Jeremiah 29:11",
    type: "levelup",
  },
  {
    text: "The righteous falls seven times and rises again.",
    reference: "Proverbs 24:16",
    type: "error",
  },
  {
    text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
    reference: "Joshua 1:9",
    type: "error",
  },
  {
    text: "His mercies are new every morning.",
    reference: "Lamentations 3:22-23",
    type: "error",
  },
  {
    text: "Let your light shine before others, that they may see your good deeds and glorify your Father in heaven.",
    reference: "Matthew 5:16",
    type: "success",
  },
  {
    text: "I have fought the good fight, I have finished the race, I have kept the faith.",
    reference: "2 Timothy 4:7",
    type: "levelup",
  },
  {
    text: "The Lord is my shepherd; I shall not want.",
    reference: "Psalm 23:1",
    type: "streak",
  },
  {
    text: "Trust in the Lord with all your heart and lean not on your own understanding.",
    reference: "Proverbs 3:5",
    type: "streak",
  },
  {
    text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles.",
    reference: "Isaiah 40:31",
    type: "badge",
  },
  {
    text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
    reference: "Philippians 4:6",
    type: "error",
  },
  {
    text: "I press on toward the goal to win the prize for which God has called me heavenward in Christ Jesus.",
    reference: "Philippians 3:14",
    type: "levelup",
  },
  {
    text: "God is our refuge and strength, an ever-present help in trouble.",
    reference: "Psalm 46:1",
    type: "streak",
  },
  {
    text: "Thy word have I hid in mine heart, that I might not sin against thee.",
    reference: "Psalm 119:11",
    type: "success",
  },
  {
    text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
    reference: "John 3:16",
    type: "badge",
  },
  {
    text: "The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you.",
    reference: "Numbers 6:24-25",
    type: "levelup",
  },
  {
    text: "Do not let your hearts be troubled. You believe in God; believe also in me.",
    reference: "John 14:1",
    type: "error",
  },
  {
    text: "Every good and perfect gift is from above, coming down from the Father of the heavenly lights.",
    reference: "James 1:17",
    type: "badge",
  },
];
