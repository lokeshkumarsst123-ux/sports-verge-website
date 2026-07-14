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
      { title: "Latest News", href: "#" },
      {
        title: "Tournaments",
        href: "#",
        children: [
          { title: "IPL 2024", href: "#" },
          { title: "T20 World Cup", href: "#" },
          { title: "Ashes", href: "#" },
        ],
      },
      { title: "Rankings", href: "#" },
    ],
  },
  {
    title: "Football",
    href: "#",
    children: [
      { title: "Premier League", href: "#" },
      { title: "La Liga", href: "#" },
      { title: "Champions League", href: "#" },
      { title: "Transfer Rumors", href: "#" },
    ],
  },
  {
    title: "NFL",
    href: "#",
    children: [
      { title: "Live Scores", href: "/live-scores" },
      { title: "Draft News", href: "#" },
      { title: "Teams", href: "#" },
    ],
  },
  {
    title: "AFL",
    href: "#",
    children: [
      { title: "Fixtures", href: "#" },
      { title: "Ladder", href: "#" },
      { title: "Stats", href: "#" },
    ],
  },
  { title: "News", href: "#" },
  { title: "Live Scores", href: "/live-scores" },
  { title: "Fixtures", href: "#" },
  {
    title: "More",
    href: "#",
    hideArrow: true,
    icon: "bi bi-plus-lg ms-1",
    children: [
      { title: "Standings", href: "#" },
      { title: "Stats", href: "#" },
      { title: "Fantasy Leagues", href: "#" },
      { title: "Podcasts & Video", href: "#" },
      { title: "Esports", href: "#" },
      { title: "Betting Odds", href: "#" },
      { title: "Contact Us", href: "/contact" },
    ],
  },
];
