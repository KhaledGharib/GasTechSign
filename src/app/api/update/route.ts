import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

// Update Information
const prisma = new PrismaClient();
export async function PUT(req: NextRequest) {
  try {
    const {
      userId,
      displayID,
      Gasoline91,
      Gasoline95,
      Diesel,
      location,
      displayName,
    } = await req.json();

    const response = await prisma.display.update({
      where: {
        userId,
        id: displayID,
      },
      data: {
        Gasoline91,
        Gasoline95,
        Diesel,
        location,
        displayName,
      },
    });

    const responseBody = JSON.stringify(response);

    return new Response(responseBody, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:8081",
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
