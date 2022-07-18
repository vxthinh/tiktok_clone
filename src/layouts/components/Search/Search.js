import { useState, useEffect, useRef } from 'react';
import HeadlessTippy from '@tippyjs/react/headless';
import { faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';

import { Wrapper as PopperWrapper } from '~/components/Popper';
import AccountItem from '~/components/AccountItem';
import { SearchIcon } from '~/components/Icons';
import { useDebounce } from '~/hook';
import styles from './Search.module.scss';
import * as searchServices from '~/Services/searchService';

const cx = classNames.bind(styles);

function Search() {
  //STATE
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  //Custom hook
  const debouncedValue = useDebounce(searchValue, 500);
  //REF
  const inputRef = useRef();

  useEffect(() => {
    if (!debouncedValue.trim()) {
      setSearchResult([]);
      return;
    }

    // fetch(`https://tiktok.fullstack.edu.vn/api/users/search?q=${encodeURIComponent(debouncedValue)}&type=less`)
    //   .then((res) => res.json())
    //   .then((res) => {
    //     setSearchResult(res.data);
    //     setLoading(false);
    //   })

    const fetchApi = async () => {
      setLoading(true);

      const result = await searchServices.search(debouncedValue);

      setSearchResult(result);
      setLoading(false);
    };

    fetchApi();
  }, [debouncedValue]);

  const handleHideResult = () => {
    setShowResult(false);
  };

  // Handle input
  const handleChange = (e) => {
    const searchValue = e.target.value;

    if (!searchValue.startsWith(' ')) {
      setSearchValue(searchValue);
    }
  };

  return (
    // Using a wrapper <div>  tag around the reference element solves this by creating a new parentNode context(Solve Warning Tippy)
    <div>
      <HeadlessTippy
        interactive
        visible={showResult && searchResult.length > 0}
        render={(attrs) => (
          <div className={cx('search-result')} tabIndex="-1" {...attrs}>
            <PopperWrapper>
              <h4 className={cx('search-title')}>Accounts</h4>
              {searchResult.map((result) => (
                <AccountItem key={result.id} data={result} />
              ))}
            </PopperWrapper>
          </div>
        )}
        onClickOutside={handleHideResult}
      >
        <div className={cx('searchContain')}>
          <input
            placeholder="Search accounts and videos"
            spellCheck={false}
            ref={inputRef}
            value={searchValue}
            onChange={handleChange}
            onFocus={() => setShowResult(true)}
          />
          {!!searchValue && !loading && (
            <button
              className={cx('clear')}
              onClick={(e) => {
                setSearchValue('');
                inputRef.current.focus();
              }}
            >
              <FontAwesomeIcon icon={faCircleXmark} />
            </button>
          )}
          {loading && <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />}
          <button className={cx('search-btn')} onMouseDown={(e) => e.preventDefault()}>
            <SearchIcon />
          </button>
        </div>
      </HeadlessTippy>
    </div>
  );
}

export default Search;
