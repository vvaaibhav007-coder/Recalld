import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    // TODO: replace with Supabase insert when DB is connected
    const filePath = path.join(process.cwd(), "waitlist.json");
    
    let waitlist: string[] = [];
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        waitlist = JSON.parse(fileContent);
        if (!Array.isArray(waitlist)) {
          waitlist = [];
        }
      } catch (err) {
        waitlist = [];
      }
    }

    if (!waitlist.includes(email)) {
      waitlist.push(email);
      fs.writeFileSync(filePath, JSON.stringify(waitlist, null, 2), "utf-8");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
