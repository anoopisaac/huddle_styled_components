import { StyledCard } from './styles/Card.styled'
import { Styler } from './styles/Grid.styled'


export default function Card({ item: { id, title, body, image } }) {
  return (
    <StyledCard layout={id % 2 === 0 && 'row-reverse'}>
      <div>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
      <Styler className="hello" gtr="200px 100px">
        <div>ewrer</div>
        <div>333</div>
      </Styler>
      <div>
        <img src={`./images/${image}`} alt='' />
      </div>
    </StyledCard>
  )
}
