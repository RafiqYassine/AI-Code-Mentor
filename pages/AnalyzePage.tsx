import React, { useState } from 'react';
import { AnalysisMode, UserProfile } from '../types';
import { analyzeCode } from '../services/geminiService';
import { saveAnalysis } from '../firebase';
import { Button } from '../components/Button';
import { Select } from '../components/Select';
import ReactMarkdown from 'react-markdown';

interface AnalyzePageProps {
  user: UserProfile | null;
  onLoginRequest: () => void;
}

export const AnalyzePage: React.FC<AnalyzePageProps> = ({ user, onLoginRequest }) => {
  const [code, setCode] = useState('');
  const [mode, setMode] = useState<AnalysisMode>(AnalysisMode.EXPLAIN);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError("Please enter some code to analyze.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    // Capture the original code before analysis for history
    const originalCode = code;

    try {
      const { markdown, code: improvedCode } = await analyzeCode(originalCode, mode);
      setResult(markdown);

      if (improvedCode) {
        setCode(improvedCode);
      }

      // Save to history if user is logged in
      // We save the original code to history so the user knows what they asked about
      if (user) {
        await saveAnalysis(user.uid, originalCode, mode, markdown);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      {/* Input Section */}
      <div className="flex flex-col gap-4">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col gap-4 h-full min-h-[500px]">
          <div className="flex items-center justify-between">
             <h2 className="text-lg font-semibold text-neutral-900">Input Code</h2>
             <div className="w-48">
               <Select 
                 value={mode} 
                 onChange={(e) => setMode(e.target.value as AnalysisMode)}
                 aria-label="Analysis Mode"
               >
                 <option value={AnalysisMode.EXPLAIN}>{AnalysisMode.EXPLAIN}</option>
                 <option value={AnalysisMode.IMPROVE}>{AnalysisMode.IMPROVE}</option>
                 <option value={AnalysisMode.BUGS}>{AnalysisMode.BUGS}</option>
               </Select>
             </div>
          </div>
          
          <textarea
            className="flex-1 w-full p-4 font-mono text-sm bg-neutral-50 border border-neutral-200 rounded-xl resize-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none transition-all placeholder:text-neutral-400"
            placeholder="// Paste your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
          />
          
          <div className="flex items-center justify-between pt-2">
             <span className="text-xs text-neutral-400">
               {code.length} characters
             </span>
             <Button 
               onClick={handleAnalyze} 
               isLoading={loading}
               className="min-w-[120px]"
             >
               Analyze
             </Button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </div>

      {/* Output Section */}
      <div className="flex flex-col gap-4">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm h-full min-h-[500px] flex flex-col">
           <h2 className="text-lg font-semibold text-neutral-900 mb-4">
             AI Analysis
           </h2>
           
           <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
             {loading ? (
               <div className="h-full flex flex-col items-center justify-center text-neutral-400 gap-4 animate-pulse">
                 <div className="w-12 h-12 bg-neutral-200 rounded-full"></div>
                 <div className="w-3/4 h-4 bg-neutral-200 rounded"></div>
                 <div className="w-1/2 h-4 bg-neutral-200 rounded"></div>
               </div>
             ) : result ? (
               <div className="prose prose-sm prose-neutral max-w-none">
                 <ReactMarkdown>{result}</ReactMarkdown>
               </div>
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-neutral-400 text-center">
                 <svg className="w-12 h-12 mb-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                 </svg>
                 <p>Select a mode and analyze your code to see the magic happen.</p>
                 {!user && (
                   <p className="mt-4 text-xs">
                     <button onClick={onLoginRequest} className="underline hover:text-neutral-600">
                       Sign in
                     </button>{" "}
                     to save your history.
                   </p>
                 )}
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};