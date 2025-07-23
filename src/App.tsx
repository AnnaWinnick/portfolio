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
        <FavoriteTools />
        <WorkHighlights />
        <Bookshelf />
        <Toolbox />
        <Notes />
        <Contact />
      </main>
    </div>
  );
}

export default App;
