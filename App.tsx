import React, { useState, useMemo, useEffect } from 'react';
import {
  LESSON_SECTIONS,
  REMEMBER_ITEMS,
  QUIZ_QUESTIONS,
  PREVIOUS_TOPIC,
  SectionItem,
  InteractiveWord
} from './lessonData';
import {
  BookOpen,
  Volume2,
  Sparkles,
  HelpCircle,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Layers,
  ArrowRight,
  RotateCcw,
  BookMarked,
  Share2,
  Bookmark,
  Languages,
  Check,
  Zap,
  Info
} from 'lucide-react';

export default function App() {
  // Navigation tabs: 'lesson' | 'remember' | 'cards' | 'quiz' | 'previous' | 'glossary'
  const [activeTab, setActiveTab] = useState<'lesson' | 'remember' | 'quiz' | 'previous' | 'glossary'>('lesson');
  
  // Set of revealed Armenian translations (by item ID or section ID)
  const [revealedIds, setRevealedIds] = useState<Set<string>>(() => {
    // By default, reveal top introductory items so the user understands the mechanics,
    // or start with clean slate and interactive hints
    return new Set<string>(['sec-1', 'ex-1-1', 'ex-2-1', 'rem-1']);
  });

  // Search keyword (searches in Spanish and Armenian)
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected category filter
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Audio speech synthesis status
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [audioSpeed, setAudioSpeed] = useState<number>(0.9);

  // Bookmarked items
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => new Set<string>());

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Active modal or detail popup when user clicks a specific Spanish word
  const [activeWordModal, setActiveWordModal] = useState<InteractiveWord | null>(null);

  // Toggle single item translation
  const toggleReveal = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRevealedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Toggle all translations
  const revealAll = () => {
    const all = new Set<string>();
    LESSON_SECTIONS.forEach(sec => {
      all.add(sec.id);
      sec.examples.forEach(ex => all.add(ex.id));
      if (sec.extraContent?.items) {
        sec.extraContent.items.forEach((_, idx) => all.add(`${sec.id}-extra-${idx}`));
      }
    });
    REMEMBER_ITEMS.forEach(r => all.add(r.id));
    setRevealedIds(all);
  };

  const hideAll = () => {
    setRevealedIds(new Set());
  };

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Speak Spanish text via SpeechSynthesis API
  const speakSpanish = (text: string, id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!('speechSynthesis' in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    
    // Clean text of arrows or separators for smooth pronunciation
    const cleanText = text
      .replace(/[↔→=—–]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-ES';
    utterance.rate = audioSpeed;

    // Pick a natural Spanish voice if available
    const voices = window.speechSynthesis.getVoices();
    const esVoice = voices.find(v => v.lang.startsWith('es'));
    if (esVoice) utterance.voice = esVoice;

    setSpeakingId(id);
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    window.speechSynthesis.speak(utterance);
  };

  // Filtered lesson sections based on search and category
  const filteredSections = useMemo(() => {
    return LESSON_SECTIONS.filter(sec => {
      const matchesCategory = selectedCategory === 'all' || sec.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      
      const inTitle = sec.titleEs.toLowerCase().includes(q) || sec.titleHy.toLowerCase().includes(q);
      const inDesc = sec.descriptionEs.toLowerCase().includes(q) || sec.descriptionHy.toLowerCase().includes(q);
      const inExamples = sec.examples.some(ex => 
        ex.es.toLowerCase().includes(q) || 
        ex.hy.toLowerCase().includes(q) ||
        (ex.noteEs && ex.noteEs.toLowerCase().includes(q)) ||
        (ex.noteHy && ex.noteHy.toLowerCase().includes(q))
      );

      return inTitle || inDesc || inExamples;
    });
  }, [searchQuery, selectedCategory]);

  // All words flattened for Glossary
  const allGlossaryWords = useMemo(() => {
    const list: { sectionTitle: string; sectionId: string; item: InteractiveWord }[] = [];
    LESSON_SECTIONS.forEach(sec => {
      sec.examples.forEach(ex => {
        list.push({
          sectionTitle: `${sec.number}. ${sec.titleEs}`,
          sectionId: sec.id,
          item: ex
        });
      });
    });
    return list;
  }, []);

  const filteredGlossary = useMemo(() => {
    if (!searchQuery.trim()) return allGlossaryWords;
    const q = searchQuery.toLowerCase().trim();
    return allGlossaryWords.filter(({ item }) => 
      item.es.toLowerCase().includes(q) || 
      item.hy.toLowerCase().includes(q) ||
      (item.noteEs && item.noteEs.toLowerCase().includes(q)) ||
      (item.noteHy && item.noteHy.toLowerCase().includes(q))
    );
  }, [allGlossaryWords, searchQuery]);

  // Total items count for progress indicator
  const totalInteractiveCount = useMemo(() => {
    let count = 0;
    LESSON_SECTIONS.forEach(sec => {
      count += 1; // section description
      count += sec.examples.length;
    });
    return count;
  }, []);

  const revealedCount = useMemo(() => {
    return revealedIds.size;
  }, [revealedIds]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans','Noto_Sans_Armenian',sans-serif]">
      {/* Top Banner / Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-red-500 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white font-bold text-lg">
              🇪🇸
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  Իսպաներեն ↔ Հայերեն
                </span>
                <span className="text-xs text-slate-400">
                  Հաջորդ թեմա
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                <span>Palabras y significados</span>
                <span className="text-slate-400 font-normal hidden sm:inline">|</span>
                <span className="text-amber-400 font-semibold text-base hidden sm:inline">Բառեր և իմաստներ</span>
              </h1>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Speed selector */}
            <div className="flex items-center bg-slate-800/80 rounded-lg p-1 border border-slate-700 text-xs">
              <span className="text-slate-400 px-2 hidden md:inline">Ձայն:</span>
              <button
                onClick={() => setAudioSpeed(0.8)}
                className={`px-2 py-1 rounded transition-colors ${audioSpeed === 0.8 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
                title="Դանդաղ արտասանություն"
              >
                0.8x
              </button>
              <button
                onClick={() => setAudioSpeed(1.0)}
                className={`px-2 py-1 rounded transition-colors ${audioSpeed === 1.0 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
                title="Նորմալ արտասանություն"
              >
                1.0x
              </button>
            </div>

            {/* Global reveal / hide toggle */}
            <button
              onClick={revealedCount > totalInteractiveCount / 2 ? hideAll : revealAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs sm:text-sm font-medium transition text-amber-300"
              title="Սեղմեք բոլոր թարգմանությունները միանգամից բացելու կամ փակելու համար"
            >
              {revealedCount > totalInteractiveCount / 2 ? (
                <>
                  <EyeOff className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Թաքցնել հայերենը</span>
                  <span className="sm:hidden">Թաքցնել</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Բացել հայերենը</span>
                  <span className="sm:hidden">Բացել</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-800/80 pt-1 pb-1">
          <button
            onClick={() => setActiveTab('lesson')}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'lesson'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>13 Թեմաներ (Lección)</span>
          </button>

          <button
            onClick={() => setActiveTab('remember')}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'remember'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Հիշելու համար (Para recordar)</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'quiz'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Ստուգիչ թեստ (Quiz)</span>
          </button>

          <button
            onClick={() => setActiveTab('glossary')}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'glossary'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Languages className="w-4 h-4" />
            <span>Բառարան (Glosario)</span>
          </button>

          <button
            onClick={() => setActiveTab('previous')}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'previous'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-sky-300 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Նախորդ թեման (La lengua como sistema)</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {/* Interactive Notice Bar */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-900 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
          <div className="flex items-start sm:items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <Zap className="w-5 h-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-amber-200">
                ✨ Ինտերակտիվ ռեժիմ՝ սեղմեք ցանկացած իսպաներեն բառի կամ նախադասության վրա
              </p>
              <p className="text-xs text-slate-400">
                Կտտացրեք իսպաներեն տեքստին՝ անմիջապես հայերեն թարգմանությունը և բացատրությունը բացելու համար։ Բարձրախոսի կոճակով կարող եք լսել ճիշտ արտասանությունը։
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400 shrink-0 self-end sm:self-auto">
            <span className="bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
              Բացված թարգմանություններ՝ <strong className="text-amber-400">{revealedCount}</strong>
            </span>
          </div>
        </div>

        {/* Tab 1: Lesson Sections */}
        {activeTab === 'lesson' && (
          <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Որոնել բառ, թեմա կամ արտահայտություն (իսպաներեն կամ հայերեն)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs bg-slate-800 px-1.5 py-0.5 rounded"
                  >
                    Մաքրել
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: 'Բոլորը' },
                  { id: 'Semántica', label: 'Իմաստաբանություն' },
                  { id: 'Relaciones', label: 'Հարաբերություններ' },
                  { id: 'Léxico', label: 'Բառապաշար' },
                  { id: 'Morfología y Léxico', label: 'Կառուցվածք' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                      selectedCategory === cat.id
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List of sections */}
            <div className="space-y-6">
              {filteredSections.map(sec => {
                const isSecDescRevealed = revealedIds.has(sec.id);

                return (
                  <article
                    key={sec.id}
                    className="rounded-2xl border border-slate-800/90 bg-gradient-to-b from-slate-900/90 to-slate-950 p-5 sm:p-6 shadow-xl transition-all duration-200 hover:border-slate-700"
                  >
                    {/* Section Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800/70 pb-4">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold flex items-center justify-center text-base">
                          {sec.number}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                              {sec.titleEs}
                            </h2>
                            <button
                              onClick={e => speakSpanish(sec.titleEs, `title-${sec.id}`, e)}
                              className="text-slate-400 hover:text-amber-400 p-1 rounded-md transition"
                              title="Լսել արտասանությունը"
                            >
                              <Volume2 className={`w-4 h-4 ${speakingId === `title-${sec.id}` ? 'text-amber-400 animate-pulse' : ''}`} />
                            </button>
                          </div>
                          <p className="text-sm font-medium text-amber-400/90">
                            {sec.titleHy}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800/90 border border-slate-700 text-slate-300 font-medium">
                          {sec.badge}
                        </span>
                      </div>
                    </div>

                    {/* Section Rule / Explanation - Interactive Card */}
                    <div
                      onClick={() => toggleReveal(sec.id)}
                      className={`cursor-pointer rounded-xl p-4 mb-5 border transition-all duration-200 ${
                        isSecDescRevealed
                          ? 'bg-slate-900/90 border-amber-500/30 ring-1 ring-amber-500/10'
                          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-2 flex-1">
                          {/* Spanish text */}
                          <div className="flex items-start gap-2">
                            <span className="text-base select-none">🇪🇸</span>
                            <div className="flex-1">
                              <span className="text-xs font-semibold uppercase text-amber-400/80 tracking-wider block mb-0.5">
                                Español (Սեղմեք հայերենը բացելու համար)
                              </span>
                              <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
                                {sec.descriptionEs}
                              </p>
                            </div>
                            <button
                              onClick={e => speakSpanish(sec.descriptionEs, `desc-${sec.id}`, e)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition shrink-0"
                              title="Լսել իսպաներեն կանոնը"
                            >
                              <Volume2 className={`w-4 h-4 ${speakingId === `desc-${sec.id}` ? 'text-amber-400 animate-pulse' : ''}`} />
                            </button>
                          </div>

                          {/* Armenian translation - shown on click */}
                          {isSecDescRevealed ? (
                            <div className="pt-3 border-t border-slate-800/80 flex items-start gap-2 mt-2 animate-fadeIn">
                              <span className="text-base select-none">🇦🇲</span>
                              <div className="flex-1">
                                <span className="text-xs font-semibold uppercase text-sky-400 tracking-wider block mb-0.5">
                                  Հայերեն թարգմանություն
                                </span>
                                <p className="text-sm sm:text-base text-sky-100 font-medium leading-relaxed bg-sky-950/30 p-2.5 rounded-lg border border-sky-900/40">
                                  {sec.descriptionHy}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="pt-2 flex items-center gap-1.5 text-xs text-amber-400/80 font-medium">
                              <Eye className="w-3.5 h-3.5" />
                              <span>Սեղմեք այստեղ՝ հայերեն բացատրությունը տեսնելու համար</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Examples Section Title */}
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Օրինակներ և կիրառություն (Ejemplos)</span>
                      </h3>
                      <span className="text-xs text-slate-500">
                        Սեղմեք յուրաքանչյուր քարտի վրա
                      </span>
                    </div>

                    {/* Interactive Examples Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {sec.examples.map(ex => {
                        const isRevealed = revealedIds.has(ex.id);
                        const isBookmarked = bookmarks.has(ex.id);

                        return (
                          <div
                            key={ex.id}
                            onClick={() => toggleReveal(ex.id)}
                            className={`group relative text-left rounded-xl p-3.5 border transition-all duration-200 cursor-pointer ${
                              isRevealed
                                ? 'bg-slate-900/90 border-amber-500/40 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/20'
                                : 'bg-slate-950/60 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/50'
                            }`}
                          >
                            {/* Card Top: Spanish text & action icons */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs select-none">🇪🇸</span>
                                <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                                  {ex.type === 'sentence' ? 'Նախադասություն' : ex.type === 'pair' ? 'Զույգ' : ex.type === 'family' ? 'Ընտանիք' : 'Բառ'}
                                </span>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={e => speakSpanish(ex.es, ex.id, e)}
                                  className="p-1 rounded-md text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition"
                                  title="Լսել արտասանությունը"
                                >
                                  <Volume2 className={`w-3.5 h-3.5 ${speakingId === ex.id ? 'text-amber-400 animate-pulse' : ''}`} />
                                </button>
                                <button
                                  onClick={e => toggleBookmark(ex.id, e)}
                                  className={`p-1 rounded-md transition ${isBookmarked ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
                                  title={isBookmarked ? 'Հեռացնել պահպանվածներից' : 'Պահպանել'}
                                >
                                  <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} />
                                </button>
                              </div>
                            </div>

                            {/* Spanish main expression */}
                            <p className="text-sm sm:text-base font-bold text-amber-200 group-hover:text-amber-300 leading-snug mb-1">
                              {ex.es}
                            </p>

                            {/* Spanish Note if available */}
                            {ex.noteEs && (
                              <p className="text-xs text-slate-400 italic mb-2">
                                {ex.noteEs}
                              </p>
                            )}

                            {/* Armenian Translation Box */}
                            <div className="mt-2 pt-2 border-t border-slate-800/80">
                              {isRevealed ? (
                                <div className="space-y-1">
                                  <div className="flex items-start gap-1.5">
                                    <span className="text-xs select-none">🇦🇲</span>
                                    <p className="text-sm font-semibold text-sky-300">
                                      {ex.hy}
                                    </p>
                                  </div>
                                  {ex.noteHy && (
                                    <p className="text-xs text-slate-400 pl-4">
                                      {ex.noteHy}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <div className="flex items-center justify-between text-xs text-slate-400 group-hover:text-amber-400 transition-colors">
                                  <span>Սեղմեք թարգմանության համար</span>
                                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Extra Content block if any (e.g., comparative sentences) */}
                    {sec.extraContent && (
                      <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                        {sec.extraContent.titleEs && (
                          <div className="mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                              {sec.extraContent.titleEs}
                            </span>
                            <span className="text-xs text-slate-400">
                              {sec.extraContent.titleHy}
                            </span>
                          </div>
                        )}
                        <div className="space-y-2">
                          {sec.extraContent.items.map((item, idx) => {
                            const extraId = `${sec.id}-extra-${idx}`;
                            const isRevealed = revealedIds.has(extraId);
                            return (
                              <div
                                key={idx}
                                onClick={() => toggleReveal(extraId)}
                                className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-sm font-semibold text-slate-200">
                                    🇪🇸 {item.es}
                                  </p>
                                  <button
                                    onClick={e => speakSpanish(item.es, extraId, e)}
                                    className="p-1 text-slate-400 hover:text-amber-400 transition"
                                  >
                                    <Volume2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                {isRevealed ? (
                                  <p className="text-xs font-medium text-sky-300 mt-1 pt-1 border-t border-slate-800">
                                    🇦🇲 {item.hy}
                                  </p>
                                ) : (
                                  <span className="text-[11px] text-slate-500 block mt-1">
                                    Սեղմեք հայերեն թարգմանության համար
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Para recordar — Հիշելու համար */}
        {activeTab === 'remember' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/30 shadow-xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🧠</span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  Para recordar — Հիշելու համար
                </h2>
              </div>
              <p className="text-sm text-slate-300">
                Ամփոփիչ քարտեր բոլոր հիմնական հասկացությունների համար։ Սեղմեք ցանկացած իսպաներեն քարտի վրա՝ հայերեն բացատրությունը բացելու կամ թեստավորվելու համար։
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {REMEMBER_ITEMS.map(item => {
                const isRevealed = revealedIds.has(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleReveal(item.id)}
                    className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 ${
                      isRevealed
                        ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-amber-500/50 shadow-xl ring-1 ring-amber-500/20'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block">
                            Հայեցակարգ · Término
                          </span>
                          <h3 className="text-lg font-bold text-white">
                            {item.termEs}
                          </h3>
                        </div>
                      </div>

                      <button
                        onClick={e => speakSpanish(item.termEs + '. ' + item.defEs, item.id, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition"
                        title="Լսել արտասանությունը"
                      >
                        <Volume2 className={`w-4 h-4 ${speakingId === item.id ? 'text-amber-400 animate-pulse' : ''}`} />
                      </button>
                    </div>

                    {/* Spanish Definition */}
                    <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 mb-3">
                      <span className="text-[11px] font-semibold uppercase text-amber-400/90 tracking-wider block mb-1">
                        🇪🇸 Español
                      </span>
                      <p className="text-sm font-semibold text-amber-100">
                        {item.termEs} → {item.defEs}
                      </p>
                    </div>

                    {/* Armenian Translation */}
                    <div className="pt-2 border-t border-slate-800/80">
                      {isRevealed ? (
                        <div className="bg-sky-950/40 p-3 rounded-xl border border-sky-900/50 animate-fadeIn">
                          <span className="text-[11px] font-semibold uppercase text-sky-400 tracking-wider block mb-1">
                            🇦🇲 Հայերեն
                          </span>
                          <p className="text-sm font-bold text-sky-200">
                            {item.termHy}
                          </p>
                          <p className="text-xs text-sky-300/90 mt-0.5">
                            {item.defHy}
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-xs text-slate-400 hover:text-amber-300 py-1">
                          <span>Կտտացրեք հայերենը բացելու համար</span>
                          <Eye className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Quiz & Interactive Test */}
        {activeTab === 'quiz' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/30">
              <div className="flex items-center gap-3 mb-2">
                <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <HelpCircle className="w-6 h-6" />
                </span>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Գիտելիքների ստուգում (Test de conocimientos)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Պատասխանեք հարցերին՝ ստուգելու ձեր գիտելիքները Monosemia, Polisemia, Sinonimia, Antonimia և մյուս թեմաներից։
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {QUIZ_QUESTIONS.map((q, qIndex) => {
                const selectedOptIndex = quizAnswers[q.id];
                const isAnswered = selectedOptIndex !== undefined;

                return (
                  <div
                    key={q.id}
                    className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                          Հարց {qIndex + 1} / {QUIZ_QUESTIONS.length}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-white">
                          🇪🇸 {q.questionEs}
                        </h3>
                        <p className="text-sm font-medium text-slate-300">
                          🇦🇲 {q.questionHy}
                        </p>
                      </div>
                      <button
                        onClick={() => speakSpanish(q.questionEs, `q-${q.id}`)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition shrink-0"
                        title="Լսել հարցը"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Options */}
                    <div className="space-y-2">
                      {q.options.map((opt, optIndex) => {
                        const isSelected = selectedOptIndex === optIndex;
                        let btnStyle = 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/70';

                        if (isAnswered) {
                          if (opt.correct) {
                            btnStyle = 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200 ring-1 ring-emerald-500/30';
                          } else if (isSelected && !opt.correct) {
                            btnStyle = 'bg-rose-950/60 border-rose-500/60 text-rose-200 ring-1 ring-rose-500/30';
                          }
                        }

                        return (
                          <button
                            key={optIndex}
                            disabled={isAnswered}
                            onClick={() => {
                              setQuizAnswers(prev => ({ ...prev, [q.id]: optIndex }));
                            }}
                            className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between gap-3 ${btnStyle}`}
                          >
                            <div className="space-y-0.5">
                              <p className="text-sm font-bold text-slate-100">
                                {opt.textEs}
                              </p>
                              <p className="text-xs text-slate-400">
                                {opt.textHy}
                              </p>
                            </div>
                            {isAnswered && (
                              <span>
                                {opt.correct ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                ) : isSelected ? (
                                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                                ) : null}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation after answered */}
                    {isAnswered && (
                      <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-1 animate-fadeIn">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                          <Info className="w-3.5 h-3.5" />
                          <span>Բացատրություն (Explicación)</span>
                        </span>
                        <p className="text-xs sm:text-sm text-slate-300">
                          🇪🇸 {q.explanationEs}
                        </p>
                        <p className="text-xs sm:text-sm text-sky-300 font-medium">
                          🇦🇲 {q.explanationHy}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quiz reset button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setQuizAnswers({})}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>Վերագործարկել թեստը (Reiniciar test)</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Glossary (Բառարան) */}
        {activeTab === 'glossary' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-slate-900 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <Languages className="w-5 h-5 text-amber-400" />
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Բառարան և օրինակներ (Glosario interactivo)
                </h2>
              </div>
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Փնտրել բառ կամ թարգմանություն..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredGlossary.map(({ sectionTitle, item }) => {
                const isRevealed = revealedIds.has(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleReveal(item.id)}
                    className={`cursor-pointer p-3.5 rounded-xl border transition ${
                      isRevealed
                        ? 'bg-slate-900/90 border-amber-500/40'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="text-[10px] text-amber-400 font-semibold truncate max-w-[150px]">
                        {sectionTitle}
                      </span>
                      <button
                        onClick={e => speakSpanish(item.es, `glo-${item.id}`, e)}
                        className="text-slate-400 hover:text-amber-400"
                        title="Լսել"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-sm font-bold text-white mb-1">
                      {item.es}
                    </p>

                    {item.noteEs && (
                      <p className="text-[11px] text-slate-400 italic mb-2">
                        {item.noteEs}
                      </p>
                    )}

                    <div className="pt-2 border-t border-slate-800">
                      {isRevealed ? (
                        <p className="text-xs font-semibold text-sky-300">
                          🇦🇲 {item.hy}
                        </p>
                      ) : (
                        <span className="text-[11px] text-slate-500 hover:text-amber-400">
                          Սեղմեք թարգմանության համար
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 5: Previous Topic (La lengua como sistema) */}
        {activeTab === 'previous' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-500/10 via-slate-900 to-slate-950 border border-sky-500/30">
              <div className="flex items-center gap-3 mb-2">
                <span className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
                  <Layers className="w-6 h-6" />
                </span>
                <div>
                  <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
                    Նախորդ թեման (Tema anterior)
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    La lengua como sistema — Լեզուն որպես համակարգ
                  </h2>
                </div>
              </div>
              <div className="space-y-1 mt-3">
                <p className="text-sm text-slate-200">
                  🇪🇸 {PREVIOUS_TOPIC.introEs}
                </p>
                <p className="text-sm text-sky-300 font-medium">
                  🇦🇲 {PREVIOUS_TOPIC.introHy}
                </p>
              </div>
            </div>

            {/* Language levels */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                Լեզվի մակարդակները (Niveles de la lengua)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PREVIOUS_TOPIC.levels.map((lvl, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-base font-bold text-white">
                        {lvl.nameEs}
                      </h4>
                      <button
                        onClick={() => speakSpanish(lvl.nameEs, `prev-${idx}`)}
                        className="p-1 text-slate-400 hover:text-amber-400"
                        title="Լսել"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs font-semibold text-amber-400">
                      {lvl.nameHy}
                    </p>
                    <p className="text-xs text-slate-300">
                      🇪🇸 {lvl.descEs}
                    </p>
                    <p className="text-xs text-sky-300 font-medium pt-1 border-t border-slate-800/80">
                      🇦🇲 {lvl.descHy}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-amber-300">
                  Անցնել նոր թեմային՝ Palabras y significados
                </p>
                <p className="text-xs text-slate-400">
                  Բառային-իմաստային մակարդակը (Nivel léxico-semántico) ուսումնասիրվում է այս դասում։
                </p>
              </div>
              <button
                onClick={() => setActiveTab('lesson')}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shrink-0 transition"
              >
                <span>Բացել դասը</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-4 px-4 text-center text-xs text-slate-500">
        <p>
          📘 Palabras y significados (Բառեր և իմաստներ) — Իսպաներենի ինտերակտիվ ուսուցում
        </p>
      </footer>
    </div>
  );
}
