import styled from 'styled-components';

function HeaderTop() {
  return (
    <Container>
        <h3>Cas contact</h3>
    </Container>
  )
}

export default HeaderTop;

const Container = styled.header`
  display: flex;
  flex-direction: column;
  width: 100vw;
  background-color: lightgray;
  justify-content: center;
  padding: 20px;

  h3 {
    margin: 0;
    font-size: 24px;
    color: #333;
  }
`;

