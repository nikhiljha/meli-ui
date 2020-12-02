import React from 'react';
import classNames from 'classnames';
import styles from './Bubble.module.scss';

export function Bubble({ color, className }: {
  color: string;
  className?: any;
}) {
  return (
    <div
      style={{
        background: color,
      }}
      className={classNames(styles.icon, className)}
    />
  );
}
