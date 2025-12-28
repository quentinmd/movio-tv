export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <h2 className="text-2xl font-semibold">Page non trouvée</h2>
        <p className="text-muted-foreground">
          Désolé, la page que vous recherchez n'existe pas.
        </p>
        <a
          href="/"
          className="inline-block mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
}
