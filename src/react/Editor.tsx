import React, { useState } from 'react';

export default function Editor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [status, setStatus] = useState<string>('');

  async function saveDraft() {
    setStatus('Saving...');
    const res = await fetch('/api/essays', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, isPublic }),
    });
    if (res.status === 401) {
      setStatus('Please log in (use Dev Login below)');
      return;
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setStatus(`Error: ${err.error || 'Failed to save'}`);
      return;
    }
    const data = await res.json();
    setStatus(`Saved! Essay #${data.essay.id.slice(0, 6)}`);
  }

  return (
    <div className="rounded-xl border border-zinc-200/60 p-4 bg-white">
      <div className="grid gap-3">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full min-h-[320px] border rounded px-3 py-2 outline-none resize-vertical"
          placeholder="Start writing your essay here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
          Make public
        </label>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button onClick={saveDraft} className="btn">Save Draft</button>
        <span className="text-sm opacity-70">{status}</span>
      </div>
    </div>
  );
}


