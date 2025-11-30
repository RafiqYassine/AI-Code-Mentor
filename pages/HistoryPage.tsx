import React, { useEffect, useState } from 'react';
import { HistoryItem, UserProfile } from '../types';
import { fetchHistory } from '../firebase';
import ReactMarkdown from 'react-markdown';

interface HistoryPageProps {
  user: UserProfile | null;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ user }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchHistory(user.uid)
        .then((data) => {
          // Cast the Firestore data to HistoryItem array safely
          setHistory(data as unknown as HistoryItem[]);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="text-center py-20 text-neutral-500">
        Please sign in to view your history.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4 max-w-3xl mx-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm animate-pulse">
            <div className="h-4 bg-neutral-200 rounded w-1/4 mb-4"></div>
            <div className="h-16 bg-neutral-100 rounded mb-4"></div>
            <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-20 text-neutral-500">
        <div className="inline-block p-4 rounded-full bg-neutral-100 mb-4">
           <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>
        </div>
        <p className="text-lg font-medium text-neutral-900">No history yet</p>
        <p className="text-sm">Analyze some code to see it here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-neutral-900 mb-2">Analysis History</h2>
      {history.map((item) => (
        <div 
          key={item.id} 
          className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
        >
          <div 
            className="p-5 cursor-pointer flex items-center justify-between bg-neutral-50/50"
            onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
                {item.mode}
              </span>
              <span className="text-sm text-neutral-900 font-mono truncate max-w-md">
                {item.codeSnippet.substring(0, 60)}...
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-neutral-400">
               <span>{new Date(item.timestamp).toLocaleDateString()}</span>
               <svg 
                 className={`w-5 h-5 transition-transform ${expandedId === item.id ? 'rotate-180' : ''}`} 
                 fill="none" 
                 stroke="currentColor" 
                 viewBox="0 0 24 24"
               >
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
               </svg>
            </div>
          </div>
          
          {expandedId === item.id && (
            <div className="p-6 border-t border-neutral-100 flex flex-col gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
              <div>
                <h4 className="text-xs font-semibold text-neutral-500 mb-2">CODE</h4>
                <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg text-sm overflow-x-auto font-mono">
                  {item.codeSnippet}
                </pre>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-neutral-500 mb-2">ANALYSIS</h4>
                <div className="prose prose-sm prose-neutral max-w-none bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                  <ReactMarkdown>{item.response}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
