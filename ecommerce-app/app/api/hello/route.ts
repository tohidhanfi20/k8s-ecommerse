import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req:NextRequest)=>{
    const token = await getToken({req})
    console.log("JSON Web Token", JSON.stringify(token, null, 2))
return NextResponse.json("hello")
}