import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
  try {
    const {
      location,
      displayId,
      Gasoline91,
      Gasoline95,
      Diesel,
      displayName,
      lat,
      lng,
      userId,
    } = await req.json();
    const priceData = {
      displayId,
      location,
      Gasoline91,
      Gasoline95,
      Diesel,
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
