import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <section className="max-w-md text-center">
        <p className="text-accent text-sm font-semibold">404</p>
        <h1 className="text-neutral mt-3 text-3xl font-bold">Pagina no encontrada</h1>
        <p className="text-tertiary-content mt-3">
          La pagina que buscas no existe o fue movida.
        </p>
        <Link
          href="/"
          className="bg-accent mt-6 inline-flex rounded-lg px-4 py-2 text-sm font-medium text-[#00071E]"
        >
          Volver al inicio
        </Link>
      </section>
    </main>
  );
}
