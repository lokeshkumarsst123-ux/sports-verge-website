import CategoryNews from '@/components/CategoryNews';
export const metadata={title:'NRL News & Analysis | The Sports Verge',description:'Latest National Rugby League news and analysis from The Sports Verge.'};
export default function Page(){return <main className="container custom-container py-5"><h1 className="text-white">NRL news & analysis</h1><CategoryNews category="NRL" title="NRL News"/></main>;}
