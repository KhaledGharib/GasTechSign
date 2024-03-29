import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();
export async function PUT(req: NextRequest) {
  try {
    const {
      ownerId,
      displayID,
      fuel91,
      fuel95,
      fuelDI,
      location,
      displayName,
      ipAddress,
    } = await req.json();

    const response = await prisma.display.update({
      where: {
        ownerId,
        id: displayID,
      },
      data: {
        fuel91,
        fuel95,
        fuelDI,
        location,
        displayName,
        ipAddress,
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
