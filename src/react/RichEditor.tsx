import React, { useState, useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

interface Prompt {
  id: string;
  prompt_text: string;
  source: string;
  year: number;
}

export default function CollegeEssayEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [applicationType, setApplicationType] = useState('commonapp');
  const [targetMajor, setTargetMajor] = useState('');
  const [targetProgram, setTargetProgram] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [status, setStatus] = useState('');
  const [ai, setAi] = useState('');
  
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ 
        placeholder: 'Start writing your college essay here...\n\nRemember to:\n• Show your authentic voice and personality\n• Tell a compelling story\n• Connect to your future goals\n• Stay within word limits\n• Revise and polish your writing' 
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setContent(editor.getText());
    },
  });

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const response = await fetch('/api/essays/prompts?source=commonapp');
      const data = await response.json();
      if (response.ok) {
        setPrompts(data.prompts || []);
      }
    } catch (error) {
      console.error('Failed to fetch prompts:', error);
    }
  };

  const handlePromptChange = (promptId: string) => {
    setSelectedPrompt(promptId);
    const prompt = prompts.find(p => p.id === promptId);
    if (prompt) {
      setCustomPrompt(prompt.prompt_text);
    }
  };

  const wordCount = content.trim().split(/\s+/).length;
  const isOverLimit = wordCount > 650; // Common App limit

  async function save() {
    if (!title.trim()) {
      setStatus('Please enter a title for your essay');
      return;
    }

    if (!content.trim()) {
      setStatus('Please write some content for your essay');
      return;
    }

    setLoading(true);
    setStatus('Saving...');

    try {
      const response = await fetch('/api/essays', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          prompt: customPrompt,
          applicationType,
          targetMajor,
          targetProgram,
          isPublic
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus(`✅ Essay saved successfully! Word count: ${wordCount}`);
        // Clear form after successful save
        setTitle('');
        setContent('');
        setSelectedPrompt('');
        setCustomPrompt('');
        setTargetMajor('');
        setTargetProgram('');
        if (editor) {
          editor.commands.setContent('');
        }
      } else {
        setStatus(`❌ Error: ${data.error || 'Failed to save essay'}`);
      }
    } catch (error) {
      console.error('Save error:', error);
      setStatus('❌ Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function analyze() {
    if (!content.trim()) {
      setAi('Please write some content before analyzing');
      return;
    }

    setAi('🤖 Analyzing your college essay...');
    
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.success) {
          setAi(`${data.analysis}\n\n🤖 Analysis powered by: ${data.model_used}`);
        } else {
          setAi(`${data.analysis}\n\n⚠️ Note: ${data.note}`);
        }
      } else {
        setAi(`❌ AI Analysis Error: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('AI analysis error:', error);
      setAi('❌ Network error. Please try again.');
    }
  }

  return (
    <div className="space-y-6">
      {/* Essay Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Essay Title *
        </label>
        <input 
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Example: UPenn Engineering Supplemental Essay"
          required
        />
      </div>

      {/* Application Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Application Type
        </label>
        <select
          value={applicationType}
          onChange={(e) => setApplicationType(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="commonapp">Common App Personal Statement</option>
          <option value="college">College-Specific Essay</option>
          <option value="supplemental">Supplemental Essay</option>
          <option value="scholarship">Scholarship Essay</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Prompt Selection */}
      {applicationType === 'commonapp' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Common App Prompt
          </label>
          <select
            value={selectedPrompt}
            onChange={(e) => handlePromptChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a Common App prompt</option>
            {prompts.map((prompt) => (
              <option key={prompt.id} value={prompt.id}>
                Prompt {prompt.id.split('-')[1]}: {prompt.prompt_text.substring(0, 100)}...
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Custom Prompt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Essay Prompt *
        </label>
        <textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          placeholder="Paste the essay prompt here..."
          required
        />
      </div>

      {/* Target Major/Program */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Intended Major
          </label>
          <input
            type="text"
            value={targetMajor}
            onChange={(e) => setTargetMajor(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Computer Science"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Program/School
          </label>
          <input
            type="text"
            value={targetProgram}
            onChange={(e) => setTargetProgram(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Engineering"
          />
        </div>
      </div>

      {/* Essay Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Essay Content *
        </label>
        <div className="border border-gray-300 rounded-lg bg-white p-4 min-h-[400px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
          <EditorContent editor={editor} className="prose prose-lg max-w-none" />
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm text-gray-500">
            💡 Use <strong>**bold**</strong> for emphasis, create lists, and structure your writing clearly
          </p>
          <div className={`text-sm font-medium ${isOverLimit ? 'text-red-600' : 'text-gray-600'}`}>
            {wordCount} / 650 words
            {isOverLimit && <span className="ml-1">⚠️ Over limit</span>}
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Make essay public for peer review
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <button
          className="btn btn-primary px-6 py-3 text-base"
          onClick={save}
          disabled={loading}
        >
          {loading ? '💾 Saving...' : '💾 Save Essay'}
        </button>
        <button
          className="btn btn-secondary px-6 py-3 text-base"
          onClick={analyze}
        >
          🤖 AI Analysis
        </button>
        <span className="text-sm text-gray-600">{status}</span>
      </div>

      {/* AI Analysis Results */}
      {ai && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            🤖 AI Analysis Results
          </h3>
          <div className="bg-white rounded-lg p-4 border">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">{ai}</pre>
          </div>
          {ai.includes('🤖 Analysis powered by:') && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                ✅ AI analysis completed successfully using advanced language models
              </p>
            </div>
          )}
          {ai.includes('⚠️ Note:') && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700">
                ⚠️ AI models temporarily unavailable - showing enhanced fallback analysis
              </p>
            </div>
          )}
        </div>
      )}

      {/* Writing Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">📝 College Essay Writing Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Show, don't tell:</strong> Use specific examples and stories</li>
          <li>• <strong>Be authentic:</strong> Write in your own voice</li>
          <li>• <strong>Connect to future:</strong> Link your story to your goals</li>
          <li>• <strong>Stay within limits:</strong> Common App limit is 650 words</li>
          <li>• <strong>Revise thoroughly:</strong> Get feedback and polish your writing</li>
        </ul>
      </div>
    </div>
  );
}



