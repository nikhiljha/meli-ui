import ReactMarkdown from 'react-markdown';
import React, { useEffect, useState } from 'react';
import md from './privacy-policy.md';
import { axios } from '../../providers/axios';
import { Loader } from '../../commons/components/Loader';
import { AlertError } from '../../commons/components/AlertError';
import { useLoading } from '../../commons/hooks/use-loading';

export default function PrivacyPolicy() {
  const [loading, setLoading] = useLoading(true);
  const [error, setError] = useState();
  const [content, setContent] = useState();

  useEffect(() => {
    axios
      .get(md)
      .then(({ data }) => data)
      .then(setContent)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [setLoading]);

  return loading ? (
    <Loader />
  ) : error ? (
    <AlertError error={error} />
  ) : (
    <ReactMarkdown>{content}</ReactMarkdown>
  );
}
