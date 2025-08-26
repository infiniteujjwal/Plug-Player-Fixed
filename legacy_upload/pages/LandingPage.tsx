import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import { IframeModal } from '../components/modals';
import { LogoIcon } from '../components/Logo';
import { useTheme } from '../contexts/ThemeContext';

const Icons = {
    TeamBuilder: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM18 13.5l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 18l-1.035.259a3.375 3.375 0 00-2.456 2.456L18 21.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 18l1.036-.259a3.375 3.375 0 002.455-2.456L18 13.5z" /></svg>,
    GlobalTalent: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 01-.5-17.98m.5 17.98a9 9 0 000-17.98m0 17.98H12m0-17.98h0m-4.5 9.49a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" /></svg>,
    Workflow: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>,
    Payments: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.6-3.751A11.959 11.959 0 0112 5.714z" /></svg>,
    Sun: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>,
    Moon: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>,
};

const CompanyLogo: React.FC<{ name: string }> = ({ name }) => (
  <div className="text-gray-400 dark:text-gray-500 font-bold text-2xl flex-shrink-0 px-8">{name}</div>
);

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            className="rounded-full p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? <Icons.Moon className="h-6 w-6" /> : <Icons.Sun className="h-6 w-6" />}
        </button>
    );
};

const Header: React.FC<{ onDemoClick: () => void }> = ({ onDemoClick }) => {
    return (
        <header className="absolute inset-x-0 top-0 z-50">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <Link to="/" className="-m-1.5 p-1.5 flex items-center gap-2">
                        <LogoIcon className="h-7 w-auto" />
                        <span className="font-bold text-xl text-gray-900 dark:text-white">PlugPlayers</span>
                    </Link>
                </div>
                <div className="flex flex-1 justify-end items-center gap-4">
                    <ThemeToggle />
                    <Button variant="ghost" className="hidden sm:inline-flex text-gray-800 dark:text-white hover:bg-gray-900/5 dark:hover:bg-white/10" onClick={onDemoClick}>Request a demo</Button>
                    <Link to="/register">
                         <Button>Get Started</Button>
                    </Link>
                </div>
            </nav>
        </header>
    );
}

const LandingPage: React.FC = () => {
  const { theme } = useTheme();
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => elements.forEach((el) => observer.unobserve(el));
  }, []);

  return (
    <>
    <IframeModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        src="https://cal.com/brewmycode/15min"
        title="Book a Demo"
    />
    <div className="bg-gray-50 dark:bg-black text-gray-800 dark:text-gray-200 overflow-x-hidden">
      
      <div className="relative">
        <Header onDemoClick={() => setIsDemoModalOpen(true)} />
        <main>
          <div className="relative isolate pt-14">
              <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                  <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-500 to-amber-400 opacity-30 dark:from-primary-600/50 dark:to-amber-500/30 dark:opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-slow-spin" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
              </div>

              <div className="py-24 sm:py-32 lg:pb-40">
                  <div className="mx-auto max-w-7xl px-6 lg:px-8">
                      <div className="mx-auto max-w-3xl text-center animate-on-scroll">
                          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                              Powering the next generation of global teams.
                          </h1>
                          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                             Find, hire, and manage top-tier tech talent from around the world. PlugPlayers streamlines the entire process, from team building to secure payments.
                          </p>
                          <div className="mt-10 flex items-center justify-center gap-x-6">
                              <Link to="/register"><Button size="lg">Get Started for Free</Button></Link>
                              <Button variant="secondary" size="lg" onClick={() => setIsDemoModalOpen(true)}>Request a demo</Button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        </main>
      </div>

       <div className="relative -mt-16 sm:-mt-24 pb-24 sm:pb-32 animate-on-scroll bg-gray-50 dark:bg-black">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="relative w-full overflow-hidden">
                <p className="text-center text-sm font-semibold text-gray-500 dark:text-gray-400 mb-6 tracking-widest">TRUSTED BY</p>
                <div className="flex marquee-content">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex flex-shrink-0">
                      <CompanyLogo name="Innovate Inc." />
                      <CompanyLogo name="Synergy" />
                      <CompanyLogo name="Growth Stage" />
                      <CompanyLogo name="QuantumLeap" />
                      <CompanyLogo name="NextGen" />
                      <CompanyLogo name="Apex" />
                    </div>
                  ))}
                </div>
              </div>
          </div>
      </div>


      <section className="bg-white dark:bg-gray-950 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center animate-on-scroll">
                <h2 className="text-base font-semibold leading-7 text-primary-600 dark:text-primary-400">Why PlugPlayers?</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                    The all-in-one platform for building and managing your dream team.
                </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-5xl">
                <dl className="grid max-w-xl grid-cols-1 gap-12 lg:max-w-none lg:grid-cols-2">
                    {[
                      { icon: Icons.TeamBuilder, title: 'AI-Powered Team Building', description: 'Describe your project goal, and our AI suggests the optimal team structure, saving you weeks of planning.' },
                      { icon: Icons.GlobalTalent, title: 'Global Talent Pool', description: 'Access a curated network of pre-vetted engineers, designers, and managers from around the world.' },
                      { icon: Icons.Workflow, title: 'Streamlined Workflow', description: 'From interviews and contracts to messaging and payments, manage the entire hiring lifecycle in one place.' },
                      { icon: Icons.Payments, title: 'Secure Payments', description: 'Pay your global team with confidence. We handle the complexities of international payments and compliance.' }
                    ].map((feature, index) => (
                       <div key={feature.title} className="group relative flex gap-x-6 animate-on-scroll" style={{ animationDelay: `${index * 150}ms`}}>
                          <div className="flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-900 group-hover:bg-primary-500/10 dark:group-hover:bg-gray-800 dark:group-hover:shadow-2xl dark:group-hover:shadow-primary-500/20 transition-all duration-300">
                             <feature.icon className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300" />
                          </div>
                          <div>
                            <dt className="text-lg font-semibold leading-7 text-gray-900 dark:text-white">{feature.title}</dt>
                            <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-400">{feature.description}</dd>
                          </div>
                       </div>
                    ))}
                </dl>
            </div>
        </div>
      </section>

      <section className="bg-gray-100 dark:bg-black py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center animate-on-scroll">
                <h2 className="text-base font-semibold leading-7 text-primary-600 dark:text-primary-400">How it works</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                    Get started in 3 simple steps.
                </p>
            </div>
            <div className="relative mt-20 animate-on-scroll">
                 <div className="absolute left-0 top-6 w-full hidden lg:block" aria-hidden="true">
                    <div className="mx-auto h-0.5 w-full max-w-2xl bg-gradient-to-r from-transparent via-primary-500 to-transparent line-on-scroll" />
                </div>
                <div className="mx-auto grid max-w-2xl grid-cols-1 gap-12 text-center lg:max-w-none lg:grid-cols-3">
                    <div className="flex flex-col items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-2xl font-bold text-gray-900 z-10">1</div>
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Define Your Team</h3>
                            <p className="mt-2 text-base text-gray-600 dark:text-gray-400">Use our AI Team Builder to describe your project and get a recommended team structure in minutes.</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-2xl font-bold text-gray-900 z-10">2</div>
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Interview & Hire</h3>
                            <p className="mt-2 text-base text-gray-600 dark:text-gray-400">We provide a shortlist of pre-vetted candidates. Schedule interviews and send offers directly on the platform.</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-2xl font-bold text-gray-900 z-10">3</div>
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Manage & Pay</h3>
                            <p className="mt-2 text-base text-gray-600 dark:text-gray-400">Collaborate with your new team, manage contracts, and handle all payments securely in one place.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-white dark:bg-gray-950 px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl animate-on-scroll">
            <figure className="mt-10">
                <blockquote className="text-center text-xl font-semibold leading-8 text-gray-900 dark:text-white sm:text-2xl sm:leading-9">
                    <p>“PlugPlayers completely transformed our hiring process. We built a world-class engineering team in weeks, not months. The AI Team Builder is a game-changer.”</p>
                </blockquote>
                <figcaption className="mt-10">
                    <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                        <div className="font-semibold text-gray-900 dark:text-white">Alice, CEO</div>
                        <svg viewBox="0 0 2 2" width="3" height="3" aria-hidden="true" className="fill-gray-900 dark:fill-gray-300">
                            <circle cx="1" cy="1" r="1" />
                        </svg>
                        <div className="text-gray-600 dark:text-gray-400">Innovate Inc.</div>
                    </div>
                </figcaption>
            </figure>
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-black">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center animate-on-scroll">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Ready to build your global team?</h2>
                <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600 dark:text-gray-300">
                    Join dozens of innovative startups who trust PlugPlayers to find, hire, and manage top talent.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                     <Link to="/register"><Button size="lg">Get Started Now</Button></Link>
                </div>
            </div>
        </div>
      </section>

      <footer className="bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 lg:px-8">
            <div className="flex justify-center">
                <LogoIcon className="h-8 w-auto" />
            </div>
            <p className="mt-6 text-center text-xs leading-5 text-gray-500 dark:text-gray-400">&copy; {new Date().getFullYear()} PlugPlayers, Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
    </>
  );
};

export default LandingPage;