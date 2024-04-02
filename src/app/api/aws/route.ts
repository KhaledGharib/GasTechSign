import AWS from "aws-sdk";

import { NextRequest } from "next/server";

const iotEndpoint = process.env.NEXT_PUBLIC_AWS_ENDPOINT; // Replace with your AWS IoT endpoint
const region = process.env.NEXT_PUBLIC_AWS_REGION; // Replace with your AWS region
const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID; // Replace with your AWS access key ID
const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY; // Replace with your AWS secret access key

// Configure AWS SDK
AWS.config.update({ region, accessKeyId, secretAccessKey });

export async function POST(req: NextRequest) {
  const { topic, fuel91, fuel95, fuelDI } = await req.json();

  // if (!topic || !message) {
  //   return res
  //     .status(400)
  //     .json({ error: "Missing topic or message in request body" });
  // }

  // Create AWS IoT Data client
  const iotData = new AWS.IotData({ endpoint: iotEndpoint });

  // Publish message to AWS IoT topic
  const params = {
    topic,
    payload: JSON.stringify({ fuel91, fuel95, fuelDI }),
    qos: 0,
  };

  try {
    await iotData.publish(params).promise();

    return new Response(JSON.stringify({ message: "sent to AWS" }));
  } catch (error) {
    console.error("Error publishing message to AWS IoT:", error);
  }
}
