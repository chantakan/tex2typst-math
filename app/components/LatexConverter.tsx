import React, { useEffect, useRef, useState, useCallback } from 'react';
import { $typst } from '@myriaddreamin/typst.ts/dist/esm/contrib/snippet.mjs';

// WorkerMessageEventの型定義
type WorkerMessage = {
    success: boolean;
    result?: string;
    error?: string;
};

// Workerのイベントの型定義
interface CustomWorkerMessage {
    data: WorkerMessage;
}

const ClipboardIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
);

const LatexTypstConverter = () => {
    const [latexInput, setLatexInput] = useState('');
    const [typstOutput, setTypstOutput] = useState('');
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [svg, setSvg] = useState('');
    const [typstLoading, setTypstLoading] = useState(true);
    const [copySuccess, setCopySuccess] = useState(false);
    const [previewScale, setPreviewScale] = useState(3.0);
    const workerRef = useRef<Worker | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const previewContainerRef = useRef<HTMLDivElement | null>(null);

    // 初期化処理
    useEffect(() => {
        const initTypst = async () => {
            try {
                await $typst.setCompilerInitOptions({
                    getModule: () => '/vendor/typst/typst_ts_web_compiler_bg.wasm',
                });
                await $typst.setRendererInitOptions({
                    getModule: () => '/vendor/typst/typst_ts_renderer_bg.wasm',
                });
                setTypstLoading(false);
            } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : 'Failed to initialize Typst');
                setTypstLoading(false);
            }
        };

        initTypst();
    }, []);

    // Web Worker初期化
    useEffect(() => {
        if (typeof window !== 'undefined') {
            workerRef.current = new Worker(
                new URL('../workers/latex-worker.ts', import.meta.url),
                { type: 'module' }
            );

            workerRef.current.onmessage = (e: CustomWorkerMessage) => {
                setIsProcessing(false);
                if (e.data.success) {
                    setTypstOutput(e.data.result || '');
                    renderTypst(e.data.result || '');
                    setError('');
                } else {
                    setError(e.data.error || 'Unknown error occurred');
                }
            };

            return () => {
                workerRef.current?.terminate();
            };
        }
    }, []);

    // SVGサイズとスケール調整
    const adjustSvgSize = useCallback(() => {
        const container = contentRef.current;
        const previewContainer = previewContainerRef.current;
        if (!container || !previewContainer) return;

        const svgElem = container.querySelector('svg');
        if (!svgElem) return;

        const typstGroup = svgElem.querySelector('.typst-group') as SVGGElement;
        if (!typstGroup) return;

        const bbox = typstGroup.getBBox();
        const padding = 20;

        // バウンディングボックスの調整
        bbox.y -= 10;
        bbox.height += 20;

        svgElem.setAttribute(
            'viewBox',
            `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + padding * 2} ${bbox.height + padding * 2}`
        );

        // コンテナの幅に基づいてスケールを計算
        const containerWidth = previewContainer.clientWidth;
        const desiredWidth = bbox.width + padding * 2;
        const newScale = Math.min(3.0, (containerWidth * 0.8) / desiredWidth);

        setPreviewScale(newScale);

        // SVGのサイズを設定
        svgElem.style.width = `${desiredWidth}px`;
        svgElem.style.height = `${bbox.height + padding * 2}px`;
    }, []);

    useEffect(() => {
        if (svg) {
            setTimeout(() => {
                adjustSvgSize();
                // プレビューコンテナのスクロール位置をリセット
                const container = contentRef.current?.parentElement;
                if (container) {
                    container.scrollTop = 0;
                }
            }, 0);
            // ウィンドウリサイズ時にも再調整
            window.addEventListener('resize', adjustSvgSize);
            return () => window.removeEventListener('resize', adjustSvgSize);
        }
    }, [svg, adjustSvgSize]);

    const renderTypst = async (text: string) => {
        if (!text) {
            setSvg('');
            return;
        }

        try {
            const result = await $typst.svg({
                mainContent: `$ ${text} $`
            });
            setSvg(result);
            setError('');
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Failed to render Typst document');
        }
    };

    const handleConvert = useCallback(() => {
        if (!latexInput.trim() || !workerRef.current) return;
        setError('');
        setIsProcessing(true);
        workerRef.current.postMessage({
            type: 'single',
            data: latexInput
        });
    }, [latexInput]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(typstOutput);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
            setError('Failed to copy to clipboard');
        }
    };

    // 残りのJSX部分は変更なし
    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <div className="grid gap-4">
                {/* 上部：プレビュー */}
                <div className="w-full" ref={previewContainerRef}>
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-lg font-semibold mb-4">Preview</h2>
                        <div className="relative min-h-[200px] max-h-[400px] p-4 overflow-auto">
                            {typstLoading && (
                                <div className="text-gray-500">Loading Typst...</div>
                            )}
                            {!typstLoading && !error && (
                                <div
                                    ref={contentRef}
                                    className="absolute left-1/2 top-4 transition-transform duration-200"
                                    style={{
                                        transform: `translateX(-50%) scale(${previewScale})`,
                                        transformOrigin: 'top center'
                                    }}
                                    dangerouslySetInnerHTML={{ __html: svg }}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* 下部：入力と出力 */}
                <div className="grid grid-cols-2 gap-4">
                    {/* 左下：LaTeX入力 */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex flex-col h-64">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">LaTeX Input</h2>
                                <button
                                    onClick={handleConvert}
                                    disabled={isProcessing || !latexInput.trim() || typstLoading}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition"
                                >
                                    {isProcessing ? 'Converting...' : 'Convert'}
                                </button>
                            </div>
                            <textarea
                                value={latexInput}
                                onChange={(e) => setLatexInput(e.target.value)}
                                className="flex-grow w-full p-2 border rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter LaTeX equation (e.g., $x^2 + y^2 = z^2$)"
                            />
                        </div>
                    </div>

                    {/* 右下：Typst出力 */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex flex-col h-64">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">Typst Output</h2>
                                <button
                                    onClick={handleCopy}
                                    disabled={!typstOutput}
                                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 transition flex items-center gap-2"
                                >
                                    <ClipboardIcon />
                                    {copySuccess ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                            <textarea
                                value={typstOutput}
                                readOnly
                                className="flex-grow w-full p-2 border rounded font-mono text-sm bg-gray-50"
                            />
                        </div>
                    </div>
                </div>

                {/* エラー表示 */}
                {error && (
                    <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LatexTypstConverter;