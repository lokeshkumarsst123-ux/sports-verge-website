"use client";
import { useState, type CSSProperties } from "react";
import { API_ORIGIN } from "@/lib/api-config";
export default function ProfileAvatar({name,url,size=48,className=""}:{name:string;url?:string;size?:number;className?:string}) {
  const [failedUrl,setFailedUrl]=useState("");
  const source=url?.startsWith("/uploads/profiles/")?`${API_ORIGIN}${url}`:"";
  const initials=name.trim().split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join("").toUpperCase()||"?";
  const style={"--profile-avatar-size":`${size}px`} as CSSProperties;
  return source&&failedUrl!==source?<img className={`profile-avatar ${className}`} style={style} src={source} alt={`${name} profile`} onError={()=>setFailedUrl(source)}/>:<span className={`profile-avatar profile-avatar-initials ${className}`} style={style} role="img" aria-label={`${name} profile`}>{initials}</span>;
}
