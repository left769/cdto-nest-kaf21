import Image from "next/image";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-6 text-xs text-neutral-400">
        <Image
          src="/logo.jpg"
          alt="CDTO"
          width={20}
          height={20}
          className="rounded-full object-cover"
        />
        <span>Курс CDTO</span>
      </div>
    </footer>
  );
}
