import { sendMail } from "@/lib/mailer";
import { welcomeTemplate, contactTemplate } from "@/lib/email-templates";
import { NextRequest, NextResponse } from "next/server";

// Supported email types
type EmailType = "welcome" | "contact";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, ...data } = body;

    if (!type) {
      return NextResponse.json(
        { error: "Email type is required" },
        { status: 400 },
      );
    }

    switch (type as EmailType) {
      case "welcome": {
        const { name, email } = data;
        if (!name || !email) {
          return NextResponse.json(
            { error: "name, email required" },
            { status: 400 },
          );
        }
        await sendMail({
          to: email,
          subject: "Welcome to Our App!",
          html: welcomeTemplate(name),
        });
        break;
      }

      case "contact": {
        const { name, email, message } = data;
        if (!name || !email || !message) {
          return NextResponse.json(
            { error: "name, email, message required" },
            { status: 400 },
          );
        }
        await sendMail({
          to: process.env.EMAIL_USER!,
          subject: `New message from ${name}`,
          html: contactTemplate({ name, email, message }),
        });
        break;
      }

      default:
        return NextResponse.json(
          { error: `Unknown email type: ${type}` },
          { status: 400 },
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mail error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
