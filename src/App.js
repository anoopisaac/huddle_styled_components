import { ThemeProvider } from 'styled-components'
// import Header from './components/Header'
// import Footer from './components/Footer'
// import Card from './components/Card'
// import { Container } from './components/styles/Container.styled'
// import GlobalStyles from './components/styles/Global'
// import content from './content'
import { Todo } from './components/Todo1'
import { SideBar } from './components/SideBar'
import { initState } from './StateService'
import { useState,useEffect } from 'react'
const theme = {
  colors: {
    header: '#ebfbff',
    body: '#fff',
    footer: '#003333',
  },
  mobile: '768px',
}

// function App() {
//   return (
//     <ThemeProvider theme={theme}>
//       <>
//         <GlobalStyles />
//         <Header />
//         <Todo/>
//         <Container>
//           {content.map((item, index) => (
//             <Card key={index} item={item} />
//           ))}
//         </Container>
//         <Footer />
//       </>
//     </ThemeProvider>
//   )
// }

function App() {

  useEffect(() => {
    initState();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <>
        <SideBar></SideBar>
        <Todo/>
      </>
    </ThemeProvider>
  )
}

export default App
