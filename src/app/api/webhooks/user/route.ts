// import { prisma } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { IncomingHttpHeaders } from "http";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook, WebhookRequiredHeaders } from "svix";

const prisma = new PrismaClient();
const webhookSecret = process.env.WEBHOOK_SECRET || "";

async function handler(request: Request) {
  const payload = await request.json();
  const headersList = headers();
  const heads = {
    "svix-id": headersList.get("svix-id"),
    "svix-timestamp": headersList.get("svix-timestamp"),
    "svix-signature": headersList.get("svix-signature"),
  };
  const wh = new Webhook(webhookSecret);
  let evt: Event | null = null;

  try {
    evt = wh.verify(
      JSON.stringify(payload),
      heads as IncomingHttpHeaders & WebhookRequiredHeaders
    ) as Event;
  } catch (err) {
    console.error((err as Error).message);
    return NextResponse.json({}, { status: 400 });
  }

  const eventType: EventType = evt.type;
  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, ...attributes } = evt.data;
    console.log(id);

    await prisma.user.upsert({
      where: { externalId: id as string },
      create: {
        externalId: id as string,
        attributes,
      },
      update: { attributes },
    });
  }
  if (eventType === "session.created") {
    const { user_id } = evt.data;
    const attributes = "session";
    console.log(user_id);

    await prisma.user.upsert({
      where: { externalId: user_id as string },
      create: {
        externalId: user_id as string,
        attributes,
      },
      update: { attributes },
    });
  }
  return NextResponse.json({ message: "Webhook processed successfully" });
}

type EventType = "user.created" | "user.updated" | "*" | "session.created";

type Event = {
  data: Record<string, string | number>;
  object: "event";
  type: EventType;
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
