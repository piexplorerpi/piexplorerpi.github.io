import React, { useEffect, useState, useCallback } from 'react';
import './Poll.css';
import { useTranslate } from '../i18n/useTranslate';
import { pollTranslations } from '../i18n/translations/poll';
import { digTranslations } from '../i18n/translations/dig'; // مهاجرت به هوک جدید
import { useAuth } from '../context/AuthContext';

interface Votes {
  yes: number;
  no: number;
  total: number;
  yesPercent: number;
  noPercent: number;
}

interface PollData {
  id?: number | string;
  pollId?: string;
  question?: string;
  questionFa?: string;
  questionEn?: string;
  questionTr?: string;
  questionZh?: string;
  questionHi?: string;
  questionAr?: string;
}

interface UserVote {
  option: 'yes' | 'no';
  createdAt: string;
}

interface HistoryItem {
  id: number;
  question_snapshot: string;
  username: string;
  vote_option: 'yes' | 'no';
  created_at: string;
}

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://piexplorer.bonto.run/api').replace(/\/+$/, '');

const Poll: React.FC = () => {
  const { t, lang } = useTranslate(); // استفاده از هوک جدید
  const auth = useAuth();

  const [loading, setLoading] = useState<boolean>(true);
  const [voting, setVoting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const [votes, setVotes] = useState<Votes>({
    yes: 0,
    no: 0,
    total: 0,
    yesPercent: 0,
    noPercent: 0,
  });

  const [pollData, setPollData] = useState<PollData | null>(null);
  const [userVote, setUserVote] = useState<UserVote | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const textAlign = lang === 'fa' || lang === 'ar' ? 'right' : 'left';

  const getToken = (): string | null => localStorage.getItem('token');

  const normalizePoll = (raw: any): PollData | null => {
    if (!raw || typeof raw !== 'object') return null;
    // Support both camelCase (API) and snake_case
    return {
      id: raw.id,
      pollId: raw.pollId || raw.poll_id,
      question: raw.question || raw.questionEn || raw.question_en || '',
      questionFa: raw.questionFa || raw.question_fa || '',
      questionEn: raw.questionEn || raw.question_en || raw.question || '',
      questionTr: raw.questionTr || raw.question_tr || '',
      questionZh: raw.questionZh || raw.question_zh || '',
      questionHi: raw.questionHi || raw.question_hi || '',
      questionAr: raw.questionAr || raw.question_ar || '',
    };
  };

  const getLocalizedQuestion = useCallback(() => {
    if (!pollData) return t(pollTranslations.pollQuestion);

    const langMap: Record<string, string | undefined> = {
      fa: pollData.questionFa,
      en: pollData.questionEn,
      tr: pollData.questionTr,
      zh: pollData.questionZh,
      hi: pollData.questionHi,
      ar: pollData.questionAr,
    };

    // Prefer language-specific text; for English prefer questionEn over legacy question
    const localized = (langMap[lang] || '').trim();
    if (localized) return localized;

    const en = (pollData.questionEn || '').trim();
    if (en) return en;

    const fallback = (pollData.question || '').trim();
    if (fallback) return fallback;

    return t(pollTranslations.pollQuestion);
  }, [lang, pollData, t]);

  const maskUsername = (username: string): string => {
    if (!username) return '@Pi***';
    const clean = String(username).replace(/^@/, '').trim();
    if (!clean) return '@Pi***';
    if (clean.length <= 2) return `@${clean[0] || 'P'}***`;
    if (clean.length <= 5) return `@${clean.slice(0, 2)}***`;
    const visiblePart = clean.slice(0, Math.min(4, clean.length - 2));
    const hiddenLength = Math.max(3, clean.length - visiblePart.length);
    return `@${visiblePart}${'*'.repeat(hiddenLength)}`;
  };

  const fetchPoll = async () => {
    try {
      setLoading(true);
      setError('');
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/poll/current`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || t(pollTranslations.pollConnectionError));
      }
      setVotes(data.data.votes);
      setUserVote(data.data.userVote);
      setPollData(normalizePoll(data.data.poll));
    } catch (err: any) {
      setError(err.message || t(pollTranslations.pollConnectionError));
    } finally {
      setLoading(false);
    }
  };

  const fetchVoteHistory = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/poll/history`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setHistory(Array.isArray(data.data) ? data.data : []);
      }
    } catch (err) {
      console.warn('Vote history fetch error:', err);
    }
  };

  useEffect(() => {
    if (auth?.isAuthenticated && getToken()) {
      fetchPoll();
      fetchVoteHistory();
    }
  }, [auth?.isAuthenticated]);

  const handleVote = async (option: 'yes' | 'no') => {
    const token = getToken();
    if (!auth?.isAuthenticated || !token) {
      setMessage(t(pollTranslations.pollLoginRequired));
      return;
    }
    if (userVote) {
      setMessage(t(pollTranslations.pollAlreadyVoted));
      return;
    }
    try {
      setVoting(true);
      setError('');
      setMessage('');
      const response = await fetch(`${API_BASE_URL}/poll/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ option }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        if (response.status === 409 && data.data) {
          setVotes(data.data.votes);
          setUserVote(data.data.userVote);
          setPollData(normalizePoll(data.data.poll));
          setMessage(t(pollTranslations.pollAlreadyVoted));
          return;
        }
        throw new Error(data.message || t(pollTranslations.pollConnectionError));
      }
      setVotes(data.data.votes);
      setUserVote(data.data.userVote);
      setPollData(normalizePoll(data.data.poll));
      setMessage(t(pollTranslations.pollVoteSuccess));
      await fetchVoteHistory();
    } catch (err: any) {
      setError(err.message || t(pollTranslations.pollConnectionError));
    } finally {
      setVoting(false);
    }
  };

  const formatDate = useCallback((date: string) => {
    if (!date) return '';
    const locales: Record<string, string> = { fa: 'fa-IR', tr: 'tr-TR', zh: 'zh-CN', hi: 'hi-IN', ar: 'ar-SA' };
    return new Date(date).toLocaleString(locales[lang] || 'en-US');
  }, [lang]);

  if (loading) {
    return (
      <section id="poll" className="poll-section">
        <div className="poll-container">
          <div className="poll-badge">{t(digTranslations.digShortName)} · {t(pollTranslations.governance)}</div>
          <p className="poll-loading-text">{t(pollTranslations.pollLoading)}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="poll" className="poll-section">
      <div className="poll-container">
        <div className="poll-badge">{t(digTranslations.digShortName)} · {t(pollTranslations.governance)}</div>
        <h2 className="poll-question">{getLocalizedQuestion()}</h2>
        <p className="poll-description">{t(pollTranslations.pollDescription)}</p>
        <div className="poll-total">
          <span>{t(pollTranslations.totalVotes)}</span>
          <strong>{votes.total}</strong>
        </div>

        {!userVote ? (
          <div className="poll-options">
            <button className="poll-btn poll-btn-yes" onClick={() => handleVote('yes')} disabled={voting}>
              {voting ? t(pollTranslations.processing) : t(pollTranslations.pollYes)}
            </button>
            <button className="poll-btn poll-btn-no" onClick={() => handleVote('no')} disabled={voting}>
              {voting ? t(pollTranslations.processing) : t(pollTranslations.pollNo)}
            </button>
          </div>
        ) : (
          <div className="poll-user-vote">
            <div>{t(pollTranslations.yourVote)}: <strong>{userVote.option === 'yes' ? t(pollTranslations.yesLabel) : t(pollTranslations.noLabel)}</strong></div>
            <span>{t(pollTranslations.voteDate)}: {formatDate(userVote.createdAt)}</span>
          </div>
        )}

        {(message || error) && (
          <div className={error ? 'poll-alert poll-alert-error' : 'poll-alert'}>{error || message}</div>
        )}

        <div className="poll-results">
          <div className="poll-result-label" style={{ textAlign }}>
            <span>{t(pollTranslations.yesLabel)}</span>
            <strong>{votes.yesPercent}% ({votes.yes})</strong>
          </div>
          <div className="result-bar-container">
            <div className="result-bar result-bar-yes" style={{ width: `${votes.yesPercent}%` }}></div>
          </div>
          <div className="poll-result-label poll-result-label-no" style={{ textAlign }}>
            <span>{t(pollTranslations.noLabel)}</span>
            <strong>{votes.noPercent}% ({votes.no})</strong>
          </div>
          <div className="result-bar-container">
            <div className="result-bar result-bar-no" style={{ width: `${votes.noPercent}%` }}></div>
          </div>
        </div>

        {history.length > 0 && (
          <div className="poll-history" style={{ textAlign }}>
            <strong>{t(pollTranslations.voteHistory)}</strong>
            <ul>
              {history.map((item) => (
                <li key={item.id}>
                  {item.question_snapshot && <div className="poll-history-question">{item.question_snapshot}</div>}
                  <div className="poll-history-meta">
                    <span className="poll-history-user">{maskUsername(item.username)}</span>
                    <span className="poll-history-separator"> · </span>
                    <span>{item.vote_option === 'yes' ? t(pollTranslations.yesLabel) : t(pollTranslations.noLabel)}</span>
                    <span className="poll-history-separator"> - </span>
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default Poll;
