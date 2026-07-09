import {
  SlideItem,
  FixtureItem,
  ResultItem,
  NewsItem,
  PlayerItem,
  LiveScoreMatch,
  StandingFootballRow,
  StandingCricketRow,
  PopularTeamItem,
} from "@/types";

// Hero Banner Slides
export const heroSlides: SlideItem[] = [
  {
    image: "/assets/imgs/banner/news-banner_1.webp",
    title: "Australia's Masterclass Powers Team to Thrilling Win",
    desc: "Australia clinch a nerve-wracking 6-run victory in a high-scoring ICC ODI against India.",
  },
  {
    image: "/assets/imgs/banner/news-banner_2.webp",
    title: "TV channel, how to watch, kick-off time, live stream",
    desc: "Having eased past Jordan in their final group game to top Group J, Argentina reinforced.",
  },
  {
    image: "/assets/imgs/banner/news-banner_3.webp",
    title: "ETPL crucial in making cricket a global sport",
    desc: "The former India allrounder believes that a short format like T20 cricket is key to the sport's success in Europe.",
  },
  {
    image: "/assets/imgs/banner/news-banner_4.webp",
    title: "Crows comeback falls short against Suns",
    desc: "Adelaide has fallen a goal short of a late comeback against Gold Coast in the Club's opening game of 2024.",
  },
];

// Upcoming Fixtures
export const upcomingFixtures: FixtureItem[] = [
  {
    league: "IPL 2024",
    home: "MI",
    away: "SRH",
    homeLogo: "/assets/imgs/teams/ipl/MIoutline.png",
    awayLogo: "/assets/imgs/teams/ipl/SRHoutline.png",
    day: "Today",
    time: "7:30 PM",
    venue: "Wankhede Stadium",
    type: "cricket",
  },
  {
    league: "Premier League",
    home: "Liverpool",
    away: "Tottenham",
    homeLogo: "/assets/imgs/teams/Liverpool_FC.svg",
    awayLogo: "/assets/imgs/teams/Tottenham_Hotspur.png",
    day: "Today",
    time: "8:30 PM",
    venue: "Anfield, Liverpool",
    type: "football",
  },
  {
    league: "NFL • Regular Season",
    home: "49ers",
    away: "Cowboys",
    homeLogo: "/assets/imgs/teams/San_Francisco_49ers_logo.svg",
    awayLogo: "/assets/imgs/teams/Dallas_Cowboys.svg",
    day: "Tomorrow",
    time: "6:00 AM",
    venue: "Levi's Stadium",
    type: "NFL",
  },
  {
    league: "IPL 2024",
    home: "DC",
    away: "KKR",
    homeLogo: "/assets/imgs/teams/ipl/DCoutline.png",
    awayLogo: "/assets/imgs/teams/ipl/KKRoutline.png",
    day: "Today",
    time: "7:30 PM",
    venue: "Eden Garden Stadium",
    type: "cricket",
  },
];

// Recent Results
export const recentResults: ResultItem[] = [
  {
    league: "Premier League",
    home: "Man Utd",
    away: "Newcastle",
    homeLogo: "/assets/imgs/teams/Manchester_United_FC_crest.png",
    awayLogo: "/assets/imgs/teams/Newcastle_United_Logo.svg",
    score: "2 - 1",
    result: "Man Utd won by 2 goals",
    date: "May 12",
    type: "football",
  },
  {
    league: "IPL 2024",
    home: "CSK",
    away: "RCB",
    homeLogo: "/assets/imgs/teams/ipl/CSKoutline.png",
    awayLogo: "/assets/imgs/teams/ipl/RCBoutline.png",
    homeScore: "190/3 (19.1)",
    awayScore: "185 (18.4)",
    result: "CSK won by 7 wickets",
    date: "May 11",
    type: "cricket",
  },
  {
    league: "NFL",
    home: "Ravens",
    away: "Bengals",
    homeLogo: "/assets/imgs/teams/Ravens_logo.svg",
    awayLogo: "/assets/imgs/teams/Bengals_logo.svg",
    score: "20 - 17",
    result: "Ravens won by 3 points",
    date: "May 12",
    type: "NFL",
  },
  {
    league: "AFL",
    home: "Brisbane",
    away: "Essendon",
    homeLogo: "/assets/imgs/teams/Brisbane_Lions_logo_2010.svg",
    awayLogo: "/assets/imgs/teams/Essendon_FC_logo.svg",
    score: "101 - 78",
    result: "Brisbane Lions won by 23 points",
    date: "May 12",
    type: "AFL",
  },
];

// Popular Players
export const popularPlayers: PlayerItem[] = [
  {
    image: "/assets/imgs/players/steve-smith.jpg",
    name: "Steve Smith",
    team: "Australia",
    sport: "cricket",
  },
  {
    image: "/assets/imgs/players/Erling-Haaland.jpg",
    name: "Erling Haaland",
    team: "Man City",
    sport: "football",
  },
  {
    image: "/assets/imgs/players/Patrick-Mahomes.jpg",
    name: "Patrick Mahomes",
    team: "Chiefs",
    sport: "NFL",
  },
  {
    image: "/assets/imgs/players/ellyse-perry.jpg",
    name: "Ellyse Perry",
    team: "Australia Women",
    sport: "cricket",
  },
  {
    image: "/assets/imgs/players/Josh-Dunkley.jpg",
    name: "Josh Dunkley",
    team: "Western Bulldogs",
    sport: "AFL",
  },
  {
    image: "/assets/imgs/players/Virat-Kohli.jpg",
    name: "Virat Kohli",
    team: "India",
    sport: "cricket",
  },
];

// Live Scores
export const liveScoresData: LiveScoreMatch[] = [
  {
    league: "IPL 2026 • Match 45",
    status: "LIVE",
    homeTeam: "CSK",
    homeLogo: "/assets/imgs/teams/ipl/CSKoutline.png",
    homeScore: "174/3",
    homeOvers: "(19.1)",
    awayTeam: "RCB",
    awayLogo: "/assets/imgs/teams/ipl/RCBoutline.png",
    awayScore: "185",
    awayOvers: "(18.4)",
    note: "CSK need 12 runs from 5 balls",
    sport: "cricket",
  },
  {
    league: "Premier League",
    status: "76'",
    time: "76'",
    homeTeam: "Man City",
    homeLogo: "/assets/imgs/teams/Manchester_City_FC_badge.svg",
    homeScore: "2",
    awayTeam: "Arsenal",
    awayLogo: "/assets/imgs/teams/Arsenal_FC.svg",
    awayScore: "1",
    sport: "football",
  },
  {
    league: "NFL • Regular Season",
    status: "Q3 08:24",
    time: "Q3 08:24",
    homeTeam: "Kansas City Chiefs",
    homeLogo: "/assets/imgs/teams/Kansas_City_Chiefs_logo.svg",
    homeScore: "17",
    awayTeam: "Buffalo Bills",
    awayLogo: "/assets/imgs/teams/Buffalo_Bills_logo.svg",
    awayScore: "14",
    venue: "GEHA Field at Arrowhead Stadium",
    sport: "NFL",
  },
  {
    league: "PSL 2026 • Match 21",
    status: "LIVE",
    homeTeam: "LQ",
    homeLogo: "/assets/imgs/teams/zalmi.webp",
    homeScore: "168/4",
    homeOvers: "(16.3)",
    awayTeam: "PZ",
    awayLogo: "/assets/imgs/teams/qalandar.webp",
    awayScore: "199/9",
    awayOvers: "(20)",
    note: "Qalandars need 32 runs from 3.3 overs",
    sport: "cricket",
  },
];

// Standings
export const footballPLData: StandingFootballRow[] = [
  { rank: 1, team: "Arsenal", logo: "/assets/imgs/teams/Arsenal_FC.svg", played: 37, gd: "+61", points: 86 },
  { rank: 2, team: "Man City", logo: "/assets/imgs/teams/Manchester_City_FC_badge.svg", played: 37, gd: "+45", points: 85 },
  { rank: 3, team: "Liverpool", logo: "/assets/imgs/teams/Liverpool_FC.svg", played: 37, gd: "+39", points: 78 },
  { rank: 4, team: "Arsenal", logo: "/assets/imgs/teams/Arsenal_FC.svg", played: 37, gd: "+61", points: 86 },
  { rank: 5, team: "Man City", logo: "/assets/imgs/teams/Manchester_City_FC_badge.svg", played: 37, gd: "+45", points: 85 },
  { rank: 6, team: "Liverpool", logo: "/assets/imgs/teams/Liverpool_FC.svg", played: 37, gd: "+39", points: 78 },
];

export const cricketIPLData: StandingCricketRow[] = [
  { rank: 1, team: "CSK", logo: "/assets/imgs/teams/ipl/CSKoutline.png", matches: 14, nrr: "+0.65", points: 19 },
  { rank: 2, team: "MI", logo: "/assets/imgs/teams/ipl/MIoutline.png", matches: 14, nrr: "+0.65", points: 16 },
  { rank: 3, team: "SRH", logo: "/assets/imgs/teams/ipl/SRHoutline.png", matches: 14, nrr: "+0.65", points: 18 },
  { rank: 4, team: "RCB", logo: "/assets/imgs/teams/ipl/RCBoutline.png", matches: 14, nrr: "+0.65", points: 18 },
  { rank: 5, team: "KKR", logo: "/assets/imgs/teams/ipl/KKRoutline.png", matches: 14, nrr: "+0.65", points: 18 },
  { rank: 6, team: "RR", logo: "/assets/imgs/teams/ipl/RRoutline.png", matches: 14, nrr: "+0.65", points: 18 },
  { rank: 7, team: "GT", logo: "/assets/imgs/teams/ipl/GToutline.png", matches: 14, nrr: "+0.65", points: 18 },
  { rank: 8, team: "LSG", logo: "/assets/imgs/teams/ipl/LSGoutline.png", matches: 14, nrr: "+0.65", points: 18 },
  { rank: 9, team: "PBK", logo: "/assets/imgs/teams/ipl/PBKSoutline.png", matches: 14, nrr: "+0.65", points: 18 },
  { rank: 10, team: "LSG", logo: "/assets/imgs/teams/ipl/LSGoutline.png", matches: 14, nrr: "+0.65", points: 18 },
];

// Popular Teams
export const popularTeamsData: PopularTeamItem[] = [
  {
    id: "australia-cricket",
    name: "Australia",
    sport: "Cricket",
    logo: "/assets/imgs/teams/australia.webp",
  },
  {
    id: "india-cricket",
    name: "India",
    sport: "Cricket",
    logo: "/assets/imgs/teams/india.webp",
  },
  {
    id: "man-united",
    name: "Man United",
    sport: "Football",
    logo: "/assets/imgs/teams/Manchester_United_FC_crest.png",
  },
  {
    id: "australia-women-cricket",
    name: "Australia Women",
    sport: "Cricket",
    logo: "/assets/imgs/teams/australia.webp",
  },
  {
    id: "patriots-nfl",
    name: "New England Patriots",
    sport: "NFL",
    logo: "/assets/imgs/teams/Essendon_FC_logo.svg",
  },
  {
    id: "collingwood-afl",
    name: "Collingwood",
    sport: "AFL",
    logo: "/assets/imgs/teams/new-zealand.webp",
  },
  {
    id: "arsenal-football",
    name: "Arsenal",
    sport: "Football",
    logo: "/assets/imgs/teams/Arsenal_FC.svg",
  },
];

// Cricket News
export const cricketNewsData: NewsItem[] = [
  {
    image: "/assets/imgs/news/419499.6.webp",
    title: "Greaves, Hope tons keep Sri Lanka at bay",
    description: "The two centurions put on 242 off 459 deliveries in a single-wicket session",
    date: "06-Jul-2026 • 2 hrs ago",
  },
  {
    image: "/assets/imgs/news/419254.6.webp",
    title: "New-look India in unfamiliar T20I rut",
    description: "England have issues of their own to sort after Ben Stokes' retirement, but they lead this series 1-0",
    date: "06-Jul-2026 • 4 hrs ago",
  },
  {
    image: "/assets/imgs/news/414574.6.webp",
    title: "Sanju Samson left out of India's T20I squad for Zimbabwe tour",
    description: "Shivam Dube replaces injured Nitish Kumar Reddy in ODI squad for England series",
    date: "06-Jul-2026 • 4 hrs ago • Cricinfo staff",
  },
  {
    image: "/assets/imgs/news/383473.6.webp",
    title: "Hampshire secure double signing to lead post-Vince and Dawson rebuild",
    description: "Rishi Patel and Fynn Hudson-Prentice to join from Leicestershire and Sussex respectively",
    date: "06-Jul-2026 • 6 hrs ago",
  },
  {
    image: "/assets/imgs/news/411999.6.webp",
    title: "Hosein, Moqim to play for Perth Scorchers in Global Super League",
    description: "Regular captain Ashton Turner will lead the team which also includes Jhye Richardson and Aaron Hardie",
    date: "06-Jul-2026 • 10 hrs ago",
  },
];

// Football News
export const footballNewsData: NewsItem[] = [
  {
    image: "/assets/imgs/news/england-mexico.jpg",
    title: "England's World Cup campaign takes flight with thrilling 3-2 Mexico win",
    description: "Jude Bellingham's quickfire double and a heroic rearguard action seal quarter-final spot despite Jarell Quansah's red card.",
    date: "06-Jul-2026 • 1 hr ago • SuperSport",
  },
  {
    image: "/assets/imgs/news/haaland-brazil.webp",
    title: "Erling Haaland's late double knocks Brazil out of the World Cup",
    description: "Norway stun the five-time winners 2-1 to reach the quarter-finals, setting up a blockbuster clash with England.",
    date: "06-Jul-2026 • 12 hrs ago • Sky Sports",
  },
  {
    image: "/assets/imgs/news/neymar-retires.jpg",
    title: "Neymar calls time on Brazil career following early World Cup elimination",
    description: "The legendary forward announces his international retirement shortly after scoring a stoppage-time penalty in the defeat to Norway.",
    date: "06-Jul-2026 • 14 hrs ago • Goal.com",
  },
  {
    image: "/assets/imgs/news/switzerland-colombia.webp",
    title: "Switzerland v Colombia: Steel meets fire in high-stakes Round of 16 showdown",
    description: "Granit Xhaka's disciplined Swiss side prepare to face a passionate Colombian team missing the injured Jhon Córdoba.",
    date: "06-Jul-2026 • 9 hrs ago • SuperSport",
  },
  {
    image: "/assets/imgs/news/tonali-spurs.jpg",
    title: "Sandro Tonali joins Tottenham in club-record £100m deal from Newcastle",
    description: "Spurs make a massive statement in the summer transfer window by securing the highly coveted Italian midfielder.",
    date: "06-Jul-2026 • 19 hrs ago • TribalFootball",
  },
];

// NFL News
export const nflNewsData: NewsItem[] = [
  {
    image: "/assets/imgs/news/aaron-rodgers-steelers.jpg",
    title: "Aaron Rodgers reunites with Mike McCarthy's offense in Pittsburgh",
    description: "The veteran QB says \"It's stuff that we used to run\" as he prepares for his second season with the Steelers under their new head coach.",
    date: "06-Jul-2026 • 2 hrs ago • NFL.com",
  },
  {
    image: "/assets/imgs/news/james-cook-bills.jpg",
    title: "Bills' James Cook undervalued in latest NFL running back rankings",
    description: "Despite leading the entire league in rushing yards in 2025, Cook landed at No. 7 in the latest positional rankings voted on by NFL personnel.",
    date: "06-Jul-2026 • 4 hrs ago • ESPN",
  },
  {
    image: "/assets/imgs/news/aj-brown-patriots.jpg",
    title: "A.J. Brown building early chemistry with Drake Maye in New England",
    description: "After a blockbuster trade from the Eagles, the wideout says he has found himself in \"heaven\" with the reigning AFC champions.",
    date: "06-Jul-2026 • 6 hrs ago • CBS Sports",
  },
  {
    image: "/assets/imgs/news/jalen-hurts-eagles.jpg",
    title: "Jalen Hurts prepares to lead revamped Eagles offense under new OC",
    description: "The Super Bowl LIX MVP is gearing up for training camp as Philadelphia looks to integrate Andy Dalton and a new system under Sean Mannion.",
    date: "06-Jul-2026 • 10 hrs ago • PhiladelphiaEagles.com",
  },
  {
    image: "/assets/imgs/news/caleb-williams-pope.jpg",
    title: "Bears QB Caleb Williams gifts autographed jersey to Pope Leo XIV",
    description: "The Chicago Bears quarterback sent a signed jersey to the Chicago native pontiff over the July 4th holiday weekend.",
    date: "06-Jul-2026 • 12 hrs ago • NFL.com",
  },
];

// AFL News
export const aflNewsData: NewsItem[] = [
  {
    image: "/assets/imgs/news/budarick-injury.jpg",
    title: "Surgery puts impressive new Dog's season in doubt",
    description: "Western Bulldogs recruit Connor Budarick could miss the remainder of the season due to a serious ankle injury.",
    date: "06-Jul-2026 • 12 hrs ago • AFL.com.au",
  },
  {
    image: "/assets/imgs/news/carlton-blues.jpg",
    title: "Blues survive late scare to stay perfect under caretaker coach",
    description: "Carlton has survived a late Richmond charge to continue its perfect 7-0 run under caretaker coach Josh Fraser at the MCG.",
    date: "05-Jul-2026 • 1 day ago • Fox Sports",
  },
  {
    image: "/assets/imgs/news/crows-eagles.jpg",
    title: "Fogarty kicks four as Crows bounce back to beat Eagles",
    description: "Adelaide have rebounded from last week's shock loss to get their top-four hopes back on track in a dominant display.",
    date: "06-Jul-2026 • 10 hrs ago • 7NEWS",
  },
  {
    image: "/assets/imgs/news/wardlaw-kangaroos.webp",
    title: "Wardlaw injury set to cloud Roos' week as Burgoyne stars in Power win",
    description: "North Melbourne will await scans on George Wardlaw as they fight for a wildcard place following a disappointing day.",
    date: "06-Jul-2026 • 14 hrs ago • AFL.com.au",
  },
];
