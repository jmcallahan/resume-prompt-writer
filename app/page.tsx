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
      setResult(res.ok ? (data.text || '') : (data.error || 'Something went wrong.'));
    } catch {
      setResult('Request failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-5xl rounded-xl border border-[var(--border)] bg-[var(--panel-2)] p-6 shadow-lg">
        <h1 className="mb-2 text-3xl font-bold text-[var(--accent)]">
          Resume Prompt Writer
        </h1>
        <p className="mb-6 text-[var(--muted)]">
          Build a tailored resume prompt from a target role, job description, and your background.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block font-medium text-[var(--accent-2)]">
              Job Title
            </label>
            <input
              className="w-full rounded-md px-3 py-3 outline-none"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="SOC Analyst"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-[var(--accent-2)]">
              Job Description
            </label>
            <textarea
              className="min-h-[180px] w-full rounded-md px-3 py-3 outline-none"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-[var(--accent-2)]">
              Current Resume / Background
            </label>
            <textarea
              className="min-h-[180px] w-full rounded-md px-3 py-3 outline-none"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume or background notes here"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-md px-5 py-3 font-semibold"
          >
            {loading ? 'Generating...' : 'Generate Resume Prompt'}
          </button>
        </form>

        <section className="mt-8">
          <h2 className="mb-3 text-2xl font-semibold text-[var(--warning)]">
            Output
          </h2>
          <textarea
            className="min-h-[240px] w-full rounded-md px-3 py-3 outline-none"
            value={result}
            readOnly
            placeholder="Generated prompt will appear here"
          />
        </section>
      </div>
    </main>
  );
}
