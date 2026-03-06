import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const scriptPath = path.join(process.cwd(), 'public', 'install.sh');
  const script = fs.readFileSync(scriptPath, 'utf-8');
  
  return new NextResponse(script, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
