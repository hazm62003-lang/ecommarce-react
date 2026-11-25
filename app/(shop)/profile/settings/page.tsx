import type { Metadata } from "next";
import { SettingsForms } from "@/components/account/settings-forms";

export const metadata: Metadata = { title: "Account Settings" };

export default function SettingsPage() {
  return <SettingsForms />;
}
