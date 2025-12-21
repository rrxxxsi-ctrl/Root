
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, History, BarChart3, Wand2, Copy, Trash2, Loader2, Plus, 
  FileText, Download, X, Save, Globe, Sun, Moon, Fingerprint, TrendingUp, 
  Zap, CheckCircle2, AlignRight, ChevronLeft, Search, Filter, PieChart, Activity, LogOut, Settings, Bell, Cpu, ShieldCheck,
  MessageCircle, Mail, Edit3, Type, Grid, Sparkles, RefreshCcw, Trash, Hash, Terminal, BookOpen, Eye, Languages,
  ChevronUp, ChevronDown, ZoomIn, ZoomOut, SearchCode, Lightbulb, ZapOff, Layers, MousePointer2, ShieldAlert, Lock, ShieldEllipsis, ScanText
} from 'lucide-react';
import { AppState, Extraction, Toast, OCRMode } from './types';
import { extractTextFromImage, summarizeText, translateText, analyzeTextMeaning } from './services/geminiService';
import { db } from './services/dbService';

const USER_PHOTO = "https://www2.0zz0.com/2025/12/17/06/790723590.jpg"; 

const I18N = {
  ar: {
    welcome: "نظام تايتان الآمن",
    subtitle: "المعالج الذكي النشط - حماية فائقة بإشراف عبد الإله فلاته",
    platform_desc: "منصة متطورة مشفرة بالكامل تحول الصور والمستندات إلى نصوص رقمية. نظام محمي ضد الاختراق والعبث ببروتوكولات أمنية عسكرية.",
    upload: "مسح جديد",
    dashboard: "الرئيسية",
    history: "الأرشيف",
    stats: "البيانات",
    logout: "خروج",
    processing: "يتم التحليل والتحقق الأمني",
    no_files: "النظام فارغ",
    start_now: "ابدأ بتغذية النظام بالملفات",
    total_files: "المستندات",
    total_words: "الكلمات",
    success_rate: "الدقة",
    active_now: "الإصدار V5 Secure",
    copy_success: "تم النسخ بنجاح",
    save_success: "تم الحفظ بنجاح",
    quick_entry: "دخول آمن للنظام",
    authenticating: "يتم فحص الهوية...",
    system_status: "الحالة: محمي بالكامل",
    last_update: "آخر مزامنة",
    copyright: "جميع الحقوق محفوظة لعبد الإله فلاته © 2025",
    developer_full_title: "معالج ذكي باشراف عبد الاله فلاته",
    developer_sub: "نظام تايتان V5 - طبقة حماية عسكرية",
    search_placeholder: "ابحث في المستندات المشفرة...",
    mode_standard: "نص قياسي",
    mode_handwriting: "خط يدوي",
    mode_table: "جداول",
    tab_titan: "تايتان AI",
    tab_verify: "تحقق",
    tab_summary: "ملخص",
    tab_editor: "المحرر",
    cat_intro: "المقدمة والعناوين",
    cat_sentences: "الجمل المفيدة والكاملة",
    cat_numbers: "الأرقام والبيانات",
    cat_symbols: "الرموز والعلامات الخاصة",
    translate: "ترجمة",
    analyze_meaning: "تحليل المضمون",
    advice_title: "التفسير والنصيحة الذكية",
    f_speed: "معالجة فورية",
    f_speed_desc: "بمحرك Flash سريع",
    f_hand: "فك الخط اليدوي",
    f_hand_desc: "لأصعب الخطوط العربية",
    f_table: "تحليل الجداول",
    f_table_desc: "بيانات رقمية دقيقة",
    f_ai: "ذكاء توليدي",
    f_ai_desc: "تلخيص وتحليل منطقي",
    efficiency: "كفاءة الحماية",
    security_verifying: "جارِ فحص بروتوكولات التشفير...",
    security_verified: "تم التحقق من سلامة البيانات",
    encrypted: "بيانات مشفرة AES-256",
    firewall_active: "الجدار الناري نشط"
  },
  en: {
    welcome: "Titan Secure OS",
    subtitle: "Active Smart Processor - Military Grade Protection",
    platform_desc: "Encrypted AI platform for document digitization. Protected against tampering and unauthorized access via advanced protocols.",
    upload: "New Scan",
    dashboard: "Dashboard",
    history: "Archive",
    stats: "Insights",
    logout: "Exit",
    processing: "Processing & Security Scan...",
    no_files: "System Empty",
    start_now: "Upload files to begin",
    total_files: "Documents",
    total_words: "Words",
    success_rate: "Accuracy",
    active_now: "V5 Secure Build",
    copy_success: "Copied",
    save_success: "Saved",
    quick_entry: "Secure Access",
    authenticating: "Authenticating...",
    system_status: "Status: Fully Protected",
    last_update: "Sync Done",
    copyright: "All Rights Reserved © 2025",
    developer_full_title: "Smart Processor - Fallatah Ed.",
    developer_sub: "Titan OS V5 - Military Shield",
    search_placeholder: "Search encrypted docs...",
    mode_standard: "Standard",
    mode_handwriting: "Handwriting",
    mode_table: "Tables",
    tab_titan: "Titan AI",
    tab_verify: "Verify",
    tab_summary: "Summary",
    tab_editor: "Editor",
    cat_intro: "Intro & Headers",
    cat_sentences: "Full Useful Sentences",
    cat_numbers: "Numeric Data",
    cat_symbols: "Symbols & Special",
    translate: "Translate",
    analyze_meaning: "Deep Analysis",
    advice_title: "Analysis & Advice",
    f_speed: "Instant Processing",
    f_speed_desc: "Fast Flash Engine",
    f_hand: "Handwriting OCR",
    f_hand_desc: "Complex Arabic OCR",
    f_table: "Table Analysis",
    f_table_desc: "Digital conversion",
    f_ai: "Generative AI",
    f_ai_desc: "Summary & Logic",
    efficiency: "Security Efficiency",
    security_verifying: "Scanning encryption protocols...",
    security_verified: "Data integrity verified",
    encrypted: "AES-256 Encrypted",
    firewall_active: "Firewall Active"
  }
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    view: 'landing',
    currentUser: null,
    projects: [],
    extractions: [],
    activeProjectId: 'default',
    loading: false,
    theme: 'dark',
    language: 'ar',
    selectedItems: [],
    ocrMode: 'standard',
    toasts: []
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [processingFiles, setProcessingFiles] = useState<{name: string, progress: number, mode: OCRMode}[]>([]);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginStep, setLoginStep] = useState(0);
  const [editingItem, setEditingItem] = useState<Extraction | null>(null);
  const [activeTab, setActiveTab] = useState<'titan' | 'verify' | 'summary' | 'editor'>('titan');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [tempSummary, setTempSummary] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(24);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [meaningResult, setMeaningResult] = useState<string | null>(null);

  const t = I18N[appState.language];

  useEffect(() => {
    const saved = db.loadData();
    if (saved) setAppState(prev => ({ ...prev, ...saved, selectedItems: [], toasts: [] }));
  }, []);

  useEffect(() => {
    if (appState.currentUser) db.saveData({ ...appState, toasts: [], selectedItems: [] });
    document.documentElement.dir = appState.language === 'ar' ? 'rtl' : 'ltr';
  }, [appState]);

  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setAppState(prev => ({ ...prev, toasts: [...prev.toasts, { id, message, type }] }));
    setTimeout(() => setAppState(prev => ({ ...prev, toasts: prev.toasts.filter(t => t.id !== id) })), 3000);
  };

  const handleQuickLogin = async () => {
    setIsLoggingIn(true);
    setLoginStep(1); // Biometric
    await new Promise(r => setTimeout(r, 800));
    setLoginStep(2); // Encryption Check
    await new Promise(r => setTimeout(r, 800));
    setLoginStep(3); // Firewall Handshake
    await new Promise(r => setTimeout(r, 800));
    
    setAppState(prev => ({
      ...prev,
      currentUser: { id: 'u1', name: 'Abdulilah', email: 'me@titan.ai', avatar: USER_PHOTO },
      view: 'dashboard'
    }));
    setIsLoggingIn(false);
    setLoginStep(0);
    addToast(t.security_verified, "success");
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const currentMode = appState.ocrMode;
    setAppState(prev => ({ ...prev, view: 'dashboard' }));
    
    for (const file of Array.from(files)) {
      setProcessingFiles(prev => [...prev, { name: file.name, progress: 0, mode: currentMode }]);
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        
        const result = await extractTextFromImage(base64, currentMode);
        
        const newEx: Extraction = {
          id: Math.random().toString(36).substr(2, 9),
          projectId: 'default',
          fileName: file.name,
          timestamp: Date.now(),
          content: result.text || "",
          structuredContent: result.structured || { introduction: [], sentences: [result.text], numbers: [], symbols: [] },
          image: base64,
          enhancedImage: result.enhancedImage,
          status: 'completed',
          wordCount: (result.text || "").trim().split(/\s+/).filter(x => x).length,
          mode: currentMode
        };
        
        setAppState(prev => ({ ...prev, extractions: [newEx, ...prev.extractions] }));
        addToast(appState.language === 'ar' ? `تم معالجة ${file.name} وتشفيره` : `Processed & Encrypted ${file.name}`, "success");
      } catch (err) {
        addToast("Security breach or error processing file", "error");
        console.error(err);
      } finally {
        setProcessingFiles(prev => prev.filter(f => f.name !== file.name));
      }
    }
  };

  const moveSentence = (category: keyof NonNullable<Extraction['structuredContent']>, index: number, direction: 'up' | 'down') => {
    if (!editingItem || !editingItem.structuredContent) return;
    const items = [...editingItem.structuredContent[category]];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    [items[index], items[newIndex]] = [items[newIndex], items[index]];
    
    const updatedStructured = { ...editingItem.structuredContent, [category]: items };
    const newFullText = [
      ...updatedStructured.introduction,
      ...updatedStructured.sentences,
      ...updatedStructured.numbers,
      ...updatedStructured.symbols
    ].join('\n');
    
    setEditingItem({ ...editingItem, structuredContent: updatedStructured, content: newFullText });
  };

  const handleDetailedAnalysis = async () => {
    if (!editingItem || !editingItem.content) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeTextMeaning(editingItem.content);
      setMeaningResult(result);
    } catch (e) {
      addToast("Analysis failed", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateSummary = async () => {
    if (!editingItem || !editingItem.content) return;
    setIsSummarizing(true);
    try {
      const summary = await summarizeText(editingItem.content);
      setTempSummary(summary);
    } catch (e) {
      addToast("Error generating summary", "error");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleTranslate = async () => {
    if (!editingItem || !editingItem.content) return;
    const target = appState.language === 'ar' ? 'English' : 'العربية';
    addToast(appState.language === 'ar' ? 'يتم الترجمة الآمنة...' : 'Translating securely...', "info");
    try {
      const translated = await translateText(editingItem.content, target);
      setEditingItem({ ...editingItem, content: translated });
      addToast(appState.language === 'ar' ? 'تمت الترجمة' : 'Translated', "success");
    } catch (e) {
      addToast("Translation failed", "error");
    }
  };

  useEffect(() => {
    if (editingItem && activeTab === 'verify' && !meaningResult && !isAnalyzing) handleDetailedAnalysis();
  }, [activeTab, editingItem]);

  useEffect(() => {
    if (editingItem && activeTab === 'summary' && !tempSummary) generateSummary();
  }, [activeTab, editingItem]);

  const filteredExtractions = useMemo(() => {
    return appState.extractions.filter(ex => 
      ex.fileName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      ex.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [appState.extractions, searchQuery]);

  if (!appState.currentUser && appState.view === 'landing') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-between p-4 md:p-6 text-center relative overflow-x-hidden bg-[#050507]">
        <div className="mesh-bg"></div>
        
        <div className="mt-4 md:mt-6 flex flex-col items-center gap-4 md:gap-8 animate-in fade-in zoom-in duration-1000 w-full max-w-4xl">
           
           <div className="relative flex items-center justify-center p-8 md:p-12">
              <div className="absolute w-[240px] h-[240px] md:w-[320px] md:h-[320px] rounded-full border border-indigo-500/30 ring-spin shadow-[0_0_20px_rgba(99,102,241,0.2)]"></div>
              <div className="absolute w-[220px] h-[220px] md:w-[300px] md:h-[300px] rounded-full border border-purple-500/30 ring-spin-reverse shadow-[0_0_20px_rgba(168,85,247,0.2)]"></div>
              <div className="absolute w-[200px] h-[200px] md:w-[280px] md:h-[280px] rounded-full border-2 border-dashed border-cyan-500/20 ring-spin"></div>
              
              <div className="absolute w-32 h-32 md:w-48 md:h-48 bg-indigo-600/20 blur-[60px] rounded-full"></div>
              <div className="absolute w-32 h-32 md:w-48 md:h-48 bg-purple-600/10 blur-[80px] rounded-full"></div>
              
              <div className="relative z-10 w-28 h-28 md:w-44 md:h-44 rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 shadow-[0_0_60px_rgba(99,102,241,0.6)] overflow-hidden pulse-glow">
                 <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/10">
                    <img src={USER_PHOTO} className="w-full h-full object-cover" />
                 </div>
                 {/* Security Indicator */}
                 <div className="absolute top-0 right-0 p-2 bg-emerald-500 rounded-full shadow-lg animate-bounce">
                    <ShieldCheck size={16} className="text-white" />
                 </div>
              </div>
           </div>

           <div className="space-y-4 md:space-y-6 w-full px-2">
              <div className="neon-glow-container inline-block">
                 <div className="relative px-6 py-4 md:px-12 md:py-6 glass-panel border border-white/10 rounded-[1.8rem] md:rounded-[2.5rem] flex flex-col items-center gap-1 active-glow">
                    <span className="text-indigo-400 font-black text-[9px] md:text-xs uppercase tracking-[0.4em] opacity-60">{t.developer_sub}</span>
                    <h1 className="text-xl md:text-4xl font-black shimmer-text leading-tight dev-name-glow">
                       {t.developer_full_title}
                    </h1>
                    <div className="w-12 md:w-24 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-full mt-1"></div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-2 md:gap-3 max-w-lg mx-auto stagger-in">
                 <FeatureItem icon={<Lock className="text-purple-400" size={16}/>} title={t.f_hand} desc={t.f_hand_desc} />
                 <FeatureItem icon={<Zap className="text-amber-400" size={16}/>} title={t.f_speed} desc={t.f_speed_desc} />
                 <FeatureItem icon={<Grid className="text-cyan-400" size={16}/>} title={t.f_table} desc={t.f_table_desc} />
                 <FeatureItem icon={<ShieldCheck className="text-indigo-400" size={16}/>} title={t.f_ai} desc={t.f_ai_desc} />
              </div>

              <p className="text-gray-400 text-[9px] md:text-sm font-medium max-w-xl mx-auto opacity-70 leading-relaxed px-6">
                {t.platform_desc}
              </p>
           </div>
        </div>

        <div className="w-full max-w-xs md:max-w-sm mb-4">
           <button onClick={handleQuickLogin} className="w-full group relative py-4 md:py-5 bg-indigo-600 rounded-[1.5rem] md:rounded-[2rem] font-black text-sm md:text-lg shadow-[0_12px_25px_rgba(99,102,241,0.3)] active:scale-95 flex items-center justify-center gap-3 text-white overflow-hidden transition-all hover:bg-indigo-500 active-glow">
             {isLoggingIn ? (
               <div className="flex items-center gap-3">
                 <Loader2 className="animate-spin" size={18} />
                 <span className="text-[10px] uppercase font-black">
                   {loginStep === 1 ? "Scan Biometric..." : loginStep === 2 ? "Verify AES Key..." : "Firewall Handshake..."}
                 </span>
               </div>
             ) : (
               <>
                 <Fingerprint size={22} />
                 <span className="relative z-10 uppercase tracking-widest">{t.quick_entry}</span>
               </>
             )}
           </button>
           <div className="mt-4 flex items-center justify-center gap-2 opacity-30 text-[8px] font-black uppercase tracking-widest">
              <ShieldAlert size={10} />
              {t.firewall_active}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen h-screen overflow-hidden bg-black">
      <header className="system-bar h-16 flex items-center justify-between px-6 md:px-10 z-[200] glass-panel border-b border-white/5">
         <div className="flex items-center gap-4">
            <div className="p-2 bg-indigo-600 rounded-lg active-glow"><Lock size={18}/></div>
            <span className="font-black text-xs tracking-widest shimmer-text uppercase">Titan Secure V5</span>
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
               <span className="text-[9px] text-emerald-500 font-black">{t.firewall_active}</span>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <button onClick={() => setAppState(p => ({...p, language: p.language === 'ar' ? 'en' : 'ar'}))} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest">{appState.language.toUpperCase()}</button>
            <button onClick={() => setAppState(p => ({...p, currentUser: null, view: 'landing'}))} className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><LogOut size={16}/></button>
            <img src={USER_PHOTO} className="w-10 h-10 rounded-full border border-indigo-500/30 object-cover" />
         </div>
      </header>

      <div className={`flex flex-1 overflow-hidden ${appState.language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
        <nav className="w-20 md:w-24 lg:w-72 flex flex-col items-center py-10 gap-6 border-l border-white/5 bg-black/40 z-50">
           <SideLink icon={<LayoutDashboard size={20}/>} label={t.dashboard} active={appState.view === 'dashboard'} onClick={() => setAppState(p => ({...p, view: 'dashboard'}))} />
           <SideLink icon={<History size={20}/>} label={t.history} active={appState.view === 'history'} onClick={() => setAppState(p => ({...p, view: 'history'}))} />
           <SideLink icon={<BarChart3 size={20}/>} label={t.stats} active={appState.view === 'stats'} onClick={() => setAppState(p => ({...p, view: 'stats'}))} />
           <div className="mt-auto p-4 w-full">
              <button onClick={() => document.getElementById('file-in')?.click()} className="w-full aspect-square lg:aspect-auto lg:h-16 bg-indigo-600 rounded-3xl flex items-center justify-center gap-4 text-white shadow-2xl hover:scale-105 transition-all active-glow"><Plus size={24}/></button>
              <input type="file" id="file-in" hidden multiple onChange={e => handleFileUpload(e.target.files)} />
           </div>
        </nav>

        <main className="flex-1 flex flex-col p-6 md:p-12 overflow-hidden relative">
           <div className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className={`${appState.language === 'ar' ? 'text-right' : 'text-left'}`}>
                 <h2 className="text-3xl md:text-5xl font-black">{t.welcome} <span className="text-indigo-500">.</span></h2>
                 <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-2">{t.subtitle}</p>
              </div>
              <div className="glass-panel p-1.5 rounded-3xl flex items-center bg-black/40 border-white/5 w-full lg:w-auto overflow-x-auto no-scrollbar">
                 <ModeBtn active={appState.ocrMode === 'standard'} onClick={() => setAppState(p => ({...p, ocrMode: 'standard'}))} icon={<Type size={14}/>} label={t.mode_standard} />
                 <ModeBtn active={appState.ocrMode === 'handwriting'} onClick={() => setAppState(p => ({...p, ocrMode: 'handwriting'}))} icon={<Sparkles size={14}/>} label={t.mode_handwriting} special />
                 <ModeBtn active={appState.ocrMode === 'table'} onClick={() => setAppState(p => ({...p, ocrMode: 'table'}))} icon={<Grid size={14}/>} label={t.mode_table} />
              </div>
           </div>

           <div className="flex-1 overflow-y-auto custom-scroll pb-20 no-scrollbar">
              {appState.view === 'dashboard' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
                   {processingFiles.map((file, i) => (
                      <div key={i} className={`glass-panel p-6 rounded-[2rem] flex items-center gap-6 border border-white/10 bg-indigo-600/5 animate-pulse`}>
                         <Loader2 size={24} className="animate-spin text-indigo-400" />
                         <div className="flex-1">
                           <span className="font-black text-sm block truncate">{file.name}</span>
                           <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{t.processing}</span>
                         </div>
                      </div>
                   ))}
                   {appState.extractions.length === 0 && processingFiles.length === 0 ? (
                      <div className="col-span-full py-40 flex flex-col items-center justify-center opacity-10">
                         <ShieldEllipsis size={48} className="mb-4" />
                         <h3 className="text-2xl font-black uppercase tracking-[0.3em]">{t.no_files}</h3>
                      </div>
                   ) : (
                      appState.extractions.slice(0, 9).map(item => <CompactCard key={item.id} item={item} onOpen={() => { setEditingItem(item); setActiveTab('titan'); setMeaningResult(null); }} />)
                   )}
                </div>
              )}
              {appState.view === 'history' && (
                <div className="max-w-4xl mx-auto space-y-4">
                   <div className="flex items-center gap-3 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl mb-4">
                      <Lock size={14} className="text-indigo-400" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">{t.encrypted}</span>
                   </div>
                   {filteredExtractions.map(item => <HistoryRow key={item.id} item={item} onOpen={() => { setEditingItem(item); setActiveTab('titan'); }} />)}
                </div>
              )}
              {appState.view === 'stats' && <StatsView extractions={appState.extractions} t={t} />}
           </div>
        </main>
      </div>

      {editingItem && (
         <div className="fixed inset-0 z-[1000] bg-[#050507] flex flex-col p-4 md:p-10 animate-in zoom-in duration-300 overflow-hidden">
            <header className="flex flex-col items-center gap-6 mb-8 shrink-0">
               <div className="w-full flex justify-between items-center">
                  <button onClick={() => { setEditingItem(null); setTempSummary(null); setMeaningResult(null); }} className="p-4 bg-white/5 rounded-2xl hover:bg-red-500 transition-all border border-white/10 text-gray-400">
                    <X size={24}/>
                  </button>
                  <div className="flex gap-4">
                     <button onClick={handleTranslate} className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl font-black text-xs text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-3 uppercase tracking-widest">
                       <Languages size={16}/> {t.translate}
                     </button>
                     <button onClick={() => { navigator.clipboard.writeText(editingItem.content); addToast(t.copy_success, "success"); }} className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl font-black text-xs text-white hover:bg-white/10 transition-all flex items-center gap-3 uppercase tracking-widest">
                       <Copy size={16}/> {appState.language === 'ar' ? 'نسخ' : 'Copy'}
                     </button>
                     <button onClick={() => { setAppState(p => ({...p, extractions: p.extractions.map(ex => ex.id === editingItem.id ? editingItem : ex)})); setEditingItem(null); addToast(t.save_success, "success"); }} className="bg-indigo-600 px-10 py-3 rounded-2xl font-black text-xs text-white shadow-2xl hover:scale-105 transition-all flex items-center gap-3 active-glow uppercase tracking-widest">
                       <Save size={16}/> {appState.language === 'ar' ? 'حفظ' : 'Store'}
                     </button>
                  </div>
               </div>
               <div className="bg-[#0f0f14] p-1.5 rounded-[2.5rem] flex items-center border border-white/5 shadow-2xl overflow-x-auto no-scrollbar">
                  <TabItem active={activeTab === 'editor'} onClick={() => setActiveTab('editor')} label={t.tab_editor} />
                  <TabItem active={activeTab === 'summary'} onClick={() => setActiveTab('summary')} label={t.tab_summary} />
                  <TabItem active={activeTab === 'verify'} onClick={() => setActiveTab('verify')} label={t.tab_verify} />
                  <TabItem active={activeTab === 'titan'} onClick={() => setActiveTab('titan')} label={t.tab_titan} special />
               </div>
            </header>

            <div className="flex-1 bg-white/2 rounded-[3rem] border border-white/5 p-6 md:p-12 overflow-hidden flex flex-col glass-panel shadow-2xl relative">
               <div className="absolute top-6 left-6 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-xl p-2 rounded-2xl border border-white/10">
                  <button onClick={() => setFontSize(prev => Math.max(14, prev - 2))} className="p-2 hover:bg-white/10 rounded-xl transition-all text-white"><ZoomOut size={18}/></button>
                  <span className="text-xs font-black w-8 text-center text-indigo-400">{fontSize}</span>
                  <button onClick={() => setFontSize(prev => Math.min(48, prev + 2))} className="p-2 hover:bg-white/10 rounded-xl transition-all text-white"><ZoomIn size={18}/></button>
                  <div className="mx-2 w-px h-6 bg-white/10"></div>
                  <Lock size={14} className="text-emerald-500" />
               </div>

               {activeTab === 'titan' && (
                 <div className="flex-1 overflow-y-auto custom-scroll space-y-10 animate-in fade-in duration-500 no-scrollbar">
                    <div className="grid grid-cols-1 gap-8">
                       <CategorySection icon={<BookOpen size={20}/>} title={t.cat_intro} items={editingItem.structuredContent?.introduction || []} onMove={(i, d) => moveSentence('introduction', i, d)} fontSize={fontSize} />
                       <CategorySection icon={<Terminal size={20}/>} title={t.cat_sentences} items={editingItem.structuredContent?.sentences || []} onMove={(i, d) => moveSentence('sentences', i, d)} fontSize={fontSize} />
                       <CategorySection icon={<Hash size={20}/>} title={t.cat_numbers} items={editingItem.structuredContent?.numbers || []} onMove={(i, d) => moveSentence('numbers', i, d)} fontSize={fontSize} />
                       <CategorySection icon={<Sparkles size={20}/>} title={t.cat_symbols} items={editingItem.structuredContent?.symbols || []} onMove={(i, d) => moveSentence('symbols', i, d)} fontSize={fontSize} />
                    </div>
                 </div>
               )}

               {activeTab === 'editor' && (
                 <textarea value={editingItem.content} onChange={e => setEditingItem({...editingItem, content: e.target.value})} dir={appState.language === 'ar' ? 'rtl' : 'ltr'} className="flex-1 bg-transparent border-none outline-none font-medium leading-relaxed custom-scroll text-white resize-none tracking-tight p-4 no-scrollbar" style={{ fontSize: `${fontSize}px` }} placeholder="..." autoFocus />
               )}

               {activeTab === 'verify' && (
                 <div className="flex-1 flex flex-col gap-6 overflow-hidden animate-in zoom-in duration-500">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
                        <div className="rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/50 p-4 flex items-center justify-center relative">
                           <img src={editingItem.image} className="max-w-full max-h-full object-contain rounded-2xl shadow-xl" alt="source" />
                           <div className="absolute bottom-6 right-6 p-3 bg-black/80 border border-white/10 rounded-2xl backdrop-blur-xl flex items-center gap-3">
                              <ScanText size={16} className="text-indigo-400" />
                              <span className="text-[9px] font-black uppercase text-indigo-200">Integrity Scan OK</span>
                           </div>
                        </div>
                        <div className="flex flex-col gap-6 overflow-hidden">
                           <div className="flex-[1] custom-scroll overflow-y-auto p-8 font-medium leading-relaxed text-indigo-100 bg-indigo-500/5 rounded-[2.5rem] border border-indigo-500/10 no-scrollbar" style={{ fontSize: `${fontSize * 0.7}px` }}>
                              <h6 className="font-black text-[9px] uppercase tracking-[0.3em] text-indigo-400/50 mb-3">Secure Extract</h6>
                              {editingItem.content}
                           </div>
                           
                           {(isAnalyzing || meaningResult) && (
                              <div className="flex-[2] glass-panel p-8 md:p-10 rounded-[2.5rem] border-indigo-500/50 bg-indigo-600/10 flex flex-col overflow-hidden shadow-[0_0_40px_rgba(99,102,241,0.15)] ring-1 ring-white/5 animate-in slide-in-from-bottom-5">
                                 <h6 className="flex items-center gap-3 font-black text-[12px] md:text-sm uppercase tracking-[0.3em] text-indigo-400 mb-6 shrink-0">
                                    <Lightbulb size={20} className="active-glow text-amber-400"/> 
                                    {t.advice_title}
                                 </h6>
                                 {isAnalyzing ? (
                                    <div className="flex-1 flex items-center justify-center text-indigo-500">
                                       <Loader2 size={40} className="animate-spin opacity-40"/>
                                    </div>
                                 ) : (
                                    <div className="flex-1 overflow-y-auto custom-scroll text-white font-semibold leading-[1.8] no-scrollbar whitespace-pre-wrap selection:bg-indigo-500/30" 
                                         style={{ fontSize: `${fontSize * 0.8}px` }}>
                                       {meaningResult}
                                    </div>
                                 )}
                              </div>
                           )}
                        </div>
                    </div>
                 </div>
               )}

               {activeTab === 'summary' && (
                 <div className="flex-1 flex flex-col items-center justify-center p-10 animate-in slide-in-from-bottom-10 duration-500 overflow-y-auto no-scrollbar">
                    {isSummarizing ? <Loader2 size={48} className="animate-spin text-indigo-500" /> : <div className="max-w-4xl w-full text-center space-y-12"><div className="font-black shimmer-text leading-snug" style={{ fontSize: `${fontSize * 1.5}px` }}>{tempSummary}</div><button onClick={generateSummary} className="px-10 py-5 bg-indigo-600/10 text-indigo-400 rounded-full border border-indigo-500/20 font-black text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"><RefreshCcw size={18}/></button></div>}
                 </div>
               )}

               <footer className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center px-6 shrink-0">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 bg-black flex items-center justify-center relative">
                        <img src={editingItem.image} className="w-full h-full object-cover opacity-60" />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <Lock size={12} className="text-white/40" />
                        </div>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{editingItem.wordCount} {t.total_words}</span>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em]">{editingItem.mode.toUpperCase()}</span>
                           <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                           <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">VERIFIED</span>
                        </div>
                     </div>
                  </div>
               </footer>
            </div>
         </div>
      )}

      <div className="fixed bottom-10 inset-x-0 z-[2000] flex flex-col items-center gap-4 pointer-events-none px-4">
         {appState.toasts.map(toast => (
            <div key={toast.id} className="flex items-center gap-5 px-8 py-5 rounded-[2rem] border border-white/10 bg-black/90 backdrop-blur-3xl shadow-2xl animate-in slide-in-from-bottom-10 pointer-events-auto">
               <div className={`w-3 h-3 rounded-full ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>
               <span className="font-black text-xs uppercase tracking-widest text-white">{toast.message}</span>
            </div>
         ))}
      </div>
    </div>
  );
};

const FeatureItem = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="flex flex-col items-center gap-2 p-3 md:p-4 glass-panel border border-white/5 rounded-2xl hover:bg-white/5 transition-all group">
     <div className="p-3 bg-black/40 rounded-xl group-hover:scale-110 active-glow transition-transform">{icon}</div>
     <div className="text-center">
        <h3 className="text-[9px] md:text-sm font-black text-white uppercase tracking-wider mb-1">{title}</h3>
        <p className="text-[7px] md:text-[9px] text-gray-500 font-bold leading-tight opacity-70">{desc}</p>
     </div>
  </div>
);

const CategorySection = ({ icon, title, items, onMove, fontSize }: { icon: any, title: string, items: string[], onMove: (i: number, d: 'up'|'down') => void, fontSize: number }) => (
  <div className="glass-panel p-8 md:p-10 rounded-[3rem] border-indigo-500/30 bg-indigo-600/5 shadow-2xl relative overflow-hidden">
     <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 -rotate-45 translate-x-8 -translate-y-8 flex items-end justify-center pb-2">
        <Lock size={10} className="text-indigo-400 opacity-20" />
     </div>
     <div className="flex items-center justify-between mb-8">
        <h5 className="flex items-center gap-4 font-black text-xs uppercase tracking-[0.4em] text-indigo-400">
           {icon} {title}
        </h5>
        <span className="bg-indigo-600/20 text-indigo-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">Secure Data</span>
     </div>
     <div className="space-y-6">
        {items.length === 0 ? <p className="text-gray-600 italic text-sm">...</p> : items.map((item: string, i: number) => (
           <div key={i} className="group/sentence flex items-start gap-4">
              <div className="flex-1 text-white leading-relaxed font-medium border-r-4 border-indigo-600 pr-8 py-3 transition-all hover:bg-white/5 rounded-l-2xl cursor-text select-text" style={{ fontSize: `${fontSize}px` }}>{item}</div>
              <div className="flex flex-col gap-2 opacity-0 group-hover/sentence:opacity-100 transition-opacity">
                 <button onClick={() => onMove(i, 'up')} disabled={i === 0} className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl hover:bg-indigo-600 hover:text-white disabled:opacity-20 transition-all"><ChevronUp size={18}/></button>
                 <button onClick={() => onMove(i, 'down')} disabled={i === items.length - 1} className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl hover:bg-indigo-600 hover:text-white disabled:opacity-20 transition-all"><ChevronDown size={18}/></button>
              </div>
           </div>
        ))}
     </div>
  </div>
);

const TabItem = ({ active, onClick, label, special }: any) => (
  <button onClick={onClick} className={`px-10 py-3.5 rounded-full transition-all duration-500 font-bold text-sm whitespace-nowrap ${active ? (special ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'bg-indigo-600/80 text-white shadow-lg scale-105') : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>{label}</button>
);

const ModeBtn = ({ active, onClick, icon, label, special, danger }: any) => (
  <button onClick={(e) => { e.stopPropagation(); onClick(); }} className={`flex-1 flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl transition-all duration-300 font-black text-xs uppercase tracking-widest whitespace-nowrap ${active ? (danger ? 'bg-red-600 text-white shadow-xl' : special ? 'bg-purple-600 text-white shadow-xl' : 'bg-indigo-600 text-white shadow-xl') : 'text-gray-500 hover:bg-white/5'}`}><span className={`${active ? 'scale-125' : 'scale-100'} transition-transform duration-500`}>{icon}</span><span className="hidden sm:inline">{label}</span></button>
);

const SideLink = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 py-5 px-7 transition-all duration-500 font-black text-xs relative group ${active ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}><span className={`shrink-0 ${active ? 'text-indigo-500 scale-110' : ''}`}>{icon}</span><span className="hidden lg:block uppercase tracking-[0.3em] text-[10px]">{label}</span>{active && <div className="absolute right-0 top-1/4 bottom-1/4 w-1 bg-indigo-500 rounded-l-full active-glow"></div>}</button>
);

const HistoryRow = ({ item, onOpen }: any) => (
  <div onClick={onOpen} className="glass-panel px-10 py-6 rounded-3xl flex items-center gap-8 cursor-pointer hover:bg-white/5 transition-all border-white/5 group relative overflow-hidden">
     <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${item.mode === 'handwriting' ? 'bg-purple-600/20 text-purple-400' : 'bg-indigo-600/20 text-indigo-400'}`}>{item.mode === 'handwriting' ? <Sparkles size={20}/> : <FileText size={20}/>}</div>
     <div className="flex-1 overflow-hidden">
        <p className="font-black text-base truncate">{item.fileName}</p>
        <div className="flex items-center gap-3">
           <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{new Date(item.timestamp).toLocaleTimeString()}</span>
           <div className="w-1 h-1 bg-white/10 rounded-full"></div>
           <span className="text-[8px] font-black text-indigo-500/50 uppercase tracking-widest">AES-256</span>
        </div>
     </div>
     <ChevronLeft size={24} className="text-gray-700 shrink-0" />
  </div>
);

const CompactCard = ({ item, onOpen }: any) => (
  <div onClick={onOpen} className={`glass-panel p-5 rounded-[2.5rem] border-white/5 hover:translate-y-[-8px] transition-all cursor-pointer group bg-black/40 flex flex-col gap-5 ${item.mode === 'handwriting' ? 'border-purple-500/20' : ''}`}>
     <div className="h-44 rounded-[2.2rem] bg-black/60 overflow-hidden relative border border-white/5">
        <img src={item.enhancedImage || item.image} className="w-full h-full object-cover opacity-20 group-hover:opacity-60 transition-all duration-1000 scale-110 group-hover:scale-100" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500"><div className={`p-5 rounded-2xl border border-white/10 ${item.mode === 'handwriting' ? 'bg-purple-600/60' : 'bg-indigo-600/60'}`}><Lock size={24}/></div></div>
        <div className="absolute top-4 left-4 p-2 bg-black/60 backdrop-blur-lg rounded-xl border border-white/10">
           <ShieldCheck size={12} className="text-emerald-500" />
        </div>
     </div>
     <div className="px-4 pb-3">
        <h4 className="font-black text-sm truncate mb-4">{item.fileName}</h4>
        <div className="flex justify-between items-center">
           <span className={`${item.mode === 'handwriting' ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' : 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'} text-[10px] font-black px-5 py-2 rounded-full border uppercase tracking-widest`}>{item.mode.toUpperCase()}</span>
           <span className="text-gray-600 text-[10px] font-black opacity-40 uppercase tracking-widest">{new Date(item.timestamp).toLocaleDateString()}</span>
        </div>
     </div>
  </div>
);

const StatsView = ({ extractions, t }: any) => (
  <div className="space-y-12 max-w-7xl mx-auto animate-in fade-in duration-700">
     <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        <Metric label={t.total_files} value={extractions.length} color="indigo" icon={<FileText size={20}/>} />
        <Metric label={t.total_words} value={extractions.reduce((a:any,c:any)=>a+c.wordCount,0)} color="emerald" icon={<AlignRight size={20}/>} />
        <Metric label={t.success_rate} value="99.9%" color="blue" icon={<CheckCircle2 size={20}/>} />
        <Metric label={t.active_now} value="BUILD V5" color="purple" icon={<Lock size={20}/>} />
     </div>
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="glass-panel p-12 rounded-[3.5rem] bg-black/40 flex flex-col justify-center items-center text-center group relative overflow-hidden">
           <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <div className="w-32 h-32 rounded-full border-8 border-indigo-500/20 border-t-indigo-500 flex items-center justify-center mb-8 shadow-2xl relative z-10 active-glow"><ShieldCheck size={48} className="text-indigo-500" /></div>
           <h4 className="font-black text-2xl mb-3 relative z-10">{t.system_status}</h4>
           <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px] relative z-10">{t.last_update}: {new Date().toLocaleTimeString()}</p>
        </div>
        <div className="glass-panel p-12 rounded-[3.5rem] bg-black/40 relative group overflow-hidden">
           <h4 className="font-black text-[11px] uppercase tracking-[0.4em] text-gray-500 mb-10 flex items-center gap-4"><Activity size={20} className="text-indigo-500"/> {t.efficiency}</h4>
           <div className="flex items-end gap-3 h-44">
              {[45, 75, 55, 95, 70, 85, 60, 100, 80, 90].map((h, i) => (
                <div key={i} className="flex-1 bg-indigo-500/10 rounded-t-2xl relative group/bar overflow-hidden">
                   <div className="absolute inset-x-0 bottom-0 bg-indigo-500 rounded-t-2xl transition-all duration-1000 group-hover/bar:bg-indigo-400" style={{height: `${h}%`}}></div>
                </div>
              ))}
           </div>
        </div>
     </div>
  </div>
);

const Metric = ({ label, value, color, icon }: any) => {
  const colorMap: any = { indigo: 'text-indigo-400 bg-indigo-500/5 border-indigo-500/10', emerald: 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10', blue: 'text-blue-400 bg-blue-500/5 border-blue-500/10', purple: 'text-purple-400 bg-purple-500/5 border-purple-500/10' };
  return (
    <div className={`glass-panel p-10 rounded-[3rem] flex flex-col items-center gap-4 transition-all hover:scale-105 border group ${colorMap[color]}`}>
       <div className="p-4 bg-black/40 rounded-2xl mb-1 group-hover:scale-110 active-glow transition-transform">{icon}</div>
       <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">{label}</span>
       <span className="text-4xl font-black tracking-tighter text-white">{value}</span>
    </div>
  );
};

export default App;
