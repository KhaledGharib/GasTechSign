import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
  try {
    const {
      location,
      displayId,
      fuel91,
      fuel95,
      fuelDI,
      displayName,
      lat,
      lng,
      userId,
    } = await req.json();
    const priceData = {
      displayId,
      location,
      fuel91,
      fuel95,
      fuelDI,
      displayName,
      lat,
      lng,
      user: { connect: { externalId: userId } },
    };

    const createdPrice = await prisma.display.create({ data: priceData });
    return new Response(
      JSON.stringify({ message: "Created", data: createdPrice })
    );
  } catch (error) {
    console.error("error in post", error);
    return new Response(JSON.stringify({ message: error, data: error }));
  }
}
