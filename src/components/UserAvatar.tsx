"use client";

import Image from "next/image";
import type { User } from "@supabase/supabase-js";

type UserMetadata = {
  name?: string;
  display_name?: string;
  full_name?: string;
  avatar_url?: string;
};

function getInitial(user: User): string {
  const meta = (user.user_metadata || {}) as UserMetadata;
  const source =
    meta.display_name ||
    meta.name ||
    meta.full_name ||
    user.email ||
    "?";
  const first = source.trim().charAt(0);
  return first ? first.toUpperCase() : "?";
}

export default function UserAvatar({
  user,
  size = 36,
}: {
  user: User | null;
  size?: number;
}) {
  if (!user) return null;

  const meta = (user.user_metadata || {}) as UserMetadata;
  const avatarUrl = meta.avatar_url;
  const initial = getInitial(user);
  const fontSize = Math.round(size * 0.44);

  if (avatarUrl) {
    return (
      <span
        className="relative inline-flex items-center justify-center rounded-full overflow-hidden flex-shrink-0"
        style={{
          width: size,
          height: size,
          boxShadow:
            "0 4px 14px rgba(245, 166, 35, 0.35), inset 0 0 0 1px rgba(255,255,255,0.25)",
        }}
      >
        <Image
          src={avatarUrl}
          alt={user.email ?? "User"}
          width={size}
          height={size}
          className="object-cover"
          unoptimized
        />
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-display font-bold text-white flex-shrink-0 select-none"
      style={{
        width: size,
        height: size,
        fontSize,
        background:
          "linear-gradient(135deg, #F5A623 0%, #FF8A3D 50%, #FF6B35 100%)",
        boxShadow:
          "0 4px 14px rgba(245, 166, 35, 0.35), inset 0 1px 0 rgba(255,255,255,0.35)",
        textShadow: "0 1px 2px rgba(120, 50, 10, 0.3)",
      }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}
