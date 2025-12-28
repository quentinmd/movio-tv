"use client";

interface VideoPlayerProps {
  embedUrl: string;
  title: string;
}

export default function VideoPlayer({ embedUrl, title }: VideoPlayerProps) {
  return (
    <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
      <iframe
        src={embedUrl}
        title={title}
        className="absolute top-0 left-0 w-full h-full rounded-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
