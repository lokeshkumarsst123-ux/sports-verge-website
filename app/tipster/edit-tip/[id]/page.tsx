import TipEditor from '@/components/TipEditor';
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;return <TipEditor id={id}/>;}
