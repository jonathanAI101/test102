import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

interface MessageData {
  id: number;
  role: string;
  content: string;
  createdAt: Date;
}

interface ConversationData {
  id: number;
  title: string;
  updatedAt: Date;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationId } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    let currentConversationId = conversationId;

    // If no conversation exists, create a new one
    if (!currentConversationId) {
      // For demo purposes, create a default user if not exists
      let user = await prisma.user.findFirst();
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: "demo@example.com",
            name: "Demo User",
          },
        });
      }

      const conversation = await prisma.conversation.create({
        data: {
          userId: user.id,
          title: message.slice(0, 50) + (message.length > 50 ? "..." : ""),
        },
      });
      currentConversationId = conversation.id;
    }

    // Save the user message
    await prisma.message.create({
      data: {
        conversationId: currentConversationId,
        role: "user",
        content: message,
      },
    });

    // Generate a mock response (replace with actual AI integration)
    const assistantResponse = generateMockResponse(message);

    // Save the assistant message
    const assistantMessage = await prisma.message.create({
      data: {
        conversationId: currentConversationId,
        role: "assistant",
        content: assistantResponse,
      },
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: currentConversationId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      id: assistantMessage.id,
      role: assistantMessage.role,
      content: assistantMessage.content,
      createdAt: assistantMessage.createdAt.toISOString(),
      conversationId: currentConversationId,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Mock response generator (replace with actual AI integration)
function generateMockResponse(message: string): string {
  const responses = [
    "I understand your question. Let me think about that for a moment... Based on my analysis, I'd suggest considering multiple perspectives before making a decision.",
    "That's an interesting point! Here's my take on it: the key is to break down the problem into smaller, manageable parts and tackle each one systematically.",
    "Great question! I'd be happy to help. From what you've described, it seems like the best approach would be to start with the fundamentals and build from there.",
    "I appreciate you sharing that with me. Let me provide some insights that might be helpful for your situation.",
    "Thank you for your message. Here's what I think would be most valuable to consider in this context...",
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    if (conversationId) {
      // Get messages for a specific conversation
      const messages = await prisma.message.findMany({
        where: { conversationId: parseInt(conversationId) },
        orderBy: { createdAt: "asc" },
      });

      return NextResponse.json(
        messages.map((msg: MessageData) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          createdAt: msg.createdAt.toISOString(),
        }))
      );
    } else {
      // Get all conversations for the demo user
      const user = await prisma.user.findFirst();
      if (!user) {
        return NextResponse.json([]);
      }

      const conversations = await prisma.conversation.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title: true,
          updatedAt: true,
        },
      });

      return NextResponse.json(
        conversations.map((conv: ConversationData) => ({
          id: conv.id,
          title: conv.title,
          updatedAt: conv.updatedAt.toISOString(),
        }))
      );
    }
  } catch (error) {
    console.error("Chat API GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
