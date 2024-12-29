import { useEffect, useRef, useState, useCallback } from 'react';

export default function LatexConverter() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            workerRef.current = new Worker(
                new URL('../workers/latex-worker.ts', import.meta.url),
                { type: 'module' }
            );

            workerRef.current.onmessage = (e) => {
                setIsProcessing(false);
                if (e.data.success) {
                    setOutput(e.data.result);
                    setError(null);
                } else {
                    setError(e.data.error);
                }
            };

            return () => workerRef.current?.terminate();
        }
    }, []);

    const handleConvert = useCallback(() => {
        if (!input.trim() || !workerRef.current) return;

        setError(null);
        setIsProcessing(true);
        workerRef.current.postMessage({
            type: 'single',
            data: input
        });
    }, [input]);

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        LaTeX Input
                    </label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full h-32 p-2 border rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter LaTeX equation (e.g., $x^2 + y^2 = z^2$)"
                    />
                </div>

                <button
                    onClick={handleConvert}
                    disabled={isProcessing || !input.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition"
                >
                    {isProcessing ? 'Converting...' : 'Convert'}
                </button>

                {error && (
                    <div className="p-4 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {output && (
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Typst Output
                        </label>
                        <textarea
                            value={output}
                            readOnly
                            className="w-full h-32 p-2 border rounded font-mono text-sm bg-gray-50"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}