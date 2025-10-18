import { redirect } from "next/navigation"

export const metadata = {
  title: "AppFin | Ultimatz",
  description:
    "Integração do AppFin com o site Ultimatz. Configure a URL do AppFin para redirecionamento automático.",
}

const appFinUrl = process.env.NEXT_PUBLIC_APPFIN_URL

export default function AppFinIntegrationPage() {
  if (appFinUrl) {
    redirect(appFinUrl)
  }

  return (
    <section className="py-24 bg-accent/40">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="rounded-3xl bg-white p-8 shadow-xl border border-primary/10">
          <div className="space-y-6 text-center">
            <span className="inline-flex items-center rounded-full bg-secondary/10 px-4 py-1 text-sm font-semibold text-secondary">
              Integração AppFin
            </span>
            <h1 className="font-heading text-4xl font-bold text-primary">
              Configure a URL do AppFin
            </h1>
            <p className="text-lg text-muted-foreground">
              Defina a variável <code className="font-mono text-base text-primary">NEXT_PUBLIC_APPFIN_URL</code> para redirecionar automaticamente este
              atalho para a aplicação AppFin. Enquanto isso, apresentamos abaixo um guia rápido para executar os projetos em conjunto.
            </p>
          </div>

          <div className="mt-10 space-y-6 text-left">
            <div className="rounded-2xl border border-dashed border-primary/20 bg-accent/50 p-6">
              <h2 className="text-xl font-semibold text-primary mb-3">1. Defina a variável de ambiente</h2>
              <p className="text-muted-foreground mb-4">
                Adicione a URL pública (ou local) do AppFin no arquivo <code className="font-mono text-sm">.env.local</code> do projeto principal Ultimatz.
              </p>
              <pre className="overflow-x-auto rounded-xl bg-black/90 p-4 text-sm text-white">
NEXT_PUBLIC_APPFIN_URL=http://localhost:3001
              </pre>
            </div>

            <div className="rounded-2xl border border-dashed border-primary/20 bg-accent/50 p-6">
              <h2 className="text-xl font-semibold text-primary mb-3">2. Execute os projetos em paralelo</h2>
              <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
                <li>
                  <span className="font-semibold text-primary">Site institucional:</span> <code className="font-mono text-sm">cd ultimatz &amp;&amp; npm run dev</code>
                </li>
                <li>
                  <span className="font-semibold text-primary">AppFin:</span> <code className="font-mono text-sm">cd appfin &amp;&amp; npm run dev -- --port 3001</code>
                </li>
              </ol>
              <p className="mt-4 text-sm text-muted-foreground">
                Ajuste a porta conforme necessário e mantenha a variável de ambiente sincronizada com a URL escolhida.
              </p>
            </div>

            <div className="rounded-2xl border border-dashed border-primary/20 bg-accent/50 p-6">
              <h2 className="text-xl font-semibold text-primary mb-3">3. Consulte a documentação</h2>
              <p className="text-muted-foreground">
                A documentação detalhada está disponível no repositório em <code className="font-mono text-sm">appfin/README.md</code>{" "}
                e nos arquivos da pasta <code className="font-mono text-sm">appfin/docs</code>. Utilize-os para revisar checklist de implantação,
                dependências e roadmap funcional.
              </p>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-muted-foreground">
            Após configurar a URL, este atalho redirecionará automaticamente para a aplicação AppFin.
          </p>
        </div>
      </div>
    </section>
  )
}
