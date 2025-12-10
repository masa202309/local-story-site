import { BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-amber-900 text-amber-100 py-8 px-4 mt-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-6 h-6" />
          <span className="font-bold">わが町の名店</span>
        </div>
        <p className="text-sm text-amber-300 mb-6">
          地元の名店で生まれた物語を集めるプラットフォーム
        </p>
        <div className="flex gap-6 text-sm">
          <a href="#" className="hover:text-white transition">利用規約</a>
          <a href="#" className="hover:text-white transition">プライバシー</a>
          <a href="#" className="hover:text-white transition">お問い合わせ</a>
        </div>
      </div>
    </footer>
  );
}
