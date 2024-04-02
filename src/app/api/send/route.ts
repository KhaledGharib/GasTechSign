import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
  try {
    const { userId, displayID } = await req.json();

    const response = await prisma.display.findMany({
      where: {
        id: displayID,
        userId,
      },
    });

    // Serialize the response array to JSON
    const responseBody = JSON.stringify(response);

    return new Response(responseBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    const errorResponse = { data: error };
    const errorBody = JSON.stringify(errorResponse);

    return new Response(errorBody, {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
