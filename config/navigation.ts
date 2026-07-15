export interface MenuItem {
  title: string;
  href: string;
  children?: MenuItem[];
  hideArrow?: boolean;
  icon?: string;
}

export const mainMenuItems: MenuItem[] = [
  {
    title: "Cricket",
    href: "#",
    children: [
      { title: "Latest News", href: "/news?category=Cricket" },
      {
        title: "Tournaments",
        href: "#",
        children: [
          { title: "IPL 2026", href: "/ipl" },
          { title: "T20 World Cup", href: "/t20-world-cup" },
          { title: "Ashes", href: "/ashes" },
        ],
      },
      { title: "Rankings", href: "/rankings" },
    ],
  },
  {
    title: "Football",
    href: "#",
    children: [
      { title: "Premier League", href: "/premier-league" },
      { title: "La Liga", href: "/la-liga" },
      { title: "Champions League", href: "/champions-league" },
      { title: "Transfer Rumors", href: "/transfer-rumors" },
    ],
  },
  {
    title: "NFL",
    href: "#",
    children: [
      { title: "Live Scores", href: "/live-scores" },

      { title: "Teams", href: "/teams" },
    ],
  },
  {
    title: "AFL",
    href: "#",
    children: [
      { title: "Fixtures", href: "/fixtures" },
      { title: "Ladder", href: "/standings" },
      { title: "Stats", href: "/stats" },
    ],
  },
  { title: "News", href: "/news" },
  { title: "Live Scores", href: "/live-scores" },
  { title: "Fixtures", href: "/fixtures" },
  {
    title: "More",
    href: "#",
    hideArrow: true,
    icon: "bi bi-plus-lg ms-1",
    children: [
      { title: "Standings", href: "/standings" },
      { title: "Stats", href: "/stats" },
      { title: "Fantasy Leagues", href: "/fantasy" },
      { title: "Podcasts & Video", href: "/podcasts" },
      { title: "Esports", href: "/esports" },
      { title: "Betting Odds", href: "/betting-odds" },
      { title: "Contact Us", href: "/contact" },
    ],
  },
];
