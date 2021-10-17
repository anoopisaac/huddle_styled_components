import styled from 'styled-components'

export const Styler: any = styled.div`
  font-family: 'Roboto', sans-serif;
  ${(props: any) => {
    const cssList: string[] = [];
    Object.keys(props).forEach(key => {
      if (["gtr", "gtc", "gar", "gac"].indexOf(key) > -1) {
        cssList.push(`display:grid;`)
      }
      if (key === "gac") {
        cssList.push(`grid-auto-flow:column;`)
      }
      if (key === "circle") {
        cssList.push(
          `border-radius: 50%;
            width: 10px;
            height: 10px;
            background:${props[key]};
            `
        )
      }
      if (key === "task") {
        cssList.push(
          `border-radius: 5px;
            border:solid 1px red;
            `
        )
      }
      if (props[key] !== undefined && styleDic[key] !== undefined) {
        cssList.push(`${styleDic[key]}:${props[key]};`)
      }
    })
    return cssList.join("");
    // return `${styleDic[mb] ? `margin:${gac};grid-auto-flow:column;` : ``}`
  }}

  @media (max-width: ${({ theme }) => theme.mobile}) {
    flex-direction: column;
    text-align: center;
  }
`


const styleDic: any = {
  d: "display",
  mb: "margin-bottom",
  gtr: "grid-template-rows",
  gtc: "grid-template-columns",
  gac: "grid-auto-columns",
  gar: "grid-auto-rows",
  gaf: "grid-auto-flow",
  fs: "font-size",
  als: "align-self",
  jus: "justify-self",
  cg: "column-gap",
  rg: "row-gap",
  br: "border-radius",
  p: "padding",
  bdr: "border",
  bb: "border-bottom",
  ai: "align-items"
}


// ${({ gtc }) => {
//   return `${gtc ? `grid-template-columns:${gtc};` : ``}`
// }}
// ${({ gar }) => {
//   return `${gar ? `grid-auto-rows:${gar};` : ``}`
// }}
// ${({ gac }) => {
//   return `${gac ? `grid-auto-columns:${gac};grid-auto-flow:column;` : ``}`
// }}

