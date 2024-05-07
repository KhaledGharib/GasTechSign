import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();
export async function DELETE(req: NextRequest) {
  try {
    const { userId, displayID } = await req.json();
    console.log(userId);
    console.log(displayID);
    const response = await prisma.display.delete({
      where: {
        userId,
        id: displayID,
      },
    });

    // Serialize the response array to JSON
    const responseBody = JSON.stringify(response);

    return new Response(responseBody);
  } catch (error) {
    // const errorResponse = { data: error };
    const errorBody = JSON.stringify(error);

    return new Response(errorBody, {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
