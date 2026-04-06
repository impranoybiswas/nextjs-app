"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

export default function AuthAppearance() {
  const t = useTranslations("auth");
  return (
    <div className="card">
      <h2 className="text-2xl font-bold">{t("title")}</h2>
      <p>{t("description")}</p>
      <div className="flex gap-4 items-center justify-center">
        <Link href="/sign-in" className="btn btn-primary">
          {t("sign-in")}
        </Link>
        <Link href="/sign-up" className="btn btn-primary">
          {t("sign-up")}
        </Link>
      </div>
    </div>
  );
}
