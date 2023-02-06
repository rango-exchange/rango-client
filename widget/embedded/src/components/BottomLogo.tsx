import React from 'react';
import { styled } from '@rangodev/ui/src/theme';
import { Typography } from '@rangodev/ui';

const Container = styled('div', {
  display: 'flex',
  width: '100%',
  justifyContent: 'end',
  alignItems: 'center',
  paddingTop: '$16',
});

const Logo = styled('svg', {
  fill: '$foreground',
  width: '$24',
  margin: '0 $8 0 $16',
});

const StyledAnchor = styled('a', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textDecoration: 'none',
});

export function BottomLogo() {
  return (
    <Container>
      <Typography variant="caption">Powered By</Typography>
      <StyledAnchor href="https://rango.exchange" target="_blank">
        <Logo xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33.68 29">
          <defs></defs>
          <g id="Layer_2" data-name="Layer 2">
            <g id="Layer_1-2" data-name="Layer 1">
              <path d="M33.68,18.05A17.93,17.93,0,0,0,28.34,5.29,18.31,18.31,0,0,0,15.45,0H13.54V7.41L6.07,0H.69L9.83,9.07H0V11A17.93,17.93,0,0,0,5.34,23.71,18.32,18.32,0,0,0,18.24,29h1.9V21.59l7.38,7.31h5.39l-9-9h9.82ZM17.37,16.16H12.49a1.93,1.93,0,0,0-1.35.55,1.89,1.89,0,0,0-.56,1.34,1.85,1.85,0,0,0,.56,1.33,1.93,1.93,0,0,0,1.35.55h3.84V25.1A14.43,14.43,0,0,1,8,21a14.21,14.21,0,0,1-4.1-8.2H21.2a1.86,1.86,0,0,0,.74-.13,1.92,1.92,0,0,0,.64-.4,2,2,0,0,0,.43-.62,1.88,1.88,0,0,0,0-1.47,2,2,0,0,0-.43-.62,1.92,1.92,0,0,0-.64-.4,1.86,1.86,0,0,0-.74-.13H17.35V3.9A14.43,14.43,0,0,1,25.64,8a14.19,14.19,0,0,1,4.11,8.2Zm2.12-5.27a1.43,1.43,0,0,1,.26-.83,1.52,1.52,0,0,1,.67-.56,1.55,1.55,0,0,1,.88-.08,1.51,1.51,0,0,1,.77.4,1.54,1.54,0,0,1,.42.77,1.41,1.41,0,0,1-.09.86,1.47,1.47,0,0,1-.55.68,1.56,1.56,0,0,1-.84.25,1.52,1.52,0,0,1-1.52-1.49Z" />
              <path d="M21.7,11.57a.68.68,0,0,0-.12-.38.64.64,0,0,0-.31-.25.68.68,0,0,0-.75.15.61.61,0,0,0-.19.35.62.62,0,0,0,0,.4.67.67,0,0,0,.25.3.69.69,0,0,0,.39.12.7.7,0,0,0,.49-.2A.68.68,0,0,0,21.7,11.57Z" />
            </g>
          </g>
        </Logo>
        <Typography variant="body2">RANGO</Typography>
      </StyledAnchor>
    </Container>
  );
}
