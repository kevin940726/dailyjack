import styled from 'emotion/react';

const Section = styled.section`
  display: flex;
  width: 640px;
  margin: 0 auto;

  @media screen and (max-width: 640px) {
    width: 320px;
  }
`;

export default Section;
