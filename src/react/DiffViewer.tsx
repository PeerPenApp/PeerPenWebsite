import React from 'react';
import DiffMatchPatch from 'diff-match-patch';

export default function DiffViewer({ oldText, newText }: { oldText: string; newText: string }) {
  const dmp = new DiffMatchPatch();
  const diffs = dmp.diff_main(oldText, newText);
  dmp.diff_cleanupSemantic(diffs);

  return (
    <div className="rounded-xl border bg-white p-3">
      {diffs.map((d, i) => {
        const [op, text] = d;
        let className = '';
        if (op === DiffMatchPatch.DIFF_INSERT) className = 'bg-green-100';
        if (op === DiffMatchPatch.DIFF_DELETE) className = 'bg-red-100 line-through';
        return (
          <span key={i} className={className}>{text}</span>
        );
      })}
    </div>
  );
}





