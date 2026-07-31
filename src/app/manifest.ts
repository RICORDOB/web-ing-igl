import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cristo English - Aprende Inglés con la Biblia",
    short_name: "Cristo English",
    description:
      "La forma más divertida de aprender inglés mientras estudias la Biblia. Para niños y adolescentes cristianos.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf5ff",
    theme_color: "#4a148c",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  };
}
