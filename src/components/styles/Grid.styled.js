import styled from 'styled-components'

export const Grid = styled.div`
  display: grid;
  align-items: center;
  ${({ gtr }) => {
    return `${gtr ? `grid-template-rows:${gtr};` : ``}`
  }}
  ${({ gar }) => {
    return `${gar ? `grid-auto-rows:${gar};` : ``}`
  }}
  ${({ gac }) => {
    return `${gac ? `grid-auto-columns:${gac};grid-auto-flow:column;` : ``}`
  }}

  @media (max-width: ${({ theme }) => theme.mobile}) {
    flex-direction: column;
    text-align: center;
  }
`
