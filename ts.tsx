
import React from 'react';
import { NailAnalysisResponse } from '../types';

interface ResultDisplayProps {
  result: NailAnalysisResponse;
  image: string;
  onReset: () => void;
  clientName?: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, image, onReset, clientName }) => {
  
  const shareOnWhatsApp = () => {
    const text = `✨ *Asesoría NailExpert Studio* ✨\n\n` +
                 `Hola ${clientName || 'Clienta'}, aquí tienes tu diagnóstico personalizado:\n\n` +
                 `🎨 *Tus Colores Ideales:* ${result.colores.join(', ')}\n\n` +
                 `💅 *Diseños Recomendados:* ${result.diseños.join(', ')}\n\n` +
                 `📝 *Nota del Experto:* ${result.explicacion}\n\n` +
                 `¡Te esperamos pronto para lucir estos diseños!`;
    
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* Sección Principal: Foto Original y Paleta */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 rounded-3xl overflow-hidden shadow-2xl bg-white p-2">
          <div className="relative group">
            <img src={image} alt="Original" className="w-full aspect-square object-cover rounded-2xl" />
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-widest font-bold">Foto Original</div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-rose-50 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold text-neutral-800 mb-2">Perfil Cromático</h2>
            <p className="text-rose-500 font-medium mb-8">Selección exclusiva para {clientName || 'la clienta'}</p>
            
            <div className="flex flex-wrap gap-4 mb-10">
              {result.colores.map((color, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div 
                    className="w-16 h-16 rounded-2xl shadow-lg transform transition-transform hover:scale-110 cursor-pointer"
                    style={{ backgroundColor: color, boxShadow: `0 10px 20px -5px ${color}44` }}
                  />
                  <span className="text-[10px] font-mono font-bold text-neutral-400">{color}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100">
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-3">Diagnóstico del Experto</h3>
            <p className="text-neutral-700 leading-relaxed italic text-lg">
              "{result.explicacion}"
            </p>
          </div>
        </div>
      </div>

      {/* Probador Virtual: Imágenes Editadas */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-neutral-900">Probador Virtual 2026</h2>
          <p className="text-neutral-500 mt-2">Simulación de los diseños aplicados sobre la mano real</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {result.imagenesDiseños?.map((img, idx) => (
            <div key={idx} className="group relative bg-white p-3 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="aspect-[3/4] rounded-[2rem] overflow-hidden mb-6">
                <img src={img} alt={result.diseños[idx]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="px-4 pb-4">
                <span className="text-rose-500 text-[10px] font-bold tracking-widest uppercase">Estilo Sugerido</span>
                <h4 className="text-xl font-bold text-neutral-800 mt-1">{result.diseños[idx]}</h4>
              </div>
              <div className="absolute top-6 right-6 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg">
                <span className="text-rose-500 font-bold text-sm">{idx + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-4">
        <button 
          onClick={shareOnWhatsApp}
          className="w-full md:w-auto px-12 py-5 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793 0-.853.448-1.273.607-1.446.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.088.275.073.376-.043l.433-.506c.101-.115.245-.086.389-.029l1.213.571c.144.073.239.116.275.173.036.059.036.331-.108.736z"/></svg>
          Enviar Asesoría a Clienta
        </button>
        
        <button 
          onClick={onReset}
          className="w-full md:w-auto px-12 py-5 bg-neutral-900 text-white rounded-full font-bold hover:bg-neutral-800 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Nueva Consulta
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;
