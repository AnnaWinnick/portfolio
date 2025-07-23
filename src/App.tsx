import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import FavoriteTools from './sections/FavoriteTools';
import WorkHighlights from './sections/WorkHighlights';
import Toolbox from './sections/Toolbox';
import Bookshelf from './sections/Bookshelf';
import Notes from './sections/Notes';
import Contact from './sections/Contact';

function App() {
  return (
    <div className="bg-white min-h-screen text-neutral-900">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 pb-16">
        <Hero />
        <div className="flex flex-col md:flex-row gap-6 my-8">
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="h-full min-h-[340px] max-h-[420px] flex flex-col">
              <FavoriteTools forceColumn />
            </div>
          </div>
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="h-full min-h-[340px] max-h-[420px] flex flex-col overflow-y-auto">
              <Notes />
            </div>
          </div>
        </div>
        <WorkHighlights />
        <Bookshelf />
        <Toolbox />
        <Contact />
      </main>
    </div>
  );
}

export default App;
