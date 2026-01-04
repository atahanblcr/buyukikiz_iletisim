import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-4xl font-bold text-gray-900">
          Büyükikiz İletişim
        </h1>
        <p className="text-xl text-gray-600">
          Dijital Vitrin Uygulaması
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link
            href="/store"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Mağazaya Git
          </Link>
          <Link
            href="/admin"
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Admin Paneli
          </Link>
        </div>
      </div>
    </div>
  );
}

