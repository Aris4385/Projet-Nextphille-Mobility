import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";

export default function Home() {
  const piliers = [
    { titre: "Confiance", texte: "Securite et transparence" },
    { titre: "Simplicite", texte: "Une experience fluide" },
    { titre: "Connexion", texte: "Entre proprietaires et clients" },
    { titre: "Croissance", texte: "Faire grandir la mobilite en Afrique" },
  ];

  const etapes = [
    { numero: "01", titre: "Recherchez", texte: "Trouvez le vehicule qui correspond a votre trajet, a Lome et au-dela." },
    { numero: "02", titre: "Reservez", texte: "Verifiez votre identite et confirmez en toute securite via Mobile Money." },
    { numero: "03", titre: "Roulez", texte: "Recuperez le vehicule et prenez la route en toute confiance." },
  ];

  return (
    <main>
      <Nav />

      <section className="relative overflow-hidden px-6 pb-16 pt-12 text-center md:px-12 md:pt-20">
        <div className="pointer-events-none absolute inset-0 -z-10 flex justify-center">
          <div className="mt-[-4rem] h-72 w-72 rounded-full bg-gold/20 blur-[100px] md:h-96 md:w-96" />
        </div>

        <Reveal>
          <h1 className="mx-auto max-w-3xl font-display text-4xl leading-tight text-ivory md:text-6xl">
            Louez en toute confiance,
            <br />
            voyagez en liberte.
          </h1>
        </Reveal>

        <Reveal delay={150}>
          <p className="mx-auto mt-6 max-w-xl text-base text-sage md:text-lg">
            La location de vehicules entre particuliers, pensee pour le Togo.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-10 flex justify-center">
            <a href="#" className="rounded-full bg-gold px-10 py-3 font-medium text-forest transition hover:bg-goldSoft">
              Trouver un vehicule
            </a>
          </div>
        </Reveal>

        <div className="mx-auto mt-16 w-full max-w-2xl">
          <svg viewBox="0 0 600 60" className="w-full">
            <path
              d="M10 45 C 150 45, 200 15, 300 15 S 450 45, 590 15"
              fill="none"
              stroke="#C9A227"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="600"
              className="animate-draw"
            />
          </svg>
        </div>
      </section>

      <section className="border-t border-forestLight px-6 py-16 md:px-12">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
          {piliers.map((p, i) => (
            <Reveal key={p.titre} delay={i * 100}>
              <div className="text-center">
                <p className="font-display text-lg text-gold">{p.titre}</p>
                <p className="mt-2 text-sm text-sage">{p.texte}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 md:px-12">
        <Reveal>
          <h2 className="text-center font-display text-2xl text-ivory md:text-3xl">
            Comment ca marche
          </h2>
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-4xl gap-10 md:grid-cols-3">
          {etapes.map((e, i) => (
            <Reveal key={e.numero} delay={i * 120}>
              <div className="rounded-2xl bg-forestLight p-6">
                <span className="font-display text-3xl text-gold">{e.numero}</span>
                <h3 className="mt-4 font-display text-lg text-ivory">{e.titre}</h3>
                <p className="mt-2 text-sm text-sage">{e.texte}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20 text-center md:px-12">
        <Reveal>
          <p className="text-sm text-sage">
            Vous avez un vehicule a louer ?{" "}
            <a href="/inscription" className="text-gold hover:text-goldSoft">
              Creez un compte
            </a>{" "}
            puis activez le mode hote depuis votre espace.
          </p>
        </Reveal>
      </section>

      <footer className="border-t border-forestLight px-6 py-10 text-center md:px-12">
        <p className="font-display text-sm tracking-wide text-ivory">NEXPHILLE MOBILITY</p>
        <p className="mt-2 text-xs text-sage">&copy; 2026 Nexphille Mobility. Tous droits reserves.</p>
      </footer>
    </main>
  );
}
