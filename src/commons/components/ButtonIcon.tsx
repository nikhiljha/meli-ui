import React from 'react';
import classNames from 'classnames';
import styles from './ButtonIcon.module.scss';

export function ButtonIcon({
  children, className, onClick, ...props
}: {
  children: any;
  className?: string;
  onClick?: (ev) => void;
  [props: string]: any;
}) {
  return (
    <div
      className={classNames(styles.container, className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
