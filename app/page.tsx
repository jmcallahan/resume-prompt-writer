'use client';

import { useState } from 'react';

export default function Home() {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult('');

    const prompt = `
Create a tailored resume prompt based on the following information.

Job Title:
${jobTitle}

Job Description:
${jobDescription}

Current Resume / Background:
${resumeText}
    `.trim();

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResult(data.error || 'Something went wrong.');
      } else {
        setResult(data.text || '');
      }
    } catch {
      setResult('Request failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Resume Prompt Writer</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Job Title</label>
          <input
            className="w-full border rounded p-3"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="SOC Analyst"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Job Description</label>
          <textarea
            className="w-full border rounded p-3 min-h-[180px]"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Current Resume / Background</label>
          <textarea
            className="w-full border rounded p-3 min-h-[180px]"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your current resume or background notes here"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 rounded bg-black text-white disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Resume Prompt'}
        </button>
      </form>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-3">Output</h2>
        <textarea
          className="w-full border rounded p-3 min-h-[220px]"
          value={result}
          readOnly
          placeholder="Generated prompt will appear here"
        />
      </section>
    </main>
  );
}