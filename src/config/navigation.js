import { Bookmark, Home, Sparkles, TrendingUp, User } from "lucide-react";

export const NAV_ITEMS = [
  { id: "home", label: "Home", mobileLabel: "Home", icon: Home },
  { id: "trending", label: "Trending", mobileLabel: "Trends", icon: TrendingUp },
  { id: "curated", label: "Curated", mobileLabel: "Curated", icon: Sparkles },
  { id: "saved", label: "Saved", mobileLabel: "Saved", icon: Bookmark },
  { id: "profile", label: "Profile", mobileLabel: "Profile", icon: User },
];
