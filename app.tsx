
import React, { useState, useEffect } from 'react';
import { analyzeNails } from './services/geminiService';
import { AnalysisState } from './types';
import Camera from './components/Camera';
import ResultDisplay from './components/ResultDisplay';

// ESTE ES EL CÓDIGO QUE USARÁ TU EQUIPO PARA ENTRAR
const SALON_CODE = "MANICURA2026"; 

const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [inputCode, setInputCode] = useState("");
  const [clientName, setClientName] = useState("");
  const [state, setState] = useState<AnalysisState>({
    loading: false,
    generatingImages: false,
    result: null,
    error: null,
    image: null,
  });
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('salon_authorized') === 'true') {
      setIsAuthorized(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.toUpperCase() === SALON_CODE) {
      setIsAuthorized(true);
      localStorage.setItem('salon_authorized', 'true');
    } else {
      alert("Código incorrecto. Verifica con el administrador.");
    }
  };

  const handleCapture = async (base64: string) => {
    setShowCamera(false);
    setState(prev => ({ ...prev, loading: true, image: base64, error: null }));
    try {
      const result = await analyzeNails(base64);
      setState(prev => ({ ...prev, loading: false, result }));
    } catch (err) {
      setState(prev => ({ ...prev, loading: false, error: "Error analizando la imagen. Intenta de nuevo." }));
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] p-4">
        <div className="w-full max-w-sm bg-white p-8 rounded-[2.5rem] shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-rose-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold italic mx-auto shadow-lg rotate-3">N</div>
          <h1 className="text-2xl font-bold text-neutral-800">Acceso Salón</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Código del Salón" 
              className="w-full px-6 py-4 bg-neutral-50 rounded-2xl border border-neutral-100 text-center text-xl font-bold tracking-widest focus:ring-2 focus:ring-rose-500 outline-none"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
            />
            <button className="w-full py-4 bg-neutral-900 text-white rounded-2xl font-bold shadow-lg hover:bg-neutral-800 transition-all">
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-10">
      <header className="p-4 border-b border-rose-50 bg-white/80 backdrop-blur-md sticky top-0 z-40 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white font-bold italic text-sm">N</div>
          <span className="font-bold text-neutral-800">NailExpert <span className="text-rose-500 font-serif italic">Studio</span></span>
        </div>
        <button 
          onClick={() => { localStorage.removeItem('salon_authorized'); setIsAuthorized(false); }}
          className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest"
        >
          Cerrar Sesión
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {!state.result && !state.loading && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight">Nueva Clienta</h1>
              <input 
                type="text" 
                placeholder="Nombre de la clienta" 
                className="w-full max-w-xs mx-auto block px-4 py-3 border border-neutral-200 rounded-xl text-center shadow-sm focus:ring-2 focus:ring-rose-200 outline-none transition-all"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>

            <div className="grid gap-4">
              <button 
                onClick={() => setShowCamera(true)}
                className="w-full py-6 bg-neutral-900 text-white rounded-[2rem] font-bold shadow-2xl flex items-center justify-center gap-3 text-lg hover:bg-neutral-800 transition-all active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Escanear Mano
              </button>
              <label className="w-full py-5 bg-white border border-neutral-200 text-neutral-800 rounded-[2rem] font-bold shadow-md flex items-center justify-center gap-3 cursor-pointer hover:bg-neutral-50 transition-all active:scale-95">
                Subir de Galería
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const r = new FileReader();
                    r.onload = () => handleCapture(r.result as string);
                    r.readAsDataURL(file);
                  }
                }} />
              </label>
            </div>
          </div>
        )}

        {state.loading && (
          <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-6">
            <div className="w-16 h-16 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin"></div>
            <p className="text-neutral-500 font-medium italic">Elaborando propuesta para {clientName || 'la clienta'}...</p>
          </div>
        )}

        {state.result && state.image && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Diagnóstico Personalizado</p>
              <h2 className="text-3xl font-bold text-neutral-800">{clientName || "Clienta"}</h2>
            </div>
            <ResultDisplay 
              result={state.result} 
              image={state.image} 
              clientName={clientName}
              onReset={() => setState({ ...state, result: null, image: null })} 
            />
          </div>
        )}
      </main>

      {showCamera && <Camera onCapture={handleCapture} onCancel={() => setShowCamera(false)} />}
    </div>
  );
};

export default App;
