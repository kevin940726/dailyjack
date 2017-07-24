import styled from 'emotion/react';
import Section from '../../components/Section';

const Wrapper = styled(Section)`
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 350px;
  padding: 40px 0px;
  border-radius: 4px;
  background-color: #FFFFFF;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);

  @media screen and (max-width: 640px) {
    width: 300px;
  }
`;

export default Wrapper;
