import React, { useRef, useState } from 'react';
import styled from '@emotion/styled';
import SearchIcon from '@mui/icons-material/Search';
import { CircularProgress, IconButton } from '@mui/material';
import Router from 'next/router';
import { useFeatureContext } from '../utils/FeatureContext';
import { AutocompleteInput } from './AutocompleteInput';
import { t } from '../../services/intl';
import { ClosePanelButton } from '../utils/ClosePanelButton';
import { useMobileMode } from '../helpers';
import { HamburgerMenu } from '../Map/TopMenu/HamburgerMenu';
import { UserMenu } from '../Map/TopMenu/UserMenu';
import { DirectionsButton } from '../Directions/DirectionsButton';
import { StyledPaper, TopPanel } from './helpers';
import { setLastFeature } from '../../services/lastFeatureStorage';

const SearchIconButton = styled(IconButton)`
  svg {
    transform: scaleX(-1);
    filter: FlipH;
    -ms-filter: 'FlipH';
  }
`;

const OverpassCircularProgress = styled(CircularProgress)`
  padding: 10px;
`;

// https://docs.mapbox.com/help/troubleshooting/working-with-large-geojson-data/

const useOnClosePanel = () => {
  const { setFeature } = useFeatureContext();

  return () => {
    setFeature(null);
    Router.push(`/${window.location.hash}`);
    setLastFeature(null);
  };
};

const SearchBox = () => {
  const isMobileMode = useMobileMode();
  const { featureShown } = useFeatureContext();
  const [overpassLoading, setOverpassLoading] = useState(false);
  const autocompleteRef = useRef();
  const onClosePanel = useOnClosePanel();

  return (
    <TopPanel $isMobileMode={isMobileMode}>
      <StyledPaper elevation={1} ref={autocompleteRef}>
        <SearchIconButton disabled aria-label={t('searchbox.placeholder')}>
          <SearchIcon />
        </SearchIconButton>

        <AutocompleteInput
          autocompleteRef={autocompleteRef}
          setOverpassLoading={setOverpassLoading}
        />

        {overpassLoading && <OverpassCircularProgress />}
        {!isMobileMode && featureShown && (
          <ClosePanelButton onClick={onClosePanel} />
        )}
        {isMobileMode && (
          <>
            <UserMenu />
            <HamburgerMenu />
          </>
        )}

        <DirectionsButton />
      </StyledPaper>
    </TopPanel>
  );
};

export default SearchBox;
