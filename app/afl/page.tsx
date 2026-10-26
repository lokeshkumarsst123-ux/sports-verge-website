import CategoryNews from '@/components/CategoryNews';
export const metadata={title:'AFL News & Analysis | The Sports Verge',description:'Latest Australian Football League news and analysis from The Sports Verge.'};
export default function Page(){return <main className="container custom-container py-5"><h1 className="text-white">AFL news & analysis</h1><CategoryNews category="AFL" title="AFL News"/></main>;}
