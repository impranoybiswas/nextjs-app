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
import { ImageKitUpload } from "@/components/imagekit/ImageKitUpload";
import { toast } from "sonner";
import CustomComponent from "@/components/shared/CustomComponent";
import CustomVideoPlay from "@/components/videoplayer/CustomVideoPlay";
import GoogleSheetForm from "@/components/google-sheet/GoogleSheetForm";
import GoogleSheetData from "@/components/google-sheet/GoogleSheetData";

export default function Home() {
  const t = useTranslations("home");

  return (
    <div className="flex flex-col items-center gap-5 pt-10 pb-20">
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
        <p>Change the settings of the app!</p>
        <div className="flex flex-col gap-4">
          <LanguageToggle />
          <ThemeToggle />
          <ColorToggle />
          <FontToggle />
        </div>
      </div>

      {/* PDF Maker */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">PDF Maker</h2>
        <p>Generate a PDF from a form!</p>
        <FormToPDF />
      </div>

      {/* ImageKit Upload */}
      <div className="card">
        <h2>ImageKit Upload</h2>
        <p>Upload an image to ImageKit!</p>
        <ImageKitUpload
          folder="test"
          onUploadSuccess={() => toast.success("Image uploaded successfully!")}
        />
      </div>

      {/* Custom Component */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Custom Component</h2>
        <p>A custom component!</p>
        <CustomComponent />
      </div>

      {/* Video Player */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Video Player</h2>
        <p>Play a video!</p>
        <CustomVideoPlay />
      </div>

      {/* Google Sheet CRUD */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Google Sheet CRUD</h2>
        <p>Perform CRUD operations on a Google Sheet!</p>
        <GoogleSheetForm />
        <GoogleSheetData />
      </div>
    </div>
  );
}
