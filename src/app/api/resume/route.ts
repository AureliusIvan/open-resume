// src/app/api/hello/route.ts

import {NextResponse} from 'next/server';
import {parseResumeFromPdf} from "../../lib/parse-resume-from-pdf";

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  try {
    if (!params.has('file')) {
      return NextResponse.json(
          {
            message: 'No file specified.',
          },
          {status: 400}
      );
    }
    const name = params.get('file')
    // @ts-ignore
    const result = await parseResumeFromPdf(name);
    return NextResponse.json(
        {
          message: 'File processed successfully!',
          data: result
        }
    );
  } catch (error) {
    return NextResponse.json(
        {
          message: 'An error occurred while processing the file.',
          // @ts-ignore
          error: error.message
        },
        {status: 500}
    );
  }
}

export async function POST(req: Request) {
  try {
    // Ensure the request is of the correct type
    const contentType = req.headers.get('Content-Type') || '';
    if (!contentType.startsWith('multipart/form-data')) {
      return NextResponse.json(
          {
            message: 'Invalid content type.',
          },
          {status: 400}
      );
    }

    // Parse form data from request
    const formData = await req.formData();
    const file = formData.get('file') as Blob;

    if (!file) {
      return NextResponse.json(
          {
            message: 'No file uploaded.',
          },
          {status: 400}
      );
    }

    // Convert Blob to Uint8Array
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Parse the resume from the Uint8Array
    // @ts-ignore
    const result = await parseResumeFromPdf(uint8Array);

    return NextResponse.json(
        {
          message: 'File processed successfully!',
          data: result
        }
    );
  } catch (error) {
    return NextResponse.json(
        {
          message: 'An error occurred while processing the file.',
          // @ts-ignore
          error: error.message
        },
        {status: 500}
    );
  }
}