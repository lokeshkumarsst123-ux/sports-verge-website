export interface NewsArticle {
  id: string;
  image: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  author: string;
  authorImage?: string;
  readTime: string;
  category: "Cricket" | "Football" | "NFL" | "AFL" | "General Sports";
  relatedIds: string[];
}

export const newsArticles: NewsArticle[] = [
  {
    id: "cricket-hero-1",
    image: "/assets/imgs/banner/news-banner_1.webp",
    title: "Australia's Masterclass Powers Team to Thrilling Win",
    summary: "Australia clinch a nerve-wracking 6-run victory in a high-scoring ICC ODI against India.",
    content: "In one of the most gripping ODI encounters in recent memory, Australia edged past India by just 6 runs in a nail-biting finish at the MCG. Set 342 to win, India came agonizingly close, falling short in the final over with one wicket remaining. The match will be remembered as one of the greatest ODI contests between these two cricketing giants.\n\nAustralia's innings was anchored by a dominant century from their captain, who marshaled the batting order with remarkable composure. The middle order chipped in with valuable contributions, ensuring every over was maximized. India's bowling, though disciplined, struggled to contain Australia's power-hitting in the final ten overs.\n\nChasing a mammoth total, India's openers gave them a flying start, putting on 80 in the first ten overs. However, Australia's pace attack used the new ball brilliantly in the middle phase, removing three key wickets in quick succession. The tail-end partnership of 47 runs almost produced a stunning upset, making for a dramatic, unforgettable climax.",
    date: "06-Jul-2026",
    author: "Cricinfo Staff",
    authorImage: "/assets/imgs/teams/australia.webp",
    readTime: "5 min read",
    category: "Cricket",
    relatedIds: ["cricket-1", "cricket-2"]
  },
  {
    id: "football-hero-2",
    image: "/assets/imgs/banner/news-banner_2.webp",
    title: "TV channel, how to watch, kick-off time, live stream",
    summary: "Having eased past Jordan in their final group game to top Group J, Argentina reinforced their title credentials.",
    content: "Argentina's road to the knockout rounds has been dominant, with La Albiceleste dispatching Jordan 3-0 in a commanding performance to top Group J. Lionel Messi, now in his final international tournament, put on another masterclass that left spectators breathless. Here is everything you need to know about where to watch their next match, including kick-off times and official broadcast channels.\n\nOfficial broadcasters across major territories have confirmed full coverage of Argentina's Round of 16 tie. Viewers in Europe can catch the action on their respective national sports channels, while North American audiences can stream the game live on major sports streaming platforms. Official kickoff is scheduled for 9 PM local time, with pre-match coverage beginning an hour earlier.\n\nArgentina's squad is largely fit ahead of the knockout tie. The manager confirmed in his pre-match press conference that the same starting eleven from the Jordan game will take the field. 'We are fully focused and ready,' he said. 'Every game from here is a final for us, and we respect every opponent we face.'",
    date: "06-Jul-2026",
    author: "Sky Sports News",
    authorImage: "/assets/imgs/teams/Arsenal_FC.svg",
    readTime: "4 min read",
    category: "Football",
    relatedIds: ["football-1", "football-2"]
  },
  {
    id: "afl-hero-4",
    image: "/assets/imgs/banner/news-banner_4.webp",
    title: "Crows comeback falls short against Suns",
    summary: "Adelaide has fallen a goal short of a late comeback against Gold Coast in the Club's opening game of 2024.",
    content: "The Adelaide Crows mounted a spirited comeback in the final quarter but ultimately fell one goal short against the Gold Coast Suns in a pulsating AFL clash. The Suns, playing at home, set up a commanding 28-point lead by halftime. Adelaide's response in the third quarter was ferocious, cutting the deficit to single figures with ten minutes remaining.\n\nAdelaide's spearhead forward led the charge, kicking four goals in the second half to give his side a fighting chance. The ground was electric as the Crows narrowed the gap time and again, but Gold Coast's experienced defenders held firm under enormous pressure.\n\nWith the final siren approaching, a rushed behind from inside 50 proved the difference. The Crows will take heart from the character they showed in this contest. Coach Matthew Nicks was positive about the performance: 'We showed real fight and our second-half was significantly better. We'll take a lot of learnings from tonight and come back stronger next week.'",
    date: "06-Jul-2026",
    author: "AFL Media",
    authorImage: "/assets/imgs/teams/Brisbane_Lions_logo_2010.svg",
    readTime: "4 min read",
    category: "AFL",
    relatedIds: ["afl-1", "afl-2"]
  },
  {
    id: "cricket-1",
    image: "/assets/imgs/news/419499.6.webp",
    title: "Greaves, Hope tons keep Sri Lanka at bay",
    summary: "The two centurions put on 242 off 459 deliveries in a single-wicket session",
    content: "A spectacular display of grit and technique by Greaves and Hope saw them compile a massive 242-run partnership, frustrating the Sri Lankan spin attack for a full session. Despite pitch conditions favoring turn, the pair batted with patience, building a solid foundation. Sri Lanka's bowlers tried multiple variations but failed to make a breakthrough, leaving the match finely poised at the end of the day's play.\n\nThe pitch began showing signs of wear early on, with variable bounce adding to the batsmen's challenges. However, the duo demonstrated exceptional footwork, repeatedly coming down the track to smother the spin. Hope was particularly aggressive against the left-arm orthodox, while Greaves played the anchor role, securing his half-century in 120 balls before accelerating.\n\nSri Lanka will need to regroup quickly on Day 3. Their fielding remained sharp, but the lack of wickets in the afternoon session has allowed the visitors to claw back into the match. Pundits suggest that the first session tomorrow will decide the course of the match, as a couple of quick wickets could expose the lower order under overcast conditions.",
    date: "06-Jul-2026",
    author: "Cricinfo Staff",
    authorImage: "/assets/imgs/teams/england.webp",
    readTime: "4 min read",
    category: "Cricket",
    relatedIds: ["cricket-2", "cricket-3"]
  },
  {
    id: "cricket-2",
    image: "/assets/imgs/news/419254.6.webp",
    title: "New-look India in unfamiliar T20I rut",
    summary: "England have issues of their own to sort after Ben Stokes' retirement, but they lead this series 1-0",
    content: "India's experimental T20I squad found themselves in a difficult spot after dropping the opening game of the series. England, adapting to life after Ben Stokes, put on a clinic of disciplined death bowling and explosive powerplay hitting. The young Indian batting line-up struggled to find momentum in the middle overs, raising questions about tactical decisions in the squad's transition phase.\n\nThe loss marks a rare string of consecutive defeats for the Men in Blue in the shortest format. Pundits have pointed to the lack of an anchor in the top three as a primary concern. While the intent was high-risk, high-reward, the execution fell short against a disciplined English attack led by Jofra Archer.\n\nEngland's captain expressed satisfaction with the team's display but remained cautious: 'It is a good start, but India is a proud side. They will bounce back hard. We need to work on our middle-order partnerships as we lost too many quick wickets in the death overs.'",
    date: "06-Jul-2026",
    author: "Harsha Bhogle",
    authorImage: "/assets/imgs/teams/ipl/CSKoutline.png",
    readTime: "3 min read",
    category: "Cricket",
    relatedIds: ["cricket-1", "cricket-3"]
  },
  {
    id: "cricket-3",
    image: "/assets/imgs/news/414574.6.webp",
    title: "Sanju Samson left out of India's T20I squad for Zimbabwe tour",
    summary: "Shivam Dube replaces injured Nitish Kumar Reddy in ODI squad for England series",
    content: "In a surprising selection move, Sanju Samson has been omitted from the T20I squad traveling to Zimbabwe, sparking widespread debate among fans and pundits. Meanwhile, Shivam Dube has been drafted in as a replacement for the injured Nitish Kumar Reddy. The selectors highlighted the need to test newer combinations ahead of the ICC T20 World Cup qualifiers next year.\n\nSamson's omission comes despite a string of consistent domestic performances and a match-winning knock in his last outing. The team management clarified that they are looking to build a pool of backup options, hence the inclusion of younger prospects. However, former players have questioned the consistency of the selection criteria.\n\nWith Dube's inclusion in the ODI setup, the team gains a useful medium-pace bowling option. Dube's stellar form in the IPL has made him a fan favorite, and this upcoming series against England represents a massive opportunity to cement his place in the national team.",
    date: "05-Jul-2026",
    author: "Cricinfo Staff",
    authorImage: "/assets/imgs/teams/england.webp",
    readTime: "5 min read",
    category: "Cricket",
    relatedIds: ["cricket-1", "cricket-2"]
  },
  {
    id: "football-1",
    image: "/assets/imgs/news/england-mexico.jpg",
    title: "England's World Cup campaign takes flight with thrilling 3-2 Mexico win",
    summary: "Jude Bellingham's double and a heroic rearguard action seal quarter-final spot despite Quansah's red card.",
    content: "England advanced to the World Cup quarter-finals in dramatic fashion, surviving a fierce Mexican comeback. Jude Bellingham was the star of the show, netting twice in the first half. However, a red card for defender Jarell Quansah in the 60th minute turned the game into a defensive battle. Mexico scored twice to setup a tense finish, but England's backline held firm to claim victory.\n\nThe atmosphere at the stadium was electric as Mexico pressed forward with numerical advantage. The English midfield dropped deep, forming a low block that choked the channels. Goalkeeper Jordan Pickford made two critical saves in stoppage time to deny Mexico an equalizer.\n\n'It was a test of character,' England's manager remarked after the match. 'Losing Jarell was a blow, but the way Jude and the rest of the boys fought for every ball shows the spirit in this camp. We are ready for whoever comes next.'",
    date: "06-Jul-2026",
    author: "James Pearce",
    authorImage: "/assets/imgs/teams/Manchester_City_FC_badge.svg",
    readTime: "6 min read",
    category: "Football",
    relatedIds: ["football-2", "football-3"]
  },
  {
    id: "football-2",
    image: "/assets/imgs/news/haaland-brazil.webp",
    title: "Erling Haaland's late double knocks Brazil out of the World Cup",
    summary: "Norway stun the five-time winners 2-1 to reach the quarter-finals, setting up a blockbuster clash with England.",
    content: "Erling Haaland proved once again why he is the world's most lethal striker, scoring twice in the final ten minutes to send Norway into the World Cup quarter-finals. Brazil dominated possession and took an early lead through Vinicius Jr, but struggled to put the game to bed. Haaland capitalized on two clinical counter-attacks to secure a historic win for the Norwegians.\n\nBrazil's head coach lamented the team's defensive lapses in the final stages of the match: 'We controlled the game for 80 minutes, but against a player of Haaland's quality, you cannot afford to switch off. We gave him two half-chances and he punished us.'\n\nNorway's historic run continues to capture the imagination of fans globally. Underdogs from the start, their disciplined defensive shape and direct counter-attacking style have now claimed the tournament's biggest scalp. They will face England in a highly anticipated quarter-final clash.",
    date: "06-Jul-2026",
    author: "Sky Sports News",
    authorImage: "/assets/imgs/teams/Arsenal_FC.svg",
    readTime: "5 min read",
    category: "Football",
    relatedIds: ["football-1", "football-3"]
  },
  {
    id: "football-3",
    image: "/assets/imgs/news/neymar-retires.jpg",
    title: "Neymar calls time on Brazil career following early World Cup elimination",
    summary: "The legendary forward announces his international retirement shortly after scoring a stoppage-time penalty.",
    content: "In an emotional post-match press conference, Neymar announced his retirement from international football. Following Brazil's shock exit at the hands of Norway, the 34-year-old forward stated that he has given everything he could to the national team. His final act was a penalty goal in stoppage time, which ultimately wasn't enough to prevent the defeat.\n\nNeymar finishes his international career as Brazil's all-time leading goalscorer, surpassing Pelé's official tally. Despite his individual accolades, his international career will be remembered for the elusive World Cup trophy that slipped away in multiple tournaments.\n\n'It is time to let the younger generation take over,' Neymar said with tears in his eyes. 'I wanted nothing more than to bring the sixth star to Brazil, but it was not meant to be. I am proud of what I achieved with this shirt.'",
    date: "06-Jul-2026",
    author: "Goal.com Editor",
    authorImage: "/assets/imgs/teams/Liverpool_FC.svg",
    readTime: "4 min read",
    category: "Football",
    relatedIds: ["football-1", "football-2"]
  },
  {
    id: "nfl-1",
    image: "/assets/imgs/news/aaron-rodgers-steelers.jpg",
    title: "Aaron Rodgers reunites with Mike McCarthy's offense in Pittsburgh",
    summary: "The veteran QB says \"It's stuff that we used to run\" as he prepares for his second season with the Steelers.",
    content: "Aaron Rodgers expressed excitement about reuniting with Mike McCarthy's offensive scheme in Pittsburgh. Having spent years together in Green Bay, the duo hopes to bring similar championship pedigree to the Steelers. Rodgers noted that the familiarity with terminology and play-calling has made the transition smoother for both himself and the receiving corps.\n\nThe Steelers' offense struggled with consistency last year, but the arrival of McCarthy as the offensive consultant has brought renewed optimism. Analysts expect a more dynamic passing game utilizing West Coast offense concepts that Rodgers mastered in his prime.\n\nTraining camp reports suggest that Rodgers is looking sharp, showing excellent chemistry with his young wide receivers. At 42, the quarterback is determined to prove that he still has what it takes to guide a team to the Super Bowl.",
    date: "06-Jul-2026",
    author: "Adam Schefter",
    authorImage: "/assets/imgs/teams/Kansas_City_Chiefs_logo.svg",
    readTime: "4 min read",
    category: "NFL",
    relatedIds: ["nfl-2"]
  },
  {
    id: "nfl-2",
    image: "/assets/imgs/news/james-cook-bills.jpg",
    title: "Bills' James Cook undervalued in latest NFL running back rankings",
    summary: "Despite leading the entire league in rushing yards in 2025, Cook landed at No. 7 in the latest positional rankings.",
    content: "The Buffalo Bills' running back room is using recent positional rankings as motivation. James Cook, who had a breakout 2025 season leading the league in rushing yards, expressed disappointment at being ranked 7th. Coaches and teammates have rallied behind Cook, calling him the engine of their offensive scheme and promising an even bigger role in the upcoming campaign.\n\nCook's versatility as both a runner and a receiver out of the backfield has made him a key weapon in Josh Allen's offense. Bills fans have expressed outrage on social media over the ranking, pointing to Cook's impressive yards-per-carry average and consistency in big games.\n\n'I don't play for rankings, I play to win games,' Cook told reporters. 'But it definitely adds fuel to the fire. We have a lot to prove this year, and I'm ready to carry the load.'",
    date: "05-Jul-2026",
    author: "ESPN Reporter",
    authorImage: "/assets/imgs/teams/Buffalo_Bills_logo.svg",
    readTime: "3 min read",
    category: "NFL",
    relatedIds: ["nfl-1"]
  },
  {
    id: "afl-1",
    image: "/assets/imgs/news/budarick-injury.jpg",
    title: "Surgery puts impressive new Dog's season in doubt",
    summary: "Western Bulldogs recruit Connor Budarick could miss the remainder of the season due to a serious ankle injury.",
    content: "The Western Bulldogs have suffered a major setback with news that recruit Connor Budarick requires reconstructive ankle surgery. Budarick, who was having a career-best start to the season, injured his ankle during last week's victory. The medical team confirmed a recovery timeline of 6-9 months, putting his participation in the finals series in serious doubt.\n\nBudarick's injury is a blow to the Bulldogs' defensive depth. His interception marking and run-and-carry from half-back had become key features of their game plan. The club is currently exploring trade options and internal promotions to cover his absence.\n\nBulldogs' coach Chris Beveridge expressed his devastation: 'Connor worked so hard to get back to his best football, and to see him get injured like this is heartbreaking. We will support him through his rehab, and we expect him to make a full recovery for next season.'",
    date: "06-Jul-2026",
    author: "AFL Media",
    authorImage: "/assets/imgs/teams/Brisbane_Lions_logo_2010.svg",
    readTime: "3 min read",
    category: "AFL",
    relatedIds: ["afl-2"]
  },
  {
    id: "afl-2",
    image: "/assets/imgs/news/carlton-blues.jpg",
    title: "Blues survive late scare to stay perfect under caretaker coach",
    summary: "Carlton has survived a late Richmond charge to continue its perfect 7-0 run under Josh Fraser.",
    content: "Carlton extended their remarkable unbeaten run under caretaker manager Josh Fraser, holding off a late Richmond surge to win by 5 points. Richmond dominated the final quarter, but Carlton's desperate defensive pressure saved the day at the MCG. Fraser praised the team's resilience, noting that their playoff aspirations are firmly back in their own hands.\n\nThe Blues' turnaround under Fraser has been one of the stories of the AFL season. Implementing a high-possession style, the team has managed to outscore opponents while maintaining a compact defensive shape. Fans are calling for Fraser to be appointed as the permanent head coach.\n\n'We got a bit complacent in the fourth quarter, but a win is a win,' Fraser said in his press conference. 'Richmond is a quality team and they threw everything at us. I'm proud of the boys for holding their nerve when it mattered most.'",
    date: "05-Jul-2026",
    author: "Fox Sports AFL",
    authorImage: "/assets/imgs/teams/Essendon_FC_logo.svg",
    readTime: "4 min read",
    category: "AFL",
    relatedIds: ["afl-1"]
  },
  {
    id: "general-1",
    image: "/assets/imgs/banner/news-banner_3.webp",
    title: "ETPL crucial in making cricket a global sport",
    summary: "The former India allrounder believes that a short format like T20 cricket is key to the sport's success in Europe.",
    content: "Sports administrators and former players have highlighted the European T10 Cricket League (ETPL) as a vital catalyst for global cricket expansion. With short, fast-paced matches, the format is attracting massive crowds and media interest in nations where cricket was traditionally a minor sport. Plans are underway to expand the league to ten new European cities by next year.\n\nThe rise of ETPL has challenged the traditional view that cricket is too long and complex for non-traditional markets. By condensing the game into a fast-paced 90-minute spectacle, organizers have successfully engaged younger demographics who prefer high-intensity entertainment.\n\nSeveral European sports ministries have pledged infrastructure support to build cricket grounds, recognizing the league's potential to boost sports tourism and local participation. The next season promises to be the biggest yet, with international stars already signing up to participate.",
    date: "06-Jul-2026",
    author: "Global Sports Staff",
    authorImage: "/assets/imgs/teams/australia.webp",
    readTime: "3 min read",
    category: "General Sports",
    relatedIds: ["general-2"]
  },
  {
    id: "general-2",
    image: "/assets/imgs/banner/news-banner_2.webp",
    title: "Olympic Games Preparations Enter Final Phase",
    summary: "Host city organizers declare readiness as athletes begin arriving at the Olympic Village.",
    content: "The local organizing committee has declared all major sporting venues fully ready for the upcoming games. With over 10,000 athletes expected to compete, transport systems and security protocols have been tested and verified. Athletes from around the globe have started moving into the Olympic Village, expressing satisfaction with the high-quality training and lodging facilities.\n\nThe preparation process has been praised by international inspectors, who highlighted the sustainable architecture of the new venues and the efficient use of existing facilities. The games are expected to generate significant economic benefits for the host region.\n\nWith the opening ceremony just days away, anticipation is reaching a fever pitch. Global broadcasters have set up their studios, and ticket sales have broken previous records. The stage is set for a memorable celebration of athletic excellence and international unity.",
    date: "04-Jul-2026",
    author: "Olympics Media",
    authorImage: "/assets/imgs/teams/new-zealand.webp",
    readTime: "5 min read",
    category: "General Sports",
    relatedIds: ["general-1"]
  }
];
