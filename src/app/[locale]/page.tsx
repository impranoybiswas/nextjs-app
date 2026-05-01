"use client";

import GroqChatbot from "@/components/groq/GroqChatBot";
import { useTranslations } from "next-intl";
import ColorToggle from "@/components/settings/ColorToggle";
import FontToggle from "@/components/settings/FontToggle";
import { ThemeToggle } from "@/components/settings/ThemeToggle";
import LanguageToggle from "@/components/settings/LanguageToggle";
import ContactForm from "@/components/mailer/ContactForm";
import AuthAppearance from "@/components/auth/AuthAppearance";
import FormToPDF from "@/components/pdf-generate/FormToPDF";
import { ImageUpload } from "@/components/imagekit/ImageKitUpload";

export default function Home() {
  const t = useTranslations("home");
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-5 max-w-lg mx-auto px-4 pt-10 pb-20">
      {/* Title */}
      <h1 className="text-3xl font-bold mt-4">{t("title")}</h1>
      <p className="text-foreground/40 mb-6">{t("description")}</p>

      {/* Authentication */}
      <AuthAppearance />

      {/* Test Contact Form */}
      <div className="card">
        <h2>Contact Email Test</h2>
        <p>Send a test email using the contact form!</p>
        <ContactForm />
      </div>

      {/* AI CHAT BOT */}
      <div className="card">
        <h2>Groq AI Chatbot</h2>
        <p>Ask anything about Groq and its products!</p>
        <GroqChatbot />
      </div>

      {/* Settings */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <div className="flex flex-col gap-4">
          <LanguageToggle />
          <ThemeToggle />
          <ColorToggle />
          <FontToggle />
        </div>
      </div>

      {/* PDF Maker */}
      <FormToPDF />

      {/* ImageKit Upload */}
      <div className="card">
        <h2>ImageKit Upload</h2>
        <p>Upload an image to ImageKit!</p>
        <ImageUpload
          folder="test"
          onUploadSuccess={() => {
            alert("Image uploaded successfully!");
          }}
        />
      </div>
    </main>
  );
}
