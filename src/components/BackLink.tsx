import React from 'react';
import { styled } from '@mui/material/styles';
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps
} from 'react-router-dom';
import { Box, BoxProps, Button, ButtonProps } from '@mui/material';

// Note: This line is coming from claude.ai at this late hour (I was stumped, yet this helped)
type ButtonLinkProps = ButtonProps & RouterLinkProps;

// right-align the flex box so that button inside will be on the right
const BackBox = styled(Box)<BoxProps>(() => ({
  display: 'flex',
  justifyContent: 'flex-end'
}));

// Style the back button
const BackButton = styled(Button)<ButtonLinkProps>(() => ({
  color: '#559BF6',
  textTransform: 'none',
  padding: 0,
  fontSize: '1rem',
  fontWeight: 400,
  '&:hover': {
    color: '#96C1F9',
    background: 'none'
  }
}));

interface BackLinkProps {
  to: string;
  text?: string;
}

const BackLink: React.FC<BackLinkProps> = ({ to, text = 'Back' }) => {
  return (
    <BackBox>
      <BackButton variant='text' component={RouterLink} to={to}>
        {text}
      </BackButton>
    </BackBox>
  );
};

export default BackLink;
