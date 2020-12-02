import { useFormContext } from 'react-hook-form';
import React from 'react';
import { maxLength, required } from '../../../../commons/components/forms/form-constants';
import { InputError } from '../../../../commons/components/forms/InputError';
import { ExternalLink } from '../../../../commons/components/ExternalLink';

export function Github() {
  const { register, errors } = useFormContext();
  const input_url = 'config.url';
  const input_token = 'config.token';
  return (
    <>
      <div className="form-group">
        <label
          htmlFor={input_token}
          className="form-label"
        >
          Github
          {' '}
          <ExternalLink
            href="https://github.com/settings/tokens"
          >
            token
          </ExternalLink>
          {' '}
          (must have the
          {' '}
          <code>repo</code>
          {' '}
          scope)
        </label>
        <input
          type="password"
          id={input_token}
          name={input_token}
          className="form-control"
          ref={register({
            required,
            maxLength: maxLength(),
          })}
        />
        <InputError error={errors} path={input_token} />
      </div>
      <div className="form-group">
        <label
          htmlFor={input_url}
          className="form-label"
        >
          Github Enterprise URL (optional)
        </label>
        <input
          type="text"
          id={input_url}
          name={input_url}
          className="form-control"
          ref={register({
            maxLength: maxLength(),
          })}
        />
        <InputError error={errors} path={input_url} />
      </div>
    </>
  );
}
