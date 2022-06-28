import { forwardRef, useState } from 'react';
import classNames from 'classnames';
import styles from './Image.module.scss';
import noImage from '~/assets/images/no-image.png';

// console.log(noImage);

const Image = forwardRef(({ src, alt, className, fallback: customFallback = noImage, ...props }, ref) => {
  const [fallback, setFallBack] = useState('');
  // This func occurs when no image
  const handleError = () => {
    setFallBack(customFallback);
  };

  return (
    <img
      className={classNames(styles.wrapper, className)}
      ref={ref}
      src={fallback || src}
      alt={alt}
      {...props}
      onError={handleError}
    />
  );
});

export default Image;
