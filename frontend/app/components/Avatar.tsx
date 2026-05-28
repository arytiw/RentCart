"use client";

import Image from "next/image";
import { FaUser } from "react-icons/fa";

interface AvatarProps {
  src: string | null | undefined;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ src, size = 28 }) => {
  if (!src) {
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-full bg-gradient-to-br from-cream-200 to-cream-300 border border-ink-200 flex items-center justify-center"
        aria-label="User avatar"
      >
        <FaUser className="text-ink-400" size={Math.max(12, size * 0.45)} />
      </div>
    );
  }

  return (
    <Image
      className="rounded-full ring-2 ring-white object-cover"
      height={size}
      width={size}
      alt="Avatar"
      src={src}
    />
  );
};

export default Avatar;
