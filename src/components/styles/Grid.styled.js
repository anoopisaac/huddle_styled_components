import styled from 'styled-components'

export const Grid = styled.div`
  display: grid;
  align-items: center;
  ${({ gtr }) => {
    return `${gtr?`grid-template-rows:200px;`:``}`
  }}
  ${({ gta }) => {
    return `${gta?`grid-auto-rows:200px;`:``}`
  }}

  @media (max-width: ${({ theme }) => theme.mobile}) {
    flex-direction: column;
    text-align: center;
  }
`
